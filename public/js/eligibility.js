/**
 * TNPSC Eligibility & PSTM Calculator Module
 * Author: Antigravity AI
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('eligibilityForm');
  const resultsContainer = document.getElementById('eligibilityResults');

  if (!form || !resultsContainer) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateEligibility();
  });

  // Also auto recalculate on input change
  form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('change', calculateEligibility);
  });

  function calculateEligibility() {
    const age = parseInt(document.getElementById('eligibilityAge').value) || 0;
    const qual = document.getElementById('eligibilityQual').value;
    const cat = document.getElementById('eligibilityCategory').value;
    const pstm = document.getElementById('eligibilityPstm').value === 'yes';

    if (age <= 0) {
      resultsContainer.innerHTML = `<div class="eligibility-placeholder"><i class="fa-solid fa-calculator" style="font-size:2rem; color:var(--brand-accent);"></i><p>Please enter your valid age to check eligible TNPSC cadres.</p></div>`;
      return;
    }

    const isReserved = cat !== 'OC';
    const eligibleGroups = [];

    // 1. Group 4 & VAO (Code 496)
    if (qual !== 'none') {
      const maxAgeG4 = isReserved ? 37 : 32;
      const minAge = 18;
      if (age >= minAge && age <= maxAgeG4) {
        eligibleGroups.push({
          id: 'group4',
          title: 'Group 4 & VAO (Code: 496)',
          badge: '10th SSLC Minimum',
          badgeClass: 'badge-emerald',
          link: '/group4',
          desc: 'Village Administrative Officer (VAO), Junior Assistant, Typist & Steno-Typist.',
          pstmNote: pstm ? '✅ 20% PSTM Quota Applicable (10th Tamil Medium Pass)' : 'ℹ️ Standard Non-PSTM quota'
        });
      }
    }

    // 2. Group 3 & 3A
    if (qual === '12th' || qual === 'degree' || qual === 'pg') {
      const maxAgeG3 = isReserved ? 37 : 32;
      if (age >= 18 && age <= maxAgeG3) {
        eligibleGroups.push({
          id: 'group3',
          title: 'Group 3 & 3A (Subordinate)',
          badge: '12th HSC / Diploma',
          badgeClass: 'badge-blue',
          link: '/group3',
          desc: 'Junior Inspector of Cooperative Societies & Store-Keeper cadres.',
          pstmNote: pstm ? '✅ 20% PSTM Quota Applicable' : 'ℹ️ Standard Non-PSTM quota'
        });
      }
    }

    // 3. Group 2 & 2A (CCS II)
    if (qual === 'degree' || qual === 'pg') {
      const maxAgeG2 = isReserved ? 60 : 32; // BC/MBC/SC/ST have no upper age limit for degree posts
      if (age >= 18 && age <= maxAgeG2) {
        eligibleGroups.push({
          id: 'group2',
          title: 'Group 2 & 2A (CCS II)',
          badge: 'Bachelor Degree',
          badgeClass: 'badge-purple',
          link: '/group2',
          desc: 'Sub-Registrar, Municipal Commissioner, Revenue Inspector (RI), ASO in Secretariat.',
          pstmNote: pstm ? '✅ 20% PSTM Quota Applicable (Degree in Tamil Medium)' : 'ℹ️ Standard Non-PSTM quota'
        });
      }
    }

    // 4. Group 1 Premier Service
    if (qual === 'degree' || qual === 'pg') {
      const maxAgeG1 = isReserved ? 39 : 34;
      if (age >= 21 && age <= maxAgeG1) {
        eligibleGroups.push({
          id: 'group1',
          title: 'Group 1 (Premier Service)',
          badge: 'Premier Executive',
          badgeClass: 'badge-gold',
          link: '/group1',
          desc: 'Deputy Collector, DSP, Assistant Commissioner (CT), District Registrar.',
          pstmNote: pstm ? '✅ 20% PSTM Quota Applicable across Prelims & Mains' : 'ℹ️ Standard Non-PSTM quota'
        });
      }
    }

    // 5. Group 5A Secretariat
    if (qual === 'degree' || qual === 'pg') {
      const maxAgeG5 = isReserved ? 40 : 35;
      if (age >= 21 && age <= maxAgeG5) {
        eligibleGroups.push({
          id: 'group5a',
          title: 'Group 5A Secretariat',
          badge: 'Degree Transfer',
          badgeClass: 'badge-blue',
          link: '/group5a',
          desc: 'Assistant Section Officer (ASO) in TN Secretariat by recruitment/transfer.',
          pstmNote: pstm ? '✅ PSTM Quota Applicable' : 'ℹ️ Non-PSTM'
        });
      }
    }

    // 6. Group 7B & 8 (HR&CE)
    if (qual !== 'none') {
      const maxAgeG7B = isReserved ? 42 : 37;
      if (age >= 18 && age <= maxAgeG7B) {
        eligibleGroups.push({
          id: 'group7b-8',
          title: 'Group 7B & 8 (HR&CE)',
          badge: 'Executive Officer III & IV',
          badgeClass: 'badge-emerald',
          link: '/group7b-8',
          desc: 'Executive Officer Grade III & Grade IV in Hindu Religious & Charitable Endowments Dept.',
          pstmNote: pstm ? '✅ 20% PSTM Quota Applicable' : 'ℹ️ Non-PSTM'
        });
      }
    }

    // 7. Group 6 & Group 7A Specialized
    if (qual === 'degree' || qual === 'pg') {
      if (age >= 21 && age <= 37) {
        eligibleGroups.push({
          id: 'group6',
          title: 'Group 6 & 7A Specialized',
          badge: 'Special Technical',
          badgeClass: 'badge-purple',
          link: '/group6',
          desc: 'Assistant Conservator of Forests (ACF) & HR&CE Grade I Executive Officer.',
          pstmNote: pstm ? '✅ PSTM Quota Applicable for eligible degrees' : 'ℹ️ Non-PSTM'
        });
      }
    }

    // Render Results
    if (eligibleGroups.length === 0) {
      resultsContainer.innerHTML = `
        <div class="eligibility-alert warning">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <div>
            <h4>No Directly Eligible Cadres Found</h4>
            <p>Based on age (${age}) and qualification, standard age limits might be exceeded for general quotas. Check official TNPSC age relaxation gazette for specific exemptions.</p>
          </div>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div class="eligibility-success-header">
        <div>
          <h4><i class="fa-solid fa-circle-check" style="color:var(--brand-secondary);"></i> You are Eligible for ${eligibleGroups.length} TNPSC Exam Cadres!</h4>
          <p>Age: <strong>${age} yrs</strong> | Category: <strong>${cat}</strong> | Qualification: <strong>${qual.toUpperCase()}</strong> | PSTM: <strong>${pstm ? 'Yes (Tamil Medium)' : 'No'}</strong></p>
        </div>
      </div>
      <div class="eligibility-cards-grid">
        ${eligibleGroups.map(g => `
          <div class="eligible-card">
            <div class="eligible-card-head">
              <span class="eligible-badge ${g.badgeClass}">${g.badge}</span>
              <a href="${g.link}" class="eligible-link-btn">View Exam Guide <i class="fa-solid fa-arrow-right"></i></a>
            </div>
            <h5>${g.title}</h5>
            <p class="eligible-desc">${g.desc}</p>
            <div class="eligible-pstm-pill">${g.pstmNote}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Initial calculation check if pre-filled
  calculateEligibility();
});
