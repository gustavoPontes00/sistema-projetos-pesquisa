CREATE TABLE IF NOT EXISTS tbStatus (
  status_id INT(10) PRIMARY KEY AUTO_INCREMENT,
  descricao VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbPessoas (
  pessoa_id INT(11) PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(200) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  nascimento DATE NOT NULL,
  telefone VARCHAR(20),
  pessoa_tipo_id INT(10),
  atualizado_por INT(10),
  atualizado_em DATE
);

CREATE TABLE IF NOT EXISTS tbUsuarios (
  usuario_id INT(10) PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(200) NOT NULL,
  login VARCHAR(50) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  atualizado_em TIMESTAMP,
  atualizado_por INT(10)
);

CREATE TABLE IF NOT EXISTS tbProjetosPesquisa (
  projeto_pesquisa_id INT(10) PRIMARY KEY AUTO_INCREMENT,
  descricao VARCHAR(200) NOT NULL,
  pesquisador_id INT(11),
  status_id INT(10),
  inicio DATE,
  fim DATE,
  atualizado_em DATETIME,
  atualizado_por INT(10),
  FOREIGN KEY (pesquisador_id) REFERENCES tbPessoas(pessoa_id),
  FOREIGN KEY (status_id) REFERENCES tbStatus(status_id)
);

ALTER TABLE tbProjetosPesquisa
ADD CONSTRAINT fk_atualizado_por
FOREIGN KEY (atualizado_por) REFERENCES tbUsuarios(usuario_id);

ALTER TABLE tbPessoas
ADD CONSTRAINT fk_pessoa_atualizado_por
FOREIGN KEY (atualizado_por) REFERENCES tbUsuarios(usuario_id);

ALTER TABLE tbUsuarios
ADD CONSTRAINT fk_usuario_atualizado_por
FOREIGN KEY (atualizado_por) REFERENCES tbUsuarios(usuario_id);