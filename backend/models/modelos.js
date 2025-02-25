const db = require("../config/db");

const Modelos = {
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS modelos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        marca_id INTEGER REFERENCES marcas(id)
      )
    `;
    await db.query(query);
    console.log("Tabela 'modelos' criada ou já existente.");
  },
};

module.exports = Modelos;
