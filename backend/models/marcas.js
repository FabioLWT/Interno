const db = require("../config/db");

const Marcas = {
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS marcas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(50) NOT NULL
      )
    `;
    await db.query(query);
    console.log("Tabela 'marcas' criada ou já existente.");

    await db.query(
      "INSERT INTO marcas (nome) VALUES ($1) ON CONFLICT DO NOTHING",
      ["Toyota"]
    );
    await db.query(
      "INSERT INTO marcas (nome) VALUES ($1) ON CONFLICT DO NOTHING",
      ["Ford"]
    );
  },
};

module.exports = Marcas;
