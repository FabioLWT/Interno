const db = require("../config/db");
const Usuarios = require("./usuarios");
const Marcas = require("./marcas");
const Modelos = require("./modelos");
const Veiculos = require("./veiculos");
const Historico = require("./historico");

const initializeDatabase = async () => {
  try {
    await Marcas.createTable();
    await Modelos.createTable();
    await Usuarios.createTable();
    await Veiculos.createTable();
    await Historico.createTable();
    console.log("Banco de dados inicializado com sucesso!");
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error.stack);
  }
};

module.exports = {
  Usuarios,
  Marcas,
  Modelos,
  Veiculos,
  Historico,
  initializeDatabase,
};
