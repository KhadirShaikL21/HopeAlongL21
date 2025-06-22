const nodemailer = require('nodemailer');

async function sendEmailNotification(to, subject, text) {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail', // or any other email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"HopeAlong" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Email send error:', err.message);
  }
}

module.exports = sendEmailNotification;
