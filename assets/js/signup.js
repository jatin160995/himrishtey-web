/* ============================================================
   HimRishtey — Signup Wizard Script
   Mirrors Flutter: SignUpTwo (step1) -> SignUpThree (step2)
   -> SignUpFour (step3) -> SignupUploadPic (photo) -> SignupSuccess
   ============================================================ */

(function () {
  'use strict';

  /* ---- THEME TOGGLE (same as other pages) ---- */
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


  /* ============================================================
     GEO DATA — Country -> State -> City (seed data + free typing)
     Swap these arrays out for live API calls (state_url / city_url)
     when the backend is wired up.
     ============================================================ */
  const INDIA_STATES = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
    "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
    "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands",
    "Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi",
    "Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
  ];

  const CITY_MAP = {
    "Himachal Pradesh": ["Shimla","Kangra","Mandi","Solan","Una","Hamirpur","Bilaspur","Chamba","Kullu","Sirmaur","Kinnaur","Lahaul and Spiti"],
    "Punjab": ["Ludhiana","Amritsar","Jalandhar","Patiala","Mohali","Bathinda"],
    "Chandigarh": ["Chandigarh"],
    "Delhi": ["New Delhi","Dwarka","Rohini","Karol Bagh","Saket"],
    "Haryana": ["Gurugram","Faridabad","Panchkula","Ambala","Karnal"],
    "Maharashtra": ["Mumbai","Pune","Nagpur","Nashik","Thane"],
    "Uttarakhand": ["Dehradun","Haridwar","Nainital","Rishikesh"],
    "Karnataka": ["Bengaluru","Mysuru","Mangaluru"]
  };

  const countryInput  = document.getElementById('country');
  const stateInput    = document.getElementById('state');
  const cityInput     = document.getElementById('city');
  const stateList     = document.getElementById('stateList');
  const cityList      = document.getElementById('cityList');

  function fillDatalist(listEl, values) {
    listEl.innerHTML = '';
    values.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      listEl.appendChild(opt);
    });
  }

  function populateStates() {
    const country = countryInput.value;
    if (country === 'India') {
      fillDatalist(stateList, INDIA_STATES);
      stateInput.placeholder = 'Select or type your state';
    } else {
      fillDatalist(stateList, []);
      stateInput.placeholder = 'Enter your state / province';
    }
    stateInput.value = '';
    cityInput.value = '';
    cityInput.disabled = true;
    cityInput.placeholder = 'Select state first';
    fillDatalist(cityList, []);
  }

  function populateCities() {
    const state = stateInput.value.trim();
    if (!state) {
      cityInput.disabled = true;
      cityInput.placeholder = 'Select state first';
      fillDatalist(cityList, []);
      return;
    }
    cityInput.disabled = false;
    cityInput.value = '';
    const cities = CITY_MAP[state];
    if (cities) {
      fillDatalist(cityList, cities);
      cityInput.placeholder = 'Select or type your city';
    } else {
      fillDatalist(cityList, []);
      cityInput.placeholder = 'Enter your city';
    }
  }

  if (countryInput) {
    populateStates(); // init for default "India"
    countryInput.addEventListener('change', populateStates);
    stateInput.addEventListener('change', populateCities);
    stateInput.addEventListener('blur', populateCities);
  }


  /* ============================================================
     WIZARD STATE
     ============================================================ */
  const STORAGE_KEY      = 'hrSignupData';
  const STORAGE_STEP_KEY = 'hrSignupStep';

  function loadState() {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveState(data) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  }
  let signupData = loadState();

  const stepper       = document.getElementById('suStepper');
  const stepperZone    = document.getElementById('suStepperZone');
  const stepCaption    = document.getElementById('suStepCaption');
  const steps          = [...document.querySelectorAll('.su-step')];
  const panels         = [...document.querySelectorAll('.su-panel')];

  const CAPTIONS = {
    1: 'Add some information about yourself',
    2: 'Let us know a little more about you',
    3: 'We are almost done'
  };

  function showPanel(panelName) {
    panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === String(panelName)));

    const isNumberedStep = ['1', '2', '3'].includes(String(panelName));
    stepperZone.style.display = isNumberedStep ? '' : 'none';

    if (isNumberedStep) {
      steps.forEach(s => {
        const idx = Number(s.dataset.stepIndex);
        s.classList.remove('is-active', 'is-complete');
        if (idx < Number(panelName)) s.classList.add('is-complete');
        else if (idx === Number(panelName)) s.classList.add('is-active');
      });
      stepCaption.textContent = CAPTIONS[panelName] || '';
    } else {
      // Photo + Success: mark all 3 steps complete
      steps.forEach(s => { s.classList.remove('is-active'); s.classList.add('is-complete'); });
    }

    sessionStorage.setItem(STORAGE_STEP_KEY, String(panelName));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function showError(inputEl, errorEl, message) {
    if (inputEl) inputEl.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }
  function clearError(inputEl, errorEl) {
    if (inputEl) inputEl.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  }

  function setLoading(btn, isLoading) {
    btn.classList.toggle('loading', isLoading);
    btn.disabled = isLoading;
  }

  /* Simulated network delay — replace with real fetch() to the
     corresponding signupStepTwo / signupStepThree / signupStepFour
     endpoints when the backend is connected. */
  function fakeSubmit(callback) {
    setTimeout(callback, 900);
  }


  /* ============================================================
     STEP 1 — ABOUT YOU
     ============================================================ */
  const stepForm1 = document.getElementById('stepForm1');
  const tobInput    = document.getElementById('tob');
  const heightInput = document.getElementById('height');

  stepForm1.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    if (!tobInput.value) {
      showError(tobInput, document.getElementById('tobError'), 'Please enter time of birth');
      valid = false;
    } else clearError(tobInput, document.getElementById('tobError'));

    if (!heightInput.value) {
      showError(heightInput, document.getElementById('heightError'), 'Please select your height');
      valid = false;
    } else clearError(heightInput, document.getElementById('heightError'));

    if (!countryInput.value) {
      showError(countryInput, document.getElementById('countryError'), 'Please select a country');
      valid = false;
    } else clearError(countryInput, document.getElementById('countryError'));

    if (!stateInput.value.trim()) {
      showError(stateInput, document.getElementById('stateError'), 'Please enter your state');
      valid = false;
    } else clearError(stateInput, document.getElementById('stateError'));

    if (!cityInput.value.trim()) {
      showError(cityInput, document.getElementById('cityError'), 'Please enter your city');
      valid = false;
    } else clearError(cityInput, document.getElementById('cityError'));

    if (!valid) return;

    const btn = document.getElementById('step1SubmitBtn');
    setLoading(btn, true);
    fakeSubmit(() => {
      setLoading(btn, false);
      Object.assign(signupData, {
        time_of_birth: tobInput.value,
        height: heightInput.value,
        country: countryInput.value,
        state: stateInput.value.trim(),
        city: cityInput.value.trim(),
        profile_completed: 30
      });
      saveState(signupData);
      showPanel(2);
    });
  });


  /* ============================================================
     STEP 2 — CAREER
     ============================================================ */
  const stepForm2      = document.getElementById('stepForm2');
  const educationInput = document.getElementById('education');
  const employedInput  = document.getElementById('employedIn');
  const occupationGroup = document.getElementById('occupationGroup');
  const occupationInput = document.getElementById('occupation');
  const incomeInput    = document.getElementById('income');

  function syncOccupationVisibility() {
    const notEmployed = employedInput.value === 'Not Employed in';
    occupationGroup.style.display = notEmployed ? 'none' : '';
    occupationInput.required = !notEmployed;
    if (notEmployed) {
      occupationInput.value = '';
      clearError(occupationInput, document.getElementById('occupationError'));
    }
  }
  employedInput.addEventListener('change', syncOccupationVisibility);
  syncOccupationVisibility();

  stepForm2.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    if (!educationInput.value) {
      showError(educationInput, document.getElementById('educationError'), 'Please select your education');
      valid = false;
    } else clearError(educationInput, document.getElementById('educationError'));

    if (!employedInput.value) {
      showError(employedInput, document.getElementById('employedInError'), 'Please select your employment type');
      valid = false;
    } else clearError(employedInput, document.getElementById('employedInError'));

    if (occupationInput.required && !occupationInput.value.trim()) {
      showError(occupationInput, document.getElementById('occupationError'), 'Please enter your occupation');
      valid = false;
    } else clearError(occupationInput, document.getElementById('occupationError'));

    if (!incomeInput.value) {
      showError(incomeInput, document.getElementById('incomeError'), 'Please select your annual income');
      valid = false;
    } else clearError(incomeInput, document.getElementById('incomeError'));

    if (!valid) return;

    const btn = document.getElementById('step2SubmitBtn');
    setLoading(btn, true);
    fakeSubmit(() => {
      setLoading(btn, false);
      Object.assign(signupData, {
        education: educationInput.value,
        employed_in: employedInput.value,
        occupation: employedInput.value === 'Not Employed in' ? '' : occupationInput.value.trim(),
        annual_income: incomeInput.value,
        profile_completed: 60
      });
      saveState(signupData);
      showPanel(3);
    });
  });


  /* ============================================================
     STEP 3 — COMMUNITY
     ============================================================ */
  const stepForm3    = document.getElementById('stepForm3');
  const maritalInput = document.getElementById('marital');
  const childrenGroup = document.getElementById('childrenGroup');
  const childrenInput = document.getElementById('children');
  const tongueInput  = document.getElementById('tongue');
  const religionInput = document.getElementById('religion');
  const castInput    = document.getElementById('cast');

  function syncChildrenVisibility() {
    const neverMarried = maritalInput.value === 'Never Married';
    childrenGroup.hidden = neverMarried || !maritalInput.value;
    childrenInput.required = !childrenGroup.hidden;
    if (childrenGroup.hidden) {
      childrenInput.value = '';
      clearError(childrenInput, document.getElementById('childrenError'));
    }
  }
  maritalInput.addEventListener('change', syncChildrenVisibility);
  syncChildrenVisibility();

  stepForm3.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    if (!maritalInput.value) {
      showError(maritalInput, document.getElementById('maritalError'), 'Please select your marital status');
      valid = false;
    } else clearError(maritalInput, document.getElementById('maritalError'));

    if (childrenInput.required && !childrenInput.value) {
      showError(childrenInput, document.getElementById('childrenError'), 'Please select number of children');
      valid = false;
    } else clearError(childrenInput, document.getElementById('childrenError'));

    if (!tongueInput.value) {
      showError(tongueInput, document.getElementById('tongueError'), 'Please select your mother tongue');
      valid = false;
    } else clearError(tongueInput, document.getElementById('tongueError'));

    if (!religionInput.value) {
      showError(religionInput, document.getElementById('religionError'), 'Please select your religion');
      valid = false;
    } else clearError(religionInput, document.getElementById('religionError'));

    if (!castInput.value) {
      showError(castInput, document.getElementById('castError'), 'Please select your cast');
      valid = false;
    } else clearError(castInput, document.getElementById('castError'));

    const manglikChecked = document.querySelector('input[name="manglik"]:checked');
    if (!manglikChecked) {
      document.getElementById('manglikError').textContent = 'Please select an option';
      valid = false;
    } else document.getElementById('manglikError').textContent = '';

    const horoscopeChecked = document.querySelector('input[name="horoscope"]:checked');
    if (!horoscopeChecked) {
      document.getElementById('horoscopeError').textContent = 'Please select an option';
      valid = false;
    } else document.getElementById('horoscopeError').textContent = '';

    if (!valid) return;

    const btn = document.getElementById('step3SubmitBtn');
    setLoading(btn, true);
    fakeSubmit(() => {
      setLoading(btn, false);
      Object.assign(signupData, {
        marital_status: maritalInput.value,
        no_of_child: childrenInput.required ? childrenInput.value : '0',
        mother_tongue: tongueInput.value,
        religion: religionInput.value,
        cast: castInput.value,
        is_manglik: manglikChecked.value,
        horoscope_needed: horoscopeChecked.value,
        profile_completed: 90
      });
      saveState(signupData);
      // In the real app, step 3 completing silently logs the user in
      // (see Flutter SignUpFour.loginRequest()) before moving on.
      showPanel('photo');
    });
  });


  /* ============================================================
     BACK BUTTONS (step2 & step3 only — step1 links to login.html)
     ============================================================ */
  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = Number(btn.closest('.su-panel').dataset.panel);
      showPanel(current - 1);
    });
  });


  /* ============================================================
     PHOTO UPLOAD
     ============================================================ */
  const photoInput     = document.getElementById('photoInput');
  const photoPreview    = document.getElementById('photoPreview');
  const photoPlaceholder = document.getElementById('photoPlaceholder');
  const continuePhotoBtn = document.getElementById('continuePhotoBtn');
  const skipPhotoBtn    = document.getElementById('skipPhotoBtn');

  photoInput.addEventListener('change', () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      document.getElementById('photoError').textContent = 'Please choose an image file';
      return;
    }
    document.getElementById('photoError').textContent = '';
    const url = URL.createObjectURL(file);
    photoPreview.src = url;
    photoPreview.hidden = false;
    photoPlaceholder.hidden = true;
    continuePhotoBtn.disabled = false;
  });

  function finishSignup(hasPhoto) {
    signupData.profile_completed = 100;
    signupData.has_photo = !!hasPhoto;
    saveState(signupData);

    const nameEl = document.getElementById('successName');
    if (signupData.full_name) nameEl.textContent = ', ' + signupData.full_name.split(' ')[0];

    showPanel('success');

    // Signup complete — clear the temporary wizard state.
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_STEP_KEY);
  }

  skipPhotoBtn.addEventListener('click', () => finishSignup(false));

  continuePhotoBtn.addEventListener('click', () => {
    setLoading(continuePhotoBtn, true);
    fakeSubmit(() => {
      setLoading(continuePhotoBtn, false);
      finishSignup(true);
    });
  });


  /* ============================================================
     RESUME MID-FLOW (e.g. after a refresh)
     ============================================================ */
  (function resume() {
    const savedStep = sessionStorage.getItem(STORAGE_STEP_KEY);
    if (savedStep && ['1','2','3','photo','success'].includes(savedStep) && savedStep !== '1') {
      // Re-populate fields we can safely restore, then jump to the step.
      if (signupData.country) countryInput.value = signupData.country;
      populateStates();
      if (signupData.state) stateInput.value = signupData.state;
      populateCities();
      if (signupData.city) cityInput.value = signupData.city;
      if (signupData.time_of_birth) tobInput.value = signupData.time_of_birth;
      if (signupData.height) heightInput.value = signupData.height;

      if (signupData.education) educationInput.value = signupData.education;
      if (signupData.employed_in) employedInput.value = signupData.employed_in;
      syncOccupationVisibility();
      if (signupData.occupation) occupationInput.value = signupData.occupation;
      if (signupData.annual_income) incomeInput.value = signupData.annual_income;

      showPanel(savedStep === '1' ? 1 : savedStep);
    }
  })();


  /* ---- LUCIDE ICONS ---- */
  if (typeof lucide !== 'undefined') lucide.createIcons();
  else window.addEventListener('load', () => { if (typeof lucide !== 'undefined') lucide.createIcons(); });

})();