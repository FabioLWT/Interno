CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

CREATE TABLE IF NOT EXISTS marcas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS modelos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    marca_id INTEGER REFERENCES marcas(id),
    CONSTRAINT modelos_nome_marca_id_unique UNIQUE (nome, marca_id)
);

CREATE TABLE IF NOT EXISTS veiculos (
    id SERIAL PRIMARY KEY,
    placa VARCHAR(8) UNIQUE NOT NULL,
    descricao TEXT,
    ano INTEGER,
    modelo_id INTEGER REFERENCES modelos(id),
    cor VARCHAR(50),
    finalidade VARCHAR(50),
    zero_quilometro BOOLEAN DEFAULT FALSE,
    nivel_conforto VARCHAR(50),
    local_descanso GEOGRAPHY(POINT, 4326),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_nascimento DATE
);

CREATE TABLE IF NOT EXISTS historico (
    id SERIAL PRIMARY KEY,
    veiculo_id INTEGER,
    acao VARCHAR(50) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT historico_veiculo_id_fkey FOREIGN KEY (veiculo_id) REFERENCES veiculos(id)
);

INSERT INTO marcas (id, nome) VALUES
    (68, 'BMW'),
    (69, '-Chevrolet'),
    (70, 'Peugeot'),
    (71, 'Audi'),
    (72, 'Jeep'),
    (2, 'Ford'),
    (74, 'Fiat'),
    (1, 'Toyota'),
    (76, 'Renault'),
    (77, 'Volkswagen')
ON CONFLICT (id) DO NOTHING;

INSERT INTO modelos (nome, marca_id) VALUES
    ('Corolla', 1),
    ('Civic', 69)
ON CONFLICT DO NOTHING;
