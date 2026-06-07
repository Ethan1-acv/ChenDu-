/* ========== MAIN APP ========== */

// ---- State ----
let currentTab = 'home';
let todayId = null;
let recommendHistory = [];

// ---- Tab switching ----
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + tab).classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  const tabIndex = ['home', 'map', 'search', 'diary', 'addshop'].indexOf(tab);
  document.querySelectorAll('.tab-btn')[['home', 'map', 'search', 'diary'][tabIndex >= 0 && tabIndex < 4 ? tabIndex : 0]].classList.add('active');

  // Hide FAB on diary page
  const fab = document.getElementById('fab-add-shop');
  if (fab) fab.style.display = tab === 'map' || tab === 'search' || tab === 'home' ? 'block' : 'none';

  switch (tab) {
    case 'home':
      refreshToday();
      break;
    case 'map':
      // Critical: ensure map container has height and re-initialize
      setTimeout(() => {
        initMap();
      }, 50);
      break;
    case 'search':
      refreshSearch();
      break;
    case 'diary':
      initDiary();
      break;
  }
}

// ---- Today recommendation ----
function getDaySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function getTimeContext() {
  const h = new Date().getHours();
  const month = new Date().getMonth() + 1;
  return {
    hour: h,
    isSummer: month >= 5 && month <= 9,
    isWinter: month <= 2 || month >= 11,
    isWeekend: [0, 6].includes(new Date().getDay())
  };
}

function scoreForToday(shop) {
  const ctx = getTimeContext();
  let score = 0;
  const seed = (getDaySeed() * 997 + shop.id * 7919) % 100;
  score += seed / 100;
  if (recommendHistory.includes(shop.id)) score -= 0.5;
  if (ctx.isSummer && ['冰粉', '甜品', '钵钵鸡'].includes(shop.cat)) score += 0.3;
  if (ctx.isWinter && ['火锅', '蹄花', '肥肠'].includes(shop.cat)) score += 0.3;
  if (ctx.isWeekend && ['火锅', '串串', '川菜'].includes(shop.cat)) score += 0.2;
  if (ctx.hour >= 20 && ['烧烤', '串串'].includes(shop.cat)) score += 0.2;
  if (ctx.hour >= 6 && ctx.hour <= 13 && ['面食', '粉面', '抄手', '锅盔'].includes(shop.cat)) score += 0.2;
  return score;
}

function getTodaysPick() {
  if (todayId) {
    const allShops = getAllShops();
    const s = allShops.find(x => x.id === todayId);
    if (s) return s;
  }
  const allShops = getAllShops();
  const scored = allShops.map(s => ({ ...s, _score: scoreForToday(s) })).sort((a, b) => b._score - a._score);
  const pick = scored[0];
  todayId = pick.id;
  recommendHistory.push(pick.id);
  if (recommendHistory.length > 30) recommendHistory.shift();
  return pick;
}

function refreshToday() {
  const pick = getTodaysPick();
  const allShops = getAllShops();
  const idx = allShops.findIndex(s => s.id === pick.id) + 1;

  const pageHome = document.getElementById('page-home');
  pageHome.innerHTML = `
    <div class="today-card">
      <div class="today-badge">🎯 今日推荐  #${idx}/${allShops.length}</div>
      <h2>${pick.name}${pick._userAdded ? ' <span style="font-size:12px;background:rgba(255,255,255,.2);padding:2px 8px;border-radius:8px">新增</span>' : ''}</h2>
      <div class="rec-dish">推荐：${pick.rec}</div>
      <div class="addr">📍 ${pick.addr}</div>
      <div class="tags">${(pick.tags || []).map(t => '<span class="tag">' + t + '</span>').join('')}</div>
      <div style="margin-top:8px;font-size:12px;opacity:.6">分类：${pick.cat}</div>
    </div>
    <div class="today-actions">
      <button class="btn-shuffle" onclick="shuffleToday()">🔄 换个推荐</button>
      <button class="btn-map" onclick="goToMapDetail(${pick.id})">🗺️ 看地图</button>
      ${pick.lat && pick.lng ? `<a class="nav-btn" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;background:white;color:var(--red);border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;flex:1;justify-content:center" href="https://uri.amap.com/marker?position=${pick.lng},${pick.lat}&name=${encodeURIComponent(pick.name)}" target="_blank">🗺️ 导航</a>` : ''}
    </div>
    <div style="margin-top:24px">
      <div class="section-title">
        <span>探索更多</span>
        <span style="font-size:12px;color:var(--gray)">共 ${allShops.length} 家</span>
      </div>
      <div class="cat-bar" id="home-cat-bar"></div>
      <div class="shop-list" id="home-shop-list"></div>
    </div>
  `;

  renderCats('home-cat-bar', 'home', '全部');
  renderShopList('home-shop-list', getAllShops());
}

function shuffleToday() {
  todayId = null;
  refreshToday();
}

// ---- Category filter ----
function renderCats(containerId, context, activeCat) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const cats = getUniqueCategories();
  el.innerHTML = cats.map(c =>
    '<button class="cat-btn ' + (c === activeCat ? 'active' : '') + ' ' + (c === '全部' ? 'all' : '') + '" onclick="filterByCat(\'' + c + '\',\'' + context + '\')">' + c + '</button>'
  ).join('');
}

function filterByCat(cat, context) {
  document.querySelectorAll('#' + context + '-cat-bar .cat-btn').forEach(b =>
    b.classList.toggle('active', b.textContent === cat)
  );
  if (context === 'map') { filterMapByCat(cat); return; }
  const allShops = getAllShops();
  const filtered = cat === '全部' ? allShops : allShops.filter(s => s.cat === cat);
  renderShopList(context + '-shop-list', filtered);
}

// ---- Render shop list ----
function renderShopList(containerId, shops) {
  const el = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!el) return;
  if (!shops.length) {
    el.innerHTML = '<div class="empty-state"><div class="emoji">🔍</div><p>没找到匹配的店铺</p></div>';
    return;
  }
  el.innerHTML = shops.map(s =>
    '<div class="shop-item" onclick="showDetail(' + s.id + ')">' +
    '<h3><span class="num-badge">' + s.id + '</span>' + s.name + (s._userAdded ? '<span class="user-badge">新增</span>' : '') + '</h3>' +
    '<div class="rec">🔥 ' + s.rec + '</div>' +
    '<div class="meta"><span>📍 ' + s.addr + '</span><span>🏷️ ' + s.cat + '</span></div>' +
    '</div>'
  ).join('');
}

// ---- Detail overlay ----
function showDetail(id) {
  const allShops = getAllShops();
  const s = allShops.find(x => x.id === id);
  if (!s) return;

  const overlay = document.getElementById('detail-overlay');
  document.getElementById('detail-body').innerHTML =
    '<h2>' + s.name + (s._userAdded ? ' <span style="font-size:12px;color:var(--green);font-weight:400">[新增]</span>' : '') + '</h2>' +
    '<div style="font-size:13px;color:var(--gray);margin-bottom:8px">#' + id + ' / ' + allShops.length + '</div>' +
    '<div class="rec-dish">🔥 推荐：' + s.rec + '</div>' +
    '<div class="addr">📍 ' + s.addr + '</div>' +
    '<div class="tags">' + (s.tags || []).map(t => '<span class="tag">' + t + '</span>').join('') + '</div>' +
    '<div style="margin-top:8px;font-size:13px;color:var(--gray)">分类：' + s.cat + '</div>' +
    '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">' +
    (s.lat && s.lng ?
      '<a class="nav-btn" href="https://uri.amap.com/marker?position=' + s.lng + ',' + s.lat + '&name=' + encodeURIComponent(s.name) + '" target="_blank">🗺️ 高德导航</a>' : ''
    ) +
    '<button class="nav-btn" style="background:var(--gray)" onclick="closeDetail();switchTab(\'map\');setTimeout(()=>goToMapShop(' + id + '),200)">📍 在地图上看</button>' +
    '</div>';

  overlay.classList.add('show');
}

function closeDetail() {
  document.getElementById('detail-overlay').classList.remove('show');
}

// ---- Go to map from today card ----
function goToMapDetail(id) {
  switchTab('map');
  setTimeout(() => goToMapShop(id), 300);
}

// ---- Search ----
function refreshSearch() {
  const cats = getUniqueCategories();
  renderCats('search-cat-bar', 'search', '全部');
  renderShopList('search-results', getAllShops());
  document.getElementById('search-input').value = '';
}

function performSearch(q) {
  let results;
  if (!q) {
    results = getAllShops();
  } else {
    results = getAllShops().filter(s =>
      s.name.includes(q) || s.rec.includes(q) || s.addr.includes(q) || s.cat.includes(q) ||
      (s.tags || []).some(t => t.includes(q))
    );
  }
  renderShopList('search-results', results);
}

// ========== ADD SHOP ==========

function openAddShopForm() {
  document.getElementById('addshop-overlay').classList.add('show');
  // Populate category select
  const catSelect = document.getElementById('addshop-cat');
  if (catSelect) {
    const cats = getUniqueCategories().filter(c => c !== '全部');
    catSelect.innerHTML = '<option value="">选择分类</option>' +
      cats.map(c => '<option value="' + c + '">' + c + '</option>').join('');
  }
}

function closeAddShopForm() {
  document.getElementById('addshop-overlay').classList.remove('show');
}

function submitAddShop(e) {
  e.preventDefault();

  const name = document.getElementById('addshop-name')?.value?.trim();
  const cat = document.getElementById('addshop-cat')?.value;
  const rec = document.getElementById('addshop-rec')?.value?.trim();
  const addr = document.getElementById('addshop-addr')?.value?.trim();
  const lat = parseFloat(document.getElementById('addshop-lat')?.value) || undefined;
  const lng = parseFloat(document.getElementById('addshop-lng')?.value) || undefined;
  const tags = document.getElementById('addshop-tags')?.value?.split(/[,，、\s]+/).filter(Boolean) || [];
  const note = document.getElementById('addshop-note')?.value?.trim();
  const rating = document.getElementById('addshop-rating')?.value;

  if (!name) { showToast('请填写店铺名'); return; }
  if (!cat) { showToast('请选择分类'); return; }
  if (!rec) { showToast('请填写推荐菜'); return; }
  if (!addr) { showToast('请填写地址'); return; }

  const shop = { name, cat, rec, addr, tags };
  if (lat && lng) { shop.lat = lat; shop.lng = lng; }
  if (note) { shop._note = note; }
  if (rating) { shop._rating = parseInt(rating); }

  addUserShop(shop);
  showToast('✅ ' + name + ' 已添加！');

  // Reset form
  e.target.reset();
  closeAddShopForm();

  // Refresh all views that show shops
  updateShopSuggestions();
  refreshToday();
  refreshSearch();
}

// ========== TOAST ==========
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.style.display = 'none';
  }, 2000);
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  // Search input handler
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => performSearch(this.value.trim()), 200);
    });
  }

  // Add shop form
  const addShopForm = document.getElementById('addshop-form');
  if (addShopForm) {
    addShopForm.addEventListener('submit', submitAddShop);
  }

  // Outside click to close overlays
  document.querySelectorAll('.overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.classList.remove('show');
      }
    });
  });

  // Initial render
  refreshToday();
});
