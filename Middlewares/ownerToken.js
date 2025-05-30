const jwt = require('jsonwebtoken');
const Owner = require('../Model/ownerModel');

const verifyOwnerToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const owner = await Owner.findById(decoded.id);
    if (!owner) {
      return res.status(401).json({ error: 'Owner not found' });
    }

    req.owner = owner;
    next();
  } catch (err) {
    console.error('Owner token verification failed:', err);
    return res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = verifyOwnerToken;
