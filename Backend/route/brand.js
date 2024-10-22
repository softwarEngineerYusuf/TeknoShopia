const express = require('express');
const Brand = require('../models/brand');
const router = express.Router();


router.post('/addBrand', async (req, res) => {
  try {
    const { name } = req.body;

    
    if (!name) {
      return res.status(400).json({ message: 'Marka ismi gerekli.' });
    }

    
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    
    const existingBrand = await Brand.findOne({ name: formattedName });
    if (existingBrand) {
      return res.status(400).json({ message: 'Bu isimde bir marka zaten mevcut.' });
    }

   
    const newBrand = new Brand({
      name: formattedName,
      
    });

    await newBrand.save();
    res.status(201).json({ message: 'Marka başarıyla eklendi.', brand: newBrand });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
  }
});

router.get('/getAllBrands', async (req, res) => {
    try {
      const brands = await Brand.find();
      res.status(200).json(brands);
    } catch (error) {
      res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
  });


  router.get('/getBrandById/:id', async (req, res) => {
    try {
      const brand = await Brand.findById(req.params.id);
      if (!brand) {
        return res.status(404).json({ message: 'Marka bulunamadı.' });
      }
      res.status(200).json(brand);
    } catch (error) {
      res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
  });

  router.get('/getBrandByName/:name', async (req, res) => {
    try {
     
      const name = req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1);
      const brand = await Brand.findOne({ name: name });
      
      if (!brand) {
        return res.status(404).json({ message: 'Marka bulunamadı.' });
      }
  
      res.status(200).json(brand);
    } catch (error) {
      res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
  });

module.exports = router;


