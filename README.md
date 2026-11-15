# 🗺️ JelajahNusantara - Peta Wisata Interaktif & Pencarian Rute Terbaik

Aplikasi web promosi wisata modern, responsif, dan interaktif yang berfokus pada visualisasi peta layar penuh (*full-screen map*) dan pencarian rute jalan terbaik dari lokasi pengguna ke destinasi wisata pilihan secara **100% gratis tanpa API key berbayar**.

---

## ✨ Fitur Utama

1. **🔒 Fokus Peta Terkunci (Focused Bounds)**
   - Saat aplikasi pertama kali dimuat, peta secara otomatis menghitung *bounding box* seluruh titik koordinat destinasi wisata menggunakan `map.fitBounds()`.
   - Kamera peta terpusat presisi pada area wisata dengan *padding* yang nyaman di desktop maupun mobile.
   - Tersedia tombol mengambang **"Semua Wisata"** untuk mereset kamera kembali ke seluruh titik kapan saja.

2. **📍 Marker Interaktif & Detail Wisata**
   - Marker kustom modern berbasis HTML (`L.divIcon`) dengan palet warna dan ikon SVG sesuai kategori (Pantai, Budaya, Alam, Sejarah).
   - Efek radar animasi untuk titik GPS pengguna dan *subtle hover bounce* pada marker wisata.
   - Klik pada marker atau kartu menampilkan kartu informasi popup yang memuat:
     - Foto beresolusi tinggi (Unsplash valid).
     - Label kategori dan rating bintang.
     - Nama destinasi dan deskripsi singkat.
     - Informasi harga tiket masuk (HTM) dan jam operasional.
     - Tombol aksi utama **"Tampilkan Rute Terbaik"**.
     - Tombol modal untuk membaca detail lengkap dan tag destinasi.

3. **🧭 Deteksi Lokasi Perangkat & Rute Terbaik (Real-time OSRM)**
   - Menggunakan API native `navigator.geolocation` untuk mendeteksi posisi GPS perangkat pengguna secara *real-time*.
   - **Fallback Cerdas:** Jika pengguna menolak izin lokasi atau browser tidak mengizinkan akses sensor, sistem otomatis menggunakan koordinat pusat kota (Tugu Yogyakarta) sebagai titik simulasi disertai notifikasi ramah (*toast*).
   - Menghitung dan menggambar jalur rute jalan raya tercepat menggunakan **Leaflet Routing Machine** (berbasis engine publik OSRM).
   - Menampilkan kartu mengambang modern (*Route Info HUD*) yang memperlihatkan:
     - Total jarak tempuh (km).
     - Estimasi waktu perjalanan (menit / jam).
     - Tombol **"Fokus Jalur"**, **"Buka di Google Maps"**, dan **"Hapus Rute"**.
   - Dilengkapi *fallback polyline* otomatis jika server rute publik mengalami lonjakan beban.

4. **🎨 Desain UI/UX Modern & Responsif**
   - **Layout:** Peta *full-screen* dengan efek *glassmorphism* (`backdrop-blur-xl`, border semi-transparan, bayangan lembut).
   - **Desktop:** *Floating sidebar* di sisi kiri yang dapat disembunyikan (*collapse/expand*).
   - **Mobile:** *Bottom drawer* interaktif yang ramah satu tangan (*one-handed mobile friendly*).
   - **Pencarian Real-Time:** Filter instan berdasarkan nama wisata, deskripsi, atau lokasi.
   - **Filter Kategori:** Tombol *chips* ("Semua", "Pantai", "Alam", "Budaya", "Sejarah") dengan indikator jumlah item.
   - **Sinkronisasi Interaksi:** Menekan kartu di sidebar memicu animasi kamera halus (`map.flyTo()`) ke titik marker dan langsung membuka popupnya.
   - **Ganti Gaya Peta:** Tombol pengalih gaya tile peta (CartoDB Voyager, CartoDB Dark Matter, OpenStreetMap).

---

## 🛠️ Teknologi yang Digunakan (Gratis & Bebas API Key)

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Markup & Struktur** | HTML5 Semantik | Bersih, aksesibel, dan terstruktur rapi |
| **Styling** | Tailwind CSS (CDN) + Custom CSS | Utilitas cepat dengan efek *glassmorphism* modern |
| **Font** | Google Fonts (*Plus Jakarta Sans*) | Tipografi modern standar aplikasi internasional |
| **Peta Interaktif** | Leaflet.js (v1.9.4) | Library pemetaan open-source yang ringan dan cepat |
| **Tile Provider** | Esri World Street Map & Satellite | 100% gratis, bebas API key, mendukung akses langsung (`file://`) |
| **Routing Engine** | Leaflet Routing Machine (OSRM) | Jalur jalan raya, jarak (km), dan durasi gratis |
| **Ikonografi** | Lucide Icons + Custom Inline SVG | Ikon modern dan tajam di berbagai resolusi layar |

---

## 📁 Struktur Berkas

```
MAP/
├── index.html          # Halaman utama aplikasi web
├── css/
│   └── style.css       # Kustomisasi animasi, efek radar, dan penyesuaian Leaflet
├── js/
│   ├── data.js         # Data array 5 destinasi wisata Yogyakarta & koordinat fallback
│   └── app.js          # Logika peta, geolokasi, rute OSRM, filter pencarian & UI sync
└── README.md           # Dokumentasi lengkap proyek
```

---

## 🚀 Cara Menjalankan

Aplikasi ini bersifat *client-side zero-build*, sehingga dapat dijalankan dengan sangat mudah:

### Cara 1: Langsung Buka Berkas (Paling Mudah)
Cukup klik ganda (*double click*) berkas `index.html` untuk membukanya langsung di browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

### Cara 2: Menggunakan Local Web Server
Jika ingin menjalankan lewat server lokal (misalnya untuk pengujian fitur GPS di browser):
- **VS Code:** Gunakan ekstensi *Live Server*, lalu klik *"Go Live"*.
- **Node.js (npx):**
  ```bash
  npx serve .
  ```
- **Python:**
  ```bash
  python -m http.server 8080
  ```
  Lalu buka `http://localhost:8080` di browser Anda.

---

## 📍 Data Destinasi Wisata yang Dimuat (Nusa Tenggara Timur - NTT)

### A. Wilayah Flores / Labuan Bajo & Manggarai Barat
1. **Puncak Sylvia & Bukit Waecicu** (*Kategori: Pantai*) - Savana pesisir di utara Labuan Bajo dengan panorama laut toska dan sunset terbaik.
2. **Gua Batu Cermin** (*Kategori: Sejarah / Geologi*) - Gua kapur purba bawah laut dengan dinding berkilau cermin, fosil koral dan penyu laut.
3. **Air Terjun Cunca Wulang** (*Kategori: Alam*) - Dijuluki *Grand Canyon Flores*, ngarai berdinding tebing terjal dan kolam alami kehijauan.
4. **Kampung Adat Melo** (*Kategori: Budaya*) - Desa adat di perbukitan Mbeliling, pusat pertunjukan Tari Caci dan tenun ikat songke.
5. **Gua Rangko** (*Kategori: Alam*) - Kolam renang air asin alami di dalam gua stalaktit berair jernih kristal membiru.

### B. Wilayah Daratan Timor (Kupang & Timor Tengah Selatan)
6. **Pantai Lasiana** (*Kategori: Pantai*) - Ikon pesisir Kota Kupang dengan ratusan pohon lontar eksotis dan kuliner pisang gepe.
7. **Gua Kristal Kupang** (*Kategori: Alam*) - Kolam air tawar jernih alami di dalam gua kapur purba Bolok.
8. **Air Terjun Oenesu** (*Kategori: Alam*) - Air terjun alami 4 tingkatan dengan kolam pemandian sejuk di Kupang Barat.
9. **Pantai Kolbano** (*Kategori: Pantai*) - Fenomena langka pantai berbatu kerikil warna-warni dan karang raksasa *Fatu Un*.
10. **Hutan Bonsai Fatumnasi & Gunung Mutis** (*Kategori: Alam*) - Negeri di atas awan (1.400 mdpl) dengan hutan pohon ampupu bonsai purba berhawa dingin.

---

## 🌤️ Informasi Cuaca, Kondisi Jalan & Kepadatan Kendaraan

Aplikasi kini menyediakan pemantauan kondisi perjalanan terintegrasi di seluruh panel:
- **🌤️ Informasi Cuaca:** Menampilkan suhu (°C), kondisi cuaca (Cerah, Berawan, Sejuk, Kabut), kelembaban (%), kecepatan angin, serta saran waktu terbaik berkunjung.
- **🛣️ Kondisi Jalan:** Status permukaan jalan (Aspal Mulus, Berkelok, atau Berbatu) disertai deskripsi jalur dan rekomendasi tipe kendaraan (Mobil keluarga, SUV/4WD, Motor).
- **🚦 Kepadatan Kendaraan:** Indikator visual real-time (🟢 Lancar, 🟡 Sedang, 🔴 Padat) lengkap dengan rata-rata kecepatan kendaraan dan catatan arus lalu lintas.
- **Informasi ini dapat dilihat pada:**
  1. *Badges* ringkas pada setiap kartu di daftar wisata.
  2. *Popup* interaktif penanda di atas peta.
  3. Panel mengambang *Route HUD Card* saat rute aktif.
  4. Modal detail komprehensif saat tombol info ditekan.

---

## 🚗 Multi-Moda Estimasi Perjalanan (Mobil, Motor, Jalan Kaki)

Aplikasi kini secara otomatis menghitung dan membandingkan estimasi durasi tempuh untuk 3 moda transportasi sekaligus:
- 🚗 **Mobil:** Perhitungan berbasis engine rute jalan OSRM dengan penyesuaian kontur jalanan NTT.
- 🛵 **Motor:** Estimasi lebih lincah dan cepat (~20% lebih hemat waktu di jalanan berliku).
- 🚶 **Jalan Kaki:** Estimasi pejalan kaki (rata-rata 4.5 km/jam) untuk tracking dan hiking.
- Pengguna dapat memilih moda yang diinginkan, dan tombol navigasi langsung membuka rute Google Maps sesuai moda tersebut.

---

## 🛠️ Fitur Admin: Tambah Titik Lokasi Wisata Baru

Aplikasi kini menyediakan antarmuka Admin bawaan yang memungkinkan pengelola menambahkan titik wisata baru secara visual langsung dari browser tanpa perlu mengedit kode manual:
1. **Tombol "Tambah Wisata":** Terletak di sudut kanan atas navbar (desktop) dan di bagian atas drawer (mobile).
2. **Pilih Titik di Peta (Interactive Coordinate Picker):** Admin cukup menekan tombol **"Pilih Titik di Peta"**, lalu klik langsung lokasi manapun di atas peta untuk menangkap koordinat Latitude dan Longitude secara otomatis dan presisi tinggi (6 angka desimal).
3. **Penyedia Foto Otomatis:** Tombol *"Gunakan Foto Otomatis Sesuai Kategori"* akan menyediakan URL foto Unsplash berkualitas tinggi yang cocok dengan kategori wisata yang dipilih.
4. **Form Lengkap:** Mendukung pengisian nama, wilayah (Flores / Timor / Lainnya), kategori (Pantai, Alam, Budaya, Sejarah), alamat, HTM, jam buka, rating, deskripsi, tagar, info cuaca, kondisi jalan, dan kepadatan lalu lintas.
5. **Persistensi Data (`localStorage`):** Titik wisata kustom yang ditambahkan akan tersimpan secara permanen di browser pengguna. Saat halaman di-refresh, semua titik kustom tetap tersimpan dan otomatis menyatu dengan filter, pencarian, dan rute navigasi.
6. **Hapus Titik Kustom:** Admin dapat menghapus titik wisata buatan kapan saja melalui tombol ikon tempat sampah di kartu wisata maupun popup penanda.

---

## ➕ Cara Menambahkan Destinasi Wisata Baru Secara Manual (via Kode)

Selain melalui antarmuka Admin di web, Anda juga dapat menambahkan destinasi permanen di kode sumber dengan membuka berkas `js/data.js` dan menambahkan objek baru ke dalam array `TOURISM_DESTINATIONS`:

```javascript
{
  id: "nama-unik-wisata",
  name: "Nama Tempat Wisata",
  category: "Alam", // Pilihan: Pantai, Alam, Budaya, Sejarah
  categoryColor: "emerald", // Pilihan: purple, cyan, amber, emerald
  rating: 4.8,
  reviewsCount: "5.4k",
  ticketPrice: "Rp 25.000",
  openingHours: "08:00 - 17:00 WIB",
  location: "Kecamatan, Kabupaten, Provinsi",
  lat: -7.xxxxxx,
  lng: 110.xxxxxx,
  image: "https://images.unsplash.com/photo-...",
  description: "Deskripsi singkat yang memikat pengunjung...",
  tags: ["Spot Foto", "Keluarga", "Sejuk"]
}
```
Aplikasi akan otomatis mengupdate peta, filter kategori, penanda (*marker*), dan pencarian tanpa konfigurasi tambahan!

