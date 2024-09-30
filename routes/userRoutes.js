const express = require("express");
const { register, login } = require("../controllers/userController");
const router = express.Router();

// Register Route
router.post("/api/register", register);

// Login Route
router.post("/api/login", login);

module.exports = router;
