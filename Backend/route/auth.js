const express = require('express');
const bcrypt = require('bcryptjs'); 
const User = require("../models/user.js"); 

const { registerValidation, validate } = require('../middleware/registerValidation');
const router = express.Router();


router.post('/createUser', registerValidation, validate, async (req, res) => {
  console.log(req.body);
    const { name, email, password } = req.body;
  
    try {
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({
        message: 'Kullanıcı başarıyla oluşturuldu.',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          addresses: newUser.addresses,
          favorites: newUser.favorites,
          cart: newUser.cart,
          orders: newUser.orders,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
  });
  
  module.exports = router;