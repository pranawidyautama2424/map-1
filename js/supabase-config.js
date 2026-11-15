/**
 * supabase-config.js
 * Konfigurasi & Helper Supabase untuk JelajahNusantara (JelajahNTT)
 *
 * CARA MENGISI:
 * 1. Buka dashboard https://supabase.com -> Project Settings -> API
 * 2. Salin "Project URL" dan masukkan ke SUPABASE_URL di bawah ini.
 * 3. Salin "anon public" API key dan masukkan ke SUPABASE_ANON_KEY di bawah ini.
 */

const SUPABASE_CONFIG = {
  // Project URL Supabase Anda (format https://[project-id].supabase.co):
  url: "https://teivtukhxtarpoiowhbx.supabase.co",

  // Publishable / Anon public key:
  anonKey: "sb_publishable_l0azPBBPWwuF0DoJT90D4w_wnZ6cbCJ"
};

// Objek Supabase Client
let supabaseClient = null;

// Cek apakah kredensial sudah diisi oleh pengguna
function isSupabaseConfigured() {
  return (
    typeof window.supabase !== "undefined" &&
    SUPABASE_CONFIG.url &&
    SUPABASE_CONFIG.url.trim() !== "" &&
    SUPABASE_CONFIG.url !== "https://YOUR_PROJECT_ID.supabase.co" &&
    SUPABASE_CONFIG.anonKey &&
    SUPABASE_CONFIG.anonKey.trim() !== "" &&
    SUPABASE_CONFIG.anonKey !== "YOUR_ANON_PUBLIC_KEY"
  );
}

// Inisialisasi client jika kredensial sudah valid
if (isSupabaseConfigured()) {
  try {
    supabaseClient = window.supabase.createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey
    );
    console.log("⚡ [Supabase] Client berhasil diinisialisasi.");
  } catch (err) {
    console.error("❌ [Supabase] Gagal menginisialisasi client:", err);
  }
} else {
  console.info("ℹ️ [Supabase] Kredensial belum diatur. Menggunakan mode lokal (data.js & localStorage).");
}

// ================= HELPER FUNCTIONS =================

/**
 * Konversi baris database Supabase (snake_case) ke format objek frontend (camelCase)
 */
function mapFromDbRecord(row) {
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    regionLabel: row.region_label || row.region,
    category: row.category,
    categoryColor: row.category_color || "emerald",
    rating: Number(row.rating) || 4.5,
    reviewsCount: row.reviews_count || "1",
    ticketPrice: row.ticket_price || "Gratis",
    openingHours: row.opening_hours || "08:00 - 17:00",
    location: row.location,
    lat: Number(row.lat),
    lng: Number(row.lng),
    image: row.image || "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80",
    description: row.description || "",
    tags: Array.isArray(row.tags) ? row.tags : [],
    weather: row.weather || {
      temp: "30°C",
      condition: "Cerah",
      humidity: "70%",
      windSpeed: "12 km/jam"
    },
    roadCondition: row.road_condition || {
      status: "Mulus & Beraspal",
      description: "Jalan utama beraspal baik",
      recommendation: "Semua kendaraan"
    },
    traffic: row.traffic || {
      level: "low",
      status: "Lancar",
      speedAvg: "40-50 km/jam",
      notes: "Arus lalu lintas lancar"
    },
    isCustom: Boolean(row.is_custom)
  };
}

/**
 * Konversi objek frontend (camelCase) ke baris database Supabase (snake_case)
 */
function mapToDbRecord(spot) {
  return {
    id: spot.id,
    name: spot.name,
    region: spot.region,
    region_label: spot.regionLabel || spot.region,
    category: spot.category,
    category_color: spot.categoryColor || "emerald",
    rating: Number(spot.rating) || 4.5,
    reviews_count: String(spot.reviewsCount || "1"),
    ticket_price: spot.ticketPrice || "Gratis",
    opening_hours: spot.openingHours || "08:00 - 17:00",
    location: spot.location,
    lat: Number(spot.lat),
    lng: Number(spot.lng),
    image: spot.image,
    description: spot.description,
    tags: spot.tags || [],
    weather: spot.weather || {},
    road_condition: spot.roadCondition || {},
    traffic: spot.traffic || {},
    is_custom: true
  };
}

/**
 * Ambil seluruh destinasi dari Supabase
 */
async function fetchDestinationsFromSupabase() {
  if (!supabaseClient) return null;

  try {
    const { data, error } = await supabaseClient
      .from("destinations")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("⚠️ [Supabase] Gagal mengambil destinasi:", error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(mapFromDbRecord);
    }
    return [];
  } catch (err) {
    console.error("❌ [Supabase] Error fetchDestinations:", err);
    return null;
  }
}

/**
 * Simpan destinasi baru ke Supabase
 */
async function insertDestinationToSupabase(spot) {
  if (!supabaseClient) throw new Error("Supabase client belum diatur");

  const record = mapToDbRecord(spot);
  const { data, error } = await supabaseClient
    .from("destinations")
    .insert([record])
    .select();

  if (error) {
    throw error;
  }
  return data ? mapFromDbRecord(data[0]) : spot;
}

/**
 * Hapus destinasi dari Supabase berdasarkan ID
 */
async function deleteDestinationFromSupabase(spotId) {
  if (!supabaseClient) throw new Error("Supabase client belum diatur");

  const { error } = await supabaseClient
    .from("destinations")
    .delete()
    .eq("id", spotId);

  if (error) {
    throw error;
  }
  return true;
}

/**
 * Login Admin dengan email & password Supabase Auth
 */
async function loginAdminSupabase(email, password) {
  if (!supabaseClient) throw new Error("Supabase belum dikonfigurasi.");

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

/**
 * Logout Admin dari Supabase
 */
async function logoutAdminSupabase() {
  if (!supabaseClient) return;
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}

/**
 * Cek sesi admin saat ini
 */
async function getAdminSessionSupabase() {
  if (!supabaseClient) return null;
  const { data } = await supabaseClient.auth.getSession();
  return data?.session?.user || null;
}

// Ekspor ke window global agar dapat dipanggil di app.js
window.SupabaseService = {
  isConfigured: isSupabaseConfigured,
  getClient: () => supabaseClient,
  fetchDestinations: fetchDestinationsFromSupabase,
  insertDestination: insertDestinationToSupabase,
  deleteDestination: deleteDestinationFromSupabase,
  loginAdmin: loginAdminSupabase,
  logoutAdmin: logoutAdminSupabase,
  getAdminSession: getAdminSessionSupabase
};

