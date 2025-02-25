const db = require("../config/db");

const Historico = {
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS historico (
        id SERIAL PRIMARY KEY,
        veiculo_id INTEGER REFERENCES veiculos(id),
        acao VARCHAR(50) NOT NULL,
        descricao TEXT,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.query(query);
    console.log("Tabela 'historico' criada ou já existente.");
  },
};

module.exports = Historico;
