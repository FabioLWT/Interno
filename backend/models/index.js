const db = require("../config/db");
const Usuarios = require("./usuarios");
const Marcas = require("./marcas");
const Modelos = require("./modelos");
const Veiculos = require("./veiculos");
const Historico = require("./historico");

const initializeDatabase = async () => {
  try {
    // Ordem importa devido às chaves estrangeiras
    await Marcas.createTable(); // Sem dependências
    await Modelos.createTable(); // Depende de marcas
    await Usuarios.createTable(); // Sem dependências
    await Veiculos.createTable(); // Depende de modelos
    await Historico.createTable(); // Depende de veiculos
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
