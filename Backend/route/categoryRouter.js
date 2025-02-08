const express = require("express");
router = express.Router();

const Category = require("../models/category.js");

router.post("/addCategory", async (req, res) => {
  const { name, parentCategory } = req.body;

  try {
    if (
      parentCategory === null ||
      parentCategory === undefined ||
      parentCategory === ""
    ) {
      const newCategory = new Category({ name });
      await newCategory.save();
      return res.status(201).json({
        message: "Ana kategori başarıyla oluşturuldu",
        category: newCategory,
      });
    }

    const parent = await Category.findById(parentCategory);
    if (!parent) {
      return res.status(400).json({ message: "Geçersiz ana kategori" });
    }

    const newSubCategory = new Category({ name, parentCategory });
    await newSubCategory.save();

    parent.subCategories.push(newSubCategory._id);
    await parent.save();

    return res.status(201).json({
      message: "Alt kategori başarıyla oluşturuldu",
      category: newSubCategory,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
});

router.get("/getAllMainCategories", async (req, res) => {
  try {
    const mainCategories = await Category.find({ parentCategory: null });

    return res.status(200).json({ categories: mainCategories });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
});

router.get("/getAllSubCategories", async (req, res) => {
  try {
    const subCategories = await Category.find({ parentCategory: { $ne: null } })
      .populate("parentCategory", "name")
      .exec();

    if (subCategories.length === 0) {
      return res.status(404).json({ message: "Alt kategori bulunamadı" });
    }

    return res.status(200).json(subCategories);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Sunucu hatası, alt kategoriler getirilemedi" });
  }
});

router.get(
  "/getAllSubCategoriesByMainCategoryId/:categoryId",
  async (req, res) => {
    const { categoryId } = req.params;

    try {
      const category = await Category.findById(categoryId);

      if (!category) {
        return res.status(404).json({ message: "Kategori bulunamadı" });
      }

      const subCategories = await Category.find({ parentCategory: categoryId });

      return res.status(200).json({
        mainCategory: category,
        subCategories: subCategories,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Sunucu hatası" });
    }
  }
);

router.get("/getMainCategoryById/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category || category.parentCategory !== null) {
      return res.status(404).json({
        message: "Ana kategori bulunamadı veya geçersiz kategori ID'si",
      });
    }

    return res.status(200).json({ category });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
});

router.get("/getSubCategoryById/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const subCategory = await Category.findById(id);

    if (!subCategory || subCategory.parentCategory === null) {
      return res.status(404).json({
        message: "Alt kategori bulunamadı veya geçersiz kategori ID'si",
      });
    }

    return res.status(200).json({ subCategory });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
});

// router.get("/getCategoryByName/:name", async (req, res) => {
//   try {
//     const formattedName =
//       req.params.name.charAt(0).toUpperCase() +
//       req.params.name.slice(1).toLowerCase();
//     const category = await Category.findOne({ name: formattedName });
//     if (!category) {
//       return res.status(404).json({ message: "Kategori bulunamadı." });
//     }
//     res.status(200).json(category);
//   } catch (error) {
//     res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
//   }
// });

module.exports = router;
