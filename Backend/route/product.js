const express = require('express');
const router = express.Router();
const Product = require('../models/product.js');
const Brand = require('../models/brand.js');
const Category = require('../models/category.js');



router.post("/addProduct", async (req, res) => {
    try {
        const { name, brand, category, price, stock, description, images, attributes, discount, discountStartDate, discountEndDate } = req.body;

        
        if (!name || !brand || !category || price == null || stock == null) {
            return res.status(400).json({ message: 'Gerekli alanları doldurunuz.' });
        }

        // Brandinini isim olarak alıyorum ve id sini yakalıyorum .
        const brandFind = await Brand.findOne({ name: brand });
        if (!brandFind) return res.status(404).json({ message: 'Belirtilen marka bulunamadı.' });

        // categoriyide isim olarak alıyorum ve id sini yakalıyorum .
        const categoryFind = await Category.findOne({ name: category });
        if (!categoryFind) return res.status(404).json({ message: 'Belirtilen kategori bulunamadı.' });

       
        const newProduct = new Product({
            name,
            brand: brandFind._id,
            category: categoryFind._id,
            price,
            stock,
            description,
            images,
            attributes,
            discount,
            discountStartDate,
            discountEndDate
        });

        
        await newProduct.save();

        // Brand ve Categorilerede ürünü ekliyorum.
        brandFind.products.push(newProduct._id);
        await brandFind.save();

        categoryFind.products.push(newProduct._id);
        await categoryFind.save();

        res.status(201).json({ message: 'Ürün başarıyla eklendi.', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
});


router.get("/getAllProducts", async (req, res) => {
    try {
        const products = await Product.find().populate('brand').populate('category');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
});


router.get("/getProductById/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('brand').populate('category');
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı.' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
});


router.get("/getProductByName/:name", async (req, res) => {
    try {
        const product = await Product.findOne({ name: req.params.name }).populate('brand').populate('category');
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı.' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
});


router.delete("/deleteProduct/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı.' });
        }

        // ürünü brand ve categoridende kaldırıyorum.
        await Brand.updateOne({ _id: product.brand }, { $pull: { products: product._id } });
        await Category.updateOne({ _id: product.category }, { $pull: { products: product._id } });

        //ürün siliniyor.
        await Product.findByIdAndDelete(req.params.id); 

        res.status(200).json({ message: 'Ürün başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
});



router.put("/updateProduct/:id", async (req, res) => {
    try {
        const { name, price, stock, description, images, attributes, discount, discountStartDate, discountEndDate } = req.body;

        // Alanları burada alıyorum ve eşitliyorum 
        const updatedProductData = {
            name,
            price,
            stock,
            description,
            images,
            attributes,
            discount,
            discountStartDate,
            discountEndDate
        };

        // Ürünü güncelliyorum
        const product = await Product.findByIdAndUpdate(req.params.id, updatedProductData, { new: true, runValidators: true });
        
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı.' });
        }

        res.status(200).json({ message: 'Ürün başarıyla güncellendi.', product });
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
});

  module.exports = router;