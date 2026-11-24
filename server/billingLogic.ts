// Pure helpers for the 정산(입금) calendar. Kept free of DB/network code so
// they can be unit-tested without a Notion token or database.

export const NOTION_CONTRACT_DATA_SOURCE_ID = "26ef2ed8-4d17-815e-9167-000b66c861aa";

/** Notion property name → required Notion type for the 정기청소 계약관리 data source. */
export const CONTRACT_PROPERTIES = {
  name: { key: "고객명/업체명", type: "title" },
  fee: { key: "계약금액", type: "number" },
  dueDay: { key: "입금날짜", type: "number" },
  memo: { key: "고객_특이사항", type: "rich_text" },
} as const;

export type NotionProperty = {
  type: string;
  title?: { plain_text: string }[];
  rich_text?: { plain_text: string }[];
  number?: number | null;
};
export type NotionPage = {
  id: string;
  archived?: boolean;
  in_trash?: boolean;
  is_archived?: boolean;
  properties: Record<string, NotionProperty>;
};

/** Returns the property names whose type does not match what the sync expects. */
export function schemaProblems(properties: Record<string, { type: string }>): string[] {
  return Object.values(CONTRACT_PROPERTIES)
    .filter(({ key, type }) => properties[key]?.type !== type)
    .map(({ key, type }) => `${key}(${type === "rich_text" ? "텍스트" : type === "title" ? "제목" : "숫자"})`);
}

export type ParsedContract = {
  notionPageId: string;
  name: string;
  monthlyFee: number;
  dueDay: number | null;
  memo: string;
  problem?: string;
};

const plain = (parts?: { plain_text: string }[]) => (parts || []).map(p => p.plain_text).join("").trim();

export function isActivePage(page: NotionPage) {
  return !page.archived && !page.in_trash && !page.is_archived;
}

export function parseContract(page: NotionPage): ParsedContract {
  const p = page.properties;
  const name = plain(p[CONTRACT_PROPERTIES.name.key]?.title);
  const feeRaw = p[CONTRACT_PROPERTIES.fee.key]?.number;
  const dueRaw = p[CONTRACT_PROPERTIES.dueDay.key]?.number;
  const memo = plain(p[CONTRACT_PROPERTIES.memo.key]?.rich_text);
  const parsed: ParsedContract = {
    notionPageId: page.id,
    name,
    monthlyFee: typeof feeRaw === "number" && Number.isFinite(feeRaw) && feeRaw >= 0 ? Math.round(feeRaw) : 0,
    dueDay: null,
    memo,
  };
  if (dueRaw === null || dueRaw === undefined) return parsed;
  if (!Number.isInteger(dueRaw) || dueRaw < 1 || dueRaw > 31) {
    parsed.problem = `입금날짜 값(${dueRaw})이 1~31 사이 정수가 아니라 건너뛰었습니다.`;
    return parsed;
  }
  parsed.dueDay = dueRaw;
  if (!name) parsed.problem = "고객명/업체명이 비어 있어 건너뛰었습니다.";
  return parsed;
}

/** Day of month the payment is due, clamping 29–31 to the month's last day. */
export function dueDateFor(month: string, dueDay: number) {
  const [y, m] = month.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return Math.min(dueDay, last);
}

export function monthRange(month: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(month);
}

export type ExistingCustomer = { id: number; notionPageId: string | null; name: string; active: boolean };
export type SyncPlan = {
  inserts: ParsedContract[];
  updates: { id: number; data: ParsedContract; link: boolean }[];
  deactivate: { id: number; name: string; reason: string }[];
  skipped: { name: string; reason: string }[];
  conflicts: { name: string; reason: string }[];
};

/**
 * Decide what a sync should do. Never deletes: rows that vanish from Notion or
 * lose their 입금날짜 are only deactivated, so past monthly records stay.
 */
export function planSync(existing: ExistingCustomer[], pages: NotionPage[]): SyncPlan {
  const plan: SyncPlan = { inserts: [], updates: [], deactivate: [], skipped: [], conflicts: [] };
  const byNotion = new Map(existing.filter(c => c.notionPageId).map(c => [normalizeId(c.notionPageId!), c]));
  const unlinked = existing.filter(c => !c.notionPageId);
  const seen = new Set<string>();
  const claimed = new Set<number>();
  const active = pages.filter(isActivePage).map(parseContract);

  // Exact-name link candidates must be unambiguous on both sides.
  const notionNameCount = new Map<string, number>();
  for (const row of active) if (row.dueDay && !row.problem) notionNameCount.set(row.name, (notionNameCount.get(row.name) || 0) + 1);

  for (const row of active) {
    const pid = normalizeId(row.notionPageId);
    seen.add(pid);
    const linked = byNotion.get(pid);
    if (row.problem || row.dueDay === null) {
      const reason = row.problem || "입금날짜가 비어 있습니다.";
      if (linked) { if (linked.active) plan.deactivate.push({ id: linked.id, name: linked.name, reason }); }
      else if (row.problem) plan.skipped.push({ name: row.name || "(이름 없음)", reason });
      continue;
    }
    if (linked) { plan.updates.push({ id: linked.id, data: row, link: false }); claimed.add(linked.id); continue; }
    const sameName = unlinked.filter(c => c.name === row.name && !claimed.has(c.id));
    if (sameName.length === 1 && notionNameCount.get(row.name) === 1) {
      plan.updates.push({ id: sameName[0].id, data: row, link: true });
      claimed.add(sameName[0].id);
    } else if (sameName.length > 1 || (sameName.length === 1 && (notionNameCount.get(row.name) || 0) > 1)) {
      plan.conflicts.push({ name: row.name, reason: "같은 이름의 고객이 여러 명이라 자동 연결하지 않았습니다. 이름을 구분해 주세요." });
    } else {
      plan.inserts.push(row);
    }
  }
  for (const c of existing) {
    if (c.notionPageId && c.active && !seen.has(normalizeId(c.notionPageId))) {
      plan.deactivate.push({ id: c.id, name: c.name, reason: "노션 계약관리에서 찾을 수 없습니다(삭제·보관됨)." });
    }
  }
  return plan;
}

export function normalizeId(id: string) {
  return id.replace(/-/g, "").toLowerCase();
}
