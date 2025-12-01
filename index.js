// ===== AOS INITIALIZATION =====
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-in-out'
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// ===== DARK MODE TOGGLE =====
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon = darkModeToggle.querySelector('i');

// Check for saved theme or prefer-color-scheme
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-mode');
    darkModeIcon.classList.remove('fa-moon');
    darkModeIcon.classList.add('fa-sun');
}

darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
    } else {
        localStorage.setItem('theme', 'light');
        darkModeIcon.classList.remove('fa-sun');
        darkModeIcon.classList.add('fa-moon');
    }
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile navbar if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const navbarToggler = document.querySelector('.navbar-toggler');
                navbarToggler.click();
            }
        }
    });
});

// ===== SCROLL DOWN BUTTON =====
document.querySelector('.scroll-down').addEventListener('click', function() {
    const aboutSection = document.querySelector('#about');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = aboutSection.offsetTop - navbarHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
});

// ===== PORTFOLIO IMAGE LIGHTBOX =====
const lightbox = document.getElementById('imageLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeLightbox = document.querySelector('.close-lightbox');

document.querySelectorAll('.view-image').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const imageUrl = this.getAttribute('data-image');
        lightboxImage.src = imageUrl;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

closeLightbox.addEventListener('click', function() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
});

lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== VIDEO PLAYER =====
const video = document.getElementById('portfolioVideo');
const playButton = document.getElementById('playButton');
const videoContainer = document.querySelector('.video-container');

playButton.addEventListener('click', function() {
    if (video.paused) {
        video.play();
        videoContainer.classList.add('playing');
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        video.pause();
        videoContainer.classList.remove('playing');
        playButton.innerHTML = '<i class="fas fa-play"></i>';
    }
});

video.addEventListener('click', function() {
    if (video.paused) {
        video.play();
        videoContainer.classList.add('playing');
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        video.pause();
        videoContainer.classList.remove('playing');
        playButton.innerHTML = '<i class="fas fa-play"></i>';
    }
});

video.addEventListener('ended', function() {
    videoContainer.classList.remove('playing');
    playButton.innerHTML = '<i class="fas fa-play"></i>';
});

// ===== CONTACT FORM SUBMISSION =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        service: document.getElementById('service').value,
        project: document.getElementById('project').value
    };
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.service || !formData.project) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.querySelector('.btn-text').innerHTML;
    submitBtn.querySelector('.btn-text').innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending...';
    submitBtn.disabled = true;
    
    // In a real application, you would send this data to a server
    // For now, we'll simulate a successful submission
    setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
        submitBtn.querySelector('.btn-text').innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// ===== LOADER FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.querySelector('.loader');
    
    // Function to hide loader
    function hideLoader() {
        if (loader) {
            // Add hidden class to trigger fade out
            loader.classList.add('hidden');
            
            // Remove loader from DOM after animation completes
            setTimeout(() => {
                if (loader && loader.parentNode) {
                    loader.remove();
                }
            }, 800); // Match this with CSS transition duration
        }
    }
    
    // Method 1: Hide loader when page is fully loaded
    window.addEventListener('load', hideLoader);
    
    // Method 2: Fallback - hide loader after 3 seconds max (if page takes too long)
    setTimeout(hideLoader, 3000);
    
    // Method 3: If all critical elements are loaded, hide loader sooner
    const criticalElementsLoaded = () => {
        const heroSection = document.querySelector('.hero-section');
        const navbar = document.querySelector('.navbar');
        
        if (heroSection && navbar) {
            // Check if hero background image is loaded
            const heroBg = getComputedStyle(heroSection).backgroundImage;
            const img = new Image();
            img.src = heroBg.replace(/url\(["']?(.*?)["']?\)/i, '$1');
            
            img.onload = hideLoader;
            img.onerror = hideLoader; // Fallback if image fails
        }
    };
    
    // Check for critical elements after a short delay
    setTimeout(criticalElementsLoaded, 1000);
    
    // Also hide loader if user starts interacting
    document.addEventListener('click', function earlyHideLoader() {
        hideLoader();
        document.removeEventListener('click', earlyHideLoader);
    });
    
    // Optional: Add keyboard interaction to skip loader
    document.addEventListener('keydown', function earlyHideLoaderKey(e) {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            hideLoader();
            document.removeEventListener('keydown', earlyHideLoaderKey);
        }
    });
});

// ===== PARTICLE BACKGROUND FOR HERO =====
// Create particle container
const particleContainer = document.getElementById('particle-container');
if (particleContainer) {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 1-3px
        const size = Math.random() * 2 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation
        const duration = 20 + Math.random() * 20;
        const delay = Math.random() * 5;
        
        particle.style.animation = `float ${duration}s linear ${delay}s infinite`;
        
        particleContainer.appendChild(particle);
    }
}

// Add particle animation to CSS if not already there
if (!document.querySelector('#particle-styles')) {
    const style = document.createElement('style');
    style.id = 'particle-styles';
    style.textContent = `
        .particle {
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
        }
        
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(20px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== FORM INPUT ANIMATIONS =====
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// ===== FOOTER YEAR UPDATE =====
const currentYear = new Date().getFullYear();
const copyrightElement = document.querySelector('.copyright');
if (copyrightElement) {
    copyrightElement.textContent = copyrightElement.textContent.replace('2023', currentYear);
}

// ===== NEWSLETTER SUBSCRIPTION =====
document.querySelector('.footer-newsletter .btn').addEventListener('click', function() {
    const emailInput = this.previousElementSibling;
    const email = emailInput.value;
    
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Simulate subscription
    const originalText = this.textContent;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    this.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for subscribing to our newsletter!');
        emailInput.value = '';
        this.textContent = originalText;
        this.disabled = false;
    }, 1500);
});

// ===== STICKY NAVBAR ON MOBILE =====
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (window.innerWidth <= 991) {
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// ===== LAZY LOADING FOR IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== BACK TO TOP BUTTON =====
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
backToTopButton.className = 'back-to-top';
backToTopButton.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTopButton);

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

// Add styles for back to top button
const backToTopStyles = document.createElement('style');
backToTopStyles.textContent = `
    .back-to-top {
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        z-index: 999;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    .back-to-top.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .back-to-top:hover {
        background: var(--secondary-color);
        transform: translateY(-3px);
    }
    
    .dark-mode .back-to-top {
        background: var(--accent-color);
    }
    
    .dark-mode .back-to-top:hover {
        background: #4cc9f0;
    }
`;
document.head.appendChild(backToTopStyles);