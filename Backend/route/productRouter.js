const express = require("express");
const router = express.Router();
const Product = require("../models/product.js");
const Brand = require("../models/brand.js");
const Category = require("../models/category.js");

router.post("/addProductToSubCategory", async (req, res) => {
  try {
    const {
      name,
      brand,
      subCategory,
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

    if (!name || !brand || !subCategory || price == null || stock == null) {
      return res.status(400).json({ message: "Gerekli alanları doldurunuz." });
    }

    const brandFind = await Brand.findOne({ name: brand });
    if (!brandFind)
      return res.status(404).json({ message: "Belirtilen marka bulunamadı." });

    const subCategoryFind = await Category.findOne({ name: subCategory });
    if (!subCategoryFind)
      return res.status(404).json({ message: "Alt kategori bulunamadı." });

    const parentCategoryFind = await Category.findById(
      subCategoryFind.parentCategory
    );
    if (!parentCategoryFind)
      return res.status(404).json({ message: "Ana kategori bulunamadı." });

    if (!subCategoryFind.products) {
      subCategoryFind.products = [];
    }

    if (!parentCategoryFind.products) {
      parentCategoryFind.products = [];
    }

    const newProduct = new Product({
      name,
      brand: brandFind._id,
      category: subCategoryFind._id, // Alt kategori
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

    subCategoryFind.products.push(newProduct._id);
    await subCategoryFind.save();

    parentCategoryFind.products.push(newProduct._id);
    await parentCategoryFind.save();

    res
      .status(201)
      .json({ message: "Ürün başarıyla eklendi.", product: newProduct });
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
      brand,
      category,
    };

    console.log("Updated Product Data:", updatedProductData);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedProductData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    res.status(200).json({ message: "Ürün başarıyla güncellendi.", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});
module.exports = router;
