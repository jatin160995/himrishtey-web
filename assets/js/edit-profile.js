/* =========================================
   edit-profile.js — HimRishtey
   Edit Profile Page Logic
   ========================================= */

(function () {
  'use strict';

  // ---- Reinitialise Lucide after DOM ready ----
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    initTabs();
    initForms();
    initMultiSelects();
    initRangeSliders();
    initLifestyleConditionals();
  });

  // =============================================
  // TAB SWITCHING
  // =============================================
  function initTabs() {
    const sidebarBtns = document.querySelectorAll('.ep-tab-btn[data-tab]');
    const mobileBtns  = document.querySelectorAll('.ep-mobile-tab[data-tab]');
    const panels      = document.querySelectorAll('.ep-tab-panel[id^="tab-"]');

    function switchTab(targetTab, clickedBtn) {
      // Check unsaved changes on current active tab
      const currentDirtyBtn = document.querySelector('.ep-tab-btn[data-dirty="true"]');
      const unsavedToast = document.getElementById('epUnsavedToast');

      // Deactivate all tab buttons
      sidebarBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      mobileBtns.forEach(b => b.classList.remove('active'));

      // Activate clicked tab buttons (both sidebar + mobile)
      document.querySelectorAll(`[data-tab="${targetTab}"]`).forEach(b => {
        b.classList.add('active');
        b.setAttribute('aria-selected', 'true');
      });

      // Show matching panel, hide others
      panels.forEach(panel => {
        if (panel.id === `tab-${targetTab}`) {
          panel.removeAttribute('hidden');
          panel.classList.add('active');
        } else {
          panel.setAttribute('hidden', '');
          panel.classList.remove('active');
        }
      });

      // Show unsaved toast if the newly active tab has dirty form
      const newDirtyBtn = document.querySelector(`.ep-tab-btn[data-tab="${targetTab}"][data-dirty="true"]`);
      if (unsavedToast) {
        if (newDirtyBtn) {
          unsavedToast.removeAttribute('hidden');
        } else {
          unsavedToast.setAttribute('hidden', '');
        }
      }

      // Re-init lucide icons for the newly visible panel
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    sidebarBtns.forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab, btn));
    });
    mobileBtns.forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab, btn));
    });
  }

  // =============================================
  // DIRTY STATE — Mark tab unsaved on any input change
  // =============================================
  function markDirty(sectionId) {
    const btn = document.querySelector(`.ep-tab-btn[data-tab="${sectionId}"]`);
    if (btn) btn.setAttribute('data-dirty', 'true');
    const unsavedToast = document.getElementById('epUnsavedToast');
    if (unsavedToast) unsavedToast.removeAttribute('hidden');
  }

  function clearDirty(sectionId) {
    const btn = document.querySelector(`.ep-tab-btn[data-tab="${sectionId}"]`);
    if (btn) btn.removeAttribute('data-dirty');
    const unsavedToast = document.getElementById('epUnsavedToast');
    if (unsavedToast) unsavedToast.setAttribute('hidden', '');
  }

  // =============================================
  // FORMS — Submit + Validation
  // =============================================
  function initForms() {
    const forms = document.querySelectorAll('.ep-form[data-section]');

    forms.forEach(form => {
      const section = form.dataset.section;

      // Mark dirty on input
      form.addEventListener('input', () => markDirty(section));
      form.addEventListener('change', () => markDirty(section));

      form.addEventListener('submit', e => {
        e.preventDefault();

        if (!validateForm(form)) return;

        const saveBtn = form.querySelector('.ep-save-btn');
        saveBtn.classList.add('saving');
        saveBtn.innerHTML = '<i data-lucide="loader-circle" width="16" height="16"></i> Saving...';
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Simulate API call — replace with real fetch
        setTimeout(() => {
          saveBtn.classList.remove('saving');
          saveBtn.innerHTML = '<i data-lucide="save" width="16" height="16"></i> Saved!';
          if (typeof lucide !== 'undefined') lucide.createIcons();

          clearDirty(section);
          updateTabStatus(section, 'complete');
          showToast('Profile Updated Successfully! Changes will be visible after approval.');

          setTimeout(() => {
            saveBtn.innerHTML = `<i data-lucide="save" width="16" height="16"></i> Save ${capitalize(section)} Info`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
          }, 2500);
        }, 1200);
      });
    });
  }

  function validateForm(form) {
    let valid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
        field.focus();
      }
    });

    // Phone validation for contact form
    const phoneField = form.querySelector('#mobile_number');
    if (phoneField && phoneField.value.trim()) {
      const stripped = phoneField.value.replace(/\D/g, '');
      if (stripped.length < 10 || stripped.length > 13) {
        phoneField.classList.add('error');
        showToast('Please enter a valid phone number.', true);
        valid = false;
      }
    }

    // Gotra required for religion
    const gotraField = form.querySelector('#gotra');
    if (gotraField && !gotraField.value.trim()) {
      gotraField.classList.add('error');
      showToast('Gotra is required.', true);
      valid = false;
    }

    return valid;
  }

  // =============================================
  // TAB STATUS (complete / incomplete indicator)
  // =============================================
  function updateTabStatus(sectionId, status) {
    const btn = document.querySelector(`.ep-tab-btn[data-tab="${sectionId}"]`);
    if (!btn) return;
    const statusEl = btn.querySelector('.ep-tab-status');
    if (!statusEl) return;

    statusEl.className = `ep-tab-status ${status}`;
    statusEl.innerHTML = status === 'complete'
      ? '<i data-lucide="check-circle" width="14" height="14"></i>'
      : '<i data-lucide="circle" width="14" height="14"></i>';
    statusEl.title = status === 'complete' ? 'Complete' : 'Incomplete';

    if (typeof lucide !== 'undefined') lucide.createIcons();
    updateOverallCompletion();
  }

  function updateOverallCompletion() {
    const totalTabs = document.querySelectorAll('.ep-tab-btn[data-tab]').length;
    const completeTabs = document.querySelectorAll('.ep-tab-status.complete').length;
    const pct = Math.round((completeTabs / totalTabs) * 100);
    const bar = document.querySelector('.ep-completion-bar');
    const label = document.querySelector('.ep-completion-pct');
    if (bar) bar.style.width = pct + '%';
    if (label) label.textContent = pct + '%';
  }

  // =============================================
  // MULTI-SELECT DROPDOWNS
  // =============================================
  function initMultiSelects() {
    const triggers = document.querySelectorAll('.ep-multiselect-trigger');

    triggers.forEach(trigger => {
      const targetId = trigger.dataset.target;
      const dropdown = document.getElementById(`${targetId}-dropdown`);
      const hiddenInput = document.getElementById(targetId);
      const displayEl = document.getElementById(`${targetId}-display`);

      if (!dropdown || !hiddenInput || !displayEl) return;

      trigger.addEventListener('click', () => {
        const isOpen = !dropdown.hidden;
        // Close all other dropdowns
        document.querySelectorAll('.ep-multiselect-dropdown').forEach(d => d.setAttribute('hidden', ''));
        document.querySelectorAll('.ep-multiselect-trigger').forEach(t => t.classList.remove('open'));

        if (!isOpen) {
          dropdown.removeAttribute('hidden');
          trigger.classList.add('open');
        }
      });

      trigger.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger.click();
        }
      });

      dropdown.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
          const checked = [...dropdown.querySelectorAll('input[type="checkbox"]:checked')]
            .map(c => c.value);
          if (checked.length === 0) {
            hiddenInput.value = 'Any';
            displayEl.textContent = 'Any';
          } else {
            hiddenInput.value = checked.join(',');
            displayEl.textContent = checked.length > 2
              ? `${checked.slice(0, 2).join(', ')} +${checked.length - 2} more`
              : checked.join(', ');
          }
          // Mark section dirty
          const panel = trigger.closest('.ep-tab-panel');
          if (panel) {
            const sectionId = panel.id.replace('tab-', '');
            markDirty(sectionId);
          }
        });
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', e => {
      if (!e.target.closest('.ep-multiselect-trigger') && !e.target.closest('.ep-multiselect-dropdown')) {
        document.querySelectorAll('.ep-multiselect-dropdown').forEach(d => d.setAttribute('hidden', ''));
        document.querySelectorAll('.ep-multiselect-trigger').forEach(t => t.classList.remove('open'));
      }
    });
  }


  function initBasicInfoConditionals() {
        const maritalStatus = document.getElementById('marital_status');
        const childrenWrap = document.getElementById('children-wrap');
        const childrenSelect = document.getElementById('no_of_child');

        if (!maritalStatus || !childrenWrap) return;

        function toggleChildrenField() {
            if (maritalStatus.value && maritalStatus.value !== 'Never Married') {
            childrenWrap.removeAttribute('hidden');
            } else {
            childrenWrap.setAttribute('hidden', '');
            if (childrenSelect) childrenSelect.value = '';
            }
        }

        maritalStatus.addEventListener('change', toggleChildrenField);
        toggleChildrenField();
    }
  // =============================================
  // RANGE SLIDERS — Dual range with live label
  // =============================================
  function initRangeSliders() {
    // Age range
    setupDualRange(
      document.getElementById('age_from'),
      document.getElementById('age_to'),
      document.getElementById('age-range-label'),
      v => `${Math.round(v)}`
    );

    // Height range — map 1-28 to feet/inches
    const heights = buildHeightLabels(); // 4'6" to 7'0"
    setupDualRange(
      document.getElementById('height_from'),
      document.getElementById('height_to'),
      document.getElementById('height-range-label'),
      v => heights[Math.round(v) - 1] || v,
      true
    );

    // Income range
    setupDualRange(
      document.getElementById('income_from'),
      document.getElementById('income_to'),
      document.getElementById('income-range-label'),
      v => `${Math.round(v)} LPA`
    );
  }

  function setupDualRange(fromEl, toEl, labelEl, formatter, clampMin = false) {
    if (!fromEl || !toEl || !labelEl) return;

    function update() {
      let from = parseInt(fromEl.value);
      let to   = parseInt(toEl.value);
      if (from > to) {
        if (document.activeElement === fromEl) {
          fromEl.value = to;
          from = to;
        } else {
          toEl.value = from;
          to = from;
        }
      }
      labelEl.textContent = `${formatter(from)} – ${formatter(to)}`;
    }

    fromEl.addEventListener('input', update);
    toEl.addEventListener('input', update);
    update();
  }

  function buildHeightLabels() {
    const labels = [];
    // 4'6" to 7'0" in 1-inch steps = 31 steps, map indices 1-28 roughly
    const start = { ft: 4, inch: 6 };
    for (let i = 0; i < 28; i++) {
      let inch = start.inch + i;
      let ft = start.ft + Math.floor(inch / 12);
      inch = inch % 12;
      labels.push(`${ft}'${inch}"`);
    }
    return labels;
  }

  // =============================================
  // LIFESTYLE — Conditional disability field
  // =============================================
  function initLifestyleConditionals() {
    const disabilitySelect = document.getElementById('any_disability');
    const detailWrap = document.getElementById('disability-detail-wrap');

    if (!disabilitySelect || !detailWrap) return;

    function toggleDetail() {
      if (disabilitySelect.value === 'Yes') {
        detailWrap.removeAttribute('hidden');
      } else {
        detailWrap.setAttribute('hidden', '');
        const detailInput = document.getElementById('disability_detail');
        if (detailInput) detailInput.value = '';
      }
    }

    disabilitySelect.addEventListener('change', toggleDetail);
    toggleDetail();
  }

  // =============================================
  // TOAST NOTIFICATION
  // =============================================
  function showToast(message, isError = false) {
    const toast = document.getElementById('epSuccessToast');
    const msgEl = document.getElementById('epToastMsg');
    if (!toast || !msgEl) return;

    msgEl.textContent = message;
    toast.style.background = isError
      ? 'var(--color-error, #a12c7b)'
      : 'var(--color-text)';

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  // =============================================
  // UTILS
  // =============================================
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

})();