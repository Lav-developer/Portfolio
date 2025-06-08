document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Set dark mode as default on page load
    document.body.classList.add('dark-mode');
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('#options');
    
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('touchstart', function(e) {
        e.preventDefault();
        toggleMenu();
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('#options a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Dark mode toggle
    const darkModeToggle = document.createElement('div');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Start with sun icon since dark mode is default
    document.body.appendChild(darkModeToggle);
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
    
    // Smooth scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate elements when scrolling
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.project-card, .certificate-card, .about-content, .contact-container');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    document.querySelectorAll('.project-card, .certificate-card, .about-content, .contact-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load

    // Certificate modal functionality
    const modal = document.getElementById('certificate-modal');
    const modalImg = document.getElementById('modal-image');
    const closeModal = document.querySelector('.close-modal');
    const certificatePreviews = document.querySelectorAll('.certificate-preview');

    certificatePreviews.forEach(preview => {
        preview.addEventListener('click', function() {
            modal.style.display = 'flex';
            modalImg.src = this.src;
        });
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Force Font Awesome to re-render icons
    if (typeof FontAwesome !== 'undefined') {
        FontAwesome.dom.i2svg();
    }

    // Typing animation for intro text
    const typingText = document.getElementById('typing-text');
    const fullText = typingText.textContent;
    const phrases = fullText.split(' | ').map(phrase => phrase.trim());
    let currentPhraseIndex = 0;
    let charIndex = 0;
    let isTyping = true;
    const typingSpeed = 200;
    const erasingSpeed = 50;
    const pauseDuration = 1500;

    function animateText() {
        const currentPhrase = phrases[currentPhraseIndex];

        if (isTyping) {
            if (charIndex < currentPhrase.length) {
                typingText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(animateText, typingSpeed);
            } else {
                setTimeout(() => {
                    isTyping = false;
                    charIndex--;
                    animateText();
                }, pauseDuration);
            }
        } else {
            if (charIndex >= 0) {
                typingText.textContent = currentPhrase.substring(0, charIndex);
                charIndex--;
                setTimeout(animateText, erasingSpeed);
            } else {
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                isTyping = true;
                charIndex = 0;
                setTimeout(animateText, pauseDuration / 2);
            }
        }
    }

    typingText.textContent = '';
    setTimeout(animateText, 500);
});