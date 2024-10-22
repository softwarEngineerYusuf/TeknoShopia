const express=require("express");
router=express.Router();

const Category=require("../models/category.js");


router.post("/addCategory" , async(req ,res)=>{

    const {name}=req.body;
    if (!name) {
      return res.status(400).json({ message: 'Kategori ismi gerekli.' });
    }
    
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

     
    try {
        const existingCategory =await Category.findOne({name: formattedName});
        if(existingCategory){
            return res.status(400).json({message:"Bu isimde bir kategori zaten mevcut."});
        }

        const newCategory=new Category({
          name: formattedName,
        });

        await newCategory.save();

        res.status(201).json({
            message:"Kategori başarıyla eklendi.",
            category:newCategory.name
        });

        
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
})

router.get("/getAllCategories" , async(req ,res)=>{

    try {
        const categories =await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
})

router.get('/getCategoryById/:id', async (req, res) => {
    try {
      const category = await Category.findById(req.params.id); 
      if (!category) {
        return res.status(404).json({ message: 'Kategori bulunamadı.' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
  });

router.get('/getCategoryByName/:name', async (req, res) => {
    try {
      const formattedName = req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1).toLowerCase();
      const category = await Category.findOne({ name: formattedName });
      if (!category) {
        return res.status(404).json({ message: 'Kategori bulunamadı.' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
});
  
module.exports = router;