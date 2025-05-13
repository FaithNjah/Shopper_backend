const express = require('express');
const router = express.Router();
const Product = require('../Model/productModel'); 

// Test route
router.get('/', (req, res) => {
    res.send('connected!');
});

// Route to fetch and sort products from MongoDB
router.get('/shop', async (req, res) => {
    try {
        const sortBy = req.query.sortBy || 'name';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        // Validate sortBy field to prevent misuse
        const validSortFields = ['name', 'price', 'discount'];
        if (!validSortFields.includes(sortBy)) {
            return res.status(400).json({ message: `Invalid sort field: ${sortBy}` });
        }

        const products = await Product.find().sort({ [sortBy]: sortOrder });

        res.json({ sortBy, sortOrder, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'An error occurred while fetching products' });
    }
});

module.exports = router;
