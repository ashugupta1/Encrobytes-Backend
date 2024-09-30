const Category = require("../models/Category");

const checkDuplicateSerialNumber = async (req, res, next) => {
  const { serialNumber } = req.body;
  const category = await Category.findOne({ serialNumber });

  if (category) {
    return res.status(400).json({ message: "Serial number already exists!" });
  }
  next();
};

module.exports = { checkDuplicateSerialNumber };
