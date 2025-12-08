$(document).ready(function () {
  // ===== SOCIAL MEDIA BROWSER DETECTION & VIEWPORT FIX =====
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

  // ===== LOADER FUNCTIONALITY =====
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
  $(window).on('load', hideLoader);
  
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
  $(document).on('click', function earlyHideLoader() {
      hideLoader();
      $(document).off('click', earlyHideLoader);
  });
  
  // Optional: Add keyboard interaction to skip loader
  $(document).on('keydown', function earlyHideLoaderKey(e) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          hideLoader();
          $(document).off('keydown', earlyHideLoaderKey);
      }
  });

  // ===== BACK TO TOP FUNCTIONALITY =====
  const backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  backToTopBtn.setAttribute('title', 'Back to top');
  document.body.appendChild(backToTopBtn);

  // Show/hide back to top button based on scroll position
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

  // Cross-browser video play functionality
  $('#playButton').on('click', function() {
      const video = $('.video-container video')[0];
      const videoContainer = $('.video-container');
      
      // Check if video can play
      if (video && video.play) {
          var playPromise = video.play();
          
          // Handle promise for browsers that return a promise
          if (playPromise !== undefined) {
              playPromise.then(function() {
                  videoContainer.addClass('playing');
              }).catch(function(error) {
                  console.log("Video play failed:", error);
                  // Fallback for browsers that block autoplay
                  videoContainer.removeClass('playing');
              });
          } else {
              videoContainer.addClass('playing');
          }
      }
  });

  // When video ends, show play button again
  $('.video-container video').on('ended', function() {
      $('.video-container').removeClass('playing');
  });

  // Portfolio image lightbox functionality
  $('.view-image').on('click', function(e) {
      e.preventDefault();
      const imageUrl = $(this).data('image');
      const portfolioCard = $(this).closest('.portfolio-card');
      const caption = portfolioCard.find('h4').text();
      
      $('#lightboxImage').attr('src', imageUrl);
      $('.lightbox-caption').text(caption);
      $('#imageLightbox').addClass('active').attr('aria-hidden', 'false');
      
      // Close mobile navbar if open
      if ($('.navbar-collapse').hasClass('show')) {
          $('.navbar-toggler').click();
      }
  });

  // Close lightbox when clicking the close button
  $('.close-lightbox').on('click', function() {
      $('#imageLightbox').removeClass('active').attr('aria-hidden', 'true');
  });

  // Close lightbox when clicking outside the image
  $('#imageLightbox').on('click', function(e) {
      if (e.target === this) {
          $(this).removeClass('active').attr('aria-hidden', 'true');
      }
  });

  // Close lightbox with Escape key
  $(document).on('keyup', function(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
          if ($('#imageLightbox').hasClass('active')) {
              $('#imageLightbox').removeClass('active').attr('aria-hidden', 'true');
          }
      }
  });
  
  // Initialize AOS animation with fallback
  if (typeof AOS !== 'undefined') {
      AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: true,
          disable: function() {
              return $(window).width() < 768;
          }
      });
  }

  // Navbar scroll effect with fallback
  function updateNavbar() {
      const scroll = $(window).scrollTop();
      
      if (scroll > 50) {
          $('.navbar').addClass('navbar-scrolled');
          
          // Add subtle background blur for modern browsers
          if (CSS.supports('backdrop-filter', 'blur(12px)') || 
              CSS.supports('-webkit-backdrop-filter', 'blur(12px)')) {
              $('.navbar').css({
                  'backdrop-filter': 'blur(12px)',
                  '-webkit-backdrop-filter': 'blur(12px)'
              });
          }
      } else {
          $('.navbar').removeClass('navbar-scrolled');
          
          // Reduce blur when at top
          if (CSS.supports('backdrop-filter', 'blur(10px)') || 
              CSS.supports('-webkit-backdrop-filter', 'blur(10px)')) {
              $('.navbar').css({
                  'backdrop-filter': 'blur(10px)',
                  '-webkit-backdrop-filter': 'blur(10px)'
              });
          }
      }
  }

  // Throttle scroll events for performance
  let scrollTimeout;
  $(window).scroll(function () {
      if (scrollTimeout) {
          clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(updateNavbar, 10);
  });

  // Enhanced smooth scrolling for nav links
  $('a.nav-link, .btn-primary, .btn-outline, .cta-btn, .cta-secondary-btn').on('click', function (event) {
      if (this.hash !== '' && $(this).attr('data-bs-toggle') !== 'dropdown') {
          event.preventDefault();
          const hash = this.hash;
          
          // Close mobile navbar if open
          if ($('.navbar-collapse').hasClass('show')) {
              $('.navbar-toggler').click();
          }
          
          // Smooth scroll with fallback
          if ('scrollBehavior' in document.documentElement.style) {
              // Modern browsers
              $('html, body').animate({
                  scrollTop: $(hash).offset().top - 70
              }, 800, 'swing', function() {
                  // Add hash to URL when done scrolling
                  if (history.pushState) {
                      history.pushState(null, null, hash);
                  } else {
                      window.location.hash = hash;
                  }
              });
          } else {
              // Fallback for older browsers
              window.location.hash = hash;
          }
      }
  });

  // Close mobile menu when clicking on a link
  $('.navbar-nav a').on('click', function() {
      if ($('.navbar-collapse').hasClass('show')) {
          $('.navbar-toggler').click();
      }
  });

  // Close mobile menu when clicking outside
  $(document).on('click', function(event) {
      const isNavbarToggler = $(event.target).closest('.navbar-toggler').length;
      const isNavbarCollapse = $(event.target).closest('.navbar-collapse').length;
      
      if ($('.navbar-collapse').hasClass('show') && !isNavbarToggler && !isNavbarCollapse) {
          $('.navbar-toggler').click();
      }
  });

  // Add animation to navbar brand on hover
  $('.navbar-brand').hover(
      function() {
          $(this).css('transform', 'scale(1.05)');
      },
      function() {
          $(this).css('transform', 'scale(1)');
      }
  );

  // Create particles for hero background with performance optimization
  function createParticles() {
      const particleContainer = document.getElementById('particle-container');
      if (!particleContainer) return;
      
      // Reduce particle count on mobile for performance
      const particleCount = $(window).width() < 768 ? 20 : 50;

      for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.classList.add('particle');

          // Random position, size and animation duration
          const size = Math.random() * 20 + 5;
          const posX = Math.random() * 100;
          const posY = Math.random() * 100;
          const duration = Math.random() * 20 + 10;
          const delay = Math.random() * 5;

          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;
          particle.style.left = `${posX}%`;
          particle.style.top = `${posY}%`;
          particle.style.opacity = Math.random() * 0.5 + 0.1;
          particle.style.position = 'absolute';
          particle.style.borderRadius = '50%';
          particle.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.4))';
          particle.style.pointerEvents = 'none';
          particle.style.zIndex = '1';

          // Animation with vendor prefixes
          particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
          particle.style.WebkitAnimation = `float ${duration}s ease-in-out ${delay}s infinite`;

          // Add particle to container
          particleContainer.appendChild(particle);
      }
  }

  // Create animation for particles with vendor prefixes
  if (!document.querySelector('#particle-animation')) {
      const style = document.createElement('style');
      style.id = 'particle-animation';
      style.textContent = `
          @keyframes float {
              0% { transform: translateY(0) translateX(0) rotate(0deg); }
              25% { transform: translateY(-20px) translateX(10px) rotate(90deg); }
              50% { transform: translateY(-40px) translateX(-10px) rotate(180deg); }
              75% { transform: translateY(-20px) translateX(-20px) rotate(270deg); }
              100% { transform: translateY(0) translateX(0) rotate(360deg); }
          }
          @-webkit-keyframes float {
              0% { -webkit-transform: translateY(0) translateX(0) rotate(0deg); }
              25% { -webkit-transform: translateY(-20px) translateX(10px) rotate(90deg); }
              50% { -webkit-transform: translateY(-40px) translateX(-10px) rotate(180deg); }
              75% { -webkit-transform: translateY(-20px) translateX(-20px) rotate(270deg); }
              100% { -webkit-transform: translateY(0) translateX(0) rotate(360deg); }
          }
      `;
      document.head.appendChild(style);
  }

  // Initialize particles after a short delay
  setTimeout(createParticles, 500);

  // Dark Mode Toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
      const icon = darkModeToggle.querySelector('i');

      // Check localStorage for dark mode preference
      const isDarkMode = localStorage.getItem('darkMode') === 'true';

      // Apply dark mode based on localStorage
      if (isDarkMode) {
          document.body.classList.add('dark-mode');
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
      }

      // Toggle dark mode
      darkModeToggle.addEventListener('click', function () {
          document.body.classList.toggle('dark-mode');

          if (document.body.classList.contains('dark-mode')) {
              localStorage.setItem('darkMode', 'true');
              icon.classList.remove('fa-moon');
              icon.classList.add('fa-sun');
          } else {
              localStorage.setItem('darkMode', 'false');
              icon.classList.remove('fa-sun');
              icon.classList.add('fa-moon');
          }
      });
  }

  // Handle direct URL hash navigation
  if (window.location.hash) {
      const target = $(window.location.hash);
      if (target.length) {
          // Small delay to ensure DOM is fully loaded
          setTimeout(function() {
              $('html, body').animate({
                  scrollTop: target.offset().top - 70
              }, 800);
          }, 100);
      }
  }

  // ===== FORM SUBMISSION HANDLING =====
  $('#contactForm').on('submit', function (e) {
      e.preventDefault();

      // Basic form validation
      let isValid = true;
      $(this).find('[required]').each(function() {
          if (!$(this).val().trim()) {
              $(this).addClass('is-invalid');
              isValid = false;
          } else {
              $(this).removeClass('is-invalid');
          }
      });

      if (!isValid) {
          showErrorAlert("Please fill in all required fields.");
          return;
      }

      // Email validation
      const email = $('#email').val().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          $('#email').addClass('is-invalid');
          showErrorAlert("Please enter a valid email address.");
          return;
      }

      // Show loading state
      const submitBtn = $('#submitBtn');
      const originalText = submitBtn.find('.btn-text').html();
      submitBtn.find('.btn-text').html('<i class="fas fa-spinner fa-spin me-2"></i> Sending...');
      submitBtn.prop('disabled', true);

      // Get form data
      const formData = {
          name: $('#name').val().trim(),
          email: email,
          service: $('#service').val(),
          project: $('#project').val().trim()
      };

      
      
      const formspreeUrl = 'https://formspree.io/f/xjknerpq';
      
      // Method 2: Email client fallback
      const subject = `Cascade Creations Inquiry: ${formData.service}`;
      const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0AService: ${formData.service}%0D%0A%0D%0AProject Details:%0D%0A${formData.project}`;
      
      // Try Formspree first, fall back to email client
      $.ajax({
          url: formspreeUrl,
          method: 'POST',
          data: formData,
          dataType: 'json',
          success: function(response) {
              showSuccessAlert("Thank you! Your message has been sent successfully. We'll get back to you soon.");
              $('#contactForm')[0].reset();
          },
          error: function(xhr, status, error) {
              // Formspree failed, fall back to email client
              console.log('Formspree failed, falling back to email client');
              
              // Open email client with pre-filled data
              window.location.href = `mailto:atsello4@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
              
              showSuccessAlert("Email client opened. Please send the pre-filled email to contact us. We'll respond within 24 hours.");
              
              $('#contactForm')[0].reset();
          },
          complete: function() {
              // Reset button state
              submitBtn.find('.btn-text').html(originalText);
              submitBtn.prop('disabled', false);
          }
      });
  });

  // ===== ALERT FUNCTIONS =====
  function showSuccessAlert(message) {
      // Remove any existing alerts
      $('.alert').remove();
      
      // Add success alert
      $('#contactForm').prepend(
          '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
          '<strong>Success!</strong> ' + message +
          '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
          '</div>'
      );
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
          $('.alert').alert('close');
      }, 5000);
      
      // Scroll to alert
      $('html, body').animate({
          scrollTop: $('#contact').offset().top - 100
      }, 500);
  }

  function showErrorAlert(message) {
      // Remove any existing alerts
      $('.alert').remove();
      
      $('#contactForm').prepend(
          '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
          '<strong>Error!</strong> ' + message +
          '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
          '</div>'
      );
      
      // Scroll to alert
      $('html, body').animate({
          scrollTop: $('#contact').offset().top - 100
      }, 500);
  }

  // ===== WORK IN PROGRESS POPUP FUNCTIONALITY =====
  function showWorkInProgressPopup() {
      const popup = document.getElementById('workInProgressPopup');
      if (popup) {
          popup.classList.add('active');
          popup.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden'; // Prevent scrolling
      }
  }

  function hideWorkInProgressPopup() {
      const popup = document.getElementById('workInProgressPopup');
      if (popup) {
          popup.classList.remove('active');
          popup.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = ''; // Re-enable scrolling
      }
  }

  // Close popup when clicking the close button
  document.querySelector('.popup-close-btn')?.addEventListener('click', hideWorkInProgressPopup);

  // Close popup when clicking outside the content
  document.getElementById('workInProgressPopup')?.addEventListener('click', function(e) {
      if (e.target === this) {
          hideWorkInProgressPopup();
      }
  });

  // Close popup with Escape key
  $(document).on('keyup', function(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
          if ($('#workInProgressPopup').hasClass('active')) {
              hideWorkInProgressPopup();
          }
      }
  });

  // Set current year in footer
  $('#current-year').text(new Date().getFullYear());

  // Add CSS class for highlighting fields
  if (!$('#highlight-field-style').length) {
      $('head').append('<style id="highlight-field-style">.highlight-field { animation: highlight-pulse 2s; } @keyframes highlight-pulse { 0%, 100% { box-shadow: 0 0 5px rgba(66, 153, 225, 0); } 50% { box-shadow: 0 0 10px rgba(66, 153, 225, 0.8); } }</style>');
  }

  // Handle window resize
  let resizeTimer;
  $(window).resize(function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
          // Reinitialize AOS on resize
          if (typeof AOS !== 'undefined') {
              AOS.refresh();
          }
      }, 250);
  });

  // Prevent right-click on images in portfolio
  $('.portfolio-image img').on('contextmenu', function(e) {
      e.preventDefault();
      return false;
  });

  // Lazy load images for better performance
  if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
              if (entry.isIntersecting) {
                  const img = entry.target;
                  if (img.dataset.src) {
                      img.src = img.dataset.src;
                  }
                  imageObserver.unobserve(img);
              }
          });
      });

      $('img[data-src]').each(function() {
          imageObserver.observe(this);
      });
  }

  // ===== BUBBLE TRAILS CURSOR EFFECT =====
  function createBubbleTrails() {
      const bubbleContainer = document.createElement('div');
      bubbleContainer.id = 'bubble-container';
      document.body.appendChild(bubbleContainer);

      let mouseX = 0;
      let mouseY = 0;
      let bubbles = [];
      let bubbleCount = 15; // Number of bubbles in trail
      
      // Track mouse position
      document.addEventListener('mousemove', (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
      });
      
      // Create bubbles
      function createBubble(x, y) {
          const bubble = document.createElement('div');
          bubble.className = 'bubble';
          
          // Random size between 4px and 10px
          const size = Math.random() * 6 + 4;
          
          // Random movement direction
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 30 + 20;
          const moveX = Math.cos(angle) * distance;
          const moveY = Math.sin(angle) * distance;
          
          // Set initial position and size
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          bubble.style.left = `${x - size/2}px`;
          bubble.style.top = `${y - size/2}px`;
          
          // Set animation properties
          bubble.style.setProperty('--move-x', `${moveX}px`);
          bubble.style.setProperty('--move-y', `${moveY}px`);
          
          // Random color variation
          const hue = 210 + Math.random() * 30; // Blue hue range
          const opacity = Math.random() * 0.4 + 0.3;
          bubble.style.background = `radial-gradient(circle at 30% 30%, hsla(${hue}, 80%, 70%, ${opacity}), hsla(${hue}, 80%, 50%, ${opacity * 0.7}))`;
          
          bubbleContainer.appendChild(bubble);
          bubbles.push(bubble);
          
          // Remove bubble after animation completes
          setTimeout(() => {
              if (bubble.parentNode) {
                  bubble.remove();
                  bubbles = bubbles.filter(b => b !== bubble);
              }
          }, 800); // Match CSS animation duration
      }
      
      // Animation loop
      let animationId;
      let lastTime = 0;
      const interval = 50; // Create bubble every 50ms
      
      function animate(currentTime) {
          if (!lastTime) lastTime = currentTime;
          
          if (currentTime - lastTime >= interval) {
              createBubble(mouseX, mouseY);
              lastTime = currentTime;
          }
          
          // Limit total number of bubbles
          if (bubbles.length > bubbleCount) {
              const bubbleToRemove = bubbles.shift();
              if (bubbleToRemove && bubbleToRemove.parentNode) {
                  bubbleToRemove.remove();
              }
          }
          
          animationId = requestAnimationFrame(animate);
      }
      
      // Start animation
      animationId = requestAnimationFrame(animate);
      
      // Cleanup on page unload
      $(window).on('unload', function() {
          if (animationId) {
              cancelAnimationFrame(animationId);
          }
      });
  }

  // Initialize bubble trails after page loads
  $(window).on('load', function() {
      // Delay slightly to ensure page is loaded
      setTimeout(createBubbleTrails, 500);
  });

  // ===== ADDITIONAL FORM ENHANCEMENTS =====
  
  // Real-time form validation
  $('#name, #email, #service, #project').on('input', function() {
      if ($(this).val().trim()) {
          $(this).removeClass('is-invalid');
      }
  });

  // Validate email on blur
  $('#email').on('blur', function() {
      const email = $(this).val().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (email && !emailRegex.test(email)) {
          $(this).addClass('is-invalid');
      }
  });

  // Auto-expand textarea as user types
  $('#project').on('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
  });

  // Form field focus effects
  $('.form-control').on('focus', function() {
      $(this).closest('.mb-3').addClass('focused');
  }).on('blur', function() {
      $(this).closest('.mb-3').removeClass('focused');
  });

  // Add CSS for focused state
  if (!$('#form-styles').length) {
      $('head').append(`
          <style id="form-styles">
              .mb-3.focused .form-label {
                  color: var(--primary-color);
                  font-weight: 600;
              }
              .mb-3.focused .form-control {
                  border-color: var(--primary-color);
              }
          </style>
      `);
  }

  // ===== ANIMATED COUNTERS FOR STATS SECTION =====
  function animateCounters() {
      const counters = document.querySelectorAll('.stat-number');
      
      counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-count'));
          const duration = 2000; // 2 seconds
          const increment = target / (duration / 16); // 60fps
          
          let current = 0;
          const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                  current = target;
                  clearInterval(timer);
              }
              counter.textContent = Math.floor(current);
          }, 16);
      });
  }

  // Trigger counters when they come into view
  const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              animateCounters();
              statsObserver.unobserve(entry.target);
          }
      });
  }, { threshold: 0.5 });

  // Observe stats section
  const statsSection = document.getElementById('stats');
  if (statsSection) {
      statsObserver.observe(statsSection);
  }

  // ===== SKILL BAR ANIMATIONS =====
  function animateSkillBars() {
      const skillBars = document.querySelectorAll('.skill-level');
      
      skillBars.forEach(bar => {
          const width = bar.style.width;
          bar.style.width = '0';
          
          setTimeout(() => {
              bar.style.transition = 'width 1.5s ease-in-out';
              bar.style.width = width;
          }, 300);
      });
  }

  // Trigger skill bar animations when team section comes into view
  const teamObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              animateSkillBars();
              teamObserver.unobserve(entry.target);
          }
      });
  }, { threshold: 0.3 });

  // Observe team section
  const teamSection = document.getElementById('team');
  if (teamSection) {
      teamObserver.observe(teamSection);
  }

  // ===== TESTIMONIAL AUTO-SLIDER =====
  function initTestimonialSlider() {
      const testimonials = $('.testimonial-card');
      let currentIndex = 0;
      
      if (testimonials.length > 1) {
          // Auto-rotate testimonials every 5 seconds
          setInterval(() => {
              testimonials.removeClass('active');
              currentIndex = (currentIndex + 1) % testimonials.length;
              $(testimonials[currentIndex]).addClass('active');
          }, 5000);
      }
  }

  // Initialize testimonial slider after page loads
  $(window).on('load', function() {
      setTimeout(initTestimonialSlider, 1000);
  });

  // ===== TECHNOLOGY STACK HOVER EFFECTS =====
  function initTechStackEffects() {
      const techItems = $('.tech-item');
      
      techItems.each(function(index) {
          $(this).css('transition-delay', `${index * 0.1}s`);
      });
      
      // Add ripple effect on click
      techItems.on('click', function() {
          const $this = $(this);
          $this.addClass('ripple');
          setTimeout(() => {
              $this.removeClass('ripple');
          }, 600);
      });
  }

  // Initialize tech stack effects
  initTechStackEffects();

  // Add CSS for ripple effect
  if (!$('#ripple-effect').length) {
      $('head').append(`
          <style id="ripple-effect">
              .tech-item.ripple {
                  position: relative;
                  overflow: hidden;
              }
              .tech-item.ripple::after {
                  content: '';
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  width: 5px;
                  height: 5px;
                  background: rgba(66, 153, 225, 0.3);
                  border-radius: 50%;
                  transform: translate(-50%, -50%) scale(1);
                  animation: ripple 0.6s ease-out;
              }
              @keyframes ripple {
                  to {
                      transform: translate(-50%, -50%) scale(40);
                      opacity: 0;
                  }
              }
          </style>
      `);
  }

  // ===== TIMELINE ANIMATIONS =====
  function initTimelineAnimations() {
      const timelineItems = $('.timeline-item');
      
      // Add staggered animation delay
      timelineItems.each(function(index) {
          $(this).css('animation-delay', `${index * 0.2}s`);
      });
      
      // Animate timeline line
      const timelineLine = $('.timeline::before');
      if (timelineLine.length) {
          $(window).on('scroll', function() {
              const scrollPos = $(window).scrollTop();
              const timelineTop = $('#process-timeline').offset().top;
              const timelineHeight = $('#process-timeline').height();
              
              if (scrollPos > timelineTop - 300 && scrollPos < timelineTop + timelineHeight - 300) {
                  const progress = (scrollPos - timelineTop + 300) / timelineHeight;
                  timelineLine.css('height', `${progress * 100}%`);
              }
          });
      }
  }

  // Initialize timeline animations
  initTimelineAnimations();

  // ===== PARALLAX EFFECT FOR SECTIONS =====
  function initParallaxEffects() {
      const parallaxSections = $('.hero-section, .cta-section, .stats-section, .secondary-cta-section');
      
      $(window).on('scroll', function() {
          const scrollPos = $(window).scrollTop();
          
          parallaxSections.each(function() {
              const $section = $(this);
              const speed = $section.data('parallax-speed') || 0.5;
              const yPos = -(scrollPos * speed);
              
              if ($section.hasClass('hero-section') || $section.hasClass('cta-section') || $section.hasClass('secondary-cta-section')) {
                  $section.css('background-position', `center ${yPos}px`);
              }
          });
      });
  }

  // Initialize parallax effects
  initParallaxEffects();

  // ===== HOVER EFFECT FOR TEAM IMAGE =====
  function initTeamImageEffect() {
      const teamImage = $('.team-img');
      const teamShape = $('.team-shape');
      
      if (teamImage.length && teamShape.length) {
          teamImage.hover(
              function() {
                  teamShape.css({
                      'transform': 'rotate(-8deg) translate(25px, 25px)',
                      'transition': 'transform 0.4s ease'
                  });
              },
              function() {
                  teamShape.css({
                      'transform': 'rotate(-5deg) translate(20px, 20px)',
                      'transition': 'transform 0.4s ease'
                  });
              }
          );
      }
  }

  // Initialize team image effect
  initTeamImageEffect();

  // ===== SCROLL PROGRESS INDICATOR =====
  function initScrollProgress() {
      const progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress';
      progressBar.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
          z-index: 1001;
          transition: width 0.2s ease;
      `;
      document.body.appendChild(progressBar);
      
      $(window).on('scroll', function() {
          const windowHeight = $(document).height() - $(window).height();
          const scrollPosition = $(window).scrollTop();
          const progress = (scrollPosition / windowHeight) * 100;
          progressBar.style.width = `${progress}%`;
      });
  }

  // Initialize scroll progress
  initScrollProgress();

  // ===== LAZY LOAD FOR ALL IMAGES =====
  function lazyLoadAllImages() {
      const images = document.querySelectorAll('img:not([data-src])');
      
      images.forEach(img => {
          if (!img.hasAttribute('data-src')) {
              img.setAttribute('data-src', img.src);
              img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';
          }
      });
      
      // Use existing IntersectionObserver or create new one
      if ('IntersectionObserver' in window) {
          const lazyImageObserver = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      const img = entry.target;
                      if (img.dataset.src) {
                          img.src = img.dataset.src;
                          img.removeAttribute('data-src');
                      }
                      lazyImageObserver.unobserve(img);
                  }
              });
          });
          
          $('img[data-src]').each(function() {
              lazyImageObserver.observe(this);
          });
      }
  }

  // Initialize lazy loading
  lazyLoadAllImages();

  // ===== SMOOTH SCROLL FOR SCROLL-DOWN BUTTON =====
  $('.scroll-down').on('click', function() {
      $('html, body').animate({
          scrollTop: $('#about').offset().top - 70
      }, 800);
  });

  // ===== ADD VISUAL FEEDBACK FOR INTERACTIVE ELEMENTS =====
  function addVisualFeedback() {
      // Add hover effect to all interactive cards
      $('.process-card, .portfolio-card, .service-package-card, .testimonial-card, .tech-stack-card').each(function() {
          $(this).on('mouseenter', function() {
              $(this).css('transform', 'translateY(-10px)');
          }).on('mouseleave', function() {
              $(this).css('transform', 'translateY(0)');
          });
      });
      
      // Add pulse animation to CTA buttons
      setInterval(() => {
          $('.cta-btn, .cta-secondary-btn').addClass('pulse');
          setTimeout(() => {
              $('.cta-btn, .cta-secondary-btn').removeClass('pulse');
          }, 1000);
      }, 5000);
  }

  // Initialize visual feedback
  addVisualFeedback();

  // Add CSS for pulse animation
  if (!$('#pulse-animation').length) {
      $('head').append(`
          <style id="pulse-animation">
              @keyframes pulse {
                  0% { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); }
                  50% { box-shadow: 0 5px 25px rgba(230, 126, 34, 0.6); }
                  100% { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); }
              }
              .cta-btn.pulse, .cta-secondary-btn.pulse {
                  animation: pulse 1s ease-in-out;
              }
          </style>
      `);
  }

  // ===== PAGE LOAD COMPLETE ANIMATIONS =====
  function pageLoadAnimations() {
      
      // Animate tech icons
      $('.tech-icon').each(function(index) {
          $(this).css({
              'transform': 'scale(0) rotate(0deg)',
              'transition': `transform 0.6s ease ${index * 0.1 + 1}s`
          });
          
          setTimeout(() => {
              $(this).css('transform', 'scale(1) rotate(360deg)');
          }, 100 + (index * 100));
      });
  }

  // Run page load animations after loader is hidden
  setTimeout(pageLoadAnimations, 800);
});

// Add this outside the jQuery ready function for better compatibility
(function() {
    // Feature detection
    if (!window.jQuery) {
        console.error("jQuery failed to load!");
        // You could load a fallback here if needed
    }
    
    // Check for console to prevent errors in older IE
    if (!window.console) {
        window.console = {
            log: function() {},
            error: function() {},
            warn: function() {}
        };
    }

    // Fix for mobile viewport issues - Enhanced version
    function setViewport() {
        var viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                // For mobile devices, use a more restrictive viewport
                viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, shrink-to-fit=no";
            }
        }
    }
    
    // Run on page load and resize
    window.addEventListener('load', setViewport);
    window.addEventListener('resize', setViewport);
    setViewport(); // Initial call
    
    // Prevent zooming on input focus in iOS
    document.addEventListener('DOMContentLoaded', function() {
        var viewport = document.querySelector('meta[name="viewport"]');
        var inputs = document.querySelectorAll('input, select, textarea');
        
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

// Additional utility functions
function formatPhoneNumber(phoneNumber) {
    // Format phone number for display
    if (!phoneNumber) return '';
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
}

function debounce(func, wait, immediate) {
    // Debounce function for performance
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

// ===== PERFORMANCE OPTIMIZATIONS =====
(function() {
    // Request Animation Frame polyfill with performance optimization
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || 
                                   window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
})();

// ===== BROWSER COMPATIBILITY CHECKS =====
(function() {
    // Check for modern browser features
    const features = {
        'IntersectionObserver': 'IntersectionObserver' in window,
        'CSSVariables': 'CSS' in window && 'supports' in CSS && CSS.supports('--test', '0'),
        'Flexbox': 'flex' in document.documentElement.style,
        'Grid': 'grid' in document.documentElement.style
    };
    
    // Add class to body based on feature support
    Object.keys(features).forEach(feature => {
        if (features[feature]) {
            document.body.classList.add(`has-${feature.toLowerCase()}`);
        } else {
            document.body.classList.add(`no-${feature.toLowerCase()}`);
        }
    });
})();