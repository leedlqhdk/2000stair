import type { VercelRequest, VercelResponse } from "@vercel/node";

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

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const geminiKeyConfigured = Boolean(
    process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY
  );

  return res.status(200).json({
    ok: true,
    geminiKeyConfigured,
    candidateModels: getCandidateModels(),
  });
}
