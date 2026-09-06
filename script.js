// Portfolio 2026 — AI / Full-Stack Developer
// Clean, performant, accessible implementation

// Matrix Background — subtle, performant
class MatrixEffect {
  constructor() {
    this.canvas = document.getElementById('matrix-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*01';
    this.fontSize = 13;
    this.columns = 0;
    this.drops = [];
    this.raf = null;
    this.lastFrame = 0;
    this.fps = 18; // limit FPS for performance
    this.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.prefersReduced) {
      this.canvas.style.display = 'none';
      return;
    }
    this.init();
    this.animate = this.animate.bind(this);
    this.raf = requestAnimationFrame(this.animate);
    window.addEventListener('resize', this.debounce(() => this.init(), 200));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.raf) cancelAnimationFrame(this.raf);
      } else {
        this.raf = requestAnimationFrame(this.animate);
      }
    });
  }
  init() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.columns = Math.floor(window.innerWidth / this.fontSize);
    this.drops = Array(this.columns).fill(0).map(() => Math.floor(Math.random() * -20));
  }
  animate(now) {
    this.raf = requestAnimationFrame(this.animate);
    if (now - this.lastFrame < 1000 / this.fps) return;
    this.lastFrame = now;
    this.ctx.fillStyle = 'rgba(10, 14, 26, 0.08)';
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    this.ctx.fillStyle = '#00f5ff';
    this.ctx.font = `${this.fontSize}px JetBrains Mono`;
    for (let i = 0; i < this.drops.length; i++) {
      if (Math.random() > 0.97) {
        const ch = this.chars[Math.floor(Math.random() * this.chars.length)];
        this.ctx.fillText(ch, i * this.fontSize, this.drops[i] * this.fontSize);
      }
      if (this.drops[i] * this.fontSize > window.innerHeight && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i] += 0.9;
    }
  }
  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
}

// Typing animation
class TypingAnimation {
  constructor(element, phrases, options = {}) {
    if (!element) return;
    this.element = element;
    this.phrases = phrases;
    this.options = { typeSpeed: 85, deleteSpeed: 40, pauseTime: 1800, ...options };
    this.currentPhrase = 0;
    this.currentChar = 0;
    this.isDeleting = false;
    this.timeout = null;
    this.type();
  }
  type() {
    const current = this.phrases[this.currentPhrase];
    if (this.isDeleting) {
      this.element.textContent = current.substring(0, this.currentChar - 1);
      this.currentChar--;
    } else {
      this.element.textContent = current.substring(0, this.currentChar + 1);
      this.currentChar++;
    }
    let speed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;
    if (!this.isDeleting && this.currentChar === current.length) {
      speed = this.options.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentChar === 0) {
      this.isDeleting = false;
      this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
      speed = 400;
    }
    this.timeout = setTimeout(() => this.type(), speed);
  }
}

// Smooth scroll with offset for fixed navbar
class SmoothScroll {
  constructor() {
    this.navbarHeight = 72;
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - this.navbarHeight;
        window.scrollTo({ top, behavior: 'smooth' });
        // close mobile menu if open
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
}

// Navbar scroll effect + active link
class NavbarScroll {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.links = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    if (!this.navbar) return;
    window.addEventListener('scroll', this.throttle(() => this.onScroll(), 100), { passive: true });
    this.onScroll();
  }
  onScroll() {
    if (window.scrollY > 20) this.navbar.classList.add('scrolled');
    else this.navbar.classList.remove('scrolled');
    // active link
    let current = '';
    this.sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    this.links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  }
  throttle(fn, wait) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(this, args);
      }
    };
  }
}

// Mobile menu
class MobileMenu {
  constructor() {
    this.hamburger = document.querySelector('.hamburger');
    this.navMenu = document.querySelector('.nav-menu');
    if (!this.hamburger || !this.navMenu) return;
    this.hamburger.addEventListener('click', () => {
      const isActive = this.hamburger.classList.toggle('active');
      this.navMenu.classList.toggle('active');
      this.hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      document.body.style.overflow = isActive ? 'hidden' : '';
    });
    document.addEventListener('click', (e) => {
      if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        this.hamburger.focus();
      }
    });
  }
}

// Scroll animations — lightweight
class ScrollAnimations {
  constructor() {
    const els = document.querySelectorAll('.project-card, .certificate-card, .contact-method, .skill-group, .timeline-item, .highlight-card, .about-stats, .tech-item');
    els.forEach(el => el.classList.add('animate-on-scroll'));
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('animated'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.animate-on-scroll').forEach(el => io.observe(el));
  }
}

// Certificate Tabs — supports All + categories via data-category
class CertificateTabs {
  constructor() {
    this.tabButtons = document.querySelectorAll('.certificates-tabs .tab-button');
    this.cards = document.querySelectorAll('#certificates-grid .certificate-card');
    if (!this.tabButtons.length) return;
    this.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        this.filter(tab);
      });
    });
  }
  filter(tab) {
    this.cards.forEach(card => {
      const cat = card.getAttribute('data-category') || '';
      if (tab === 'all' || cat === tab) {
        card.style.display = '';
        card.classList.remove('hidden');
      } else {
        card.style.display = 'none';
      }
    });
  }
}

// Certificate Modal — supports images + PDFs, no preload, accessible
class CertificateModal {
  constructor() {
    this.modal = document.getElementById('certificate-modal');
    this.modalImage = document.getElementById('modal-image');
    this.modalPdf = document.getElementById('modal-pdf');
    this.modalError = document.getElementById('modal-error');
    this.modalTitle = document.getElementById('modal-title');
    this.openNew = document.getElementById('modal-open-new');
    this.download = document.getElementById('modal-download');
    this.closeBtn = this.modal ? this.modal.querySelector('.modal-close') : null;
    this.lastFocused = null;
    if (!this.modal) return;
    this.bind();
  }

  bind() {
    // delegate click for any .view-certificate
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.view-certificate');
      if (!btn) return;
      e.preventDefault();
      const src = btn.getAttribute('data-certificate') || btn.getAttribute('data-image');
      if (!src) return;
      const card = btn.closest('.certificate-card, .timeline-item');
      let title = 'Certificate';
      if (card) {
        const h3 = card.querySelector('h3');
        if (h3) title = h3.textContent.trim();
      }
      this.open(src, title, btn);
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('open')) {
        this.close();
      }
    });
  }

  getFileType(url) {
    try {
      // strip query/hash
      const clean = url.split('?')[0].split('#')[0];
      const ext = clean.split('.').pop().toLowerCase();
      const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'];
      if (imageExts.includes(ext)) return 'image';
      if (ext === 'pdf') return 'pdf';
      return 'unknown';
    } catch {
      return 'unknown';
    }
  }

  open(src, title, triggerEl) {
    this.lastFocused = triggerEl || document.activeElement;
    const type = this.getFileType(src);

    // reset
    this.modalImage.style.display = 'none';
    this.modalImage.removeAttribute('src');
    this.modalPdf.style.display = 'none';
    this.modalPdf.removeAttribute('src');
    this.modalError.style.display = 'none';
    this.openNew.style.display = 'none';
    this.download.style.display = 'none';
    this.openNew.removeAttribute('href');
    this.download.removeAttribute('href');
    this.modalTitle.textContent = title || '';

    if (type === 'image') {
      this.modalImage.src = src;
      this.modalImage.alt = title || 'Certificate image';
      this.modalImage.style.display = 'block';
      this.openNew.href = src;
      this.openNew.style.display = 'inline-flex';
      this.download.href = src;
      this.download.style.display = 'inline-flex';
      // set download filename
      const filename = src.split('/').pop().split('?')[0];
      this.download.setAttribute('download', filename);
    } else if (type === 'pdf') {
      // Load PDF only when needed — no preload
      // Use iframe, allow browser native viewer
      this.modalPdf.src = src;
      this.modalPdf.style.display = 'block';
      this.openNew.href = src;
      this.openNew.style.display = 'inline-flex';
      this.openNew.textContent = ''; // reset then set
      this.openNew.innerHTML = '<i class="fas fa-external-link-alt"></i> Open PDF in New Tab';
      this.download.href = src;
      this.download.style.display = 'inline-flex';
      this.download.innerHTML = '<i class="fas fa-download"></i> Download PDF';
      const filename = src.split('/').pop().split('?')[0];
      this.download.setAttribute('download', filename);
    } else {
      this.modalError.style.display = 'flex';
      this.openNew.href = src;
      this.openNew.style.display = 'inline-flex';
      this.openNew.innerHTML = '<i class="fas fa-external-link-alt"></i> Open in New Tab';
    }

    this.modal.classList.add('open');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // focus trap
    this.bindFocusTrap();
    setTimeout(() => {
      if (this.closeBtn) this.closeBtn.focus();
    }, 60);
  }

  close() {
    this.unbindFocusTrap();
    this.modal.classList.remove('open');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // cleanup src to stop PDF loading / free memory
    setTimeout(() => {
      if (this.modalImage) {
        this.modalImage.removeAttribute('src');
        this.modalImage.style.display = 'none';
      }
      if (this.modalPdf) {
        this.modalPdf.removeAttribute('src');
        this.modalPdf.style.display = 'none';
      }
    }, 220);
    try {
      if (this.lastFocused) this.lastFocused.focus();
    } catch {}
  }

  bindFocusTrap() {
    this._trap = (e) => {
      if (e.key !== 'Tab') return;
      const focusable = this.modal.querySelectorAll('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])');
      const nodes = Array.from(focusable).filter(n => n.offsetParent !== null || n === this.modalPdf);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', this._trap);
  }
  unbindFocusTrap() {
    if (this._trap) {
      document.removeEventListener('keydown', this._trap);
      this._trap = null;
    }
  }
}

// Theme toggle — dark default
class ThemeToggle {
  constructor() {
    this.toggle = document.querySelector('.theme-toggle');
    this.body = document.body;
    if (!this.toggle) return;
    this.icon = this.toggle.querySelector('i');
    const saved = localStorage.getItem('theme');
    if (saved) this.setTheme(saved);
    else this.setTheme('dark');
    this.toggle.addEventListener('click', () => {
      const current = this.body.classList.contains('light-theme') ? 'light' : 'dark';
      this.setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
  setTheme(theme) {
    if (theme === 'light') {
      this.body.classList.add('light-theme');
      if (this.icon) this.icon.className = 'fas fa-moon';
    } else {
      this.body.classList.remove('light-theme');
      if (this.icon) this.icon.className = 'fas fa-sun';
    }
    localStorage.setItem('theme', theme);
  }
}

// Particle cursor — very light, disabled on touch
class ParticleCursor {
  constructor() {
    this.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (this.prefersReduced || this.isTouch) return;
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.active = false;
    this.init();
  }
  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      if (!this.active) {
        this.active = true;
        this.createCanvas();
      }
      if (Math.random() > 0.6) this.createParticle();
    }, { passive: true });
    this.animate();
  }
  createCanvas() {
    if (this.canvas) return;
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9998';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    window.addEventListener('resize', () => {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }
  createParticle() {
    if (!this.canvas) return;
    this.particles.push({
      x: this.mouse.x,
      y: this.mouse.y,
      size: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: (Math.random() - 0.5) * 1.2,
      life: 1,
      decay: Math.random() * 0.025 + 0.012
    });
    if (this.particles.length > 18) this.particles.shift();
  }
  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.life -= p.decay;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        return;
      }
      this.ctx.save();
      this.ctx.globalAlpha = p.life * 0.6;
      this.ctx.fillStyle = '#00f5ff';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  new MatrixEffect();
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    new TypingAnimation(typingEl, [
      'AI / Full-Stack Developer',
      'Backend & Automation Builder',
      'Python Developer',
      'Java Developer',
      'AI Product Builder'
    ], { typeSpeed: 70, deleteSpeed: 35, pauseTime: 1800 });
  }
  new SmoothScroll();
  new NavbarScroll();
  new MobileMenu();
  new ScrollAnimations();
  new CertificateTabs();
  new CertificateModal();
  new ThemeToggle();
  new ParticleCursor();

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // No preload of certificates — intentionally removed for performance
  // Lazy loading via loading="lazy" on images is enough

  // Body loaded
  document.body.classList.add('loaded');

  // Error handling for images
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
      this.style.opacity = '0.3';
      this.alt = this.alt + ' (failed to load)';
      console.warn(`Failed to load image: ${this.src}`);
    });
  });

  // Keyboard accessibility for project links that are divs? All are <a> now
});

// Performance helpers
const debounce = (fn, wait) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};
