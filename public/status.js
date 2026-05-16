function sair() { window.location.href = 'index.html'; }

function abrirModal(status = null) {
  document.getElementById('erroModal').textContent = '';
  document.getElementById('modal').style.display = 'flex';
  if (status) {
    document.getElementById('tituloModal').textContent = 'Editar Status';
    document.getElementById('statusId').value = status.status_id;
    document.getElementById('descricao').value = status.descricao;
  } else {
    document.getElementById('tituloModal').textContent = 'Novo Status';
    document.getElementById('statusId').value = '';
    document.getElementById('descricao').value = '';
  }
}

function fecharModal() { document.getElementById('modal').style.display = 'none'; }

async function carregarStatus() {
  const resposta = await fetch('/status');
  const lista = await resposta.json();
  const corpo = document.getElementById('corpoTabela');
  if (lista.length === 0) {
    corpo.innerHTML = '<tr><td colspan="3">Nenhum status cadastrado.</td></tr>';
    return;
  }
  corpo.innerHTML = lista.map(s => `
    <tr>
      <td>${s.status_id}</td>
      <td>${s.descricao}</td>
      <td>
        <button class="btn-editar" onclick='abrirModal(${JSON.stringify(s)})'>✏️ Editar</button>
        <button class="btn-excluir" onclick="excluir(${s.status_id})">🗑️ Excluir</button>
      </td>
    </tr>
  `).join('');
}

async function excluir(id) {
  if (!confirm('Deseja excluir este status?')) return;
  const resposta = await fetch(`/status/${id}`, { method: 'DELETE' });
  const dados = await resposta.json();
  if (!resposta.ok) { alert(dados.erro); } else { carregarStatus(); }
}

async function salvar() {
  const id = document.getElementById('statusId').value;
  const descricao = document.getElementById('descricao').value;
  const erro = document.getElementById('erroModal');
  if (!descricao) { erro.textContent = 'Preencha a descrição!'; return; }
  const resposta = await fetch(id ? `/status/${id}` : '/status', {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descricao })
  });
  const dados = await resposta.json();
  if (!resposta.ok) { erro.textContent = dados.erro; } else { fecharModal(); carregarStatus(); }
}

window.onclick = function(e) { if (e.target === document.getElementById('modal')) fecharModal(); }
carregarStatus();