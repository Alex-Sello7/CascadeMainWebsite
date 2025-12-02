$(document).ready(function () {
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
  $('a.nav-link, .btn-primary, .btn-outline, .cta-btn').on('click', function (event) {
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

  // Enhanced service selection functionality with smooth scroll
  $('.pricing-card .btn-primary').on('click', function (e) {
      e.preventDefault();

      // Get the service name from the pricing card
      const serviceName = $(this).closest('.pricing-card').find('h4').text().trim();

      // Set the service value in the contact form
      $('#service').val(serviceName);

      // Smooth scroll to the contact section
      $('html, body').animate({
          scrollTop: $('#contact').offset().top - 70
      }, 800, 'swing', function() {
          // After scrolling is complete, focus on the service field
          $('#service').addClass('highlight-field');
          setTimeout(function () {
              $('#service').removeClass('highlight-field');
          }, 2000);
      });
  });

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

  // FORM SUBMISSION HANDLING - UPDATED FOR NEW BACKEND
  $('#contactForm').on('submit', function (e) {
      e.preventDefault();
      console.log('Form submitted');

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

      // Email validation
      const email = $('#email').val().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
          $('#email').addClass('is-invalid');
          showErrorAlert("Please enter a valid email address.");
          return;
      }

      if (!isValid) {
          showErrorAlert("Please fill in all required fields.");
          return;
      }

      const formData = {
          name: $('#name').val().trim(),
          email: email,
          service: $('#service').val().trim(),
          project: $('#project').val().trim()
      };

      console.log('Form data prepared:', formData);

      const submitBtn = document.getElementById('submitBtn');
      const btnText = submitBtn.querySelector('.btn-text');
      btnText.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending...';
      submitBtn.disabled = true;

      // Use your Render backend URL - make sure this is correct
      const backendUrl = 'https://cascade-backend-4v17.onrender.com/submit';
      console.log('Sending to backend:', backendUrl);
      
      $.ajax({
          type: "POST",
          url: backendUrl,
          data: JSON.stringify(formData),
          contentType: "application/json",
          dataType: "json", // Expect JSON response from new backend
          timeout: 15000, // 15 second timeout
          success: function (response) {
              console.log('Backend response:', response);
              
              if (response.success === true || response.message === "success") {
                  btnText.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                  submitBtn.classList.add('btn-success');
                  
                  // Show success message
                  $('#contactForm').prepend(
                      '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
                      '<strong>Success!</strong> Your message has been sent. We\'ll get back to you within 48 hours.' +
                      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                      '</div>'
                  );
                  
                  // Reset form
                  $('#contactForm')[0].reset();
                  
                  // Scroll to show the success message
                  $('html, body').animate({
                      scrollTop: $('#contact').offset().top - 100
                  }, 500);
              } else {
                  const errorMsg = response.error || "Unknown error occurred";
                  showErrorAlert("Error: " + errorMsg);
              }

              // Reset button after 3 seconds
              setTimeout(function () {
                  btnText.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Submit';
                  submitBtn.disabled = false;
                  submitBtn.classList.remove('btn-success');
              }, 3000);
          },
          error: function (xhr, status, error) {
              console.error('AJAX Error:', {
                  status: status,
                  error: error,
                  xhrStatus: xhr.status,
                  xhrStatusText: xhr.statusText,
                  responseText: xhr.responseText
              });
              
              let errorMessage = "Error submitting form. Please try again or contact us directly.";
              
              if (status === "timeout") {
                  errorMessage = "Request timed out. Please check your connection and try again.";
              } else if (xhr.status === 0) {
                  errorMessage = "Cannot connect to server. Please check your internet connection.";
              } else if (xhr.status === 404) {
                  errorMessage = "Backend service not found. The server URL might be incorrect.";
              } else if (xhr.status === 500) {
                  // Try to parse the server error message
                  try {
                      const serverError = JSON.parse(xhr.responseText);
                      errorMessage = serverError.error || "Server error. Please try again later.";
                  } catch (e) {
                      errorMessage = "Server error. Please try again later.";
                  }
              } else if (xhr.status === 400) {
                  try {
                      const serverError = JSON.parse(xhr.responseText);
                      errorMessage = serverError.error || "Please check your form data.";
                  } catch (e) {
                      errorMessage = "Invalid form data. Please check all fields.";
                  }
              } else if (xhr.status === 403) {
                  errorMessage = "Access denied. Please contact support.";
              }
              
              showErrorAlert(errorMessage);
              
              // Reset button immediately
              btnText.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Submit';
              submitBtn.disabled = false;
          },
          complete: function() {
              console.log('AJAX request completed');
          }
      });
  });

  function showErrorAlert(message) {
      // Remove any existing alerts
      $('.alert').remove();
      
      $('#contactForm').prepend(
          '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
          '<strong>Error!</strong> ' + message +
          '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
          '</div>'
      );
      
      // Scroll to show the error
      $('html, body').animate({
          scrollTop: $('#contact').offset().top - 100
      }, 500);
  }

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

  // Test backend connection on page load
  function testBackendConnection() {
      console.log('Testing backend connection...');
      $.ajax({
          url: 'https://cascade-backend-4v17.onrender.com/',
          type: 'GET',
          timeout: 5000,
          success: function(response) {
              console.log('Backend is reachable:', response);
          },
          error: function(xhr, status, error) {
              console.warn('Backend connection test failed:', status, error);
              console.log('Form submissions may not work until backend is running.');
          }
      });
  }

  // Test connection after a short delay
  setTimeout(testBackendConnection, 2000);
});

// Add this outside the jQuery ready function for better compatibility
(function() {
    // Feature detection
    if (!window.jQuery) {
        console.error("jQuery failed to load!");
        // Fallback: show a message to users
        setTimeout(function() {
            const loader = document.querySelector('.loader');
            if (loader) {
                loader.innerHTML = '<div style="text-align: center; padding: 50px; color: white;"><h3>Website Loading Issue</h3><p>Please refresh the page or check your internet connection.</p><button onclick="window.location.reload()">Refresh Page</button></div>';
            }
        }, 5000);
    }
    
    // Check for console to prevent errors in older IE
    if (!window.console) {
        window.console = {
            log: function() {},
            error: function() {},
            warn: function() {},
            info: function() {}
        };
    }
})();