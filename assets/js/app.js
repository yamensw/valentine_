/* Baklawa Bites — Enhanced Animations & Shopify Integration */

// Initialize current year
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear().toString();
}

// Continuous animated background with particles
function initAnimatedBackground() {
  const canvas = document.createElement('canvas');
  canvas.className = 'background-canvas';
  document.body.prepend(canvas);
  
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  let particles = [];
  let animationId;
  
  // Set canvas size
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
  }
  
  // Create particles
  function initParticles() {
    particles = [];
    const particleCount = Math.min(50, Math.floor(width * height / 20000));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        color: Math.random() > 0.5 ? 
          `rgba(217, 179, 94, ${Math.random() * 0.1 + 0.05})` : 
          `rgba(255, 77, 141, ${Math.random() * 0.1 + 0.05})`
      });
    }
  }
  
  // Draw particles
  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(251, 246, 238, 0.3)');
    gradient.addColorStop(0.5, 'rgba(244, 231, 211, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 244, 229, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Update and draw particles
    particles.forEach(particle => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > height) particle.speedY *= -1;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Draw connecting lines
      particles.forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = `rgba(217, 179, 94, ${0.1 * (1 - distance/150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    
    animationId = requestAnimationFrame(drawParticles);
  }
  
  // Add overlay gradient
  const overlay = document.createElement('div');
  overlay.className = 'background-overlay';
  document.body.prepend(overlay);
  
  // Initialize
  resizeCanvas();
  drawParticles();
  
  // Handle resize
  window.addEventListener('resize', resizeCanvas);
  
  // Cleanup
  return () => {
    if (animationId) cancelAnimationFrame(animationId);
  };
}

// Enhanced reveal animations
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  items.forEach(el => observer.observe(el));
}

// Enhanced hearts animation (longer duration)
function initHearts() {
  const container = document.querySelector('.hearts');
  if (!container) return;
  
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  
  const colors = [
    '#FF4D8D', // Pink
    '#FF86B6', // Light pink
    '#D9B35E', // Gold
    '#F7B7D2', // Pastel pink
    '#FFB6C1', // Light pink 2
    '#FFD700'  // Bright gold
  ];
  
  const heartEmojis = ['❤️', '💖', '💝', '💗', '💓', '💞'];
  
  let lastSpawn = 0;
  const spawnInterval = 800; // Spawn every 800ms
  let animationId;
  
  function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    
    // Random properties for longer animation
    const x = Math.random() * 100;
    const drift = (Math.random() * 40 - 20).toFixed(2) + 'vw';
    const size = (Math.random() * 0.6 + 0.4).toFixed(2);
    const duration = (Math.random() * 8 + 12).toFixed(2) + 's'; // 12-20 seconds
    const delay = (Math.random() * 5).toFixed(2) + 's';
    const rotation = (Math.random() * 720 - 360).toFixed(0) + 'deg';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const fontSize = Math.floor(Math.random() * 24 + 20) + 'px';
    
    // Set CSS custom properties
    heart.style.setProperty('--x', `${x}vw`);
    heart.style.setProperty('--drift', drift);
    heart.style.setProperty('--s', size);
    heart.style.setProperty('--dur', duration);
    heart.style.setProperty('--delay', delay);
    heart.style.setProperty('--rot', rotation);
    heart.style.setProperty('--color', color);
    heart.style.setProperty('--size', fontSize);
    
    // Random emoji
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    
    // Remove after animation completes
    heart.addEventListener('animationend', () => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    });
    
    container.appendChild(heart);
  }
  
  // Spawn hearts at intervals
  function spawnHearts(timestamp) {
    if (!lastSpawn) lastSpawn = timestamp;
    const elapsed = timestamp - lastSpawn;
    
    if (elapsed > spawnInterval) {
      createHeart();
      lastSpawn = timestamp;
    }
    
    animationId = requestAnimationFrame(spawnHearts);
  }
  
  // Start spawning
  animationId = requestAnimationFrame(spawnHearts);
  
  // Initial burst
  for (let i = 0; i < 15; i++) {
    setTimeout(() => createHeart(), i * 200);
  }
  
  // Cleanup
  return () => {
    if (animationId) cancelAnimationFrame(animationId);
  };
}

// Floating baklawa pieces
function initFloatingPieces() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  
  const container = document.createElement('div');
  container.className = 'floating-pieces';
  document.body.appendChild(container);
  
  for (let i = 0; i < 15; i++) {
    const piece = document.createElement('div');
    piece.className = 'baklawa-piece';
    
    // Random properties
    const size = Math.random() * 20 + 10;
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 20;
    const delay = Math.random() * 20;
    
    piece.style.width = `${size}px`;
    piece.style.height = `${size}px`;
    piece.style.left = `${left}vw`;
    piece.style.animationDelay = `${delay}s`;
    piece.style.animationDuration = `${duration}s`;
    
    container.appendChild(piece);
  }
}

// Lightbox for gallery
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  
  const imgEl = lightbox.querySelector('.lightbox__img');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  
  function openLightbox(src, alt) {
    lightbox.classList.add('open');
    imgEl.src = src;
    imgEl.alt = alt || 'Baklawa photo';
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('open');
    setTimeout(() => {
      imgEl.src = '';
      imgEl.alt = '';
    }, 300);
    document.body.style.overflow = '';
  }
  
  // Gallery click handlers
  document.querySelectorAll('.gcard img').forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img.src, img.alt);
    });
  });
  
  // Close handlers
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}

// Scroll progress indicator
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  
  function updateProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  }
  
  window.addEventListener('scroll', updateProgress);
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      const offsetTop = target.offsetTop - 80;
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    });
  });
}

// Hover effects for cards
function initHoverEffects() {
  const cards = document.querySelectorAll('.glass-card, .product, .gcard');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Shopify Buy Button Integration
function loadShopify() {
  // Check if Shopify is already loaded
  if (window.ShopifyBuy && window.ShopifyBuy.UI) {
    initShopifyButtons();
    return;
  }
  
  // Load Shopify script
  const script = document.createElement('script');
  script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  script.onload = initShopifyButtons;
  script.onerror = () => console.error('Failed to load Shopify script');
  document.head.appendChild(script);
}

function initShopifyButtons() {
  if (!window.ShopifyBuy) {
    console.error('ShopifyBuy not available');
    return;
  }
  
  // Client configuration
  const client = ShopifyBuy.buildClient({
    domain: 'bm3rcp-p3.myshopify.com',
    storefrontAccessToken: 'e6ed311285d5b71c3057ed317f544f2d'
  });
  
  // Initialize UI
  ShopifyBuy.UI.onReady(client).then((ui) => {
    // Create cart component first
    ui.createComponent('cart', {
      node: document.getElementById('cart-container'),
      moneyFormat: '%24%7B%7Bamount%7D%7D',
      options: {
        cart: {
          styles: {
            button: {
              'background-color': '#D9B35E',
              ':hover': {
                'background-color': '#B98E3C'
              }
            }
          }
        },
        toggle: {
          styles: {
            toggle: {
              'background-color': '#D9B35E',
              ':hover': {
                'background-color': '#B98E3C'
              }
            }
          }
        }
      }
    });
    
    // Product configuration
    const productOptions = {
      product: {
        styles: {
          product: {
            '@media (min-width: 601px)': {
              'max-width': '100%',
              'margin-left': '0',
              'margin-bottom': '50px'
            }
          },
          button: {
            'background-color': '#D9B35E',
            ':hover': {
              'background-color': '#B98E3C'
            },
            'border-radius': '14px',
            'font-weight': '700',
            'font-family': 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
          },
          title: {
            'color': '#2A1E12'
          },
          price: {
            'color': '#2A1E12'
          },
          compareAt: {
            'color': '#2A1E12'
          }
        },
        buttonDestination: 'modal',
        contents: {
          img: false,
          title: false,
          price: false
        },
        text: {
          button: 'Add to cart'
        }
      },
      modalProduct: {
        contents: {
          img: false,
          imgWithCarousel: true,
          button: false,
          buttonWithQuantity: true
        },
        styles: {
          product: {
            '@media (min-width: 601px)': {
              'max-width': '100%',
              'margin-left': '0',
              'margin-bottom': '0px'
            }
          },
          button: {
            'background-color': '#D9B35E',
            ':hover': {
              'background-color': '#B98E3C'
            }
          }
        },
        text: {
          button: 'Add to cart'
        }
      },
      cart: {
        text: {
          total: 'Subtotal',
          button: 'Checkout'
        }
      },
      toggle: {
        styles: {
          toggle: {
            'background-color': '#D9B35E',
            ':hover': {
              'background-color': '#B98E3C'
            }
          }
        }
      }
    };
    
    // Initialize product buttons
    const products = [
      { id: '10224601497889', node: document.getElementById('buy-12') },
      { id: '10224657858849', node: document.getElementById('buy-48') },
      { id: '10224743612705', node: document.getElementById('buy-24') },
      { id: '10230161146145', node: document.getElementById('buy-vday') }
    ];
    
    products.forEach(product => {
      if (product.node) {
        ui.createComponent('product', {
          id: product.id,
          node: product.node,
          moneyFormat: '%24%7B%7Bamount%7D%7D',
          options: productOptions
        });
      }
    });
    
    // Add cart toggle button to topbar if not exists
    if (!document.getElementById('cart-toggle')) {
      const cartToggleContainer = document.createElement('div');
      cartToggleContainer.id = 'cart-toggle';
      cartToggleContainer.style.cssText = 'margin-left: auto; margin-right: 16px;';
      document.querySelector('.topbar__cta').prepend(cartToggleContainer);
      
      ui.createComponent('cart', {
        node: cartToggleContainer,
        options: {
          toggle: {
            styles: {
              toggle: {
                'background-color': '#D9B35E',
                ':hover': { 'background-color': '#B98E3C' },
                'border-radius': '14px',
                'padding': '12px 16px',
                'font-family': 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
              }
            }
          }
        }
      });
    }
  }).catch(error => {
    console.error('Shopify UI initialization failed:', error);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initAnimatedBackground();
  initReveal();
  initHearts();
  initFloatingPieces();
  initLightbox();
  initScrollProgress();
  initSmoothScroll();
  initHoverEffects();
  loadShopify();
  
  // Add loading animation for images
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
      this.style.opacity = '1';
      this.style.transition = 'opacity 0.5s ease';
    });
  });
});

// Handle window resize
window.addEventListener('resize', () => {
  // Reinitialize animations if needed
  if (window.innerWidth < 768) {
    document.querySelectorAll('.heart').forEach(heart => {
      heart.style.animationDuration = '6s';
    });
  }
});
