import { describe, expect, it } from "vitest";
import { dueDateFor, parseContract, planSync, schemaProblems, type NotionPage } from "./billingLogic";

const page = (id: string, name: string, due: number | null, extra: Partial<NotionPage> = {}, fee: number | null = 100000): NotionPage => ({
  id,
  properties: {
    "고객명/업체명": { type: "title", title: name ? [{ plain_text: name }] : [] },
    계약금액: { type: "number", number: fee },
    입금날짜: { type: "number", number: due },
    고객_특이사항: { type: "rich_text", rich_text: [{ plain_text: "메모" }] },
  },
  ...extra,
});

describe("dueDateFor", () => {
  it("clamps 31 to the last day of short months", () => {
    expect(dueDateFor("2026-02", 31)).toBe(28);
    expect(dueDateFor("2028-02", 30)).toBe(29);
    expect(dueDateFor("2026-04", 31)).toBe(30);
    expect(dueDateFor("2026-12", 31)).toBe(31);
    expect(dueDateFor("2026-11", 5)).toBe(5);
  });
});

describe("schemaProblems", () => {
  it("accepts the 계약관리 schema and reports wrong types", () => {
    const ok = { "고객명/업체명": { type: "title" }, 계약금액: { type: "number" }, 입금날짜: { type: "number" }, 고객_특이사항: { type: "rich_text" } };
    expect(schemaProblems(ok)).toEqual([]);
    expect(schemaProblems({ ...ok, 입금날짜: { type: "date" } })).toHaveLength(1);
    expect(schemaProblems({})).toHaveLength(4);
  });
});

describe("parseContract", () => {
  it("rejects non-integer or out-of-range due days", () => {
    expect(parseContract(page("a", "A", 32)).problem).toBeTruthy();
    expect(parseContract(page("a", "A", 2.5)).problem).toBeTruthy();
    expect(parseContract(page("a", "A", 15)).dueDay).toBe(15);
    expect(parseContract(page("a", "A", 15, {}, null)).monthlyFee).toBe(0);
  });
});

describe("planSync", () => {
  it("imports every active row with a due day regardless of status", () => {
    const plan = planSync([], [page("p1", "가빌라", 10), page("p2", "나빌라", null), page("p3", "다빌라", 5, { in_trash: true })]);
    expect(plan.inserts.map(r => r.name)).toEqual(["가빌라"]);
    expect(plan.deactivate).toEqual([]);
  });

  it("is idempotent: a second sync updates instead of inserting", () => {
    const plan = planSync([{ id: 1, notionPageId: "p1", name: "가빌라", active: true }], [page("p1", "가빌라(변경)", 10)]);
    expect(plan.inserts).toEqual([]);
    expect(plan.updates).toEqual([expect.objectContaining({ id: 1, link: false })]);
  });

  it("matches page ids with or without dashes", () => {
    const plan = planSync([{ id: 1, notionPageId: "26ef2ed84d17815e", name: "가", active: true }], [page("26ef2ed8-4d17-815e", "가", 3)]);
    expect(plan.updates).toHaveLength(1);
    expect(plan.inserts).toHaveLength(0);
  });

  it("links an existing unlinked customer only on a unique exact name", () => {
    const plan = planSync([{ id: 7, notionPageId: null, name: "가빌라", active: true }], [page("p1", "가빌라", 10)]);
    expect(plan.updates).toEqual([expect.objectContaining({ id: 7, link: true })]);
  });

  it("reports name conflicts instead of guessing", () => {
    const plan = planSync(
      [{ id: 1, notionPageId: null, name: "가빌라", active: true }, { id: 2, notionPageId: null, name: "가빌라", active: true }],
      [page("p1", "가빌라", 10)],
    );
    expect(plan.conflicts).toHaveLength(1);
    expect(plan.updates).toHaveLength(0);
    expect(plan.inserts).toHaveLength(0);
  });

  it("deactivates (never deletes) customers whose due day was cleared or who disappeared", () => {
    const plan = planSync(
      [{ id: 1, notionPageId: "p1", name: "가", active: true }, { id: 2, notionPageId: "gone", name: "나", active: true }, { id: 3, notionPageId: "p3", name: "다", active: false }],
      [page("p1", "가", null), page("p3", "다", 7)],
    );
    expect(plan.deactivate.map(d => d.id).sort()).toEqual([1, 2]);
    expect(plan.updates).toEqual([expect.objectContaining({ id: 3 })]); // reactivated
  });
});
