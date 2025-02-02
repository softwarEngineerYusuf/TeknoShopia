require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * HTML e-posta gönderme fonksiyonu
 * @param {string} to - Alıcının e-posta adresi
 * @param {string} subject - E-posta konusu
 * @param {string} html - E-posta içeriği (HTML formatında)
 */
const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"TeknoShopia" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html, // HTML formatı
    });
    console.log(`📩 HTML formatında e-posta başarıyla gönderildi → ${to}`);
  } catch (error) {
    console.error("❌ E-posta gönderme hatası:", error);
  }
};

module.exports = sendMail;
