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

    // ===== NAVIGATION SCROLL EFFECT - IMPROVED =====
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    function updateNavbarOnScroll() {
        if (!navbar) return;
        
        // Get scroll position from multiple sources for reliability
        const scrollTop = window.pageYOffset || 
                         document.documentElement.scrollTop || 
                         document.body.scrollTop || 
                         0;
        
        // Use a smaller threshold for more responsive behavior
        const scrollThreshold = 20;
        
        if (scrollTop > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Initial check
    updateNavbarOnScroll();
    
    // Listen for scroll events with multiple event types for reliability
    window.addEventListener('scroll', function() {
        // Use requestAnimationFrame for smoother performance
        window.requestAnimationFrame(updateNavbarOnScroll);
    }, { passive: true });
    
    // Also check on touch end for mobile devices
    window.addEventListener('touchend', function() {
        window.requestAnimationFrame(updateNavbarOnScroll);
    }, { passive: true });
    
    // Check when page finishes loading/refreshing
    window.addEventListener('load', function() {
        window.requestAnimationFrame(updateNavbarOnScroll);
    });
    
    // Check when page becomes visible (user switches back to tab)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            window.requestAnimationFrame(updateNavbarOnScroll);
        }
    });
    
    // Check on resize
    window.addEventListener('resize', function() {
        window.requestAnimationFrame(updateNavbarOnScroll);
    }, { passive: true });

    // ===== MOBILE NAVIGATION TOGGLE & CLOSE FUNCTIONALITY =====
    if (navbarToggler && navbarCollapse) {
        
        // Toggle menu when clicking the hamburger button
        navbarToggler.addEventListener('click', function(e) {
            e.stopPropagation();
            // Let Bootstrap handle the collapse toggling
            // We'll just manage body scroll
            setTimeout(() => {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                if (isExpanded) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }, 100);
        });

        // Close menu when clicking on a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    // Close the mobile menu
                    if (navbarCollapse.classList.contains('show')) {
                        // Trigger Bootstrap's collapse
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                            toggle: false
                        });
                        bsCollapse.hide();
                        document.body.style.overflow = '';
                        
                        // Reset toggler aria-expanded
                        navbarToggler.setAttribute('aria-expanded', 'false');
                        navbarToggler.classList.add('collapsed');
                    }
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            // Check if menu is open
            if (navbarCollapse.classList.contains('show')) {
                // Check if click is outside navbar and not on toggler
                if (!navbar.contains(e.target) || e.target === navbarToggler) {
                    // Close the mobile menu
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: false
                    });
                    bsCollapse.hide();
                    document.body.style.overflow = '';
                    
                    // Reset toggler aria-expanded
                    navbarToggler.setAttribute('aria-expanded', 'false');
                    navbarToggler.classList.add('collapsed');
                }
            }
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
                document.body.style.overflow = '';
                
                // Reset toggler aria-expanded
                navbarToggler.setAttribute('aria-expanded', 'false');
                navbarToggler.classList.add('collapsed');
            }
        });

        // Clean up when collapse is hidden
        navbarCollapse.addEventListener('hidden.bs.collapse', function() {
            document.body.style.overflow = '';
        });

        // Prevent body scroll when collapse is shown
        navbarCollapse.addEventListener('shown.bs.collapse', function() {
            document.body.style.overflow = 'hidden';
        });
    }

    // ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    // Smooth scroll to target
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Update navbar state after scrolling
                    setTimeout(() => {
                        window.requestAnimationFrame(updateNavbarOnScroll);
                    }, 300);
                }
            }
        });
    });

    // ===== UPDATE ACTIVE NAV LINK ON SCROLL =====
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
    
    // Throttled scroll handler for performance
    window.addEventListener('scroll', throttle(function() {
        window.requestAnimationFrame(updateActiveNavLink);
    }, 100));

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
            if (originalText.includes('+')) {
                counter.textContent = Math.floor(current) + '+';
            } else if (originalText.includes('%')) {
                counter.textContent = Math.floor(current) + '%';
            } else if (originalText.includes('/')) {
                counter.textContent = Math.floor(current) + '/7';
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    // Use Intersection Observer to trigger counters when visible
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    if (!counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        animateCounter(counter);
                    }
                });
            }
        });
    }, { threshold: 0.3 });
    
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        counterObserver.observe(heroSection);
    }

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

// Make showAlert globally available
window.showAlert = function(message, type) {
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