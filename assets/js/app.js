/* Baklawa Bites — Valentine's Day Special */
/* Complete with seamless background, longer heart animations, and Shopify integration */

// Initialize current year
function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// Create seamless particle overlay
function createParticleOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'background-overlay';
  document.body.appendChild(overlay);
  
  const particles = document.createElement('div');
  particles.className = 'baklawa-particles';
  document.body.appendChild(particles);
}

// Enhanced hearts with longer duration (15 seconds)
function initHearts() {
  const container = document.querySelector('.hearts');
  if (!container) return;
  
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  const colors = ['#FF4D8D', '#FF86B6', '#D9B35E', '#F7B7D2'];
  const heartEmojis = ['❤️', '💖', '💝', '💗', '💓', '💞'];
  const heartCount = 25;
  
  function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    
    // Random properties for longer, more dramatic animation
    const x = Math.random() * 100;
    const drift1 = (Math.random() * 20 - 10) + 'vw';
    const drift2 = (Math.random() * 30 - 15) + 'vw';
    const drift3 = (Math.random() * 40 - 20) + 'vw';
    const drift4 = (Math.random() * 30 - 15) + 'vw';
    const drift5 = (Math.random() * 20 - 10) + 'vw';
    const size = Math.random() * 24 + 16 + 'px';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const delay = Math.random() * 10 + 's';
    const emoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    
    // Set CSS custom properties
    heart.style.setProperty('--x', x + 'vw');
    heart.style.setProperty('--drift1', drift1);
    heart.style.setProperty('--drift2', drift2);
    heart.style.setProperty('--drift3', drift3);
    heart.style.setProperty('--drift4', drift4);
    heart.style.setProperty('--drift5', drift5);
    heart.style.setProperty('--size', size);
    heart.style.setProperty('--color', color);
    heart.style.animationDelay = delay;
    heart.textContent = emoji;
    
    container.appendChild(heart);
    
    // Remove heart after animation completes
    setTimeout(() => {
      if (heart.parentNode) heart.parentNode.removeChild(heart);
    }, 20000);
  }
  
  // Create initial hearts
  for (let i = 0; i < heartCount; i++) {
    setTimeout(() => createHeart(), i * 300);
  }
  
  // Continuously create new hearts
  setInterval(() => {
    if (document.querySelectorAll('.heart').length < heartCount) {
      createHeart();
    }
  }, 2000);
}

// Valentine-specific animations
function initValentineEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  // Add cupid arrow
  const cupidArrow = document.createElement('div');
  cupidArrow.className = 'cupid-arrow';
  cupidArrow.innerHTML = '💘';
  cupidArrow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cupidArrow);
  
  // Add floating love letters
  const lettersContainer = document.createElement('div');
  lettersContainer.className = 'love-letters-container';
  lettersContainer.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -1;
    overflow: hidden;
 
