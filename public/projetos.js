function sair() { window.location.href = 'index.html'; }

async function carregarSelects() {
  const [pesquisadores, status] = await Promise.all([
    fetch('/pesquisadores').then(r => r.json()),
    fetch('/status').then(r => r.json())
  ]);

  const selPesq = document.getElementById('pesquisador_id');
  pesquisadores.forEach(p => {
    selPesq.innerHTML += `<option value="${p.pessoa_id}">${p.nome}</option>`;
  });

  const selStatus = document.getElementById('status_id');
  status.forEach(s => {
    selStatus.innerHTML += `<option value="${s.status_id}">${s.descricao}</option>`;
  });
}

function abrirModal(projeto = null) {
  document.getElementById('erroModal').textContent = '';
  document.getElementById('modal').style.display = 'flex';
  if (projeto) {
    document.getElementById('tituloModal').textContent = 'Editar Projeto';
    document.getElementById('projetoId').value = projeto.projeto_pesquisa_id;
    document.getElementById('descricao').value = projeto.descricao;
    document.getElementById('pesquisador_id').value = projeto.pesquisador_id || '';
    document.getElementById('status_id').value = projeto.status_id || '';
    document.getElementById('inicio').value = projeto.inicio ? projeto.inicio.split('T')[0] : '';
    document.getElementById('fim').value = projeto.fim ? projeto.fim.split('T')[0] : '';
  } else {
    document.getElementById('tituloModal').textContent = 'Novo Projeto';
    document.getElementById('projetoId').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('pesquisador_id').value = '';
    document.getElementById('status_id').value = '';
    document.getElementById('inicio').value = '';
    document.getElementById('fim').value = '';
  }
}

function fecharModal() { document.getElementById('modal').style.display = 'none'; }

async function carregarProjetos() {
  const resposta = await fetch('/projetos');
  const projetos = await resposta.json();
  const corpo = document.getElementById('corpoTabela');
  if (projetos.length === 0) {
    corpo.innerHTML = '<tr><td colspan="7">Nenhum projeto cadastrado.</td></tr>';
    return;
  }
  corpo.innerHTML = projetos.map(p => `
    <tr>
      <td>${p.projeto_pesquisa_id}</td>
      <td>${p.descricao}</td>
      <td>${p.pesquisador_nome || '-'}</td>
      <td>${p.status_descricao || '-'}</td>
      <td>${p.inicio ? new Date(p.inicio).toLocaleDateString('pt-BR') : '-'}</td>
      <td>${p.fim ? new Date(p.fim).toLocaleDateString('pt-BR') : '-'}</td>
      <td>
        <button class="btn-editar" onclick='abrirModal(${JSON.stringify(p)})'>✏️ Editar</button>
        <button class="btn-excluir" onclick="excluir(${p.projeto_pesquisa_id})">🗑️ Excluir</button>
      </td>
    </tr>
  `).join('');
}

async function excluir(id) {
  if (!confirm('Deseja excluir este projeto?')) return;
  const resposta = await fetch(`/projetos/${id}`, { method: 'DELETE' });
  const dados = await resposta.json();
  if (!resposta.ok) { alert(dados.erro); } else { carregarProjetos(); }
}

async function salvar() {
  const id = document.getElementById('projetoId').value;
  const descricao = document.getElementById('descricao').value;
  const pesquisador_id = document.getElementById('pesquisador_id').value;
  const status_id = document.getElementById('status_id').value;
  const inicio = document.getElementById('inicio').value;
  const fim = document.getElementById('fim').value;
  const erro = document.getElementById('erroModal');

  if (!descricao) { erro.textContent = 'Preencha a descrição!'; return; }

  const resposta = await fetch(id ? `/projetos/${id}` : '/projetos', {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descricao, pesquisador_id, status_id, inicio, fim })
  });

  const dados = await resposta.json();
  if (!resposta.ok) { erro.textContent = dados.erro; } else { fecharModal(); carregarProjetos(); }
}

window.onclick = function(e) { if (e.target === document.getElementById('modal')) fecharModal(); }

carregarSelects();
carregarProjetos();