document.addEventListener('DOMContentLoaded', () => {
  // 0. Landing Page Header Reveal Logic
  const mainHeader = document.querySelector('.header');
  const enterPortalBtn = document.getElementById('enterPortalBtn');

  if (mainHeader && document.body.classList.contains('landing-page')) {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        mainHeader.classList.add('revealed');
      } else {
        mainHeader.classList.remove('revealed');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    if (enterPortalBtn) {
      enterPortalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        mainHeader.classList.add('revealed');
        const groupsSec = document.getElementById('groupsSection');
        if (groupsSec) {
          groupsSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  // 1. Theme Toggle (Dark Mode / Light Mode)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const htmlEl = document.documentElement;

  const savedTheme = localStorage.getItem('tnpsc_theme') || 'light';
  htmlEl.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('tnpsc_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
      themeIcon.style.color = '#f59e0b';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
      themeIcon.style.color = '';
    }
  }

  // 2. Mobile Nav Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      if (mainHeader) mainHeader.classList.add('revealed');
      navLinks.classList.toggle('active');
    });
  }

  // 3. Tab Switcher Helper Function
  window.switchTab = function (event, tabId) {
    if (event) event.preventDefault();
    const parentContainer = event ? event.target.closest('.page-main-content') || document : document;
    
    const tabs = parentContainer.querySelectorAll('.tab-btn');
    const contents = parentContainer.querySelectorAll('.tab-content');

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    if (event && event.target) {
      const targetBtn = event.target.closest('.tab-btn') || event.target;
      targetBtn.classList.add('active');
    }

    const targetContent = document.getElementById(tabId);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  };

  // 4. Live Search Filter for Homepage Exam Group Cards
  const groupSearchInput = document.getElementById('groupSearchInput');
  if (groupSearchInput) {
    groupSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.group-card');
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(q)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 5. Global Download Handler
  window.downloadResource = function (id, fileName, filePath) {
    fetch(`/api/resources/${id}/download`, { method: 'POST' })
      .catch(err => console.error(err));

    const target = filePath || `/uploads/${fileName || 'Group4_General_Tamil_Complete_Notes.pdf'}`;
    const link = document.createElement('a');
    link.href = target;
    link.download = target.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 6. Dynamic Groups Loader (Fallback to pre-rendered HTML cards if API takes time)
  const groupsCardsGrid = document.getElementById('groupsCardsGrid');
  if (groupsCardsGrid && groupsCardsGrid.children.length === 0) {
    fetch('/api/groups')
      .then(res => res.json())
      .then(groups => {
        if (!groups || groups.length === 0) return;
        groupsCardsGrid.innerHTML = '';
        groups.forEach(g => {
          const card = document.createElement('div');
          card.className = 'group-card';
          const badgeColor = g.badge === 'High Level' ? 'badge-primary' : (g.badge === 'Popular' ? 'badge-gold' : 'badge-outline');
          card.innerHTML = `
            <div class="group-card-header">
              <div>
                <h3 class="group-code">${g.code}</h3>
                <div class="group-name">${g.name}</div>
              </div>
              <span class="group-badge ${badgeColor}">${g.badge || 'Official'}</span>
            </div>
            <p class="group-summary">${g.subtitle || ''}</p>

            <ul class="group-meta-list">
              <li class="meta-item"><i class="fa-solid fa-gauge-high meta-icon"></i> <span><strong>Difficulty:</strong> ${g.difficulty || 'Moderate'}</span></li>
              <li class="meta-item"><i class="fa-solid fa-graduation-cap meta-icon"></i> <span><strong>Qualification:</strong> ${g.qualification || 'Any Degree'}</span></li>
              <li class="meta-item"><i class="fa-solid fa-layer-group meta-icon"></i> <span><strong>Pattern:</strong> ${g.pattern ? g.pattern.split('\n')[0] : 'Written Examination'}</span></li>
            </ul>

            <div class="group-card-footer">
              <a href="/${g.id}" class="btn btn-primary" style="width:100%;">
                Explore ${g.code} Details <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          `;
          groupsCardsGrid.appendChild(card);
        });
      })
      .catch(err => console.error('Error loading groups:', err));
  }

  // 7. Load Community Uploads Preview on Homepage
  const resourcesGrid = document.getElementById('resourcesGrid');
  if (resourcesGrid) {
    fetch('/api/resources')
      .then(res => res.json())
      .then(resources => {
        if (!resources || resources.length === 0) return;
        resourcesGrid.innerHTML = '';
        resources.slice(0, 4).forEach(r => {
          const card = document.createElement('div');
          card.className = 'resource-card';
          card.innerHTML = `
            <div class="resource-top">
              <span class="resource-type-tag">${r.type}</span>
              <span style="font-size:0.8rem; font-weight:600; color:var(--brand-gold);"><i class="fa-solid fa-tag"></i> ${r.group}</span>
            </div>
            <h4 class="resource-title">${r.title}</h4>
            <div class="resource-uploader"><i class="fa-solid fa-user-pen"></i> By <strong>${r.uploadedBy}</strong></div>
            <p class="resource-desc">${r.description || ''}</p>
            <div class="resource-footer">
              <div class="download-count"><i class="fa-solid fa-download"></i> ${r.downloads || 0} downloads</div>
              <button class="btn btn-outline" style="padding:0.35rem 0.8rem; font-size:0.82rem;" onclick="window.downloadResource('${r.id}', '${r.fileName}', '${r.filePath || ''}')">
                <i class="fa-solid fa-file-arrow-down"></i> View / Download
              </button>
            </div>
          `;
          resourcesGrid.appendChild(card);
        });
      })
      .catch(err => console.error('Error loading resources preview:', err));
  }

  // 8. Eligibility Checker Tool
  const checkEligibilityBtn = document.getElementById('checkEligibilityBtn');
  if (checkEligibilityBtn) {
    checkEligibilityBtn.addEventListener('click', () => {
      const qual = document.getElementById('eligibilityQualSelect').value;
      const age = parseInt(document.getElementById('eligibilityAgeInput').value) || 21;
      const resultBox = document.getElementById('eligibilityResultBox');
      
      let eligibleGroups = [];

      if (qual === 'sslc') {
        eligibleGroups = ['Group 4 (VAO & Junior Assistant)', 'Group 7B & 8 (Executive Officer Grade IV)'];
      } else if (qual === 'hsc' || qual === 'diploma') {
        eligibleGroups = ['Group 3 (Junior Inspector)', 'Group 4 (VAO)', 'Group 5A (Secretariat Assistant)', 'Group 7B & 8'];
      } else if (qual === 'degree') {
        eligibleGroups = ['Group 1 (Deputy Collector / DSP)', 'Group 2 & 2A (Sub-Registrar / Senior Inspector)', 'Group 3', 'Group 4', 'Group 5A', 'Group 6 (Forest Apprentice)', 'Group 7B & 8'];
      } else if (qual === 'law' || qual === 'agama') {
        eligibleGroups = ['Group 1', 'Group 2 & 2A', 'Group 7A (Executive Officer Grade I)', 'Group 7B & 8', 'Group 3', 'Group 4'];
      }

      resultBox.innerHTML = `
        <div style="background:var(--bg-primary); border:2px solid var(--brand-primary); padding:1.25rem; border-radius:12px; margin-top:1rem;">
          <h4 style="color:var(--brand-primary); margin-bottom:0.5rem;"><i class="fa-solid fa-circle-check"></i> Eligible Exam Groups for You:</h4>
          <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:0.75rem;">Based on <strong>${qual.toUpperCase()}</strong> qualification and <strong>Age ${age}</strong>:</p>
          <ul style="padding-left:1.25rem; font-weight:600;">
            ${eligibleGroups.map(g => `<li style="margin-bottom:0.35rem;">🎯 ${g}</li>`).join('')}
          </ul>
        </div>
      `;
    });
  }

  // 9. Interactive Quiz Widget
  window.submitQuizAnswer = function (btn, isCorrect, explanation) {
    const parent = btn.closest('.quiz-card');
    const options = parent.querySelectorAll('.quiz-option-btn');
    options.forEach(o => o.disabled = true);

    const feedback = parent.querySelector('.quiz-feedback');
    if (isCorrect) {
      btn.style.background = '#10b981';
      btn.style.color = '#ffffff';
      feedback.innerHTML = `<span style="color:#10b981; font-weight:700;">✅ Correct!</span> ${explanation}`;
    } else {
      btn.style.background = '#ef4444';
      btn.style.color = '#ffffff';
      feedback.innerHTML = `<span style="color:#ef4444; font-weight:700;">❌ Incorrect.</span> ${explanation}`;
    }
  };
});
