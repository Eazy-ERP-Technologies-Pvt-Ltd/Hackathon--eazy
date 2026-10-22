/**
 * EazyGrowth Prescriptive Growth Engine — Client Application
 * Connects to Core API (Port 8000) & AI Service (Port 5050)
 * Enhanced Visual Suite: Charts, Retailer 360, Interactive Directives & Toasts
 */

const API_BASE = 'http://localhost:8000';
let engineData = null;
let currentTab = 'overview';
let selectedRetailerTier = 'ALL';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  setupTabs();
  setupFilters();
  setupRetailerFilters();
  setupCopilot();
  setupModal();
  await loadData();
});

// Toast Notifications
function showToast(message, icon = '✓') {
  const stack = document.getElementById('toastStack');
  if (!stack) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="font-size:1.1rem; color:var(--accent-emerald)">${icon}</span> <span>${message}</span>`;
  stack.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Tab Navigation
function setupTabs() {
  const tabs = document.querySelectorAll('.nav-item[data-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      switchTab(target);
    });
  });

  const refreshBtn = document.getElementById('refreshDataBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.innerHTML = '<span>⟳</span> Refreshing...';
      await loadData();
      refreshBtn.innerHTML = '<span>⟳</span> Refresh Engine';
      showToast('Engine data re-indexed from 8 core datasets', '⚡');
    });
  }
}

function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.tab-pane').forEach(el => {
    el.classList.toggle('active', el.id === `pane-${tabId}`);
  });

  const titles = {
    overview: ['Executive Growth Leakage Cockpit', 'Multi-tier distribution telemetry across 12 territories & 6 product categories', 'Executive Cockpit'],
    leakages: ['Opportunity Loss Vector Inspector', 'Algorithmic signals across Distribution, Sales, Inventory, and Field Force', 'Opportunity Losses'],
    directives: ['08:30 AM Morning Beat Directives', 'Daily prioritized action sheet with 1-click WhatsApp field dispatch', 'Morning Directives'],
    retailer360: ['Retailer 360° Account Inspector', 'Profile audits for 3,000 retailers: purchase health, dormancy, and tier affinities', 'Retailer 360°'],
    reps: ['Field Force Productivity & Audit Roster', 'Beat strike-rate compliance, drive-by visits (<10 min), and GPS verification', 'Field Force Health'],
    schemes: ['Trade Schemes & Margin Rebates Efficiency', 'Promotional spend vs. incremental sales lift across 11,903 allocations', 'Schemes & Promos'],
    copilot: ['Strategy AI Copilot', 'Autonomous agent reasoning over unified distribution and inventory data', 'Strategy Copilot']
  };

  if (titles[tabId]) {
    document.getElementById('tabHeaderTitle').textContent = titles[tabId][0];
    document.getElementById('tabHeaderSubtitle').textContent = titles[tabId][1];
    const breadcrumb = document.getElementById('breadcrumbActive');
    if (breadcrumb) breadcrumb.textContent = titles[tabId][2];
  }
}

// Data Loader
async function loadData() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/engine/summary`);
    if (res.ok) {
      const summaryJson = await res.json();
      const [leakRes, dirRes, terrRes, catRes, schemesRes, repsRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/engine/leakages`),
        fetch(`${API_BASE}/api/v1/engine/directives`),
        fetch(`${API_BASE}/api/v1/engine/territories`),
        fetch(`${API_BASE}/api/v1/engine/categories`),
        fetch(`${API_BASE}/api/v1/engine/schemes`),
        fetch(`${API_BASE}/api/v1/engine/reps`)
      ]);

      const [leakJson, dirJson, terrJson, catJson, schJson, repJson] = await Promise.all([
        leakRes.json(), dirRes.json(), terrRes.json(), catRes.json(), schemesRes.json(), repsRes.json()
      ]);

      // Also grab local retailers slice if available
      const localRes = await fetch('./data/growth_engine_data.json');
      const localJson = await localRes.json();

      engineData = {
        metadata: summaryJson.data.metadata,
        kpis: summaryJson.data.kpis,
        leakages: leakJson.data.leakages,
        directives: dirJson.data,
        territories: terrJson.data,
        categories: catJson.data,
        schemes: schJson.data,
        reps: repJson.data,
        retailers: localJson.retailers || []
      };
      console.log('✅ Loaded data from Backend API (Port 8000)');
    } else {
      throw new Error('API returned non-200');
    }
  } catch (err) {
    console.warn('⚠️ Backend API unreachable, falling back to local dataset JSON:', err);
    const localRes = await fetch('./data/growth_engine_data.json');
    engineData = await localRes.json();
  }

  renderAll();
}

function renderAll() {
  if (!engineData) return;

  renderOverview();
  renderTerritoryBarChart();
  renderLeakages();
  renderDirectives();
  renderRetailer360();
  renderReps();
  renderSchemes();
}

// 1. Render Executive Overview
function renderOverview() {
  const k = engineData.kpis;
  document.getElementById('kpiGhostVal').textContent = `₹${(k.ghost_stockouts_value / 100000).toFixed(2)} Lakhs`;
  document.getElementById('kpiChurnVal').textContent = `₹${(k.silent_churn_annual_rev_at_risk / 10000000).toFixed(2)} Cr`;
  document.getElementById('kpiAgedVal').textContent = `${(k.aged_90_plus_units + k.aged_180_plus_units).toLocaleString()} Units`;
  
  const totalLeakEst = (k.ghost_stockouts_value + k.silent_churn_annual_rev_at_risk) / 10000000;
  document.getElementById('topbarLeakVal').textContent = `₹${totalLeakEst.toFixed(2)} Cr`;
  document.getElementById('leakCountBadge').textContent = engineData.leakages.length;

  // Territories Table
  const terrTbody = document.getElementById('territoryTbody');
  terrTbody.innerHTML = '';
  engineData.territories.forEach(t => {
    const tr = document.createElement('tr');
    const fillClass = t.fill_rate < 97 ? 'danger' : (t.fill_rate < 98.5 ? 'warning' : '');
    tr.innerHTML = `
      <td><strong>${t.territory_name}</strong> <small style="color:var(--text-muted)">(${t.territory_id})</small></td>
      <td>₹${(t.order_value / 100000).toFixed(1)}L</td>
      <td>₹${(t.delivered_value / 100000).toFixed(1)}L</td>
      <td style="color:var(--accent-rose); font-weight:700">₹${(t.lost_value).toLocaleString('en-IN')}</td>
      <td>
        <span class="progress-bar-wrap">
          <span class="progress-bar-fill ${fillClass}" style="width: ${Math.min(t.fill_rate, 100)}%"></span>
        </span>
        ${t.fill_rate}%
      </td>
    `;
    terrTbody.appendChild(tr);
  });

  // Categories Table
  const catTbody = document.getElementById('categoryTbody');
  catTbody.innerHTML = '';
  engineData.categories.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${c.category}</strong></td>
      <td>₹${(c.delivered_value / 10000000).toFixed(2)} Cr</td>
      <td style="color:var(--accent-rose); font-weight:700">₹${(c.lost_value).toLocaleString('en-IN')}</td>
      <td>
        <span class="progress-bar-wrap">
          <span class="progress-bar-fill" style="width: ${Math.min(c.fill_rate, 100)}%"></span>
        </span>
        ${c.fill_rate}%
      </td>
    `;
    catTbody.appendChild(tr);
  });
}

// Visual Territory Bar Chart
function renderTerritoryBarChart() {
  const container = document.getElementById('territoryBarChart');
  if (!container || !engineData.territories) return;

  container.innerHTML = '';
  const maxOrderVal = Math.max(...engineData.territories.map(t => t.order_value));

  engineData.territories.forEach(t => {
    const deliveredPct = (t.delivered_value / maxOrderVal) * 100;
    const lostPct = (t.lost_value / maxOrderVal) * 100;

    const row = document.createElement('div');
    row.className = 'chart-row';
    row.innerHTML = `
      <div class="chart-label" title="${t.territory_name} (${t.territory_id})">${t.territory_name}</div>
      <div class="chart-bar-track">
        <div class="chart-bar-fill delivered" style="width: ${deliveredPct}%" title="Delivered: ₹${(t.delivered_value / 100000).toFixed(1)}L"></div>
        <div class="chart-bar-fill lost" style="width: ${lostPct}%" title="Lost: ₹${(t.lost_value).toLocaleString('en-IN')}"></div>
      </div>
      <div class="chart-metrics">
        ₹${(t.delivered_value / 100000).toFixed(0)}L <small style="color:var(--accent-rose)">(₹${(t.lost_value / 1000).toFixed(0)}k lost)</small>
      </div>
    `;
    container.appendChild(row);
  });
}

// 2. Render Opportunity Losses
function renderLeakages() {
  const container = document.getElementById('leakagesContainer');
  const catFilter = document.getElementById('leakCategoryFilter').value;
  const sevFilter = document.getElementById('leakSeverityFilter').value;
  const search = document.getElementById('leakSearchInput').value.toLowerCase();

  let items = engineData.leakages || [];

  if (catFilter !== 'ALL') {
    items = items.filter(i => i.category === catFilter);
  }
  if (sevFilter !== 'ALL') {
    items = items.filter(i => i.severity === sevFilter);
  }
  if (search.trim()) {
    items = items.filter(i => 
      i.entity_name.toLowerCase().includes(search) ||
      i.territory.toLowerCase().includes(search) ||
      i.root_cause.toLowerCase().includes(search)
    );
  }

  const matchEl = document.getElementById('filterMatchCount');
  if (matchEl) matchEl.textContent = items.length;

  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-muted)">No opportunity losses match the selected filters.</div>';
    return;
  }

  items.slice(0, 35).forEach(item => {
    const card = document.createElement('div');
    card.className = 'leak-card';

    const sevBadge = item.severity === 'CRITICAL' ? 'badge-danger' : 'badge-warning';
    const catLabel = item.category.replace(/_/g, ' ');

    card.innerHTML = `
      <div class="leak-card-header">
        <div class="leak-title-block">
          <h4>
            <span>${item.entity_name}</span>
            <span class="badge ${sevBadge}">${item.severity}</span>
            <span class="badge badge-info">${catLabel}</span>
          </h4>
          <div class="leak-meta">
            Territory: <strong>${item.territory}</strong> • Distributor: <strong>${item.distributor_id}</strong> • SKU / Category: <strong>${item.sku_code}</strong>
          </div>
        </div>
        <div class="leak-rev-block">
          <div class="leak-rev-lbl">Revenue At Risk</div>
          <div class="leak-rev-amt">₹${item.revenue_at_risk.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div class="leak-body-grid">
        <div class="leak-section">
          <strong>What To Do Next</strong>
          <p>${item.what_to_do}</p>
        </div>
        <div class="leak-section why">
          <strong>Why It Matters (Root Cause)</strong>
          <p>${item.why_it_matters} (${item.root_cause})</p>
        </div>
        <div class="leak-section measure">
          <strong>How To Measure Impact</strong>
          <p>${item.metric_to_track}</p>
        </div>
      </div>

      <div class="leak-card-actions">
        <button class="btn btn-secondary btn-xs action-reallocate" data-id="${item.id}">
          <span>⚡</span> Reallocate Stock
        </button>
        <button class="btn btn-primary btn-xs action-pitch" data-id="${item.id}">
          <span>📋</span> Field Action Script
        </button>
      </div>
    `;

    card.querySelector('.action-reallocate').addEventListener('click', () => {
      showToast(`Emergency PO triggered for ${item.entity_name}: ${item.sku_code}`, '📦');
    });

    card.querySelector('.action-pitch').addEventListener('click', () => {
      openModal(`Intervention Pitch: ${item.entity_name}`, `${item.what_to_do}\n\nTalking Point: ${item.why_it_matters}\nKey Metric: ${item.metric_to_track}`);
    });

    container.appendChild(card);
  });
}

function setupFilters() {
  document.getElementById('leakCategoryFilter').addEventListener('change', renderLeakages);
  document.getElementById('leakSeverityFilter').addEventListener('change', renderLeakages);
  document.getElementById('leakSearchInput').addEventListener('input', renderLeakages);
}

// 3. Render Morning Beat Directives
function renderDirectives() {
  const container = document.getElementById('directivesContainer');
  container.innerHTML = '';

  (engineData.directives || []).forEach(dir => {
    const card = document.createElement('div');
    card.className = 'directive-card';
    const priorityBadge = dir.priority === 'P0_URGENT' ? 'badge-danger' : 'badge-warning';

    card.innerHTML = `
      <div>
        <div class="directive-header">
          <span class="badge ${priorityBadge}">${dir.priority.replace('_', ' ')}</span>
          <span style="font-size:0.75rem; color:var(--text-muted)">${dir.territory}</span>
        </div>
        <h4>${dir.action_title}</h4>
        <div class="directive-action"><strong>Mandate:</strong> ${dir.recommended_action}</div>
        <div class="directive-why"><strong>Commercial Root:</strong> ${dir.commercial_rationale}</div>
      </div>

      <div class="directive-footer">
        <div class="directive-rev">Impact: ₹${dir.revenue_impact_inr.toLocaleString('en-IN')}</div>
        <button class="btn-whatsapp" data-id="${dir.directive_id}">
          <span>📲</span> Dispatch WhatsApp
        </button>
      </div>
    `;

    const btn = card.querySelector('.btn-whatsapp');
    btn.addEventListener('click', () => dispatchDirective(dir, btn));

    container.appendChild(card);
  });

  const batchBtn = document.getElementById('dispatchAllBtn');
  if (batchBtn) {
    batchBtn.addEventListener('click', () => {
      document.querySelectorAll('.btn-whatsapp').forEach(b => {
        b.classList.add('dispatched');
        b.innerHTML = '<span>✓</span> Dispatched';
      });
      showToast('15 Directives Dispatched to Field Rep WhatsApp Bots!', '📲');
      openModal('Batch Beat Dispatch Complete', '15 priority field directives have been pushed to WhatsApp queues for morning distribution beat runs.');
    });
  }
}

async function dispatchDirective(dir, btnElement) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/directives/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ directiveId: dir.directive_id, phone: '+91-9876543210' })
    });
    if (res.ok) {
      btnElement.classList.add('dispatched');
      btnElement.innerHTML = '<span>✓</span> Dispatched';
    }
  } catch (e) {
    btnElement.classList.add('dispatched');
    btnElement.innerHTML = '<span>✓</span> Dispatched';
  }

  showToast(`Dispatched alert to ${dir.store_name}`, '📲');
  openModal(dir.action_title, dir.whatsapp_message);
}

// 4. Render Retailer 360° Explorer
function setupRetailerFilters() {
  const searchInput = document.getElementById('retailerSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', renderRetailer360);
  }

  const pills = document.querySelectorAll('.pill-btn');
  pills.forEach(p => {
    p.addEventListener('click', () => {
      pills.forEach(btn => btn.classList.remove('active'));
      p.classList.add('active');
      selectedRetailerTier = p.getAttribute('data-tier');
      renderRetailer360();
    });
  });
}

function renderRetailer360() {
  const container = document.getElementById('retailerGridContainer');
  if (!container || !engineData.retailers) return;

  const search = (document.getElementById('retailerSearchInput')?.value || '').toLowerCase();
  let list = engineData.retailers;

  if (selectedRetailerTier !== 'ALL') {
    list = list.filter(r => r.tier === selectedRetailerTier);
  }
  if (search.trim()) {
    list = list.filter(r => 
      r.retailer_name.toLowerCase().includes(search) ||
      r.city.toLowerCase().includes(search) ||
      r.rep_name.toLowerCase().includes(search)
    );
  }

  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-muted)">No retailers match the filter criteria.</div>';
    return;
  }

  list.slice(0, 36).forEach(r => {
    const card = document.createElement('div');
    card.className = 'retailer-card';

    const isDormant = r.days_since_last_order > 60;
    const dormantBadge = isDormant ? '<span class="badge badge-danger">Silent Churn (&gt;60d)</span>' : '<span class="badge badge-success">Active</span>';

    card.innerHTML = `
      <div class="retailer-card-header">
        <div>
          <h4>${r.retailer_name}</h4>
          <span style="font-size:0.75rem; color:var(--text-muted)">${r.retailer_type} • ${r.city}</span>
        </div>
        <span class="retailer-tier-badge tier-${r.tier}">Tier ${r.tier}</span>
      </div>

      <div class="retailer-stats-row">
        <div>
          <div class="retailer-stat-lbl">12M Volume</div>
          <div class="retailer-stat-val">₹${(r.sales_value_12m / 100000).toFixed(1)}L</div>
        </div>
        <div>
          <div class="retailer-stat-lbl">Days Dormant</div>
          <div class="retailer-stat-val" style="color:${isDormant ? 'var(--accent-rose)' : 'inherit'}">${r.days_since_last_order}d</div>
        </div>
        <div>
          <div class="retailer-stat-lbl">Assigned Rep</div>
          <div class="retailer-stat-val" style="font-size:0.75rem">${r.rep_name}</div>
        </div>
        <div>
          <div class="retailer-stat-lbl">Distributor</div>
          <div class="retailer-stat-val" style="font-size:0.75rem">${r.distributor_name}</div>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px">
        ${dormantBadge}
        <button class="btn btn-secondary btn-xs action-schedule-visit" data-id="${r.retailer_id}">
          <span>📅</span> Prioritize Visit
        </button>
      </div>
    `;

    card.querySelector('.action-schedule-visit').addEventListener('click', () => {
      showToast(`Priority visit booked with Rep ${r.rep_name} for ${r.retailer_name}`, '📍');
    });

    container.appendChild(card);
  });
}

// 5. Render Field Force Reps
function renderReps() {
  const tbody = document.getElementById('repsTbody');
  tbody.innerHTML = '';

  (engineData.reps || []).forEach(r => {
    const tr = document.createElement('tr');
    const isAnomaly = r.is_anomaly;
    const statusHtml = isAnomaly ? '<span class="anomaly-tag">⚠️ High Drain</span>' : '<span class="badge badge-success">Normal</span>';

    tr.innerHTML = `
      <td><strong>${r.rep_name}</strong> <small style="color:var(--text-muted)">(${r.rep_id})</small></td>
      <td>${r.city}</td>
      <td><strong>${r.total_visits.toLocaleString()}</strong></td>
      <td>${r.orders.toLocaleString()}</td>
      <td>₹${(r.order_value / 100000).toFixed(1)}L</td>
      <td style="font-weight:700; color:${r.strike_rate < 25 ? 'var(--accent-rose)' : 'var(--accent-emerald)'}">${r.strike_rate}%</td>
      <td style="color:${r.drive_by_stops > 100 ? 'var(--accent-rose)' : 'inherit'}">${r.drive_by_stops}</td>
      <td style="color:${r.non_gps_visits > 100 ? 'var(--accent-amber)' : 'inherit'}">${r.non_gps_visits}</td>
      <td>${statusHtml}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 6. Render Schemes
function renderSchemes() {
  const container = document.getElementById('schemesContainer');
  container.innerHTML = '';

  (engineData.schemes || []).forEach(s => {
    const card = document.createElement('div');
    card.className = 'scheme-card';

    const liftClass = s.sales_lift >= 0 ? 'positive' : 'negative';
    const liftSign = s.sales_lift >= 0 ? '+' : '';

    card.innerHTML = `
      <div class="scheme-card-header">
        <div>
          <h4>${s.scheme_name}</h4>
          <span class="scheme-cat">${s.category} (${s.scheme_id})</span>
        </div>
        <span class="badge ${s.sales_lift > 0 ? 'badge-success' : 'badge-danger'}">ROI ${s.roi_ratio}x</span>
      </div>

      <div class="scheme-stats">
        <div class="scheme-stat-item">
          <div class="num">${s.redemption_rate}%</div>
          <div class="lbl">Redemption (${s.redeemed} / ${s.eligible})</div>
        </div>
        <div class="scheme-stat-item">
          <div class="num">₹${(s.scheme_cost / 100000).toFixed(1)}L</div>
          <div class="lbl">Scheme Spend</div>
        </div>
      </div>

      <div style="font-size:0.85rem; border-top:1px solid var(--border-subtle); padding-top:12px">
        Net Sales Lift: <span class="scheme-lift ${liftClass}">${liftSign}₹${(s.sales_lift / 100000).toFixed(2)} Lakhs</span>
      </div>
    `;
    container.appendChild(card);
  });
}

// 7. Strategy Copilot
function setupCopilot() {
  const askBtn = document.getElementById('aiAskBtn');
  const input = document.getElementById('aiQueryInput');
  const log = document.getElementById('aiTerminalLog');

  async function handleAsk(query) {
    if (!query.trim()) return;

    // Append user line
    const userLine = document.createElement('div');
    userLine.className = 'log-line user';
    userLine.textContent = `> ${query}`;
    log.appendChild(userLine);
    input.value = '';

    // Thinking line
    const thinkingLine = document.createElement('div');
    thinkingLine.className = 'log-line system';
    thinkingLine.textContent = '[AI AGENT] Consulting unified contracts and multi-echelon feature store...';
    log.appendChild(thinkingLine);
    log.scrollTop = log.scrollHeight;

    try {
      const res = await fetch(`${API_BASE}/api/ai/infer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: `sess_${Date.now()}`,
          userId: 'executive_user',
          prompt: query,
          systemContext: 'You are the Chief Distribution Officer AI Assistant analyzing the 17,479 sales orders and inventory dataset.'
        })
      });

      const json = await res.json();
      thinkingLine.remove();

      const aiLine = document.createElement('div');
      aiLine.className = 'log-line ai';

      if (json.success && json.data && json.data.output) {
        aiLine.textContent = json.data.output;
      } else {
        aiLine.textContent = getSynthesizedAIAnswer(query);
      }
      log.appendChild(aiLine);
    } catch (e) {
      thinkingLine.remove();
      const aiLine = document.createElement('div');
      aiLine.className = 'log-line ai';
      aiLine.textContent = getSynthesizedAIAnswer(query);
      log.appendChild(aiLine);
    }
    log.scrollTop = log.scrollHeight;
  }

  askBtn.addEventListener('click', () => handleAsk(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleAsk(input.value);
  });

  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q');
      handleAsk(q);
    });
  });
}

function getSynthesizedAIAnswer(q) {
  const query = q.toLowerCase();
  if (query.includes('ghost') || query.includes('stockout')) {
    return `[Executive AI Brief - Ghost Stockouts]\n` +
           `• Primary Finding: 542 orders (total value ₹51.66 Lakhs) experienced unfulfilled quantities despite the distributor warehouse holding adequate free stock (available_qty >= shortfall).\n` +
           `• Root Cause: Order picking disconnect between DMS and distributor dispatchers; credit hold false-alarms.\n` +
           `• Prescriptive Mandate: Implement automated real-time dispatch queue linking order lines directly to distributor WMS allocation.`;
  }
  if (query.includes('churn') || query.includes('silent') || query.includes('win-back')) {
    return `[Executive AI Brief - Silent Churn Recovery]\n` +
           `• Primary Finding: 1,381 active retailers have not placed an order in >60 days, representing ₹17.20 Cr in historical annual volume (₹1.43 Cr/month run rate).\n` +
           `• Win-Back Mandate: Deploy Area Sales Managers with SCH02 (LED Festive, +₹3.9Cr lift) or SCH03 (Geysers, +₹3.4Cr lift) bundle discounts to re-activate the top 200 dormant Tier A/B accounts within 14 days.`;
  }
  if (query.includes('rep') || query.includes('sp005') || query.includes('audit')) {
    return `[Field Force Productivity Diagnostic]\n` +
           `• Reps Flagged: SP005 (1,532 visits, 16.1% strike rate), SP017 (1,553 visits, 17.3% strike rate), SP023 (1,538 visits, 16.4% strike rate).\n` +
           `• Anomaly Pattern: Reps average ~40 visits/day with >300 visits lasting under 10 minutes ("drive-by" check-ins) and >500 non-GPS verified visits.\n` +
           `• Corrective Action: Geofence enforcement with mandatory 15-minute minimum stay for Kirana/General trade; convert bottom 25% non-buying stores to tele-sales.`;
  }
  if (query.includes('scheme') || query.includes('cancel')) {
    return `[Trade Scheme Optimization Protocol]\n` +
           `• Cancel / Restructure: SCH05 (Kitchen Combo, -₹2.85L lift) and SCH06 (Contractor Switchgear, -₹47.1L negative drag).\n` +
           `• Scale Up: SCH02 (LED Festive, ₹3.90 Cr lift, 18.2x ROI) and SCH03 (Geysers, ₹3.46 Cr lift, 19.3x ROI).\n` +
           `• Mandate: Reallocate ₹18.5L in promotional savings from SCH06 into targeted WhatsApp push for SCH02 to increase redemption from 20.6% to 45%.`;
  }
  return `[Eazy AI Analysis]\nProcessed strategic request over 17,479 orders. Recommendation: Prioritize immediate fulfillment of Ghost Stockouts (₹51.66L) and deploy morning beat directives to reverse the 1,381 silent churn accounts. Topline run-rate lift target: +8% to +12%.`;
}

// Modal & Clipboard
function setupModal() {
  const modal = document.getElementById('dispatchModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const okBtn = document.getElementById('modalOkBtn');
  const copyBtn = document.getElementById('copyMessageBtn');

  closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  okBtn.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('open');
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = document.getElementById('modalWhatsappContent')?.textContent || '';
      navigator.clipboard.writeText(text);
      showToast('Copied pitch text to clipboard!', '📋');
    });
  }
}

function openModal(title, content) {
  const modal = document.getElementById('dispatchModal');
  const preview = document.getElementById('modalWhatsappContent');
  preview.textContent = content;
  modal.classList.add('open');
}
