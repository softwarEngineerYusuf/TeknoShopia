const jwt = require('jsonwebtoken');

// .env dosyasından secret key'i aldım.
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// middleware
const authenticateToken = (req, res, next) => {
  // Cookie'den token'ı aldım
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Yetkilendirme gerekli, token bulunamadı.' });
  }

  try {
    // Token'ı doğruladım
    const decoded = jwt.verify(token, JWT_SECRET);

    // Kullanıcıyı isteğe ekledim
    req.user = decoded;

    next(); // Bir sonraki middleware'e veya rotaya geçiliyor
  } catch (error) {
    return res.status(403).json({ message: 'Geçersiz veya süresi dolmuş token.' });
  }
};

module.exports = authenticateToken;