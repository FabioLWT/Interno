const db = require("../config/db");

exports.getAll = async (req, res) => {
  console.log("Tentando buscar o histórico...");
  try {
    const { rows } = await db.query(
      `SELECT h.id AS id, h.veiculo_id AS veiculo_id, h.acao AS acao, h.descricao AS descricao, h.criado_em AS data, 
              v.placa AS placa
       FROM historico h
       LEFT JOIN veiculos v ON h.veiculo_id = v.id
       ORDER BY h.criado_em DESC`
    );
    console.log(
      "Histórico encontrado:",
      rows.map((row) => ({
        id: row.id,
        veiculo_id: row.veiculo_id,
        acao: row.acao,
        descricao: row.descricao,
        data: row.data,
        placa: row.placa,
      }))
    );
    res.json(rows || []);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error.stack);
    res
      .status(500)
      .json({ error: "Falha ao buscar histórico", details: error.message });
  }
};

module.exports = exports;
