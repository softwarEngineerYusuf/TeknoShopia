const express = require("express");
const router = express.Router();
const Product = require("../models/product.js");
const Brand = require("../models/brand.js");
const Category = require("../models/category.js");
const { v4: uuidv4 } = require("uuid");

router.post("/addProduct", async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      price,
      stock,
      color,
      description,
      mainImage,
      additionalImages,
      imageFiles,
      additionalImageFiles,
      attributes,
      discount,
      discountStartDate,
      discountEndDate,
      groupId, // Kullanıcıdan groupId gelirse
    } = req.body;

    if (
      !name ||
      !brand ||
      !category ||
      price == null ||
      stock == null ||
      !color
    ) {
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

    // **Group ID belirleme**
    let newGroupId = groupId;

    // Eğer groupId yoksa, aynı isimdeki ilk ürünü bul ve ondan al
    if (!groupId) {
      const existingProduct = await Product.findOne({ name });

      if (existingProduct) {
        newGroupId = existingProduct.groupId; // Aynı ürün grubuna ait olarak ata
      } else {
        newGroupId = uuidv4(); // Yeni bir ürün grubuna ait ID oluştur
      }
    }

    // **Yeni Ürün Kaydı**
    const newProduct = new Product({
      name,
      brand: brandFind._id,
      category: categoryFind._id,
      price,
      stock,
      color,
      description,
      mainImage,
      additionalImages,
      imageFiles,
      additionalImageFiles,
      attributes,
      discount,
      discountStartDate,
      discountEndDate,
      groupId: newGroupId, // Ürünün grup kimliği
    });

    await newProduct.save();

    // **Ürünü ilgili kategoriye ekleyelim**
    categoryFind.products.push(newProduct._id);
    await categoryFind.save();

    res.status(201).json({
      message: `Ürün başarıyla eklendi.`,
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

router.get("/getProductDetails/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Ürünü ID ile bul
    const product = await Product.findById(id)
      .populate("brand category reviews") // Marka, kategori ve yorumları getir
      .lean(); // Performansı artırmak için plain JS objesi olarak getir

    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    // Aynı groupId'ye sahip ürün varyantlarını al (renk varyantları)
    const relatedVariants = await Product.find({ groupId: product.groupId })
      .select("name color price stock mainImage discount")
      .lean();

    // Varyantlar arasındaki fiyat farklarını da gösterebiliriz
    const variants = relatedVariants.map((variant) => ({
      _id: variant._id,
      color: variant.color,
      price: variant.price,
      stock: variant.stock,
      mainImage: variant.mainImage,
      discount: variant.discount, // Farklı varyantlar için indirim
      discountedPrice: variant.price - (variant.price * variant.discount) / 100, // İndirimli fiyat
    }));

    res.status(200).json({
      product, // Ana ürün bilgileri
      variants, // Renk varyantları (farklı renklerin fiyatları ve indirimleri)
    });
  } catch (error) {
    console.error("Hata:", error);
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

router.get("/getProductsByCategory/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Kategori var mı kontrol et
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı." });
    }

    // Kategoriye ait ürünleri getir (populate ile marka ve kategori bilgilerini de al)
    const products = await Product.find({ category: categoryId })
      .populate("brand", "name") // Sadece marka adını getir
      .populate("category", "name") // Sadece kategori adını getir
      .populate("reviews"); // İsteğe bağlı: yorumları da getir

    res.status(200).json({
      message: `${category.name} kategorisindeki ürünler başarıyla getirildi.`,
      category: category.name,
      count: products.length,
      products: products,
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getProductsByBrand/:brandId", async (req, res) => {
  try {
    const { brandId } = req.params;
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);

    // Marka kontrolü
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Marka bulunamadı.",
      });
    }

    // Filtre oluştur
    const filter = { brand: brandId };

    // Fiyat aralığı varsa filtreye ekle
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      filter.discountedPrice = {};
      if (!isNaN(minPrice)) filter.discountedPrice.$gte = minPrice;
      if (!isNaN(maxPrice)) filter.discountedPrice.$lte = maxPrice;
    }

    const products = await Product.find(filter)
      .populate("brand", "name logo")
      .populate("category", "name");

    res.status(200).json({
      success: true,
      brand: brand.name,
      count: products.length,
      products: products.map((product) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        discountedPrice: product.discountedPrice,
        color: product.color,
        mainImage: product.mainImage,
        brand: product.brand,
        category: product.category,
      })),
    });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
      error: error.message,
    });
  }
});

module.exports = router;
