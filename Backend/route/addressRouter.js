const express =require("express")
const Address =require("../models/address.js")
const User=require("../models/user.js")
const router =express.Router();



router.post("/addAddress", async (req, res) => {
    try {
      const { userId, district, city, street, postalCode } = req.body;
  
      if (!userId || !district || !city || !street || !postalCode) {
        return res.status(400).json({ message: 'Tüm alanlar gereklidir.' });
      }
  
      const newAddress = new Address({
        userId,
        district,
        city,
        street,
        postalCode
      });
      await newAddress.save();
  
      // Kullanıcının adres listesine bu yeni adresi ekliyorum.
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
      }
      user.addresses.push(newAddress._id); // Yeni adresi kullanıcıya ekledim
      await user.save(); // Kullanıcıyı güncelledim.
  
      res.status(201).json({ message: 'Adres başarıyla eklendi.', address: newAddress });
    } catch (error) {
      res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
  });


router.get('/allAddresses', async (req, res) => {
    try {
      const addresses = await Address.find().populate('userId', 'name email'); 
      res.status(200).json(addresses);
    } catch (error) {
      res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
  });


  router.get('/getAddressById/:id', async (req, res) => {
    try {
      const address = await Address.findById(req.params.id).populate('userId', 'name email');
      
      if (!address) {
        return res.status(404).json({ message: 'Adres bulunamadı.' });
      }
  
      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
  });


  router.put('/updateAddress/:id', async (req, res) => {
    try {
      const { district, city, street, postalCode } = req.body;
  
      
      if (!district && !city && !street && !postalCode) {
        return res.status(400).json({ message: 'En az bir alanı güncellemelisiniz.' });
      }
  
      
      const updatedFields = {};
      if (district) updatedFields.district = district;
      if (city) updatedFields.city = city;
      if (street) updatedFields.street = street;
      if (postalCode) updatedFields.postalCode = postalCode;
  
      
      const updatedAddress = await Address.findByIdAndUpdate(req.params.id, updatedFields, { new: true });//new:true  güncellendikten sonra son halini veriyor.
  
      if (!updatedAddress) {
        return res.status(404).json({ message: 'Adres bulunamadı.' });
      }
  
      res.status(200).json({ message: 'Adres başarıyla güncellendi.', address: updatedAddress });
    } catch (error) {
      res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
  });


  router.delete("/deleteAddress/:id", async (req, res) => {
    try {
      const addressId = req.params.id;
  
      // Önce adresin var olup olmadığını kontrol et
      const address = await Address.findById(addressId);
      if (!address) {
        return res.status(404).json({ message: 'Adres bulunamadı.' });
      }
  
      // Kullanıcıyı bul ve adresi kullanıcıdan çıkar
      const user = await User.findById(address.userId);
      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
      }
  
      // Kullanıcının adres listesinden bu adresi çıkar
      user.addresses = user.addresses.filter(addr => addr.toString() !== addressId);
      await user.save(); // Kullanıcıyı güncelle
  
      // Adresi Address modelinden sil
      await Address.findByIdAndDelete(addressId);
  
      res.status(200).json({ message: 'Adres başarıyla silindi.' });
    } catch (error) {
      res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
  });


module.exports = router;