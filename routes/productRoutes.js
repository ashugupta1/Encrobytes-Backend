const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const multer = require("multer");
const path = require("path");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Function to generate the next serial number
const generateSerialNumber = async () => {
  const lastProduct = await Product.findOne().sort({ serialNumber: -1 });
  return lastProduct ? lastProduct.serialNumber + 1 : 1;
};

// POST route to add a new product
// POST route to add a new product
router.post("/product", upload.single("image"), async (req, res) => {
  try {
    const { category, title, description } = req.body;
    const newProduct = new Product({
      category,
      title,
      description,
      imageUrl: `/uploads/${req.file.filename}`,
    });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", newProduct });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Failed to add product", error: err });
  }
});

// PUT route to update product by ID
router.put("/product/:id", upload.single("image"), async (req, res) => {
  try {
    const { category, title, description } = req.body;
    const updatedData = { category, title, description };

    if (req.file) {
      updatedData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Failed to update product", error: err });
  }
});

// DELETE route to remove product by ID
router.delete("/product/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product", error: err });
  }
});

// GET route to fetch all products
router.get("/product", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err });
  }
});

module.exports = router;
