const express = require("express");
const {
  getAll,
  create,
  update,
  deleteVehicle,
} = require("../controllers/veiculosController");

// Middleware de autenticação
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Rotas protegidas por autenticação
router.get("/", authMiddleware, getAll); // Lista todos os veículos
router.post("/", authMiddleware, create); // Cria um novo veículo
router.put("/:id", authMiddleware, update); // Atualiza um veículo existente
router.delete("/:id", authMiddleware, deleteVehicle); // Deleta um veículo

module.exports = router;
