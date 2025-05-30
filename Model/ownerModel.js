const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  picture: String // Optional: for profile image later
});

module.exports = mongoose.model('Owner', ownerSchema);
