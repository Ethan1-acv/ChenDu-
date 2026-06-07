/* ========== DIARY MODULE ========== */

let _currentDiaryImage = null;
let _diaryShopSuggestions = [];

function initDiary() {
  loadDiaryEntries();
  setupDiaryForm();
  updateShopSuggestions();
}

function updateShopSuggestions() {
  _diaryShopSuggestions = getAllShops().map(s => s.name);
}

// ---- Render diary entries ----
async function loadDiaryEntries() {
  const container = document.getElementById('diary-entries');
  if (!container) return;

  try {
    const entries = await DiaryDB.getAll();
    
    if (entries.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="emoji">📝</div><p>还没有美食日记<br>去吃一顿，然后记录一下吧！</p></div>';
      document.getElementById('diary-count').textContent = '0 篇';
      return;
    }

    document.getElementById('diary-count').textContent = entries.length + ' 篇';

    container.innerHTML = entries.map(e => `
      <div class="diary-entry" data-id="${e.id}">
        <div class="diary-header">
          <div>
            <div class="diary-shop">
              <span class="shop-link" onclick="showDetailFromDiary('${e.shopName.replace(/'/g, "\\'")}')">${e.shopName}</span>
            </div>
            <div class="diary-date">${e.date || '未设置日期'}</div>
          </div>
          <div class="diary-meta">
            ${e.rating ? '<span class="star">' + '★'.repeat(parseInt(e.rating)) + '☆'.repeat(5-parseInt(e.rating)) + '</span>' : ''}
            ${e.cost ? '<span>💰 ' + e.cost + '</span>' : ''}
            ${e.recommend === 'yes' ? '<span class="recommend-yes">✅ 推荐</span>' : ''}
            ${e.recommend === 'no' ? '<span class="recommend-no">❌ 不推荐</span>' : ''}
          </div>
        </div>
        ${e.image ? `<div><img src="${e.image}" class="diary-img" alt="美食照片" onclick="window.open('${e.image}')"></div>` : ''}
        <div class="diary-text">${escapeHtml(e.text || '')}</div>
        <div class="diary-actions">
          <button class="btn-delete" onclick="deleteDiaryEntry(${e.id})">🗑️ 删除</button>
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.error('Failed to load diary:', e);
    container.innerHTML = '<div class="empty-state"><div class="emoji">⚠️</div><p>加载日记失败</p></div>';
  }
}

// ---- Setup diary form ----
function setupDiaryForm() {
  const form = document.getElementById('diary-form');
  if (!form) return;

  // Set default date
  const dateInput = document.getElementById('diary-date');
  if (dateInput) {
    const now = new Date();
    dateInput.value = now.toISOString().split('T')[0];
  }

  // Shop name autocomplete
  const shopInput = document.getElementById('diary-shop');
  if (shopInput) {
    shopInput.addEventListener('input', () => {
      const val = shopInput.value.trim();
      const suggestions = document.getElementById('diary-shop-suggestions');
      if (!suggestions) return;
      
      if (val.length < 1) {
        suggestions.innerHTML = '';
        suggestions.style.display = 'none';
        return;
      }

      const matches = _diaryShopSuggestions.filter(n => n.includes(val)).slice(0, 8);
      if (matches.length === 0) {
        suggestions.innerHTML = '';
        suggestions.style.display = 'none';
        return;
      }

      suggestions.innerHTML = matches.map(n =>
        `<div class="suggestion-item" onclick="selectDiaryShop('${n.replace(/'/g, "\\'")}')">${highlightMatch(n, val)}</div>`
      ).join('');
      suggestions.style.display = 'block';
    });

    // Close suggestions on blur
    shopInput.addEventListener('blur', () => {
      setTimeout(() => {
        const suggestions = document.getElementById('diary-shop-suggestions');
        if (suggestions) suggestions.style.display = 'none';
      }, 200);
    });
  }

  // Image upload
  const imgInput = document.getElementById('diary-image-input');
  if (imgInput) {
    imgInput.addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      
      if (file.size > 5 * 1024 * 1024) {
        showToast('图片超过 5MB，请压缩后上传');
        return;
      }

      try {
        const dataUrl = await compressImage(file, 800, 0.7);
        _currentDiaryImage = dataUrl;
        const preview = document.getElementById('diary-image-preview');
        if (preview) {
          preview.innerHTML = `
            <div class="image-preview-wrap">
              <img src="${dataUrl}" class="image-preview">
              <button class="remove-img" onclick="clearDiaryImage()">✕</button>
            </div>
          `;
        }
      } catch (err) {
        console.error('Image compression failed:', err);
        showToast('图片处理失败');
      }
    });
  }

  // Form submit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    
    const date = document.getElementById('diary-date')?.value || '';
    const shopName = document.getElementById('diary-shop')?.value?.trim() || '';
    const text = document.getElementById('diary-text')?.value?.trim() || '';
    const rating = document.getElementById('diary-rating')?.value || '';
    const cost = document.getElementById('diary-cost')?.value?.trim() || '';
    const recommend = document.getElementById('diary-recommend')?.value || '';

    if (!shopName) {
      showToast('请填写店铺名');
      return;
    }
    if (!text) {
      showToast('请填写点评内容');
      return;
    }

    const entry = { date, shopName, text, rating, cost, recommend };
    if (_currentDiaryImage) {
      entry.image = _currentDiaryImage;
    }

    try {
      await DiaryDB.add(entry);
      showToast('📝 日记保存成功！');
      
      // Reset form
      form.reset();
      _currentDiaryImage = null;
      document.getElementById('diary-image-preview').innerHTML = '';
      if (date) document.getElementById('diary-date').value = date;

      // Reload entries
      loadDiaryEntries();
    } catch (err) {
      console.error('Failed to save diary:', err);
      showToast('保存失败，请重试');
    }
  });
}

// ---- Select shop from autocomplete ----
function selectDiaryShop(name) {
  document.getElementById('diary-shop').value = name;
  document.getElementById('diary-shop-suggestions').style.display = 'none';
}

// ---- Show detail for shop from diary ----
function showDetailFromDiary(shopName) {
  const shops = getAllShops();
  const shop = shops.find(s => s.name === shopName);
  if (shop) {
    switchTab('home');
    setTimeout(() => showDetail(shop.id), 100);
  } else {
    showToast('未找到该店铺信息');
  }
}

// ---- Delete diary entry ----
async function deleteDiaryEntry(id) {
  if (!confirm('确定删除这篇日记吗？')) return;
  try {
    await DiaryDB.delete(id);
    showToast('已删除');
    loadDiaryEntries();
  } catch (e) {
    console.error('Failed to delete:', e);
    showToast('删除失败');
  }
}

// ---- Clear uploaded image ----
function clearDiaryImage() {
  _currentDiaryImage = null;
  document.getElementById('diary-image-preview').innerHTML = '';
  document.getElementById('diary-image-input').value = '';
}

// ---- Helpers ----
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function highlightMatch(text, query) {
  const idx = text.indexOf(query);
  if (idx === -1) return escapeHtml(text);
  return escapeHtml(text.slice(0, idx)) +
    '<strong>' + escapeHtml(text.slice(idx, idx + query.length)) + '</strong>' +
    escapeHtml(text.slice(idx + query.length));
}
