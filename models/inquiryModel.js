const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  product: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Inquiry", inquirySchema);
