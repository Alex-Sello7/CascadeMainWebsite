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

    // ===== FULL-PAGE SUNRISE LOADING SCREEN =====
    const loadingScreen = document.getElementById('loadingScreen');
    const canvas = document.getElementById('sunriseCanvas');
    const ctx = canvas.getContext('2d');

    let animFrameId;
    let startTime = null;
    const TOTAL_DURATION = 3000; // ms total before fade

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Brand colours — logo is cyan→navy, rays/glow match
    const C = {
        primaryDark:  [11,  42,  66],   // #0b2a42
        primary:      [30,  60,  92],   // #1e3c5c
        primaryLight: [46,  90, 130],   // #2e5a82
        secondary:    [212, 90,  74],   // #d45a4a (sky warmth at horizon)
        secondaryLt:  [225,123, 107],
        cyan:         [0,  195, 255],   // logo bright cyan top
        cyanMid:      [0,  160, 220],   // logo mid cyan
        cyanDeep:     [15,  85, 140],   // logo deep navy-blue
        skyHigh:      [14,  55,  90],
        skyMid:       [25,  80, 120],
    };

    // Preload the logo image
    const logoImg = new Image();
    logoImg.src = 'imgs/cclogo.png';

    // Stars (visible at start, fade as sun rises)
    const NUM_STARS = 180;
    const stars = Array.from({ length: NUM_STARS }, () => ({
        x: Math.random(),
        y: Math.random() * 0.65,
        r: Math.random() * 1.4 + 0.3,
        opacity: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
    }));

    // Horizon clouds / streaks (light rays)
    const NUM_RAYS = 14;
    const rays = Array.from({ length: NUM_RAYS }, (_, i) => ({
        angle: -Math.PI / 2 + (i - NUM_RAYS / 2) * (Math.PI / NUM_RAYS) * 1.6,
        width: 0.015 + Math.random() * 0.025,
        length: 0.55 + Math.random() * 0.35,
        opacity: 0.06 + Math.random() * 0.12,
    }));

    // Horizon mountain silhouette points (normalized 0-1)
    const horizonPoints = (() => {
        const pts = [];
        const steps = 120;
        for (let i = 0; i <= steps; i++) {
            const x = i / steps;
            // Two mountain ridges layered
            const m1 = 0.08 * Math.sin(x * Math.PI * 3.2 + 0.5)
                      + 0.05 * Math.sin(x * Math.PI * 7   + 1.2)
                      + 0.03 * Math.sin(x * Math.PI * 14  + 0.8);
            pts.push({ x, y: m1 });
        }
        return pts;
    })();

    const horizonPoints2 = (() => {
        const pts = [];
        const steps = 120;
        for (let i = 0; i <= steps; i++) {
            const x = i / steps;
            const m2 = 0.055 * Math.sin(x * Math.PI * 4.5 + 2.1)
                     + 0.03  * Math.sin(x * Math.PI * 9   + 0.3)
                     + 0.02  * Math.sin(x * Math.PI * 18  + 1.5);
            pts.push({ x, y: m2 });
        }
        return pts;
    })();

    // Gentle floating particles (dust/pollen in the air)
    const NUM_MOTES = 60;
    const motes = Array.from({ length: NUM_MOTES }, () => ({
        x: Math.random(),
        y: 0.45 + Math.random() * 0.5,
        r: Math.random() * 1.8 + 0.5,
        vx: (Math.random() - 0.5) * 0.00008,
        vy: -Math.random() * 0.00012 - 0.00003,
        opacity: Math.random() * 0.35 + 0.1,
    }));

    function lerp(a, b, t) { return a + (t - a) * t; }
    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
    function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; } // easeInOut

    function rgbLerp(c1, c2, t) {
        return [
            Math.round(c1[0] + (c2[0] - c1[0]) * t),
            Math.round(c1[1] + (c2[1] - c1[1]) * t),
            Math.round(c1[2] + (c2[2] - c1[2]) * t),
        ];
    }
    function rgb(c, a) {
        return a !== undefined
            ? `rgba(${c[0]},${c[1]},${c[2]},${a})`
            : `rgb(${c[0]},${c[1]},${c[2]})`;
    }

    function draw(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const t = clamp(elapsed / TOTAL_DURATION, 0, 1); // 0 → 1
        const et = ease(t);

        const W = canvas.width;
        const H = canvas.height;

        // Sun position: rises from below horizon to about 30% up the screen
        const horizonY = H * 0.62;
        const sunR = Math.min(W, H) * 0.09;
        const sunCX = W * 0.5;
        const sunStartY = horizonY + sunR * 1.5;
        const sunEndY   = horizonY - H * 0.28;
        const sunCY = sunStartY + (sunEndY - sunStartY) * et;

        // ── Sky gradient ─────────────────────────────────────────────────
        // At t=0: deep navy night. At t=1: rich dawn blue-to-coral.
        const skyTopNight  = C.primaryDark;
        const skyTopDay    = C.skyHigh;
        const skyMidNight  = C.primary;
        const skyMidDay    = C.primaryLight;
        const skyLowNight  = C.primaryDark;
        const skyLowDay    = [30, 100, 150]; // cyan-lit horizon

        const skyTop  = rgbLerp(skyTopNight,  skyTopDay,  et);
        const skyMid  = rgbLerp(skyMidNight,  skyMidDay,  et);
        const skyLow  = rgbLerp(skyLowNight,  skyLowDay,  et);

        const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
        skyGrad.addColorStop(0,    rgb(skyTop));
        skyGrad.addColorStop(0.45, rgb(skyMid));
        skyGrad.addColorStop(0.85, rgb(skyLow));
        skyGrad.addColorStop(1,    rgb(rgbLerp(skyLow, C.cyanDeep, et * 0.6)));

        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, H);

        // ── Ground / water below horizon ─────────────────────────────────
        const groundGrad = ctx.createLinearGradient(0, horizonY, 0, H);
        const groundTop = rgbLerp(C.primaryDark, [20, 50, 75], et);
        const groundBot = rgbLerp([5, 15, 30],   [8, 28, 50], et);
        groundGrad.addColorStop(0, rgb(groundTop));
        groundGrad.addColorStop(1, rgb(groundBot));
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, horizonY, W, H - horizonY);

        // ── Stars (fade out as sun rises) ────────────────────────────────
        const starFade = clamp(1 - et * 2.5, 0, 1);
        if (starFade > 0) {
            stars.forEach(s => {
                s.twinkle += s.twinkleSpeed;
                const tw = 0.5 + 0.5 * Math.sin(s.twinkle);
                ctx.beginPath();
                ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${s.opacity * tw * starFade})`;
                ctx.fill();
            });
        }

        // ── Logo glow / corona (wide halo, cyan-blue to match logo) ─────
        const glowRadius = sunR * (5 + et * 8);
        const sunGlow = ctx.createRadialGradient(sunCX, sunCY, sunR * 0.5, sunCX, sunCY, glowRadius);
        sunGlow.addColorStop(0,   rgb(C.cyan,        0.40 * et));
        sunGlow.addColorStop(0.2, rgb(C.cyanMid,     0.25 * et));
        sunGlow.addColorStop(0.5, rgb(C.cyanDeep,    0.12 * et));
        sunGlow.addColorStop(1,   rgb(C.primaryDark, 0));
        ctx.fillStyle = sunGlow;
        ctx.fillRect(0, 0, W, H);

        // ── Light rays from logo (cyan-blue to match logo gradient) ────────
        if (et > 0.1) {
            const rayOpacity = clamp((et - 0.1) / 0.5, 0, 1);
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            rays.forEach(ray => {
                const rx1 = sunCX;
                const ry1 = sunCY;
                const rx2 = sunCX + Math.cos(ray.angle) * W * ray.length;
                const ry2 = sunCY + Math.sin(ray.angle) * H * ray.length;
                const rayGrad = ctx.createLinearGradient(rx1, ry1, rx2, ry2);
                rayGrad.addColorStop(0,   `rgba(0,210,255,${ray.opacity * rayOpacity * 0.95})`);
                rayGrad.addColorStop(0.3, `rgba(0,160,220,${ray.opacity * rayOpacity * 0.5})`);
                rayGrad.addColorStop(0.7, `rgba(15,85,140,${ray.opacity * rayOpacity * 0.2})`);
                rayGrad.addColorStop(1,   `rgba(11,42,66,0)`);
                ctx.strokeStyle = rayGrad;
                ctx.lineWidth = W * ray.width;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(rx1, ry1);
                ctx.lineTo(rx2, ry2);
                ctx.stroke();
            });
            ctx.globalCompositeOperation = 'source-over';
            ctx.restore();
        }

        // ── Horizon cyan glow band ────────────────────────────────────────
        const horizGlow = ctx.createRadialGradient(sunCX, horizonY, 0, sunCX, horizonY, W * 0.65);
        horizGlow.addColorStop(0,   rgb(C.cyan,        0.45 * et));
        horizGlow.addColorStop(0.25,rgb(C.cyanMid,     0.28 * et));
        horizGlow.addColorStop(0.6, rgb(C.primaryLight, 0.1 * et));
        horizGlow.addColorStop(1,   rgb(C.primaryDark, 0));
        ctx.fillStyle = horizGlow;
        ctx.fillRect(0, 0, W, H);

        // ── Logo rising (replacing sun disc) ─────────────────────────────
        const logoOpacity = Math.min(1, et * 2.5);
        const logoSize = sunR * 2.2; // diameter
        if (logoImg.complete && logoImg.naturalWidth > 0) {
            ctx.save();
            ctx.globalAlpha = logoOpacity;
            // Soft circular clip so logo blends into glow like a rising sun
            ctx.beginPath();
            ctx.arc(sunCX, sunCY, sunR * 1.05, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(logoImg,
                sunCX - logoSize / 2,
                sunCY - logoSize / 2,
                logoSize,
                logoSize
            );
            ctx.restore();
        } else {
            // Fallback: cyan disc if image not loaded yet
            const fallback = ctx.createRadialGradient(sunCX, sunCY, 0, sunCX, sunCY, sunR);
            fallback.addColorStop(0,   rgb(C.cyan,     logoOpacity));
            fallback.addColorStop(0.6, rgb(C.cyanMid,  logoOpacity));
            fallback.addColorStop(1,   rgb(C.cyanDeep, logoOpacity));
            ctx.fillStyle = fallback;
            ctx.beginPath();
            ctx.arc(sunCX, sunCY, sunR, 0, Math.PI * 2);
            ctx.fill();
        }

        // ── Water reflections (cyan logo shimmer) ─────────────────────────
        if (et > 0.15) {
            const reflOpacity = clamp((et - 0.15) / 0.4, 0, 0.45);
            for (let col = -3; col <= 3; col++) {
                const rx = sunCX + col * (W * 0.04);
                const rw = W * 0.018 * (1 - Math.abs(col) * 0.25);
                const reflGrad = ctx.createLinearGradient(0, horizonY, 0, H * 0.85);
                reflGrad.addColorStop(0,   rgb(C.cyan,        reflOpacity * 0.9));
                reflGrad.addColorStop(0.3, rgb(C.cyanDeep,    reflOpacity * 0.5));
                reflGrad.addColorStop(1,   rgb(C.primaryDark, 0));
                ctx.fillStyle = reflGrad;
                ctx.beginPath();
                ctx.ellipse(rx, horizonY + (H - horizonY) * 0.3, rw, (H - horizonY) * 0.55, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // ── Mountain silhouette back layer ───────────────────────────────
        const mtn2Color = rgbLerp(C.primaryDark, [15, 45, 68], et);
        ctx.beginPath();
        ctx.moveTo(0, H);
        horizonPoints2.forEach(p => {
            ctx.lineTo(p.x * W, horizonY - p.y * H * 1.1);
        });
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = rgb(mtn2Color);
        ctx.fill();

        // ── Mountain silhouette front layer ──────────────────────────────
        const mtn1Color = rgbLerp(C.primaryDark, [10, 32, 52], et * 0.8);
        ctx.beginPath();
        ctx.moveTo(0, H);
        horizonPoints.forEach(p => {
            ctx.lineTo(p.x * W, horizonY - p.y * H * 1.35);
        });
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = rgb(mtn1Color);
        ctx.fill();

        // ── Floating dust motes (lit by cyan logo light) ──────────────────
        if (et > 0.3) {
            const moteOpacity = clamp((et - 0.3) / 0.4, 0, 1);
            motes.forEach(m => {
                m.x += m.vx;
                m.y += m.vy;
                if (m.y < 0.3) { m.y = 0.65 + Math.random() * 0.3; m.x = Math.random(); }
                ctx.beginPath();
                ctx.arc(m.x * W, m.y * H, m.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,195,255,${m.opacity * moteOpacity * 0.6})`;
                ctx.fill();
            });
        }

        // ── Vignette ─────────────────────────────────────────────────────
        const vign = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.85);
        vign.addColorStop(0, 'rgba(0,0,0,0)');
        vign.addColorStop(1, `rgba(5,15,28,${0.5 + et * 0.15})`);
        ctx.fillStyle = vign;
        ctx.fillRect(0, 0, W, H);

        if (t < 1) {
            animFrameId = requestAnimationFrame(draw);
        } else {
            // Hold for a moment then fade out
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    cancelAnimationFrame(animFrameId);
                }, 1000);
            }, 300);
        }
    }

    window.addEventListener('load', function () {
        animFrameId = requestAnimationFrame(draw);
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