/* ================================================================
   QUICK SEARCH PAGE — quick-search.js
   Depends on: script.js (base), lucide icons already loaded
   ================================================================ */

(function () {
  'use strict';

  /* ---- Data ---- */
  const DATA = {
    religion: ['Hindu', 'Sikh', 'Christian', 'Buddhist', 'Muslim'],
    maritalStatus: ['Never Married', 'Widow / Widower', 'Divorcee', 'Separated', 'Any'],
    community: [
      'Brahmin','Agarwal','Bhandari','Arora','Aryasamaj','Bahi','Bhatia',
      'Chaudhary - Ghirth','Chaurasia','Chimbbe','Dhiman - Vishwakarma',
      'Gaddi','Garhwali Rajput','Goswami','Gour','Gujjar','Gupta',
      'Jaat','Jogi','Kamboj','Kashyap','Kayasth','Khatri','Koli',
      'Kshatriya','Labana','Lingayat','Lohar','Maratha','Marwari',
      'Mehra','Nai - Barbar','Naidu','Nair','OBC (Barber-Naayee)',
      'Punjabi','Rajput','Rana','Rawat','Reddy','Saini','Scheduled Caste',
      'Sindhi','Sood','Vaishnav','Yadav','Valmiki','Any','Other',
    ],
  };

  /* ---- State ---- */
  const state = {
    ageMin: 18,
    ageMax: 70,
    religion: [],       // single select
    community: [],      // multi select
    maritalStatus: [],  // single select
  };

  /* ================================================================
     RANGE SLIDER (dual handle)
  ================================================================ */
  function initRangeSlider() {
    const minInput  = document.getElementById('ageMin');
    const maxInput  = document.getElementById('ageMax');
    const fill      = document.getElementById('ageFill');
    const badge     = document.getElementById('ageBadge');

    function updateFill() {
      const min = parseInt(minInput.min);
      const max = parseInt(minInput.max);
      const lo  = parseInt(minInput.value);
      const hi  = parseInt(maxInput.value);
      const pLo = ((lo - min) / (max - min)) * 100;
      const pHi = ((hi - min) / (max - min)) * 100;
      fill.style.left  = pLo + '%';
      fill.style.right = (100 - pHi) + '%';
      badge.textContent = lo + ' – ' + hi + ' yrs';
      state.ageMin = lo;
      state.ageMax = hi;
      updateSummary();
    }

    minInput.addEventListener('input', function () {
      if (parseInt(minInput.value) > parseInt(maxInput.value) - 1) {
        minInput.value = parseInt(maxInput.value) - 1;
      }
      updateFill();
    });

    maxInput.addEventListener('input', function () {
      if (parseInt(maxInput.value) < parseInt(minInput.value) + 1) {
        maxInput.value = parseInt(minInput.value) + 1;
      }
      updateFill();
    });

    updateFill();
  }

  /* ================================================================
     PILL RENDERER — single select
  ================================================================ */
  function renderSinglePills(containerId, items, stateKey) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    items.forEach(function (item) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qs-pill';
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML =
        '<span class="qs-pill-check"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>' +
        '<span>' + item + '</span>';

      btn.addEventListener('click', function () {
        // Deselect if already selected (toggle off)
        if (state[stateKey].includes(item)) {
          state[stateKey] = [];
        } else {
          state[stateKey] = [item];
        }
        refreshSinglePills(container, items, stateKey);
        updateSummary();
      });

      container.appendChild(btn);
    });
  }

  function refreshSinglePills(container, items, stateKey) {
    const btns = container.querySelectorAll('.qs-pill');
    btns.forEach(function (btn, i) {
      const isSelected = state[stateKey].includes(items[i]);
      btn.classList.toggle('selected', isSelected);
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });
  }

  /* ================================================================
     COMMUNITY — multi select with search
  ================================================================ */
  function renderCommunityPills() {
    const container  = document.getElementById('communityPills');
    const searchInput = document.getElementById('communitySearch');
    const clearBtn   = document.getElementById('commSearchClear');
    if (!container) return;

    container.innerHTML = '';
    DATA.community.forEach(function (item) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qs-pill';
      btn.dataset.value = item;
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML =
        '<span class="qs-pill-check"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>' +
        '<span>' + item + '</span>';

      btn.addEventListener('click', function () {
        toggleCommunity(item);
        refreshCommunityPills();
        refreshCommSelectedBar();
        updateSummary();
      });

      container.appendChild(btn);
    });

    // Search filter
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        const q = this.value.trim().toLowerCase();
        clearBtn.style.display = q ? 'flex' : 'none';
        filterCommunityPills(q);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        filterCommunityPills('');
        searchInput.focus();
      });
    }

    // Clear all
    const clearAllBtn = document.getElementById('commClearAll');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', function () {
        state.community = [];
        refreshCommunityPills();
        refreshCommSelectedBar();
        updateSummary();
      });
    }
  }

  function toggleCommunity(item) {
    const idx = state.community.indexOf(item);
    if (idx === -1) {
      state.community.push(item);
    } else {
      state.community.splice(idx, 1);
    }
  }

  function refreshCommunityPills() {
    const container = document.getElementById('communityPills');
    if (!container) return;
    container.querySelectorAll('.qs-pill').forEach(function (btn) {
      const val = btn.dataset.value;
      const isSelected = state.community.includes(val);
      btn.classList.toggle('selected', isSelected);
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });
  }

  function filterCommunityPills(query) {
    const container = document.getElementById('communityPills');
    if (!container) return;

    let hasVisible = false;
    container.querySelectorAll('.qs-pill').forEach(function (btn) {
      const val = btn.dataset.value.toLowerCase();
      const show = !query || val.includes(query);
      btn.classList.toggle('qs-pill-hidden', !show);
      if (show) hasVisible = true;
    });

    // Show/hide no-results
    let noRes = container.parentElement.querySelector('.qs-no-results');
    if (!hasVisible) {
      if (!noRes) {
        noRes = document.createElement('p');
        noRes.className = 'qs-no-results';
        noRes.textContent = 'No communities found';
        container.parentElement.insertBefore(noRes, container.nextSibling);
      }
      noRes.style.display = 'block';
    } else if (noRes) {
      noRes.style.display = 'none';
    }
  }

  function refreshCommSelectedBar() {
    const bar    = document.getElementById('commSelectedBar');
    const chips  = document.getElementById('commSelectedChips');
    if (!bar || !chips) return;

    if (state.community.length === 0) {
      bar.style.display = 'none';
      return;
    }

    bar.style.display = 'flex';
    chips.innerHTML = '';
    state.community.forEach(function (val) {
      const chip = document.createElement('span');
      chip.className = 'qs-sel-chip';
      chip.innerHTML =
        val +
        '<button type="button" class="qs-sel-chip-remove" aria-label="Remove ' + val + '">' +
        '<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>';

      chip.querySelector('.qs-sel-chip-remove').addEventListener('click', function () {
        state.community = state.community.filter(function (v) { return v !== val; });
        refreshCommunityPills();
        refreshCommSelectedBar();
        updateSummary();
      });

      chips.appendChild(chip);
    });

    // Re-init lucide in chips (fallback, icons are inline SVG here)
  }

  /* ================================================================
     SUMMARY BAR
  ================================================================ */
  function updateSummary() {
    const el = document.getElementById('qsSummaryText');
    if (!el) return;

    const parts = [];
    if (state.ageMin !== 18 || state.ageMax !== 70) {
      parts.push('Age: ' + state.ageMin + '–' + state.ageMax);
    }
    if (state.religion.length) {
      parts.push('Religion: ' + state.religion.join(', '));
    }
    if (state.community.length) {
      parts.push(state.community.length + ' communit' + (state.community.length === 1 ? 'y' : 'ies'));
    }
    if (state.maritalStatus.length) {
      parts.push(state.maritalStatus.join(', '));
    }

    el.textContent = parts.length ? parts.join(' · ') : 'No filters applied';
  }

  /* ================================================================
     RESET
  ================================================================ */
  function resetAll() {
    state.ageMin = 18;
    state.ageMax = 70;
    state.religion = [];
    state.community = [];
    state.maritalStatus = [];

    // Reset range inputs
    const minInput = document.getElementById('ageMin');
    const maxInput = document.getElementById('ageMax');
    if (minInput) minInput.value = 18;
    if (maxInput) maxInput.value = 70;

    // Trigger fill update
    initRangeSlider();

    // Refresh pills
    refreshSinglePills(
      document.getElementById('religionPills'),
      DATA.religion, 'religion'
    );
    refreshSinglePills(
      document.getElementById('maritalPills'),
      DATA.maritalStatus, 'maritalStatus'
    );
    state.community = [];
    refreshCommunityPills();
    refreshCommSelectedBar();

    // Clear community search
    const searchInput = document.getElementById('communitySearch');
    const clearBtn    = document.getElementById('commSearchClear');
    if (searchInput) { searchInput.value = ''; }
    if (clearBtn)    { clearBtn.style.display = 'none'; }
    filterCommunityPills('');

    updateSummary();
  }

  /* ================================================================
     SEARCH — build query object & navigate
  ================================================================ */
  function doSearch() {
    const params = new URLSearchParams();
    params.set('age_from', state.ageMin);
    params.set('age_to',   state.ageMax);
    if (state.religion.length)     params.set('religion',       state.religion.join(','));
    if (state.community.length)    params.set('cast',           state.community.join(','));
    if (state.maritalStatus.length) params.set('marital_status', state.maritalStatus.join(','));

    // Navigate to results page
    window.location.href = 'search-results.html?' + params.toString();
  }

  /* ================================================================
     INIT
  ================================================================ */
  function init() {
    initRangeSlider();
    renderSinglePills('religionPills', DATA.religion, 'religion');
    renderCommunityPills();
    renderSinglePills('maritalPills', DATA.maritalStatus, 'maritalStatus');
    updateSummary();

    // Wire buttons
    const searchBtn = document.getElementById('qsSearchBtn');
    const resetBtn  = document.getElementById('qsResetBtn');
    if (searchBtn) searchBtn.addEventListener('click', doSearch);
    if (resetBtn)  resetBtn.addEventListener('click', resetAll);

    // Re-init lucide icons (for dynamically added elements, not needed here
    // since we use inline SVG in chips, but run for static icons)
    if (window.lucide) lucide.createIcons();
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();