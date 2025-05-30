// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const userModel = require('../Model/userModel');
const { isLoggedIn } = require('../Middlewares/isLoggedIn');

// Add to Cart Route
router.post('/add-to-cart/:productId', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    console.log('Add to cart route hit');
    console.log('User ID:', userId);
    console.log('Product ID:', productId);

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Optional: Check if product exists in DB (you can add a Product model check here)

    await userModel.findByIdAndUpdate(userId, {
      $push: { cart: productId }
    });

    return res.status(200).json({ message: 'Product successfully added to cart' });
  } catch (error) {
    console.error('Error in add-to-cart:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



router.post('/remove-from-cart/:productId', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    // Remove productId from user's cart array
    await userModel.findByIdAndUpdate(userId, {
      $pull: { cart: productId }
    });

    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove product from cart' });
  }
});

router.get('/cart', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId).populate('cart');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ cartItems: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch cart items' });
  }
});

module.exports = router;
