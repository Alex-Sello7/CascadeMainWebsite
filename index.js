// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100,
        disable: function() {
            return window.innerWidth < 768;
        }
    });

    // ===== NEW LOADING SCREEN WITH STATUS BAR =====
    const loadingScreen = document.getElementById('loadingScreen');
    const statusBar = document.createElement('div');
    const statusFill = document.createElement('div');
    const statusPercentage = document.createElement('div');
    const statusMessage = document.createElement('div');
    
    // Create status bar elements
    statusBar.className = 'status-bar';
    statusFill.className = 'status-fill';
    statusPercentage.className = 'status-percentage';
    statusMessage.className = 'status-message';
    
    statusBar.appendChild(statusFill);
    statusBar.appendChild(statusPercentage);
    statusBar.appendChild(statusMessage);
    
    // Add status bar to loading screen
    const loadingContent = loadingScreen.querySelector('.loading-content');
    loadingContent.appendChild(statusBar);
    
    // Variables for loading animation
    let progress = 0;
    let loadingInterval;
    let isTakingLong = false;
    const maxProgress = 100;
    const incrementSpeed = 1; // Percentage per interval
    const intervalTime = 30; // ms per increment
    const longLoadThreshold = 8000; // 8 seconds in ms
    let loadingStartTime;
    
    // Start loading animation
    function startLoadingAnimation() {
        loadingStartTime = Date.now();
        progress = 0;
        isTakingLong = false;
        statusPercentage.textContent = '0%';
        statusMessage.textContent = 'Loading...';
        
        loadingInterval = setInterval(() => {
            // Simulate progress
            progress += incrementSpeed;
            
            // Check if it's taking too long
            const elapsedTime = Date.now() - loadingStartTime;
            if (!isTakingLong && elapsedTime > longLoadThreshold) {
                isTakingLong = true;
                statusMessage.textContent = 'Taking longer than usual...';
                statusMessage.classList.add('warning');
            }
            
            // Update progress bar
            if (progress <= maxProgress) {
                statusFill.style.width = progress + '%';
                statusPercentage.textContent = progress + '%';
            }
            
            // Stop at 95% for suspense
            if (progress >= 95) {
                clearInterval(loadingInterval);
            }
        }, intervalTime);
    }
    
    // Complete loading animation
    function completeLoadingAnimation() {
        clearInterval(loadingInterval);
        
        // Animate to 100%
        const completeAnimation = setInterval(() => {
            if (progress < 100) {
                progress += 2;
                statusFill.style.width = progress + '%';
                statusPercentage.textContent = progress + '%';
            } else {
                clearInterval(completeAnimation);
                
                // Hide loading screen
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 300);
            }
        }, 10);
    }
    
    // Start loading animation immediately
    startLoadingAnimation();
    
    // Hide loading screen after page load
    function hideLoadingScreen() {
        // Wait for both page load and minimum 1.5s loading time
        const minLoadTime = 1500;
        const elapsedTime = Date.now() - loadingStartTime;
        
        if (elapsedTime < minLoadTime) {
            setTimeout(completeLoadingAnimation, minLoadTime - elapsedTime);
        } else {
            completeLoadingAnimation();
        }
    }
    
    window.addEventListener('load', hideLoadingScreen);
    
    // Fallback: complete loading after 15 seconds max
    setTimeout(() => {
        if (loadingScreen.style.display !== 'none') {
            completeLoadingAnimation();
            console.log('Loading timeout - forced completion');
        }
    }, 15000);

    // ===== DARK MODE =====
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or respect OS preference
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Save preference
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        
        // Dispatch custom event for other components
        document.dispatchEvent(new Event('darkModeChange'));
    });

    // ===== SOCIAL MEDIA BROWSER DETECTION =====
    function isSocialMediaBrowser() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Check for social media apps
        const isFacebook = /FBAN|FBAV/i.test(userAgent);
        const isTwitter = /Twitter/i.test(userAgent);
        const isInstagram = /Instagram/i.test(userAgent);
        const isLinkedIn = /LinkedIn/i.test(userAgent);
        
        return isFacebook || isTwitter || isInstagram || isLinkedIn;
    }

    // Apply fixes for social media browsers
    if (isSocialMediaBrowser()) {
        // Force viewport recalculation
        document.addEventListener('DOMContentLoaded', function() {
            const viewport = document.querySelector("meta[name=viewport]");
            if (viewport) {
                viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
            }
            
            // Prevent resize on focus
            document.addEventListener('focusin', function(e) {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                    setTimeout(function() {
                        window.scrollTo(0, 0);
                    }, 100);
                }
            });
        });
    }

    // ===== NAVIGATION =====
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu - updated for right side animation
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
        
        // Animate toggle lines
        const lines = this.querySelectorAll('.toggle-line');
        lines.forEach((line, index) => {
            if (this.classList.contains('active')) {
                if (index === 0) line.style.transform = 'rotate(45deg) translate(8px, 8px)';
                if (index === 1) line.style.opacity = '0';
                if (index === 2) line.style.transform = 'rotate(-45deg) translate(8px, -8px)';
            } else {
                line.style.transform = '';
                line.style.opacity = '';
                if (index === 1) line.style.transform = 'translateY(-50%)';
            }
        });
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle internal links
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                
                // Reset toggle lines
                const lines = navToggle.querySelectorAll('.toggle-line');
                lines.forEach((line, index) => {
                    line.style.transform = '';
                    line.style.opacity = '';
                    if (index === 1) line.style.transform = 'translateY(-50%)';
                });
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Smooth scroll to target
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !navToggle.contains(event.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            const lines = navToggle.querySelectorAll('.toggle-line');
            lines.forEach((line, index) => {
                line.style.transform = '';
                line.style.opacity = '';
                if (index === 1) line.style.transform = 'translateY(-50%)';
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
    
    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveNavLink, 50);
    });

    // ===== HERO TYPING ANIMATION =====
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const sentences = [
            'Web Applications',
            'Digital Experiences',
            'Mobile Solutions',
            'E-commerce Platforms',
            'Brand Identity'
        ];
        
        let sentenceIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;
        
        function typeText() {
            if (isPaused) return;
            
            const currentSentence = sentences[sentenceIndex];
            
            if (!isDeleting) {
                // Typing forward
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
                // Deleting
                typingText.textContent = currentSentence.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    sentenceIndex = (sentenceIndex + 1) % sentences.length;
                }
            }
            
            // Typing speed
            const typingSpeed = isDeleting ? 50 : 100;
            setTimeout(typeText, typingSpeed);
        }
        
        // Start typing animation after a delay
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
            
            // Format the counter value
            let displayValue = Math.floor(current);
            const originalText = counter.textContent;
            
            if (originalText.includes('+')) {
                counter.textContent = displayValue + '+';
            } else if (originalText.includes('%')) {
                counter.textContent = displayValue + '%';
            } else if (originalText.includes('/')) {
                counter.textContent = displayValue + '/7';
            } else {
                counter.textContent = displayValue;
            }
        }, 16);
    }
    
    // Animate counters when they come into view
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
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
    }, observerOptions);
    
    // Observe hero section for counters
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        observer.observe(heroSection);
    }

    // ===== BACK TO TOP BUTTON =====
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.setAttribute('title', 'Back to top');
    document.body.appendChild(backToTopBtn);
    
    // Show/hide back to top button
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initial check
    toggleBackToTop();
    
    // Update on scroll
    window.addEventListener('scroll', toggleBackToTop);

    // ===== FORM SUBMISSION =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Real-time form validation
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                validateField(this);
            });
            
            input.addEventListener('blur', function() {
                validateField(this, true);
            });
        });
        
        // Form submission handler
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            formInputs.forEach(input => {
                if (!validateField(input, true)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                showAlert('Please fill in all required fields correctly.', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(this);
                
                // Prepare the data for Formspree
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone') || 'Not provided',
                    service: formData.get('service'),
                    message: formData.get('message'),
                    _subject: 'New Cascade Creations Inquiry',
                    _replyto: formData.get('email'),
                    _format: 'plain'
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
                    
                    // Scroll to top of form
                    contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // Fallback: Open email client
                    const subject = encodeURIComponent(`Cascade Creations Inquiry: ${data.service || 'General Inquiry'}`);
                    const body = encodeURIComponent(`Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Service: ${data.service}

Message:
${data.message}`.trim());
                    
                    window.location.href = `mailto:atsello4@gmail.com?subject=${subject}&body=${body}`;
                    
                    showAlert('Email client opened. Please send the pre-filled email to contact us.', 'success');
                    this.reset();
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showAlert('Oops! Something went wrong. Please try again or contact us directly.', 'error');
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
        
        // Field validation function
        function validateField(field, showError = false) {
            const value = field.value.trim();
            const isRequired = field.hasAttribute('required');
            const parent = field.parentElement;
            
            // Remove previous error
            const existingError = parent.querySelector('.input-error');
            if (existingError) {
                existingError.remove();
            }
            field.classList.remove('error');
            
            // Skip validation for empty non-required fields
            if (!isRequired && !value) {
                return true;
            }
            
            // Check required fields
            if (isRequired && !value) {
                if (showError) {
                    field.classList.add('error');
                    const error = document.createElement('div');
                    error.className = 'input-error';
                    error.textContent = 'This field is required';
                    parent.appendChild(error);
                }
                return false;
            }
            
            // Email validation
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    if (showError) {
                        field.classList.add('error');
                        const error = document.createElement('div');
                        error.className = 'input-error';
                        error.textContent = 'Please enter a valid email address';
                        parent.appendChild(error);
                    }
                    return false;
                }
            }
            
            // Phone validation (optional)
            if (field.type === 'tel' && value) {
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
                if (!phoneRegex.test(value)) {
                    if (showError) {
                        field.classList.add('error');
                        const error = document.createElement('div');
                        error.className = 'input-error';
                        error.textContent = 'Please enter a valid phone number';
                        parent.appendChild(error);
                    }
                    return false;
                }
            }
            
            return true;
        }
    }
    
    // Alert system
    function showAlert(message, type) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) existingAlert.remove();
        
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="alert-close" aria-label="Close alert">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to page
        document.body.appendChild(alert);
        
        // Show alert
        setTimeout(() => {
            alert.classList.add('show');
        }, 10);
        
        // Close button functionality
        const closeBtn = alert.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => {
            alert.classList.remove('show');
            setTimeout(() => {
                if (alert.parentNode) alert.remove();
            }, 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.classList.remove('show');
                setTimeout(() => {
                    if (alert.parentNode) alert.remove();
                }, 300);
            }
        }, 5000);
    }

  
    // ===== FLOATING CARDS ANIMATION =====
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card) => {
        // Add parallax effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const rotateY = (mouseX - cardCenterX) / 20;
            const rotateX = (cardCenterY - mouseY) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.05)`;
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // ===== SET CURRENT YEAR =====
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }

    // ===== SCROLL EFFECTS =====
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class based on scroll position
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scroll down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scroll up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // ===== PARALLAX EFFECT =====
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        // Apply parallax to hero shapes
        const heroShapes = document.querySelectorAll('.hero-shapes .shape');
        heroShapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrolled * speed;
            shape.style.transform = `translateY(${yPos}px)`;
        });
        
        // Apply parallax to floating cards
        floatingCards.forEach((card, index) => {
            const cardSpeed = 0.05 + (index * 0.02);
            const cardYPos = scrolled * cardSpeed;
            if (!card.classList.contains('hovered')) {
                card.style.transform = `translateY(${cardYPos - 20}px)`;
            }
        });
    });

    // ===== LAZY LOAD IMAGES =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                    
                    // Add fade-in effect
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 10);
                }
            });
        }, {
            rootMargin: '0px 0px 100px 0px'
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            if (!targetElement) return;
            
            e.preventDefault();
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                
                const lines = navToggle.querySelectorAll('.toggle-line');
                lines.forEach((line, index) => {
                    line.style.transform = '';
                    line.style.opacity = '';
                    if (index === 1) line.style.transform = 'translateY(-50%)';
                });
            }
            
            // Update active nav link
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            
            // Scroll to target
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                showAlert('Please enter your email address.', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate subscription
            showAlert('Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
        });
    }

    // ===== PARALLAX CTA SECTION =====
    function initParallaxCTA() {
        const parallaxSection = document.querySelector('.parallax-section');
        if (!parallaxSection) return;
        
        const parallaxLayers = parallaxSection.querySelectorAll('.parallax-bg');
        if (parallaxLayers.length === 0) return;
        
        // Only run on desktop and if reduced motion is not preferred
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion || window.innerWidth < 768) {
            // Disable parallax for mobile and reduced motion
            parallaxLayers.forEach(layer => {
                layer.style.backgroundAttachment = 'scroll';
            });
            return;
        }
        
        function updateParallax() {
            const scrollPosition = window.pageYOffset;
            const sectionTop = parallaxSection.offsetTop;
            const sectionHeight = parallaxSection.offsetHeight;
            
            // Check if section is in viewport
            const sectionStart = sectionTop - window.innerHeight;
            const sectionEnd = sectionTop + sectionHeight;
            
            if (scrollPosition >= sectionStart && scrollPosition <= sectionEnd) {
                const relativeScroll = scrollPosition - sectionStart;
                const progress = relativeScroll / (window.innerHeight + sectionHeight);
                
                parallaxLayers.forEach(layer => {
                    const depth = parseFloat(layer.getAttribute('data-depth'));
                    const yOffset = -(relativeScroll * depth);
                    layer.style.transform = `translateY(${yOffset}px) scale(${1 + depth})`;
                });
            }
        }
        
        // Use throttled scroll event for performance
        const throttledUpdate = throttle(updateParallax, 16);
        window.addEventListener('scroll', throttledUpdate);
        window.addEventListener('resize', debounce(updateParallax, 250));
        
        // Initial call
        updateParallax();
    }

    // Initialize parallax CTA
    initParallaxCTA();

    // ===== PERFORMANCE OPTIMIZATIONS =====
    // Debounce function for scroll events
    function debounce(func, wait) {
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
    
    // Throttle function for resize events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Handle window resize
    const handleResize = debounce(function() {
        // Reinitialize AOS on resize
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        // Close mobile menu on large screens
        if (window.innerWidth > 991 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            const lines = navToggle.querySelectorAll('.toggle-line');
            lines.forEach((line, index) => {
                line.style.transform = '';
                line.style.opacity = '';
                if (index === 1) line.style.transform = 'translateY(-50%)';
            });
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);

    // ===== ADD VISUAL EFFECTS =====
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(rippleStyle);

    // ===== WORK IN PROGRESS POPUP =====
    function showWorkInProgressPopup() {
        const popup = document.createElement('div');
        popup.className = 'work-in-progress-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-icon">
                    <i class="fas fa-code"></i>
                </div>
                <h3 class="popup-title">Direct Contact</h3>
                <p class="popup-message">
                    You can contact us directly via:<br><br>
                    <strong>Email:</strong> <a href="mailto:atsello4@gmail.com">atsello4@gmail.com</a><br>
                    <strong>Phone:</strong> <a href="tel:0720786569">072 078 6569</a><br><br>
                    We typically respond within 24 hours!
                </p>
                <button class="popup-close-btn">
                    Got it!
                </button>
            </div>
        `;
        
        document.body.appendChild(popup);
        document.body.style.overflow = 'hidden';
        
        // Show popup
        setTimeout(() => {
            popup.classList.add('active');
        }, 100);
        
        // Close popup
        const closeBtn = popup.querySelector('.popup-close-btn');
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('active');
            setTimeout(() => {
                popup.remove();
                document.body.style.overflow = '';
            }, 300);
        });
        
        // Close when clicking outside
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('active');
                setTimeout(() => {
                    popup.remove();
                    document.body.style.overflow = '';
                }, 300);
            }
        });
        
        // Close with ESC key
        const closeWithEsc = (e) => {
            if (e.key === 'Escape' && popup.parentNode) {
                popup.classList.remove('active');
                setTimeout(() => {
                    popup.remove();
                    document.body.style.overflow = '';
                }, 300);
                document.removeEventListener('keydown', closeWithEsc);
            }
        };
        document.addEventListener('keydown', closeWithEsc);
    }
    
    // Show popup when Studio link is clicked (if coming soon page)
    const studioLink = document.querySelector('a[href*="CascadeComingSoon"]');
    if (studioLink) {
        studioLink.addEventListener('click', function(e) {
            e.preventDefault();
            showWorkInProgressPopup();
        });
    }

    // ===== BROWSER COMPATIBILITY =====
    // Feature detection and polyfills
    (function() {
        // Check for console to prevent errors in older IE
        if (!window.console) {
            window.console = {
                log: function() {},
                error: function() {},
                warn: function() {},
                info: function() {}
            };
        }
        
        // Check for modern browser features
        const features = {
            IntersectionObserver: 'IntersectionObserver' in window,
            CSSVariables: window.CSS && CSS.supports && CSS.supports('--test', '0'),
            Flexbox: 'flex' in document.documentElement.style,
            Grid: 'grid' in document.documentElement.style
        };
        
        // Add classes to body based on feature support
        Object.keys(features).forEach(feature => {
            if (features[feature]) {
                document.body.classList.add(`has-${feature.toLowerCase()}`);
            } else {
                document.body.classList.add(`no-${feature.toLowerCase()}`);
            }
        });
        
        // Fix for mobile viewport issues
        function setViewport() {
            let viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                
                if (isMobile) {
                    // For mobile devices, use a more restrictive viewport
                    viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, shrink-to-fit=no";
                }
            }
        }
        
        // Run on page load and resize
        window.addEventListener('load', setViewport);
        window.addEventListener('resize', debounce(setViewport, 250));
        setViewport(); // Initial call
        
        // Prevent zooming on input focus in iOS
        document.addEventListener('DOMContentLoaded', function() {
            const viewport = document.querySelector('meta[name="viewport"]');
            const inputs = document.querySelectorAll('input, select, textarea');
            
            inputs.forEach(function(input) {
                input.addEventListener('focus', function() {
                    if (viewport) {
                        viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
                    }
                });
                
                input.addEventListener('blur', function() {
                    setTimeout(function() {
                        if (viewport) {
                            viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover";
                        }
                    }, 500);
                });
            });
        });
    })();

    // ===== INITIALIZE COMPONENTS =====
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[title]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.title;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            this.tooltipElement = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                this.tooltipElement.remove();
                this.tooltipElement = null;
            }
        });
    });
    
    // Add CSS for tooltips
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .tooltip {
            position: fixed;
            background: var(--dark);
            color: var(--white);
            padding: 0.5rem 1rem;
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
            z-index: 9999;
            pointer-events: none;
            white-space: nowrap;
            transform: translateY(-10px);
            opacity: 0;
            animation: tooltipFadeIn 0.2s ease forwards;
        }
        
        @keyframes tooltipFadeIn {
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        body.dark-mode .tooltip {
            background: var(--white);
            color: var(--dark);
        }
    `;
    document.head.appendChild(tooltipStyle);

    // ===== PAGE LOAD COMPLETE =====
    // Dispatch custom event when page is fully loaded and initialized
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('pageReady'));
    }, 2000);
});

// ===== GLOBAL UTILITY FUNCTIONS =====
// Debounce function
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format phone number
function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return '';
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
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

// ===== PERFORMANCE POLYFILLS =====
// Request Animation Frame polyfill
(function() {
    let lastTime = 0;
    const vendors = ['ms', 'moz', 'webkit', 'o'];
    for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || 
                                   window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const id = window.setTimeout(function() { 
                callback(currTime + timeToCall); 
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
})();

// ClassList polyfill for IE9
if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
        get: function() {
            const self = this;
            function update(fn) {
                return function(value) {
                    const classes = self.className.split(/\s+/);
                    const index = classes.indexOf(value);
                    fn(classes, index, value);
                    self.className = classes.join(" ");
                };
            }
            return {
                add: update(function(classes, index, value) {
                    if (!~index) classes.push(value);
                }),
                remove: update(function(classes, index) {
                    if (~index) classes.splice(index, 1);
                }),
                toggle: update(function(classes, index, value) {
                    if (~index) classes.splice(index, 1);
                    else classes.push(value);
                }),
                contains: function(value) {
                    return !!~self.className.split(/\s+/).indexOf(value);
                }
            };
        }
    });
}

// ===== ERROR HANDLING =====
// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
    
    // Don't show error alerts for users, just log them
    if (window.console && console.error) {
        console.error('Error details:', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            error: e.error
        });
    }
    
    // Prevent default error handling for known non-critical errors
    if (e.message && e.message.includes('ResizeObserver')) {
        e.preventDefault();
    }
}, true);

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// ===== PAGE VISIBILITY =====
// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden
        console.log('Page hidden');
    } else {
        // Page is visible
        console.log('Page visible');
    }
});

// ===== BEFORE UNLOAD =====
// Clean up before page unload
window.addEventListener('beforeunload', function() {
    // Cancel any ongoing animations or requests
    if (window.cancelAnimationFrame) {
        // Cancel any requestAnimationFrame callbacks
    }
    
    // Remove event listeners to prevent memory leaks
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
        const clone = element.cloneNode(false);
        element.parentNode.replaceChild(clone, element);
    });
});

// ===== LOADING STATE MANAGEMENT =====
let isLoading = false;

function showLoading() {
    if (!isLoading) {
        isLoading = true;
        const loader = document.createElement('div');
        loader.className = 'global-loader';
        loader.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(loader);
        
        // Add CSS for global loader
        const loaderStyle = document.createElement('style');
        loaderStyle.textContent = `
            .global-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                backdrop-filter: blur(5px);
            }
            
            .loader-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid var(--white);
                border-top-color: var(--primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(loaderStyle);
    }
}

function hideLoading() {
    if (isLoading) {
        isLoading = false;
        const loader = document.querySelector('.global-loader');
        if (loader) {
            loader.remove();
        }
        const loaderStyle = document.querySelector('style');
        if (loaderStyle && loaderStyle.textContent.includes('global-loader')) {
            loaderStyle.remove();
        }
    }
}

// ===== NETWORK STATUS =====
// Check network status
function checkNetworkStatus() {
    if (!navigator.onLine) {
        showAlert('You are currently offline. Some features may not be available.', 'error');
    }
}

window.addEventListener('online', function() {
    showAlert('You are back online!', 'success');
});

window.addEventListener('offline', function() {
    showAlert('You are currently offline. Some features may not be available.', 'error');
});

// Initial network check
checkNetworkStatus();

// ===== GEOLOCATION (Optional) =====
// Only request if needed for specific features
function getGeolocation() {
    if (navigator.geolocation) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });
    }
    return Promise.reject(new Error('Geolocation not supported'));
}

// ===== SERVICE WORKER REGISTRATION (Optional) =====
// Uncomment to enable PWA features
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
*/

// ===== ANALYTICS (Optional) =====
// Simple page view tracking
function trackPageView() {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            'page_title': document.title,
            'page_location': window.location.href,
            'page_path': window.location.pathname
        });
    }
    
    // Custom analytics
    const analyticsData = {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: {
            width: window.screen.width,
            height: window.screen.height
        }
    };
    
    // Send to your analytics endpoint
    // fetch('/api/analytics', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(analyticsData)
    // });
}

// Track page view on load
window.addEventListener('load', trackPageView);

// ===== EXPORT UTILITIES =====
// Make utilities available globally if needed
if (typeof window !== 'undefined') {
    window.CascadeUtils = {
        debounce,
        throttle,
        formatPhoneNumber,
        copyToClipboard,
        showLoading,
        hideLoading,
        showAlert: function(message, type) {
            // This would need access to the showAlert function from the DOM scope
            console.log('Alert from utils:', message, type);
        }
    };
}