const express = require("express");
const router = express.Router();
const sendMail = require("../config/mailService");

router.post("/send-email", async (req, res) => {
  const { to, subject, orderId, userName } = req.body;

  if (!to || !subject || !orderId || !userName) {
    return res.status(400).json({ message: "Tüm alanlar zorunludur!" });
  }

  const emailTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
        <h2 style="color: #4CAF50;">Sipariş Onayı</h2>
        <p>Merhaba <b>${userName}</b>,</p>
        <p>Siparişiniz başarıyla oluşturuldu! 🚀</p>
        <p><b>Sipariş ID:</b> ${orderId}</p>
        <hr/>
        <p style="font-size: 12px; color: gray;">Bu e-posta otomatik gönderilmiştir, lütfen yanıtlamayınız.</p>
      </div>
    `;

  try {
    await sendMail(to, subject, emailTemplate);
    res
      .status(200)
      .json({ message: "HTML formatında e-posta başarıyla gönderildi!" });
  } catch (error) {
    res.status(500).json({ message: "E-posta gönderme hatası", error });
  }
});
module.exports = router;
