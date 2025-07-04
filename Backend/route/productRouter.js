const express = require("express");
const router = express.Router();
const Product = require("../models/product.js");
const Brand = require("../models/brand.js");
const Category = require("../models/category.js");
const User = require("../models/user.js");
const Cart = require("../models/cart.js");
const CartItem = require("../models/cartItem.js");
const { v4: uuidv4 } = require("uuid");
const sendMail = require("../config/mailService");
const mongoose = require("mongoose");
router.post("/addProduct", async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      price,
      stock,
      // color, // 2. DEĞİŞİKLİK: 'color' alanı request body'den kaldırıldı.
      description,
      mainImage,
      additionalImages,
      attributes, // Renk bilgisi artık bunun içinde gelecek
      discount,
      topPick = 0,
      discountStartDate,
      discountEndDate,
      groupId,
    } = req.body;

    // 3. DEĞİŞİKLİK: 'color' zorunlu alan kontrolünden çıkarıldı.
    if (
      !name ||
      !brand ||
      !category ||
      price == null ||
      stock == null ||
      !attributes // Örnek olarak Rengin attributes içinde zorunlu olduğunu varsayalım.
    ) {
      return res.status(400).json({
        message:
          "Lütfen isim, marka, kategori, fiyat, stok ve Renk özelliğini içeren attributes alanlarını doldurunuz.",
      });
    }

    // Marka ve Kategori kontrolü (Değişiklik yok)
    const brandFind = await Brand.findOne({ name: brand });
    if (!brandFind)
      return res.status(404).json({ message: "Belirtilen marka bulunamadı." });
    const categoryFind = await Category.findOne({ name: category });
    if (!categoryFind)
      return res.status(404).json({ message: "Kategori bulunamadı." });

    // Group ID belirleme (Değişiklik yok)
    let newGroupId = groupId;
    if (!groupId) {
      const existingProduct = await Product.findOne({ name });
      if (existingProduct) {
        newGroupId = existingProduct.groupId;
      } else {
        newGroupId = uuidv4();
      }
    }

    // 4. DEĞİŞİKLİK: Yeni ürün oluşturulurken 'color' alanı artık kullanılmıyor.
    const newProduct = new Product({
      name,
      brand: brandFind._id,
      category: categoryFind._id,
      price,
      stock,
      // color: color, // Kaldırıldı
      description,
      mainImage,
      additionalImages,
      attributes, // Gelen attributes objesi doğrudan atanıyor
      discount,
      topPick,
      discountStartDate,
      discountEndDate,
      groupId: newGroupId,
    });

    await newProduct.save();

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
      .populate("category")
      .populate({
        // Bu populate sayesinde sanal alanlar çalışacak
        path: "reviews",
        populate: {
          path: "userId",
          select: "name",
        },
      });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getProductById/:id", async (req, res) => {
  try {
    // 1. URL'deki ID ile istenen ürünü bul.
    const requestedProduct = await Product.findById(req.params.id).lean();

    if (!requestedProduct) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    // 2. Eğer ürünün bir groupId'si yoksa, sadece kendisini bir dizi içinde döndür.
    if (!requestedProduct.groupId) {
      const fullProduct = await Product.findById(req.params.id)
        .populate("brand", "name")
        .populate("category", "name")
        .populate({
          path: "reviews",
          populate: { path: "userId", select: "name" },
        });
      return res.status(200).json([fullProduct]);
    }

    // 3. Ürünün groupId'sini kullanarak, o gruptaki TÜM ürünleri bul.
    const allVariationsInGroup = await Product.find({
      groupId: requestedProduct.groupId,
    })
      .populate("brand", "name")
      .populate("category", "name")
      .populate({
        path: "reviews",
        populate: { path: "userId", select: "name" },
      });

    // 4. Frontend'e tüm ürün grubunu bir dizi olarak gönder.
    res.status(200).json(allVariationsInGroup);
  } catch (error) {
    console.error("Error fetching product group by id:", error);
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
    const productBeforeUpdate = await Product.findById(req.params.id);
    if (!productBeforeUpdate) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }
    const oldDiscount = productBeforeUpdate.discount || 0;

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
      topPick,
      discountStartDate,
      discountEndDate,
      brand,
      category,
    } = req.body;

    let brandFind = productBeforeUpdate.brand;
    if (brand) {
      const foundBrand = await Brand.findOne({ name: brand });
      if (foundBrand) brandFind = foundBrand._id;
    }

    let categoryFind = productBeforeUpdate.category;
    if (category) {
      const foundCategory = await Category.findOne({ name: category });
      if (foundCategory) categoryFind = foundCategory._id;
    }

    if (
      name &&
      categoryFind.toString() !== productBeforeUpdate.category.toString()
    ) {
      const existingProduct = await Product.findOne({
        name,
        category: categoryFind,
      });
      if (
        existingProduct &&
        existingProduct._id.toString() !== productBeforeUpdate._id.toString()
      ) {
        return res.status(400).json({
          message:
            "Bu kategori altında aynı isimde başka bir ürün zaten mevcut.",
        });
      }
    }

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
      topPick,
      discount,
      discountStartDate,
      discountEndDate,
      brand: brandFind,
      category: categoryFind,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedProductData,
      { new: true, runValidators: true }
    );

    if (updatedProduct) {
      const newDiscount = updatedProduct.discount || 0;
      if (newDiscount > 0 && newDiscount > oldDiscount) {
        console.log(
          "İndirim değişikliği algılandı. Bildirimler gönderiliyor..."
        );
        sendDiscountNotifications(updatedProduct);
      }
    }

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
      .populate("brand", "name") // Marka bilgisini al
      .populate("category", "name") // Kategori bilgisini al
      .populate({
        path: "reviews", // Yorumları doldur
        select: "rating", // Sanal alanların hesaplanması için sadece rating bilgisi yeterli
      });

    res.status(200).json(discountedProducts);
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getProductsByCategory/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

    // 1. Öncelikle gelen ID ile ilgili kategoriyi bulalım.
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı." });
    }

    let productQuery = {};

    // 2. Kategorinin ana mı yoksa alt kategori mi olduğunu kontrol edelim.
    if (category.parentCategory === null) {
      // Bu bir ANA KATEGORİ.
      // Bu ana kategoriye bağlı TÜM alt kategorilerin ID'lerini kullanarak bir sorgu oluşturuyoruz.
      // Mongoose'un '$in' operatörü, 'category' alanı, verdiğimiz dizideki ID'lerden BİRİ olan tüm ürünleri bulur.
      // 'category.subCategories' alanı, modelinizde alt kategori ID'lerini tutan dizidir.
      productQuery = { category: { $in: category.subCategories } };

      // Önemli Not: Eğer bir ana kategoriye doğrudan ürün eklenme ihtimali de varsa,
      // ve onları da getirmek isterseniz, sorguyu şöyle güncelleyebilirsiniz:
      // productQuery = { category: { $in: [categoryId, ...category.subCategories] } };
    } else {
      // Bu bir ALT KATEGORİ.
      // Sadece bu alt kategoriye ait ürünleri getireceğiz (eski mantık).
      productQuery = { category: categoryId };
    }

    // 3. Hazırladığımız sorguyu kullanarak ürünleri veritabanından çekelim.
    // Bu yapı sayesinde .populate() kodunu tekrar etmekten kurtuluruz.
    const products = await Product.find(productQuery)
      .populate("brand", "name")
      .populate("category", "name")
      .populate({
        path: "reviews",
        select: "rating",
      });

    // 4. Sonucu istemciye gönderelim.
    res.status(200).json({
      message: `${category.name} kategorisindeki ürünler başarıyla getirildi.`,
      category: category.name,
      count: products.length,
      products: products,
    });
  } catch (error) {
    console.error("Kategoriye göre ürünler getirilirken hata:", error);
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
});

router.get("/getProductsByBrand", async (req, res) => {
  try {
    const brandIds = req.query.brandIds ? req.query.brandIds.split(",") : [];
    const categoryId = req.query.categoryId;
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

    const pipeline = [];
    const matchConditions = {};

    // ====================== İSTEDİĞİNİZ ANA/ALT KATEGORİ MANTIĞI ======================
    if (categoryId) {
      // 1. Gelen ID'nin geçerli bir ObjectId formatında olduğundan emin olalım.
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res
          .status(400)
          .json({ message: "Geçersiz Kategori ID formatı." });
      }

      // 2. Gelen ID'ye sahip kategoriyi veritabanından bulalım.
      const category = await Category.findById(categoryId).lean();

      if (category) {
        if (
          category.parentCategory === null &&
          Array.isArray(category.subCategories) &&
          category.subCategories.length > 0
        ) {
          matchConditions.category = {
            $in: category.subCategories.map(
              (subId) => new mongoose.Types.ObjectId(subId)
            ),
          };
        } else {
          matchConditions.category = new mongoose.Types.ObjectId(categoryId);
        }
      } else {
        return res.status(200).json([]);
      }
    }

    if (brandIds.length > 0) {
      matchConditions.brand = {
        $in: brandIds.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    // Eğer filtre koşulu varsa, pipeline'a ilk $match aşamasını ekle (Bu kısım sizin kodunuzla aynı)
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    // --- Geri kalan pipeline adımları SİZİN ÇALIŞAN KODUNUZLA BİREBİR AYNI ---
    pipeline.push(
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviewDetails",
        },
      },
      {
        $addFields: {
          reviewCount: { $size: "$reviewDetails" },
          averageRating: { $ifNull: [{ $avg: "$reviewDetails.rating" }, 0] },
          discountedPrice: {
            $cond: {
              if: { $gt: ["$discount", 0] },
              then: {
                $subtract: [
                  "$price",
                  { $multiply: ["$price", { $divide: ["$discount", 100] }] },
                ],
              },
              else: "$price",
            },
          },
        },
      },
      {
        $match: {
          discountedPrice: {
            $gte: minPrice,
            $lte: maxPrice,
          },
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } }
    );

    const products = await Product.aggregate(pipeline);

    res.status(200).json(
      products.map((product) => ({
        ...product,
        id: product._id,
        averageRating: parseFloat((product.averageRating || 0).toFixed(1)),
      }))
    );
  } catch (error) {
    console.error("Filtreli ürün getirilirken hata:", error);
    res
      .status(500)
      .json({ success: false, message: "Sunucu hatası", error: error.message });
  }
});

router.get("/topPicks", async (req, res) => {
  try {
    const { brands } = req.query; // örn: "60d21b4667d0d8992e610c85,60d21b4667d0d8992e610c86"

    // Temel sorgumuz: Sadece topPick değeri 1 olan ürünleri getir.
    let query = { topPick: 1 };

    // Eğer frontend'den 'brands' parametresi (ID listesi) geldiyse,
    // sorgumuza marka filtresini ekliyoruz.
    if (brands) {
      // Frontend'den gelen virgülle ayrılmış ID string'ini bir diziye çeviriyoruz.
      const brandIds = brands.split(",");

      // Sorgumuza, 'brand' alanı bu ID'lerden herhangi birine eşit olanları
      // getirecek şekilde $in operatörünü ekliyoruz.
      //
      // ÖNCEKİ HATALI KISIM: Marka ID'lerini alıp tekrar isimle aramaya çalışıyordu.
      // DOĞRU YAKLAŞIM: Gelen ID'leri doğrudan kullanmak.
      query.brand = { $in: brandIds };
    }

    // Sorguyu tek bir yerde çalıştırıp, populate işlemlerini ekliyoruz.
    const topProducts = await Product.find(query)
      .populate("brand", "name") // Marka bilgisini al
      .populate({
        path: "reviews", // Yorumları doldur
        select: "rating", // Sanal alanların hesaplanması için sadece rating yeterli
      });

    res.status(200).json(topProducts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Top picks alınamadı", error: error.message });
  }
});
router.get("/getProductByBrandID/:brandId", async (req, res) => {
  try {
    const { brandId } = req.params;
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: "Belirtilen marka bulunamadı." });
    }

    // Yorumları populate ederek sanal alanların hesaplanmasını sağlıyoruz
    const products = await Product.find({ brand: brandId })
      .populate("brand", "name logo") // Marka bilgisini al (logo dahil)
      .populate("category", "name")
      .populate({
        path: "reviews",
        select: "rating", // Sadece rating bilgisi yeterli (optimizasyon)
      });

    // Başarılı yanıtı gönderelim. Artık `products` dizisindeki her ürün
    // averageRating ve reviewCount sanal alanlarını içerecek.
    res.status(200).json({
      message: `${brand.name} markasına ait ürünler başarıyla getirildi.`,
      count: products.length,
      products: products,
    });
  } catch (error) {
    console.error("Markaya göre ürünler getirilirken hata:", error);
    res
      .status(500)
      .json({ message: "Sunucu hatası oluştu.", error: error.message });
  }
});

async function sendDiscountNotifications(product) {
  try {
    console.log(`"${product.name}" için indirim bildirimi süreci başlatıldı.`);
    const productId = product._id;

    // 1. Ürünü favorilerine ekleyen kullanıcıları bul
    const usersWithFavorite = await User.find({ favorites: productId })
      .select("_id")
      .lean();
    const userIdsFromFavorites = usersWithFavorite.map((u) => u._id);

    // 2. Ürünü sepetinde bulunduran kullanıcıları bul
    const cartItems = await CartItem.find({ product: productId })
      .select("cartId")
      .lean();
    const cartIds = cartItems.map((item) => item.cartId);
    const carts = await Cart.find({ _id: { $in: cartIds } })
      .select("userId")
      .lean();
    const userIdsFromCarts = carts.map((cart) => cart.userId);

    // 3. Tüm ilgili kullanıcı ID'lerini birleştir ve tekilleştir
    const allInterestedUserIds = [
      ...new Set([
        ...userIdsFromFavorites.map((id) => id.toString()),
        ...userIdsFromCarts.map((id) => id.toString()),
      ]),
    ];

    if (allInterestedUserIds.length === 0) {
      console.log("İndirim bildirimi için ilgili kullanıcı bulunamadı.");
      return;
    }

    // 4. Kullanıcıların e-posta ve isim bilgilerini çek
    const usersToSend = await User.find({ _id: { $in: allInterestedUserIds } })
      .select("name email")
      .lean();

    // 5. Her kullanıcıya e-posta gönder
    const emailPromises = usersToSend.map((user) => {
      const subject = `Fiyat Düştü! 🎉 Beğendiğiniz Ürün İndirimde!`;
      const template = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2c3e50; text-align: center;">Harika Bir Haberimiz Var, ${
            user.name
          }!</h2>
          <p>Takip ettiğiniz veya sepetinize eklediğiniz bir üründe harika bir indirim başladı!</p>
          <div style="padding: 15px; background-color: #f8f9fa; border-radius: 5px; text-align: center; border: 1px solid #e9ecef;">
            <img src="${product.mainImage}" alt="${
        product.name
      }" style="max-width: 150px; margin-bottom: 10px; border-radius: 5px;"/>
            <h3 style="margin: 0; color: #34495e;">${product.name}</h3>
            <p style="text-decoration: line-through; color: #7f8c8d; font-size: 16px; margin: 5px 0;">Eski Fiyat: ${product.price.toFixed(
              2
            )} TL</p>
            <p style="font-size: 24px; font-weight: bold; color: #e74c3c; margin: 5px 0;">Yeni Fiyat: ${product.discountedPrice.toFixed(
              2
            )} TL</p>
            <a href="http://localhost:3000/productDetail/${
              product._id
            }" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px; font-weight: bold;">Ürüne Git</a>
          </div>
          <p style="text-align: center; margin-top: 20px; font-size: 12px; color: #95a5a6;">Bu fırsatı kaçırmayın!</p>
        </div>
      `;
      // Güncellenmiş sendMail fonksiyonunu çağırıyoruz
      return sendMail(user.email, subject, template);
    });

    await Promise.all(emailPromises);
    console.log(
      `${usersToSend.length} kullanıcıya indirim bildirimi başarıyla gönderildi.`
    );
  } catch (error) {
    console.error(
      "İndirim bildirimi gönderme sırasında bir hata oluştu:",
      error
    );
  }
}

module.exports = router;
