const express = require("express");
const Brand = require("../models/brand");
const router = express.Router();
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/addBrand", upload.single("logo"), async (req, res) => {
  try {
    const { name, description } = req.body;

    // Logo kontrolü
    if (!req.file) {
      return res.status(400).json({ message: "Lütfen bir logo yükleyin." });
    }

    // Cloudinary'e yükleme
    const streamUpload = (file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "brands" },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        stream.end(file.buffer);
      });
    };

    const uploadResult = await streamUpload(req.file);

    // MongoDB'ye kaydetme
    const newBrand = new Brand({
      name,
      description,
      logo: {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      },
    });

    await newBrand.save();

    res.status(201).json({
      message: "Marka başarıyla eklendi.",
      brand: newBrand,
    });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getAllBrands", async (req, res) => {
  try {
    const brands = await Brand.find().populate("products");

    // Brand'ler üzerinde işlem yaparak logo URL'sini döndürme
    const brandsWithLogo = brands.map((brand) => {
      return {
        ...brand.toObject(), // Brand modelini nesneye çevir
        logo: {
          public_id: brand.logo.public_id,
          url: brand.logo.url, // Cloudinary URL'sini döndürüyoruz
        },
      };
    });

    res.status(200).json(brandsWithLogo);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getBrandById/:id", async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id).populate("products");
    if (!brand) {
      return res.status(404).json({ message: "Marka bulunamadı." });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getBrandByName/:name", async (req, res) => {
  try {
    const name =
      req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1);
    const brand = await Brand.findOne({ name: name }).populate("products");

    if (!brand) {
      return res.status(404).json({ message: "Marka bulunamadı." });
    }

    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.delete("/deleteBrand/:id", async (req, res) => {
  try {
    const brandId = req.params.id;
    const brand = await Brand.findById(brandId);

    if (!brand) {
      return res.status(404).json({ message: "Marka bulunamadı." });
    }

    if (brand.logo && brand.logo.public_id) {
      await cloudinary.uploader.destroy(brand.logo.public_id);
    }

    await Brand.findByIdAndDelete(brandId);
    res.status(200).json({ message: "Marka başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.put("/updateBrand/:id", upload.single("logo"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Marka bulunamadı." });
    }

    if (name) {
      brand.name = name;
    }
    if (description) {
      brand.description = description;
    }

    if (req.file) {
      if (brand.logo && brand.logo.public_id) {
        await cloudinary.uploader.destroy(brand.logo.public_id);
      }

      const uploadResult = await streamUpload(req.file);
      brand.logo = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    await brand.save();
    res.status(200).json({ message: "Marka başarıyla güncellendi.", brand });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

module.exports = router;
