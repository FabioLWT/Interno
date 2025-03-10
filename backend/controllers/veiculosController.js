const db = require("../config/db");

exports.getAll = async (req, res) => {
  console.log("Tentando buscar todos os veículos...");
  try {
    const { rows: vehicles } = await db.query(
      "SELECT v.*, COALESCE(m.nome, 'Modelo Desconhecido') AS modelo, COALESCE(b.nome, 'Marca Desconhecida') AS marca, ST_X(v.local_descanso::geometry) AS latitude, ST_Y(v.local_descanso::geometry) AS longitude FROM veiculos v LEFT JOIN modelos m ON v.modelo_id = m.id LEFT JOIN marcas b ON m.marca_id = b.id ORDER BY v.placa ASC"
    );
    console.log(
      "Veículos retornados da query inicial:",
      vehicles.map((v) => ({
        id: v.id,
        placa: v.placa,
        modelo_id: v.modelo_id,
        modelo: v.modelo,
        marca: v.marca,
      }))
    );

    // Verificar e cadastrar marcas e modelos ausentes
    for (const vehicle of vehicles) {
      if (!vehicle.id || !vehicle.placa) {
        console.warn(`Veículo inválido encontrado: ${JSON.stringify(vehicle)}`);
        continue;
      }

      if (
        vehicle.modelo === "Modelo Desconhecido" ||
        vehicle.marca === "Marca Desconhecida"
      ) {
        console.log(
          `Ajustando modelo/marca para veículo ${vehicle.placa} com modelo_id ${
            vehicle.modelo_id || "null"
          }`
        );

        // Verificar ou criar marca
        let marcaId;
        try {
          const marcaResult = await db.query(
            "INSERT INTO marcas (nome) VALUES ($1) ON CONFLICT (nome) DO UPDATE SET nome = EXCLUDED.nome RETURNING id",
            [`Marca_${vehicle.placa}`]
          );
          if (!marcaResult.rows[0]?.id) {
            throw new Error(`Falha ao criar marca para ${vehicle.placa}`);
          }
          marcaId = marcaResult.rows[0].id;
          console.log(
            `Marca criada para ${vehicle.placa}: Marca_${vehicle.placa}, ID: ${marcaId}`
          );
        } catch (error) {
          console.error(
            `Erro ao processar marca para veículo ${vehicle.placa}:`,
            error.message
          );
          continue;
        }

        // Verificar ou criar modelo
        let modeloId;
        try {
          const modeloResult = await db.query(
            "INSERT INTO modelos (nome, marca_id) VALUES ($1, $2) ON CONFLICT (nome, marca_id) DO UPDATE SET nome = EXCLUDED.nome, marca_id = EXCLUDED.marca_id RETURNING id",
            [`Modelo_${vehicle.placa}`, marcaId]
          );
          if (!modeloResult.rows[0]?.id) {
            throw new Error(`Falha ao criar modelo para ${vehicle.placa}`);
          }
          modeloId = modeloResult.rows[0].id;
          console.log(
            `Modelo criado para ${vehicle.placa}: Modelo_${vehicle.placa}, ID: ${modeloId}`
          );
        } catch (error) {
          console.error(
            `Erro ao processar modelo para veículo ${vehicle.placa}:`,
            error.message
          );
          continue;
        }

        // Atualizar o modelo_id do veículo
        try {
          await db.query("UPDATE veiculos SET modelo_id = $1 WHERE id = $2", [
            modeloId,
            vehicle.id,
          ]);
          console.log(
            `Atualizado modelo_id de ${vehicle.placa} para ${modeloId}`
          );
        } catch (error) {
          console.error(
            `Erro ao atualizar modelo_id para veículo ${vehicle.placa}:`,
            error.message
          );
          continue;
        }
      }
    }

    // Reconsultar os veículos após ajustes
    const { rows } = await db.query(
      "SELECT v.*, COALESCE(m.nome, 'Modelo Desconhecido') AS modelo, COALESCE(b.nome, 'Marca Desconhecida') AS marca, ST_X(v.local_descanso::geometry) AS latitude, ST_Y(v.local_descanso::geometry) AS longitude FROM veiculos v LEFT JOIN modelos m ON v.modelo_id = m.id LEFT JOIN marcas b ON m.marca_id = b.id ORDER BY v.placa ASC"
    );
    console.log(
      "Veículos encontrados no banco após ajustes:",
      rows.map((v) => ({
        id: v.id,
        placa: v.placa,
        modelo: v.modelo,
        marca: v.marca,
      }))
    );
    res.json(rows || []);
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
  } = req.body;
  console.log("Cadastrando veículo:", {
    placa,
    modelo_id,
    zero_quilometro,
    nivel_conforto,
    local_descanso,
  });

  try {
    // Verificar se o modelo_id existe
    let finalModeloId = modelo_id;
    if (!modelo_id || isNaN(modelo_id) || modelo_id === null) {
      console.log("modelo_id inválido ou não fornecido, criando um novo...");
      const marcaResult = await db.query(
        "INSERT INTO marcas (nome) VALUES ($1) ON CONFLICT (nome) DO UPDATE SET nome = EXCLUDED.nome RETURNING id",
        [`Marca_${placa}`]
      );
      const marcaId = marcaResult.rows[0].id;
      const modeloResult = await db.query(
        "INSERT INTO modelos (nome, marca_id) VALUES ($1, $2) ON CONFLICT (nome, marca_id) DO UPDATE SET nome = EXCLUDED.nome, marca_id = EXCLUDED.marca_id RETURNING id",
        [`Modelo_${placa}`, marcaId]
      );
      finalModeloId = modeloResult.rows[0].id;
      console.log(
        `Novo modelo criado para ${placa}: Modelo_${placa}, ID: ${finalModeloId}`
      );
    } else {
      const modeloCheck = await db.query(
        "SELECT 1 FROM modelos WHERE id = $1",
        [modelo_id]
      );
      if (modeloCheck.rows.length === 0) {
        console.log("modelo_id não existe, criando um novo...");
        const marcaResult = await db.query(
          "INSERT INTO marcas (nome) VALUES ($1) ON CONFLICT (nome) DO UPDATE SET nome = EXCLUDED.nome RETURNING id",
          [`Marca_${placa}`]
        );
        const marcaId = marcaResult.rows[0].id;
        const modeloResult = await db.query(
          "INSERT INTO modelos (nome, marca_id) VALUES ($1, $2) ON CONFLICT (nome, marca_id) DO UPDATE SET nome = EXCLUDED.nome, marca_id = EXCLUDED.marca_id RETURNING id",
          [`Modelo_${placa}`, marcaId]
        );
        finalModeloId = modeloResult.rows[0].id;
        console.log(
          `Novo modelo criado para ${placa}: Modelo_${placa}, ID: ${finalModeloId}`
        );
      }
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
    res
      .status(500)
      .json({ error: "Falha ao criar veículo", details: error.message });
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
  } = req.body;
  console.log("Dados recebidos para atualização:", {
    id,
    placa,
    modelo_id,
    local_descanso,
  });

  try {
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
      const { rows: currentVehicle } = await db.query(
        "SELECT ST_X(local_descanso::geometry) AS x, ST_Y(local_descanso::geometry) AS y FROM veiculos WHERE id = $1",
        [id]
      );
      if (currentVehicle.length === 0) {
        return res.status(404).json({ error: "Veículo não encontrado" });
      }
      x = currentVehicle[0].x;
      y = currentVehicle[0].y;
    }

    // Verificar ou criar modelo_id
    let finalModeloId = modelo_id;
    if (!modelo_id || isNaN(modelo_id) || modelo_id === null) {
      console.log("modelo_id inválido ou não fornecido, criando um novo...");
      const marcaResult = await db.query(
        "INSERT INTO marcas (nome) VALUES ($1) ON CONFLICT (nome) DO UPDATE SET nome = EXCLUDED.nome RETURNING id",
        [`Marca_${placa}`]
      );
      const marcaId = marcaResult.rows[0].id;
      const modeloResult = await db.query(
        "INSERT INTO modelos (nome, marca_id) VALUES ($1, $2) ON CONFLICT (nome, marca_id) DO UPDATE SET nome = EXCLUDED.nome, marca_id = EXCLUDED.marca_id RETURNING id",
        [`Modelo_${placa}`, marcaId]
      );
      finalModeloId = modeloResult.rows[0].id;
      console.log(
        `Novo modelo criado para ${placa}: Modelo_${placa}, ID: ${finalModeloId}`
      );
    } else {
      const modeloCheck = await db.query(
        "SELECT 1 FROM modelos WHERE id = $1",
        [modelo_id]
      );
      if (modeloCheck.rows.length === 0) {
        console.log("modelo_id não existe, criando um novo...");
        const marcaResult = await db.query(
          "INSERT INTO marcas (nome) VALUES ($1) ON CONFLICT (nome) DO UPDATE SET nome = EXCLUDED.nome RETURNING id",
          [`Marca_${placa}`]
        );
        const marcaId = marcaResult.rows[0].id;
        const modeloResult = await db.query(
          "INSERT INTO modelos (nome, marca_id) VALUES ($1, $2) ON CONFLICT (nome, marca_id) DO UPDATE SET nome = EXCLUDED.nome, marca_id = EXCLUDED.marca_id RETURNING id",
          [`Modelo_${placa}`, marcaId]
        );
        finalModeloId = modeloResult.rows[0].id;
        console.log(
          `Novo modelo criado para ${placa}: Modelo_${placa}, ID: ${finalModeloId}`
        );
      }
    }

    const localDescansoValue = `ST_GeomFromText('POINT(${x} ${y})', 4326)`;
    const { rows } = await db.query(
      `UPDATE veiculos SET placa = $1, descricao = $2, ano = $3, modelo_id = $4, cor = $5, finalidade = $6, zero_quilometro = $7, nivel_conforto = $8, local_descanso = ${localDescansoValue} WHERE id = $9 RETURNING *`,
      [
        placa,
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
      [id, "atualizado", `Veículo ${placa} atualizado`]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar veículo:", error.stack);
    if (error.code === "23505") {
      res
        .status(400)
        .json({ error: "Placa já registrada", details: error.message });
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
