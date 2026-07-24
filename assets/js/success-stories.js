/* =========================================
   success-stories.js — HimRishtey
   ========================================= */

(function () {
  'use strict';

  // ---- Mock data — replace with real API call ----
  const MOCK_STORIES = [
    {
      id: 1,
      groom_name: 'Rahul Sharma',
      bride_name: 'Priya Verma',
      detail: 'We matched on HimRishtey in January 2023. After a few conversations we knew we were meant for each other. Got married in April 2023 in Shimla. Thank you HimRishtey!',
      photo: 'https://picsum.photos/seed/couple1/500/500'
    },
    {
      id: 2,
      groom_name: 'Amit Thakur',
      bride_name: 'Seema Chauhan',
      detail: 'HimRishtey helped us connect despite living in different districts. The platform was easy and trustworthy. We are happily married since November 2023.',
      photo: 'https://picsum.photos/seed/couple2/500/500'
    },
    {
      id: 3,
      groom_name: 'Vikram Rana',
      bride_name: 'Anita Negi',
      detail: 'I had almost given up on matrimonial apps until a friend suggested HimRishtey. Found my perfect match within two weeks. Now married and settled in Dharamshala.',
      photo: 'https://picsum.photos/seed/couple3/500/500'
    },
    {
      id: 4,
      groom_name: 'Suresh Kashyap',
      bride_name: 'Rekha Dogra',
      detail: 'Verified profiles and genuine people — that is what sets HimRishtey apart. We met through the app in 2024 and tied the knot in June. Eternally grateful.',
      photo: 'https://picsum.photos/seed/couple4/500/500'
    },
    {
      id: 5,
      groom_name: 'Deepak Chandel',
      bride_name: 'Kavita Pathak',
      detail: 'Our families were hesitant at first but HimRishtey\'s community focus won their trust. We are so happy to have found each other here.',
      photo: 'https://picsum.photos/seed/couple5/500/500'
    },
    {
      id: 6,
      groom_name: 'Naresh Pal',
      bride_name: 'Sunita Minhas',
      detail: 'A simple registration, a few matches, and life changed forever. HimRishtey made finding a life partner feel natural and stress free.',
      photo: 'https://picsum.photos/seed/couple6/500/500'
    }
  ];

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    loadStories();
    initAddStoryModal();
    initLightbox();
  });

  // =============================================
  // LOAD STORIES
  // =============================================
  function loadStories() {
    const skeleton = document.getElementById('ssSkeleton');
    const grid     = document.getElementById('ssGrid');
    const empty    = document.getElementById('ssEmpty');

    // Simulate API delay
    setTimeout(() => {
      const stories = MOCK_STORIES; // swap for real API data

      if (skeleton) skeleton.setAttribute('hidden', '');

      if (!stories || stories.length === 0) {
        if (empty) empty.removeAttribute('hidden');
        return;
      }

      if (grid) {
        grid.removeAttribute('hidden');
        grid.innerHTML = '';
        stories.forEach(story => grid.appendChild(buildStoryCard(story)));
      }

      if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 850);
  }

  // =============================================
  // BUILD STORY CARD
  // =============================================
  function buildStoryCard(story) {
    const article = document.createElement('article');
    article.className = 'ss-card';
    article.setAttribute('role', 'listitem');
    article.setAttribute('tabindex', '0');
    article.setAttribute('aria-label', `Story of ${story.groom_name} and ${story.bride_name}`);

    article.innerHTML = `
      <div class="ss-card-img-wrap">
        <img
          class="ss-card-img"
          src="${story.photo}"
          alt="Wedding photo of ${story.groom_name} and ${story.bride_name}"
          width="500" height="500"
          loading="lazy"
        />
        <div class="ss-card-img-overlay" aria-hidden="true">
          <i data-lucide="heart" width="14" height="14"></i>
          Read Story
        </div>
      </div>
      <div class="ss-card-body">
        <div class="ss-card-hearts" aria-hidden="true">
          <i data-lucide="heart" width="14" height="14" class="ss-card-heart"></i>
          <div class="ss-card-divider"></div>
          <i data-lucide="heart" width="14" height="14" class="ss-card-heart"></i>
        </div>
        <h3 class="ss-card-couple">${story.groom_name} &amp; ${story.bride_name}</h3>
        <p class="ss-card-detail">${story.detail}</p>
        <button class="ss-card-read-more" data-id="${story.id}" aria-label="Read full story of ${story.groom_name} and ${story.bride_name}">
          <i data-lucide="book-open" width="14" height="14"></i>
          Read more
        </button>
      </div>
    `;

    // Click on card or button → open lightbox
    article.addEventListener('click', () => openLightbox(story));
    article.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(story); }
    });

    return article;
  }

  // =============================================
  // ADD STORY MODAL
  // =============================================
  function initAddStoryModal() {
    const overlay    = document.getElementById('ssModalOverlay');
    const addBtn     = document.getElementById('ssAddStoryBtn');
    const emptyBtn   = document.getElementById('ssEmptyAddBtn');
    const closeBtn   = document.getElementById('ssModalClose');
    const cancelBtn  = document.getElementById('ssModalCancel');
    const form       = document.getElementById('ssStoryForm');
    const photoInput = document.getElementById('ssPhotoInput');
    const uploadZone = document.getElementById('ssUploadZone');
    const preview    = document.getElementById('ssUploadPreview');
    const removBtn   = document.getElementById('ssUploadRemove');
    const placeholder = document.getElementById('ssUploadPlaceholder');
    const textarea   = document.getElementById('ssStoryText');
    const charCount  = document.getElementById('ssCharCount');
    const errorEl    = document.getElementById('ssFormError');

    let base64Image = '';

    function openModal() {
      overlay.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function closeModal() {
      overlay.setAttribute('hidden', '');
      document.body.style.overflow = '';
      form?.reset();
      base64Image = '';
      resetUpload();
      if (errorEl) errorEl.setAttribute('hidden', '');
      if (charCount) { charCount.textContent = '0 / 500'; charCount.classList.remove('warn'); }
    }

    function resetUpload() {
      if (preview)     { preview.setAttribute('hidden', ''); preview.src = ''; }
      if (removBtn)    removBtn.setAttribute('hidden', '');
      if (placeholder) placeholder.style.display = '';
      if (uploadZone)  uploadZone.classList.remove('has-image');
    }

    addBtn?.addEventListener('click', openModal);
    emptyBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    overlay?.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay && !overlay.hidden) closeModal();
    });

    // Photo upload
    photoInput?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        showToast('Photo must be under 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = ev => {
        base64Image = ev.target.result.split(',')[1]; // base64 only
        if (preview)     { preview.src = ev.target.result; preview.removeAttribute('hidden'); }
        if (removBtn)    removBtn.removeAttribute('hidden');
        if (placeholder) placeholder.style.display = 'none';
        if (uploadZone)  uploadZone.classList.add('has-image');
      };
      reader.readAsDataURL(file);
    });

    // Remove photo
    removBtn?.addEventListener('click', e => {
      e.stopPropagation();
      if (photoInput) photoInput.value = '';
      base64Image = '';
      resetUpload();
    });

    // Character counter
    textarea?.addEventListener('input', () => {
      const len = textarea.value.length;
      if (charCount) {
        charCount.textContent = `${len} / 500`;
        charCount.classList.toggle('warn', len > 450);
      }
      if (len > 500) textarea.value = textarea.value.slice(0, 500);
    });

    // Form submit
    form?.addEventListener('submit', async e => {
      e.preventDefault();
      const groom = document.getElementById('ssGroomName')?.value.trim();
      const bride = document.getElementById('ssBrideName')?.value.trim();
      const desc  = document.getElementById('ssStoryText')?.value.trim();

      if (!groom || !bride || !desc || !base64Image) {
        if (errorEl) errorEl.removeAttribute('hidden');
        return;
      }
      if (errorEl) errorEl.setAttribute('hidden', '');

      setSubmitting(true);

      // TODO: Replace with real API call
      await fakeSubmit({ groom_name: groom, bride_name: bride, description: desc, image: base64Image });

      setSubmitting(false);
      closeModal();
      showToast('Thanks! Your story has been submitted and will be reviewed soon. 💕');
    });

    function setSubmitting(state) {
      const label  = document.querySelector('.ss-btn-label');
      const loader = document.querySelector('.ss-btn-loader');
      const btn    = document.getElementById('ssSubmitBtn');
      if (label)  state ? label.setAttribute('hidden', '') : label.removeAttribute('hidden');
      if (loader) state ? loader.removeAttribute('hidden') : loader.setAttribute('hidden', '');
      if (btn)    btn.disabled = state;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }

  // Simulate API POST
  function fakeSubmit(data) {
    console.log('Submitting story:', data);
    return new Promise(resolve => setTimeout(resolve, 1500));
  }

  // =============================================
  // LIGHTBOX
  // =============================================
  function initLightbox() {
    const lightbox  = document.getElementById('ssLightbox');
    const backdrop  = document.getElementById('ssLightboxBackdrop');
    const closeBtn  = document.getElementById('ssLightboxClose');

    function close() {
      lightbox.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }

    closeBtn?.addEventListener('click', close);
    backdrop?.addEventListener('click', close);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lightbox && !lightbox.hidden) close();
    });
  }

  function openLightbox(story) {
    const lightbox  = document.getElementById('ssLightbox');
    const img       = document.getElementById('ssLightboxImg');
    const couple    = document.getElementById('ssLightboxCouple');
    const detail    = document.getElementById('ssLightboxDetail');

    if (!lightbox) return;

    if (img)    { img.src = story.photo; img.alt = `${story.groom_name} and ${story.bride_name}`; }
    if (couple) couple.textContent = `${story.groom_name} & ${story.bride_name}`;
    if (detail) detail.textContent = story.detail;

    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // =============================================
  // TOAST
  // =============================================
  function showToast(msg) {
    const toast = document.getElementById('ssToast');
    const msgEl = document.getElementById('ssToastMsg');
    if (!toast || !msgEl) return;
    msgEl.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

})();