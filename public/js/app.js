document.addEventListener('DOMContentLoaded', () => {
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

  // 4. Download Resource Helper
  window.downloadResource = function (id, fileName) {
    alert(`Downloading file: ${fileName || 'Sample_Study_Material.pdf'}\nResource ID: ${id}`);
  };

  // 5. Global Search Functionality
  const searchInput = document.getElementById('globalSearchInput');
  const searchBtn = document.getElementById('globalSearchBtn');

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }

  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      alert('Please enter a search keyword (e.g. Group 4, Unit 8, Polity, Syllabus)');
      return;
    }
    if (query.includes('group 4') || query.includes('vao') || query.includes('496')) {
      window.location.href = '/group4';
    } else if (query.includes('group 1')) {
      window.location.href = '/group1';
    } else if (query.includes('group 2')) {
      window.location.href = '/group2';
    } else if (query.includes('group 3')) {
      window.location.href = '/group3';
    } else if (query.includes('syllabus')) {
      window.location.href = '/syllabus';
    } else if (query.includes('previous') || query.includes('pyq') || query.includes('paper')) {
      window.location.href = '/previous-papers';
    } else {
      window.location.href = `/resources?search=${encodeURIComponent(query)}`;
    }
  }

  // 6. Homepage Groups Grid Renderer for ALL 8 GROUPS
  const groupsCardsGrid = document.getElementById('groupsCardsGrid');
  if (groupsCardsGrid) {
    fetch('/api/groups')
      .then(res => res.json())
      .then(groups => {
        if (!groups || groups.length === 0) return;
        groupsCardsGrid.innerHTML = '';
        
        groups.forEach(g => {
          const card = document.createElement('div');
          card.className = 'group-card';

          const badgeColor = g.id === 'group1' ? 'premier' :
                           g.id === 'group2' ? 'demand' :
                           g.id === 'group4' ? 'premier' : 'info';

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
              <button class="btn btn-outline" style="padding:0.35rem 0.8rem; font-size:0.82rem;" onclick="window.downloadResource('${r.id}', '${r.fileName}')">
                <i class="fa-solid fa-file-arrow-down"></i> View / Download
              </button>
            </div>
          `;
          resourcesGrid.appendChild(card);
        });
      })
      .catch(err => console.error('Error loading resources preview:', err));
  }
});
