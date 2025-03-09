const express = require("express");
const router = express.Router();
const Product = require("../models/product.js");
const Brand = require("../models/brand.js");
const Category = require("../models/category.js");

router.post("/addProduct", async (req, res) => {
  try {
    const {
      name,
      brand,
      category, // Gönderilen kategori adı
      price,
      stock,
      description,
      mainImage,
      additionalImages,
      imageFiles,
      additionalImageFiles,
      attributes,
      discount,
      discountStartDate,
      discountEndDate,
    } = req.body;

    if (!name || !brand || !category || price == null || stock == null) {
      return res.status(400).json({ message: "Gerekli alanları doldurunuz." });
    }

    // Marka kontrolü
    const brandFind = await Brand.findOne({ name: brand });
    if (!brandFind)
      return res.status(404).json({ message: "Belirtilen marka bulunamadı." });

    // Kategori kontrolü
    const categoryFind = await Category.findOne({ name: category });
    if (!categoryFind)
      return res.status(404).json({ message: "Kategori bulunamadı." });

    // **Alt Kategori mi, Ana Kategori mi?**
    const isSubCategory = categoryFind.parentCategory ? true : false;
    const targetCategoryId = isSubCategory
      ? categoryFind._id // Eğer parentCategory varsa alt kategoridir
      : categoryFind._id; // Eğer yoksa ana kategoridir

    // **Aynı isim ve aynı kategoriye sahip ürün var mı?**
    const existingProduct = await Product.findOne({
      name: name,
      category: targetCategoryId,
    });

    if (existingProduct) {
      return res.status(400).json({
        message: "Bu kategori altında aynı isimde bir ürün zaten mevcut.",
      });
    }

    // **Yeni Ürün Kaydı**
    const newProduct = new Product({
      name,
      brand: brandFind._id,
      category: targetCategoryId,
      price,
      stock,
      description,
      mainImage,
      additionalImages,
      imageFiles,
      additionalImageFiles,
      attributes,
      discount,
      discountStartDate,
      discountEndDate,
    });

    await newProduct.save();

    // **Ürünü ilgili kategoriye ekleyelim**
    categoryFind.products.push(newProduct._id);
    await categoryFind.save();

    res.status(201).json({
      message: `Ürün başarıyla ${
        isSubCategory ? "alt kategoriye" : "ana kategoriye"
      } eklendi.`,
      product: newProduct,
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getAllProducts", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand")
      .populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getProductById/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand")
      .populate("category");
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getProductByName/:name", async (req, res) => {
  try {
    const product = await Product.findOne({ name: req.params.name })
      .populate("brand")
      .populate("category");
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.delete("/deleteProduct/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    await Brand.updateOne(
      { _id: product.brand },
      { $pull: { products: product._id } }
    );
    await Category.updateOne(
      { _id: product.category },
      { $pull: { products: product._id } }
    );

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Ürün başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.put("/updateProduct/:id", async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const {
      name,
      price,
      stock,
      description,
      mainImage,
      additionalImages,
      imageFiles,
      additionalImageFiles,
      attributes,
      discount,
      discountStartDate,
      discountEndDate,
      brand,
      category,
    } = req.body;

    // Güncellenen ürünü bul
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    // Eğer marka adı değişiyorsa, yeni marka bilgisini bul
    let brandFind = product.brand;
    if (brand) {
      const foundBrand = await Brand.findOne({ name: brand });
      if (!foundBrand) {
        return res
          .status(404)
          .json({ message: "Belirtilen marka bulunamadı." });
      }
      brandFind = foundBrand._id;
    }

    // Kategori bilgisi değişiyorsa, yeni kategoriyi bul
    let categoryFind = product.category;
    if (category) {
      const foundCategory = await Category.findOne({ name: category });
      if (!foundCategory) {
        return res
          .status(404)
          .json({ message: "Belirtilen kategori bulunamadı." });
      }
      categoryFind = foundCategory._id;
    }

    // Eğer ürün adı ve kategorisi değişiyorsa, bu isimde aynı kategoriye sahip başka bir ürün olup olmadığını kontrol et
    if (name && categoryFind.toString() !== product.category.toString()) {
      const existingProduct = await Product.findOne({
        name,
        category: categoryFind,
      });
      if (
        existingProduct &&
        existingProduct._id.toString() !== product._id.toString()
      ) {
        return res.status(400).json({
          message:
            "Bu kategori altında aynı isimde başka bir ürün zaten mevcut.",
        });
      }
    }

    // Güncellenmiş ürün verileri
    const updatedProductData = {
      name,
      price,
      stock,
      description,
      mainImage,
      additionalImages,
      imageFiles,
      additionalImageFiles,
      attributes,
      discount,
      discountStartDate,
      discountEndDate,
      brand: brandFind,
      category: categoryFind,
    };

    console.log("Updated Product Data:", updatedProductData);

    // Ürünü güncelle
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedProductData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Ürün başarıyla güncellendi.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getDiscountedProducts", async (req, res) => {
  try {
    const discountedProducts = await Product.find({ discount: { $gt: 0 } })
      .populate("brand")
      .populate("category");

    res.status(200).json(discountedProducts);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

module.exports = router;
