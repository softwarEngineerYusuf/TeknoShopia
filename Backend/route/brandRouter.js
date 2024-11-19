const express = require("express");
const Brand = require("../models/brand");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Sadece JPEG veya PNG formatında dosya yüklenebilir."),
        false
      );
    }
    cb(null, true);
  },
});

router.post("/addBrand", upload.single("logo"), async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Marka ismi gerekli." });
    }

    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    const existingBrand = await Brand.findOne({ name: formattedName });
    if (existingBrand) {
      return res
        .status(400)
        .json({ message: "Bu isimde bir marka zaten mevcut." });
    }

    // Yeni marka oluştur
    const newBrand = new Brand({
      name: formattedName,
      description: description || "",
      imageUrl: imageUrl || "",
      logo: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : null,
    });

    await newBrand.save();

    const logoBase64 = req.file ? req.file.buffer.toString("base64") : null;

    res.status(201).json({
      message: "Marka başarıyla eklendi.",
      brand: newBrand,
      logoBase64,
    });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getAllBrands", async (req, res) => {
  try {
    const brands = await Brand.find().populate("products");
    const brandsWithLogoBase64 = brands.map((brand) => {
      return {
        ...brand.toObject(),
        logo: brand.logo ? brand.logo.data.toString("base64") : null,
      };
    });
    res.status(200).json(brandsWithLogoBase64);
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

    await Brand.findByIdAndDelete(brandId);
    res.status(200).json({ message: "Marka başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.put("/updateBrand/:id", upload.single("logo"), async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body; // imageUrl'yi almak için req.body'ye ekledik
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
      brand.logo = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    if (imageUrl) {
      brand.imageUrl = imageUrl;
    }

    await brand.save();
    res.status(200).json({ message: "Marka başarıyla güncellendi.", brand });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

module.exports = router;
