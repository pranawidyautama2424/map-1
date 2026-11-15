-- ========================================================
-- SUPABASE DATABASE SCHEMA & SEED DATA
-- Proyek: JelajahNusantara (Peta Wisata NTT)
-- ========================================================

-- 1. Buat Tabel Destinasi Wisata
CREATE TABLE IF NOT EXISTS destinations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    region_label TEXT,
    category TEXT NOT NULL,
    category_color TEXT DEFAULT 'emerald',
    rating NUMERIC DEFAULT 4.5,
    reviews_count TEXT DEFAULT '1',
    ticket_price TEXT,
    opening_hours TEXT,
    location TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    image TEXT,
    description TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    weather JSONB DEFAULT '{}'::jsonb,
    road_condition JSONB DEFAULT '{}'::jsonb,
    traffic JSONB DEFAULT '{}'::jsonb,
    is_custom BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS) untuk Keamanan Publik
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan Keamanan (RLS Policies)
-- Publik (pengunjung umum) HANYA BISA MEMBACA data (SELECT)
DROP POLICY IF EXISTS "Public can view destinations" ON destinations;
CREATE POLICY "Public can view destinations"
    ON destinations FOR SELECT
    TO public
    USING (true);

-- Hanya Admin yang login (authenticated) yang bisa menambah destinasi baru
DROP POLICY IF EXISTS "Admin can insert destinations" ON destinations;
CREATE POLICY "Admin can insert destinations"
    ON destinations FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Hanya Admin yang login (authenticated) yang bisa mengubah destinasi
DROP POLICY IF EXISTS "Admin can update destinations" ON destinations;
CREATE POLICY "Admin can update destinations"
    ON destinations FOR UPDATE
    TO authenticated
    USING (true);

-- Hanya Admin yang login (authenticated) yang bisa menghapus destinasi
DROP POLICY IF EXISTS "Admin can delete destinations" ON destinations;
CREATE POLICY "Admin can delete destinations"
    ON destinations FOR DELETE
    TO authenticated
    USING (true);

-- 4. Seed Data Awal (10 Destinasi Unggulan NTT)
INSERT INTO destinations (
    id, name, region, region_label, category, category_color, rating, reviews_count,
    ticket_price, opening_hours, location, lat, lng, image, description,
    tags, weather, road_condition, traffic, is_custom
) VALUES
(
    'puncak-sylvia',
    'Puncak Sylvia & Bukit Waecicu',
    'Flores',
    'Flores / Labuan Bajo',
    'Pantai',
    'cyan',
    4.8,
    '8.4k',
    'Gratis / Rp 10.000',
    '05:00 - 18:30 WITA',
    'Waecicu, Labuan Bajo, Manggarai Barat, NTT',
    -8.472814,
    119.873205,
    'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80',
    'Perbukitan savana pesisir di utara Labuan Bajo yang menyuguhkan pemandangan spektakuler gugusan pulau karang, gradasi air laut toska, serta pemandangan matahari terbenam (sunset) terbaik di Manggarai Barat.',
    '["Sunset View","Bukit Savana","Panorama Pulau","Spot Foto"]'::jsonb,
    '{"temp":"31°C","condition":"Cerah Berawan","icon":"sun","humidity":"62%","windSpeed":"14 km/jam","forecast":"Sangat bersahabat untuk menikmati sunset sore hari."}'::jsonb,
    '{"status":"Mulus & Beraspal","badgeColor":"emerald","level":"good","description":"Jalan aspal hotmix mulus dua arah hingga kaki bukit, sedikit menanjak di ujung.","recommendation":"Dapat dilalui semua jenis kendaraan (Mobil, Motor, Bus Pariwisata)."}'::jsonb,
    '{"status":"Lancar","badgeColor":"emerald","level":"low","speedAvg":"40-50 km/jam","notes":"Arus lalu lintas lengang, sedikit ramai saat jam sunset (16:30 - 18:00 WITA)."}'::jsonb,
    false
),
(
    'batu-cermin',
    'Gua Batu Cermin (Mirror Stone Cave)',
    'Flores',
    'Flores / Labuan Bajo',
    'Sejarah',
    'amber',
    4.7,
    '6.2k',
    'Rp 20.000',
    '08:00 - 16:30 WITA',
    'Batu Cermin, Komodo, Manggarai Barat, NTT',
    -8.490518,
    119.897825,
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    'Situs gua kapur purba yang dahulunya berada di dasar laut. Memiliki lorong berkilau seperti cermin saat ditembus berkas sinar matahari, stalaktit-stalagmit megah, serta fosil penyu laut dan koral purba yang membatu.',
    '["Gua Purba","Fosil Laut","Wisata Edukasi","Geologi"]'::jsonb,
    '{"temp":"30°C","condition":"Cerah Terik","icon":"sun","humidity":"65%","windSpeed":"11 km/jam","forecast":"Waktu terbaik berkunjung pukul 09:00 - 12:00 WITA untuk melihat pantulan cahaya."}'::jsonb,
    '{"status":"Sangat Baik (Jalan Kota)","badgeColor":"emerald","level":"good","description":"Jalan arteri utama kota Labuan Bajo, aspal lebar dengan trotoar pedestrian rapi.","recommendation":"Akses sangat mudah untuk semua jenis kendaraan termasuk mobil keluarga & bus."}'::jsonb,
    '{"status":"Sedang (Ramai Lancar)","badgeColor":"amber","level":"moderate","speedAvg":"30-40 km/jam","notes":"Cukup ramai di sekitar persimpangan pusat kota, parkiran luas tersedia."}'::jsonb,
    false
),
(
    'cunca-wulang',
    'Air Terjun Cunca Wulang',
    'Flores',
    'Flores / Manggarai Barat',
    'Alam',
    'emerald',
    4.8,
    '5.1k',
    'Rp 30.000',
    '07:00 - 17:00 WITA',
    'Pota Wangka, Boleng, Manggarai Barat, NTT',
    -8.57721,
    120.078912,
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
    'Dijuluki ''Grand Canyon'' dari Flores NTT. Ngarai alami berdinding tebing batu kapur terjal dengan aliran sungai berair jernih kehijauan yang bermuara pada kolam alami eksotis, populer untuk atraksi cliff jumping dan trekking alam.',
    '["Grand Canyon Flores","Cliff Jumping","Air Terjun","Trekking"]'::jsonb,
    '{"temp":"27°C","condition":"Cerah Sejuk","icon":"cloud-sun","humidity":"74%","windSpeed":"9 km/jam","forecast":"Udara pegunungan lembab dan sejuk, air sungai jernih dan segar."}'::jsonb,
    '{"status":"Aspal Berkelok & Menanjak","badgeColor":"amber","level":"moderate","description":"Jalan Trans-Flores beraspal mulus, 2 km terakhir menuju gerbang desa agak sempit berliku.","recommendation":"Gunakan gigi rendah pada tanjakan, berhati-hati saat berpapasan di jalan sempit."}'::jsonb,
    '{"status":"Lancar Lengang","badgeColor":"emerald","level":"low","speedAvg":"40-50 km/jam","notes":"Arus kendaraan sangat lengang, didominasi motor dan mobil travel wisata."}'::jsonb,
    false
),
(
    'kampung-melo',
    'Kampung Adat Melo (Liang Ndara)',
    'Flores',
    'Flores / Manggarai Barat',
    'Budaya',
    'purple',
    4.9,
    '4.8k',
    'Rp 25.000',
    '08:00 - 17:00 WITA',
    'Liang Ndara, Mbeliling, Manggarai Barat, NTT',
    -8.58334,
    120.02421,
    'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80',
    'Kampung adat tradisional suku Manggarai di ketinggian perbukitan sejuk Mbeliling. Pusat pertunjukan Tari Caci legendaris (tarian perang cambuk khas NTT), ritual penyambutan tuak sopi, serta kerajinan tenun ikat songke bernilai seni tinggi.',
    '["Tari Caci","Kampung Adat","Tenun Songke","Budaya Manggarai"]'::jsonb,
    '{"temp":"24°C","condition":"Sejuk Berkabut Tipis","icon":"wind","humidity":"80%","windSpeed":"13 km/jam","forecast":"Kawasan perbukitan tinggi Mbeliling berhawa dingin, siapkan jaket tipis."}'::jsonb,
    '{"status":"Aspal Nasional Mulus","badgeColor":"emerald","level":"good","description":"Terletak persis di tepi jalan raya Trans-Flores Ruteng - Labuan Bajo, aspal kualitas prima.","recommendation":"Akses prima untuk motor, mobil, dan bus pariwisata."}'::jsonb,
    '{"status":"Lancar","badgeColor":"emerald","level":"low","speedAvg":"40-55 km/jam","notes":"Lalu lintas antarkota teratur dan tertib, rambu jalan sangat jelas."}'::jsonb,
    false
),
(
    'gua-rangko',
    'Gua Rangko & Kolam Alami Asin',
    'Flores',
    'Flores / Labuan Bajo',
    'Alam',
    'emerald',
    4.8,
    '7.3k',
    'Rp 25.000',
    '07:30 - 16:00 WITA',
    'Tanjung Boleng, Boleng, Manggarai Barat, NTT',
    -8.42312,
    119.92314,
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'Keajaiban tersembunyi berupa kolam renang alami air asin di dalam rongga gua stalaktit. Airnya sangat jernih kebiruan dan memantulkan kilauan kristal mempesona saat matahari menembus celah mulut gua di siang hari.',
    '["Hidden Gem","Kolam Air Asin","Gua Kristal","Snorkeling Alami"]'::jsonb,
    '{"temp":"32°C","condition":"Cerah Pesisir Tropis","icon":"sun","humidity":"58%","windSpeed":"16 km/jam","forecast":"Sinar matahari paling optimal menyinari kolam gua pukul 11:30 - 14:00 WITA."}'::jsonb,
    '{"status":"Jalan Lingkar Baru Mulus","badgeColor":"emerald","level":"good","description":"Jalan hotmix baru pesisir utara Labuan Bajo hingga Desa Pasir Putih (dermaga perahu lokal).","recommendation":"Dapat ditempuh dengan mobil atau motor hingga dermaga penyeberangan perahu 10 menit."}'::jsonb,
    '{"status":"Sangat Lancar","badgeColor":"emerald","level":"low","speedAvg":"50-60 km/jam","notes":"Jalan lingkar utara baru sangat lengang dengan pemandangan teluk yang indah."}'::jsonb,
    false
),
(
    'pantai-lasiana',
    'Pantai Lasiana (Ikon Pohon Lontar)',
    'Timor',
    'Daratan Timor / Kota Kupang',
    'Pantai',
    'cyan',
    4.6,
    '7.1k',
    'Rp 5.000',
    '06:00 - 20:00 WITA',
    'Kelapa Lima, Kota Kupang, Timor, NTT',
    -10.1388,
    123.6706,
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'Pantai pesisir paling tersohor di Kota Kupang dengan deretan ratusan pohon lontar dan kelapa yang eksotis. Memiliki hamparan pasir putih yang landai, deburan ombak tenang Teluk Kupang, serta sajian kuliner khas pisang gepe bakar gula lempeng.',
    '["Pohon Lontar","Sunset Kupang","Pisang Gepe","Wisata Keluarga"]'::jsonb,
    '{"temp":"32°C","condition":"Cerah Berawan","icon":"sun","humidity":"62%","windSpeed":"18 km/jam","forecast":"Angin laut bertiup sepoi-sepoi, cuaca sangat mendukung untuk bersantai sore."}'::jsonb,
    '{"status":"Jalan Kota Mulus","badgeColor":"emerald","level":"good","description":"Jalan Nasional Timor Raya dua jalur lebar dan beraspal sangat halus.","recommendation":"Akses prima untuk motor, mobil, taksi online, dan angkutan umum kota Kupang (Bemo)."}'::jsonb,
    '{"status":"Sedang (Ramai Lancar)","badgeColor":"amber","level":"moderate","speedAvg":"35-45 km/jam","notes":"Cukup ramai pada akhir pekan dan jam sore menjelang matahari terbenam."}'::jsonb,
    false
),
(
    'gua-kristal',
    'Gua Kristal Kupang Barat',
    'Timor',
    'Daratan Timor / Kab. Kupang',
    'Alam',
    'emerald',
    4.7,
    '5.8k',
    'Rp 10.000',
    '08:00 - 17:00 WITA',
    'Desa Bolok, Kupang Barat, Kab. Kupang, Timor, NTT',
    -10.2335,
    123.5042,
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    'Gua alami eksotis tersembunyi dengan kolam air tawar bawah tanah yang sangat jernih membiru laksana kristal. Pengunjung dapat menuruni celah mulut gua dan berenang merasakan kesegaran air sejuk di kedalaman gua kapur purba.',
    '["Kolam Kristal","Gua Tersembunyi","Berenang Sejuk","Spot Petualang"]'::jsonb,
    '{"temp":"31°C","condition":"Cerah Terik","icon":"sun","humidity":"60%","windSpeed":"12 km/jam","forecast":"Suhu di dalam rongga gua sangat sejuk (~22°C) kontras dengan panas luar."}'::jsonb,
    '{"status":"Sebagian Berbatu","badgeColor":"amber","level":"moderate","description":"Jalan utama aspal mulus Pelabuhan Bolok, 300 meter terakhir jalan tanah berbatu kapur.","recommendation":"Disarankan berhati-hati saat berjalan kaki menuruni bebatuan licin di dalam gua."}'::jsonb,
    '{"status":"Lancar","badgeColor":"emerald","level":"low","speedAvg":"40-50 km/jam","notes":"Arus lalu lintas jalur Bolok sangat lancar, jarang terjadi kepadatan."}'::jsonb,
    false
),
(
    'air-terjun-oenesu',
    'Air Terjun Oenesu (4 Tingkat)',
    'Timor',
    'Daratan Timor / Kab. Kupang',
    'Alam',
    'emerald',
    4.5,
    '4.3k',
    'Rp 5.000',
    '07:00 - 18:00 WITA',
    'Oenesu, Kupang Barat, Kab. Kupang, Timor, NTT',
    -10.2798,
    123.5186,
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
    'Air terjun berundak alami dengan empat tingkatan kolam air yang dikelilingi hutan rimbun pepohonan tropis asri. Debit air tetap mengalir bahkan saat musim kemarau, menjadi tempat pemandian alami favorit masyarakat Pulau Timor.',
    '["Air Terjun 4 Tingkat","Kolam Alami","Hutan Tropis","Piknik"]'::jsonb,
    '{"temp":"28°C","condition":"Berawan Teduh","icon":"cloud-sun","humidity":"72%","windSpeed":"10 km/jam","forecast":"Kawasan hutan teduh dan sejuk, nyaman untuk aktivitas berenang dan piknik."}'::jsonb,
    '{"status":"Aspal Sedang & Menurun","badgeColor":"emerald","level":"good","description":"Jalan aspal kabupaten terpelihara baik, terdapat turunan saat mendekati area gerbang.","recommendation":"Bisa diakses kendaraan roda 2 dan roda 4 hingga area parkir wisata."}'::jsonb,
    '{"status":"Lancar","badgeColor":"emerald","level":"low","speedAvg":"40-50 km/jam","notes":"Lalu lintas pedesaan Kupang Barat tenang dan bebas macet."}'::jsonb,
    false
),
(
    'pantai-kolbano',
    'Pantai Kolbano (Batu Warna)',
    'Timor',
    'Daratan Timor / Timor Tengah Selatan',
    'Pantai',
    'cyan',
    4.8,
    '6.9k',
    'Rp 10.000',
    '24 Jam',
    'Kolbano, Timor Tengah Selatan (TTS), Timor, NTT',
    -9.9882,
    124.6468,
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'Fenomena alam pantai unik di pesisir selatan Timor yang tersohor di dunia karena bukan berpasir biasa, melainkan dipenuhi hamparan miliaran batu kerikil warna-warni halus alami serta bongkahan batu karang raksasa ikonik ''Fatu Un''.',
    '["Batu Warna-Warni","Batu Fatu Un","Pesisir Selatan","Fotografi"]'::jsonb,
    '{"temp":"31°C","condition":"Cerah Berangin Kencang","icon":"wind","humidity":"64%","windSpeed":"22 km/jam","forecast":"Deburan ombak Samudera Hindia cukup kuat, angin pesisir kencang dan segar."}'::jsonb,
    '{"status":"Aspal Berkelok (Jalur Selatan)","badgeColor":"amber","level":"moderate","description":"Jalan Nasional Trans-Timor Jalur Selatan, aspal bagus namun banyak tikungan menyusuri pesisir dan tebing.","recommendation":"Patuhi batas kecepatan dan waspadai hewan ternak yang sesekali melintas."}'::jsonb,
    '{"status":"Lancar Lengang","badgeColor":"emerald","level":"low","speedAvg":"45-60 km/jam","notes":"Lalu lintas antarkabupaten lengang, pemandangan laut selatan terbentang di sisi jalan."}'::jsonb,
    false
),
(
    'fatumnasi-mutis',
    'Hutan Bonsai Fatumnasi & Gunung Mutis',
    'Timor',
    'Daratan Timor / Timor Tengah Selatan',
    'Alam',
    'emerald',
    4.9,
    '5.2k',
    'Rp 15.000',
    '06:00 - 17:00 WITA',
    'Fatumnasi, Timor Tengah Selatan (TTS), Timor, NTT',
    -9.7331,
    124.2384,
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    'Negeri di atas awan Pulau Timor di lereng Gunung Mutis (1.400 mdpl). Menghadirkan udara pegunungan berkabut yang sangat dingin, padang savana berbukit hijau, serta hutan pohon ampupu bonsai purba berusia ratusan tahun yang magis.',
    '["Pohon Bonsai Purba","Gunung Mutis","Negeri Di Atas Awan","Udara Dingin"]'::jsonb,
    '{"temp":"19°C","condition":"Dingin Berkabut Tebal","icon":"cloud-fog","humidity":"86%","windSpeed":"15 km/jam","forecast":"Suhu udara dingin bisa mencapai 14°C saat pagi/malam, wajib membawa jaket tebal."}'::jsonb,
    '{"status":"Menantang (Pegunungan)","badgeColor":"rose","level":"warning","description":"Jalan aspal Soe ke Kapan baik, namun 10 km terakhir menuju Fatumnasi berupa jalan menanjak berbatu dan sempit.","recommendation":"Sangat disarankan menggunakan kendaraan SUV/4WD, mobil bertorsi tinggi, atau motor gigi/trail."}'::jsonb,
    '{"status":"Sangat Lengang","badgeColor":"emerald","level":"low","speedAvg":"25-35 km/jam","notes":"Lalu lintas pegunungan sangat sepi, udara segar berbalut kabut alami."}'::jsonb,
    false
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    weather = EXCLUDED.weather,
    road_condition = EXCLUDED.road_condition,
    traffic = EXCLUDED.traffic;
