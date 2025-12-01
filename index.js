
    $(document).ready(function () {
      // Video play button functionality
      $('#playButton').on('click', function() {
        const video = $('.video-container video')[0];
        const videoContainer = $('.video-container');
        
        video.play();
        videoContainer.addClass('playing');
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
        $('#imageLightbox').addClass('active');
        
        // Close mobile navbar if open
        if ($('.navbar-collapse').hasClass('show')) {
          $('.navbar-toggler').click();
        }
      });

      // Close lightbox when clicking the close button
      $('.close-lightbox').on('click', function() {
        $('#imageLightbox').removeClass('active');
      });

      // Close lightbox when clicking outside the image
      $('#imageLightbox').on('click', function(e) {
        if (e.target === this) {
          $(this).removeClass('active');
        }
      });

      // Close lightbox with Escape key
      $(document).on('keyup', function(e) {
        if (e.key === 'Escape' && $('#imageLightbox').hasClass('active')) {
          $('#imageLightbox').removeClass('active');
        }
      });
      
      // Initialize AOS animation
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
      });

      // Navbar scroll effect
      $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
          $('.navbar').addClass('navbar-scrolled');
        } else {
          $('.navbar').removeClass('navbar-scrolled');
        }
      });

      // Enhanced smooth scrolling for nav links
      $('a.nav-link, .btn-primary, .btn-outline').on('click', function (event) {
        if (this.hash !== '' && $(this).attr('data-bs-toggle') !== 'dropdown') {
          event.preventDefault();
          const hash = this.hash;
          
          // Close mobile navbar if open
          if ($('.navbar-collapse').hasClass('show')) {
            $('.navbar-toggler').click();
          }
          
          $('html, body').animate({
            scrollTop: $(hash).offset().top - 70
          }, 800, 'swing', function() {
            // Add hash to URL when done scrolling (default click behavior)
            window.location.hash = hash;
          });
        }
      });
      
      // Enhanced navbar scroll effect
      $(window).scroll(function () {
        const scroll = $(this).scrollTop();
        
        if (scroll > 50) {
          $('.navbar').addClass('navbar-scrolled');
          
          // Add subtle background blur for modern browsers
          $('.navbar').css('backdrop-filter', 'blur(12px)');
          $('.navbar').css('-webkit-backdrop-filter', 'blur(12px)');
        } else {
          $('.navbar').removeClass('navbar-scrolled');
          
          // Reduce blur when at top
          $('.navbar').css('backdrop-filter', 'blur(10px)');
          $('.navbar').css('-webkit-backdrop-filter', 'blur(10px)');
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

      // Create particles for hero background
      function createParticles() {
        const particleContainer = document.getElementById('particle-container');
        const particleCount = 50;

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

          // Animation
          particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
          particle.style.animationName = 'float';

          // Add particle to container
          particleContainer.appendChild(particle);
        }
      }

      // Create animation for particles
      const style = document.createElement('style');
      style.textContent = `
            @keyframes float {
              0% {
                transform: translateY(0) translateX(0) rotate(0deg);
              }
              25% {
                transform: translateY(-20px) translateX(10px) rotate(90deg);
              }
              50% {
                transform: translateY(-40px) translateX(-10px) rotate(180deg);
              }
              75% {
                transform: translateY(-20px) translateX(-20px) rotate(270deg);
              }
              100% {
                transform: translateY(0) translateX(0) rotate(360deg);
              }
            }
          `;
      document.head.appendChild(style);

      createParticles();

      // Dark Mode Toggle
      const darkModeToggle = document.getElementById('darkModeToggle');
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

      // Form submission handling
      $('#contactForm').on('submit', function (e) {
        e.preventDefault();

        const formData = {
          name: $('#name').val(),
          email: $('#email').val(),
          service: $('#service').val(),
          project: $('#project').val()
        };

        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        btnText.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending...';
        submitBtn.disabled = true;

        $.ajax({
          type: "POST",
          url: "http://localhost:3000/submit",
          data: JSON.stringify(formData),
          contentType: "application/json",
          success: function (response) {
            if (response.trim() === "success") {
              btnText.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
              submitBtn.classList.add('btn-success');
              
              // Show success message
              $('#contactForm').prepend(
                '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
                '<strong>Success!</strong> Your message has been sent. We\'ll get back to you within 48 hours.' +
                '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
                '</div>'
              );
              
              // Reset form
              $('#contactForm')[0].reset();
            } else {
              showErrorAlert("Error: " + response);
            }

            setTimeout(function () {
              btnText.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Submit';
              submitBtn.disabled = false;
              submitBtn.classList.remove('btn-success');
            }, 3000);
          },
          error: function (err) {
            showErrorAlert("Error submitting form. Please try again or contact us directly.");
            console.error(err);
            
            btnText.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Submit';
            submitBtn.disabled = false;
          }
        });
      });

      function showErrorAlert(message) {
        $('#contactForm').prepend(
          '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
          '<strong>Error!</strong> ' + message +
          '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
          '</div>'
        );
      }
    });
  