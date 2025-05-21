// testMailer.js

import nodemailer from 'nodemailer';

async function sendTestEmail() {
  // Create transporter with Gmail SMTP and your credentials
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: '',       // replace with your Gmail
      pass: 'your-app-password',          // replace with your Gmail App Password
    },
  });

  // Define email options
  const mailOptions = {
    from: '"EcoScrap" <your-email@gmail.com>', // sender address
    to: 'recipient@example.com',                // receiver address (your test email)
    subject: 'Test Email from Nodemailer',
    html: `<p>This is a test email sent using Nodemailer with Gmail SMTP.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

sendTestEmail();
