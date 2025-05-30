const express = require('express');
const router = express.Router();
const Product = require('../Model/productModel');
const uploadMiddleware = require('../uploadMiddleware');
const upload = uploadMiddleware('products');
const verifyOwnerToken = require('../Middlewares/ownerToken');

// POST /products/create — Secure route to create a product
router.post('/create', verifyOwnerToken, upload.single('image'), async (req, res) => {
  console.log('Owner:', req.owner?.fullname); // Optional chaining to avoid crashes

  const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;
  const imageUrl = req.file?.path;

  if (!imageUrl || !name || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const product = await Product.create({
      image: imageUrl,
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Error creating product:', error);

    res.status(500).json({
      error: 'Error creating product',
      details: error.message // Show specific error message in Postman
    });
  }
});

module.exports = router;
