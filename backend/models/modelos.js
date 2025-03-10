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

    // Inserções de dados de teste
    await db.query(
      "INSERT INTO modelos (nome, marca_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      ["Corolla", 1]
    );
    await db.query(
      "INSERT INTO modelos (nome, marca_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      ["Focus", 2]
    );
  },
};

module.exports = Modelos;
