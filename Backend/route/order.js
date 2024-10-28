const express = require('express');
const router = express.Router();
const Order = require('../models/order.js');
const User = require('../models/user.js');
const Product = require('../models/product.js');

router.post("/addOrder", async (req, res) => {
    try {
        const { userId, products, totalPrice, deliveryAddress } = req.body;

        if (!userId || !products || !totalPrice || !deliveryAddress) {
            return res.status(400).json({ message: 'Lütfen gerekli tüm alanları doldurun.' });
        }

        // Yeni siparişi oluştur
        const newOrder = new Order({
            userId,
            products,
            totalPrice,
            deliveryAddress,
        });

        await newOrder.save();

        // Kullanıcıyada siparişi ekliyorum.
        await User.findByIdAndUpdate(userId, { $push: { orders: newOrder._id } });

        res.status(201).json({ message: 'Sipariş başarıyla oluşturuldu.', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
});

router.get("/getAllOrders", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'products.product',
                select: 'name price description' 
            })
            .populate({
                path: 'deliveryAddress',
                select: 'street city postalCode country' 
            });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'Hiç sipariş bulunamadı.' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
});


    router.get("/getOrdersByUserId/:userId", async (req, res) => {
        try {
            const orders = await Order.find({ userId: req.params.userId })
                .populate({
                    path: 'products.product', // products içindeki her bir product'ı doldur
                    select: 'name price description' // İhtiyaç duyduğun alanları seç
                })
                .populate({
                    path: 'deliveryAddress', 
                    select: 'street city postalCode country' 
                });
    
            if (!orders || orders.length === 0) {
                return res.status(404).json({ message: 'Bu kullanıcı için sipariş bulunamadı.' });
            }
    
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
        }
    });


    router.get("/getOrderById/:orderId", async (req, res) => {
        try {
            const order = await Order.findById(req.params.orderId)
                .populate({
                    path: 'products.product', 
                    select: 'name price description' 
                })
                .populate({
                    path: 'deliveryAddress', 
                    select: 'street city postalCode country' 
                });
    
            if (!order) {
                return res.status(404).json({ message: 'Sipariş bulunamadı.' });
            }
    
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
        }
    });
  

    router.delete("/deleteOrder/:orderId", async (req, res) => {
        try {
            const orderId = req.params.orderId;
    
           //siparişi bulup siliyorum.
            const order = await Order.findByIdAndDelete(orderId);
    
            if (!order) {
                return res.status(404).json({ message: 'Sipariş bulunamadı.' });
            }
    
            // sipariş silinirse kullanıcıdanda kaldırıyorum.
            await User.findByIdAndUpdate(order.userId, { $pull: { orders: orderId } });
    
            res.status(200).json({ message: 'Sipariş başarıyla silindi.' });
        } catch (error) {
            res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
        }
    });
  module.exports = router;