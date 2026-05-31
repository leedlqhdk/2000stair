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

function sanitize(value: unknown) {
  return typeof value === "string" ? value.slice(0, 80).trim() : "";
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
    throw new Error("Gemini response did not include JSON");
  }

  return JSON.parse(raw.slice(start, end + 1));
}

function fallbackResult(input: Required<DiagnosisInput>) {
  const intensive = input.pollution === "오염 심함" || input.floors === "5층 이상";
  const light = input.pollution === "깨끗한 편" || input.cycle === "월 관리";

  if (intensive) {
    return {
      title: "주 1~2회 정기 관리 추천",
      summary: `${input.buildingType} ${input.floors} 건물은 오염이 빠르게 쌓일 수 있어 짧은 주기의 관리가 잘 맞습니다.`,
      recommendation: "계단, 현관, 복도 모서리 먼지와 생활 오염을 함께 보는 정기 관리가 좋습니다.",
      cta: "사진을 보내주시면 실제 상태 기준으로 더 정확하게 안내드릴게요.",
    };
  }

  if (light) {
    return {
      title: "월 1~2회 관리부터 추천",
      summary: `${input.buildingType} ${input.floors} 기준으로 현재 상태가 비교적 안정적인 편입니다.`,
      recommendation: "가볍게 시작한 뒤 계절과 이용량에 맞춰 주기를 조정하는 방식이 좋습니다.",
      cta: "현재 계단 사진 한 장만 보내주셔도 관리 범위를 빠르게 잡아드릴게요.",
    };
  }

  return {
    title: "주 1회 정기 관리 추천",
    summary: `${input.buildingType} ${input.floors} 공용공간은 주 1회 관리가 가장 무난합니다.`,
    recommendation: "먼지가 쌓이기 전에 꾸준히 닦아주는 방식이 비용 대비 만족도가 좋습니다.",
    cta: "건물 사진을 보내주시면 방문 전 대략적인 관리 방향을 안내드릴게요.",
  };
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
        temperature: 0.65,
        maxOutputTokens: 420,
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
    buildingType: sanitize(req.body?.buildingType) || "빌라",
    floors: sanitize(req.body?.floors) || "3~4층",
    pollution: sanitize(req.body?.pollution) || "보통",
    cycle: sanitize(req.body?.cycle) || "아직 모르겠음",
  };

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      ...fallbackResult(input),
      source: "fallback",
      setupRequired: true,
    });
  }

  const prompt = `
너는 경기도 이천 지역의 빌라/원룸/상가 공용공간 청소 상담을 돕는 진단 도우미다.
사용자가 입력한 조건을 바탕으로 건물 상태를 짧고 현실적으로 분석하고, 문의로 자연스럽게 이어지는 맞춤 문장을 작성해라.
과장된 보장, 확정 견적, 의료/법률식 단정 표현은 하지 마라.
반드시 JSON만 출력해라.

입력:
- 건물 유형: ${input.buildingType}
- 층수: ${input.floors}
- 오염 상태: ${input.pollution}
- 원하는 관리 주기: ${input.cycle}

JSON 형식:
{
  "title": "15자 내외의 추천 제목",
  "summary": "건물 상태 분석 1문장",
  "recommendation": "추천 관리 방향 1문장",
  "cta": "카톡/전화 문의로 이어지는 부드러운 1문장"
}
`;

  const baseFallback = fallbackResult(input);
  let lastError: unknown;

  for (const model of getCandidateModels()) {
    try {
      const parsed = await requestGemini(model, apiKey, prompt);

      return res.status(200).json({
        title: sanitize(parsed.title) || baseFallback.title,
        summary: sanitize(parsed.summary) || baseFallback.summary,
        recommendation:
          sanitize(parsed.recommendation) || baseFallback.recommendation,
        cta: sanitize(parsed.cta) || baseFallback.cta,
        source: "gemini",
        model,
      });
    } catch (error) {
      lastError = error;
      console.error("Gemini diagnosis model failed", model, error);
    }
  }

  console.error("AI diagnosis failed for all Gemini models", lastError);
  return res.status(200).json({ ...baseFallback, source: "fallback" });
}
