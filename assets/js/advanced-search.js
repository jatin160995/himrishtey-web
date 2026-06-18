
    // ===== INIT LUCIDE =====
    lucide.createIcons();

   

    // ===== SIDEBAR =====
    const sidebar = document.getElementById('mainSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    document.getElementById('sidebarToggle').addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('active'); });
    document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
    function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('active'); }

    // ===== DATA =====
    const DATA = {
      religion: ['Hindu', 'Sikh', 'Christian', 'Buddhist', 'Muslim'],
      community: ['Brahmin','Agarwal','Bhandari','Arora','Aryasamaj','Bahi','Bhatia','Chaudhary - Ghirth','Dhiman - Vishwakarma','Gaddi','Garhwali Rajput','Goswami','Gujjar','Gupta','Jaat','Kamboj','Kashmiri Pandit (Brahmin)','Kashyap','Kayasth','Khatri','Koli','Kshatriya','Labana','Lingayat','Lohana','Lohar','Maratha','Marwari','Mehra','Nai - Barbar','Naidu','Nair','Punjabi','Rajput','Rana','Rawat','Reddy','Saini','Scheduled Caste','Sindhi','Sood','Vaishnav','Valmiki','Yadav','Any','Other'],
      tongue: ['Punjabi', 'Hindi', 'Himachali/Pahadi', 'Marathi'],
      state: ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttarakhand','Uttar Pradesh','West Bengal','Chandigarh','Delhi','Puducherry'],
      education: ['10th / Matric','12th / Intermediate','ITI','Diploma','B.A.','B.Com.','B.Sc.','BCA','BBA','B.Tech / BE','MBBS','B.Ed','LLB','CA / CS / ICWA','MBA','M.A.','M.Sc.','MCA','M.Tech / ME','MD / MS (Medical)','Ph.D.','Any'],
      employed: ['Govt Job', 'Private', 'Defence', 'Business', 'Self Employed', 'Not Employed']
    };

    // ===== STATE =====
    const selected = { religion: [], community: [], tongue: [], state: [], education: [], employed: [] };

    // ===== INIT DROPDOWNS =====
    Object.keys(DATA).forEach(key => {
      renderList(key, DATA[key]);
      document.getElementById('trigger-' + key).addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDd(key);
      });
    });

    // Backdrop close
    document.getElementById('advBackdrop').addEventListener('click', () => {
      Object.keys(DATA).forEach(k => closeDd(k));
    });

    function toggleDd(key) {
      const isOpen = document.getElementById('dd-' + key).classList.contains('open');
      Object.keys(DATA).forEach(k => closeDd(k));
      if (!isOpen) openDd(key);
    }

    function openDd(key) {
      document.getElementById('dd-' + key).classList.add('open');
      document.getElementById('trigger-' + key).setAttribute('aria-expanded', 'true');
      document.getElementById('advBackdrop').classList.add('active');
    }

    function closeDd(key) {
      document.getElementById('dd-' + key).classList.remove('open');
      document.getElementById('trigger-' + key).setAttribute('aria-expanded', 'false');
      document.getElementById('advBackdrop').classList.remove('active');
    }

    function renderList(key, items) {
      const list = document.getElementById('list-' + key);
      list.innerHTML = items.map(item => `
        <div class="adv-option ${selected[key].includes(item) ? 'selected' : ''}"
             role="option" aria-selected="${selected[key].includes(item)}"
             tabindex="0"
             onclick="toggleOption('${key}', '${item.replace(/'/g, "\\'")}')"
             onkeydown="if(event.key==='Enter'||event.key===' ')toggleOption('${key}', '${item.replace(/'/g, "\\'")}')">
          <span class="adv-option-text">${item}</span>
          <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>`).join('');
    }

    function filterOptions(key, query) {
      const filtered = DATA[key].filter(i => i.toLowerCase().includes(query.toLowerCase()));
      renderList(key, filtered);
    }

    function toggleOption(key, value) {
      const idx = selected[key].indexOf(value);
      if (idx > -1) selected[key].splice(idx, 1);
      else selected[key].push(value);
      renderList(key, DATA[key]);
      renderChips(key);
      updateSummary();
    }

    function clearField(key) {
      selected[key] = [];
      renderList(key, DATA[key]);
      renderChips(key);
      updateSummary();
    }

    function renderChips(key) {
      const wrap = document.getElementById('chips-' + key);
      if (selected[key].length === 0) {
        wrap.innerHTML = '<span class="adv-placeholder-txt" style="color:var(--color-text-faint);">' + getPlaceholder(key) + '</span>';
        document.getElementById('trigger-' + key).classList.remove('has-value');
      } else {
        wrap.innerHTML = selected[key].map(v =>
          `<span class="adv-chip">${v}<button class="adv-chip-remove" onclick="event.stopPropagation();toggleOption('${key}','${v.replace(/'/g, "\\'")}')" aria-label="Remove ${v}">×</button></span>`
        ).join('');
        document.getElementById('trigger-' + key).classList.add('has-value');
      }
    }

    function getPlaceholder(key) {
      const map = { religion: 'Select religion', community: 'Select community', tongue: 'Select tongue', state: 'Select state', education: 'Select education', employed: 'Select employment' };
      return map[key] || 'Select...';
    }

    // ===== DUAL RANGE SLIDERS =====
    function initRange(minId, maxId, displayMinId, displayMaxId, fillId, formatFn) {
      const minInput = document.getElementById(minId);
      const maxInput = document.getElementById(maxId);
      const fillEl = document.getElementById(fillId);

      function update() {
        let minVal = parseInt(minInput.value);
        let maxVal = parseInt(maxInput.value);
        if (minVal > maxVal) { if (this === minInput) minInput.value = maxVal; else maxInput.value = minVal; }
        minVal = parseInt(minInput.value); maxVal = parseInt(maxInput.value);
        const min = parseInt(minInput.min), max = parseInt(minInput.max);
        const left = ((minVal - min) / (max - min)) * 100;
        const right = ((maxVal - min) / (max - min)) * 100;
        fillEl.style.left = left + '%';
        fillEl.style.width = (right - left) + '%';
        document.getElementById(displayMinId).textContent = formatFn(minVal, 'min');
        document.getElementById(displayMaxId).textContent = formatFn(maxVal, 'max');
        updateSummary();
      }
      minInput.addEventListener('input', update);
      maxInput.addEventListener('input', update);
      update.call(minInput);
    }

    initRange('ageMin','ageMax','ageMinDisplay','ageMaxDisplay','ageFill', (v) => v);
    initRange('htMin','htMax','htMinDisplay','htMaxDisplay','htFill', (v) => (v / 10).toFixed(1));
    initRange('incMin','incMax','incMinDisplay','incMaxDisplay','incFill', (v) => v);

    // ===== SUMMARY UPDATE =====
    function updateSummary() {
      const row = document.getElementById('activeFiltersRow');
      const noMsg = document.getElementById('noFiltersMsg');
      const chips = [];

      const ageMin = document.getElementById('ageMin').value, ageMax = document.getElementById('ageMax').value;
      if (ageMin != 18 || ageMax != 70) chips.push(`Age: ${ageMin}–${ageMax} yrs`);

      const htMin = document.getElementById('htMin').value, htMax = document.getElementById('htMax').value;
      if (htMin != 46 || htMax != 70) chips.push(`Height: ${(htMin/10).toFixed(1)}–${(htMax/10).toFixed(1)} ft`);

      const incMin = document.getElementById('incMin').value, incMax = document.getElementById('incMax').value;
      if (incMin != 0 || incMax != 50) chips.push(`Income: ₹${incMin}L–₹${incMax}L`);

      const pid = document.getElementById('profileId').value.trim();
      if (pid) chips.push(`ID: ${pid}`);

      const manglik = document.querySelector('input[name="manglik"]:checked')?.value;
      if (manglik) chips.push(`Manglik: ${manglik}`);

      const marital = document.querySelector('input[name="maritalStatus"]:checked')?.value;
      if (marital) chips.push(marital);

      Object.keys(selected).forEach(key => {
        selected[key].forEach(v => chips.push(v));
      });

      if (chips.length === 0) {
        row.innerHTML = '<span class="adv-empty-filters" id="noFiltersMsg">No filters applied yet</span>';
      } else {
        row.innerHTML = chips.map(c => `<span class="adv-active-filter">${c}</span>`).join('');
      }
    }

    // Update summary on radio change
    document.querySelectorAll('input[name="manglik"], input[name="maritalStatus"]').forEach(r => r.addEventListener('change', updateSummary));
    document.getElementById('profileId').addEventListener('input', updateSummary);

    // ===== SEARCH =====
    function doSearch() {
      const params = {};
      const pid = document.getElementById('profileId').value.trim();
      if (pid) params.profile_id = pid;
      params.age_from = document.getElementById('ageMin').value;
      params.age_to = document.getElementById('ageMax').value;
      params.height_from = (document.getElementById('htMin').value / 10).toFixed(1);
      params.height_to = (document.getElementById('htMax').value / 10).toFixed(1);
      params.annual_income = document.getElementById('incMin').value;
      params.annual_income_to = document.getElementById('incMax').value;
      const manglik = document.querySelector('input[name="manglik"]:checked')?.value;
      if (manglik) params.manglik = manglik;
      const marital = document.querySelector('input[name="maritalStatus"]:checked')?.value;
      if (marital) params.marital_status = marital;
      if (selected.religion.length) params.religion = selected.religion.join(',');
      if (selected.community.length) params.cast = selected.community.join(',');
      if (selected.tongue.length) params.mother_tongue = selected.tongue.join(',');
      if (selected.state.length) params.state_name = selected.state.join(',');
      if (selected.education.length) params.education = selected.education.join(',');
      if (selected.employed.length) params.employed_in = selected.employed.join(',');

      console.log('Search params:', params);
      // Navigate: window.location.href = 'search-results.html?' + new URLSearchParams(params).toString();
      alert('Search triggered! Check console for params. Wire to: search-results.html?' + new URLSearchParams(params).toString());
    }

    // ===== RESET =====
    function resetAll() {
      document.getElementById('profileId').value = '';
      document.getElementById('ageMin').value = 18; document.getElementById('ageMax').value = 70;
      document.getElementById('htMin').value = 46; document.getElementById('htMax').value = 70;
      document.getElementById('incMin').value = 0; document.getElementById('incMax').value = 50;
      document.querySelector('input[name="manglik"][value=""]').checked = true;
      document.querySelector('input[name="maritalStatus"][value=""]').checked = true;
      Object.keys(selected).forEach(key => { selected[key] = []; renderChips(key); renderList(key, DATA[key]); });
      // Re-init sliders
      initRange('ageMin','ageMax','ageMinDisplay','ageMaxDisplay','ageFill', (v) => v);
      initRange('htMin','htMax','htMinDisplay','htMaxDisplay','htFill', (v) => (v / 10).toFixed(1));
      initRange('incMin','incMax','incMinDisplay','incMaxDisplay','incFill', (v) => v);
      updateSummary();
    }
