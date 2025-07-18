// Modern Portfolio Script with Advanced Features
class ModernPortfolio {
    constructor() {
        this.init();
    }

    init() {
        this.initializeComponents();
        this.setupEventListeners();
        this.initializeAnimations();
        this.initializeIntersectionObserver();
        this.setupPerformanceOptimizations();
    }

    initializeComponents() {
        // Initialize all components
        this.matrixEffect = new MatrixEffect();
        this.cursorFollower = new CursorFollower();
        this.typingAnimation = new TypingAnimation();
        this.smoothScroll = new SmoothScroll();
        this.navbarController = new NavbarController();
        this.mobileMenu = new MobileMenu();
        this.certificateModal = new CertificateModal();
        this.certificateTabs = new CertificateTabs();
        this.themeToggle = new ThemeToggle();
        this.scrollAnimations = new ScrollAnimations();
        this.particleSystem = new ParticleSystem();
    }

    setupEventListeners() {
        // Global event listeners
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            this.preloadImages();
        });

        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Performance-optimized scroll event
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    initializeAnimations() {
        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            delay: 0,
        });

        // Initialize GSAP
        gsap.registerPlugin(ScrollTrigger);
        this.setupGSAPAnimations();
    }

    setupGSAPAnimations() {
        // Hero section animations
        const heroTl = gsap.timeline();
        heroTl.from('.hero-greeting', { opacity: 0, y: 30, duration: 0.8 })
              .from('.hero-name', { opacity: 0, y: 40, duration: 0.8 }, '-=0.6')
              .from('.hero-title', { opacity: 0, y: 40, duration: 0.8 }, '-=0.6')
              .from('.hero-description', { opacity: 0, y: 30, duration: 0.8 }, '-=0.6')
              .from('.hero-cta', { opacity: 0, y: 30, duration: 0.8 }, '-=0.6')
              .from('.hero-visual', { opacity: 0, x: 50, duration: 1 }, '-=0.8');

        // Scroll-triggered animations
        gsap.utils.toArray('.project-card').forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    scrub: false,
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power2.out'
            });
        });

        // Parallax effects
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    scrub: 1,
                },
                y: 30,
                opacity: 0.8,
            });
        });

        // Tech items stagger animation
        gsap.from('.tech-item', {
            scrollTrigger: {
                trigger: '.tech-grid',
                start: 'top 80%',
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }

    initializeIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        
                        // Add specific animations based on element type
                        if (entry.target.classList.contains('project-card')) {
                            this.animateProjectCard(entry.target);
                        }
                        
                        if (entry.target.classList.contains('tech-item')) {
                            this.animateTechItem(entry.target);
                        }
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Observe elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    animateProjectCard(card) {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out'
        });
    }

    animateTechItem(item) {
        gsap.from(item, {
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            ease: 'back.out(1.7)'
        });
    }

    setupPerformanceOptimizations() {
        // Image lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Preload critical resources
        this.preloadCriticalResources();
    }

    preloadCriticalResources() {
        const criticalImages = [
            '/images/Lav pf2.jpg',
            '/images/amazon-clone.jpg',
            '/images/localkirana.jpg'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    preloadImages() {
        const images = [
            '/images/AIF-Hackathon.jpg',
            '/images/ISTD.png',
            '/images/HP_Cert.jpg',
            '/images/Hack2skill-Certificate.png',
            '/images/wcc.png'
        ];

        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    handleResize() {
        // Handle responsive changes
        this.matrixEffect.handleResize();
        this.particleSystem.handleResize();
    }

    handleScroll() {
        // Handle scroll events
        this.navbarController.handleScroll();
        this.cursorFollower.handleScroll();
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Matrix Background Effect
class MatrixEffect {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        
        this.init();
        this.animate();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00f5ff';
        this.ctx.font = `${this.fontSize}px JetBrains Mono`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        
        requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        this.init();
    }
}

// Cursor Follower
class CursorFollower {
    constructor() {
        this.cursor = document.querySelector('.cursor-follower');
        if (!this.cursor) return;
        
        this.mouse = { x: 0, y: 0 };
        this.pos = { x: 0, y: 0 };
        this.ratio = 0.15;
        this.active = false;
        
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        document.addEventListener('mouseenter', () => {
            this.active = true;
        });

        document.addEventListener('mouseleave', () => {
            this.active = false;
        });

        // Interactive elements
        document.querySelectorAll('a, button, .project-card, .tech-item').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(2)';
                this.cursor.style.mixBlendMode = 'normal';
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursor.style.mixBlendMode = 'difference';
            });
        });

        this.animate();
    }

    animate() {
        this.pos.x += (this.mouse.x - this.pos.x) * this.ratio;
        this.pos.y += (this.mouse.y - this.pos.y) * this.ratio;

        this.cursor.style.left = this.pos.x + 'px';
        this.cursor.style.top = this.pos.y + 'px';

        requestAnimationFrame(() => this.animate());
    }

    handleScroll() {
        // Handle scroll interactions
    }
}

// Typing Animation
class TypingAnimation {
    constructor() {
        this.element = document.getElementById('typing-text');
        if (!this.element) return;
        
        this.phrases = [
            'Full-Stack Developer',
            'Creative Coder',
            'Campus Ambassador @ PW',
            'Campus Ambassador @ GSSoC2025',
            'AI Enthusiast',
            'Problem Solver'
        ];
        
        this.currentPhrase = 0;
        this.currentChar = 0;
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        
        this.start();
    }

    start() {
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

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.currentChar === current.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentChar === 0) {
            this.isDeleting = false;
            this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Smooth Scroll
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Navbar Controller
class NavbarController {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.scrollY = 0;
        this.init();
    }

    init() {
        // Active link highlighting
        this.highlightActiveLink();
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        this.scrollY = currentScrollY;
        this.highlightActiveLink();
    }

    highlightActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top <= 100 && rect.bottom >= 100;

            if (isVisible) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${section.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Mobile Menu
class MobileMenu {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        if (!this.hamburger || !this.navMenu) return;
        
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => {
            this.toggle();
        });

        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.close();
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.close();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }

    toggle() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        this.hamburger.setAttribute('aria-expanded', 
            this.hamburger.classList.contains('active')
        );
    }

    close() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
    }
}

// Certificate Modal
class CertificateModal {
    constructor() {
        this.modal = document.getElementById('certificate-modal');
        this.modalImage = document.getElementById('modal-image');
        this.closeBtn = document.querySelector('.modal-close');
        this.viewButtons = document.querySelectorAll('.view-certificate');
        
        if (!this.modal) return;
        
        this.init();
    }

    init() {
        this.viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const imageSrc = button.getAttribute('data-image');
                this.open(imageSrc);
            });
        });

        this.closeBtn.addEventListener('click', () => {
            this.close();
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.close();
            }
        });
    }

    open(imageSrc) {
        this.modalImage.src = imageSrc;
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Animate modal
        gsap.from(this.modal, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        gsap.from(this.modalImage, {
            scale: 0.8,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    close() {
        gsap.to(this.modal, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
                this.modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Certificate Tabs
class CertificateTabs {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        if (!this.tabButtons.length) return;
        
        this.init();
    }

    init() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab, button);
            });
        });
    }

    switchTab(targetTab, button) {
        // Remove active classes
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
            
            // Animate content
            gsap.from(targetContent, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }
}

// Theme Toggle
class ThemeToggle {
    constructor() {
        this.toggle = document.querySelector('.theme-toggle');
        this.body = document.body;
        this.icon = this.toggle.querySelector('i');
        
        if (!this.toggle) return;
        
        this.init();
    }

    init() {
        // Set default theme
        this.setTheme('dark');
        
        this.toggle.addEventListener('click', () => {
            const currentTheme = this.body.classList.contains('light-theme') ? 'light' : 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        });

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        }
    }

    setTheme(theme) {
        if (theme === 'light') {
            this.body.classList.add('light-theme');
            this.icon.className = 'fas fa-moon';
        } else {
            this.body.classList.remove('light-theme');
            this.icon.className = 'fas fa-sun';
        }
        
        localStorage.setItem('theme', theme);
        
        // Animate theme change
        gsap.from(this.body, {
            opacity: 0.8,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.animate-on-scroll');
        this.init();
    }

    init() {
        // Add animate-on-scroll class to various elements
        const elementsToAnimate = [
            '.project-card',
            '.certificate-card',
            '.contact-method',
            '.tech-item',
            '.hero-content > *',
            '.about-text p',
            '.section-header'
        ];

        elementsToAnimate.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!el.classList.contains('animate-on-scroll')) {
                    el.classList.add('animate-on-scroll');
                }
            });
        });
    }
}

// Particle System
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        // Create canvas for particles
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.canvas.style.opacity = '0.6';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.createParticle();
        });

        this.animate();
    }

    createParticle() {
        if (this.particles.length > 50) return;

        const particle = {
            x: this.mouse.x,
            y: this.mouse.y,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            life: 1,
            decay: Math.random() * 0.02 + 0.01,
            color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`
        };

        this.particles.push(particle);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life -= particle.decay;

            if (particle.life <= 0) {
                this.particles.splice(index, 1);
                return;
            }

            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModernPortfolio();
});

// Loading animation
const loadingCSS = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
    }
    
    body.loaded {
        opacity: 1;
    }
`;

// Inject loading CSS
const style = document.createElement('style');
style.textContent = loadingCSS;
document.head.appendChild(style);

// Error handling for images
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn(`Failed to load image: ${this.src}`);
        });
    });
});

// Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
