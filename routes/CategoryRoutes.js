const express = require("express");
const multer = require("multer");
const path = require("path");
const Category = require("../models/categoryModel");

const router = express.Router();

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
    // Save images in the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filenames
  },
});

const upload = multer({ storage: storage });

// POST route to add category
// router.post("/category", upload.single("image"), async (req, res) => {
//   try {
//     const { serialNumber, name } = req.body;
//     let imageUrl = null;

//     if (req.file) {
//       imageUrl = `/uploads/${req.file.filename}`; // Store relative path
//     }

//     const category = new Category({ serialNumber, name, imageUrl });
//     await category.save();
//     res.status(201).json({ message: "Category added successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error submitting category", error });
//   }
// });

router.post("/category", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    let imageUrl = null;

    // Check if an image was uploaded
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`; // Store relative path
    }

    // Get the category with the highest serial number
    const lastCategory = await Category.findOne().sort({ serialNumber: -1 });

    // Increment the serial number
    const newSerialNumber = lastCategory ? lastCategory.serialNumber + 1 : 1;

    // Create a new category with the incremented serial number
    const category = new Category({
      serialNumber: newSerialNumber,
      name,
      imageUrl,
    });

    // Save the new category
    await category.save();
    res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting category", error });
  }
});

// GET route to fetch all categories
router.get("/category", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories", error: err });
  }
});

// PUT route to update category by ID
router.put("/category/:id", upload.single("image"), async (req, res) => {
  try {
    const { serialNumber, name } = req.body;
    let updatedData = { serialNumber, name };

    if (req.file) {
      updatedData.imageUrl = `/uploads/${req.file.filename}`;
    }

    await Category.findByIdAndUpdate(req.params.id, updatedData);
    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
});

// DELETE route to remove category by ID
router.delete("/category/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
});

module.exports = router;
