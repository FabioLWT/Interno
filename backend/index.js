const express = require("express");
const authRoutes = require("./routes/auth");
const veiculosRoutes = require("./routes/veiculos");
const { initializeDatabase } = require("./models");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/veiculos", veiculosRoutes);

// Inicializa o banco e depois inicia o servidor
initializeDatabase()
  .then(() => {
    app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
  })
  .catch((error) => {
    console.error("Erro ao iniciar o servidor:", error);
  });
