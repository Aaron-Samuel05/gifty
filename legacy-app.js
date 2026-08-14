/* ==========================================
   ANISHKA'S SPECIAL WEBSITE - INTERACTIVE LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Floating Background Particle Engine ---
  initBackgroundCanvas();

  // --- 2. Real-Time Love Counter ---
  initLoveCounter();

  // --- 3. Gallery Lightbox & Like Counter ---
  initGalleryAndLightbox();

  // --- 4. Interactive Flip Cards ---
  initFlipCards();

  // --- 5. Secret Lockbox & Envelope ---
  initSecretEnvelope();

  // --- 6. Mini Game: Catch Hearts ---
  initMiniGame();

  // --- 7. Theme Switcher ---
  initThemeToggle();

  // --- 8. Audio Synthesizer (Melody & SFX) ---
  initAudioSynthesizer();
});

/* ==========================================
   BACKGROUND CANVAS (Hearts & Sparkles)
   ========================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const heartSymbols = ['💖', '💕', '✨', '🌸', '💘', '💫'];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + 20;
      this.size = Math.random() * 16 + 12;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.symbol = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      this.opacity = Math.random() * 0.6 + 0.3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.y * 0.01) + this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.symbol, 0, 0);
      ctx.restore();
    }
  }

  // Create initial particles
  for (let i = 0; i < 28; i++) {
    particles.push(new Particle());
  }

  // Mouse Trail Sparkles
  const mouseSparks = [];
  window.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.3) {
      mouseSparks.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 8 + 4,
        color: `hsl(${Math.random() * 40 + 330}, 100%, 75%)`,
        alpha: 1,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      });
    }
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw background particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw mouse sparks
    for (let i = mouseSparks.length - 1; i >= 0; i--) {
      const s = mouseSparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= 0.03;

      if (s.alpha <= 0) {
        mouseSparks.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================
   LOVE COUNTER TIMER
   ========================================== */
function initLoveCounter() {
  // Milestone date - February 12, 2026, 5:00 PM
  const startDate = new Date('2026-02-12T17:00:00');

  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');
  const secsEl = document.getElementById('timer-secs');

  if (!daysEl) return;

  function updateTimer() {
    const now = new Date();
    const diff = Math.abs(now - startDate);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================
   GALLERY & LIGHTBOX MODAL
   ========================================== */
function initGalleryAndLightbox() {
  const cards = document.querySelectorAll('.polaroid-card');
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const styleBtns = document.querySelectorAll('.lightbox-tools .filter-btn');

  let currentIndex = 0;

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      cards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
      playPopSFX(600);
    });
  });

  // Open Lightbox
  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      // Don't open lightbox if user clicked the like button
      if (e.target.closest('.like-btn')) return;

      currentIndex = parseInt(card.dataset.index, 10);
      openLightbox(currentIndex);
    });
  });

  function openLightbox(index) {
    const card = document.querySelector(`.polaroid-card[data-index="${index}"]`);
    if (!card) return;

    const img = card.querySelector('.polaroid-img');
    const caption = card.querySelector('.polaroid-caption');

    lightboxImg.src = img.src;
    lightboxCaption.textContent = caption.textContent;
    lightbox.classList.add('active');

    // Reset image filter to normal
    lightboxImg.className = 'lightbox-img filter-normal';
    styleBtns.forEach(b => b.classList.remove('active'));
    styleBtns[0].classList.add('active');

    playPopSFX(700);
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  closeBtn?.addEventListener('click', closeLightbox);

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Navigation
  prevBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    openLightbox(currentIndex);
  });

  nextBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cards.length;
    openLightbox(currentIndex);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });

  // Image Filter Styles inside Lightbox
  styleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      styleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const style = btn.dataset.style;
      lightboxImg.className = `lightbox-img filter-${style}`;
      playPopSFX(800);
    });
  });

  // Like Buttons with Exploding Hearts
  const likeBtns = document.querySelectorAll('.like-btn');
  likeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const countEl = btn.querySelector('.like-count');
      let count = parseInt(countEl.textContent, 10);

      if (btn.classList.contains('liked')) {
        btn.classList.remove('liked');
        countEl.textContent = count - 1;
      } else {
        btn.classList.add('liked');
        countEl.textContent = count + 1;
        triggerFloatingHeart(e.clientX, e.clientY);
        playPopSFX(950);
      }
    });
  });
}

function triggerFloatingHeart(x, y) {
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('div');
    el.textContent = '💖';
    el.style.position = 'fixed';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    el.style.fontSize = `${Math.random() * 16 + 20}px`;
    el.style.transition = 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    document.body.appendChild(el);

    setTimeout(() => {
      el.style.transform = `translate(${(Math.random() - 0.5) * 120}px, -${Math.random() * 100 + 50}px) scale(1.5)`;
      el.style.opacity = '0';
    }, 10);

    setTimeout(() => el.remove(), 1000);
  }
}

/* ==========================================
   FLIP CARDS DECK
   ========================================== */
function initFlipCards() {
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      playPopSFX(500);
    });
  });
}

/* ==========================================
   SECRET LOCKBOX & ENVELOPE
   ========================================== */
function initSecretEnvelope() {
  const form = document.getElementById('secret-form');
  const input = document.getElementById('passcode-input');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope = document.getElementById('envelope');
  const letterContent = document.getElementById('letter-content');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Accept any passcode or hint
    envelopeWrapper.classList.add('active');
    envelopeWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    playPopSFX(750);
  });

  envelope?.addEventListener('click', () => {
    envelope.classList.add('open');
    setTimeout(() => {
      letterContent.classList.add('show');
      letterContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
      playPopSFX(900);
    }, 600);
  });
}

/* ==========================================
   MINI GAME: CATCH ANISHKA'S HEARTS
   ========================================== */
function initMiniGame() {
  const canvas = document.getElementById('game-canvas');
  const startBtn = document.getElementById('start-game-btn');
  const scoreEl = document.getElementById('game-score');

  if (!canvas || !startBtn) return;
  const ctx = canvas.getContext('2d');

  let isPlaying = false;
  let score = 0;
  let animationId = null;
  let hearts = [];

  function resizeGameCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 380;
  }

  resizeGameCanvas();
  window.addEventListener('resize', resizeGameCanvas);

  class FallingHeart {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * (canvas.width - 40) + 20;
      this.y = -30;
      this.speed = Math.random() * 2 + 1.5;
      this.radius = Math.random() * 10 + 16;
      this.color = `hsl(${Math.random() * 40 + 330}, 100%, 65%)`;
    }

    update() {
      this.y += this.speed;
      if (this.y > canvas.height + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.font = `${this.radius * 1.5}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💖', this.x, this.y);
      ctx.restore();
    }
  }

  function gameLoop() {
    if (!isPlaying) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn hearts randomly
    if (hearts.length < 10 && Math.random() < 0.05) {
      hearts.push(new FallingHeart());
    }

    hearts.forEach(h => {
      h.update();
      h.draw();
    });

    animationId = requestAnimationFrame(gameLoop);
  }

  startBtn.addEventListener('click', () => {
    isPlaying = true;
    score = 0;
    scoreEl.textContent = score;
    hearts = [];
    startBtn.textContent = 'Restart Game 🔄';
    cancelAnimationFrame(animationId);
    gameLoop();
    playPopSFX(800);
  });

  function handleCanvasClick(e) {
    if (!isPlaying) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      const dist = Math.hypot(clickX - h.x, clickY - h.y);

      if (dist < h.radius * 2) {
        // Heart caught!
        score += 1;
        scoreEl.textContent = score;
        hearts.splice(i, 1);
        playPopSFX(1000 + score * 50);

        // Milestone reward
        if (score === 10) {
          alert("🎉 Awesome! Anishka scored 10 Hearts! You're super fast! 💕");
        } else if (score === 25) {
          alert("👑 Master Heart Catcher! Anishka wins the Golden Heart Trophy! 🏆💖");
        }
        break;
      }
    }
  }

  canvas.addEventListener('click', handleCanvasClick);
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      handleCanvasClick(e.touches[0]);
    }
  });
}

/* ==========================================
   THEME TOGGLE (Cute Pastel / Cool Neon)
   ========================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;

  toggleBtn?.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'cool' ? 'cute' : 'cool';

    html.setAttribute('data-theme', newTheme);
    toggleBtn.textContent = newTheme === 'cool' ? '🌙' : '✨';
    playPopSFX(650);
  });
}

/* ==========================================
   BACKGROUND MUSIC (Earrings.mp3)
   ========================================== */
let audioCtx = null;  // shared context for SFX
let bgAudio = null;
let isAudioPlaying = false;

function initAudioSynthesizer() {
  const audioBtn = document.getElementById('audio-toggle');
  if (!audioBtn) return;

  // Create the audio element once
  bgAudio = new Audio('Earrings.mp3');
  bgAudio.loop = true;
  bgAudio.volume = 0;          // start silent, fade in
  bgAudio.preload = 'auto';

  audioBtn.addEventListener('click', () => {
    // Initialise AudioContext on first user gesture (required by browsers)
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (isAudioPlaying) {
      // Fade out then pause
      fadeAudio(bgAudio, 0, 600, () => bgAudio.pause());
      audioBtn.classList.remove('playing');
      audioBtn.textContent = '🎵';
      isAudioPlaying = false;
    } else {
      // Play and fade in
      bgAudio.play().then(() => {
        fadeAudio(bgAudio, 0.75, 800);
      }).catch(() => {});
      audioBtn.classList.add('playing');
      audioBtn.textContent = '🎶';
      isAudioPlaying = true;
    }

    playPopSFX(700);
  });
}

/* Smooth volume fade helper */
function fadeAudio(audio, targetVol, durationMs, onComplete) {
  const startVol = audio.volume;
  const diff = targetVol - startVol;
  const steps = 30;
  const stepTime = durationMs / steps;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    audio.volume = Math.min(1, Math.max(0, startVol + diff * (step / steps)));
    if (step >= steps) {
      clearInterval(timer);
      if (onComplete) onComplete();
    }
  }, stepTime);
}

/* ==========================================
   SFX POP TONES (unchanged — used site-wide)
   ========================================== */
function playPopSFX(freq = 800) {
  try {
    const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    // Audio context fallback silent
  }
}
