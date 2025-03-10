const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth"); // Importe o middleware
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe); // Adicione o middleware aqui

module.exports = router;
