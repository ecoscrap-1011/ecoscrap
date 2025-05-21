// sendTestEmail.js
import nodemailer from "nodemailer";

async function sendTestEmail() {
  // Create transporter with Gmail SMTP config
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS
    auth: {
      user: "ecoscrap.1011@gmail.com",  // your Gmail email
      pass: "snxs fqvi isko jdzc",             // your Gmail app password
    },
  });

  // Mail options
  const mailOptions = {
    from: `"EcoScrap" <ecoscrap.1011@gmail.com>`, // sender address
    to: " asl.aisat.1011@gmail.com",                   // change to your recipient email or yourself
    subject: "Test Email from Nodemailer",
    html: `<p>Hello, this is a test email sent from Nodemailer with hardcoded Gmail SMTP credentials!</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

sendTestEmail();
