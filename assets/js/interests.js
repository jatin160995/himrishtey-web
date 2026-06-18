/* ================================================================
   INTERESTS PAGE — interests.js
   Mirrors: lib/screens/dashboardScreens/interests.dart
   Mode:    Received (default) | Sent
   Tabs:    Pending | Accepted | Rejected
   ================================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     MOCK DATA — mirrors allInterests from controller
     Keys match Flutter: received_interest, sentInterest,
     acceptedInterest, accepted_sent_interest,
     rejectedInterest, rejected_sent_interest
  ---------------------------------------------------------------- */
  const ALL_INTERESTS = {
    received_interest: [
      { id:'HR-20011', name:'Rahul Sharma',    age:29, height:"5'10\"", location:'Shimla, HP',      occupation:'Software Engineer', religion:'Hindu',  education:'B.Tech',  verified:true,  online:true,  seed:'m01', sentDate:'2 days ago'  },
      { id:'HR-20012', name:'Amit Thakur',     age:31, height:"5'11\"", location:'Manali, HP',      occupation:'Doctor',           religion:'Hindu',  education:'MBBS',    verified:true,  online:false, seed:'m02', sentDate:'3 days ago'  },
      { id:'HR-20013', name:'Rohan Verma',     age:28, height:"5'9\"",  location:'Dharamshala, HP', occupation:'CA',               religion:'Hindu',  education:'CA',      verified:false, online:true,  seed:'m03', sentDate:'5 days ago'  },
      { id:'HR-20014', name:'Vikas Negi',      age:30, height:"6'0\"",  location:'Kullu, HP',       occupation:'IAS Officer',       religion:'Hindu',  education:'UPSC',    verified:true,  online:false, seed:'m04', sentDate:'1 week ago'  },
      { id:'HR-20015', name:'Suresh Kumar',    age:27, height:"5'8\"",  location:'Mandi, HP',       occupation:'Engineer',          religion:'Hindu',  education:'B.E',     verified:false, online:true,  seed:'m05', sentDate:'1 week ago'  },
      { id:'HR-20016', name:'Deepak Chauhan',  age:32, height:"5'10\"", location:'Solan, HP',       occupation:'Banker',            religion:'Hindu',  education:'MBA',     verified:true,  online:true,  seed:'m06', sentDate:'2 weeks ago' },
    ],
    sentInterest: [
      { id:'HR-20021', name:'Karan Mehta',     age:29, height:"5'10\"", location:'Chandigarh',      occupation:'Architect',         religion:'Hindu',  education:'B.Arch',  verified:true,  online:true,  seed:'m11', sentDate:'1 day ago'   },
      { id:'HR-20022', name:'Ajay Singh',      age:30, height:"5'11\"", location:'Shimla, HP',      occupation:'Govt. Officer',     religion:'Sikh',   education:'BA',      verified:false, online:false, seed:'m12', sentDate:'4 days ago'  },
      { id:'HR-20023', name:'Mohit Pathak',    age:28, height:"5'9\"",  location:'Baddi, HP',       occupation:'Pharmacist',        religion:'Hindu',  education:'B.Pharma',verified:false, online:true,  seed:'m13', sentDate:'6 days ago'  },
    ],
    acceptedInterest: [
      { id:'HR-20031', name:'Naveen Rawat',    age:30, height:"5'10\"", location:'Bilaspur, HP',    occupation:'Lawyer',            religion:'Hindu',  education:'LLB',     verified:true,  online:true,  seed:'m21', sentDate:'3 days ago'  },
      { id:'HR-20032', name:'Arjun Bhatia',    age:28, height:"5'11\"", location:'Palampur, HP',    occupation:'Teacher',           religion:'Hindu',  education:'B.Ed',    verified:true,  online:false, seed:'m22', sentDate:'1 week ago'  },
    ],
    accepted_sent_interest: [
      { id:'HR-20041', name:'Sachin Devi',     age:29, height:"5'10\"", location:'Hamirpur, HP',    occupation:'Engineer',          religion:'Hindu',  education:'B.E',     verified:false, online:true,  seed:'m31', sentDate:'5 days ago'  },
    ],
    rejectedInterest: [
      { id:'HR-20051', name:'Praveen Gupta',   age:33, height:"5'8\"",  location:'Una, HP',         occupation:'Businessman',       religion:'Hindu',  education:'MBA',     verified:false, online:false, seed:'m41', sentDate:'2 weeks ago' },
    ],
    rejected_sent_interest: [],
  };

  /* ----------------------------------------------------------------
     STATE
  ---------------------------------------------------------------- */
  let currentMode = 'received'; // 'received' | 'sent'
  let currentTab  = 'pending';  // 'pending'  | 'accepted' | 'rejected'

  /* ----------------------------------------------------------------
     DOM REFS
  ---------------------------------------------------------------- */
  const btnReceived   = document.getElementById('btnReceived');
  const btnSent       = document.getElementById('btnSent');

  const tabs = {
    pending:  document.getElementById('tabPending'),
    accepted: document.getElementById('tabAccepted'),
    rejected: document.getElementById('tabRejected'),
  };
  const panels = {
    pending:  document.getElementById('panelPending'),
    accepted: document.getElementById('panelAccepted'),
    rejected: document.getElementById('panelRejected'),
  };
  const grids = {
    pending:  document.getElementById('gridPending'),
    accepted: document.getElementById('gridAccepted'),
    rejected: document.getElementById('gridRejected'),
  };
  const empties = {
    pending:  document.getElementById('emptyPending'),
    accepted: document.getElementById('emptyAccepted'),
    rejected: document.getElementById('emptyRejected'),
  };
  const skels = {
    pending:  document.getElementById('skelPending'),
    accepted: document.getElementById('skelAccepted'),
    rejected: document.getElementById('skelRejected'),
  };
  const badges = {
    pending:  document.getElementById('badgePending'),
    accepted: document.getElementById('badgeAccepted'),
    rejected: document.getElementById('badgeRejected'),
  };
  const counts = {
    pending:  document.getElementById('cntPending'),
    accepted: document.getElementById('cntAccepted'),
    rejected: document.getElementById('cntRejected'),
  };

  const toastEl    = document.getElementById('intToast');
  const toastIcon  = document.getElementById('intToastIcon');
  const toastMsg   = document.getElementById('intToastMsg');

  /* ----------------------------------------------------------------
     Get dataset key for current mode + tab
  ---------------------------------------------------------------- */
  function getKey(mode, tab) {
    const map = {
      received: {
        pending:  'received_interest',
        accepted: 'acceptedInterest',
        rejected: 'rejectedInterest',
      },
      sent: {
        pending:  'sentInterest',
        accepted: 'accepted_sent_interest',
        rejected: 'rejected_sent_interest',
      },
    };
    return map[mode][tab];
  }

  /* ----------------------------------------------------------------
     Build profile card HTML — same pattern as index.html
  ---------------------------------------------------------------- */
  function buildCard(profile, tab, delay) {
    const article = document.createElement('article');
    article.className = 'profile-card int-animate';
    if (tab === 'rejected') article.classList.add('is-rejected');
    article.setAttribute('role', 'listitem');
    article.setAttribute('tabindex', '0');
    article.setAttribute('aria-label', profile.name + ', ' + profile.age);
    article.style.animationDelay = delay + 'ms';

    const imgUrl = 'https://picsum.photos/seed/' + profile.seed + '/220/280';

    const verifiedIcon = profile.verified
      ? '<i data-lucide="shield-check" width="13" height="13" class="verified-icon"></i>'
      : '';

    const onlineDot = profile.online
      ? '<span class="profile-card-online" aria-label="Online now"></span>'
      : '';

    const statusLabelMap = { pending: 'Pending', accepted: 'Accepted', rejected: 'Rejected' };
    const statusBadge =
      '<span class="profile-card-status-badge ' + tab + '">' + statusLabelMap[tab] + '</span>';

    /* Accept / Reject buttons — only for received-pending */
    const actionBtns = (tab === 'pending' && currentMode === 'received')
      ? '<div class="int-card-actions">' +
          '<button class="int-action-btn accept" data-id="' + profile.id + '" aria-label="Accept interest from ' + profile.name + '">' +
            '<i data-lucide="check" width="12" height="12"></i> Accept' +
          '</button>' +
          '<button class="int-action-btn reject" data-id="' + profile.id + '" aria-label="Reject interest from ' + profile.name + '">' +
            '<i data-lucide="x" width="12" height="12"></i> Decline' +
          '</button>' +
        '</div>'
      : '';

    article.innerHTML =
      '<div class="profile-card-img-wrap">' +
        '<img src="' + imgUrl + '" alt="' + profile.name + ', ' + profile.age + '" width="220" height="280" loading="lazy" class="profile-card-img" />' +
        onlineDot +
        statusBadge +
      '</div>' +
      '<div class="profile-card-body">' +
        '<h3 class="profile-card-name">' + profile.name + verifiedIcon + '</h3>' +
        '<p class="profile-card-meta"><i data-lucide="map-pin" width="12" height="12"></i> ' + profile.location + '</p>' +
        '<p class="profile-card-meta"><i data-lucide="briefcase" width="12" height="12"></i> ' + profile.occupation + ' • ' + profile.age + ' yrs</p>' +
        '<p class="profile-card-meta"><i data-lucide="clock" width="12" height="12"></i> ' + profile.sentDate + '</p>' +
        '<div class="profile-card-tags">' +
          '<span class="pct">' + profile.religion + '</span>' +
          '<span class="pct">' + profile.height   + '</span>' +
          '<span class="pct">' + profile.education + '</span>' +
        '</div>' +
      '</div>' +
      actionBtns;

    /* Card click → profile detail */
    article.addEventListener('click', function (e) {
      if (e.target.closest('.int-action-btn')) return; // let button handle
      window.location.href = 'profile-detail.html?id=' + encodeURIComponent(profile.id);
    });

    article.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        window.location.href = 'profile-detail.html?id=' + encodeURIComponent(profile.id);
      }
    });

    /* Accept button */
    const acceptBtn = article.querySelector('.int-action-btn.accept');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        handleAction(profile.id, 'accept', article);
      });
    }

    /* Reject button */
    const rejectBtn = article.querySelector('.int-action-btn.reject');
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        handleAction(profile.id, 'reject', article);
      });
    }

    return article;
  }

  /* ----------------------------------------------------------------
     Accept / Reject action
  ---------------------------------------------------------------- */
  function handleAction(profileId, action, cardEl) {
    /* Optimistic UI — remove from pending, add to accepted/rejected */
    const key     = getKey('received', 'pending');
    const dataset = ALL_INTERESTS[key];
    const idx     = dataset.findIndex(function (p) { return p.id === profileId; });
    if (idx === -1) return;

    const [profile] = dataset.splice(idx, 1);

    if (action === 'accept') {
      ALL_INTERESTS.acceptedInterest.unshift(profile);
      showToast('✅', profile.name + ' interest accepted!');
    } else {
      ALL_INTERESTS.rejectedInterest.unshift(profile);
      showToast('❌', 'Interest from ' + profile.name + ' declined.');
    }

    /* Animate card out */
    cardEl.style.transition = 'opacity 200ms ease, transform 200ms ease';
    cardEl.style.opacity    = '0';
    cardEl.style.transform  = 'scale(0.93)';
    setTimeout(function () {
      renderTab(currentTab);
      updateBadgesAndCounts();
    }, 220);
  }

  /* ----------------------------------------------------------------
     Render a tab panel
  ---------------------------------------------------------------- */
  function renderTab(tab) {
    const key      = getKey(currentMode, tab);
    const profiles = (ALL_INTERESTS[key] || []).slice().reverse();
    const grid     = grids[tab];
    const empty    = empties[tab];
    const skel     = skels[tab];

    if (grid)  grid.innerHTML  = '';
    if (skel)  skel.style.display = 'none';

    if (!profiles.length) {
      if (empty) empty.style.display  = '';
      return;
    }

    if (empty) empty.style.display = 'none';

    profiles.forEach(function (profile, i) {
      const card = buildCard(profile, tab, i * 45);
      grid.appendChild(card);
    });

    if (window.lucide) lucide.createIcons({ nodes: [grid] });
  }

  /* ----------------------------------------------------------------
     Update badge counts + summary chips
  ---------------------------------------------------------------- */
  function updateBadgesAndCounts() {
    const tabKeys = {
      pending:  getKey(currentMode, 'pending'),
      accepted: getKey(currentMode, 'accepted'),
      rejected: getKey(currentMode, 'rejected'),
    };

    ['pending', 'accepted', 'rejected'].forEach(function (tab) {
      const n = (ALL_INTERESTS[tabKeys[tab]] || []).length;
      if (badges[tab]) badges[tab].textContent = n;
      if (counts[tab]) counts[tab].textContent = n;
    });
  }

  /* ----------------------------------------------------------------
     Switch mode: Received ↔ Sent
  ---------------------------------------------------------------- */
  function setMode(mode) {
    currentMode = mode;

    btnReceived.classList.toggle('active', mode === 'received');
    btnReceived.setAttribute('aria-pressed', mode === 'received');
    btnSent.classList.toggle('active', mode === 'sent');
    btnSent.setAttribute('aria-pressed', mode === 'sent');

    /* Update empty-state copy */
    const isPending  = document.getElementById('emptyPendingMsg');
    const isAccepted = document.getElementById('emptyAcceptedMsg');
    const isRejected = document.getElementById('emptyRejectedMsg');

    if (mode === 'received') {
      if (isPending)  isPending.textContent  = 'You have no pending interest requests right now.';
      if (isAccepted) isAccepted.textContent = 'Accepted matches will appear here.';
      if (isRejected) isRejected.textContent = 'Declined requests will appear here.';
    } else {
      if (isPending)  isPending.textContent  = 'You haven\'t sent any interest requests yet.';
      if (isAccepted) isAccepted.textContent = 'Interests you sent that were accepted will appear here.';
      if (isRejected) isRejected.textContent = 'Interests you sent that were declined will appear here.';
    }

    updateBadgesAndCounts();
    renderTab(currentTab);
  }

  /* ----------------------------------------------------------------
     Switch active tab
  ---------------------------------------------------------------- */
  function setTab(tab) {
    currentTab = tab;

    Object.keys(tabs).forEach(function (t) {
      const isActive = t === tab;
      tabs[t].classList.toggle('active', isActive);
      tabs[t].setAttribute('aria-selected', isActive);
      if (panels[t]) {
        if (isActive) {
          panels[t].removeAttribute('hidden');
        } else {
          panels[t].setAttribute('hidden', '');
        }
      }
    });

    renderTab(tab);
  }

  /* ----------------------------------------------------------------
     Toast helper
  ---------------------------------------------------------------- */
  let toastTimer = null;

  function showToast(icon, msg) {
    if (!toastEl) return;
    toastIcon.textContent = icon;
    toastMsg.textContent  = msg;
    toastEl.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('show');
    }, 3000);
  }

  /* ----------------------------------------------------------------
     Simulate initial loading (skeleton → data)
  ---------------------------------------------------------------- */
  function initialLoad() {
    /* Skeletons are already visible in HTML for pending tab.
       Simulate a short API delay then render. */
    setTimeout(function () {
      if (skels.pending) skels.pending.style.display = 'none';
      updateBadgesAndCounts();
      renderTab('pending');
      if (window.lucide) lucide.createIcons();
    }, 700);
  }

  /* ----------------------------------------------------------------
     EVENT LISTENERS
  ---------------------------------------------------------------- */
  if (btnReceived) {
    btnReceived.addEventListener('click', function () { setMode('received'); });
  }
  if (btnSent) {
    btnSent.addEventListener('click', function () { setMode('sent'); });
  }

  Object.keys(tabs).forEach(function (t) {
    if (tabs[t]) {
      tabs[t].addEventListener('click', function () { setTab(t); });
    }
  });

  /* ----------------------------------------------------------------
     INIT
  ---------------------------------------------------------------- */
  function init() {
    if (window.lucide) lucide.createIcons();
    initialLoad();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();