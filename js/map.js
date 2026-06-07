/* ========== MAP MODULE ========== */

let map = null;
let markers = [];
let mapInitialized = false;
let mapLoadFailed = false;
let pendingMapCenter = null;

// ---- Init map with fixes ----
function initMap(centerShopId) {
  const container = document.getElementById('map');
  if (!container) return;

  // Show loading state
  container.innerHTML = '<div class="map-loading"><div class="spinner" style="width:28px;height:28px;border:3px solid var(--border);border-top-color:var(--red);border-radius:50%;animation:spin .6s linear infinite;margin:0 auto 12px;display:block"></div><p>加载地图中…</p></div>';

  // Reset state if previously failed
  if (mapLoadFailed) {
    mapLoadFailed = false;
    if (map) {
      map.remove();
      map = null;
      mapInitialized = false;
    }
  }

  if (!mapInitialized) {
    try {
      map = L.map('map', {
        center: [30.66, 104.06],
        zoom: 12,
        zoomControl: true,
        fadeAnimation: true,
        markerZoomAnimation: true
      });

      // 使用高德地图瓦片（国内可直连，无需 API Key）
      L.tileLayer('https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
        attribution: '&copy; AutoNavi',
        maxZoom: 18,
        errorTileUrl: ''
      }).addTo(map);

      // Handle tile load errors
      map.on('tileerror', function(e) {
        console.warn('Tile load error:', e);
      });

      mapInitialized = true;
    } catch (e) {
      console.error('Map init failed:', e);
      showMapError('地图加载失败，请检查网络后重试');
      return;
    }
  }

  // Ensure container has explicit height (use dvh for mobile toolbar)
  const h = window.innerHeight - 110;
  container.style.height = Math.max(400, h) + 'px';
  container.style.minHeight = Math.max(400, h) + 'px';

  // Force invalidate size (critical fix for hidden tab issue)
  setTimeout(() => {
    if (map) {
      map.invalidateSize(true);
      renderAllMarkers();
    }
  }, 100);

  // Also call on next animation frame for double safety
  requestAnimationFrame(() => {
    if (map) {
      map.invalidateSize(true);
    }
  });

  // Render map category filter bar
  const catBar = document.getElementById('map-cat-bar');
  if (catBar && !catBar.children.length) {
    if (typeof renderCats === 'function') {
      renderCats('map-cat-bar', 'map', '全部');
    }
  }

  // Handle resize
  window._mapResizeHandler = window._mapResizeHandler || (() => {
    if (map && !document.getElementById('page-map').classList.contains('active')) return;
    const h2 = window.innerHeight - 120;
    document.getElementById('map').style.height = Math.max(400, h2) + 'px';
    if (map) map.invalidateSize(true);
  });
  window.removeEventListener('resize', window._mapResizeHandler);
  window.addEventListener('resize', window._mapResizeHandler);

  // Navigate to specific shop if requested
  if (centerShopId) {
    setTimeout(() => goToMapShop(centerShopId), 300);
  }
}

// ---- Render all markers ----
function renderAllMarkers(filterCat) {
  if (!map) return;
  
  // Clear existing markers
  clearMarkers();

  const shops = filterCat && filterCat !== '全部'
    ? getAllShops().filter(s => s.cat === filterCat)
    : getAllShops();

  // Batch markers with small delay to avoid jank
  let idx = 0;
  const batchSize = 20;

  function addBatch() {
    const end = Math.min(idx + batchSize, shops.length);
    for (let i = idx; i < end; i++) {
      const s = shops[i];
      const marker = L.marker([s.lat, s.lng], {
        title: s.name
      });
      marker.bindPopup(`
        <b>${s.name}${s._userAdded ? ' <span style="color:#16a34a">[新增]</span>' : ''}</b><br>
        🔥 ${s.rec}<br>
        📍 ${s.addr}<br>
        🏷️ ${s.cat}
      `);
      marker.on('click', () => showDetail(s.id));
      marker.addTo(map);
      markers.push(marker);
    }
    idx = end;
    if (idx < shops.length) {
      setTimeout(addBatch, 50);
    }
  }
  addBatch();
}

// ---- Clear markers ----
function clearMarkers() {
  if (!map) return;
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

// ---- Filter map markers by category ----
function filterMapByCat(cat) {
  // Update button active state
  document.querySelectorAll('#map-cat-bar .cat-btn').forEach(b =>
    b.classList.toggle('active', b.textContent === cat)
  );
  renderAllMarkers(cat);
  if (cat === '全部') {
    map.setView([30.66, 104.06], 12);
  }
}

// ---- Navigate map to a specific shop ----
function goToMapShop(id) {
  if (!map) {
    pendingMapCenter = id;
    initMap(id);
    return;
  }
  const shops = getAllShops();
  const s = shops.find(x => x.id === id);
  if (!s) return;
  
  renderAllMarkers();
  map.setView([s.lat, s.lng], 16, { animate: true });
  
  setTimeout(() => {
    const m = markers.find((_, i) => {
      const all = getAllShops();
      return all[i] && all[i].id === id;
    });
    if (m) m.openPopup();
  }, 400);
}

// ---- Show map error ----
function showMapError(msg) {
  mapLoadFailed = true;
  const container = document.getElementById('map');
  if (container) {
    container.innerHTML = `
      <div class="map-error">
        <div class="emoji">🗺️</div>
        <p>${msg}</p>
        <p style="margin-top:8px"><span class="retry" onclick="initMap()">🔄 重新加载</span></p>
      </div>
    `;
  }
}

// ---- Refresh map (re-initialize if needed) ----
function refreshMap() {
  if (map) {
    map.invalidateSize(true);
    renderAllMarkers();
  } else {
    initMap();
  }
}
