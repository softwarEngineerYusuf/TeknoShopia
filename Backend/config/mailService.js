// Örnek dosya yolu: utils/sendMail.js

require("dotenv").config();
const nodemailer = require("nodemailer");

// Transporter objesini bir kere oluşturup yeniden kullanıyoruz.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // .env dosyanızdaki Gmail adresiniz
    pass: process.env.EMAIL_PASS, // .env dosyanızdaki Gmail Uygulama Şifreniz
  },
});

/**
 * HTML formatında e-posta gönderir.
 * @param {string} to - Alıcının e-posta adresi.
 * @param {string} subject - E-posta konusu.
 * @param {string} html - E-posta içeriği (HTML formatında).
 */
const sendMail = async (to, subject, html) => {
  try {
    // mailOptions objesini oluşturuyoruz.
    const mailOptions = {
      // GÖNDEREN BİLGİSİ: İstenen formatta ayarlandı.
      from: `"TeknoShopia" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    };

    // E-postayı gönderiyoruz.
    await transporter.sendMail(mailOptions);
    console.log(`✅ E-posta başarıyla gönderildi: ${to}`);
  } catch (error) {
    console.error(`❌ E-posta gönderilirken hata oluştu (${to}):`, error);
    // Hatanın daha üst seviyelerde de bilinmesi için yeniden fırlatılabilir.
    // throw error;
  }
};

// Fonksiyonu dışa aktarıyoruz.
// ÖNEMLİ: Eğer dosyanızda birden fazla fonksiyon varsa { sendMail } olarak,
// sadece bu fonksiyon varsa sendMail olarak export edin. Sizin kodunuza göre bu doğru.
module.exports = sendMail;
