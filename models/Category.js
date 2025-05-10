const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: Number, required: true },
    description: { type: String, required: false },  // Optional field,
    createdAt: { type: Date, default: Date.now }
  });

module.exports = mongoose.model('Category', categorySchema);