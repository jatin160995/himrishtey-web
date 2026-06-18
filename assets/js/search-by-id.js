/* ================================================================
   SEARCH BY PROFILE ID — search-by-id.js
   Depends on: script.js (base), lucide icons already loaded
   ================================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     MOCK DATA — replace with real API call in production
     Simulates the API response shape: { success, user }
  ---------------------------------------------------------------- */
  const MOCK_PROFILES = {
    'HR-10001': {
      id: 'HR-10001',
      name: 'Anjali Sharma',
      age: 26,
      height: '5\'4"',
      religion: 'Hindu',
      community: 'Brahmin',
      education: 'B.Tech (Computer Science)',
      occupation: 'Software Engineer',
      location: 'Shimla, HP',
      maritalStatus: 'Never Married',
      motherTongue: 'Hindi',
      income: '₹8 LPA',
      verified: true,
      online: true,
      photo: 'https://picsum.photos/seed/anjali1/400/400',
      cover: 'https://picsum.photos/seed/anjali1cover/680/160',
    },
    'HR-10002': {
      id: 'HR-10002',
      name: 'Rohan Thakur',
      age: 30,
      height: '5\'10"',
      religion: 'Hindu',
      community: 'Rajput',
      education: 'MBA Finance',
      occupation: 'Bank Manager',
      location: 'Dharamshala, HP',
      maritalStatus: 'Never Married',
      motherTongue: 'Pahari',
      income: '₹12 LPA',
      verified: true,
      online: false,
      photo: 'https://picsum.photos/seed/rohan2/400/400',
      cover: 'https://picsum.photos/seed/rohan2cover/680/160',
    },
    'HR-20241': {
      id: 'HR-20241',
      name: 'Priya Verma',
      age: 24,
      height: '5\'2"',
      religion: 'Hindu',
      community: 'Agarwal',
      education: 'B.Com (Hons)',
      occupation: 'Teacher',
      location: 'Mandi, HP',
      maritalStatus: 'Never Married',
      motherTongue: 'Hindi',
      income: '₹4 LPA',
      verified: false,
      online: true,
      photo: 'https://picsum.photos/seed/bride1/400/400',
      cover: 'https://picsum.photos/seed/bride1cover/680/160',
    },
  };

  /* ----------------------------------------------------------------
     DOM references
  ---------------------------------------------------------------- */
  const input          = document.getElementById('profileIdInput');
  const clearInputBtn  = document.getElementById('sbidClearInput');
  const searchBtn      = document.getElementById('sbidSearchBtn');
  const btnText        = searchBtn  && searchBtn.querySelector('.sbid-btn-text');
  const btnIcon        = searchBtn  && searchBtn.querySelector('.sbid-btn-icon');
  const btnSpinner     = searchBtn  && searchBtn.querySelector('.sbid-btn-spinner');
  const tryAgainBtn    = document.getElementById('sbidTryAgain');
  const interestBtn    = document.getElementById('sbidInterestBtn');
  const shortlistBtn   = document.getElementById('sbidShortlistBtn');

  /* States */
  const stateIdle      = document.getElementById('stateIdle');
  const stateLoading   = document.getElementById('stateLoading');
  const stateNotFound  = document.getElementById('stateNotFound');
  const stateResult    = document.getElementById('stateResult');

  /* ----------------------------------------------------------------
     State management
  ---------------------------------------------------------------- */
  function showState(which) {
    [stateIdle, stateLoading, stateNotFound, stateResult].forEach(function (el) {
      if (el) el.style.display = 'none';
    });
    if (which) {
      which.style.display = '';
      if (which === stateResult) {
        // Trigger animation
        which.classList.remove('visible');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            which.classList.add('visible');
          });
        });
      }
    }
  }

  /* ----------------------------------------------------------------
     Loading button state
  ---------------------------------------------------------------- */
  function setSearching(on) {
    if (!searchBtn) return;
    searchBtn.disabled = on;
    if (btnText)    btnText.style.display    = on ? 'none' : '';
    if (btnIcon)    btnIcon.style.display    = on ? 'none' : '';
    if (btnSpinner) btnSpinner.style.display = on ? '' : 'none';
  }

  /* ----------------------------------------------------------------
     Shake invalid input
  ---------------------------------------------------------------- */
  function shakeInput() {
    if (!input) return;
    input.classList.add('sbid-input-error', 'shake');
    input.addEventListener('animationend', function () {
      input.classList.remove('shake');
    }, { once: true });
  }

  /* ----------------------------------------------------------------
     Normalise ID: strip spaces, uppercase
  ---------------------------------------------------------------- */
  function normaliseId(raw) {
    return raw.trim().toUpperCase().replace(/\s+/g, '');
  }

  /* ----------------------------------------------------------------
     Mock API call (replace with fetch() to real endpoint)
  ---------------------------------------------------------------- */
  function apiSearchById(profileId) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        const user = MOCK_PROFILES[profileId];
        if (user) {
          resolve({ success: true, user: user });
        } else {
          resolve({ success: false });
        }
      }, 900); // simulate network delay
    });
  }

  /* ----------------------------------------------------------------
     Render profile card
  ---------------------------------------------------------------- */
  function renderProfile(user) {
    /* Label */
    const resultIdLabel = document.getElementById('resultIdLabel');
    if (resultIdLabel) resultIdLabel.textContent = user.id;

    /* Cover */
    const coverImg = document.getElementById('resultCoverImg');
    if (coverImg) {
      coverImg.src = user.cover || '';
      coverImg.alt = user.name + ' cover photo';
    }

    /* Avatar */
    const avatar = document.getElementById('resultAvatar');
    if (avatar) {
      avatar.src = user.photo || 'https://picsum.photos/seed/default/80/80';
      avatar.alt = user.name;
    }

    /* Online */
    const onlineBadge = document.getElementById('resultOnlineBadge');
    if (onlineBadge) onlineBadge.style.display = user.online ? '' : 'none';

    /* Name */
    const name = document.getElementById('resultName');
    if (name) name.textContent = user.name;

    /* Verified */
    const verifiedBadge = document.getElementById('resultVerifiedBadge');
    if (verifiedBadge) verifiedBadge.style.display = user.verified ? '' : 'none';

    /* ID tag */
    const idTag = document.getElementById('resultIdTag');
    if (idTag) idTag.textContent = user.id;

    /* Quick stats pills */
    const statsRow = document.getElementById('resultStatsRow');
    if (statsRow) {
      const stats = [
        { icon: 'calendar', label: user.age + ' yrs' },
        { icon: 'ruler',    label: user.height },
        { icon: 'map-pin',  label: user.location },
        { icon: 'briefcase',label: user.occupation },
      ];
      statsRow.innerHTML = stats.map(function (s) {
        return '<span class="sbid-stat-pill">' +
          '<svg data-lucide="' + s.icon + '" width="12" height="12"></svg>' +
          s.label +
          '</span>';
      }).join('');
    }

    /* Details grid */
    const detailsGrid = document.getElementById('resultDetailsGrid');
    if (detailsGrid) {
      const details = [
        { label: 'Religion',       value: user.religion },
        { label: 'Community',      value: user.community },
        { label: 'Education',      value: user.education },
        { label: 'Mother Tongue',  value: user.motherTongue },
        { label: 'Marital Status', value: user.maritalStatus },
        { label: 'Annual Income',  value: user.income },
      ];
      detailsGrid.innerHTML = details.map(function (d) {
        return '<div class="sbid-detail-item">' +
          '<span class="sbid-detail-label">' + d.label + '</span>' +
          '<span class="sbid-detail-value' + (d.value ? '' : ' empty') + '">' +
          (d.value || 'Not specified') +
          '</span></div>';
      }).join('');
    }

    /* View full profile link */
    const viewBtn = document.getElementById('sbidViewFullBtn');
    if (viewBtn) viewBtn.href = 'profile-detail.html?id=' + encodeURIComponent(user.id);

    /* Re-render lucide icons inside the card */
    if (window.lucide) lucide.createIcons();
  }

  /* ----------------------------------------------------------------
     Main search handler
  ---------------------------------------------------------------- */
  async function doSearch() {
    if (!input) return;

    const rawId = input.value;
    const profileId = normaliseId(rawId);

    /* Validate */
    if (!profileId) {
      shakeInput();
      input.focus();
      return;
    }

    input.classList.remove('sbid-input-error');
    setSearching(true);
    showState(stateLoading);

    try {
      const response = await apiSearchById(profileId);

      if (response.success && response.user) {
        renderProfile(response.user);
        showState(stateResult);
      } else {
        const notFoundId = document.getElementById('notFoundId');
        if (notFoundId) notFoundId.textContent = profileId;
        showState(stateNotFound);
      }
    } catch (err) {
      console.error('Search failed:', err);
      const notFoundId = document.getElementById('notFoundId');
      if (notFoundId) notFoundId.textContent = profileId;
      showState(stateNotFound);
    } finally {
      setSearching(false);
    }
  }

  /* ----------------------------------------------------------------
     Event listeners
  ---------------------------------------------------------------- */
  function init() {
    /* Search on button click */
    if (searchBtn) {
      searchBtn.addEventListener('click', doSearch);
    }

    /* Search on Enter */
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') doSearch();
        input.classList.remove('sbid-input-error');
      });

      /* Show/hide clear button */
      input.addEventListener('input', function () {
        if (clearInputBtn) {
          clearInputBtn.style.display = this.value ? 'flex' : 'none';
        }
      });
    }

    /* Clear input */
    if (clearInputBtn) {
      clearInputBtn.addEventListener('click', function () {
        if (input) { input.value = ''; input.focus(); }
        clearInputBtn.style.display = 'none';
        showState(stateIdle);
      });
    }

    /* Try Again */
    if (tryAgainBtn) {
      tryAgainBtn.addEventListener('click', function () {
        showState(stateIdle);
        if (input) { input.value = ''; input.focus(); }
        if (clearInputBtn) clearInputBtn.style.display = 'none';
      });
    }

    /* Interest button toggle */
    if (interestBtn) {
      interestBtn.addEventListener('click', function () {
        const isActive = this.classList.toggle('active');
        const iconEl   = this.querySelector('svg');
        const textEl   = this.querySelector('span');
        if (textEl) textEl.textContent = isActive ? 'Interested' : 'Interest';
        this.setAttribute('aria-pressed', isActive);
        if (iconEl) iconEl.style.fill = isActive ? 'white' : 'none';
      });
    }

    /* Shortlist button toggle */
    if (shortlistBtn) {
      shortlistBtn.addEventListener('click', function () {
        const isActive = this.classList.toggle('active');
        const textEl   = this.querySelector('span');
        if (textEl) textEl.textContent = isActive ? 'Saved' : 'Shortlist';
        this.setAttribute('aria-pressed', isActive);
      });
    }

    /* Init lucide icons */
    if (window.lucide) lucide.createIcons();
  }

  /* Run after DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();