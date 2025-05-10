const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: Number, required: true },
    description: { type: String, required: false },  // Optional field
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },  // Reference to Category
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
  });

module.exports = mongoose.model('Product', productSchema);