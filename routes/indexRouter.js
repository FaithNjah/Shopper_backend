const express = require('express');
const router = express.Router();

// Mocked product data (instead of fetching from the database)
const mockProducts = [
    { _id: 1, name: 'Product 1', price: 10, discount: 5 },
    { _id: 2, name: 'Product 2', price: 20, discount: 10 },
    { _id: 3, name: 'Product 3', price: 30, discount: 15 },
    { _id: 4, name: 'Product 4', price: 40, discount: 20 },
    { _id: 5, name: 'Remedyze', price: 39.99, discount:5 }
];

// Test route to check if the server is connected
router.get('/', (req, res) => {
    res.send('connected!');
});

// Route to get products (mocked data) and sort them
router.get('/shop', (req, res) => {
    try {
        const sortBy = req.query.sortBy || 'name';  // Default to sorting by 'name'
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;  // Default to ascending order

        // Mock sorting (sort the mockProducts array)
        const sortedProducts = mockProducts.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) {
                return sortOrder * -1;  // Descending order
            }
            if (a[sortBy] > b[sortBy]) {
                return sortOrder * 1;  // Ascending order
            }
            return 0;
        });

        // Return the sorted products as JSON
        res.json({ sortBy, sortOrder, products: sortedProducts });
    } catch (error) {
        // Catch and log any errors that happen during the request
        console.error('Error fetching products:', error);
        
        // Send a 500 Internal Server Error response with a custom error message
        res.status(500).json({ message: 'An error occurred while fetching products' });
    }
});



module.exports = router;
