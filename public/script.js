function abrirModal(tipo) {
  if (tipo === 'login') {
    document.getElementById('modalLogin').style.display = 'flex';
  } else {
    document.getElementById('modalCadastro').style.display = 'flex';
  }
}

function fecharModal(tipo) {
  if (tipo === 'login') {
    document.getElementById('modalLogin').style.display = 'none';
  } else {
    document.getElementById('modalCadastro').style.display = 'none';
  }
}

async function entrar() {
  const login = document.getElementById('loginUsuario').value;
  const senha = document.getElementById('loginSenha').value;
  const erro = document.getElementById('erroLogin');

  const resposta = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, senha })
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    erro.textContent = dados.erro;
  } else {
    window.location.href = 'dashboard.html';
  }
}

async function cadastrar() {
  const nome = document.getElementById('cadastroNome').value;
  const login = document.getElementById('cadastroLogin').value;
  const senha = document.getElementById('cadastroSenha').value;
  const erro = document.getElementById('erroCadastro');

  const resposta = await fetch('/cadastrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, login, senha })
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    erro.textContent = dados.erro;
  } else {
    alert('Usuário cadastrado com sucesso!');
    fecharModal('cadastro');
    abrirModal('login');
  }
}

window.onclick = function(event) {
  if (event.target === document.getElementById('modalLogin')) {
    fecharModal('login');
  }
  if (event.target === document.getElementById('modalCadastro')) {
    fecharModal('cadastro');
  }
}