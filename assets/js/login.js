/* ============================================================
   HimRishtey — Login Page Script
   ============================================================ */

(function () {
  'use strict';

  /* ---- THEME TOGGLE (same as main) ---- */
  const html = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');

  let currentTheme = (() => {
    try { return localStorage.getItem('hr-theme') || 'light'; }
    catch (e) { return 'light'; }
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
    themeToggle.addEventListener('click', () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark'));
  }


  /* ---- TAB SWITCHER ---- */
  const tabs        = document.querySelectorAll('.login-tab');
  const panels      = document.querySelectorAll('.login-tab-panel');
  const tabSwitcher = document.querySelector('.login-tab-switcher');

  function switchTab(tabName) {
    tabs.forEach(t => {
      const isActive = t.dataset.tab === tabName;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive);
    });
    panels.forEach(p => {
      const isActive = p.id === `panel-${tabName}`;
      p.classList.toggle('active', isActive);
      if (isActive) { p.removeAttribute('hidden'); p.focus && p.focus(); }
      else p.setAttribute('hidden', '');
    });
    if (tabSwitcher) tabSwitcher.setAttribute('data-active', tabName);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Switch tab from "Create one now" / "Sign in here" links
  document.querySelectorAll('.switch-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.switch));
  });


  /* ---- PASSWORD VISIBILITY TOGGLE ---- */
  document.querySelectorAll('.input-toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input    = document.getElementById(targetId);
      if (!input) return;
      const isText = input.type === 'text';
      input.type   = isText ? 'password' : 'text';
      btn.setAttribute('aria-label', isText ? 'Show password' : 'Hide password');
      btn.innerHTML = isText
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    });
  });


  /* ---- PASSWORD STRENGTH INDICATOR ---- */
  const regPasswordInput    = document.getElementById('regPassword');
  const psbFill             = document.getElementById('psb-fill');
  const passwordStrengthLbl = document.getElementById('passwordStrengthLabel');

  function checkPasswordStrength(val) {
    if (!val) return { level: '', label: '' };
    let score = 0;
    if (val.length >= 6)  score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val))  score++;
    if (/[0-9]/.test(val))  score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    if (score <= 2) return { level: 'weak',   label: 'Weak' };
    if (score <= 3) return { level: 'medium', label: 'Medium' };
    return { level: 'strong', label: 'Strong' };
  }

  if (regPasswordInput && psbFill && passwordStrengthLbl) {
    regPasswordInput.addEventListener('input', () => {
      const { level, label } = checkPasswordStrength(regPasswordInput.value);
      psbFill.className = `psb-fill ${level}`;
      passwordStrengthLbl.className = `password-strength-label ${level}`;
      passwordStrengthLbl.textContent = label;
    });
  }


  /* ---- VALIDATION HELPERS ---- */
  function showError(inputEl, errorEl, message) {
    if (inputEl) inputEl.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(inputEl, errorEl) {
    if (inputEl) { inputEl.classList.remove('error'); inputEl.classList.remove('success'); }
    if (errorEl) errorEl.textContent = '';
  }

  function markSuccess(inputEl) {
    if (inputEl) { inputEl.classList.remove('error'); inputEl.classList.add('success'); }
  }

  function isValidMobile(val) { return /^[6-9]\d{9}$/.test(val.trim()); }
  function isValidPassword(val) { return val.length >= 6; }
  function isValidName(val) { return val.trim().length >= 2; }


  /* ---- LOGIN FORM ---- */
  const loginForm       = document.getElementById('loginForm');
  const loginMobileInput  = document.getElementById('loginMobile');
  const loginPasswordInput = document.getElementById('loginPassword');
  const loginMobileError  = document.getElementById('loginMobileError');
  const loginPasswordError = document.getElementById('loginPasswordError');
  const loginSubmitBtn  = document.getElementById('loginSubmitBtn');

  // Real-time validation
  if (loginMobileInput) {
    loginMobileInput.addEventListener('input', () => {
      // Allow digits only
      loginMobileInput.value = loginMobileInput.value.replace(/\D/g, '');
      clearError(loginMobileInput, loginMobileError);
      if (loginMobileInput.value.length === 10) {
        if (isValidMobile(loginMobileInput.value)) markSuccess(loginMobileInput);
        else showError(loginMobileInput, loginMobileError, 'Enter a valid 10-digit mobile number');
      }
    });
  }

  if (loginPasswordInput) {
    loginPasswordInput.addEventListener('input', () => {
      clearError(loginPasswordInput, loginPasswordError);
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Validate mobile
      if (!loginMobileInput.value || !isValidMobile(loginMobileInput.value)) {
        showError(loginMobileInput, loginMobileError, 'Enter a valid 10-digit mobile number');
        valid = false;
      } else {
        clearError(loginMobileInput, loginMobileError);
        markSuccess(loginMobileInput);
      }

      // Validate password
      if (!loginPasswordInput.value || !isValidPassword(loginPasswordInput.value)) {
        showError(loginPasswordInput, loginPasswordError, 'Password must be at least 6 characters');
        valid = false;
      } else {
        clearError(loginPasswordInput, loginPasswordError);
        markSuccess(loginPasswordInput);
      }

      if (!valid) return;

      // Show loading state
      loginSubmitBtn.classList.add('loading');
      loginSubmitBtn.disabled = true;

      // Simulate API call — replace with real fetch
      setTimeout(() => {
        loginSubmitBtn.classList.remove('loading');
        loginSubmitBtn.disabled = false;
        // On success redirect:
        window.location.href = 'index.html';
      }, 1500);
    });
  }


  /* ---- REGISTER FORM ---- */
  const registerForm    = document.getElementById('registerForm');
  const regNameInput    = document.getElementById('regName');
  const regMobileInput  = document.getElementById('regMobile');
  const regGenderInput  = document.getElementById('regGender');
  const regDOBInput     = document.getElementById('regDOB');
  const regPasswordInput2 = document.getElementById('regPassword');
  const regTermsInput   = document.getElementById('regTerms');
  const regNameError    = document.getElementById('regNameError');
  const regMobileError  = document.getElementById('regMobileError');
  const regGenderError  = document.getElementById('regGenderError');
  const regDOBError     = document.getElementById('regDOBError');
  const regPasswordError = document.getElementById('regPasswordError');
  const regTermsError   = document.getElementById('regTermsError');
  const registerSubmitBtn = document.getElementById('registerSubmitBtn');

  if (regMobileInput) {
    regMobileInput.addEventListener('input', () => {
      regMobileInput.value = regMobileInput.value.replace(/\D/g, '');
      clearError(regMobileInput, regMobileError);
      if (regMobileInput.value.length === 10) {
        if (isValidMobile(regMobileInput.value)) markSuccess(regMobileInput);
        else showError(regMobileInput, regMobileError, 'Enter a valid mobile number starting with 6-9');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      if (!regNameInput.value || !isValidName(regNameInput.value)) {
        showError(regNameInput, regNameError, 'Please enter your full name');
        valid = false;
      } else { clearError(regNameInput, regNameError); markSuccess(regNameInput); }

      if (!regMobileInput.value || !isValidMobile(regMobileInput.value)) {
        showError(regMobileInput, regMobileError, 'Enter a valid 10-digit mobile number');
        valid = false;
      } else { clearError(regMobileInput, regMobileError); markSuccess(regMobileInput); }

      if (!regGenderInput.value) {
        showError(regGenderInput, regGenderError, 'Please select your gender');
        valid = false;
      } else { clearError(regGenderInput, regGenderError); markSuccess(regGenderInput); }

      if (!regDOBInput.value) {
        showError(regDOBInput, regDOBError, 'Please enter your date of birth');
        valid = false;
      } else {
        // Age check — must be 18+
        const dob  = new Date(regDOBInput.value);
        const age  = Math.floor((Date.now() - dob) / 31557600000);
        if (age < 18) {
          showError(regDOBInput, regDOBError, 'You must be at least 18 years old');
          valid = false;
        } else { clearError(regDOBInput, regDOBError); markSuccess(regDOBInput); }
      }

      if (!regPasswordInput2.value || !isValidPassword(regPasswordInput2.value)) {
        showError(regPasswordInput2, regPasswordError, 'Password must be at least 6 characters');
        valid = false;
      } else { clearError(regPasswordInput2, regPasswordError); markSuccess(regPasswordInput2); }

      if (!regTermsInput.checked) {
        showError(null, regTermsError, 'You must agree to the Terms & Conditions');
        valid = false;
      } else { clearError(null, regTermsError); }

      if (!valid) return;

      registerSubmitBtn.classList.add('loading');
      registerSubmitBtn.disabled = true;

      // Simulate API call — replace with real fetch
      setTimeout(() => {
        registerSubmitBtn.classList.remove('loading');
        registerSubmitBtn.disabled = false;
        // On success redirect:
        window.location.href = 'index.html';
      }, 1800);
    });
  }


  /* ---- LUCIDE ICONS ---- */
  if (typeof lucide !== 'undefined') lucide.createIcons();
  else window.addEventListener('load', () => { if (typeof lucide !== 'undefined') lucide.createIcons(); });

})();