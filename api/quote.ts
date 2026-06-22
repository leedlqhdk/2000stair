import express from "express";
import nodemailer from "nodemailer";
import type { Request, Response } from "express";

const app = express();
app.use(express.json());

app.post("/api/quote", async (req: Request, res: Response) => {
  const { phone, address, notes } = (req.body ?? {}) as {
    phone?: string;
    address?: string;
    notes?: string;
  };

  if (!phone?.trim() || !address?.trim()) {
    return res.status(400).json({ error: "연락처와 주소는 필수입니다." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.naver.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"이천계단지기 홈페이지" <${process.env.EMAIL_USER}>`,
      to: "rbska3308@naver.com",
      subject: "[이천계단지기] 무료방문견적 신청",
      text: `[무료방문견적 신청]\n\n📞 연락처: ${phone}\n📍 주소: ${address}${notes?.trim() ? `\n📝 기타: ${notes}` : ""}`,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "전송에 실패했습니다." });
  }
});

export default app;
