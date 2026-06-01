type ApiRequest = {
  method?: string;
  body?: Record<string, unknown>;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

type DiagnosisInput = {
  buildingType?: string;
  floors?: string;
  pollution?: string;
  cycle?: string;
};

type GeminiPart = {
  text?: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
};

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-2.5-flash";
const LEGACY_FALLBACK_MODEL = "gemini-2.0-flash";
const STAIR_BUILDING_TYPE = "빌라/상가 계단";
const DEFAULT_FLOORS = "2~3층";
const DEFAULT_CYCLE = "월 4회";
const SURCHARGE_TEXT = "오염 상태가 심하면 현장 상태에 따라 1~2만원 추가로 안내될 수 있습니다.";

function sanitize(value: unknown) {
  return typeof value === "string" ? value.slice(0, 120).trim() : "";
}

function cleanError(error: unknown) {
  return String(error).replace(/\s+/g, " ").slice(0, 240);
}

function getCandidateModels() {
  return Array.from(
    new Set(
      [process.env.GEMINI_MODEL?.trim(), DEFAULT_MODEL, LEGACY_FALLBACK_MODEL].filter(
        Boolean
      ) as string[]
    )
  );
}

function extractJson(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const raw = fenced?.[1] ?? trimmed;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Gemini response did not include JSON: ${raw.slice(0, 160)}`);
  }

  return JSON.parse(raw.slice(start, end + 1));
}

function isStairCleaning(input: Required<DiagnosisInput>) {
  return input.buildingType === STAIR_BUILDING_TYPE;
}

function getMonthlyFourPrice(floors: string) {
  if (floors === "4층") return "77,000원~";
  if (floors === "5~6층") return "88,000원~";
  return "66,000원~";
}

function getPriceGuide(input: Required<DiagnosisInput>) {
  if (!isStairCleaning(input)) {
    return `${input.buildingType}는 현장 사진과 범위 확인 후 별도 안내해드리고 있어요.`;
  }

  if (input.cycle === "월 2회") {
    return `${input.floors} 기준 월 2회 관리는 4만원대부터 안내해드리고 있어요.`;
  }

  if (input.cycle === "상담 후 결정") {
    return `${input.floors} 기준 월 4회는 ${getMonthlyFourPrice(input.floors)}부터이고, 월 2회는 4만원대부터 상담 후 맞춰드려요.`;
  }

  return `${input.floors} 기준 월 4회 관리는 ${getMonthlyFourPrice(input.floors)}부터 안내해드리고 있어요.`;
}

function getSurchargeGuide(input: Required<DiagnosisInput>) {
  return input.pollution === "오염 심함" ? SURCHARGE_TEXT : "";
}

function appendSentence(text: string, sentence: string) {
  if (!sentence) return text;
  if (text.includes(sentence)) return text;
  return `${text.trim()} ${sentence}`.trim();
}

function fallbackResult(input: Required<DiagnosisInput>) {
  const priceGuide = getPriceGuide(input);
  const surchargeGuide = getSurchargeGuide(input);

  if (!isStairCleaning(input)) {
    return {
      title: `${input.buildingType} 상담 안내`,
      summary: priceGuide,
      recommendation: appendSentence("사진으로 범위와 오염 정도를 먼저 확인한 뒤 작업 범위와 방문 일정을 맞춰드리는 편이 가장 정확합니다.", surchargeGuide),
      cta: "사진 보내주시면 실제 현장 기준으로 빠르게 안내해드릴게요.",
    };
  }

  if (input.cycle === "월 2회") {
    return {
      title: "월 2회 계단 관리 안내",
      summary: `${input.floors} 계단은 가볍게 시작하시려는 경우 월 2회부터 상담드리기 좋아요. ${priceGuide}`,
      recommendation: appendSentence("현관, 계단 손스침 구간, 복도 먼지 흐름을 보고 월 4회가 더 맞는지 함께 판단해드릴 수 있어요.", surchargeGuide),
      cta: "계단 사진 보내주시면 월 2회 기준으로 먼저 보고드릴게요.",
    };
  }

  if (input.cycle === "상담 후 결정") {
    return {
      title: "주기 상담 후 결정 안내",
      summary: `${input.floors} 계단은 실제 사용량과 오염 속도를 보면 월 2회와 월 4회 중 더 잘 맞는 쪽이 갈립니다. ${priceGuide}`,
      recommendation: appendSentence("입주민 이동량이 많거나 먼지가 빨리 쌓이면 월 4회가 안정적이고, 비교적 잔잔하면 월 2회부터 시작하셔도 됩니다.", surchargeGuide),
      cta: "사진 보내주시면 어느 주기가 맞을지 먼저 잡아드릴게요.",
    };
  }

  return {
    title: "월 4회 계단 관리 안내",
    summary: `${input.floors} 계단은 현재 가격표 기준으로 월 4회 정기관리가 가장 기준이 되는 플랜입니다. ${priceGuide}`,
    recommendation: appendSentence("공용계단은 일정한 주기로 관리해야 먼지, 발자국 자국, 모서리 오염이 덜 누적돼요.", surchargeGuide),
    cta: "계단 사진 보내주시면 현재 상태 기준으로 더 정확하게 안내해드릴게요.",
  };
}

function buildPrompt(input: Required<DiagnosisInput>) {
  const floorText = isStairCleaning(input) ? input.floors : "해당 없음";
  const priceGuide = getPriceGuide(input);
  const surchargeGuide = getSurchargeGuide(input);

  return `이천 지역 공용공간 청소 상담 문구를 JSON으로만 작성해줘.
조건: 건물유형=${input.buildingType}, 층수=${floorText}, 오염상태=${input.pollution}, 희망주기=${input.cycle}
가격 기준: ${priceGuide}${surchargeGuide ? ` ${surchargeGuide}` : ""}
규칙:
- 확정 견적처럼 말하지 말고 가격표 기준 예상 안내로 표현해줘.
- ${STAIR_BUILDING_TYPE}이면 월 4회 기준 가격표를 반영하고, 월 2회는 4만원대부터라고 안내해줘.
- 유리청소, 화장실청소, 사무실청소는 별도 안내라고 표현해줘.
- 오염 상태가 심하면 1~2만원 추가 가능성을 자연스럽게 포함해줘.
- 마지막에는 사진 문의를 유도해줘.
반드시 아래 키만 가진 JSON 객체로 답해줘.
{"title":"추천 제목","summary":"상태 분석 1문장","recommendation":"가격 또는 관리 방향 1문장","cta":"문의 유도 1문장"}`;
}

async function requestGemini(model: string, apiKey: string, prompt: string) {
  const response = await fetch(`${GEMINI_ENDPOINT}/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.45,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${model} failed with ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as GeminiResponse;
  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? "";

  return extractJson(text);
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const input: Required<DiagnosisInput> = {
    buildingType: sanitize(req.body?.buildingType) || STAIR_BUILDING_TYPE,
    floors: sanitize(req.body?.floors) || DEFAULT_FLOORS,
    pollution: sanitize(req.body?.pollution) || "보통",
    cycle: sanitize(req.body?.cycle) || DEFAULT_CYCLE,
  };

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      ...fallbackResult(input),
      source: "fallback",
      setupRequired: true,
    });
  }

  const baseFallback = fallbackResult(input);
  const priceGuide = getPriceGuide(input);
  const surchargeGuide = getSurchargeGuide(input);
  const errors: string[] = [];

  for (const model of getCandidateModels()) {
    try {
      const parsed = await requestGemini(model, apiKey, buildPrompt(input));

      return res.status(200).json({
        title: sanitize(parsed.title) || baseFallback.title,
        summary: appendSentence(sanitize(parsed.summary) || baseFallback.summary, priceGuide),
        recommendation: appendSentence(
          sanitize(parsed.recommendation) || baseFallback.recommendation,
          surchargeGuide
        ),
        cta: sanitize(parsed.cta) || baseFallback.cta,
        source: "gemini",
        model,
      });
    } catch (error) {
      errors.push(`${model}: ${cleanError(error)}`);
      console.error("Gemini diagnosis model failed", model, error);
    }
  }

  console.error("AI diagnosis failed for all Gemini models", errors);
  return res.status(200).json({
    ...baseFallback,
    source: "fallback",
    ...(req.body?.debug === true ? { errors } : {}),
  });
}
