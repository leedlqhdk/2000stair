type ApiRequest = {
  query?: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-2.5-flash";
const LEGACY_FALLBACK_MODEL = "gemini-2.0-flash";

function getCandidateModels() {
  return Array.from(
    new Set(
      [process.env.GEMINI_MODEL?.trim(), DEFAULT_MODEL, LEGACY_FALLBACK_MODEL].filter(
        Boolean
      ) as string[]
    )
  );
}

function cleanError(error: unknown) {
  return String(error).replace(/\s+/g, " ").slice(0, 240);
}

async function probeModel(model: string, apiKey: string) {
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
          parts: [{ text: 'Return only this JSON: {"ok":true}' }],
        },
      ],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 32,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${await response.text()}`);
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const geminiKeyConfigured = Boolean(
    process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY
  );
  const candidateModels = getCandidateModels();
  const shouldProbe = req.query?.probe === "1";

  if (!shouldProbe) {
    return res.status(200).json({
      ok: true,
      geminiKeyConfigured,
      candidateModels,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      ok: true,
      geminiKeyConfigured: false,
      candidateModels,
      geminiReachable: false,
      errors: ["Gemini API key is not configured"],
    });
  }

  const errors: string[] = [];

  for (const model of candidateModels) {
    try {
      await probeModel(model, apiKey);
      return res.status(200).json({
        ok: true,
        geminiKeyConfigured: true,
        candidateModels,
        geminiReachable: true,
        model,
      });
    } catch (error) {
      errors.push(`${model}: ${cleanError(error)}`);
    }
  }

  return res.status(200).json({
    ok: true,
    geminiKeyConfigured: true,
    candidateModels,
    geminiReachable: false,
    errors,
  });
}
