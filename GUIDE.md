# Panduan Lengkap Fitur Aplikasi PERMATA (`GUIDE.md`)

**PERMATA (Platform Integrasi Pendidikan Resiliensi Mental & Pendampingan Anak dalam Konteks Kebencanaan)** adalah ekosistem aplikasi berbasis kearifan lokal Nusantara yang dirancang untuk mendampingi kesiapsiagaan bencana, respons darurat psikososial (*Psychological First Aid*), serta pertumbuhan pascatrauma (*Post-Traumatic Growth*).

Dokumen ini memuat panduan penggunaan untuk setiap fitur yang tersedia pada **Aplikasi Web (`apps/web`)** maupun **Layanan Backend API (`apps/api`)**.

---

## Daftar Isi

1. [Arsitektur Singkat & Cara Menjalankan Aplikasi](#1-arsitektur-singkat--cara-menjalankan-aplikasi)
2. [Panduan Fitur Antarmuka Web (`apps/web`)](#2-panduan-fitur-antarmuka-web-appsweb)
   - [2.1. Navigasi Utama & Geo-Cultural Tagging (Aceh / Sumbar)](#21-navigasi-utama--geo-cultural-tagging-aceh--sumbar)
   - [2.2. Halaman Utama / Landing Page (`/`)](#22-halaman-utama--landing-page-)
   - [2.3. Dashboard Resiliensi (`/dashboard`)](#23-dashboard-resiliensi-dashboard)
   - [2.4. Jurnal Hikmah (`/jurnal`)](#24-jurnal-hikmah-jurnal)
   - [2.5. Tele-Screening & Triage (`/tele-screening`)](#25-tele-screening--triage-tele-screening)
   - [2.6. AI Mental Support Companion (`/ai-companion`)](#26-ai-mental-support-companion-ai-companion)
   - [2.7. Mood + Food AI Analyzer (`/mood-food`)](#27-mood--food-ai-analyzer-mood-food)
   - [2.8. Game Center Resiliensi (6 Modul Permainan & Simulasi)](#28-game-center-resiliensi-6-modul-permainan--simulasi)
3. [Panduan Fitur Layanan Backend API (`apps/api`)](#3-panduan-fitur-layanan-backend-api-appsapi)
   - [3.1. Autentikasi, RBAC, & Persetujuan Orang Tua (`/api/v1/auth`, `/api/v1/children`)](#31-autentikasi-rbac--persetujuan-orang-tua-apiv1auth-apiv1children)
   - [3.2. Pilar 1: Kesiapsiagaan Bencana & Safety Passport](#32-pilar-1-kesiapsiagaan-bencana--safety-passport)
   - [3.3. Pilar 2: Respons Bencana, SafeConnect (PFA), & Sinkronisasi Offline](#33-pilar-2-respons-bencana-safeconnect-pfa--sinkronisasi-offline)
   - [3.4. Pilar 3: Pemulihan Jangka Panjang, Care Circle, & Grief Journey](#34-pilar-3-pemulihan-jangka-panjang-care-circle--grief-journey)
   - [3.5. Pilar 4: AI Guardrails, Dashboard Resiliensi Komunitas, & Audit](#35-pilar-4-ai-guardrails-dashboard-resiliensi-komunitas--audit)
4. [Daftar Rute & Endpoint Cepat](#4-daftar-rute--endpoint-cepat)

---

## 1. Arsitektur Singkat & Cara Menjalankan Aplikasi

Proyek PERMATA dikelola dalam monorepo menggunakan `pnpm` dan `turbo`:
- **`apps/web`**: Aplikasi frontend berbasis Next.js, React 19, Tailwind CSS, Framer Motion, Phaser 3, dan Google Gemini AI.
- **`apps/api`**: Layanan REST API berbasis Express, TypeScript, Prisma 7 (PostgreSQL), Redis/BullMQ, dan OpenAPI/Swagger.

### Menjalankan Aplikasi di Mode Development

1. **Instalasi dependensi** (dari root repositori):
   ```powershell
   pnpm install
   ```
2. **Menjalankan Frontend Web (`apps/web`)**:
   ```powershell
   pnpm --filter @permata/web dev
   ```
   Buka `http://localhost:3000` di browser.
3. **Menjalankan Backend API (`apps/api`)**:
   Pastikan file `apps/api/.env` sudah dikonfigurasi, lalu jalankan:
   ```powershell
   pnpm --filter @permata/api dev
   ```
   Server API berjalan di `http://localhost:4000` dan dokumentasi interaktif Swagger tersedia di `http://localhost:4000/api/docs`.

---

## 2. Panduan Fitur Antarmuka Web (`apps/web`)

### 2.1. Navigasi Utama & Geo-Cultural Tagging (Aceh / Sumbar)
- **Lokasi di Antarmuka**: Bilah navigasi atas (*Navbar*) yang selalu terlihat di seluruh halaman.
- **Fungsi Utama**:
  - **Menu Cepat**: Berpindah instan ke halaman **Home** (`/`), **Dashboard** (`/dashboard`), dan **Jurnal** (`/jurnal`).
  - **Tombol `LOKASI: ACEH` / `LOKASI: SUMBAR`**: Mengaktifkan fitur *Geo-Cultural Tagging* yang mengubah tema warna, istilah budaya, dan pendekatan refleksi di seluruh aplikasi:
    - **Mode Aceh**: Menggunakan palet warna hijau *Meunasah* (`#1B4332`) dengan aksen emas, mengangkat nilai *Meuseuraya* (gotong royong) dan forum dukungan sebaya *Saweu Syedara*.
    - **Mode Sumbar (Sumatera Barat)**: Menggunakan palet warna merah marun *Rumah Gadang* (`#7B0000`) dengan aksen kuning emas, mengangkat filosofi *Mambangkik Batang Tarandam* (semangat bangkit dari keterpurukan) dan *Badunsanak*.

---

### 2.2. Halaman Utama / Landing Page (`/`)
- **Fungsi Utama**: Memperkenalkan visi PERMATA dalam mendekonstruksi pendekatan klinis menjadi metode humanis berbasis kearifan lokal Nusantara.
- **Cara Menggunakan**:
  1. Klik tombol **`Mulai Pemulihan`** untuk langsung masuk ke halaman **Dashboard Resiliensi** (`/dashboard`).
  2. Klik kartu **`AI Jurnal Hikmah`** di bagian tengah halaman untuk langsung membuka fitur refleksi jurnal (`/jurnal`).
  3. Gunakan tautan pada bagian *Footer* untuk berpindah ke halaman utama lainnya.

---

### 2.3. Dashboard Resiliensi (`/dashboard`)
Halaman pusat kendali pengguna yang terbagi menjadi 4 area utama:

1. **Kartu Fitur Utama (4 Modul Inti)**:
   - **Saweu Syedara / Badunsanak**: Informasi ruang dukungan sebaya terkurasi dan anonim sesuai budaya yang aktif.
   - **Tele-Screening & Triage**: Membuka halaman deteksi risiko psikologis mandiri (`/tele-screening`).
   - **AI Mental Support Companion (ChatBot)**: Membuka ruang percakapan dengan asisten pendamping mental berbasis AI (`/ai-companion`).
   - **Mood + Food AI Analyzer**: Membuka fitur analisis emosi dan nutrisi dari foto makanan (`/mood-food`).
2. **Panel Progress Resiliensi & Pohon Harapan (*Hope Tree*)**:
   - Menampilkan visualisasi interaktif **Hope Tree** (Pohon Harapan) yang merepresentasikan tingkat ketangguhan pengguna beserta bilah persentase resiliensi.
3. **Target Harian (*Daily Goals*)**:
   - Daftar aktivitas pemulihan harian yang memberikan poin pengalaman (*XP*):
     - **Jurnal Hikmah (`+50 XP Refleksi`)**: Klik judulnya untuk membuka `/jurnal`.
     - **Latihan Napas (`+30 XP Tenang`)**: Klik judulnya untuk membuka `/game-breath`.
     - **Meditasi Budaya (`+40 XP Fokus`)**: Klik judulnya untuk membuka `/game-healing`.
   - Kotak centang (*checkbox*) di sisi kanan setiap target dapat dicentang langsung untuk menandai aktivitas yang sudah diselesaikan hari ini.
4. **Game Center Resiliensi**:
   - Menyediakan 6 kartu permainan edukatif dan simulasi kesiapsiagaan bencana.

---

### 2.4. Jurnal Hikmah (`/jurnal`)
- **Fungsi Utama**: Ruang aman untuk menuliskan perasaan, pengalaman, atau rasa syukur harian serta mendapatkan umpan balik reflektif berbasis kearifan lokal.
- **Langkah Penggunaan**:
  1. **Pilih Suasana Hati (*Mood Selector*)**: Klik salah satu dari 5 indikator perasaan saat ini:
     - `😢 Cemas/Takut` (Skor 1)
     - `😔 Sedih` (Skor 2)
     - `😐 Tenang/Biasa` (Skor 3)
     - `🙂 Bersyukur` (Skor 4)
     - `🌟 Penuh Harapan` (Skor 5)
  2. **Tulis Cerita Refleksi**: Ketikkan perasaan atau pengalaman hari ini pada kolom teks yang tersedia.
  3. **Simpan & Analisis Makna (AI)**: Klik tombol **`Simpan & Analisis Makna (AI)`**.
  4. **Lihat Hasil Refleksi & Riwayat**:
     - Sistem akan menampilkan kartu **Refleksi Pertumbuhan Jiwa** yang disesuaikan dengan budaya aktif (*Meuseuraya* untuk Aceh atau *Mambangkik Batang Tarandam* untuk Sumbar).
     - Catatan otomatis tersimpan di penyimpanan lokal browser (`localStorage`) dan tampil pada daftar **Riwayat Refleksi** di bagian bawah halaman.

---

### 2.5. Tele-Screening & Triage (`/tele-screening`)
- **Fungsi Utama**: Skrining mandiri kondisi emosional menggunakan instrumen **DASS-21 (*Depression, Anxiety, and Stress Scale - 21 Items*)** untuk mendeteksi tingkat depresi, kecemasan, dan stres secara dini.
- **Langkah Penggunaan**:
  1. Baca setiap pernyataan yang muncul di layar (total **21 pertanyaan**).
  2. Pilih salah satu dari 4 skala frekuensi yang paling menggambarkan kondisi Anda:
     - `Tidak pernah` (Skor 0)
     - `Kadang-kadang` (Skor 1)
     - `Sering` (Skor 2)
     - `Hampir selalu` (Skor 3)
  3. Pantau kemajuan pengisian melalui bilah progres (*progress bar*) di bagian atas kartu.
  4. Setelah pertanyaan ke-21 dijawab, sistem otomatis menghitung skor dan menampilkan **Hasil Tele-Screening**:
     - Kategori warna untuk **Depression**, **Anxiety**, dan **Stress** (*Normal*, *Mild*, *Moderate*, *Severe*, hingga *Extremely Severe*).
     - Pesan motivasi dan rekomendasi tindak lanjut (termasuk imbauan berkonsultasi dengan tenaga profesional bila terdeteksi tingkat *Severe* / *Extremely Severe*).
  5. Klik **`Selesai & Kembali ke Dashboard`** untuk kembali ke halaman utama dashboard.

---

### 2.6. AI Mental Support Companion (`/ai-companion`)
- **Fungsi Utama**: Chatbot pendamping dukungan emosional berbasis Google Gemini (`gemini-2.5-flash`) yang dilengkapi dengan **Sistem Deteksi Krisis (*Crisis Detection*)**.
- **Langkah Penggunaan**:
  1. Ketikkan keluh kesah, kecemasan, atau cerita Anda pada kolom input `"Tulis perasaan Anda..."` di bagian bawah.
  2. Tekan tombol **`Enter`** atau klik tombol kirim (ikon pesawat kertas).
  3. **Mekanisme Keamanan & Respons**:
     - **Percakapan Reguler**: Pesan dikirim ke endpoint `/api/chat` untuk direspons secara empatik dan suportif oleh asisten AI.
     - **Intersepsi Krisis Otomatis**: Jika pesan pengguna mengandung kata kunci indikasi bahaya darurat (*"bunuh diri"*, *"ingin mati"*, *"tidak ingin hidup"*, *"hopeless"*, *"self harm"*), sistem **langsung memotong alur** dan menampilkan pesan darurat berisi nomor **Hotline Kesehatan Mental 119** agar pengguna segera mendapatkan pertolongan manusia.

---

### 2.7. Mood + Food AI Analyzer (`/mood-food`)
- **Fungsi Utama**: Menganalisis hubungan antara kondisi emosi pengguna dan makanan yang dikonsumsi menggunakan kemampuan multimodal (teks + gambar/PDF) dari Google Gemini AI (`/api/mood-food`).
- **Langkah Penggunaan**:
  1. **Pilih Mood Kamu**: Klik salah satu tombol suasana hati (`😢 Sedih`, `😡 Marah`, atau `😄 Bahagia`).
  2. **Unggah Foto Makanan atau Ambil Gambar**:
     - Klik **`Choose File`** untuk memilih foto makanan (`image/*`) atau dokumen menu (`.pdf`) dari perangkat Anda.
     - Atau klik **`Take Photo`** untuk mengambil foto makanan langsung menggunakan kamera perangkat.
  3. Pastikan pratinjau (*preview*) foto telah muncul di layar.
  4. Klik tombol **`Analyze Now`**.
  5. **Hasil Analisis AI**: Sistem akan menampilkan penjelasan ringkas mengenai:
     - Perkiraan kandungan gizi utama dari makanan di foto.
     - Dampak makanan tersebut terhadap suasana hati yang sedang Anda rasakan.
     - Saran makanan atau minuman sehat tambahan untuk membantu menstabilkan emosi.

---

### 2.8. Game Center Resiliensi (6 Modul Permainan & Simulasi)

Seluruh permainan dapat diakses melalui bagian **Game Center Resiliensi** di halaman `/dashboard`:

| No | Nama Modul | Rute URL | Panduan & Tujuan Permainan |
| :--- | :--- | :--- | :--- |
| 1 | **Sigap Bencana** | `/game-quake` | Game interaktif berbasis **Phaser 3** (`900x600`). Mengajarkan respons cepat saat terjadi gempa bumi (melindungi diri, menghindari reruntuhan, dan menuju titik evakuasi) lengkap dengan sistem skor dan layar hasil evaluasi (*Result Scene*). |
| 2 | **Pinch and Drop (Pick & Drop Emergency Bag)** | `/game-healing` | Klik tombol **`Mainkan Game`** untuk membuka simulasi `/PickAndDrop.html`. Pengguna dilatih memilah dan menyeret (*drag-and-drop*) barang-barang darurat yang wajib masuk ke dalam **Tas Siaga Bencana** sebelum waktu habis. |
| 3 | **Breathing Calm** | `/game-breath` | Klik tombol **`Mainkan Game`** untuk membuka modul `/Breathing.html`. Menampilkan panduan visual latihan pernapasan berirama (*inhale - hold - exhale*) untuk menurunkan detak jantung dan meredakan kepanikan pascabencana. |
| 4 | **Siaga Minang** | `/game-siagaminang` | Klik tombol **`Mainkan Game`** untuk membuka `/SiagaMinang.html`. Permainan ketangkasan motorik di mana pemain mengumpulkan logistik kesiapsiagaan bencana sembari menghindari rintangan. |
| 5 | **Adventure Budaya** | `/game-adventure` | Klik tombol **`Mainkan Sekarang`** untuk membuka roleplay naratif mitigasi bencana berbasis kearifan lokal Nusantara (*Knock The Drought Out*). |
| 6 | **Roleplay Psikoedukasi** | `/roleplay` | Modul simulasi pengambilan keputusan dan *Growth Path* psikologis (saat ini berstatus *Coming Soon* pada antarmuka web dan didukung oleh modul skenario bercabang di backend API). |

> **Catatan Navigasi**: Pada setiap halaman pengantar game, klik tautan **`Kembali ke Dashboard`** di bagian bawah kartu untuk langsung kembali ke halaman `/dashboard`.

---

## 3. Panduan Fitur Layanan Backend API (`apps/api`)

Selain antarmuka web di atas, PERMATA memiliki layanan backend komprehensif (`apps/api`) yang mengimplementasikan seluruh spesifikasi teknis di dalam `PRD Permata.md`. Dokumentasi penuh skema request/response dapat diuji langsung melalui **Swagger UI** di `http://localhost:4000/api/docs`.

### 3.1. Autentikasi, RBAC, & Persetujuan Orang Tua (`/api/v1/auth`, `/api/v1/children`)
- **7 Peran Pengguna (*Role-Based Access Control*)**:
  - `ANAK`: Mengakses simulasi, jurnal pemulihan, pohon harapan, dan pendampingan.
  - `ORANG_TUA`: Mengelola profil anak, memberikan *Parental Consent*, dan memantau kesiapsiagaan keluarga.
  - `GURU`: Memantau kesiapsiagaan kelas dan berkolaborasi di *Care Circle*.
  - `RELAWAN` & `TENAGA_PSIKOSOSIAL`: Menangani sesi *SafeConnect* (PFA), triase, dan eskalasi rujukan.
  - `ADMIN_LEMBAGA` & `SUPER_ADMIN`: Mengelola organisasi, insiden bencana, konten kearifan lokal, dan audit log.
- **Fitur Utama**:
  - Registrasi & Login dengan hashing password **Argon2id**, rotasi *Refresh Token*, dan pencabutan sesi (*Session Revocation*).
  - **Parental Consent Gate**: Akun anak membutuhkan persetujuan orang tua/wali (`POST /api/v1/children/:id/consent`) sebelum diizinkan mengakses fitur pengumpulan data sensitif.

### 3.2. Pilar 1: Kesiapsiagaan Bencana & Safety Passport
- **Simulasi Bercabang (`/api/v1/simulations`)**:
  - Menyediakan skenario bencana interaktif (gempa bumi, tsunami, banjir, erupsi gunung berapi, tanah longsor) dengan pilihan tindakan bercabang (*branching steps*) dan perhitungan skor otomatis.
- **Asesmen Pra/Pasca-Edukasi (`/api/v1/assessments`)**:
  - Mengukur peningkatan pemahaman kesiapsiagaan anak melalui perbandingan nilai *pre-test* dan *post-test*.
- **Safety Passport (`/api/v1/safety-passport`)**:
  - Mencatat lencana (*badges*) yang diperoleh anak, level kesiapsiagaan, serta **Family Preparedness Checklist** (daftar cek kesiapan darurat keluarga seperti titik kumpul dan tas siaga).

### 3.3. Pilar 2: Respons Bencana, SafeConnect (PFA), & Sinkronisasi Offline
- **Manajemen Insiden Bencana (`/api/v1/disaster-incidents`)**:
  - Mengaktifkan status tanggap darurat wilayah dan menyajikan panduan keselamatan darurat yang relevan.
- **SafeConnect & Psychological First Aid (`/api/v1/support`)**:
  - **Request Support**: Anak atau orang tua dapat mengirim permintaan bantuan darurat psikososial.
  - **Emotional & Physical Check-in**: Pencatatan kondisi emosi dan kebutuhan fisik mendesak di lokasi pengungsian.
  - **Triase, Sesi Pendampingan, & Eskalasi Rujukan**: Fasilitator mencatat hasil sesi PFA dan membuat rujukan (*Referral*) ke psikolog/tenaga medis bila ditemukan tanda distres berat.
- **Mode Offline & Sinkronisasi (`/api/v1/offline`)**:
  - Mengunduh paket panduan darurat luar jaringan (`GET /api/v1/offline/bundles`) untuk kondisi tanpa sinyal dan menyinkronkan antrean data lapangan saat jaringan kembali tersedia (`POST /api/v1/offline/sync`).

### 3.4. Pilar 3: Pemulihan Jangka Panjang, Care Circle, & Grief Journey
- **Recovery Journal (`/api/v1/recovery-journal`)**:
  - Jurnal pemulihan dengan fitur **Visibility Settings** (anak dapat mengatur apakah jurnal bersifat pribadi atau boleh dilihat oleh orang tua/pendamping).
- **Post-Traumatic Growth Tree (`/api/v1/growth`)**:
  - Mencatat tonggak pemulihan (*milestones*) dan menumbuhkan level pohon harapan tanpa mekanisme hukuman (*no punitive streak*).
- **Care Circle (`/api/v1/care-circle`)**:
  - Ruang kolaborasi aman bagi orang tua, guru, dan fasilitator untuk berbagi catatan perkembangan dan rencana dukungan anak.
- **Grief & Adaptation Journey (`/api/v1/grief-journey`)**:
  - Modul aktivitas reflektif bertahap untuk mendampingi anak dalam memproses rasa kehilangan dan beradaptasi dengan situasi baru pascabencana.

### 3.5. Pilar 4: AI Guardrails, Dashboard Resiliensi Komunitas, & Audit
- **AI Companion dengan Guardrails Ketat (`/api/v1/ai`)**:
  - **Redaksi PII Otomatis**: Menghapus NIK, nomor telepon, alamat email, dan koordinat/alamat rumah sebelum teks dikirim ke penyedia AI eksternal.
  - **Pre-LLM Crisis Interception**: Menghentikan pemanggilan model AI jika terdeteksi kata kunci menyakiti diri sendiri dan otomatis membuat peringatan risiko (*Risk Flag*).
- **Community Resilience Dashboard (`/api/v1/dashboard`)**:
  - Menyajikan metrik kesiapsiagaan dan pemulihan tingkat daerah/sekolah.
  - **Small-Cell Suppression (`< 5`)**: Jika jumlah responden dalam suatu kelompok agregasi kurang dari 5 anak, metrik otomatis disembunyikan (`suppressed: true`) untuk mencegah identifikasi ulang (*re-identification*).
- **Audit Logging (`/api/v1/audit`)**:
  - Mencatat setiap akses baca/tulis pada data sensitif (jurnal anak, riwayat PFA, rujukan, dan perubahan persetujuan orang tua).

---

## 4. Daftar Rute & Endpoint Cepat

### Rute Halaman Web (`apps/web` - Port `3000`)

| Rute URL | Nama Halaman | File Komponen Utama |
| :--- | :--- | :--- |
| `/` | Landing Page | `apps/web/src/components/pages/LandingPage.tsx` |
| `/dashboard` | Dashboard Resiliensi | `apps/web/src/components/pages/Dashboard.tsx` |
| `/jurnal` | Jurnal Hikmah | `apps/web/src/components/pages/Journal.tsx` |
| `/tele-screening` | Tele-Screening & Triage (DASS-21) | `apps/web/src/components/pages/TeleScreening.tsx` |
| `/ai-companion` | AI Mental Support Companion | `apps/web/src/components/pages/AiCompanion.tsx` |
| `/mood-food` | Mood + Food AI Analyzer | `apps/web/src/components/pages/MoodFoodAnalyzer.tsx` |
| `/game-quake` | Game Sigap Bencana (Phaser 3) | `apps/web/src/components/pages/GameQuake.tsx` |
| `/game-healing` | Game Pick & Drop Emergency Bag | `apps/web/src/components/pages/GameHealing.tsx` |
| `/game-breath` | Game Breathing Calm | `apps/web/src/components/pages/GameBreathing.tsx` |
| `/game-siagaminang` | Game Siaga Minang | `apps/web/src/components/pages/GameSiagaMinang.tsx` |
| `/game-adventure` | Game Adventure Budaya | `apps/web/src/components/pages/GameAdventure.tsx` |
| `/roleplay` | Roleplay Psikoedukasi | `apps/web/src/components/pages/RoleplayPsy.tsx` |

### Rute API Internal Next.js (`apps/web`)

| Method & Endpoint | Fungsi | File Route |
| :--- | :--- | :--- |
| `POST /api/chat` | Endpoint chatbot AI Mental Support Companion | `apps/web/src/app/api/chat/route.ts` |
| `POST /api/mood-food` | Endpoint analisis multimodal Mood + Food | `apps/web/src/app/api/mood-food/route.ts` |

### Grup Endpoint Backend Utama (`apps/api` - Port `4000`)

| Prefix Endpoint | Modul |
| :--- | :--- |
| `/api/v1/auth` & `/api/v1/users` | Autentikasi JWT, sesi, profil pengguna |
| `/api/v1/children` & `/api/v1/organizations` | Profil anak, *Parental Consent*, sekolah/lembaga |
| `/api/v1/simulations`, `/api/v1/assessments`, `/api/v1/safety-passport` | Pilar 1: Edukasi & kesiapsiagaan bencana |
| `/api/v1/disaster-incidents`, `/api/v1/support`, `/api/v1/offline` | Pilar 2: Tanggap darurat, *SafeConnect* (PFA), sinkronisasi offline |
| `/api/v1/recovery-journal`, `/api/v1/growth`, `/api/v1/care-circle`, `/api/v1/grief-journey` | Pilar 3: Pemulihan jangka panjang & pertumbuhan pascatrauma |
| `/api/v1/ai`, `/api/v1/dashboard`, `/api/v1/content`, `/api/v1/regions`, `/api/v1/media`, `/api/v1/admin`, `/api/v1/audit` | Pilar 4: AI Guardrails, analitik komunitas, CMS kearifan lokal, & audit |

