import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const geminiKeyConfigured = Boolean(
    process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY
  );

  return res.status(200).json({
    ok: true,
    geminiKeyConfigured,
  });
}
