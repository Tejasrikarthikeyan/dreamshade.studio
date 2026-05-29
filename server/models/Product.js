const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'Pencil Sketch' },
  year: { type: String, default: '2026' }
});

module.exports = mongoose.model("Product", productSchema);