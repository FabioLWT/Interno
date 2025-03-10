const express = require("express");
const historicoController = require("../controllers/historicoController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get("/", authMiddleware, historicoController.getAll);

module.exports = router;
