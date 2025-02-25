const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const veiculosRoutes = require("./routes/veiculos");
const { initializeDatabase } = require("./models");

const app = express();

// Configuração do CORS para permitir o frontend na porta 3000
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/veiculos", veiculosRoutes);

initializeDatabase().then(() => {
  app.listen(4000, () => console.log("Servidor backend rodando na porta 4000"));
});
