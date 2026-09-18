const cabecalhoConteudo = document.querySelector('.cabecalho-conteudo');
const marca = document.querySelector('.marca');

if (cabecalhoConteudo && marca && !document.querySelector('.oferta-header')) {
  const oferta = document.createElement('div');
  oferta.className = 'oferta-header';
  oferta.innerHTML = '<strong>5% OFF</strong> no PIX';
  marca.insertAdjacentElement('afterend', oferta);
}

const btnMenu = document.querySelector('.btn-menu');
const menuMobile = document.querySelector('.menu-mobile');

if (btnMenu && menuMobile) {
  const fecharMenu = () => {
    btnMenu.classList.remove('ativo');
    btnMenu.setAttribute('aria-expanded', 'false');
    menuMobile.classList.remove('ativo');
    document.body.classList.remove('menu-aberto');
  };

  btnMenu.addEventListener('click', () => {
    const aberto = menuMobile.classList.toggle('ativo');
    btnMenu.classList.toggle('ativo', aberto);
    btnMenu.setAttribute('aria-expanded', String(aberto));
    document.body.classList.toggle('menu-aberto', aberto);
  });

  menuMobile.querySelectorAll('a, button').forEach((item) => item.addEventListener('click', fecharMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') fecharMenu();
  });
}

const produtos = [
  {
    id: 'cropped-babado-concha',
    nome: 'Cropped Babado com Concha',
    categoria: 'croppeds',
    preco: 49.9,
    descricao: 'Cropped feminino',
    tamanhos: ['P', 'M', 'G'],
    badge: 'DESTAQUE',
    imagem: null,
    video: null
  },
  {
    id: 'vestido-envelope',
    nome: 'Vestido Envelope',
    categoria: 'vestidos',
    preco: 149.9,
    descricao: 'Vestido feminino',
    tamanhos: ['P', 'M', 'G'],
    badge: 'NOVIDADE',
    imagem: null,
    video: 'vestido-envelope.mp4'
  },
  {
    id: 'cropped-poliamida',
    nome: 'Cropped Poliamida',
    categoria: 'croppeds',
    preco: null,
    descricao: 'Cropped feminino',
    tamanhos: ['P', 'M', 'G'],
    badge: null,
    imagem: null,
    video: 'produto3-video.mp4'
  }
];

function moeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function criarMidia(produto) {
  const media = document.createElement('div');
  media.className = 'produto-media';

  if (produto.video) {
    const video = document.createElement('video');
    video.src = produto.video;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.autoplay = true;
    video.play().catch(() => {});
    media.appendChild(video);
  } else if (produto.imagem) {
    const img = document.createElement('img');
    img.src = produto.imagem;
    img.alt = produto.nome;
    img.loading = 'lazy';
    media.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'produto-placeholder';

    const monograma = document.createElement('span');
    monograma.textContent = 'FM';

    placeholder.appendChild(monograma);
    media.appendChild(placeholder);
  }

  if (produto.badge) {
    const badge = document.createElement('span');
    badge.className = 'produto-badge';
    badge.textContent = produto.badge;
    media.appendChild(badge);
  }

  return media;
}

function criarCard(produto) {
  const card = document.createElement('article');
  card.className = 'card-produto';
  card.dataset.categoria = produto.categoria;

  const info = document.createElement('div');
  info.className = 'produto-info';

  const topo = document.createElement('div');
  topo.className = 'produto-topo';

  const nome = document.createElement('h3');
  nome.textContent = produto.nome;

  const preco = document.createElement('p');
  preco.className = 'preco';
  preco.textContent = produto.preco == null ? 'Sob consulta' : moeda(produto.preco);

  topo.append(nome, preco);

  const descricao = document.createElement('p');
  descricao.className = 'produto-sub';
  descricao.textContent = produto.descricao;

  const tamanhos = document.createElement('div');
  tamanhos.className = 'opcoes-tamanho';

  let tamanhoSelecionado = produto.tamanhos[0];

  produto.tamanhos.forEach((tamanho, index) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'tamanho' + (index === 0 ? ' ativo' : '');
    botao.textContent = tamanho;

    botao.addEventListener('click', () => {
      tamanhoSelecionado = tamanho;
      tamanhos.querySelectorAll('.tamanho').forEach((item) => item.classList.remove('ativo'));
      botao.classList.add('ativo');

      if (comprar.classList.contains('snipcart-add-item')) {
        comprar.setAttribute('data-item-custom1-value', tamanhoSelecionado);
      }
    });

    tamanhos.appendChild(botao);
  });

  const comprar = document.createElement(produto.preco == null ? 'a' : 'button');

  if (produto.preco == null) {
    comprar.className = 'btn-comprar consulta';
    comprar.textContent = 'Consultar disponibilidade';
    comprar.href = 'https://wa.me/5514996053610?text=' + encodeURIComponent('Olá! Gostaria de saber preço e disponibilidade do ' + produto.nome + '.');
    comprar.target = '_blank';
    comprar.rel = 'noopener noreferrer';
  } else {
    comprar.className = 'btn-comprar snipcart-add-item';
    comprar.type = 'button';
    comprar.textContent = 'Adicionar ao carrinho';
    comprar.setAttribute('data-item-id', produto.id);
    comprar.setAttribute('data-item-name', produto.nome);
    comprar.setAttribute('data-item-price', produto.preco.toFixed(2));
    comprar.setAttribute('data-item-url', '/');
    comprar.setAttribute('data-item-custom1-name', 'Tamanho');
    comprar.setAttribute('data-item-custom1-options', produto.tamanhos.join('|'));
    comprar.setAttribute('data-item-custom1-value', tamanhoSelecionado);
  }

  info.append(topo, descricao, tamanhos, comprar);
  card.append(criarMidia(produto), info);

  return card;
}

const grid = document.getElementById('grid-produtos');

if (grid) {
  grid.innerHTML = '';
  produtos.forEach((produto) => grid.appendChild(criarCard(produto)));
}

const filtros = document.querySelectorAll('.filtro');

filtros.forEach((filtro) => {
  filtro.addEventListener('click', () => {
    filtros.forEach((item) => item.classList.remove('ativo'));
    filtro.classList.add('ativo');

    const valor = filtro.dataset.filtro;

    document.querySelectorAll('.card-produto').forEach((card) => {
      card.hidden = valor !== 'todos' && card.dataset.categoria !== valor;
    });
  });
});

const anoAtual = document.getElementById('ano-atual');
if (anoAtual) anoAtual.textContent = new Date().getFullYear();
