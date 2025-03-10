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

    // Busca o id do veículo com placa 'ABC1234' antes de inserir no historico
    const { rows } = await db.query(
      "SELECT id FROM veiculos WHERE placa = $1 LIMIT 1",
      ["ABC1234"]
    );
    if (rows.length > 0) {
      await db.query(
        "INSERT INTO historico (veiculo_id, acao, descricao) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
        [rows[0].id, "criado", "Veículo ABC1234 criado"]
      );
    }
  },
};

module.exports = Historico;
