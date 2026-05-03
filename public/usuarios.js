function sair() {
  window.location.href = 'index.html';
}

function abrirModal(usuario = null) {
  document.getElementById('erroModal').textContent = '';
  document.getElementById('modal').style.display = 'flex';

  if (usuario) {
    document.getElementById('tituloModal').textContent = 'Editar Usuário';
    document.getElementById('usuarioId').value = usuario.usuario_id;
    document.getElementById('nome').value = usuario.nome;
    document.getElementById('login').value = usuario.login;
    document.getElementById('senha').value = '';
  } else {
    document.getElementById('tituloModal').textContent = 'Novo Usuário';
    document.getElementById('usuarioId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('login').value = '';
    document.getElementById('senha').value = '';
  }
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

async function carregarUsuarios() {
  const resposta = await fetch('/usuarios');
  const usuarios = await resposta.json();
  const corpo = document.getElementById('corpoTabela');

  if (usuarios.length === 0) {
    corpo.innerHTML = '<tr><td colspan="4">Nenhum usuário cadastrado.</td></tr>';
    return;
  }

  corpo.innerHTML = usuarios.map(u => `
    <tr>
      <td>${u.usuario_id}</td>
      <td>${u.nome}</td>
      <td>${u.login}</td>
      <td>
        <button class="btn-editar" onclick='editar(${JSON.stringify(u)})'>✏️ Editar</button>
        <button class="btn-excluir" onclick="excluir(${u.usuario_id})">🗑️ Excluir</button>
      </td>
    </tr>
  `).join('');
}

function editar(usuario) {
  abrirModal(usuario);
}

async function excluir(id) {
  if (!confirm('Deseja excluir este usuário?')) return;

  const resposta = await fetch(`/usuarios/${id}`, { method: 'DELETE' });
  const dados = await resposta.json();

  if (!resposta.ok) {
    alert(dados.erro);
  } else {
    carregarUsuarios();
  }
}

async function salvar() {
  const id = document.getElementById('usuarioId').value;
  const nome = document.getElementById('nome').value;
  const login = document.getElementById('login').value;
  const senha = document.getElementById('senha').value;
  const erro = document.getElementById('erroModal');

  if (!nome || !login || (!id && !senha)) {
    erro.textContent = 'Preencha todos os campos!';
    return;
  }

  const url = id ? `/usuarios/${id}` : '/usuarios';
  const method = id ? 'PUT' : 'POST';

  const body = { nome, login };
  if (senha) body.senha = senha;

  const resposta = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    erro.textContent = dados.erro;
  } else {
    fecharModal();
    carregarUsuarios();
  }
}

window.onclick = function(event) {
  if (event.target === document.getElementById('modal')) {
    fecharModal();
  }
}

carregarUsuarios();