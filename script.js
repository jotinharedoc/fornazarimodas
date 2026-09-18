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

  menuMobile.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('click', fecharMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') fecharMenu();
  });
}

const anuncios = [...document.querySelectorAll('.anuncio')];
if (anuncios.length > 1) {
  let anuncioAtual = 0;
  setInterval(() => {
    anuncios[anuncioAtual].classList.remove('ativo');
    anuncioAtual = (anuncioAtual + 1) % anuncios.length;
    anuncios[anuncioAtual].classList.add('ativo');
  }, 3600);
}

const produtos = [
  {
    id: 'cropped-babado-concha',
    nome: 'Cropped Babado com Concha',
    categoria: 'croppeds',
    preco: 49.9,
    descricao: 'Leve, feminino e fácil de combinar.',
    tamanhos: ['P', 'M', 'G'],
    badge: 'destaque',
    imagem: null,
    video: null
  },
  {
    id: 'vestido-envelope',
    nome: 'Vestido Envelope',
    categoria: 'vestidos',
    preco: 149.9,
    descricao: 'Modelagem que valoriza o corpo com conforto.',
    tamanhos: ['P', 'M', 'G'],
    badge: 'queridinho',
    imagem: null,
    video: 'vestido-envelope.mp4'
  },
  {
    id: 'cropped-poliamida',
    nome: 'Cropped Poliamida',
    categoria: 'croppeds',
    preco: null,
    descricao: 'Conforto e caimento para composições versáteis.',
    tamanhos: ['P', 'M', 'G'],
    badge: 'novidade',
    imagem: null,
    video: 'produto3-video.mp4'
  }
];

function moeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function criarMidia(produto) {
  const area = document.createElement('div');
  area.className = 'produto-media';

  const midias = [];
  if (produto.imagem) {
    midias.push({ tipo: 'imagem', src: produto.imagem });
  }
  if (produto.video) {
    midias.push({ tipo: 'video', src: produto.video });
  }

  if (!midias.length) {
    const placeholder = document.createElement('div');
    placeholder.className = 'produto-placeholder';
    const monograma = document.createElement('span');
    monograma.textContent = 'SF';
    placeholder.appendChild(monograma);
    area.appendChild(placeholder);
    return area;
  }

  let indice = 0;
  const renderizar = () => {
    area.querySelectorAll('img, video').forEach((el) => el.remove());

    const atual = midias[indice];
    let elemento;

    if (atual.tipo === 'video') {
      elemento = document.createElement('video');
      elemento.src = atual.src;
      elemento.muted = true;
      elemento.loop = true;
      elemento.playsInline = true;
      elemento.preload = 'metadata';
      elemento.autoplay = true;
      elemento.play().catch(() => {});
    } else {
      elemento = document.createElement('img');
      elemento.src = atual.src;
      elemento.alt = produto.nome;
      elemento.loading = 'lazy';
    }

    area.prepend(elemento);
  };

  renderizar();

  if (midias.length > 1) {
    const controles = document.createElement('div');
    controles.className = 'produto-controles';

    const anterior = document.createElement('button');
    anterior.type = 'button';
    anterior.setAttribute('aria-label', 'Mídia anterior');
    anterior.textContent = '‹';

    const proximo = document.createElement('button');
    proximo.type = 'button';
    proximo.setAttribute('aria-label', 'Próxima mídia');
    proximo.textContent = '›';

    anterior.addEventListener('click', () => {
      indice = (indice - 1 + midias.length) % midias.length;
      renderizar();
    });

    proximo.addEventListener('click', () => {
      indice = (indice + 1) % midias.length;
      renderizar();
    });

    controles.append(anterior, proximo);
    area.appendChild(controles);
  }

  return area;
}

function criarCard(produto) {
  const card = document.createElement('article');
  card.className = 'card-produto revelar';
  card.dataset.categoria = produto.categoria;

  const media = criarMidia(produto);

  if (produto.badge) {
    const badge = document.createElement('span');
    badge.className = 'produto-badge';
    badge.textContent = produto.badge;
    media.appendChild(badge);
  }

  const info = document.createElement('div');
  info.className = 'produto-info';

  const topo = document.createElement('div');
  topo.className = 'produto-topo';

  const titulo = document.createElement('h3');
  titulo.textContent = produto.nome;

  const preco = document.createElement('p');
  preco.className = 'preco';
  preco.textContent = produto.preco == null ? 'Sob consulta' : moeda(produto.preco);

  topo.append(titulo, preco);

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
    botao.setAttribute('aria-label', 'Selecionar tamanho ' + tamanho);

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
  comprar.className = produto.preco == null ? 'btn-comprar consulta' : 'btn-comprar snipcart-add-item';

  if (produto.preco == null) {
    comprar.textContent = 'Consultar disponibilidade';
    comprar.href = 'https://wa.me/5514996053610?text=' + encodeURIComponent('Olá! Gostaria de saber preço e disponibilidade do ' + produto.nome + '.');
    comprar.target = '_blank';
    comprar.rel = 'noopener noreferrer';
  } else {
    comprar.type = 'button';
    comprar.textContent = 'Adicionar ao carrinho';
    comprar.setAttribute('data-item-id', produto.id);
    comprar.setAttribute('data-item-name', produto.nome);
    comprar.setAttribute('data-item-price', produto.preco.toFixed(2));
    comprar.setAttribute('data-item-url', '/');
    comprar.setAttribute('data-item-custom1-name', 'Tamanho');
    comprar.setAttribute('data-item-custom1-options', produto.tamanhos.join('|'));
    comprar.setAttribute('data-item-custom1-value', tamanhoSelecionado);
    if (produto.imagem) comprar.setAttribute('data-item-image', produto.imagem);
  }

  info.append(topo, descricao, tamanhos, comprar);
  card.append(media, info);
  return card;
}

const grid = document.getElementById('grid-produtos');
if (grid) {
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

const observar = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visivel');
      observar.unobserve(entrada.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.revelar').forEach((elemento) => observar.observe(elemento));

const anoAtual = document.getElementById('ano-atual');
if (anoAtual) anoAtual.textContent = new Date().getFullYear();
