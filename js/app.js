/* Baklawa Bites — Valentine Special */

function initYear(){
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear().toString();
}

function initReveal(){
  // Add js class to html for CSS targeting
  document.documentElement.classList.add('js');
  
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => obs.observe(el));
}

function initLightbox(){
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const imgEl = lb.querySelector('.lightbox__img');
  const closeBtn = lb.querySelector('.lightbox__close');

  function close(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    imgEl.removeAttribute('src');
    imgEl.setAttribute('alt', '');
  }

  document.querySelectorAll('.gcard img').forEach(img => {
    img.addEventListener('click', () => {
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      imgEl.src = img.src;
      imgEl.alt = img.alt || 'Baklawa photo';
    });
  });

  closeBtn?.addEventListener('click', close);
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

function initHearts(){
  const container = document.querySelector('.hearts');
  if (!container) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const colors = ['#FF4D8D', '#FF86B6', '#D9B35E', '#F7B7D2'];
  const total = 26; // initial burst
  const burstMs = 1800;

  const start = performance.now();

  function spawn(){
    const el = document.createElement('span');
    el.className = 'heart';

    const x = Math.random() * 100; // vw
    const drift = (Math.random() * 18 - 9).toFixed(2) + 'vw';
    const s = (Math.random() * 0.9 + 0.55).toFixed(2);
    const rot = (Math.random() * 220 - 110).toFixed(0) + 'deg';
    const dur = (Math.random() * 2.4 + 3.6).toFixed(2) + 's';
    const delay = (Math.random() * 0.6).toFixed(2) + 's';

    el.style.setProperty('--x', x.toFixed(2) + 'vw');
    el.style.setProperty('--drift', drift);
    el.style.setProperty('--s', s);
    el.style.setProperty('--rot', rot);
    el.style.setProperty('--dur', dur);
    el.style.setProperty('--delay', delay);

    el.style.left = '0';
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    el.style.fontSize = (Math.random() * 18 + 14).toFixed(0) + 'px';

    el.addEventListener('animationend', () => el.remove());
    container.appendChild(el);
  }

  // spread spawns over a short burst window
  let spawned = 0;
  function tick(now){
    const t = now - start;
    const target = Math.floor((t / burstMs) * total);
    while (spawned < Math.min(target, total)){
      spawn();
      spawned++;
    }
    if (spawned < total) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* Gentle tilt/parallax on the hero card (adds depth without affecting layout) */
function initTilt(){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = document.querySelector('.hero-card');
  if (!el) return;

  let rect = null;
  const max = 7; // degrees

  const onEnter = () => {
    rect = el.getBoundingClientRect();
    el.classList.add('tilting');
  };

  const onMove = (e) => {
    if (!rect) rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0..1
    const y = (e.clientY - rect.top) / rect.height;  // 0..1
    const rotY = (x - 0.5) * max * 2;
    const rotX = -(y - 0.5) * max * 2;
    el.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
  };

  const onLeave = () => {
    el.style.transform = '';
    el.classList.remove('tilting');
    rect = null;
  };

  el.addEventListener('mouseenter', onEnter);
  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);
}

/* Create continuous background overlay */
function initContinuousBackground() {
  const overlay = document.createElement('div');
  overlay.className = 'background-overlay';
  document.body.appendChild(overlay);
}

/* Shopify Buy Button (shared cart) */
function loadShopifyBuy(cb){
  if (window.ShopifyBuy && window.ShopifyBuy.UI){
    cb();
    return;
  }
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  script.onload = cb;
  document.head.appendChild(script);
}

function initShopify(){
  // Storefront details (from your Shopify Buy Button embed)
  const domain = 'bm3rcp-p3.myshopify.com';
  const token = 'e6ed311285d5b71c3057ed317f544f2d';

  const productIds = {
    // Valentine pre-order (hero button)
    'buy-vday': 10230161146145,
    'buy-12': 10224601497889,
    'buy-24': 10224743612705,
    'buy-48': 10224657858849,
  };

  if (!window.ShopifyBuy) return;

  const client = window.ShopifyBuy.buildClient({
    domain,
    storefrontAccessToken: token,
  });

  window.ShopifyBuy.UI.onReady(client).then((ui) => {
    const commonOptions = {
      product: {
        iframe: true,
        contents: {
          img: false,
          title: false,
          price: false,
          options: false,
          quantity: false,
          button: true,
          buttonWithQuantity: false,
          description: false,
        },
        text: {
          button: 'Add to cart',
        },
        styles: {
          button: {
            'background-color': 'rgba(255,255,255,0.18)',
            'border': '1px solid rgba(255,255,255,0.35)',
            'border-radius': '14px',
            'font-weight': '700',
            'padding': '12px 16px',
            'backdrop-filter': 'blur(14px)',
            'color': 'rgba(42,30,18,0.92)',
            ':hover': {
              'background-color': 'rgba(255,77,141,0.18)',
              'border': '1px solid rgba(255,77,141,0.28)',
            },
            ':focus': {
              'outline': 'none',
              'box-shadow': '0 0 0 4px rgba(255,77,141,0.20)',
            },
          },
        },
      },
      cart: {
        startOpen: false,
        popup: false,
        text: {
          title: 'Your cart',
          total: 'Subtotal',
          button: 'Checkout',
          empty: 'Your cart is empty.',
          notice: 'Shipping & taxes calculated at checkout.',
        },
        styles: {
          button: {
            'background-color': 'rgba(255,77,141,0.18)',
            'border': '1px solid rgba(255,77,141,0.28)',
            'border-radius': '14px',
            'font-weight': '700',
          },
          header: { 'background-color': 'rgba(255,255,255,0.12)' },
          footer: { 'background-color': 'rgba(255,255,255,0.12)' },
        },
      },
      toggle: {
        styles: {
          toggle: {
            'background-color': 'rgba(255,77,141,0.18)',
            'border': '1px solid rgba(255,77,141,0.28)',
            'border-radius': '14px',
            'backdrop-filter': 'blur(14px)',
            ':hover': { 'background-color': 'rgba(255,77,141,0.26)' },
          },
        },
      },
    };

    // Hero pre-order button (overlay on the hero image)
    const vdayNode = document.getElementById('buy-vday');
    if (vdayNode) {
      const vdayOptions = {
        ...commonOptions,
        product: {
          ...commonOptions.product,
          text: { button: 'Pre-Order' },
          styles: {
            ...commonOptions.product.styles,
            product: { 'text-align': 'center', 'margin': '0', 'max-width': '100%' },
            button: {
              ...commonOptions.product.styles.button,
              'background-color': '#ff4d8d',
              ':hover': { 'background-color': '#e94082' },
              ':focus': { 'background-color': '#e94082' },
            },
          },
        },
      };

      ui.createComponent('product', {
        id: productIds['buy-vday'],
        node: vdayNode,
        moneyFormat: '%24%7B%7Bamount%7D%7D',
        options: vdayOptions,
      });
    }

    // Render buttons in the exact order of your product cards.
    for (const mountId of ['buy-12', 'buy-24', 'buy-48']){
      const mountNode = document.getElementById(mountId);
      if (!mountNode) continue;
      ui.createComponent('product', {
        id: productIds[mountId],
        node: mountNode,
        moneyFormat: '%24%7B%7Bamount%7D%7D',
        options: commonOptions,
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initContinuousBackground(); // Add this line
  initReveal();
  initLightbox();
  initHearts();
  initTilt();

  loadShopifyBuy(() => {
    try { initShopify(); } catch (e) { console.warn('Shopify init failed:', e); }
  });
});
/* ============ RAMADAN NIGHT SKY THEME ============ */
/* Add this entire block to your existing app.js */

function initRamadanTheme() {
  // Add theme class to body
  document.body.classList.add('ramadan-theme');
  
  // --- CREATE CRESCENT MOON ---
  if (!document.querySelector('.ramadan-crescent')) {
    const moonContainer = document.createElement('div');
    moonContainer.className = 'ramadan-crescent';
    moonContainer.innerHTML = `
      <div class="moon">
        <div class="crescent-overlay"></div>
      </div>
    `;
    document.body.appendChild(moonContainer);
  }
  
  // --- CREATE STARS CONTAINER ---
  let starsContainer = document.querySelector('.ramadan-stars');
  if (!starsContainer) {
    starsContainer = document.createElement('div');
    starsContainer.className = 'ramadan-stars';
    document.body.appendChild(starsContainer);
  }
  
  // Clear existing stars (if any)
  starsContainer.innerHTML = '';
  
  // --- GENERATE STARS ---
  const starCount = 250; // Number of stars
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'ramadan-star';
    
    // Random position (vw/vh)
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    
    // Random size (1-4px, occasional larger)
    const size = Math.random() < 0.85 
      ? Math.random() * 2 + 1    // 1-3px
      : Math.random() * 3 + 3;   // 3-6px
    
    // Twinkle speed (2-6s)
    const duration = Math.random() * 4 + 2;
    // Random delay
    const delay = Math.random() * 5;
    // Random opacity values
    const opacity = Math.random() * 0.6 + 0.4;
    const brightness = Math.random() * 0.5 + 0.5;
    
    star.style.setProperty('--twinkle-duration', `${duration}s`);
    star.style.setProperty('--twinkle-opacity', opacity);
    star.style.setProperty('--twinkle-brightness', brightness);
    star.style.left = `${left}vw`;
    star.style.top = `${top}vh`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDelay = `${delay}s`;
    
    starsContainer.appendChild(star);
  }
  
  // --- GENERATE SHOOTING STARS ---
  const shootingStarCount = 8;
  
  for (let i = 0; i < shootingStarCount; i++) {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'ramadan-shooting-star';
    
    const left = Math.random() * 60 + 40; // 40-100vw
    const top = Math.random() * 30;        // 0-30vh
    const delay = Math.random() * 15 + (i * 2);
    const duration = Math.random() * 3 + 4; // 4-7s
    
    shootingStar.style.setProperty('--shoot-duration', `${duration}s`);
    shootingStar.style.left = `${left}vw`;
    shootingStar.style.top = `${top}vh`;
    shootingStar.style.animationDelay = `${delay}s`;
    
    starsContainer.appendChild(shootingStar);
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // You can uncomment the line below to enable Ramadan theme automatically
  initRamadanTheme();
  
  // To enable based on date, replace with:
  // const today = new Date();
  // const ramadan2024Start = new Date('2024-03-10');
  // const ramadan2024End = new Date('2024-04-09');
  // if (today >= ramadan2024Start && today <= ramadan2024End) {
  //   initRamadanTheme();
  // }
});

/* ========== OPTIONAL: MANUAL TOGGLE FUNCTION ========== */
// Call this from browser console to enable/disable:
//   enableRamadanTheme()   - turns on
//   disableRamadanTheme()  - turns off
window.enableRamadanTheme = initRamadanTheme;

window.disableRamadanTheme = function() {
  document.body.classList.remove('ramadan-theme');
  const elements = document.querySelectorAll('.ramadan-crescent, .ramadan-stars');
  elements.forEach(el => el.remove());
};
