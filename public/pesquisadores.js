function sair() {
  window.location.href = 'index.html';
}

function abrirModal(pesquisador = null) {
  document.getElementById('erroModal').textContent = '';
  document.getElementById('modal').style.display = 'flex';

  if (pesquisador) {
    document.getElementById('tituloModal').textContent = 'Editar Pesquisador';
    document.getElementById('pesquisadorId').value = pesquisador.pessoa_id;
    document.getElementById('nome').value = pesquisador.nome;
    document.getElementById('cpf').value = pesquisador.cpf;
    document.getElementById('nascimento').value = pesquisador.nascimento ? pesquisador.nascimento.split('T')[0] : '';
    document.getElementById('telefone').value = pesquisador.telefone || '';
  } else {
    document.getElementById('tituloModal').textContent = 'Novo Pesquisador';
    document.getElementById('pesquisadorId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('cpf').value = '';
    document.getElementById('nascimento').value = '';
    document.getElementById('telefone').value = '';
  }
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

async function carregarPesquisadores() {
  const resposta = await fetch('/pesquisadores');
  const pesquisadores = await resposta.json();
  const corpo = document.getElementById('corpoTabela');

  if (pesquisadores.length === 0) {
    corpo.innerHTML = '<tr><td colspan="6">Nenhum pesquisador cadastrado.</td></tr>';
    return;
  }

  corpo.innerHTML = pesquisadores.map(p => `
    <tr>
      <td>${p.pessoa_id}</td>
      <td>${p.nome}</td>
      <td>${p.cpf}</td>
      <td>${p.nascimento ? new Date(p.nascimento).toLocaleDateString('pt-BR') : '-'}</td>
      <td>${p.telefone || '-'}</td>
      <td>
        <button class="btn-editar" onclick='editar(${JSON.stringify(p)})'>✏️ Editar</button>
        <button class="btn-excluir" onclick="excluir(${p.pessoa_id})">🗑️ Excluir</button>
      </td>
    </tr>
  `).join('');
}

function editar(pesquisador) {
  abrirModal(pesquisador);
}

async function excluir(id) {
  if (!confirm('Deseja excluir este pesquisador?')) return;

  const resposta = await fetch(`/pesquisadores/${id}`, { method: 'DELETE' });
  const dados = await resposta.json();

  if (!resposta.ok) {
    alert(dados.erro);
  } else {
    carregarPesquisadores();
  }
}

async function salvar() {
  const id = document.getElementById('pesquisadorId').value;
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const nascimento = document.getElementById('nascimento').value;
  const telefone = document.getElementById('telefone').value;
  const erro = document.getElementById('erroModal');

  if (!nome || !cpf || !nascimento) {
    erro.textContent = 'Preencha os campos obrigatórios!';
    return;
  }

  const url = id ? `/pesquisadores/${id}` : '/pesquisadores';
  const method = id ? 'PUT' : 'POST';

  const resposta = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, cpf, nascimento, telefone })
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    erro.textContent = dados.erro;
  } else {
    fecharModal();
    carregarPesquisadores();
  }
}

window.onclick = function(event) {
  if (event.target === document.getElementById('modal')) {
    fecharModal();
  }
}

carregarPesquisadores();