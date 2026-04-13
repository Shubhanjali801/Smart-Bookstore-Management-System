const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  author:      { type: String, required: true },
  genre:       { type: String },
  price:       { type: Number, required: true },
  stock:       { type: Number, default: 0 },
  isbn:        { type: String, unique: true },
  description: { type: String },
  imageUrl:    { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);