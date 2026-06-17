/* profile-detail.js — Profile Detail page logic
   Dark/light mode is handled by script.js (already loaded globally) */

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();

  initCarousel();
  initGallery();
  initLikeShortlist();
  initBottomBar();
});

/* ── CAROUSEL ── */
function initCarousel() {
  const slides = document.querySelectorAll(".pd-slide");
  const dotsContainer = document.getElementById("slideDots");
  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");
  let current = 0;
  let autoTimer;

  if (!slides.length) return;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "pd-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Photo ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    slides[current].classList.remove("active");
    dotsContainer.children[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    dotsContainer.children[current].classList.add("active");
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  prevBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    stopAuto();
    goTo(current - 1);
    startAuto();
  });

  nextBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    stopAuto();
    goTo(current + 1);
    startAuto();
  });

  // Swipe support
  let touchStartX = 0;
  const carousel = document.getElementById("heroCarousel");
  carousel?.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  carousel?.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) {
      stopAuto();
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      startAuto();
    }
  });

  startAuto();
}

/* ── GALLERY LIGHTBOX ── */
function initGallery() {
  const overlay = document.getElementById("galleryOverlay");
  const closeBtn = document.getElementById("galleryClose");
  const galleryBtn = document.getElementById("galleryBtn");

  galleryBtn?.addEventListener("click", openGallery);
  closeBtn?.addEventListener("click", closeGallery);
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeGallery();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeGallery();
      closeUnlockModal();
      closeReportSheet();
    }
  });
}

function openGallery() {
  const overlay = document.getElementById("galleryOverlay");
  overlay?.classList.add("open");
  overlay?.setAttribute("aria-hidden", "false");
  if (window.lucide) window.lucide.createIcons();
}

function closeGallery() {
  const overlay = document.getElementById("galleryOverlay");
  overlay?.classList.remove("open");
  overlay?.setAttribute("aria-hidden", "true");
}

/* ── LIKE & SHORTLIST (hero fabs) ── */
function initLikeShortlist() {
  const likeBtn = document.getElementById("likeBtn");
  const shortlistBtn = document.getElementById("shortlistBtn");

  likeBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    likeBtn.classList.toggle("active");
    showToast(likeBtn.classList.contains("active") ? "❤️ Liked!" : "Like removed");
    if (window.lucide) window.lucide.createIcons();
  });

  shortlistBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    shortlistBtn.classList.toggle("active");
    showToast(shortlistBtn.classList.contains("active") ? "🔖 Shortlisted!" : "Removed from shortlist");
  });
}

/* ── SHORTLIST (aside card) ── */
function toggleShortlist() {
  const btn = document.getElementById("asideShortlistBtn");
  const heroBtn = document.getElementById("shortlistBtn");
  if (!btn) return;
  const isSaved = btn.classList.toggle("saved");
  if (heroBtn) heroBtn.classList.toggle("active", isSaved);
  btn.innerHTML = isSaved
    ? `<i data-lucide="bookmark-check" width="17" height="17"></i> Shortlisted`
    : `<i data-lucide="bookmark" width="17" height="17"></i> Shortlist`;
  if (window.lucide) window.lucide.createIcons();
  showToast(isSaved ? "🔖 Shortlisted!" : "Removed from shortlist");
}

/* ── INTEREST ACTIONS ── */
let interestState = "none"; // none | sent | received | matched | rejected

function handleInterestAction() {
  if (interestState === "none") {
    interestState = "sent";
    updateInterestUI();
    showToast("✅ Interest sent!");
  } else if (interestState === "sent") {
    if (confirm("Delete the interest you sent?")) {
      interestState = "none";
      updateInterestUI();
      showToast("Interest deleted");
    }
  }
}

function handleReject() {
  interestState = "rejected";
  updateInterestUI();
  showToast("Interest rejected");
}

function updateInterestUI() {
  const sendBtn = document.getElementById("sendInterestBtn");
  const bottomBtn = document.getElementById("bottomInterestBtn");
  const bottomLabel = document.getElementById("bottomInterestLabel");
  const rejectBtn = document.getElementById("rejectBtn");

  const states = {
    none: {
      label: "Send Interest",
      icon: "send",
      color: "",
      showReject: false,
    },
    sent: {
      label: "Interest Sent — Delete?",
      icon: "clock",
      color: "#ea580c",
      showReject: false,
    },
    received: {
      label: "Accept Interest",
      icon: "check",
      color: "#16a34a",
      showReject: true,
    },
    matched: {
      label: "Matched ❤️",
      icon: "heart",
      color: "#D92768",
      showReject: false,
    },
    rejected: {
      label: "Rejected",
      icon: "x-circle",
      color: "#dc2626",
      showReject: false,
    },
  };

  const s = states[interestState] || states.none;

  if (sendBtn) {
    sendBtn.style.background = s.color || "var(--color-primary, #D92768)";
    sendBtn.innerHTML = `<i data-lucide="${s.icon}" width="17" height="17"></i> ${s.label}`;
  }
  if (bottomBtn) {
    bottomBtn.style.background = s.color || "var(--color-primary, #D92768)";
  }
  if (bottomLabel) bottomLabel.textContent = s.label;
  if (rejectBtn) rejectBtn.style.display = s.showReject ? "flex" : "none";

  if (window.lucide) window.lucide.createIcons();
}

/* ── BOTTOM BAR (scroll-show logic) ── */
function initBottomBar() {
  // Already always visible on mobile via CSS — no JS needed for basic show
}

/* ── UNLOCK MODAL ── */
let currentUnlockType = null;

function openUnlockModal(type) {
  currentUnlockType = type;
  const overlay = document.getElementById("unlockModalOverlay");
  const title = document.getElementById("unlockModalTitle");
  if (title) title.textContent = type === "contact" ? "Unlock Contact Details" : "Unlock Kundli Details";
  overlay?.classList.add("open");
  overlay?.setAttribute("aria-hidden", "false");
}

function closeUnlockModal() {
  const overlay = document.getElementById("unlockModalOverlay");
  overlay?.classList.remove("open");
  overlay?.setAttribute("aria-hidden", "true");
}

function confirmUnlock() {
  closeUnlockModal();
  if (currentUnlockType === "contact") {
    // Reveal contact info (replace locked values with dummy for demo)
    const mVal = document.getElementById("mobileValue");
    const waVal = document.getElementById("waValue");
    const emailVal = document.getElementById("emailValue");
    if (mVal) {
      mVal.classList.remove("pd-locked");
      mVal.innerHTML = "+91 98765 04567";
    }
    if (waVal) {
      waVal.classList.remove("pd-locked");
      waVal.innerHTML = "+91 98765 04567";
    }
    if (emailVal) {
      emailVal.classList.remove("pd-locked");
      emailVal.innerHTML = "rahul.thakur@gmail.com";
    }
    document.getElementById("contactUnlock")?.remove();
    document.querySelectorAll(".pd-row-lock").forEach(el => el.remove());
    showToast("🔓 Contact details unlocked!");
  } else if (currentUnlockType === "kundli") {
    const tob = document.getElementById("tobValue");
    const pob = document.getElementById("pobValue");
    if (tob) {
      tob.classList.remove("pd-locked");
      tob.innerHTML = "10:32 AM";
    }
    if (pob) {
      pob.classList.remove("pd-locked");
      pob.innerHTML = "Mandi, Himachal Pradesh";
    }
    document.getElementById("kundliUnlock")?.remove();
    showToast("🔓 Kundli details unlocked!");
  }
}

/* ── REPORT SHEET ── */
document.getElementById("reportBtn")?.addEventListener("click", openReportSheet);

function openReportSheet() {
  const overlay = document.getElementById("reportSheetOverlay");
  overlay?.classList.add("open");
  overlay?.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeReportSheet() {
  const overlay = document.getElementById("reportSheetOverlay");
  overlay?.classList.remove("open");
  overlay?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.getElementById("reportSheetOverlay")?.addEventListener("click", (e) => {
  if (e.target === document.getElementById("reportSheetOverlay")) closeReportSheet();
});

function submitReport(btn) {
  closeReportSheet();
  showToast("✅ Report submitted. Thank you!");
}

/* ── SHARE ── */
document.getElementById("shareBtn")?.addEventListener("click", shareProfile);

function shareProfile() {
  if (navigator.share) {
    navigator.share({
      title: "Rahul Thakur – HimRishtey",
      text: "Rahul Thakur | 28 yrs | Software Engineer | Mandi, HP",
      url: window.location.href,
    }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      showToast("🔗 Profile link copied!");
    });
  }
}

function shareToWhatsApp() {
  const text = encodeURIComponent(
    "*Rahul Thakur* \nCreated by Self\n28 years\nProfile id - HR-20489\nHindu | Rajput | Mandi\n\nAbout: Looking for a suitable Himachali life partner."
  );
  window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
}

/* ── TOAST ── */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("pdToast");
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}