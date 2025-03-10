const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const veiculosRoutes = require("./routes/veiculos");
const { initializeDatabase } = require("./models");
const historicoRoutes = require("./routes/historico");

const app = express();

// Configuração do CORS para permitir o frontend na porta 3000
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Adicionar OPTIONS para pré-voo
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"], // Adicionar Cache-Control
    optionsSuccessStatus: 200, // Resposta 200 para requisições OPTIONS
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/veiculos", veiculosRoutes);
app.use("/historico", historicoRoutes);

initializeDatabase().then(() => {
  app.listen(4000, () => console.log("Servidor backend rodando na porta 4000"));
});
