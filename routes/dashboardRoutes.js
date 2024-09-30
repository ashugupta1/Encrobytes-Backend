const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

// GET total number of products and categories
router.get("/counts", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();

    res.status(200).json({
      products: productCount,
      categories: categoryCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching counts" });
  }
});

module.exports = router;
