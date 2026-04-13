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

  if (!nome || !login || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos!' });
  }

  const sql = 'INSERT INTO tbUsuarios (nome, login, senha) VALUES (?, ?, ?)';
  db.query(sql, [nome, login, senha], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ erro: 'Login já cadastrado!' });
      }
      return res.status(500).json({ erro: 'Erro ao cadastrar usuário!' });
    }
    res.json({ mensagem: 'Usuário cadastrado com sucesso!' });
  });
});

// Rota de Login
app.post('/login', (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos!' });
  }

  const sql = 'SELECT * FROM tbUsuarios WHERE login = ? AND senha = ?';
  db.query(sql, [login, senha], (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao realizar login!' });
    }
    if (results.length === 0) {
      return res.status(401).json({ erro: 'Usuário ou senha incorretos!' });
    }
    res.json({ mensagem: 'Login realizado com sucesso!', usuario: results[0].nome });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});