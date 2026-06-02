/* ============================================================
   HimRishtey — Homepage Script
   ============================================================ */

(function () {
  'use strict';

  /* ---- THEME TOGGLE ---- */
  const html = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');

  let currentTheme = (() => {
    try {
      return localStorage.getItem('hr-theme') || 'light';
    } catch (e) {
      return 'light';
    }
  })();

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    currentTheme = theme;
    try { localStorage.setItem('hr-theme', theme); } catch (e) {}
    if (themeToggle) {
      const isDark = theme === 'dark';
      themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggle.innerHTML = isDark
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }

  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }


  /* ---- SIDEBAR ---- */
  const sidebar        = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarToggle  = document.getElementById('sidebarToggle');
  const sidebarClose   = document.getElementById('sidebarClose');

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    sidebarOverlay.removeAttribute('aria-hidden');
    sidebarToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus first focusable item inside sidebar
    const firstFocusable = sidebar.querySelector('a, button');
    if (firstFocusable) firstFocusable.focus();
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    sidebarOverlay.setAttribute('aria-hidden', 'true');
    sidebarToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    sidebarToggle.focus();
  }

  if (sidebarToggle) sidebarToggle.addEventListener('click', openSidebar);
  if (sidebarClose)  sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  // Close sidebar on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (sidebar && sidebar.classList.contains('open')) closeSidebar();
      if (profileQuickView && profileQuickView.classList.contains('active')) closePQV();
    }
  });

  // Trap focus inside sidebar when open
  if (sidebar) {
    sidebar.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = [...sidebar.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')];
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    });
  }


  /* ---- PROFILE QUICK VIEW ---- */
  const profileQuickViewBtn = document.getElementById('profileQuickViewBtn');
  const profileQuickView    = document.getElementById('profileQuickView');
  const pqvClose            = document.getElementById('pqvClose');
  const pqvBackdrop         = document.getElementById('pqvBackdrop');

  function openPQV() {
    if (!profileQuickView) return;
    profileQuickView.classList.add('active');
    profileQuickView.removeAttribute('aria-hidden');
    pqvBackdrop.classList.add('active');
    pqvBackdrop.removeAttribute('aria-hidden');
    profileQuickViewBtn.setAttribute('aria-expanded', 'true');
    // Focus close button
    if (pqvClose) pqvClose.focus();
  }

  function closePQV() {
    if (!profileQuickView) return;
    profileQuickView.classList.remove('active');
    profileQuickView.setAttribute('aria-hidden', 'true');
    pqvBackdrop.classList.remove('active');
    pqvBackdrop.setAttribute('aria-hidden', 'true');
    profileQuickViewBtn.setAttribute('aria-expanded', 'false');
    profileQuickViewBtn.focus();
  }

  if (profileQuickViewBtn) profileQuickViewBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileQuickView.classList.contains('active') ? closePQV() : openPQV();
  });
  if (pqvClose)    pqvClose.addEventListener('click', closePQV);
  if (pqvBackdrop) pqvBackdrop.addEventListener('click', closePQV);

  // Close PQV on outside click
  document.addEventListener('click', (e) => {
    if (
      profileQuickView &&
      profileQuickView.classList.contains('active') &&
      !profileQuickView.contains(e.target) &&
      e.target !== profileQuickViewBtn
    ) {
      closePQV();
    }
  });


  /* ---- STAT COUNTER ANIMATION ---- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    const duration = 1200;
    const startTime = performance.now();

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  // Use IntersectionObserver so counters animate when scrolled into view
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if ('IntersectionObserver' in window && statNumbers.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach((el) => observer.observe(el));
  } else {
    // Fallback: just set the values
    statNumbers.forEach((el) => {
      el.textContent = el.getAttribute('data-target');
    });
  }


  /* ---- LIKE BUTTON TOGGLE ---- */
  document.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.pca-btn.like');
    if (!likeBtn) return;
    e.preventDefault();
    e.stopPropagation();
    const isLiked = likeBtn.classList.toggle('liked');
    likeBtn.setAttribute('aria-pressed', isLiked);
    // Animate the heart icon
    likeBtn.style.transform = 'scale(1.35)';
    setTimeout(() => { likeBtn.style.transform = ''; }, 200);
  });

  // Add CSS for liked state dynamically
  const likeStyle = document.createElement('style');
  likeStyle.textContent = `.pca-btn.like.liked { background: #e91e63 !important; color: white !important; }`;
  document.head.appendChild(likeStyle);


  /* ---- INTEREST BUTTON TOGGLE ---- */
  document.addEventListener('click', (e) => {
    const interestBtn = e.target.closest('.pca-btn.interest');
    if (!interestBtn) return;
    e.preventDefault();
    e.stopPropagation();
    const isSent = interestBtn.classList.toggle('sent');
    interestBtn.setAttribute('aria-pressed', isSent);
    interestBtn.style.transform = 'scale(1.35)';
    setTimeout(() => { interestBtn.style.transform = ''; }, 200);
  });

  const interestStyle = document.createElement('style');
  interestStyle.textContent = `.pca-btn.interest.sent { background: var(--color-primary) !important; color: white !important; }`;
  document.head.appendChild(interestStyle);


  /* ---- PROFILE CARD KEYBOARD NAVIGATION ---- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.profile-card');
      if (card) {
        e.preventDefault();
        // Simulate a click / navigate to profile
        card.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    }
  });


  /* ---- SCROLL TRACK — DRAG TO SCROLL (Desktop) ---- */
  document.querySelectorAll('.profile-scroll-track').forEach((track) => {
    let isDown   = false;
    let startX   = 0;
    let scrollLeft = 0;

    track.addEventListener('mousedown', (e) => {
      // Ignore clicks on buttons inside cards
      if (e.target.closest('button')) return;
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.style.cursor = '';
    });

    track.addEventListener('mouseup', () => {
      isDown = false;
      track.style.cursor = '';
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });
  });


  /* ---- SCROLL REVEAL ANIMATION ---- */
  const revealEls = document.querySelectorAll(
    '.stat-card, .profile-card, .pc-card, .upgrade-banner, .section-header'
  );

  if ('IntersectionObserver' in window && revealEls.length) {
    // Add initial hidden state via JS (not CSS) so it doesn't flash on slow loads
    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = `opacity 420ms ease ${(i % 6) * 60}ms, transform 420ms cubic-bezier(0.16,1,0.3,1) ${(i % 6) * 60}ms`;
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach((el) => revealObserver.observe(el));
  }


  /* ---- LUCIDE ICONS INIT ---- */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  } else {
    // Retry after a short delay in case CDN is slow
    window.addEventListener('load', () => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }


  /* ---- LOGOUT BUTTON ---- */
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        // Redirect to login page
        window.location.href = 'login.html';
      }
    });
  }


  /* ---- REDUCED MOTION RESPECT ---- */
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach((el) => {
      el.style.opacity   = '1';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });
  }

})();