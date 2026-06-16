import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

app.post("/api/quote", async (req, res) => {
  const { phone, address, notes } = (req.body ?? {}) as {
    phone?: string;
    address?: string;
    notes?: string;
  };

  if (!phone?.trim() || !address?.trim()) {
    return res.status(400).json({ error: "연락처와 주소는 필수입니다." });
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  console.log("EMAIL_USER defined:", !!emailUser, "EMAIL_PASS defined:", !!emailPass);

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.naver.com",
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.sendMail({
      from: `"이천계단지기 홈페이지" <${emailUser}>`,
      to: "rbska3308@naver.com",
      subject: "[이천계단지기] 무료방문견적 신청",
      text: `[무료방문견적 신청]\n\n📞 연락처: ${phone}\n📍 주소: ${address}${notes?.trim() ? `\n📝 기타: ${notes}` : ""}`,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Email error full:", err instanceof Error ? err.message : String(err));
    res.status(500).json({ error: "전송에 실패했습니다." });
  }
});

export default app;
