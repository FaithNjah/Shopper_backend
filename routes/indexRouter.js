const express = require('express');
const router = express.Router();
const Product = require('../Model/productModel'); 
const userModel = require('../Model/userModel'); 
const {isLoggedIn} = require('../Middlewares/isLoggedIn')

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


// Add to cart
// router.post('/add-to-cart/:productId', isLoggedIn, async (req, res) => {
//   try {
//     const productId = req.params.productId;
//     const userId = req.user._id; // Make sure req.user is populated via middleware

//     // Update user's cart
//     const updatedUser = await userModel.findByIdAndUpdate(
//       userId,
//       { $push: { cart: productId } },
//       { new: true }
//     ).populate('cart'); // Optional: populate for easier frontend testing

//     res.status(200).json({
//       message: 'Product added to cart',
//       cart: updatedUser.cart, // optional: send cart contents
//     });
//   } catch (error) {
//     console.error('Add to cart error:', error);
//     res.status(500).json({ error: 'Failed to add product to cart' });
//   }
// });


module.exports = router;
