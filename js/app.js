/**
 * app.js
 * Logika utama aplikasi web JelajahNTT
 * Leaflet.js, OSRM Leaflet Routing Machine, Geolocation, Interactive Markers & UI Sync
 * Fitur Admin: Tambah & Hapus Titik Lokasi Wisata Kustom (tersimpan di localStorage)
 */

// Storage key untuk data titik wisata yang ditambahkan admin
const CUSTOM_SPOTS_STORAGE_KEY = "jelajah_custom_tourism_spots";

function getCustomSpots() {
  try {
    const raw = localStorage.getItem(CUSTOM_SPOTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Gagal membaca data kustom:", e);
    return [];
  }
}

function saveCustomSpots(spots) {
  try {
    localStorage.setItem(CUSTOM_SPOTS_STORAGE_KEY, JSON.stringify(spots));
  } catch (e) {
    console.error("Gagal menyimpan data kustom:", e);
  }
}

// Menggabungkan destinasi bawaan dari data.js dengan destinasi kustom admin
let allDestinations = [...TOURISM_DESTINATIONS, ...getCustomSpots()];
let isMapPickerActive = false;
let tempPickerMarker = null;

// ================= GLOBAL STATE =================
let map = null;
let markersMap = {}; // id -> L.marker
let userLocationMarker = null;
let routingControl = null;
let fallbackRoutePolyline = null;
let activeDestination = null;
let currentTileLayer = null;
let currentTileIndex = 0;

let currentRouteMetrics = {
  distanceKm: 0,
  carMinutes: 0,
  motorMinutes: 0,
  walkMinutes: 0,
  activeMode: 'car'
};

let currentUserLocation = {
  lat: DEFAULT_FALLBACK_LOCATION.lat,
  lng: DEFAULT_FALLBACK_LOCATION.lng,
  name: DEFAULT_FALLBACK_LOCATION.name,
  isFallback: true
};

let activeRegionFilter = "Semua"; // "Semua" | "Flores" | "Timor"
let activeCategoryFilter = "Semua";
let currentSearchQuery = "";

// Pilihan Tile Peta 100% Gratis, Bebas API Key & Mendukung Akses Langsung (file://)
const TILE_LAYERS = [
  {
    name: "Esri World Street Map (Modern & Jernih)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS',
    maxZoom: 19
  },
  {
    name: "Esri World Topo Map (Topografi & Kontur)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap',
    maxZoom: 19
  },
  {
    name: "Esri World Imagery (Foto Satelit Nyata)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS',
    maxZoom: 18
  },
  {
    name: "Esri Light Gray Canvas (Minimalis Estetik)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
  }
];

// ================= DOM ELEMENTS =================
const elements = {
  tourismCardsContainer: document.getElementById("tourismCardsContainer"),
  categoryFilterContainer: document.getElementById("categoryFilterContainer"),
  searchInput: document.getElementById("searchInput"),
  btnClearSearch: document.getElementById("btnClearSearch"),
  spotCounterBadge: document.getElementById("spotCounterBadge"),
  userLocationLabel: document.getElementById("userLocationLabel"),
  btnRefreshLocation: document.getElementById("btnRefreshLocation"),
  btnMyLocation: document.getElementById("btnMyLocation"),
  btnFitAllSpots: document.getElementById("btnFitAllSpots"),
  btnToggleTile: document.getElementById("btnToggleTile"),
  desktopSidebar: document.getElementById("desktopSidebar"),
  btnCollapseSidebar: document.getElementById("btnCollapseSidebar"),
  btnOpenSidebar: document.getElementById("btnOpenSidebar"),

  // Mobile drawer elements
  mobileDrawer: document.getElementById("mobileDrawer"),
  mobileDrawerHeader: document.getElementById("mobileDrawerHeader"),
  btnToggleMobileDrawer: document.getElementById("btnToggleMobileDrawer"),
  btnToggleDrawerIcon: document.getElementById("btnToggleDrawerIcon"),
  mobileCountBadge: document.getElementById("mobileCountBadge"),
  mobileSearchInput: document.getElementById("mobileSearchInput"),
  mobileCategoryFilterContainer: document.getElementById("mobileCategoryFilterContainer"),
  mobileCardsContainer: document.getElementById("mobileCardsContainer"),

  // Route HUD
  routeHudCard: document.getElementById("routeHudCard"),
  routeDestTitle: document.getElementById("routeDestTitle"),
  routeDistanceVal: document.getElementById("routeDistanceVal"),
  routeDurationVal: document.getElementById("routeDurationVal"),
  btnCloseRouteHud: document.getElementById("btnCloseRouteHud"),
  btnFocusRoute: document.getElementById("btnFocusRoute"),
  btnExternalGoogleMaps: document.getElementById("btnExternalGoogleMaps"),
  btnResetRoute: document.getElementById("btnResetRoute"),

  // Detail Modal
  detailModal: document.getElementById("detailModal"),
  btnCloseModal: document.getElementById("btnCloseModal"),
  modalImg: document.getElementById("modalImg"),
  modalCategoryBadge: document.getElementById("modalCategoryBadge"),
  modalTitle: document.getElementById("modalTitle"),
  modalLocation: document.getElementById("modalLocation"),
  modalRating: document.getElementById("modalRating"),
  modalPrice: document.getElementById("modalPrice"),
  modalHours: document.getElementById("modalHours"),
  modalDescription: document.getElementById("modalDescription"),
  modalTagsContainer: document.getElementById("modalTagsContainer"),
  btnModalRoute: document.getElementById("btnModalRoute"),

  // Toast
  toastContainer: document.getElementById("toastContainer"),

  // Admin Add Location Modal & Picker
  addLocationModal: document.getElementById("addLocationModal"),
  addLocationForm: document.getElementById("addLocationForm"),
  btnOpenAddLocationModal: document.getElementById("btnOpenAddLocationModal"),
  btnOpenAddModalMobile: document.getElementById("btnOpenAddModalMobile"),
  btnCloseAddModal: document.getElementById("btnCloseAddModal"),
  btnCancelAddModal: document.getElementById("btnCancelAddModal"),
  btnPickOnMap: document.getElementById("btnPickOnMap"),
  btnCancelMapPicker: document.getElementById("btnCancelMapPicker"),
  mapPickerBanner: document.getElementById("mapPickerBanner"),
  btnAutoPhoto: document.getElementById("btnAutoPhoto"),
  addName: document.getElementById("addName"),
  addRegion: document.getElementById("addRegion"),
  addCategory: document.getElementById("addCategory"),
  addLocation: document.getElementById("addLocation"),
  addLat: document.getElementById("addLat"),
  addLng: document.getElementById("addLng"),
  addImage: document.getElementById("addImage"),
  addTicketPrice: document.getElementById("addTicketPrice"),
  addHours: document.getElementById("addHours"),
  addRating: document.getElementById("addRating"),
  addDescription: document.getElementById("addDescription"),
  addTags: document.getElementById("addTags"),
  addWeather: document.getElementById("addWeather"),
  addRoadCondition: document.getElementById("addRoadCondition"),
  addTraffic: document.getElementById("addTraffic"),

  // Admin Auth Modal & Controls
  adminAuthModal: document.getElementById("adminAuthModal"),
  btnCloseAdminAuthModal: document.getElementById("btnCloseAdminAuthModal"),
  btnAdminAuth: document.getElementById("btnAdminAuth"),
  btnAdminAuthMobile: document.getElementById("btnAdminAuthMobile"),
  adminAuthIcon: document.getElementById("adminAuthIcon"),
  adminAuthIconMobile: document.getElementById("adminAuthIconMobile"),
  adminAuthText: document.getElementById("adminAuthText"),
  adminLoginFormContainer: document.getElementById("adminLoginFormContainer"),
  adminLoggedInContainer: document.getElementById("adminLoggedInContainer"),
  supabaseStatusBanner: document.getElementById("supabaseStatusBanner"),
  adminLoginForm: document.getElementById("adminLoginForm"),
  inputAdminEmail: document.getElementById("inputAdminEmail"),
  inputAdminPassword: document.getElementById("inputAdminPassword"),
  adminLoginError: document.getElementById("adminLoginError"),
  btnSubmitAdminLogin: document.getElementById("btnSubmitAdminLogin"),
  adminUserEmailDisplay: document.getElementById("adminUserEmailDisplay"),
  btnTriggerAddFromAuthModal: document.getElementById("btnTriggerAddFromAuthModal"),
  btnAdminLogout: document.getElementById("btnAdminLogout")
};

// ================= COLOR & PHOTO HELPERS =================
function getCategoryColor(category) {
  switch ((category || "").toLowerCase()) {
    case "pantai": return "cyan";
    case "alam": return "emerald";
    case "budaya": return "purple";
    case "sejarah": return "amber";
    default: return "emerald";
  }
}

function getDefaultCategoryPhoto(category) {
  switch ((category || "").toLowerCase()) {
    case "pantai":
      return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80";
    case "alam":
      return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80";
    case "budaya":
      return "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1000&q=80";
    case "sejarah":
      return "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80";
    default:
      return "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=80";
  }
}

// ================= INITIALIZATION =================
document.addEventListener("DOMContentLoaded", async () => {
  initMap();
  setupCategoryFilters();
  renderTourismCards();
  initGeolocation();
  setupEventListeners();
  setupAdminAuthEvents();
  await initAdminAuth();
  await syncDestinationsFromSupabase();
  refreshIcons();
});

// ================= MAP INITIALIZATION =================
function initMap() {
  // Hitung initial center berdasarkan rata-rata koordinat destinasi
  const totalSpots = allDestinations.length || 1;
  const avgLat = allDestinations.reduce((sum, d) => sum + d.lat, 0) / totalSpots;
  const avgLng = allDestinations.reduce((sum, d) => sum + d.lng, 0) / totalSpots;

  map = L.map("map", {
    center: [avgLat, avgLng],
    zoom: 11,
    zoomControl: false
  });

  // Tambahkan zoom control di kanan bawah agar tidak terhalang floating sidebar
  L.control.zoom({ position: "bottomright" }).addTo(map);

  // Set default tile layer
  setMapTile(0);

  // Listener saat popup terbuka agar icon selalu ter-render dengan baik
  map.on("popupopen", () => {
    refreshIcons();
  });

  // Listener klik pada peta untuk pemilihan koordinat (Admin Mode)
  map.on("click", (e) => {
    if (isMapPickerActive) {
      const lat = parseFloat(e.latlng.lat.toFixed(6));
      const lng = parseFloat(e.latlng.lng.toFixed(6));

      if (elements.addLat) elements.addLat.value = lat;
      if (elements.addLng) elements.addLng.value = lng;

      // Hapus marker sementara sebelumnya jika ada
      if (tempPickerMarker) {
        map.removeLayer(tempPickerMarker);
      }

      // Pasang marker sementara di titik yang dipilih
      const pickerIcon = L.divIcon({
        className: "temp-picker-pin",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        html: `
          <div class="w-9 h-9 rounded-2xl bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        `
      });

      tempPickerMarker = L.marker([lat, lng], { icon: pickerIcon }).addTo(map);

      // Matikan mode picker dan tampilkan kembali modal form
      isMapPickerActive = false;
      if (elements.mapPickerBanner) elements.mapPickerBanner.classList.add("hidden");
      map.getContainer().style.cursor = "";
      if (elements.addLocationModal) elements.addLocationModal.classList.remove("hidden");

      showToast(`📍 Koordinat dipilih: ${lat}, ${lng}`, "success", 3000);
    }
  });

  // Render semua marker destinasi wisata
  renderMarkers();

  // FOKUS TERKUNCI (FOCUSED BOUNDS):
  // Menyesuaikan viewport kamera peta otomatis mencakup semua titik wisata
  fitAllTourismSpots(false);
}

// Fungsi mengganti Tile Layer Peta
function setMapTile(index) {
  if (currentTileLayer) {
    map.removeLayer(currentTileLayer);
  }
  currentTileIndex = index % TILE_LAYERS.length;
  const tileConfig = TILE_LAYERS[currentTileIndex];

  const layerOptions = {
    attribution: tileConfig.attribution,
    maxZoom: tileConfig.maxZoom
  };
  if (tileConfig.subdomains) {
    layerOptions.subdomains = tileConfig.subdomains;
  }

  currentTileLayer = L.tileLayer(tileConfig.url, layerOptions).addTo(map);
}

// ================= FOCUSED BOUNDS (FIT ALL SPOTS) =================
function fitAllTourismSpots(animated = true) {
  if (!allDestinations || allDestinations.length === 0) return;

  const spotsToFit = allDestinations.filter(item => {
    return activeRegionFilter === "Semua" || item.region === activeRegionFilter;
  });

  const finalSpots = spotsToFit.length > 0 ? spotsToFit : allDestinations;
  const latLngs = finalSpots.map(item => [item.lat, item.lng]);
  const bounds = L.latLngBounds(latLngs);

  // Berikan padding agar marker tidak mepet di tepi layar, terutama di desktop dengan sidebar
  const isMobile = window.innerWidth < 768;
  const paddingOptions = isMobile
    ? { padding: [60, 40], maxZoom: 13, animate: animated }
    : { paddingTopLeft: [420, 60], paddingBottomRight: [60, 60], maxZoom: 13, animate: animated };

  map.fitBounds(bounds, paddingOptions);
}

// ================= CUSTOM MARKERS & POPUPS =================
function getCategoryIconSvg(category) {
  switch ((category || "").toLowerCase()) {
    case "pantai":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2c1.66 0 3 1.34 3 3v11"/><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-2c-1.66 0-3-1.34-3-3"/><path d="M5.8 15.5c1.5 1.5 3.5 2.5 5.7 2.5 2 0 3.8-.8 5.2-2.1"/><path d="M11 22v-9"/></svg>`;
    case "alam":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7l-3.3-4.3a1 1 0 0 0-1.4 0L9 7.3a1 1 0 0 0 .8 1.7H10l-3 3.3a1 1 0 0 0 .7 1.7H9l-3 3.3a1 1 0 0 0 .7 1.7H12Z"/></svg>`;
    case "budaya":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`;
    case "sejarah":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"/><path d="M18 11V4H6v7"/><path d="M15 22v-4a3 3 0 0 0-6 0v4"/><path d="M22 11V9"/><path d="M2 11V9"/><path d="M6 4V2"/><path d="M18 4V2"/><path d="M10 4V2"/><path d="M14 4V2"/></svg>`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
  }
}

function renderMarkers() {
  // Bersihkan marker lama jika ada
  Object.values(markersMap).forEach(marker => map.removeLayer(marker));
  markersMap = {};

  const spotsToRender = allDestinations.filter(item => {
    return activeRegionFilter === "Semua" || item.region === activeRegionFilter;
  });

  spotsToRender.forEach(spot => {
    const pinClass = `pin-${spot.categoryColor || getCategoryColor(spot.category)}`;
    const iconSvg = getCategoryIconSvg(spot.category);

    // Custom modern HTML DivIcon
    const customIcon = L.divIcon({
      className: "custom-pin",
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      popupAnchor: [0, -42],
      html: `
        <div class="pin-bubble ${pinClass}" data-id="${spot.id}">
          ${iconSvg}
        </div>
      `
    });

    const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map);

    // Popup Modern & Responsif
    const popupHtml = `
      <div class="font-sans overflow-hidden rounded-2xl">
        <div class="relative h-36 w-full overflow-hidden bg-slate-900">
          <img src="${spot.image}" alt="${spot.name}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
          
          <div class="absolute top-2.5 left-2.5 flex items-center gap-1">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/95 text-slate-800 shadow-sm backdrop-blur-sm">
              ${spot.category}
            </span>
            <span class="px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${spot.region === 'Timor' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'} shadow-sm">
              ${spot.region}
            </span>
            ${spot.isCustom ? `<span class="px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase bg-emerald-500 text-white shadow-sm">Admin</span>` : ''}
          </div>

          <div class="absolute top-2.5 right-2.5 flex items-center gap-1 bg-amber-500/95 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
            <span>★</span>
            <span>${spot.rating}</span>
          </div>

          <div class="absolute bottom-2 left-3 right-3 text-white">
            <h4 class="font-extrabold text-sm leading-snug drop-shadow truncate">${spot.name}</h4>
            <p class="text-[11px] text-slate-200 truncate opacity-90">${spot.location}</p>
          </div>
        </div>

        <div class="p-3 bg-white space-y-2.5">
          <!-- Live Conditions Quick Strip in Popup -->
          <div class="grid grid-cols-2 gap-1.5 py-1 px-2 bg-slate-50 rounded-xl text-[10px] font-semibold border border-slate-100">
            <span class="text-blue-700 flex items-center gap-1 truncate" title="${spot.weather?.condition || 'Cerah'}">
              <span>☀️</span> ${spot.weather?.temp || '30°C'} (${(spot.weather?.condition || 'Cerah').split(' ')[0]})
            </span>
            <span class="text-slate-700 flex items-center gap-1 justify-end truncate" title="Lalu Lintas: ${spot.traffic?.status || 'Lancar'}">
              <span class="traffic-dot-${spot.traffic?.level || 'low'}"></span> ${spot.traffic?.status || 'Lancar'}
            </span>
          </div>

          <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            ${spot.description}
          </p>

          <div class="flex items-center justify-between text-[11px] py-1 border-y border-slate-100 font-semibold text-slate-500">
            <span>Tiket: <strong class="text-slate-800 font-bold">${spot.ticketPrice}</strong></span>
            <span>Jalan: <strong class="text-slate-800 font-bold">${(spot.roadCondition?.status || 'Mulus').split(' ')[0]}</strong></span>
          </div>

          <div class="flex items-center gap-1.5 pt-0.5">
            <button onclick="window.handleRouteClick('${spot.id}')" class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg>
              <span>Tampilkan Rute Terbaik</span>
            </button>
            <button onclick="window.openDetailModal('${spot.id}')" class="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors" title="Lihat Detail Lengkap">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </button>
            ${(spot.isCustom && (!window.SupabaseService || !window.SupabaseService.isConfigured() || currentAdminUser)) ? `
              <button onclick="window.deleteCustomSpot('${spot.id}')" class="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors" title="Hapus Titik (Admin)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml, {
      maxWidth: 290,
      minWidth: 290,
      className: "custom-leaflet-popup",
      autoPanPadding: [20, 20]
    });

    marker.on("click", () => {
      focusDestination(spot.id, false);
    });

    markersMap[spot.id] = marker;
  });
}

// ================= USER GEOLOCATION =================
function initGeolocation() {
  if (elements.userLocationLabel) {
    elements.userLocationLabel.textContent = "Mencari sinyal GPS...";
  }

  if (!navigator.geolocation) {
    applyFallbackLocation("Browser Anda tidak mendukung geolokasi.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      currentUserLocation = {
        lat: lat,
        lng: lng,
        name: "Lokasi Anda (GPS Aktif)",
        isFallback: false
      };

      updateUserLocationMarker(lat, lng);
      if (elements.userLocationLabel) {
        elements.userLocationLabel.textContent = "Lokasi Anda Terdeteksi (GPS)";
      }
      showToast("📍 Lokasi GPS perangkat berhasil terdeteksi!", "success");
    },
    error => {
      let msg = "Akses lokasi ditolak.";
      if (error.code === error.TIMEOUT) msg = "Waktu deteksi lokasi habis.";
      else if (error.code === error.POSITION_UNAVAILABLE) msg = "Lokasi tidak tersedia.";

      applyFallbackLocation(`${msg} Menggunakan titik simulasi NTT.`);
    },
    {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 60000
    }
  );
}

function applyFallbackLocation(reason) {
  const currentFallback = REGIONAL_FALLBACK_LOCATIONS[activeRegionFilter] || REGIONAL_FALLBACK_LOCATIONS.Semua;
  currentUserLocation = {
    ...currentFallback,
    isFallback: true
  };

  updateUserLocationMarker(currentUserLocation.lat, currentUserLocation.lng);
  if (elements.userLocationLabel) {
    elements.userLocationLabel.textContent = `Titik Simulasi: ${activeRegionFilter === 'Timor' ? 'Kota Kupang' : 'Labuan Bajo'}, NTT`;
  }

  showToast(`⚠️ ${reason}`, "info", 4500);
}

function updateUserLocationMarker(lat, lng) {
  if (userLocationMarker) {
    map.removeLayer(userLocationMarker);
  }

  const radarIcon = L.divIcon({
    className: "user-radar-container",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    html: `
      <div class="user-radar-marker">
        <div class="user-radar-core"></div>
        <div class="user-radar-wave"></div>
      </div>
    `
  });

  userLocationMarker = L.marker([lat, lng], {
    icon: radarIcon,
    zIndexOffset: 1500
  }).addTo(map);

  const popupText = currentUserLocation.isFallback
    ? `<b>Lokasi Simulasi:</b> ${currentUserLocation.name}<br><small class="text-slate-500">Izin lokasi GPS tidak aktif</small>`
    : `<b>Lokasi Anda Sekarang</b><br><small class="text-emerald-600 font-semibold">● GPS Akurat</small>`;

  userLocationMarker.bindPopup(popupText);
}

// ================= ROUTING ENGINE (OSRM via Leaflet Routing Machine) =================
function calculateAndDisplayRoute(destination) {
  activeDestination = destination;

  // Bersihkan rute sebelumnya jika ada
  clearActiveRoute(false);

  showToast(`Mencari rute terbaik menuju ${destination.name}...`, "info", 2500);

  // Buat titik awal (user) dan tujuan
  const startLatLng = L.latLng(currentUserLocation.lat, currentUserLocation.lng);
  const endLatLng = L.latLng(destination.lat, destination.lng);

  try {
    routingControl = L.Routing.control({
      waypoints: [startLatLng, endLatLng],
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "driving"
      }),
      lineOptions: {
        styles: [
          { color: "#1e40af", opacity: 0.9, weight: 6 },
          { color: "#38bdf8", opacity: 1, weight: 2.5 }
        ],
        extendToWaypoints: true,
        missingRouteStyles: [{ color: "#f43f5e", opacity: 0.7, weight: 4, dashArray: "6, 8" }]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false, // Sembunyikan panel bawaan, kita gunakan HUD modern sendiri
      createMarker: () => null // Jangan buat marker default Leaflet Routing, gunakan custom marker kita
    }).addTo(map);

    // Event saat rute sukses ditemukan
    routingControl.on("routesfound", e => {
      const routes = e.routes;
      if (!routes || routes.length === 0) return;

      const summary = routes[0].summary;
      const distanceKm = summary.totalDistance / 1000;
      const totalSeconds = summary.totalTime;

      // Estimasi 3 Moda Transportasi
      const carMinutes = Math.max(1, Math.round(totalSeconds / 60));
      const motorMinutes = Math.max(1, Math.round(carMinutes * 0.8)); // Motor lebih lincah di perbukitan Flores/Timor
      const walkMinutes = Math.max(1, Math.round((distanceKm / 4.5) * 60)); // Jalan kaki rata-rata 4.5 km/jam

      // Update Floating HUD Card dengan 3 moda
      displayRouteHud(destination, distanceKm, carMinutes, motorMinutes, walkMinutes);
      showToast(`✨ Rute ke ${destination.name} ditemukan! Jarak: ${distanceKm.toFixed(1)} km`, "success", 4000);
    });

    // Event jika terjadi error koneksi ke OSRM publik
    routingControl.on("routingerror", err => {
      console.warn("OSRM Router Error, beralih ke kalkulasi rute langsung:", err);
      fallbackToStraightLineRoute(destination);
    });

  } catch (error) {
    console.error("Leaflet routing setup exception:", error);
    fallbackToStraightLineRoute(destination);
  }
}

// Fallback Route jika OSRM publik sedang overload / offline
function fallbackToStraightLineRoute(destination) {
  const start = [currentUserLocation.lat, currentUserLocation.lng];
  const end = [destination.lat, destination.lng];

  fallbackRoutePolyline = L.polyline([start, end], {
    color: "#2563eb",
    weight: 4,
    dashArray: "8, 8",
    opacity: 0.8
  }).addTo(map);

  // Hitung jarak Haversine (garis lurus dengan faktor kelokan kontur NTT 1.35x)
  const distKm = calculateHaversineDistance(start[0], start[1], end[0], end[1]) * 1.35;
  const carMins = Math.max(1, Math.round((distKm / 38) * 60));
  const motorMins = Math.max(1, Math.round(carMins * 0.8));
  const walkMins = Math.max(1, Math.round((distKm / 4.5) * 60));

  map.fitBounds(fallbackRoutePolyline.getBounds(), { padding: [80, 80] });

  displayRouteHud(destination, distKm, carMins, motorMins, walkMins);
  showToast("Menggunakan estimasi jarak jalur langsung (server rute OSRM sedang sibuk)", "info", 4000);
}

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius bumi dalam KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatTravelTime(minutes) {
  if (minutes < 60) return `${minutes} menit`;
  const hrs = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hrs} jam ${remainingMins} mnt` : `${hrs} jam`;
}

function selectTransportMode(mode) {
  currentRouteMetrics.activeMode = mode;

  const btnCar = document.getElementById("modeBtnCar");
  const btnMotor = document.getElementById("modeBtnMotor");
  const btnWalk = document.getElementById("modeBtnWalk");
  const labelEl = document.getElementById("activeModeLabel");
  const durationEl = document.getElementById("routeDurationVal");

  // Reset gaya semua tombol
  const inactiveClass = "mode-select-btn flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition-all active:scale-95 group";
  if (btnCar) btnCar.className = inactiveClass;
  if (btnMotor) btnMotor.className = inactiveClass;
  if (btnWalk) btnWalk.className = inactiveClass;

  let selectedDurationText = "";
  let googleTravelMode = "driving";

  if (mode === 'car') {
    if (btnCar) btnCar.className = "mode-select-btn flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-brand-600 text-white shadow-md transition-all active:scale-95 group";
    if (labelEl) labelEl.innerHTML = "🚗 Mobil";
    selectedDurationText = formatTravelTime(currentRouteMetrics.carMinutes);
    googleTravelMode = "driving";
  } else if (mode === 'motor') {
    if (btnMotor) btnMotor.className = "mode-select-btn flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-600 text-white shadow-md transition-all active:scale-95 group";
    if (labelEl) labelEl.innerHTML = "🛵 Motor";
    selectedDurationText = formatTravelTime(currentRouteMetrics.motorMinutes);
    googleTravelMode = "two_wheeler";
  } else if (mode === 'walk') {
    if (btnWalk) btnWalk.className = "mode-select-btn flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-amber-600 text-white shadow-md transition-all active:scale-95 group";
    if (labelEl) labelEl.innerHTML = "🚶 Jalan Kaki";
    selectedDurationText = formatTravelTime(currentRouteMetrics.walkMinutes);
    googleTravelMode = "walking";
  }

  if (durationEl) durationEl.textContent = selectedDurationText;

  if (activeDestination && elements.btnExternalGoogleMaps) {
    elements.btnExternalGoogleMaps.href = `https://www.google.com/maps/dir/?api=1&origin=${currentUserLocation.lat},${currentUserLocation.lng}&destination=${activeDestination.lat},${activeDestination.lng}&travelmode=${googleTravelMode}`;
  }
}

function displayRouteHud(destination, distanceKm, carMinutes, motorMinutes, walkMinutes) {
  currentRouteMetrics.distanceKm = distanceKm;
  currentRouteMetrics.carMinutes = carMinutes;
  currentRouteMetrics.motorMinutes = motorMinutes;
  currentRouteMetrics.walkMinutes = walkMinutes;

  elements.routeDestTitle.textContent = destination.name;
  elements.routeDistanceVal.textContent = `${distanceKm.toFixed(1)} km`;

  const etaCarEl = document.getElementById("etaValCar");
  const etaMotorEl = document.getElementById("etaValMotor");
  const etaWalkEl = document.getElementById("etaValWalk");

  if (etaCarEl) etaCarEl.textContent = formatTravelTime(carMinutes);
  if (etaMotorEl) etaMotorEl.textContent = formatTravelTime(motorMinutes);
  if (etaWalkEl) etaWalkEl.textContent = formatTravelTime(walkMinutes);

  // Update Live Route Conditions (Cuaca, Jalan, Kepadatan)
  const weatherTextEl = document.getElementById("routeWeatherText");
  const roadTextEl = document.getElementById("routeRoadText");
  const trafficTextEl = document.getElementById("routeTrafficText");

  if (weatherTextEl && destination.weather) {
    weatherTextEl.textContent = `${destination.weather.temp} ${destination.weather.condition}`;
  }
  if (roadTextEl && destination.roadCondition) {
    roadTextEl.textContent = destination.roadCondition.status;
  }
  if (trafficTextEl && destination.traffic) {
    trafficTextEl.textContent = `${destination.traffic.status} (${destination.traffic.speedAvg})`;
  }

  selectTransportMode(currentRouteMetrics.activeMode || 'car');

  elements.routeHudCard.classList.remove("hidden");
  refreshIcons();

  // Jika di mobile, sembunyikan drawer sepenuhnya agar HUD rute leluasa tanpa bertumpuk
  if (window.innerWidth < 768) {
    hideMobileDrawerCompletely();
  } else {
    closeMobileDrawer();
  }
}

function clearActiveRoute(notify = true) {
  if (routingControl) {
    map.removeControl(routingControl);
    routingControl = null;
  }
  if (fallbackRoutePolyline) {
    map.removeLayer(fallbackRoutePolyline);
    fallbackRoutePolyline = null;
  }

  activeDestination = null;
  elements.routeHudCard.classList.add("hidden");

  // Jika di mobile, kembalikan drawer ke posisi intip (peek)
  if (window.innerWidth < 768) {
    closeMobileDrawer();
  }

  if (notify) {
    showToast("Jalur rute telah dihapus.", "info");
  }
}

// ================= SIDEBAR & CARDS RENDERING =================
function setupCategoryFilters() {
  const categories = ["Semua", "Pantai", "Alam", "Budaya", "Sejarah"];

  const buildPill = (cat, isMobile = false) => {
    const regionSpots = allDestinations.filter(d => activeRegionFilter === "Semua" || d.region === activeRegionFilter);
    const count = cat === "Semua"
      ? regionSpots.length
      : regionSpots.filter(d => d.category.toLowerCase() === cat.toLowerCase()).length;

    const isActive = activeCategoryFilter.toLowerCase() === cat.toLowerCase();
    const activeClass = isActive
      ? "bg-brand-600 text-white shadow-md shadow-brand-500/25"
      : "bg-slate-100 text-slate-600 hover:bg-slate-200/80";

    return `
      <button 
        onclick="window.handleCategorySelect('${cat}')" 
        class="category-pill flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${activeClass}">
        <span>${cat}</span>
        <span class="text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'} px-1.5 py-0.2 rounded-full font-bold">
          ${count}
        </span>
      </button>
    `;
  };

  elements.categoryFilterContainer.innerHTML = categories.map(c => buildPill(c, false)).join("");
  elements.mobileCategoryFilterContainer.innerHTML = categories.map(c => buildPill(c, true)).join("");
}

function getFilteredDestinations() {
  return allDestinations.filter(item => {
    const matchesRegion = activeRegionFilter === "Semua" || item.region === activeRegionFilter;
    const matchesCategory = activeCategoryFilter === "Semua" ||
      item.category.toLowerCase() === activeCategoryFilter.toLowerCase();

    const query = currentSearchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.region.toLowerCase().includes(query);

    return matchesRegion && matchesCategory && matchesSearch;
  });
}

function handleRegionSelect(region) {
  activeRegionFilter = region;

  // Update style tombol tab wilayah di desktop & mobile
  ["Semua", "Flores", "Timor"].forEach(r => {
    const dBtn = document.getElementById(`regionBtn-${r}`);
    const mBtn = document.getElementById(`mRegionBtn-${r}`);
    const isActive = (r === region);

    [dBtn, mBtn].forEach(btn => {
      if (btn) {
        if (isActive) {
          btn.className = btn.id.startsWith("m")
            ? "region-tab-mobile flex-1 py-1 rounded-lg text-center transition-all bg-brand-600 text-white shadow-xs font-bold"
            : "region-tab flex-1 py-1.5 px-1 rounded-xl text-center transition-all bg-brand-600 text-white shadow-xs font-bold";
        } else {
          btn.className = btn.id.startsWith("m")
            ? "region-tab-mobile flex-1 py-1 rounded-lg text-center transition-all text-slate-600 font-bold"
            : "region-tab flex-1 py-1.5 px-1 rounded-xl text-center transition-all text-slate-600 hover:text-slate-900 font-bold";
        }
      }
    });
  });

  // Jika pengguna sedang menggunakan titik simulasi GPS (fallback), sesuaikan titik awal ke ibukota wilayah yang dipilih
  if (currentUserLocation.isFallback) {
    const targetFallback = REGIONAL_FALLBACK_LOCATIONS[region] || REGIONAL_FALLBACK_LOCATIONS.Semua;
    currentUserLocation = {
      ...targetFallback,
      isFallback: true
    };
    updateUserLocationMarker(currentUserLocation.lat, currentUserLocation.lng);
    if (elements.userLocationLabel) {
      elements.userLocationLabel.textContent = `Titik Simulasi: ${region === 'Timor' ? 'Kota Kupang' : 'Labuan Bajo'}, NTT`;
    }
    showToast(`📍 Menyesuaikan rute simulasi ke ${region === 'Semua' ? 'Seluruh NTT' : 'Wilayah ' + region}`, 'info', 2500);
  }

  // Refresh view
  renderMarkers();
  renderTourismCards();
  setupCategoryFilters();

  // Fokus kamera peta ke seluruh titik wisata wilayah tersebut
  fitAllTourismSpots(true);
}

function renderTourismCards() {
  const filtered = getFilteredDestinations();

  // Update badge jumlah destinasi
  if (elements.spotCounterBadge) elements.spotCounterBadge.textContent = `${filtered.length} Destinasi`;
  if (elements.mobileCountBadge) elements.mobileCountBadge.textContent = filtered.length;

  // Update tab counts
  const countSemua = allDestinations.length;
  const countFlores = allDestinations.filter(d => d.region === "Flores").length;
  const countTimor = allDestinations.filter(d => d.region === "Timor").length;

  const elCountSemua = document.getElementById("countSemua");
  const elCountFlores = document.getElementById("countFlores");
  const elCountTimor = document.getElementById("countTimor");
  const elMCountSemua = document.getElementById("mCountSemua");
  const elMCountFlores = document.getElementById("mCountFlores");
  const elMCountTimor = document.getElementById("mCountTimor");

  if (elCountSemua) elCountSemua.textContent = countSemua;
  if (elCountFlores) elCountFlores.textContent = countFlores;
  if (elCountTimor) elCountTimor.textContent = countTimor;
  if (elMCountSemua) elMCountSemua.textContent = countSemua;
  if (elMCountFlores) elMCountFlores.textContent = countFlores;
  if (elMCountTimor) elMCountTimor.textContent = countTimor;

  if (filtered.length === 0) {
    const emptyHtml = `
      <div class="text-center py-10 px-4">
        <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <i data-lucide="map-pin-off" class="w-6 h-6"></i>
        </div>
        <p class="text-xs font-bold text-slate-700">Tidak ada destinasi ditemukan</p>
        <p class="text-[11px] text-slate-400 mt-1">Coba gunakan kata kunci pencarian atau filter kategori lain.</p>
        <button onclick="window.resetFilters()" class="mt-3 text-xs font-bold text-brand-600 hover:underline">
          Reset Filter
        </button>
      </div>
    `;
    elements.tourismCardsContainer.innerHTML = emptyHtml;
    elements.mobileCardsContainer.innerHTML = emptyHtml;
    refreshIcons();
    return;
  }

  const buildCard = (spot) => {
    const trafficDotClass = (spot.traffic?.level === 'moderate') ? 'traffic-dot-moderate' : ((spot.traffic?.level === 'high') ? 'traffic-dot-high' : 'traffic-dot-low');
    const regionBadgeClass = spot.region === 'Timor' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800';

    return `
      <div 
        id="card-${spot.id}"
        class="tourism-card group bg-white/95 hover:bg-white rounded-2xl p-3 border border-slate-200/70 hover:border-brand-500/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
        onclick="window.focusDestination('${spot.id}', true)">
        
        <div class="flex gap-3">
          <!-- Thumbnail Image -->
          <div class="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
            <img src="${spot.image}" alt="${spot.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
            <span class="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-white/90 text-slate-800 shadow-sm">
              ${spot.category}
            </span>
            ${spot.isCustom ? `<span class="absolute bottom-1.5 left-1.5 px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase bg-emerald-600 text-white shadow-sm">Admin</span>` : ''}
          </div>

          <!-- Card Content -->
          <div class="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-1">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="px-1.5 py-0.2 rounded text-[9px] font-extrabold ${regionBadgeClass}">
                    ${spot.region}
                  </span>
                  <h3 class="font-extrabold text-xs text-slate-800 truncate group-hover:text-brand-600 transition-colors">
                    ${spot.name}
                  </h3>
                </div>
                <div class="flex items-center gap-1 text-[11px] font-bold text-amber-500 flex-shrink-0">
                  <i data-lucide="star" style="width: 12px; height: 12px;" class="fill-amber-400 text-amber-400"></i>
                  <span>${spot.rating}</span>
                </div>
              </div>

              <p class="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                <i data-lucide="map-pin" style="width: 11px; height: 11px;" class="text-slate-400 flex-shrink-0"></i>
                <span class="truncate">${spot.location}</span>
              </p>

              <!-- Live Conditions Indicator Strip -->
              <div class="flex items-center gap-1.5 mt-1.5 py-1 px-1.5 bg-slate-50/90 rounded-lg text-[10px] border border-slate-100">
                <span class="flex items-center gap-1 text-blue-700 font-semibold truncate" title="Cuaca: ${spot.weather?.condition || 'Cerah'}">
                  <span>☀️</span> ${spot.weather?.temp || '30°C'}
                </span>
                <span class="text-slate-300">|</span>
                <span class="flex items-center gap-1 font-semibold truncate text-slate-700" title="Jalan: ${spot.roadCondition?.description || 'Mulus'}">
                  <span>🛣️</span> ${(spot.roadCondition?.status || 'Mulus').split(' ')[0]}
                </span>
                <span class="text-slate-300">|</span>
                <span class="flex items-center gap-1 font-bold ${spot.traffic?.level === 'low' ? 'text-emerald-600' : 'text-amber-600'} truncate" title="Lalu Lintas: ${spot.traffic?.status || 'Lancar'}">
                  <span class="${trafficDotClass}"></span> ${(spot.traffic?.status || 'Lancar').split(' ')[0]}
                </span>
              </div>
            </div>

            <!-- Card Bottom Action -->
            <div class="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
              <span class="text-[10px] font-bold text-slate-700">${spot.ticketPrice}</span>
              
              <div class="flex items-center gap-1.5" onclick="event.stopPropagation()">
                ${(spot.isCustom && (!window.SupabaseService || !window.SupabaseService.isConfigured() || currentAdminUser)) ? `
                  <button 
                    onclick="window.deleteCustomSpot('${spot.id}')"
                    class="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" 
                    title="Hapus Titik (Admin)">
                    <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                  </button>
                ` : ''}
                <button 
                  onclick="window.openDetailModal('${spot.id}')"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" 
                  title="Detail">
                  <i data-lucide="info" style="width: 13px; height: 13px;"></i>
                </button>
                <button 
                  onclick="window.handleRouteClick('${spot.id}')"
                  class="flex items-center gap-1 py-1 px-2.5 bg-brand-50 hover:bg-brand-600 text-brand-600 hover:text-white rounded-lg text-[10px] font-bold transition-all shadow-sm">
                  <i data-lucide="navigation-2" style="width: 11px; height: 11px;"></i>
                  <span>Rute</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const cardsHtml = filtered.map(spot => buildCard(spot)).join("");
  elements.tourismCardsContainer.innerHTML = cardsHtml;
  elements.mobileCardsContainer.innerHTML = cardsHtml;
  refreshIcons();
}

// ================= INTERACTION SYNC =================
function focusDestination(spotId, shouldFly = true) {
  const spot = allDestinations.find(d => d.id === spotId);
  if (!spot) return;

  const marker = markersMap[spotId];
  if (!marker) return;

  // Highlight card di sidebar
  document.querySelectorAll(".tourism-card").forEach(el => {
    el.classList.remove("ring-2", "ring-brand-500", "bg-blue-50/50");
  });
  const activeCard = document.getElementById(`card-${spotId}`);
  if (activeCard) {
    activeCard.classList.add("ring-2", "ring-brand-500", "bg-blue-50/50");
    activeCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Smooth FlyTo Map
  if (shouldFly) {
    map.flyTo([spot.lat, spot.lng], 14, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }

  // Buka popup
  setTimeout(() => {
    marker.openPopup();
    refreshIcons();
  }, shouldFly ? 600 : 50);

  // Jika mobile, minimize drawer agar peta terlihat
  if (window.innerWidth < 768) {
    closeMobileDrawer();
  }
}

// ================= DETAIL MODAL =================
function openDetailModal(spotId) {
  const spot = allDestinations.find(d => d.id === spotId);
  if (!spot) return;

  elements.modalImg.src = spot.image;
  elements.modalCategoryBadge.textContent = spot.category;
  elements.modalTitle.textContent = spot.name;
  elements.modalLocation.querySelector("span").textContent = spot.location;
  elements.modalRating.textContent = `${spot.rating} (${spot.reviewsCount || 1} ulasan)`;
  elements.modalPrice.textContent = spot.ticketPrice;
  elements.modalHours.textContent = spot.openingHours;
  elements.modalDescription.textContent = spot.description;

  // Render tags
  elements.modalTagsContainer.innerHTML = (spot.tags || [])
    .map(tag => `<span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-semibold"># ${tag}</span>`)
    .join("");

  // Estimasi 3 Moda Transportasi dari Titik Pengguna
  const approxDistanceKm = calculateHaversineDistance(
    currentUserLocation.lat,
    currentUserLocation.lng,
    spot.lat,
    spot.lng
  ) * 1.35; // Faktor kelokan kontur jalan NTT
  const approxCarMins = Math.max(1, Math.round((approxDistanceKm / 38) * 60));
  const approxMotorMins = Math.max(1, Math.round(approxCarMins * 0.8));
  const approxWalkMins = Math.max(1, Math.round((approxDistanceKm / 4.5) * 60));

  const elCar = document.getElementById("modalEtaCar");
  const elMotor = document.getElementById("modalEtaMotor");
  const elWalk = document.getElementById("modalEtaWalk");
  if (elCar) elCar.textContent = formatTravelTime(approxCarMins);
  if (elMotor) elMotor.textContent = formatTravelTime(approxMotorMins);
  if (elWalk) elWalk.textContent = formatTravelTime(approxWalkMins);

  // Update Live Weather & Road & Traffic in Modal
  if (spot.weather) {
    const elTemp = document.getElementById("modalWeatherTemp");
    const elCond = document.getElementById("modalWeatherCond");
    const elDetails = document.getElementById("modalWeatherDetails");
    if (elTemp) elTemp.textContent = spot.weather.temp;
    if (elCond) elCond.textContent = spot.weather.condition;
    if (elDetails) elDetails.textContent = `Kelembaban: ${spot.weather.humidity || '70%'} | Angin: ${spot.weather.windSpeed || '12 km/jam'}`;
  }

  if (spot.roadCondition) {
    const elRoadStatus = document.getElementById("modalRoadStatus");
    const elRoadDesc = document.getElementById("modalRoadDesc");
    if (elRoadStatus) elRoadStatus.textContent = spot.roadCondition.status;
    if (elRoadDesc) elRoadDesc.textContent = `${spot.roadCondition.description} — ${spot.roadCondition.recommendation || ''}`;
  }

  if (spot.traffic) {
    const elTrafficStatus = document.getElementById("modalTrafficStatus");
    const elTrafficSpeed = document.getElementById("modalTrafficSpeed");
    const elTrafficNotes = document.getElementById("modalTrafficNotes");
    const elTrafficDot = document.getElementById("modalTrafficDot");
    if (elTrafficStatus) elTrafficStatus.textContent = spot.traffic.status;
    if (elTrafficSpeed) elTrafficSpeed.textContent = `Kecepatan: ~${spot.traffic.speedAvg || '40 km/jam'}`;
    if (elTrafficNotes) elTrafficNotes.textContent = spot.traffic.notes;
    if (elTrafficDot) {
      elTrafficDot.className = `w-2 h-2 rounded-full ${spot.traffic.level === 'low' ? 'bg-emerald-500' : (spot.traffic.level === 'moderate' ? 'bg-amber-500' : 'bg-rose-500')} animate-pulse`;
    }
  }

  // Setup tombol rute di modal
  elements.btnModalRoute.onclick = () => {
    elements.detailModal.classList.add("hidden");
    calculateAndDisplayRoute(spot);
  };

  elements.detailModal.classList.remove("hidden");
  refreshIcons();
}

function closeDetailModal() {
  elements.detailModal.classList.add("hidden");
}

// ================= DELETE CUSTOM SPOT (ADMIN) =================
async function deleteCustomSpot(spotId) {
  const spot = allDestinations.find(s => s.id === spotId);
  if (!spot) return;

  // Jika Supabase aktif dan user bukan admin yang login
  if (window.SupabaseService && window.SupabaseService.isConfigured() && !currentAdminUser) {
    showToast("Aksi Ditolak: Hanya Admin yang dapat menghapus titik wisata.", "error", 3500);
    openAdminAuthModal();
    return;
  }

  if (!confirm(`Hapus destinasi "${spot.name}" dari daftar wisata?`)) {
    return;
  }

  if (window.SupabaseService && window.SupabaseService.isConfigured()) {
    try {
      showToast(`Menghapus "${spot.name}" dari Supabase...`, "info", 2000);
      await window.SupabaseService.deleteDestination(spotId);
    } catch (err) {
      console.error("Gagal menghapus dari Supabase:", err);
      showToast(`Gagal menghapus dari database: ${err.message}`, "error", 4000);
      return;
    }
  } else {
    let customSpots = getCustomSpots();
    customSpots = customSpots.filter(s => s.id !== spotId);
    saveCustomSpots(customSpots);
  }

  allDestinations = allDestinations.filter(s => s.id !== spotId);

  if (markersMap[spotId]) {
    map.removeLayer(markersMap[spotId]);
    delete markersMap[spotId];
  }

  if (activeDestination && activeDestination.id === spotId) {
    clearActiveRoute(false);
  }

  renderMarkers();
  renderTourismCards();
  setupCategoryFilters();

  showToast(`Titik wisata "${spot.name}" berhasil dihapus.`, "info", 3000);
}

// ================= SUPABASE & ADMIN AUTHENTICATION =================
let currentAdminUser = null;

function updateAdminAuthUI() {
  const isConfigured = window.SupabaseService && window.SupabaseService.isConfigured();

  // Banner status Supabase di dalam modal
  if (elements.supabaseStatusBanner) {
    if (isConfigured) {
      elements.supabaseStatusBanner.classList.add("hidden");
    } else {
      elements.supabaseStatusBanner.classList.remove("hidden");
    }
  }

  if (currentAdminUser) {
    // Mode Admin Terautentikasi
    if (elements.adminAuthText) {
      elements.adminAuthText.textContent = "Admin Aktif";
      elements.adminAuthText.className = "text-xs font-bold text-emerald-600 hidden sm:inline";
    }
    if (elements.adminAuthIcon) {
      elements.adminAuthIcon.setAttribute("data-lucide", "shield-check");
      elements.adminAuthIcon.classList.remove("text-slate-500");
      elements.adminAuthIcon.classList.add("text-emerald-500");
    }
    if (elements.adminAuthIconMobile) {
      elements.adminAuthIconMobile.setAttribute("data-lucide", "shield-check");
      elements.adminAuthIconMobile.classList.remove("text-slate-500");
      elements.adminAuthIconMobile.classList.add("text-emerald-500");
    }
    if (elements.adminLoginFormContainer) elements.adminLoginFormContainer.classList.add("hidden");
    if (elements.adminLoggedInContainer) elements.adminLoggedInContainer.classList.remove("hidden");
    if (elements.adminUserEmailDisplay) elements.adminUserEmailDisplay.textContent = currentAdminUser.email || "Admin";
  } else {
    // Mode Publik / Tamu
    if (elements.adminAuthText) {
      elements.adminAuthText.textContent = "Admin";
      elements.adminAuthText.className = "text-xs font-bold text-slate-700 hidden sm:inline";
    }
    if (elements.adminAuthIcon) {
      elements.adminAuthIcon.setAttribute("data-lucide", "lock");
      elements.adminAuthIcon.classList.remove("text-emerald-500");
      elements.adminAuthIcon.classList.add("text-slate-500");
    }
    if (elements.adminAuthIconMobile) {
      elements.adminAuthIconMobile.setAttribute("data-lucide", "lock");
      elements.adminAuthIconMobile.classList.remove("text-emerald-500");
      elements.adminAuthIconMobile.classList.add("text-slate-500");
    }
    if (elements.adminLoginFormContainer) elements.adminLoginFormContainer.classList.remove("hidden");
    if (elements.adminLoggedInContainer) elements.adminLoggedInContainer.classList.add("hidden");
  }

  refreshIcons();
}

function openAdminAuthModal() {
  if (elements.adminAuthModal) {
    updateAdminAuthUI();
    if (elements.adminLoginError) elements.adminLoginError.classList.add("hidden");
    elements.adminAuthModal.classList.remove("hidden");
    refreshIcons();
  }
}

function closeAdminAuthModal() {
  if (elements.adminAuthModal) {
    elements.adminAuthModal.classList.add("hidden");
  }
}

async function initAdminAuth() {
  if (!window.SupabaseService || !window.SupabaseService.isConfigured()) {
    updateAdminAuthUI();
    return;
  }

  try {
    const user = await window.SupabaseService.getAdminSession();
    currentAdminUser = user;
    updateAdminAuthUI();

    const client = window.SupabaseService.getClient();
    if (client && client.auth) {
      client.auth.onAuthStateChange((_event, session) => {
        currentAdminUser = session?.user || null;
        updateAdminAuthUI();
        renderMarkers();
        renderTourismCards();
      });
    }
  } catch (err) {
    console.warn("Gagal inisialisasi sesi admin Supabase:", err);
  }
}

async function syncDestinationsFromSupabase() {
  if (!window.SupabaseService || !window.SupabaseService.isConfigured()) {
    return;
  }

  try {
    const onlineData = await window.SupabaseService.fetchDestinations();
    if (onlineData && onlineData.length > 0) {
      console.log(`⚡ [Supabase] Berhasil memuat ${onlineData.length} destinasi dari Supabase.`);
      allDestinations = onlineData;
      renderMarkers();
      renderTourismCards();
      setupCategoryFilters();
      refreshIcons();
    }
  } catch (err) {
    console.warn("⚠️ Gagal memuat data dari Supabase, tetap menggunakan data lokal:", err);
  }
}

function setupAdminAuthEvents() {
  if (elements.btnAdminAuth) {
    elements.btnAdminAuth.addEventListener("click", openAdminAuthModal);
  }
  if (elements.btnAdminAuthMobile) {
    elements.btnAdminAuthMobile.addEventListener("click", openAdminAuthModal);
  }
  if (elements.btnCloseAdminAuthModal) {
    elements.btnCloseAdminAuthModal.addEventListener("click", closeAdminAuthModal);
  }
  if (elements.adminAuthModal) {
    elements.adminAuthModal.addEventListener("click", (e) => {
      if (e.target === elements.adminAuthModal) closeAdminAuthModal();
    });
  }

  // Submit Login Form
  if (elements.adminLoginForm) {
    elements.adminLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!window.SupabaseService || !window.SupabaseService.isConfigured()) {
        if (elements.adminLoginError) {
          elements.adminLoginError.textContent = "Supabase belum dikonfigurasi. Silakan isi SUPABASE_CONFIG di js/supabase-config.js terlebih dahulu.";
          elements.adminLoginError.classList.remove("hidden");
        }
        return;
      }

      const email = elements.inputAdminEmail.value.trim();
      const password = elements.inputAdminPassword.value;
      const submitBtn = elements.btnSubmitAdminLogin;
      const originalText = submitBtn.innerHTML;

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Menghubungkan...</span>`;
        if (elements.adminLoginError) elements.adminLoginError.classList.add("hidden");

        const data = await window.SupabaseService.loginAdmin(email, password);
        currentAdminUser = data.user;
        updateAdminAuthUI();
        renderMarkers();
        renderTourismCards();
        closeAdminAuthModal();
        showToast("🎉 Berhasil masuk sebagai Admin Pengelola!", "success", 4000);
      } catch (err) {
        console.error("Gagal login admin:", err);
        if (elements.adminLoginError) {
          elements.adminLoginError.textContent = `Login Gagal: ${err.message || 'Periksa kembali email dan password Anda.'}`;
          elements.adminLoginError.classList.remove("hidden");
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        refreshIcons();
      }
    });
  }

  // Logout Button
  if (elements.btnAdminLogout) {
    elements.btnAdminLogout.addEventListener("click", async () => {
      try {
        if (window.SupabaseService) {
          await window.SupabaseService.logoutAdmin();
        }
        currentAdminUser = null;
        updateAdminAuthUI();
        renderMarkers();
        renderTourismCards();
        closeAdminAuthModal();
        showToast("Telah berhasil keluar (logout) dari akun Admin.", "info", 3000);
      } catch (err) {
        console.error("Gagal logout:", err);
      }
    });
  }

  // Trigger Tambah Wisata dari modal login saat sudah login
  if (elements.btnTriggerAddFromAuthModal) {
    elements.btnTriggerAddFromAuthModal.addEventListener("click", () => {
      closeAdminAuthModal();
      if (elements.addLocationModal) {
        elements.addLocationModal.classList.remove("hidden");
        refreshIcons();
      }
    });
  }
}

// ================= MOBILE DRAWER HELPERS =================
let isMobileDrawerOpen = false;

function openMobileDrawer() {
  isMobileDrawerOpen = true;
  elements.mobileDrawer.classList.remove("translate-y-[calc(100%-85px)]", "translate-y-full");
  elements.mobileDrawer.classList.add("translate-y-0");
  elements.btnToggleDrawerIcon.innerHTML = `<i data-lucide="chevron-down" class="w-4 h-4"></i>`;
  refreshIcons();
}

function closeMobileDrawer() {
  isMobileDrawerOpen = false;
  elements.mobileDrawer.classList.remove("translate-y-0", "translate-y-full");
  elements.mobileDrawer.classList.add("translate-y-[calc(100%-85px)]");
  elements.btnToggleDrawerIcon.innerHTML = `<i data-lucide="chevron-up" class="w-4 h-4"></i>`;
  refreshIcons();
}

function hideMobileDrawerCompletely() {
  isMobileDrawerOpen = false;
  elements.mobileDrawer.classList.remove("translate-y-0", "translate-y-[calc(100%-85px)]");
  elements.mobileDrawer.classList.add("translate-y-full");
  elements.btnToggleDrawerIcon.innerHTML = `<i data-lucide="chevron-up" class="w-4 h-4"></i>`;
  refreshIcons();
}

function toggleMobileDrawer() {
  if (isMobileDrawerOpen) {
    closeMobileDrawer();
  } else {
    openMobileDrawer();
  }
}

// ================= TOAST NOTIFICATIONS =================
function showToast(message, type = "info", duration = 3500) {
  const toast = document.createElement("div");
  const bgColors = {
    info: "bg-slate-900/95 text-white border-slate-700",
    success: "bg-emerald-900/95 text-white border-emerald-700",
    warning: "bg-amber-900/95 text-white border-amber-700"
  };

  toast.className = `flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto ${bgColors[type] || bgColors.info}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0", "transition-opacity", "duration-300");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ================= EVENT LISTENERS =================
function setupEventListeners() {
  // Real-time Search Desktop
  elements.searchInput.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value;
    elements.btnClearSearch.classList.toggle("hidden", !currentSearchQuery);
    renderTourismCards();
  });

  elements.btnClearSearch.addEventListener("click", () => {
    elements.searchInput.value = "";
    currentSearchQuery = "";
    elements.btnClearSearch.classList.add("hidden");
    renderTourismCards();
  });

  // Real-time Search Mobile
  elements.mobileSearchInput.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value;
    elements.searchInput.value = e.target.value;
    renderTourismCards();
  });

  // Tombol Lokasi Saya
  elements.btnMyLocation.addEventListener("click", () => {
    if (userLocationMarker) {
      map.flyTo([currentUserLocation.lat, currentUserLocation.lng], 15, { duration: 1 });
      setTimeout(() => userLocationMarker.openPopup(), 600);
    } else {
      initGeolocation();
    }
  });

  // Tombol Semua Wisata (FitBounds)
  elements.btnFitAllSpots.addEventListener("click", () => {
    fitAllTourismSpots(true);
    showToast("Memusatkan tampilan ke semua destinasi wisata.", "info", 2000);
  });

  // Ganti Gaya Peta (Tiles)
  elements.btnToggleTile.addEventListener("click", () => {
    setMapTile(currentTileIndex + 1);
    const currentName = TILE_LAYERS[currentTileIndex].name;
    showToast(`Gaya Peta: ${currentName}`, "info", 2000);
  });

  // Sidebar Collapse / Expand Desktop
  elements.btnCollapseSidebar.addEventListener("click", () => {
    elements.desktopSidebar.classList.add("-translate-x-[110%]");
    elements.btnOpenSidebar.classList.remove("hidden");
  });

  elements.btnOpenSidebar.addEventListener("click", () => {
    elements.desktopSidebar.classList.remove("-translate-x-[110%]");
    elements.btnOpenSidebar.classList.add("hidden");
  });

  // Mobile Drawer Toggle Button
  if (elements.btnToggleMobileDrawer) {
    elements.btnToggleMobileDrawer.addEventListener("click", toggleMobileDrawer);
  }

  // Mobile Drawer Touch Swipe Gesture (Swipe Up / Down di handle drawer Android)
  let touchStartY = 0;
  let isSwiping = false;

  if (elements.mobileDrawerHeader) {
    elements.mobileDrawerHeader.addEventListener("touchstart", (e) => {
      touchStartY = e.changedTouches[0].clientY;
      isSwiping = false;
    }, { passive: true });

    elements.mobileDrawerHeader.addEventListener("touchmove", (e) => {
      const currentY = e.changedTouches[0].clientY;
      if (Math.abs(touchStartY - currentY) > 8) {
        isSwiping = true;
      }
    }, { passive: true });

    elements.mobileDrawerHeader.addEventListener("touchend", (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;
      // Swipe ke atas > 25px -> Buka Drawer
      if (diffY > 25) {
        openMobileDrawer();
      }
      // Swipe ke bawah > 25px -> Tutup Drawer
      else if (diffY < -25) {
        closeMobileDrawer();
      }
    }, { passive: true });

    // Handle klik/tap jika tidak sedang melakukan swipe gesture
    elements.mobileDrawerHeader.addEventListener("click", (e) => {
      if (e.target.closest("button")) return; // Jangan toggle jika klik tombol admin/tambah di header drawer
      if (!isSwiping) {
        toggleMobileDrawer();
      }
    });
  }

  // Refresh Geolocation
  elements.btnRefreshLocation.addEventListener("click", () => {
    initGeolocation();
  });

  // Route HUD Actions
  elements.btnCloseRouteHud.addEventListener("click", () => clearActiveRoute(true));
  elements.btnResetRoute.addEventListener("click", () => clearActiveRoute(true));

  elements.btnFocusRoute.addEventListener("click", () => {
    if (routingControl && activeDestination) {
      const bounds = L.latLngBounds([
        [currentUserLocation.lat, currentUserLocation.lng],
        [activeDestination.lat, activeDestination.lng]
      ]);
      map.fitBounds(bounds, { padding: [80, 80] });
    }
  });

  // Detail Modal Close
  elements.btnCloseModal.addEventListener("click", closeDetailModal);
  elements.detailModal.addEventListener("click", (e) => {
    if (e.target === elements.detailModal) closeDetailModal();
  });

  // ================= ADMIN ADD LOCATION MODAL LISTENERS =================
  const openAddModal = () => {
    if (elements.addLocationModal) {
      elements.addLocationModal.classList.remove("hidden");
      refreshIcons();
    }
  };

  const closeAddModal = () => {
    if (elements.addLocationModal) {
      elements.addLocationModal.classList.add("hidden");
    }
    if (tempPickerMarker) {
      map.removeLayer(tempPickerMarker);
      tempPickerMarker = null;
    }
  };

  const tryOpenAddModal = () => {
    if (window.SupabaseService && window.SupabaseService.isConfigured() && !currentAdminUser) {
      showToast("Silakan login sebagai Pengelola (Admin) terlebih dahulu untuk menambah destinasi baru ke peta publik.", "info", 4000);
      openAdminAuthModal();
      return;
    }
    openAddModal();
  };

  if (elements.btnOpenAddLocationModal) {
    elements.btnOpenAddLocationModal.addEventListener("click", tryOpenAddModal);
  }
  if (elements.btnOpenAddModalMobile) {
    elements.btnOpenAddModalMobile.addEventListener("click", tryOpenAddModal);
  }
  if (elements.btnCloseAddModal) {
    elements.btnCloseAddModal.addEventListener("click", closeAddModal);
  }
  if (elements.btnCancelAddModal) {
    elements.btnCancelAddModal.addEventListener("click", closeAddModal);
  }
  if (elements.addLocationModal) {
    elements.addLocationModal.addEventListener("click", (e) => {
      if (e.target === elements.addLocationModal) closeAddModal();
    });
  }

  // Tombol "Pilih Titik di Peta"
  if (elements.btnPickOnMap) {
    elements.btnPickOnMap.addEventListener("click", () => {
      if (elements.addLocationModal) elements.addLocationModal.classList.add("hidden");
      if (elements.mapPickerBanner) elements.mapPickerBanner.classList.remove("hidden");
      isMapPickerActive = true;
      map.getContainer().style.cursor = "crosshair";
      showToast("📍 Klik sembarang titik di peta untuk mengambil koordinat GPS", "info", 4000);
    });
  }

  // Tombol Batal Mode Pemilihan Peta
  if (elements.btnCancelMapPicker) {
    elements.btnCancelMapPicker.addEventListener("click", () => {
      isMapPickerActive = false;
      if (elements.mapPickerBanner) elements.mapPickerBanner.classList.add("hidden");
      map.getContainer().style.cursor = "";
      if (elements.addLocationModal) elements.addLocationModal.classList.remove("hidden");
    });
  }

  // Tombol "Gunakan Foto Otomatis"
  if (elements.btnAutoPhoto) {
    elements.btnAutoPhoto.addEventListener("click", () => {
      const cat = elements.addCategory ? elements.addCategory.value : "Pantai";
      const autoUrl = getDefaultCategoryPhoto(cat);
      if (elements.addImage) {
        elements.addImage.value = autoUrl;
        showToast(`📸 Foto rekomendasi kategori ${cat} diterapkan!`, "info", 2500);
      }
    });
  }

  // Submit Form Tambah Titik Wisata Baru
  if (elements.addLocationForm) {
    elements.addLocationForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (window.SupabaseService && window.SupabaseService.isConfigured() && !currentAdminUser) {
        showToast("Akses Ditolak: Hanya Admin yang dapat menyimpan destinasi baru ke database publik.", "error", 4000);
        openAdminAuthModal();
        return;
      }

      const nameVal = elements.addName.value.trim();
      const regionVal = elements.addRegion.value;
      const catVal = elements.addCategory.value;
      const locVal = elements.addLocation.value.trim();
      const latVal = parseFloat(elements.addLat.value);
      const lngVal = parseFloat(elements.addLng.value);

      if (isNaN(latVal) || isNaN(lngVal)) {
        showToast("Koordinat Latitude dan Longitude harus berupa angka yang valid!", "warning");
        return;
      }

      const imgVal = elements.addImage.value.trim() || getDefaultCategoryPhoto(catVal);
      const ticketVal = elements.addTicketPrice.value.trim() || "Gratis";
      const hoursVal = elements.addHours.value.trim() || "Setiap Hari (24 Jam)";
      const ratingVal = parseFloat(elements.addRating.value) || 4.8;
      const descVal = elements.addDescription.value.trim();
      const tagsRaw = elements.addTags.value.trim();
      const tagsArr = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : [catVal, regionVal, "Wisata NTT"];

      const weatherVal = elements.addWeather.value.trim() || "31°C - Cerah Berawan";
      const roadVal = elements.addRoadCondition.value;
      const trafficVal = elements.addTraffic.value;

      let trafficLevel = "low";
      let trafficSpeed = "50-60 km/jam";
      if (trafficVal === "Padat") {
        trafficLevel = "high";
        trafficSpeed = "20-30 km/jam";
      } else if (trafficVal.includes("Sedang")) {
        trafficLevel = "moderate";
        trafficSpeed = "35-45 km/jam";
      }

      const newSpot = {
        id: `custom-${Date.now()}`,
        name: nameVal,
        region: regionVal,
        category: catVal,
        categoryColor: getCategoryColor(catVal),
        location: locVal,
        lat: latVal,
        lng: lngVal,
        image: imgVal,
        rating: ratingVal,
        reviewsCount: 1,
        ticketPrice: ticketVal,
        openingHours: hoursVal,
        description: descVal,
        tags: tagsArr,
        weather: {
          temp: weatherVal.split("-")[0]?.trim() || "31°C",
          condition: weatherVal.includes("-") ? weatherVal.split("-")[1].trim() : weatherVal,
          humidity: "75%",
          windSpeed: "15 km/jam"
        },
        roadCondition: {
          status: roadVal,
          description: `Kondisi akses jalan utama ${roadVal.toLowerCase()}`,
          recommendation: "Aman untuk kendaraan roda dua maupun empat"
        },
        traffic: {
          level: trafficLevel,
          status: trafficVal,
          speedAvg: trafficSpeed,
          notes: `Kondisi lalu lintas terpantau ${trafficVal.toLowerCase()}`
        },
        isCustom: true
      };

      // Simpan ke Supabase jika aktif, atau ke localStorage jika mode lokal
      let finalSpot = newSpot;
      if (window.SupabaseService && window.SupabaseService.isConfigured()) {
        try {
          showToast(`Menyimpan "${newSpot.name}" ke database online Supabase...`, "info", 2000);
          finalSpot = await window.SupabaseService.insertDestination(newSpot);
          allDestinations.push(finalSpot);
        } catch (err) {
          console.error("Gagal menyimpan ke Supabase:", err);
          showToast(`Gagal menyimpan ke Supabase: ${err.message}`, "error", 4500);
          return;
        }
      } else {
        // Fallback localStorage
        const currentCustom = getCustomSpots();
        currentCustom.push(newSpot);
        saveCustomSpots(currentCustom);
        allDestinations = [...TOURISM_DESTINATIONS, ...currentCustom];
      }

      // Bersihkan temporary marker jika ada
      if (tempPickerMarker) {
        map.removeLayer(tempPickerMarker);
        tempPickerMarker = null;
      }

      // Reset Form & Tutup Modal
      elements.addLocationForm.reset();
      elements.addLocationModal.classList.add("hidden");

      // Jika sedang berada di tab wilayah yang berbeda, beralih ke Semua atau ke wilayah spot baru
      if (activeRegionFilter !== "Semua" && activeRegionFilter !== regionVal) {
        activeRegionFilter = "Semua";
        ["Semua", "Flores", "Timor"].forEach(r => {
          const dBtn = document.getElementById(`regionBtn-${r}`);
          const mBtn = document.getElementById(`mRegionBtn-${r}`);
          const isActive = (r === "Semua");
          [dBtn, mBtn].forEach(btn => {
            if (btn) {
              btn.className = isActive
                ? (btn.id.startsWith("m") ? "region-tab-mobile flex-1 py-1 rounded-lg text-center transition-all bg-brand-600 text-white shadow-xs font-bold" : "region-tab flex-1 py-1.5 px-1 rounded-xl text-center transition-all bg-brand-600 text-white shadow-xs font-bold")
                : (btn.id.startsWith("m") ? "region-tab-mobile flex-1 py-1 rounded-lg text-center transition-all text-slate-600 font-bold" : "region-tab flex-1 py-1.5 px-1 rounded-xl text-center transition-all text-slate-600 hover:text-slate-900 font-bold");
            }
          });
        });
      }

      // Re-render UI
      renderMarkers();
      renderTourismCards();
      setupCategoryFilters();

      // Fly to new destination and open popup
      setTimeout(() => {
        focusDestination(newSpot.id, true);
      }, 300);

      showToast(`🎉 Titik wisata "${newSpot.name}" berhasil ditambahkan & disimpan!`, "success", 4000);
    });
  }

  // Keyboard shortcut: ESC untuk tutup modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDetailModal();
      closeAddModal();
    }
  });
}

// Global window helpers for inline onclicks
window.handleCategorySelect = (category) => {
  activeCategoryFilter = category;
  setupCategoryFilters();
  renderTourismCards();
};

window.resetFilters = () => {
  activeCategoryFilter = "Semua";
  currentSearchQuery = "";
  if (elements.searchInput) elements.searchInput.value = "";
  if (elements.mobileSearchInput) elements.mobileSearchInput.value = "";
  if (elements.btnClearSearch) elements.btnClearSearch.classList.add("hidden");
  setupCategoryFilters();
  renderTourismCards();
};

window.focusDestination = focusDestination;
window.openDetailModal = openDetailModal;
window.selectTransportMode = selectTransportMode;
window.handleRegionSelect = handleRegionSelect;
window.deleteCustomSpot = deleteCustomSpot;
window.openAdminAuthModal = openAdminAuthModal;
window.closeAdminAuthModal = closeAdminAuthModal;

window.handleRouteClick = (spotId) => {
  const spot = allDestinations.find(d => d.id === spotId);
  if (spot) {
    calculateAndDisplayRoute(spot);
  }
};

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
