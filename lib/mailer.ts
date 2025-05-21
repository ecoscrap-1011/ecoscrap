// lib/mailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"EcoScrap" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Verify your email',
    html: `<p>Click below to verify your email:</p><a href="${verificationUrl}">Verify Email</a>`,
  });
}
