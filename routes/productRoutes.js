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

// POST route to add a new product
router.post("/product", upload.single("image"), async (req, res) => {
  try {
    const { serialNumber, name, category } = req.body;
    const newProduct = new Product({
      serialNumber,
      name,
      category,
      imageUrl: `/uploads/${req.file.filename}`,
    });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", newProduct });
  } catch (err) {
    res.status(500).json({ message: "Failed to add product", error: err });
  }
});

// PUT route to update product by ID
router.put("/product/:id", upload.single("image"), async (req, res) => {
  try {
    const { serialNumber, name, category } = req.body;
    const updatedData = { serialNumber, name, category };

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
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err });
  }
});

module.exports = router;
