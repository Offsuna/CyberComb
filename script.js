/* =====================================================
   CyberComb — Scripts
   Language toggle, theme toggle, navbar, counters
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== LANGUAGE TOGGLE ====================
    let currentLang = 'ca';
    const langToggle = document.getElementById('langToggle');
    const langLabel = document.getElementById('langLabel');
    const langLabelAlt = document.getElementById('langLabelAlt');

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'ca' ? 'es' : 'ca';
        document.documentElement.lang = currentLang;

        langLabel.textContent = currentLang.toUpperCase();
        langLabelAlt.textContent = currentLang === 'ca' ? 'ES' : 'CA';

        document.querySelectorAll('[data-ca]').forEach(el => {
            const text = el.getAttribute(`data-${currentLang}`);
            if (text) {
                if (el.children.length === 0) {
                    el.textContent = text;
                } else {
                    const textNode = Array.from(el.childNodes).find(n => n.nodeType === 3);
                    if (textNode) {
                        textNode.textContent = text;
                    } else {
                        el.textContent = text;
                    }
                }
            }
        });
    });

    // ==================== THEME TOGGLE ====================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    let isDark = true;

    if (localStorage.getItem('cybercomb-theme') === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.textContent = '🌙';
        isDark = false;
    }

    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        document.body.classList.toggle('light-mode');
        themeIcon.textContent = isDark ? '🌞' : '🌙';
        localStorage.setItem('cybercomb-theme', isDark ? 'dark' : 'light');
    });

    // ==================== NAVBAR SCROLL ====================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==================== HAMBURGER MENU ====================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 64;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ==================== ANIMATED COUNTERS ====================
    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const isFloat = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;

            if (isFloat) {
                el.textContent = prefix + current.toFixed(1) + suffix;
            } else {
                el.textContent = prefix + Math.floor(current).toLocaleString('es-ES') + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isFloat) {
                    el.textContent = prefix + target.toFixed(1) + suffix;
                } else {
                    el.textContent = prefix + target.toLocaleString('es-ES') + suffix;
                }
            }
        }

        requestAnimationFrame(update);
    }

    let countersAnimated = false;
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                document.querySelectorAll('.stat-number[data-count]').forEach(el => {
                    animateCounter(el);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.getElementById('stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // ==================== SCROLL REVEAL ANIMATION ====================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .feature-card, .tech-card, .price-card, .contact-card, .service-step, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

});