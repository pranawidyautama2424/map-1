# 🚀 Panduan Lengkap Deploy Peta Wisata JelajahNusantara (Supabase + Vercel / Cloudflare)

Panduan ini memandu Anda langkah demi langkah untuk menghubungkan proyek web peta wisata ini ke database online **Supabase (PostgreSQL)** dan men-deploy frontend-nya secara **100% GRATIS** agar dapat digunakan oleh masyarakat umum secara aman, cepat, dan stabil.

---

## 📋 Ikhtisar Arsitektur

```text
[ Pengunjung Umum ] ──── (Melihat Peta & Rute) ────┐
                                                   ├──> [ Vercel / Cloudflare CDN ]
[ Admin Pengelola ] ──── (Login & Kelola Titik) ───┘           │
                                                               ▼
                                                    [ Supabase Database ]
                                                    - PostgreSQL (PostGIS)
                                                    - Row Level Security (RLS)
                                                    - Auth Admin (Anti-Spam)
```

* **Pengunjung Umum:** Hanya memiliki hak akses membaca (*Read-Only*). Tidak dapat menghapus destinasi atau merusak data.
* **Admin (Anda):** Dapat login menggunakan akun admin untuk menambah titik lokasi baru dan menghapus destinasi langsung dari peta.

---

## 🛠️ Langkah 1: Buat Proyek di Supabase (Gratis)

1. Buka situs [https://supabase.com](https://supabase.com) dan klik **"Start your project"** (Bisa login via GitHub atau Google).
2. Di dashboard, klik tombol **"New Project"**.
3. Isi informasi proyek:
   * **Name:** `jelajah-nusantara` (atau nama lain sesuai keinginan Anda).
   * **Database Password:** Buat password yang kuat (simpan password ini di catatan pribadi).
   * **Region:** Pilih **`Southeast Asia (Singapore)`** (lokasi server paling dekat dan paling cepat untuk diakses dari Indonesia).
   * **Pricing Plan:** Pilih **Free Tier ($0/month)**.
4. Klik **"Create new project"** dan tunggu sekitar 1–2 menit hingga konfigurasi database selesai.

---

## 🗄️ Langkah 2: Jalankan Skema Database & Data Awal (SQL Editor)

File skema SQL telah disediakan lengkap di direktori proyek: `supabase_schema.sql`.

1. Di dashboard Supabase proyek Anda, klik menu **SQL Editor** (ikon `>_` di bilah navigasi kiri).
2. Klik tombol **"New query"**.
3. Buka file [supabase_schema.sql](file:///d:/BANTU_NUGAS/MAP/supabase_schema.sql) di komputer Anda, lalu **salin seluruh isinya** (Ctrl+A, lalu Ctrl+C).
4. Tempel (*paste*) kode SQL tersebut ke dalam SQL Editor Supabase.
5. Klik tombol **"Run"** (atau tekan `Ctrl + Enter`).
6. **Hasil yang terjadi:**
   * Tabel `destinations` berhasil dibuat dengan tipe data koordinat, cuaca, kondisi jalan, dan lalu lintas.
   * Kebijakan keamanan **Row Level Security (RLS)** otomatis aktif: Publik hanya bisa membaca, hanya admin login yang bisa menulis/menghapus.
   * 10 destinasi unggulan NTT (Labuan Bajo, Cunca Wulang, Fatumnasi, dll) otomatis langsung terisi ke dalam database!

---

## 👤 Langkah 3: Buat Akun Admin Pengelola

Agar Anda bisa menambah dan menghapus titik lokasi wisata:

1. Di bilah navigasi kiri Supabase, klik menu **Authentication** (ikon gembok/orang).
2. Pilih tab **Users**, lalu klik tombol **"Add User"** -> **"Create User"**.
3. Masukkan:
   * **User Email:** Email Anda (contoh: `admin@jelajah.id`).
   * **User Password:** Password yang Anda inginkan (minimal 6 karakter).
   * Centang opsi **"Auto Confirm User?"** (agar akun langsung aktif tanpa perlu verifikasi email).
4. Klik **"Create User"**.

---

## 🔑 Langkah 4: Hubungkan Kredensial ke Aplikasi

1. Di bilah navigasi kiri Supabase, klik menu **Project Settings** (ikon roda gigi di pojok bawah).
2. Pilih sub-menu **API**.
3. Anda akan melihat dua informasi penting:
   * **Project URL:** Berupa link `https://xxxxxxxxxxxxxxxxxxxx.supabase.co`
   * **Project API Keys:** Cari bagian **`anon` `public`** (kunci panjang bertuliskan `eyJhbGciOi...`).
4. Buka file [js/supabase-config.js](file:///d:/BANTU_NUGAS/MAP/js/supabase-config.js) di teks editor Anda.
5. Ganti bagian:
   ```javascript
   const SUPABASE_CONFIG = {
     url: "https://xxxxxxxxxxxxxxxxxxxx.supabase.co", // Tempel Project URL Anda di sini
     anonKey: "eyJhbGciOi..."                        // Tempel anon key Anda di sini
   };
   ```
6. Simpan file (`Ctrl + S`).

---

## 🧪 Langkah 5: Uji Coba Secara Lokal

1. Buka file `index.html` di browser Anda (atau jalankan `Jalankan_Website.bat`).
2. Tekan tombol `F12` lalu buka tab **Console**. Anda akan melihat pesan:
   `⚡ [Supabase] Client berhasil diinisialisasi.`
   `⚡ [Supabase] Berhasil memuat 10 destinasi dari Supabase.`
3. **Uji Coba Login Admin:**
   * Klik tombol **"Admin"** di pojok kanan atas navbar (ikon gembok).
   * Masukkan email dan password admin yang Anda buat di Langkah 3.
   * Klik **"Masuk sebagai Admin"**.
   * Status tombol akan berubah menjadi **"Admin Aktif"** (warna hijau).
   * Sekarang Anda bisa menekan tombol **"Tambah Wisata"** untuk menambahkan titik baru ke database Supabase, atau klik ikon **tempat sampah** untuk menghapus titik lokasi!

---

## 🌐 Langkah 6: Deploy ke Publik (100% Gratis Selamanya)

Pilih salah satu platform hosting gratis terbaik di bawah ini:

### 🌟 Pilihan A: Vercel (Paling Direkomendasikan & Sangat Cepat)

1. Upload seluruh folder proyek ini ke akun **GitHub** Anda:
   * Buat repository baru di GitHub (misal: `jelajah-nusantara`).
   * Jalankan git di terminal:
     ```bash
     git init
     git add .
     git commit -m "feat: integrasi supabase database & map"
     git branch -M main
     git remote add origin https://github.com/USERNAME-ANDA/jelajah-nusantara.git
     git push -u origin main
     ```
2. Buka [https://vercel.com](https://vercel.com) dan login menggunakan akun GitHub.
3. Klik tombol **"Add New..."** -> **"Project"**.
4. Pilih repository `jelajah-nusantara` yang baru Anda push, lalu klik **"Import"**.
5. Di bagian pengaturan *Build & Output Settings*, biarkan default (*Framework Preset: Other*).
6. Klik **"Deploy"**.
7. Tunggu sekitar 20–30 detik. Web Anda kini resmi online di alamat seperti `https://jelajah-nusantara.vercel.app` dengan sertifikat SSL/HTTPS gratis otomatis!

---

### 🚀 Pilihan B: Cloudflare Pages (Bandwidth Tanpa Batas)

1. Buka [https://dash.cloudflare.com](https://dash.cloudflare.com) dan masuk ke dashboard.
2. Di menu kiri, pilih **Workers & Pages** -> **Create application** -> Tab **Pages**.
3. Pilih **"Connect to Git"**, lalu pilih repository `jelajah-nusantara`.
4. Klik **"Begin setup"**, biarkan opsi build kosong, lalu klik **"Save and Deploy"**.
5. Website Anda aktif seketika di subdomain `*.pages.dev`.

---

## 🛡️ Mengapa Pengaturan Ini Sangat Aman untuk Publik?

1. **Anti-Troll & Anti-Deface:**
   Row Level Security (RLS) di database Supabase menolak seluruh upaya *hack* atau *injection* yang mencoba menambah atau menghapus data tanpa token sesi admin yang sah.
2. **Tanpa Biaya Server:**
   Frontend statis dilayani melalui jaringan CDN global (Vercel/Cloudflare Edge), sedangkan database berjalan di serverless Supabase yang hemat kuota dan tidak pernah mati mendadak saat diakses publik.
3. **Rute Navigasi Andal:**
   Sistem rute jalan raya OSRM dilengkapi *fallback* otomatis jika server publik sedang sibuk, menjamin pengalaman pengguna tetap mulus.

