const express = require("express");
const router = express.Router();
const User = require("../models/user"); 
const authenticateToken = require("../middleware/authenticateToken.js")

router.get('/',  authenticateToken, async (req, res) => {
    try {
      
      const users = await User.find().select('-password'); 
  
      
      if (!users || users.length === 0) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
      }
  
     
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
  });
  
  module.exports = router;


module.exports=router