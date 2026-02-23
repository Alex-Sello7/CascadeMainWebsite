// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100,
        disable: function() { return window.innerWidth < 768; }
    });

    // ===== LOADING SCREEN — 3 BOUNCING BALLS =====
    const loadingScreen = document.getElementById('loadingScreen');

    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1200);
    });

    // ===== SOCIAL MEDIA BROWSER DETECTION =====
    function isSocialMediaBrowser() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return /FBAN|FBAV|Twitter|Instagram|LinkedIn/i.test(userAgent);
    }

    if (isSocialMediaBrowser()) {
        document.addEventListener('DOMContentLoaded', function() {
            const viewport = document.querySelector("meta[name=viewport]");
            if (viewport) {
                viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
            }
            document.addEventListener('focusin', function(e) {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                    setTimeout(() => window.scrollTo(0, 0), 100);
                }
            });
        });
    }

    // ===== NAVIGATION =====
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
        
        const lines = this.querySelectorAll('.toggle-line');
        if (this.classList.contains('active')) {
            lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg) translate(7px, -8px)';
        } else {
            lines[0].style.transform = '';
            lines[1].style.opacity = '';
            lines[2].style.transform = '';
        }
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const lines = navToggle.querySelectorAll('.toggle-line');
                lines.forEach(line => {
                    line.style.transform = '';
                    line.style.opacity = '';
                });
                
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !navToggle.contains(event.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            const lines = navToggle.querySelectorAll('.toggle-line');
            lines.forEach(line => {
                line.style.transform = '';
                line.style.opacity = '';
            });
        }
    });

    // Update active nav link on scroll
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const targetTop = targetElement.offsetTop;
                    const targetBottom = targetTop + targetElement.offsetHeight;
                    if (scrollPosition >= targetTop && scrollPosition < targetBottom) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                }
            }
        });
    }
    
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavLink, 50);
    });

    // ===== HERO TYPING ANIMATION =====
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const sentences = ['Web Applications', 'Digital Experiences', 'Mobile Solutions', 'E-commerce Platforms', 'Brand Identity'];
        let sentenceIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;
        
        function typeText() {
            if (isPaused) return;
            const currentSentence = sentences[sentenceIndex];
            
            if (!isDeleting) {
                typingText.textContent = currentSentence.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentSentence.length) {
                    isPaused = true;
                    setTimeout(() => {
                        isPaused = false;
                        isDeleting = true;
                        setTimeout(typeText, 500);
                    }, 2000);
                    return;
                }
            } else {
                typingText.textContent = currentSentence.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    sentenceIndex = (sentenceIndex + 1) % sentences.length;
                }
            }
            setTimeout(typeText, isDeleting ? 50 : 100);
        }
        setTimeout(typeText, 1000);
    }

    // ===== ANIMATED COUNTERS =====
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            const originalText = counter.textContent;
            if (originalText.includes('+')) counter.textContent = Math.floor(current) + '+';
            else if (originalText.includes('%')) counter.textContent = Math.floor(current) + '%';
            else if (originalText.includes('/')) counter.textContent = Math.floor(current) + '/7';
            else counter.textContent = Math.floor(current);
        }, 16);
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(counter => {
                    if (!counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        animateCounter(counter);
                    }
                });
            }
        });
    }, { threshold: 0.5, rootMargin: '0px 0px -100px 0px' });
    
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) observer.observe(heroSection);

    // ===== BACK TO TOP BUTTON =====
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);
    
    function toggleBackToTop() {
        if (window.pageYOffset > 300) backToTopBtn.classList.add('visible');
        else backToTopBtn.classList.remove('visible');
    }
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop);

    // ===== FORM SUBMISSION =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(this);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone') || 'Not provided',
                    message: formData.get('message')
                };
                
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showAlert('Success! Your message has been sent. We\'ll get back to you within 24 hours.', 'success');
                    this.reset();
                } else {
                    const subject = encodeURIComponent('Cascade Creations Inquiry');
                    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\nMessage:\n${data.message}`);
                    window.location.href = `mailto:atsello4@gmail.com?subject=${subject}&body=${body}`;
                    showAlert('Email client opened. Please send the pre-filled email.', 'success');
                    this.reset();
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showAlert('Oops! Something went wrong. Please try again or contact us directly.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Alert system
    function showAlert(message, type) {
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) existingAlert.remove();
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="alert-close" aria-label="Close alert"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(alert);
        setTimeout(() => alert.classList.add('show'), 10);
        
        const closeBtn = alert.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        });
        
        setTimeout(() => {
            if (alert.parentNode) {
                alert.classList.remove('show');
                setTimeout(() => alert.remove(), 300);
            }
        }, 5000);
    }

    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!email || !emailRegex.test(email)) {
                showAlert('Please enter a valid email address.', 'error');
                return;
            }
            showAlert('Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
        });
    }

    // ===== HERO PARALLAX (SINGLE BG IMAGE) =====
    const heroBg = document.querySelector('.hero-parallax-bg');

    function updateHeroParallax() {
        if (!heroBg) return;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || window.innerWidth < 768) return;

        const scrollY = window.pageYOffset;
        // Shift the bg at a slower rate than scroll for parallax feel
        heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
    }

    window.addEventListener('scroll', throttle(updateHeroParallax, 16));
    updateHeroParallax();

    // ===== PARALLAX CTA =====
    function initParallaxCTA() {
        const parallaxSection = document.querySelector('.parallax-section');
        if (!parallaxSection) return;
        
        const parallaxLayers = parallaxSection.querySelectorAll('.parallax-bg');
        if (parallaxLayers.length === 0) return;
        
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || window.innerWidth < 768) {
            parallaxLayers.forEach(layer => {
                layer.style.backgroundAttachment = 'scroll';
            });
            return;
        }
        
        function updateParallax() {
            const scrollPosition = window.pageYOffset;
            const sectionTop = parallaxSection.offsetTop;
            const sectionHeight = parallaxSection.offsetHeight;
            const sectionStart = sectionTop - window.innerHeight;
            const sectionEnd = sectionTop + sectionHeight;
            
            if (scrollPosition >= sectionStart && scrollPosition <= sectionEnd) {
                const relativeScroll = scrollPosition - sectionStart;
                parallaxLayers.forEach(layer => {
                    const depth = parseFloat(layer.getAttribute('data-depth')) || 0.1;
                    const yOffset = relativeScroll * depth * 0.3;
                    layer.style.transform = `translateY(${yOffset}px) scale(${1 + depth * 0.5})`;
                });
            }
        }
        
        window.addEventListener('scroll', throttle(updateParallax, 16));
        window.addEventListener('resize', debounce(updateParallax, 250));
        updateParallax();
    }

    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), wait);
        };
    }
    
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            if (!inThrottle) {
                func.apply(this, arguments);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    initParallaxCTA();

    // ===== SET CURRENT YEAR =====
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) yearElement.textContent = currentYear;

    // ===== STUDIO LINK POPUP =====
    const studioLink = document.querySelector('a[href*="CascadeComingSoon"]');
    if (studioLink) {
        studioLink.addEventListener('click', function(e) {
            e.preventDefault();
            showAlert('Direct contact: atsello4@gmail.com or 072 078 6569', 'success');
        });
    }

    // ===== SCROLL EFFECTS =====
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });
});

// ===== GLOBAL UTILITIES =====
window.CascadeUtils = {
    debounce: function(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), wait);
        };
    },
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            if (!inThrottle) {
                func.apply(this, arguments);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    copyToClipboard: function(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(err);
            } finally {
                document.body.removeChild(textArea);
            }
        }
    }
};

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
    if (e.message && e.message.includes('ResizeObserver')) {
        e.preventDefault();
    }
}, true);

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// ===== NETWORK STATUS =====
window.addEventListener('online', function() {
    if (window.showAlert) showAlert('You are back online!', 'success');
});
window.addEventListener('offline', function() {
    if (window.showAlert) showAlert('You are currently offline. Some features may not be available.', 'error');
});