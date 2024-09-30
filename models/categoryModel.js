const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  serialNumber: { type: Number, required: true },
  name: { type: String, required: true },
  imageUrl: { type: String }, // Store image URL or file path
});

module.exports = mongoose.model("Category", categorySchema);
