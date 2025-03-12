const express = require("express");
const {
  getAll,
  create,
  update,
  deleteVehicle,
} = require("../controllers/veiculosController");

const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get("/", authMiddleware, getAll);
router.post("/", authMiddleware, create);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, deleteVehicle);

module.exports = router;
