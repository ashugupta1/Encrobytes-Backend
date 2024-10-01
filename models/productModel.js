const mongoose = require("mongoose");

// Define the product schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  serialNumber: { type: Number, unique: false }, // Ensure it's unique
});

// Pre-save hook to assign serialNumber if null
productSchema.pre("save", async function (next) {
  if (this.isNew && !this.serialNumber) {
    // Find the highest serialNumber in the collection and assign the next number
    const lastProduct = await this.constructor
      .findOne()
      .sort({ serialNumber: -1 });
    this.serialNumber = lastProduct ? lastProduct.serialNumber + 1 : 1;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
