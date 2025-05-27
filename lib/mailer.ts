// lib/mailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS
    auth: {
        user: "ecoscrap.1011@gmail.com",  // your Gmail email
        pass: "snxs fqvi isko jdzc",

    },

});
console.log(process.env.SMTP_USER)
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to send emails');
    }
});

export async function sendVerificationEmail(receiver: string, token: string) {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

    try {
        const info = await transporter.sendMail({
            from: `"EcoScrap Support" <ecoscrap.1011@gmail.com>`,
            to: receiver,
            console.log(receiver)
            subject: 'Verify your EcoScrap account',
            text: `Please verify your email by clicking the link: ${verificationUrl}`,
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #2a9d8f; text-align: center;">Welcome to EcoScrap!</h2>
      <p style="font-size: 16px; color: #333;">
        Thank you for signing up. To complete your registration, please verify your email by clicking the button below:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
          style="
            background-color: #2a9d8f; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 5px; 
            font-weight: bold;
            display: inline-block;
            font-size: 16px;
          ">
          Verify Email
        </a>
      </div>
      <p style="font-size: 14px; color: #666;">
        If you did not create an account, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">
        EcoScrap Support Team<br/>
        ecoscrap.1011@gmail.com
      </p>
    </div>
  `,
            headers: {
                'X-Priority': '1',
            }
        });



        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
