const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de Cadastro
app.post('/cadastrar', (req, res) => {
  const { nome, login, senha } = req.body;
  if (!nome || !login || !senha) return res.status(400).json({ erro: 'Preencha todos os campos!' });
  const sql = 'INSERT INTO tbUsuarios (nome, login, senha) VALUES (?, ?, ?)';
  db.query(sql, [nome, login, senha], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ erro: 'Login já cadastrado!' });
      return res.status(500).json({ erro: 'Erro ao cadastrar usuário!' });
    }
    res.json({ mensagem: 'Usuário cadastrado com sucesso!' });
  });
});

// Rota de Login
app.post('/login', (req, res) => {
  const { login, senha } = req.body;
  if (!login || !senha) return res.status(400).json({ erro: 'Preencha todos os campos!' });
  const sql = 'SELECT * FROM tbUsuarios WHERE login = ? AND senha = ?';
  db.query(sql, [login, senha], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao realizar login!' });
    if (results.length === 0) return res.status(401).json({ erro: 'Usuário ou senha incorretos!' });
    res.json({ mensagem: 'Login realizado com sucesso!', usuario: results[0].nome });
  });
});

// Listar usuários
app.get('/usuarios', (req, res) => {
  db.query('SELECT usuario_id, nome, login FROM tbUsuarios', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar usuários!' });
    res.json(results);
  });
});

// Cadastrar usuário
app.post('/usuarios', (req, res) => {
  const { nome, login, senha } = req.body;
  if (!nome || !login || !senha) return res.status(400).json({ erro: 'Preencha todos os campos!' });
  db.query('INSERT INTO tbUsuarios (nome, login, senha) VALUES (?, ?, ?)', [nome, login, senha], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ erro: 'Login já cadastrado!' });
      return res.status(500).json({ erro: 'Erro ao cadastrar usuário!' });
    }
    res.json({ mensagem: 'Usuário cadastrado com sucesso!' });
  });
});

// Editar usuário
app.put('/usuarios/:id', (req, res) => {
  const { nome, login, senha } = req.body;
  let sql = 'UPDATE tbUsuarios SET nome = ?, login = ?';
  let params = [nome, login];
  if (senha) { sql += ', senha = ?'; params.push(senha); }
  sql += ' WHERE usuario_id = ?';
  params.push(req.params.id);
  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao editar usuário!' });
    res.json({ mensagem: 'Usuário atualizado com sucesso!' });
  });
});

// Excluir usuário
app.delete('/usuarios/:id', (req, res) => {
  db.query('DELETE FROM tbUsuarios WHERE usuario_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao excluir usuário!' });
    res.json({ mensagem: 'Usuário excluído com sucesso!' });
  });
});

// Listar pesquisadores
app.get('/pesquisadores', (req, res) => {
  db.query('SELECT * FROM tbPessoas', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar pesquisadores!' });
    res.json(results);
  });
});

// Cadastrar pesquisador
app.post('/pesquisadores', (req, res) => {
  const { nome, cpf, nascimento, telefone, pessoa_tipo_id } = req.body;
  if (!nome || !cpf || !nascimento) return res.status(400).json({ erro: 'Preencha os campos obrigatórios!' });
  const sql = 'INSERT INTO tbPessoas (nome, cpf, nascimento, telefone, pessoa_tipo_id, atualizado_em) VALUES (?, ?, ?, ?, ?, NOW())';
  db.query(sql, [nome, cpf, nascimento, telefone, pessoa_tipo_id], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ erro: 'CPF já cadastrado!' });
      return res.status(500).json({ erro: 'Erro ao cadastrar pesquisador!' });
    }
    res.json({ mensagem: 'Pesquisador cadastrado com sucesso!' });
  });
});

// Editar pesquisador
app.put('/pesquisadores/:id', (req, res) => {
  const { nome, cpf, nascimento, telefone, pessoa_tipo_id } = req.body;
  const sql = 'UPDATE tbPessoas SET nome=?, cpf=?, nascimento=?, telefone=?, pessoa_tipo_id=?, atualizado_em=NOW() WHERE pessoa_id=?';
  db.query(sql, [nome, cpf, nascimento, telefone, pessoa_tipo_id, req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao editar pesquisador!' });
    res.json({ mensagem: 'Pesquisador atualizado com sucesso!' });
  });
});

// Excluir pesquisador
app.delete('/pesquisadores/:id', (req, res) => {
  db.query('DELETE FROM tbPessoas WHERE pessoa_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao excluir pesquisador!' });
    res.json({ mensagem: 'Pesquisador excluído com sucesso!' });
  });
});

// Listar status
app.get('/status', (req, res) => {
  db.query('SELECT * FROM tbStatus', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar status!' });
    res.json(results);
  });
});

// Cadastrar status
app.post('/status', (req, res) => {
  const { descricao } = req.body;
  if (!descricao) return res.status(400).json({ erro: 'Preencha a descrição!' });
  db.query('INSERT INTO tbStatus (descricao) VALUES (?)', [descricao], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao cadastrar status!' });
    res.json({ mensagem: 'Status cadastrado com sucesso!' });
  });
});

// Editar status
app.put('/status/:id', (req, res) => {
  const { descricao } = req.body;
  db.query('UPDATE tbStatus SET descricao=? WHERE status_id=?', [descricao, req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao editar status!' });
    res.json({ mensagem: 'Status atualizado com sucesso!' });
  });
});

// Excluir status
app.delete('/status/:id', (req, res) => {
  db.query('DELETE FROM tbStatus WHERE status_id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao excluir status!' });
    res.json({ mensagem: 'Status excluído com sucesso!' });
  });
});

// Listar projetos
app.get('/projetos', (req, res) => {
  const sql = `
    SELECT p.*, pe.nome as pesquisador_nome, s.descricao as status_descricao
    FROM tbProjetosPesquisa p
    LEFT JOIN tbPessoas pe ON p.pesquisador_id = pe.pessoa_id
    LEFT JOIN tbStatus s ON p.status_id = s.status_id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar projetos!' });
    res.json(results);
  });
});

// Cadastrar projeto
app.post('/projetos', (req, res) => {
  const { descricao, pesquisador_id, status_id, inicio, fim } = req.body;
  if (!descricao) return res.status(400).json({ erro: 'Preencha a descrição!' });
  const sql = 'INSERT INTO tbProjetosPesquisa (descricao, pesquisador_id, status_id, inicio, fim, atualizado_em) VALUES (?, ?, ?, ?, ?, NOW())';
  db.query(sql, [descricao, pesquisador_id, status_id, inicio, fim], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao cadastrar projeto!' });
    res.json({ mensagem: 'Projeto cadastrado com sucesso!' });
  });
});

// Editar projeto
app.put('/projetos/:id', (req, res) => {
  const { descricao, pesquisador_id, status_id, inicio, fim } = req.body;
  const sql = 'UPDATE tbProjetosPesquisa SET descricao=?, pesquisador_id=?, status_id=?, inicio=?, fim=?, atualizado_em=NOW() WHERE projeto_pesquisa_id=?';
  db.query(sql, [descricao, pesquisador_id, status_id, inicio, fim, req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao editar projeto!' });
    res.json({ mensagem: 'Projeto atualizado com sucesso!' });
  });
});

// Excluir projeto
app.delete('/projetos/:id', (req, res) => {
  db.query('DELETE FROM tbProjetosPesquisa WHERE projeto_pesquisa_id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao excluir projeto!' });
    res.json({ mensagem: 'Projeto excluído com sucesso!' });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});