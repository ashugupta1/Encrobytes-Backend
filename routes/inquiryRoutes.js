const express = require("express");
const router = express.Router();
const Inquiry = require("../models/inquiryModel");

// POST route to create an inquiry
router.post("/inquiry", async (req, res) => {
  try {
    const newInquiry = new Inquiry(req.body);
    await newInquiry.save();
    res.status(201).json({ message: "Inquiry submitted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit inquiry", error: err });
  }
});

module.exports = router;
