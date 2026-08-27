/* ==========================================================================
   HimRishtey — Landing Page Interactions
   ========================================================================== */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initIcons();
        initHeaderScroll();
        initMobileDrawer();
        initSmoothAnchors();
        initRevealOnScroll();
        initStatCounters();
        initTestimonialCarousel();
        initFaqAccordion();
        initFooterAccordion();
        initHeroForm();
        initContactForm();
    }

    /* ---------------------------------------------------------------------
       Lucide icons
       --------------------------------------------------------------------- */
    function initIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    /* ---------------------------------------------------------------------
       Sticky header shadow on scroll
       --------------------------------------------------------------------- */
    function initHeaderScroll() {
        var header = document.getElementById('site-header');
        if (!header) return;

        var toggle = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };
        toggle();
        window.addEventListener('scroll', toggle, { passive: true });
    }

    /* ---------------------------------------------------------------------
       Mobile drawer (hamburger menu)
       --------------------------------------------------------------------- */
    function initMobileDrawer() {
        var hamburger = document.getElementById('hamburgerBtn');
        var drawer = document.getElementById('mobileDrawer');
        var closeBtn = document.getElementById('drawerClose');
        var overlay = document.getElementById('drawerOverlay');
        if (!hamburger || !drawer || !overlay) return;

        function openDrawer() {
            drawer.classList.add('is-open');
            overlay.classList.add('is-visible');
            drawer.setAttribute('aria-hidden', 'false');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeDrawer() {
            drawer.classList.remove('is-open');
            overlay.classList.remove('is-visible');
            drawer.setAttribute('aria-hidden', 'true');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', openDrawer);
        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
        overlay.addEventListener('click', closeDrawer);

        drawer.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeDrawer);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
        });
    }



    /* ---------------------------------------------------------------------
       Smooth-scroll for in-page anchor links (with sticky header offset)
       --------------------------------------------------------------------- */
    function initSmoothAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            var targetId = link.getAttribute('href');
            if (!targetId || targetId === '#' || targetId.length < 2) return;

            link.addEventListener('click', function (e) {
                var target = document.querySelector(targetId);
                if (!target) return;
                e.preventDefault();
                var header = document.getElementById('site-header');
                var offset = (header ? header.offsetHeight : 0) + 36;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            });
        });
    }

    /* ---------------------------------------------------------------------
       Reveal-on-scroll (.reveal elements fade/slide in)
       --------------------------------------------------------------------- */
    function initRevealOnScroll() {
        var items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        if (!('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('in-view'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        items.forEach(function (el) { observer.observe(el); });
    }

    /* ---------------------------------------------------------------------
       Animated stat counters in the trust strip
       --------------------------------------------------------------------- */
    function initStatCounters() {
        var counters = document.querySelectorAll('.stat-number');
        if (!counters.length) return;

        function animateCounter(el) {
            var target = parseInt(el.getAttribute('data-target'), 10) || 0;
            var duration = 1600;
            var startTime = null;

            function step(timestamp) {
                if (startTime === null) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
                var value = Math.floor(eased * target);
                el.textContent = value.toLocaleString('en-IN');
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    el.textContent = target.toLocaleString('en-IN');
                }
            }
            window.requestAnimationFrame(step);
        }

        if (!('IntersectionObserver' in window)) {
            counters.forEach(animateCounter);
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        counters.forEach(function (el) { observer.observe(el); });
    }

    /* ---------------------------------------------------------------------
       Success-stories carousel (arrows, dots, swipe, autoplay)
       --------------------------------------------------------------------- */
    function initTestimonialCarousel() {
        var track = document.getElementById('ssTrack');
        var prevBtn = document.getElementById('ssPrev');
        var nextBtn = document.getElementById('ssNext');
        var dotsWrap = document.getElementById('ssDots');
        if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

        var slides = Array.prototype.slice.call(track.children);
        var current = 0;
        var autoplayId = null;
        var AUTOPLAY_MS = 6000;

        slides.forEach(function (_, i) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', 'Go to story ' + (i + 1));
            dot.addEventListener('click', function () { goTo(i); restartAutoplay(); });
            dotsWrap.appendChild(dot);
        });
        var dots = Array.prototype.slice.call(dotsWrap.children);

        function render() {
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
            dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
            prevBtn.disabled = false;
            nextBtn.disabled = false;
        }

        function goTo(index) {
            current = (index + slides.length) % slides.length;
            render();
        }

        prevBtn.addEventListener('click', function () { goTo(current - 1); restartAutoplay(); });
        nextBtn.addEventListener('click', function () { goTo(current + 1); restartAutoplay(); });

        function startAutoplay() {
            if (slides.length < 2) return;
            autoplayId = window.setInterval(function () { goTo(current + 1); }, AUTOPLAY_MS);
        }
        function stopAutoplay() {
            if (autoplayId) { window.clearInterval(autoplayId); autoplayId = null; }
        }
        function restartAutoplay() { stopAutoplay(); startAutoplay(); }

        var carousel = document.getElementById('ssCarousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);
        }

        // touch swipe support
        var touchStartX = 0;
        var touchEndX = 0;
        track.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        track.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            var delta = touchEndX - touchStartX;
            if (Math.abs(delta) > 40) {
                goTo(delta < 0 ? current + 1 : current - 1);
                restartAutoplay();
            }
        }, { passive: true });

        render();
        startAutoplay();
    }

    /* ---------------------------------------------------------------------
       FAQ accordion
       --------------------------------------------------------------------- */
    function initFaqAccordion() {
        var items = document.querySelectorAll('.faq-item');
        if (!items.length) return;

        items.forEach(function (item) {
            var question = item.querySelector('.faq-question');
            var answer = item.querySelector('.faq-answer');
            if (!question || !answer) return;

            answer.style.maxHeight = '0px';

            question.addEventListener('click', function () {
                var isOpen = question.getAttribute('aria-expanded') === 'true';

                // close all others (single-open accordion)
                items.forEach(function (other) {
                    if (other === item) return;
                    var oq = other.querySelector('.faq-question');
                    var oa = other.querySelector('.faq-answer');
                    if (oq && oa) {
                        oq.setAttribute('aria-expanded', 'false');
                        oa.style.maxHeight = '0px';
                    }
                });

                question.setAttribute('aria-expanded', String(!isOpen));
                answer.style.maxHeight = isOpen ? '0px' : answer.scrollHeight + 'px';
            });
        });
    }

    /* ---------------------------------------------------------------------
       Footer link-column accordion (mobile only, CSS-driven at >767px)
       --------------------------------------------------------------------- */
    function initFooterAccordion() {
        var toggles = document.querySelectorAll('.footer-col-toggle');
        if (!toggles.length) return;

        toggles.forEach(function (toggle) {
            var links = toggle.parentElement.querySelector('.footer-col-links');
            if (!links) return;
            toggle.setAttribute('aria-expanded', 'false');

            toggle.addEventListener('click', function () {
                if (window.innerWidth > 767) return; // desktop: accordion disabled via CSS
                var isOpen = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', String(!isOpen));
                links.style.maxHeight = isOpen ? '0px' : links.scrollHeight + 'px';
            });
        });

        window.addEventListener('resize', debounce(function () {
            if (window.innerWidth > 767) {
                document.querySelectorAll('.footer-col-links').forEach(function (l) {
                    l.style.maxHeight = '';
                });
            }
        }, 200));
    }

    /* ---------------------------------------------------------------------
       Hero registration form: validation + simulated submit
       --------------------------------------------------------------------- */
    function initHeroForm() {
        var form = document.getElementById('heroSignupForm');
        var submitBtn = document.getElementById('heroSubmitBtn');
        var errorEl = document.getElementById('heroFormError');
        if (!form || !submitBtn || !errorEl) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            errorEl.classList.remove('is-visible');
            errorEl.textContent = '';

            var profileFor = document.getElementById('heroProfileFor');
            var genderChecked = form.querySelector('input[name="heroGender"]:checked');
            var name = document.getElementById('heroName');
            var mobile = document.getElementById('heroMobile');

            if (!profileFor.value) return showError('Please select who this profile is for.');
            if (!genderChecked) return showError('Please select a gender.');
            if (!name.value.trim() || name.value.trim().length < 2) return showError('Please enter a valid name.');
            if (!/^[0-9]{7,15}$/.test(mobile.value.trim())) return showError('Please enter a valid mobile number.');

            submitBtn.classList.add('is-loading');
            submitBtn.disabled = true;

            window.setTimeout(function () {
                submitBtn.classList.remove('is-loading');
                submitBtn.disabled = false;
                form.reset();
                showError('Thanks! An OTP has been sent to your mobile number.', true);
            }, 1400);

            function showError(msg, isSuccess) {
                errorEl.textContent = msg;
                errorEl.classList.add('is-visible');
                errorEl.style.color = isSuccess ? 'var(--color-primary)' : 'var(--color-accent)';
            }
        });
    }

    /* ---------------------------------------------------------------------
       Contact form: validation + success message
       --------------------------------------------------------------------- */
    function initContactForm() {
        var form = document.getElementById('contactForm');
        var successEl = document.getElementById('formSuccess');
        if (!form || !successEl) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            successEl.hidden = false;
            form.reset();
            window.setTimeout(function () { successEl.hidden = true; }, 5000);
        });
    }

    /* ---------------------------------------------------------------------
       Utils
       --------------------------------------------------------------------- */
    function debounce(fn, wait) {
        var t;
        return function () {
            var args = arguments;
            window.clearTimeout(t);
            t = window.setTimeout(function () { fn.apply(null, args); }, wait);
        };
    }
})();