const db = require("../config/db");

exports.getAll = async (req, res) => {
  console.log("Tentando buscar todos os veículos...");
  try {
    const { rows: vehicles } = await db.query(
      `SELECT v.id, v.placa, v.descricao, v.ano, v.modelo_id, COALESCE(m.nome, 'Modelo Desconhecido') AS modelo, COALESCE(b.nome, 'Marca Desconhecida') AS marca, b.id AS marca_id, v.cor, v.finalidade, v.zero_quilometro, v.nivel_conforto, v.criado_em, ST_Y(v.local_descanso::geometry) AS latitude, ST_X(v.local_descanso::geometry) AS longitude
       FROM veiculos v
       LEFT JOIN modelos m ON v.modelo_id = m.id
       LEFT JOIN marcas b ON m.marca_id = b.id
       ORDER BY v.placa ASC`
    );
    console.log(
      "Veículos retornados da query inicial:",
      vehicles.map((v) => ({
        id: v.id,
        placa: v.placa,
        modelo_id: v.modelo_id,
        modelo: v.modelo,
        marca: v.marca,
        marca_id: v.marca_id,
        latitude: v.latitude,
        longitude: v.longitude,
      }))
    );

    res.json(vehicles || []);
  } catch (error) {
    console.error("Erro ao buscar veículos:", error.stack);
    res
      .status(500)
      .json({ error: "Falha ao buscar veículos", details: error.message });
  }
};

exports.create = async (req, res) => {
  const {
    placa,
    descricao,
    ano,
    modelo_id,
    cor,
    finalidade,
    zero_quilometro,
    nivel_conforto,
    local_descanso,
    marca_id,
  } = req.body;
  console.log("Cadastrando veículo:", {
    placa,
    modelo_id,
    zero_quilometro,
    nivel_conforto,
    local_descanso,
    marca_id,
  });

  try {
    if (marca_id) {
      const marcaCheck = await db.query("SELECT 1 FROM marcas WHERE id = $1", [
        marca_id,
      ]);
      if (marcaCheck.rows.length === 0) {
        return res.status(400).json({ error: "Marca inválida" });
      }
    } else {
      return res.status(400).json({ error: "Marca é obrigatória" });
    }

    let finalModeloId;
    if (!modelo_id || isNaN(modelo_id) || modelo_id === null) {
      console.log("Verificando se o modelo já existe...");
      const modeloCheck = await db.query(
        "SELECT id FROM modelos WHERE nome = $1 AND marca_id = $2",
        [req.body.modelo || `Modelo_${placa}`, marca_id]
      );
      if (modeloCheck.rows.length > 0) {
        finalModeloId = modeloCheck.rows[0].id;
        console.log(
          `Modelo existente encontrado: ${
            req.body.modelo || `Modelo_${placa}`
          }, ID: ${finalModeloId}`
        );
      } else {
        console.log("Criando novo modelo para a marca existente...");
        const modeloResult = await db.query(
          "INSERT INTO modelos (nome, marca_id) VALUES ($1, $2) RETURNING id",
          [req.body.modelo || `Modelo_${placa}`, marca_id]
        );
        finalModeloId = modeloResult.rows[0].id;
        console.log(
          `Novo modelo criado: ${
            req.body.modelo || `Modelo_${placa}`
          }, ID: ${finalModeloId}`
        );
      }
    } else {
      const modeloCheck = await db.query(
        "SELECT 1 FROM modelos WHERE id = $1",
        [modelo_id]
      );
      if (modeloCheck.rows.length === 0) {
        return res.status(400).json({ error: "Modelo inválido" });
      }
      finalModeloId = modelo_id;
    }

    if (!local_descanso || !local_descanso.x || !local_descanso.y) {
      throw new Error("Coordenadas de local_descanso inválidas");
    }
    const localDescansoValue = `ST_GeomFromText('POINT(${local_descanso.x} ${local_descanso.y})', 4326)`;
    const { rows } = await db.query(
      `INSERT INTO veiculos (placa, descricao, ano, modelo_id, cor, finalidade, zero_quilometro, nivel_conforto, local_descanso) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ${localDescansoValue}) RETURNING *`,
      [
        placa,
        descricao,
        ano,
        finalModeloId,
        cor,
        finalidade,
        zero_quilometro,
        nivel_conforto,
      ]
    );
    await db.query(
      "INSERT INTO historico (veiculo_id, acao, descricao) VALUES ($1, $2, $3)",
      [rows[0].id, "criado", `Veículo ${placa} criado`]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro ao criar veículo:", error.stack);
    if (error.code === "23505") {
      if (error.constraint === "veiculos_placa_key") {
        res
          .status(400)
          .json({ error: "Placa já registrada", details: error.message });
      } else if (error.constraint === "modelos_nome_marca_id_unique") {
        res.status(400).json({
          error: "Modelo já registrado para esta marca",
          details: error.message,
        });
      } else {
        res
          .status(400)
          .json({ error: "Erro de unicidade", details: error.message });
      }
    } else {
      res
        .status(500)
        .json({ error: "Falha ao criar veículo", details: error.message });
    }
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    placa,
    descricao,
    ano,
    modelo_id,
    cor,
    finalidade,
    zero_quilometro,
    nivel_conforto,
    local_descanso,
    marca_id,
  } = req.body;
  console.log("Dados recebidos para atualização:", {
    id,
    placa,
    modelo_id,
    local_descanso,
    marca_id,
  });

  try {
    const { rows: currentVehicle } = await db.query(
      "SELECT placa FROM veiculos WHERE id = $1",
      [id]
    );
    if (currentVehicle.length === 0) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }
    const originalPlaca = currentVehicle[0].placa;

    let x, y;
    if (
      typeof local_descanso === "object" &&
      local_descanso.x != null &&
      local_descanso.y != null &&
      !isNaN(local_descanso.x) &&
      !isNaN(local_descanso.y)
    ) {
      x = local_descanso.x;
      y = local_descanso.y;
    } else {
      const { rows: currentVehicleCoords } = await db.query(
        "SELECT ST_X(local_descanso::geometry) AS x, ST_Y(local_descanso::geometry) AS y FROM veiculos WHERE id = $1",
        [id]
      );
      if (currentVehicleCoords.length === 0) {
        return res.status(404).json({ error: "Veículo não encontrado" });
      }
      x = currentVehicleCoords[0].x;
      y = currentVehicleCoords[0].y;
    }

    if (marca_id) {
      const marcaCheck = await db.query("SELECT 1 FROM marcas WHERE id = $1", [
        marca_id,
      ]);
      if (marcaCheck.rows.length === 0) {
        return res.status(400).json({ error: "Marca inválida" });
      }
    } else {
      return res.status(400).json({ error: "Marca é obrigatória" });
    }

    let finalModeloId;
    if (!modelo_id || isNaN(modelo_id) || modelo_id === null) {
      console.log("Verificando se o modelo já existe...");
      const modeloCheck = await db.query(
        "SELECT id FROM modelos WHERE nome = $1 AND marca_id = $2",
        [req.body.modelo || `Modelo_${placa}`, marca_id]
      );
      if (modeloCheck.rows.length > 0) {
        finalModeloId = modeloCheck.rows[0].id;
        console.log(
          `Modelo existente encontrado: ${
            req.body.modelo || `Modelo_${placa}`
          }, ID: ${finalModeloId}`
        );
      } else {
        console.log("Criando novo modelo para a marca existente...");
        const modeloResult = await db.query(
          "INSERT INTO modelos (nome, marca_id) VALUES ($1, $2) RETURNING id",
          [req.body.modelo || `Modelo_${placa}`, marca_id]
        );
        finalModeloId = modeloResult.rows[0].id;
        console.log(
          `Novo modelo criado: ${
            req.body.modelo || `Modelo_${placa}`
          }, ID: ${finalModeloId}`
        );
      }
    } else {
      const modeloCheck = await db.query(
        "SELECT 1 FROM modelos WHERE id = $1",
        [modelo_id]
      );
      if (modeloCheck.rows.length === 0) {
        return res.status(400).json({ error: "Modelo inválido" });
      }
      finalModeloId = modelo_id;
    }

    const localDescansoValue = `ST_GeomFromText('POINT(${x} ${y})', 4326)`;
    const { rows } = await db.query(
      `UPDATE veiculos SET placa = $1, descricao = $2, ano = $3, modelo_id = $4, cor = $5, finalidade = $6, zero_quilometro = $7, nivel_conforto = $8, local_descanso = ${localDescansoValue} WHERE id = $9 RETURNING *`,
      [
        placa || originalPlaca,
        descricao,
        ano,
        finalModeloId,
        cor,
        finalidade,
        zero_quilometro,
        nivel_conforto,
        id,
      ]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }
    await db.query(
      "INSERT INTO historico (veiculo_id, acao, descricao) VALUES ($1, $2, $3)",
      [id, "atualizado", `Veículo ${placa || originalPlaca} atualizado`]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar veículo:", error.stack);
    if (error.code === "23505") {
      if (error.constraint === "veiculos_placa_key") {
        res
          .status(400)
          .json({ error: "Placa já registrada", details: error.message });
      } else if (error.constraint === "modelos_nome_marca_id_unique") {
        res.status(400).json({
          error: "Modelo já registrado para esta marca",
          details: error.message,
        });
      } else {
        res
          .status(400)
          .json({ error: "Erro de unicidade", details: error.message });
      }
    } else if (error.code === "23503") {
      res
        .status(400)
        .json({ error: "ID de modelo inválido", details: error.message });
    } else {
      res
        .status(500)
        .json({ error: "Falha ao atualizar veículo", details: error.message });
    }
  }
};

exports.deleteVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: vehicleRows } = await db.query(
      "SELECT placa FROM veiculos WHERE id = $1",
      [id]
    );
    if (vehicleRows.length === 0) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }
    const placa = vehicleRows[0].placa;

    await db.query("DELETE FROM historico WHERE veiculo_id = $1", [id]);
    await db.query("DELETE FROM veiculos WHERE id = $1", [id]);

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar veículo:", error.stack);
    res
      .status(500)
      .json({ error: "Falha ao deletar veículo", details: error.message });
  }
};
