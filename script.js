// =========================
// MENU HAMBURGER (mobile)
// =========================
const btnHamburger = document.querySelector('.btn-hamburger');
const menuMobile = document.querySelector('.menu-mobile');
if (btnHamburger && menuMobile) {
  btnHamburger.addEventListener('click', () => {
    menuMobile.classList.toggle('ativo');
  });
  menuMobile.querySelectorAll('a, .snipcart-checkout').forEach(el => {
    el.addEventListener('click', () => menuMobile.classList.remove('ativo'));
  });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuMobile?.classList.contains('ativo')) {
    menuMobile.classList.remove('ativo');
  }
});

// =========================
// INFO-CARROSSEL (Frete/Pix)
// =========================
const infoSlides = document.querySelectorAll('.info-slide');
if (infoSlides.length) {
  let idx = 0;
  setInterval(() => {
    infoSlides[idx].classList.remove('ativo');
    idx = (idx + 1) % infoSlides.length;
    infoSlides[idx].classList.add('ativo');
  }, 3500);
}

// CATÁLOGO (50 PRODUTOS) -(1 foto + 1 vídeo opcional)

function criarCardProduto(p) {
  const card = document.createElement('div');
  card.className = 'card-produto';

  // Mídia (carrossel)
  const media = document.createElement('div');
  media.className = 'produto-media-carrossel';

  // Slide 1: imagem
  const s1 = document.createElement('div');
  s1.className = 'carrossel-slide ativo';
  const img = document.createElement('img');
  img.src = p.imagem;
  img.alt = `${p.nome} - imagem`;
  s1.appendChild(img);
  media.appendChild(s1);

  // Slide 2: video
  let slides = [s1];
  if (p.video) {
    const s2 = document.createElement('div');
    s2.className = 'carrossel-slide';
    const vid = document.createElement('video');
    vid.src = p.video;
    vid.muted = true;
    vid.loop = true;
    vid.playsInline = true;
    vid.preload = 'metadata';
    s2.appendChild(vid);
    media.appendChild(s2);
    slides.push(s2);

    // botões 
    const btnAnt = document.createElement('button');
    btnAnt.className = 'carrossel-btn btn-ant';
    btnAnt.setAttribute('aria-label','Anterior');
    btnAnt.innerHTML = '&#10094;';

    const btnProx = document.createElement('button');
    btnProx.className = 'carrossel-btn btn-prox';
    btnProx.setAttribute('aria-label','Próximo');
    btnProx.innerHTML = '&#10095;';

    media.appendChild(btnAnt);
    media.appendChild(btnProx);

    let indice = 0;
    function tocarPausar() {
      slides.forEach((s, i) => {
        const v = s.querySelector('video');
        if (!v) return;
        if (i === indice) v.play().catch(()=>{});
        else { v.pause(); v.currentTime = 0; }
      });
    }
    function mostrar(novo) {
      indice = (novo + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('ativo', i === indice));
      tocarPausar();
    }
    btnAnt.addEventListener('click', () => mostrar(indice - 1));
    btnProx.addEventListener('click', () => mostrar(indice + 1));
    tocarPausar();
  }

  // Título, preço, botão Snipcart
  const h3 = document.createElement('h3');
  h3.textContent = p.nome;

  const preco = document.createElement('p');
  preco.className = 'preco';
  preco.textContent = `R$ ${p.preco.toFixed(2).replace('.', ',')}`;

  const btn = document.createElement('button');
  btn.className = 'btn-comprar snipcart-add-item';
  btn.textContent = 'Adicionar ao Carrinho';
  btn.setAttribute('data-item-id', p.id);
  btn.setAttribute('data-item-price', p.preco.toFixed(2));
  btn.setAttribute('data-item-url', '/index.html');
  btn.setAttribute('data-item-name', p.nome);
  btn.setAttribute('data-item-image', p.imagem);

  card.appendChild(media);
  card.appendChild(h3);
  card.appendChild(preco);
  card.appendChild(btn);

  return card;
}

// Lista de 50 produtos
const produtos = [];

// 1) Cropped
produtos.push({
  id: 'cropped-babado-concha',
  nome: 'Cropped Babado com Concha',
  preco: 49.90,
  imagem: 'cropped-rosa.jpg',
  video: 'video-default.mp4' 
});


// 2) Vestido Envelope (com vídeo) — igual ao seu
produtos.push({
  id: 'vestido-envelope',
  nome: 'Vestido Envelope',
  preco: 149.90,
  imagem: 'vestido-envelope-1.jpg', // defina sua capa real
  video: 'vestido-envelope.mp4'     // vídeo real do vestido
});

// 3) Produto 3 — 1 foto + 1 vídeo (exatamente como o Vestido)
produtos.push({
  id: 'produto-3',
  nome: 'Cropped Poliamida',
  preco: 0.00,
  imagem: 'produto3-1.jpg',
  video: 'produto3-video.mp4'
});

// 4..50 placeholders (troque conforme tiver mídias reais)
for (let i = 4; i <= 50; i++) {
  produtos.push({
    id: `produto-${i}`,
    nome: `Produto ${i}`,
    preco: 0.00,
    imagem: `https://via.placeholder.com/800x1000?text=Produto+${i}`,
    // vídeo padrão provisório para TODOS terem carrossel (foto + vídeo)
    video: 'videos/default.mp4'
  });
}


// Injeção na grade
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid-produtos');
  if (!grid) return;
  const frag = document.createDocumentFragment();
  produtos.forEach(p => frag.appendChild(criarCardProduto(p)));
  grid.appendChild(frag);
});
