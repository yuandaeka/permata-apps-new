# Product Requirements Document (PRD)
## PERMATA — Backend Implementation

**Versi:** 1.0  
**Tanggal:** 12 November 2026  
**Status:** Draft teknis untuk implementasi backend  
**Basis kebutuhan:** Dokumen `Fiturr permata.docx`  
**Cakupan:** Backend service untuk aplikasi PERMATA yang telah memiliki frontend Next.js 16 dalam monorepo Turborepo.

---

## 1. Ringkasan Produk

PERMATA merupakan platform pendampingan anak dalam konteks kebencanaan yang mencakup tiga fase utama: pencegahan dan kesiapsiagaan (*Prevention*), dukungan ketika bencana berlangsung (*During Disaster*), serta pemulihan pascabencana (*Recovery*). Platform juga menyediakan kemampuan pendukung melalui *Smart Technology*.

Dokumen ini mendefinisikan kebutuhan backend untuk mendukung fitur-fitur tersebut. Backend bertanggung jawab atas autentikasi dan otorisasi, pengelolaan data, business rules, penyimpanan konten dan aktivitas, integrasi layanan eksternal, agregasi data, serta penyediaan API bagi frontend Next.js 16.

Backend tidak mencakup implementasi UI, komponen React, styling, navigasi frontend, maupun mekanisme penyimpanan offline di perangkat. Backend hanya menyediakan data, API sinkronisasi, dan metadata yang diperlukan agar frontend dapat menjalankan kemampuan tersebut.

### 1.1 Tujuan

1. Menyediakan satu sumber data terpusat bagi seluruh modul PERMATA.
2. Mendukung peran anak, orang tua/pengasuh, guru/konselor, relawan, tenaga profesional, petugas berwenang, dan pengelola program.
3. Menjaga kerahasiaan data anak, khususnya informasi lokasi, kondisi emosional, dan catatan pemulihan.
4. Menyediakan API yang konsisten, tervalidasi, terdokumentasi, dan dapat dikembangkan.
5. Mendukung konten edukasi yang dapat disesuaikan berdasarkan wilayah dan budaya.
6. Menyediakan data agregat untuk Community Resilience Dashboard tanpa mengekspos kondisi individual anak.
7. Menyiapkan fondasi integrasi AI tanpa menjadikan AI sebagai pengganti tenaga profesional.

### 1.2 Prinsip Produk dan Keselamatan

- Data anak merupakan data berisiko tinggi dan harus dilindungi dengan pembatasan akses berdasarkan peran, hubungan pendampingan, organisasi, dan kebutuhan tugas.
- Lokasi anak dalam SafeConnect tidak boleh tersedia untuk publik.
- Emotional Readiness Assessment merupakan alat pemetaan kebutuhan edukasi dan dukungan, bukan alat diagnosis psikologis.
- SOS Emotional Support merupakan dukungan awal berbasis prinsip Psychological First Aid (PFA), bukan pengganti bantuan langsung atau layanan profesional.
- Healing Journey tidak boleh mewajibkan anak menceritakan ulang pengalaman traumatis.
- Growth Garden tidak boleh memberi label bahwa anak gagal ketika tidak menunjukkan perkembangan tertentu.
- Lima aspek Grief Journey bukan tahapan linear atau urutan wajib.
- PERMATA AI Companion tidak boleh mendiagnosis trauma atau memberikan konseling klinis tanpa pengawasan profesional.
- Dashboard komunitas hanya menampilkan data agregat dengan perlindungan terhadap identifikasi ulang.

---

## 2. Ruang Lingkup

### 2.1 Termasuk dalam PRD

1. Struktur aplikasi backend Express.js + TypeScript.
2. Integrasi backend ke monorepo Turborepo.
3. Prisma ORM dan PostgreSQL schema.
4. Autentikasi, otorisasi, role, organisasi, dan relasi pendampingan.
5. API seluruh modul Prevention, During Disaster, Recovery, dan Smart Technology.
6. Pengelolaan konten edukasi, skenario simulasi, asesmen, panduan, dan materi PFA.
7. Pengelolaan file/media melalui object storage yang dikonfigurasi.
8. Audit log, keamanan, privasi, validasi, dan rate limiting.
9. Agregasi data untuk dashboard komunitas.
10. Integrasi AI melalui adapter/provider interface.
11. Sinkronisasi data untuk kebutuhan Offline Survival Mode.
12. Pengujian, dokumentasi API, observability, dan deployment backend.

### 2.2 Tidak Termasuk dalam PRD

- Implementasi halaman dan komponen frontend Next.js 16.
- Desain visual, animasi, game rendering, dan interaksi UI.
- Implementasi peta interaktif di frontend.
- Penyimpanan lokal browser/perangkat dan service worker.
- Pengembangan model AI sendiri atau pelatihan model machine learning.
- Diagnosis, penilaian klinis, atau rekomendasi terapi otomatis.
- Integrasi langsung ke sistem pemerintah/rumah sakit yang belum ditentukan.
- Penentuan protokol operasional lapangan dan kebijakan perlindungan anak oleh organisasi.

### 2.3 Batasan Integrasi Frontend

Frontend Next.js 16 yang sudah ada akan menjadi client dari backend Express. Komunikasi dilakukan melalui REST API menggunakan JSON dan mekanisme upload file yang ditentukan. Business rules dan akses database berada di backend.

Next.js boleh memiliki server-side rendering, server actions, atau API proxy sesuai kebutuhan aplikasi, tetapi tidak boleh menjadi sumber kedua untuk business rules yang seharusnya menjadi tanggung jawab backend.

---

## 3. Pengguna dan Role

Role berikut merupakan rancangan awal. Hak akses final perlu disetujui bersama pemilik produk dan pihak yang bertanggung jawab atas perlindungan anak.

| Role | Tanggung jawab utama | Batas akses |
|---|---|---|
| Child | Mengakses edukasi, simulasi, asesmen, jurnal, dan fitur pendampingan | Hanya data milik sendiri dan konten yang diizinkan |
| Parent/Guardian | Mengelola informasi keselamatan dan mendampingi anak | Anak yang memiliki relasi wali terverifikasi |
| Teacher/Counselor | Mendukung edukasi dan pemantauan anak dalam lingkup sekolah | Anak yang ditugaskan/terhubung dalam organisasi |
| Volunteer | Memberikan pendampingan sesuai penugasan | Data minimum sesuai tugas dan masa penugasan |
| Professional | Memberikan asesmen/intervensi profesional sesuai kewenangan | Hanya anak yang dirujuk atau ditugaskan |
| Authorized Officer | Mengelola pencatatan keselamatan dan reunifikasi | Data SafeConnect sesuai wilayah/operasi dan penugasan |
| Program Manager | Mengelola program dan melihat dashboard komunitas | Data agregat organisasi/wilayah |
| Content Admin | Mengelola konten edukasi, skenario, asesmen, dan panduan | Tidak otomatis memperoleh akses ke catatan pribadi anak |
| Super Admin | Mengelola konfigurasi sistem dan akun administratif | Akses administratif dengan audit ketat |

### 3.1 Ketentuan Role dan Relasi

- Role tidak boleh menjadi satu-satunya dasar otorisasi. Backend harus memeriksa relasi pengguna dengan anak, organisasi, wilayah, dan penugasan.
- Seorang pengguna dapat memiliki lebih dari satu role.
- Relasi wali harus melalui proses verifikasi yang ditentukan organisasi.
- Petugas SafeConnect harus memiliki penugasan aktif sebelum dapat mengakses data operasi.
- Akses tenaga profesional harus memiliki konteks rujukan atau penugasan.
- Perubahan role, relasi wali, penugasan, dan status akun harus tercatat dalam audit log.

---

## 4. Arsitektur Teknis

### 4.1 Stack

| Komponen | Teknologi |
|---|---|
| Monorepo | Turborepo |
| Frontend existing | Next.js 16 |
| Backend API | Express.js |
| Bahasa | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| API style | REST |
| API documentation | OpenAPI / Swagger |
| Validation | Zod |
| Authentication | Access token + refresh token atau session-based authentication |
| Password hashing | Argon2id atau bcrypt dengan konfigurasi aman |
| File storage | S3-compatible object storage atau provider yang dipilih |
| Background jobs | Queue worker (opsional sesuai kebutuhan operasional) |
| Testing | Vitest/Jest + Supertest |
| Logging | Structured logging |
| Deployment | Backend service terpisah dari Next.js |

Pilihan provider untuk object storage, queue, email, SMS, push notification, dan AI belum ditentukan dalam dokumen sumber. Implementasi harus menggunakan adapter agar provider dapat diganti tanpa mengubah domain logic.

### 4.2 Rekomendasi Struktur Turborepo

Struktur berikut merupakan rekomendasi, bukan kewajiban untuk mengubah struktur monorepo yang sudah ada. Sesuaikan nama package dengan konvensi repository saat ini.

```text
apps/
  web/                         # Existing Next.js 16 application
  api/                         # Express.js backend
    src/
      app.ts
      server.ts
      config/
      middlewares/
      modules/
        auth/
        users/
        organizations/
        children/
        prevention/
        disaster-response/
        recovery/
        smart-technology/
        content/
        files/
        notifications/
        analytics/
        audit/
      common/
      infrastructure/
      jobs/
      tests/
    prisma/
      schema.prisma
      migrations/
      seed.ts

packages/
  config/
  types/
  validation/
  eslint-config/
  tsconfig/

turbo.json
package.json
```

Ketentuan:
- `apps/api` menjadi service Express yang dapat dijalankan dan di-deploy secara independen.
- Prisma schema dan migration dimiliki backend.
- Shared package hanya berisi tipe, schema validasi yang benar-benar lintas aplikasi, atau konfigurasi umum.
- Frontend tidak boleh mengimpor Prisma Client.
- Hindari menaruh business logic di shared package hanya demi berbagi kode.
- Secret dan environment variable backend tidak boleh terekspos ke browser.

### 4.3 Pola Arsitektur Backend

Gunakan modular monolith terlebih dahulu dengan pemisahan tanggung jawab:

```text
HTTP Request
    |
Express Router
    |
Authentication / Authorization / Validation
    |
Controller
    |
Application Service
    |
Domain Rules
    |
Repository / Prisma
    |
PostgreSQL
```

Integrasi eksternal ditempatkan di infrastructure adapter, misalnya object storage, AI provider, email, dan notification provider.

**Keputusan:** Tidak perlu memulai dengan microservices. Modular monolith lebih sederhana untuk pengembangan awal dan tetap memungkinkan pemisahan service jika skala serta kebutuhan operasional sudah terbukti.

---

## 5. Modul dan Kebutuhan Fungsional

## 5.1 Foundation: Authentication, User, dan Organization

### AUTH-01 — Authentication

Backend harus menyediakan:
- Registrasi dan login sesuai kebijakan akun yang ditetapkan.
- Logout dan pencabutan refresh token/session.
- Refresh access token.
- Pengelolaan sesi/perangkat aktif.
- Reset password melalui mekanisme verifikasi.
- Verifikasi alamat email/nomor telepon jika digunakan.
- Penonaktifan akun dan pengelolaan status akun.
- Rate limiting untuk login, reset password, dan endpoint sensitif.

Persyaratan:
- Password disimpan dalam bentuk hash, tidak pernah plaintext.
- Token refresh disimpan secara aman dan dapat dicabut.
- Token memiliki expiry yang dapat dikonfigurasi.
- Endpoint sensitif menerapkan autentikasi dan otorisasi.
- Respons login tidak membocorkan apakah suatu email/nomor terdaftar.

### AUTH-02 — Role-Based and Relationship-Based Access Control

Backend harus menggabungkan:
- Role-based access control (RBAC).
- Pemeriksaan relasi wali/pendamping.
- Scope organisasi dan wilayah.
- Penugasan operasional.
- Permission khusus untuk data sensitif.

Contoh: role `teacher` tidak otomatis dapat membaca semua jurnal anak. Guru hanya dapat membaca data yang secara eksplisit dibagikan dan berada dalam lingkup pendampingannya.

### USER-01 — User Profile

Menyimpan:
- Nama lengkap.
- Identitas login.
- Kontak yang diperlukan.
- Status akun.
- Preferensi bahasa.
- Role.
- Timestamp pembuatan dan perubahan.

Data anak harus dipisahkan secara logis dari profil pengguna umum agar akses dan retensi dapat diatur lebih ketat.

### ORG-01 — Organization and Membership

Mendukung organisasi seperti sekolah, lembaga kemanusiaan, instansi, atau pengelola program.

Fungsi:
- Membuat dan memperbarui organisasi.
- Mengelola anggota organisasi.
- Menetapkan role dalam organisasi.
- Mengelola sekolah/wilayah/program.
- Mengelola status keanggotaan dan penugasan.

### CHILD-01 — Child Profile and Guardian Relationship

Data minimum:
- Nama atau nama tampilan anak.
- Tanggal lahir atau kelompok usia sesuai kebutuhan.
- Wilayah domisili pada tingkat yang diperlukan.
- Bahasa pilihan.
- Relasi wali/pengasuh.
- Organisasi/sekolah terkait jika ada.
- Status persetujuan wali.

Ketentuan:
- Kumpulkan data seminimal mungkin.
- Jangan meminta alamat rinci jika tidak diperlukan oleh use case.
- Persetujuan wali harus dapat dicatat, diperbarui, dan dicabut.
- Riwayat perubahan relasi wali harus diaudit.
- Penghapusan akun/data harus mengikuti kebijakan retensi dan kewajiban hukum yang berlaku.

---

## 5.2 Prevention — Pencegahan dan Kesiapsiagaan

### PREV-01 — Disaster Simulated Playground

Backend mengelola konten dan hasil simulasi. Rendering permainan dan interaksi visual dilakukan frontend.

Fungsi backend:
1. Mengelola kategori bencana.
2. Mengelola skenario simulasi.
3. Mengelola tahapan/kejadian dalam skenario.
4. Menyediakan pilihan tindakan pada setiap tahapan.
5. Menyimpan tindakan yang dipilih anak.
6. Menyediakan hasil evaluasi dan penjelasan keselamatan.
7. Menyimpan riwayat percobaan dan progres simulasi.

Data skenario minimal:
- Judul dan deskripsi.
- Jenis bencana.
- Tingkat usia/kelompok usia.
- Bahasa dan wilayah target.
- Versi konten.
- Status publikasi.
- Daftar tahapan.
- Pilihan tindakan.
- Penanda tindakan yang direkomendasikan.
- Penjelasan edukatif.
- Urutan tahapan.

Business rules:
- Penilaian jawaban harus berasal dari konten yang dikurasi, bukan dibuat bebas oleh AI.
- Setiap percobaan menyimpan versi skenario agar hasil historis tetap dapat ditafsirkan.
- Hasil simulasi tidak digunakan sebagai diagnosis atau label kemampuan permanen anak.
- Konten yang sudah dipublikasikan tidak boleh berubah secara diam-diam; gunakan versioning.

### PREV-02 — Emotional Readiness Assessment

Backend menyediakan assessment berbasis pertanyaan sederhana untuk memetakan kebutuhan edukasi dan dukungan.

Fungsi:
- Mengelola assessment, pertanyaan, opsi jawaban, dan rekomendasi.
- Menyajikan assessment aktif berdasarkan usia, bahasa, dan konteks bencana.
- Menyimpan jawaban dan hasil assessment.
- Menghasilkan rekomendasi edukasi/aktivitas berdasarkan aturan yang telah ditentukan dan disetujui.
- Menyimpan versi instrumen dan aturan rekomendasi.

Data:
- Assessment.
- Assessment version.
- Question.
- Answer option.
- Submission.
- Response.
- Recommendation rule.
- Recommendation result.

Business rules:
- Hasil tidak boleh diberi label diagnosis, gangguan, atau tingkat trauma klinis.
- Rekomendasi dibatasi pada edukasi kesiapsiagaan, aktivitas regulasi emosi, dan saran mencari dukungan orang dewasa.
- Aturan rekomendasi harus dapat ditinjau dan disetujui oleh ahli yang relevan.
- Jawaban individual hanya dapat diakses oleh anak dan pihak yang memiliki izin sesuai kebijakan.
- Dashboard hanya boleh menerima agregasi yang aman.

### PREV-03 — My Safety Passport

Backend menyimpan informasi keselamatan anak dan keluarga.

Data yang dapat dikelola:
- Kontak orang tua/wali.
- Anggota keluarga.
- Titik kumpul keluarga.
- Kebutuhan darurat.
- Orang dewasa tepercaya.
- Panduan keselamatan berdasarkan wilayah.
- Timestamp verifikasi/pembaruan.

Fungsi:
- CRUD data Safety Passport.
- Menandai kontak utama dan kontak alternatif.
- Menyimpan versi panduan keselamatan.
- Menyediakan endpoint pengambilan data untuk sinkronisasi offline.
- Mencatat perubahan data penting.

Ketentuan:
- Data hanya dapat diakses anak yang bersangkutan dan wali terverifikasi sesuai izin.
- Informasi kontak dan data keluarga dienkripsi saat transit dan dilindungi saat tersimpan.
- Hindari mengekspos data ini melalui endpoint publik.

---

## 5.3 During Disaster — Saat Bencana Terjadi

### DIS-01 — SafeConnect: Family Reunification System

Backend mendukung pencatatan anak, status keselamatan, lokasi pengungsian, dan proses reunifikasi oleh petugas berwenang.

Fungsi:
1. Membuat incident/event kebencanaan.
2. Mendaftarkan anak pada incident.
3. Mencatat status keselamatan anak.
4. Mencatat lokasi pengungsian atau titik penanganan.
5. Mencatat pihak keluarga/pengasuh yang sedang dicari.
6. Membuat permintaan reunifikasi.
7. Melakukan verifikasi identitas dan hubungan keluarga.
8. Mencatat proses persetujuan dan serah terima.
9. Menyimpan riwayat perubahan status.

Status awal yang disarankan:
- `REPORTED`
- `IDENTITY_PENDING`
- `IDENTIFIED`
- `SAFE_AT_SHELTER`
- `MATCH_PENDING`
- `VERIFICATION_PENDING`
- `REUNIFICATION_APPROVED`
- `REUNITED`
- `CLOSED`

Status dapat disesuaikan dengan SOP organisasi.

Business rules dan keamanan:
- Data lokasi anak tidak boleh tersedia pada endpoint publik.
- Hanya petugas dengan penugasan dan permission aktif yang dapat melihat lokasi.
- Keluarga tidak otomatis memperoleh lokasi presisi sebelum proses verifikasi yang ditentukan.
- Setiap akses ke data lokasi harus dicatat dalam audit log.
- Perubahan status reunifikasi harus menyimpan aktor, waktu, dan alasan.
- Proses serah terima memerlukan verifikasi dan pencatatan pihak yang menyerahkan serta menerima.
- Endpoint pencarian anak harus dibatasi, rate-limited, dan tidak mengungkap data berlebihan.

### DIS-02 — SOS Emotional Support

Backend mengelola materi PFA dan permintaan bantuan.

Konten:
- Panduan pernapasan sederhana.
- Audio penenang.
- Latihan grounding.
- Arahan mencari orang dewasa tepercaya.
- Informasi pendamping terlatih.

Fungsi:
- Mengelola materi dan versi panduan.
- Menyediakan konten sesuai bahasa/usia.
- Mencatat permintaan bantuan jika anak meminta pendamping.
- Meneruskan permintaan kepada petugas/pendamping yang sesuai.
- Mengelola status tindak lanjut.

Status permintaan bantuan yang disarankan:
- `OPEN`
- `ACKNOWLEDGED`
- `ASSIGNED`
- `IN_PROGRESS`
- `RESOLVED`
- `CANCELLED`

Ketentuan:
- Jangan membuat diagnosis otomatis dari respons anak.
- Jangan menjanjikan layanan darurat jika tidak ada petugas yang benar-benar tersedia.
- Tampilkan informasi batas layanan dan anjuran mencari bantuan langsung dari orang dewasa/layanan darurat.
- Jika ada mekanisme eskalasi, aturan, jam layanan, wilayah cakupan, dan penanggung jawab harus dikonfigurasi secara eksplisit.

### DIS-03 — Offline Survival Mode

Fitur offline pada perangkat merupakan tanggung jawab frontend. Backend menyediakan API untuk menyiapkan dan menyinkronkan konten.

Fungsi backend:
- Menyediakan paket konten offline.
- Menyediakan panduan keselamatan.
- Menyediakan peta evakuasi yang telah dipublikasikan sebagai file/data.
- Menyediakan kontak darurat yang diizinkan.
- Menyediakan panduan PFA.
- Menyediakan versi, checksum, dan timestamp pembaruan paket.
- Mendukung sinkronisasi progres/aktivitas setelah koneksi kembali.

Persyaratan:
- Paket konten memiliki versi dan metadata pembaruan.
- Konten offline harus dapat diunduh sebelum koneksi terputus.
- Backend harus menyediakan strategi konflik sinkronisasi, misalnya berdasarkan `updatedAt` dan versi record.
- Data sensitif tidak boleh ikut ke paket publik/offline umum.
- Backend tidak dapat menjamin akses offline; kemampuan tersebut bergantung pada implementasi penyimpanan lokal di frontend.

---

## 5.4 Recovery — Pemulihan Pascabencana

### REC-01 — Healing Journey: Digital Recovery Journal

Backend menyediakan penyimpanan jurnal ekspresi anak.

Jenis entri:
- Gambar.
- Cerita/tulisan.
- Rekaman suara.
- Pilihan suasana hati.
- Aktivitas kreatif.

Fungsi:
- Membuat, membaca, memperbarui, dan menghapus entri.
- Mengunggah media melalui mekanisme upload aman.
- Menyimpan metadata media.
- Mengatur visibilitas dan izin berbagi.
- Menyimpan waktu pembuatan dan perubahan.
- Menyediakan daftar aktivitas kreatif yang dapat dilakukan.

Business rules:
- Anak tidak diwajibkan mengisi narasi kejadian traumatis.
- Entri bersifat privat secara default.
- Wali/pendamping tidak otomatis memperoleh akses ke semua entri.
- Berbagi entri harus memiliki persetujuan dan cakupan yang jelas.
- Media harus memiliki batas ukuran, MIME type allowlist, dan pemeriksaan keamanan.
- Penghapusan entri mengikuti kebijakan retensi dan audit yang sesuai.

### REC-02 — Growth Garden: Post-Traumatic Growth Tracker

Backend menyimpan refleksi perkembangan positif berdasarkan lima aspek dalam dokumen sumber:

1. Personal Strength.
2. Appreciation of Life.
3. Relating to Others.
4. New Possibilities.
5. Spiritual or Existential Change.

Fungsi:
- Mengelola prompt/refleksi untuk setiap aspek.
- Menyimpan catatan perkembangan yang dipilih anak.
- Menyimpan tanggal dan konteks aktivitas.
- Menyediakan data progres untuk visualisasi tanaman di frontend.
- Menyediakan riwayat refleksi.

Business rules:
- Backend tidak boleh memaksa semua aspek memiliki progres.
- Tidak ada skor kelulusan atau kegagalan.
- Tidak boleh membandingkan anak satu dengan lainnya.
- Visualisasi pertumbuhan tanaman ditentukan frontend berdasarkan data progres yang aman.
- Catatan individual tidak masuk dashboard agregat kecuali telah dianonimkan dan memenuhi batas agregasi.

### REC-03 — CareCircle: Child Support Network

Backend mengelola jaringan pendamping anak.

Jenis anggota:
- Orang tua/pengasuh.
- Guru/konselor sekolah.
- Relawan pendamping.
- Psikolog/tenaga profesional.

Fungsi:
- Mengirim undangan relasi pendamping.
- Menyetujui atau menolak relasi.
- Menentukan jenis hubungan dan cakupan izin.
- Menugaskan pendamping.
- Mengelola status relasi.
- Mencatat catatan pendampingan sesuai permission.
- Mengelola rujukan kepada tenaga profesional.
- Mencatat perubahan dan pencabutan akses.

Business rules:
- Relasi tidak otomatis memberikan akses penuh ke semua data anak.
- Izin harus granular, misalnya akses informasi keselamatan, catatan check-in, atau informasi aktivitas tertentu.
- Relasi harus dapat dicabut.
- Catatan profesional harus memiliki pembatasan khusus dan tidak boleh terbuka ke seluruh anggota CareCircle.
- Guru/relawan hanya melakukan aktivitas sesuai pelatihan, supervisi, dan kewenangannya.

### REC-04 — Grief Journey: Moving Forward

Backend mendukung pendampingan kehilangan dengan lima aspek yang disebut dalam dokumen:
- Denial — Understanding the Loss.
- Anger — Expressing Feelings.
- Bargaining — Understanding What Happened.
- Depression — Processing Sadness.
- Acceptance — Moving Forward.

Fitur pendukung:
1. Emotion Check-in.
2. My Memory Box.
3. Feelings Expression.
4. Little Steps Forward.
5. Support Connection.

Fungsi backend:
- Mengelola konten dan aktivitas berdasarkan lima aspek.
- Menyimpan emotion check-in.
- Menyimpan kenangan berupa gambar, foto, cerita, dan audio.
- Menyimpan ekspresi perasaan.
- Mengelola aktivitas kecil/rutinitas.
- Menghubungkan permintaan dukungan ke CareCircle.
- Menyediakan riwayat aktivitas.

Business rules:
- Lima aspek bukan urutan wajib.
- Anak dapat berpindah, mengulang, atau tidak menggunakan aspek tertentu.
- Tidak boleh mengasumsikan anak harus mencapai Acceptance.
- Konten harus bersifat edukatif dan suportif, bukan diagnosis atau terapi otomatis.
- Memory Box bersifat privat secara default.
- Support Connection harus menggunakan mekanisme relasi dan izin CareCircle.

---

## 5.5 Smart Technology

### SMART-01 — Geo-Cultural Adaptation

Backend menyediakan sistem pengelolaan konten berdasarkan lokasi, bahasa, budaya, dan karakteristik risiko wilayah.

Data:
- Wilayah administratif.
- Bahasa.
- Preferensi istilah lokal.
- Profil budaya/konteks lokal.
- Kategori bencana yang relevan.
- Cerita/ilustrasi/materi lokal.
- Versi dan status publikasi konten.

Fungsi:
- Mengelola data wilayah.
- Menghubungkan konten dengan wilayah dan bahasa.
- Menyediakan materi berdasarkan profil lokasi anak.
- Mendukung fallback ke bahasa/konten default.
- Mengelola versi konten dan publikasi.

Catatan:
- Backend hanya menyediakan metadata dan konten. Pemilihan ilustrasi, font, dan rendering bahasa dilakukan frontend.
- Penentuan risiko bencana harus berasal dari sumber data yang dapat dipertanggungjawabkan dan dikelola admin yang berwenang.
- Dokumen sumber belum menetapkan sumber data geografis atau klasifikasi risiko; hal tersebut perlu diputuskan sebelum integrasi.

### SMART-02 — Community Resilience Dashboard

Backend menyediakan API agregasi untuk pengelola program, sekolah, pemerintah daerah, atau organisasi kemanusiaan.

Metrik yang didukung dokumen:
- Jumlah anak yang telah mengikuti simulasi bencana.
- Wilayah yang masih membutuhkan edukasi kebencanaan.
- Kebutuhan pendampingan psikososial secara keseluruhan.
- Ketersediaan fasilitas pendukung.
- Hasil evaluasi program.

Fungsi:
- Mengagregasi data per organisasi/wilayah/periode.
- Menghitung partisipasi simulasi.
- Menghitung cakupan edukasi.
- Menyajikan kebutuhan dukungan dalam bentuk agregat.
- Mengelola data fasilitas pendukung.
- Menyajikan evaluasi program.
- Mengekspor laporan jika diizinkan.

Ketentuan privasi:
- Dashboard tidak menampilkan jurnal, jawaban asesmen, identitas, atau kondisi psikologis individual anak.
- Terapkan ambang minimum jumlah subjek sebelum menampilkan suatu agregasi (*small-cell suppression*).
- Hindari filter kombinasi yang dapat mengidentifikasi satu anak.
- Hak akses dashboard dibatasi berdasarkan organisasi dan wilayah.
- Angka agregat tidak boleh digunakan untuk membuat kesimpulan klinis terhadap individu.

### SMART-03 — PERMATA AI Companion

Backend menjadi perantara antara frontend dan AI provider.

Kemampuan:
- Menerima pertanyaan anak.
- Mengirim konteks usia, bahasa, dan materi edukasi yang relevan secara minimum.
- Menyediakan jawaban sederhana sesuai usia.
- Menjawab pertanyaan edukasi kebencanaan.
- Mengarahkan anak ke panduan keselamatan dan aktivitas regulasi emosi yang telah dikurasi.
- Menyarankan anak berbicara dengan orang dewasa tepercaya ketika sesuai.
- Menyimpan riwayat percakapan sesuai kebijakan privasi dan retensi.

Arsitektur:
- Gunakan interface `AIProvider` agar provider dapat diganti.
- Prompt, batasan respons, dan versi kebijakan disimpan/dikelola di backend.
- Gunakan retrieval dari konten PERMATA yang telah disetujui jika fitur knowledge base diterapkan.
- Catat provider, model, latency, token usage, dan error tanpa menyimpan data sensitif yang tidak diperlukan.

Safety requirements:
- AI tidak boleh mendiagnosis trauma atau gangguan psikologis.
- AI tidak boleh mengklaim sebagai psikolog/tenaga profesional.
- AI tidak boleh memberikan konseling klinis tanpa pengawasan profesional.
- Jawaban terkait keselamatan harus mengutamakan materi resmi yang telah dikurasi.
- Pertanyaan yang menunjukkan bahaya langsung harus diarahkan ke orang dewasa tepercaya dan prosedur bantuan yang telah dikonfigurasi.
- Jangan mengirim nama lengkap, lokasi presisi, kontak keluarga, atau isi jurnal anak ke provider AI kecuali benar-benar diperlukan, memiliki dasar persetujuan, dan telah melalui penilaian privasi.
- Sediakan batas penggunaan, timeout, fallback, dan mekanisme pelaporan respons bermasalah.

---

## 5.6 Research-Informed Support — Pengembangan Lanjutan

Bagian riset dalam dokumen sumber bukan fitur aplikasi yang sudah didefinisikan secara rinci. Ide yang disebutkan dapat menjadi modul lanjutan dan tidak harus masuk MVP.

### RESEARCH-01 — Digital Training Module

- Mengelola modul pelatihan bagi guru/relawan.
- Mengelola materi dan versi pelatihan.
- Mencatat progres dan penyelesaian modul.
- Menyediakan evaluasi pemahaman.
- Mengelola status sertifikat/kelulusan jika kelak dibutuhkan.

### RESEARCH-02 — Stress Response Guidance

- Menyediakan panduan edukatif untuk mengenali respons stres anak.
- Mengatur konten sesuai role pendamping.
- Membatasi akses sesuai kewenangan.
- Tidak menghasilkan diagnosis otomatis.

### RESEARCH-03 — Referral Protocol

- Mengelola kriteria rujukan yang telah disetujui tenaga profesional.
- Membuat referral case.
- Menentukan tujuan rujukan dan penanggung jawab.
- Mencatat status tindak lanjut.
- Menjaga kerahasiaan informasi rujukan.

### RESEARCH-04 — Professional Supervision

- Menghubungkan guru/relawan dengan supervisor profesional.
- Mengelola jadwal atau permintaan supervisi.
- Menyimpan catatan supervisi dengan akses terbatas.
- Mencatat tindak lanjut dan status.

### RESEARCH-05 — Child Progress Monitoring

- Menyediakan catatan perkembangan berkala.
- Membatasi akses sesuai role dan hubungan pendampingan.
- Menghindari penilaian klinis otomatis.
- Memungkinkan supervisi profesional sesuai prosedur organisasi.

---

## 6. Rancangan Data dan Entitas Prisma

Bagian ini merupakan rancangan domain awal, bukan schema Prisma final. Nama model dapat disesuaikan selama relasi dan batasan akses tetap dipenuhi.

### 6.1 Identity and Access

| Model | Fungsi | Field penting |
|---|---|---|
| User | Akun pengguna | id, email/phone, passwordHash, status, createdAt |
| UserProfile | Profil umum | userId, fullName, preferredLanguage |
| Role | Definisi role | id, code, name |
| UserRole | Role pengguna | userId, roleId |
| Organization | Sekolah/lembaga | id, name, type, status |
| OrganizationMember | Keanggotaan | organizationId, userId, roleId, status |
| ChildProfile | Data anak | id, userId, birthDate/ageGroup, regionId |
| GuardianRelationship | Relasi wali | childId, guardianUserId, relationshipType, status, verifiedAt |
| ConsentRecord | Persetujuan | childId, guardianUserId, consentType, status, version, recordedAt |
| CareAssignment | Penugasan pendamping | childId, userId, organizationId, scope, status |

### 6.2 Geography and Content

| Model | Fungsi |
|---|---|
| Region | Data wilayah dan hierarki administratif |
| Language | Bahasa yang didukung |
| CulturalProfile | Konteks budaya per wilayah |
| DisasterType | Kategori bencana |
| ContentItem | Konten edukasi umum |
| ContentTranslation | Terjemahan konten |
| ContentRegion | Relasi konten dan wilayah |
| ContentVersion | Versi konten |
| MediaAsset | Metadata file/media |
| EmergencyGuide | Panduan keselamatan |
| EvacuationMap | Metadata peta evakuasi |
| EmergencyContact | Kontak darurat berdasarkan cakupan wilayah |

### 6.3 Prevention

| Model | Fungsi |
|---|---|
| SimulationScenario | Skenario simulasi |
| ScenarioVersion | Versi skenario |
| ScenarioStep | Tahapan skenario |
| ScenarioOption | Pilihan tindakan |
| SimulationAttempt | Percobaan anak |
| SimulationResponse | Jawaban pada setiap tahapan |
| Assessment | Definisi asesmen |
| AssessmentVersion | Versi instrumen |
| AssessmentQuestion | Pertanyaan |
| AssessmentOption | Opsi jawaban |
| AssessmentSubmission | Sesi pengisian |
| AssessmentResponse | Jawaban anak |
| RecommendationRule | Aturan rekomendasi |
| AssessmentRecommendation | Hasil rekomendasi |
| SafetyPassport | Data utama paspor keselamatan |
| SafetyPassportContact | Kontak keluarga/orang tepercaya |
| FamilyMember | Anggota keluarga |
| MeetingPoint | Titik kumpul |
| EmergencyNeed | Kebutuhan darurat |

### 6.4 Disaster Response

| Model | Fungsi |
|---|---|
| DisasterIncident | Peristiwa bencana |
| IncidentChildRecord | Keterlibatan anak dalam incident |
| ChildSafetyStatus | Riwayat status keselamatan |
| Shelter | Lokasi pengungsian |
| ChildLocationRecord | Lokasi anak dengan akses sangat terbatas |
| ReunificationRequest | Permintaan reunifikasi |
| IdentityVerification | Proses verifikasi |
| HandoverRecord | Serah terima anak |
| SupportRequest | Permintaan bantuan emosional |
| SupportAssignment | Penugasan pendamping |
| SupportMaterial | Materi PFA |
| OfflineContentPackage | Paket konten offline |
| SyncOperation | Catatan sinkronisasi |

### 6.5 Recovery

| Model | Fungsi |
|---|---|
| RecoveryJournalEntry | Entri Healing Journey |
| JournalMedia | Media pada entri jurnal |
| CreativeActivity | Aktivitas ekspresi |
| GrowthReflection | Refleksi Growth Garden |
| GrowthAspect | Lima aspek perkembangan |
| CareCircleMember | Anggota jaringan dukungan |
| CareCirclePermission | Izin akses pendamping |
| CareCircleInvitation | Undangan relasi |
| SupportNote | Catatan pendampingan terbatas |
| ReferralCase | Rujukan profesional |
| GriefActivity | Aktivitas Grief Journey |
| EmotionCheckIn | Catatan emosi |
| MemoryBoxEntry | Kenangan |
| LittleStep | Aktivitas langkah kecil |
| GriefSupportConnection | Koneksi dukungan |

### 6.6 Smart Technology and Operations

| Model | Fungsi |
|---|---|
| DashboardSnapshot | Cache/rekap agregasi bila diperlukan |
| Facility | Fasilitas pendukung komunitas |
| ProgramEvaluation | Evaluasi program |
| AIConversation | Metadata percakapan AI |
| AIMessage | Pesan percakapan dengan retensi terbatas |
| AIUsageLog | Penggunaan provider/model |
| TrainingModule | Modul pelatihan |
| TrainingProgress | Progres pelatihan |
| ReferralProtocol | Aturan rujukan |
| SupervisionSession | Supervisi profesional |
| AuditLog | Catatan aktivitas sensitif |
| RefreshToken/Session | Sesi autentikasi |

### 6.7 Standar Database

- Gunakan UUID sebagai primary key untuk entitas utama.
- Gunakan `createdAt` dan `updatedAt` pada entitas yang dapat berubah.
- Gunakan enum untuk status yang memiliki pilihan terbatas.
- Gunakan foreign key dan index untuk seluruh relasi/query penting.
- Tambahkan index pada `childId`, `organizationId`, `regionId`, `incidentId`, `status`, dan timestamp yang sering difilter.
- Gunakan transaksi Prisma untuk operasi multi-record yang harus konsisten.
- Gunakan soft delete hanya jika dibutuhkan untuk audit/retensi; jangan menjadikan soft delete sebagai alasan menyimpan data sensitif tanpa batas.
- Hindari menyimpan lokasi presisi pada profil anak. Simpan lokasi operasional hanya pada entitas SafeConnect dengan kontrol akses terpisah.
- Gunakan strategi enkripsi untuk field sensitif sesuai threat model. Kunci enkripsi tidak disimpan di database.
- Terapkan migration melalui Prisma Migrate; perubahan schema harus melalui review.

---

## 7. API Requirements

### 7.1 Konvensi API

Base path: `/api/v1`

Format:
- Request/response JSON.
- ISO 8601 UTC untuk timestamp.
- UUID untuk identifier.
- Pagination menggunakan `page` dan `limit` atau cursor untuk daftar besar.
- Filter dan sorting harus eksplisit dan tervalidasi.
- Gunakan HTTP status code yang sesuai.
- Error response konsisten.

Contoh error response:

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this resource",
    "requestId": "req_xxx"
  }
}
```

Contoh success response:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_xxx"
  }
}
```

Jangan mengembalikan stack trace, query SQL, token, atau detail internal pada production response.

### 7.2 Daftar Endpoint Inti

Endpoint di bawah adalah kontrak awal. Detail request/response, permission, dan validasi harus ditulis dalam OpenAPI sebelum implementasi final.

#### Authentication and Profile

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/auth/register` | Registrasi |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh token |
| POST | `/auth/logout` | Logout |
| POST | `/auth/forgot-password` | Memulai reset password |
| POST | `/auth/reset-password` | Reset password |
| GET | `/users/me` | Profil pengguna aktif |
| PATCH | `/users/me` | Memperbarui profil |

#### Child and Guardian

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/children` | Membuat profil anak |
| GET | `/children/:childId` | Detail anak sesuai izin |
| PATCH | `/children/:childId` | Memperbarui profil |
| POST | `/children/:childId/guardians` | Mengajukan relasi wali |
| PATCH | `/children/:childId/guardians/:relationshipId` | Memperbarui/verifikasi relasi |
| POST | `/children/:childId/consents` | Mencatat persetujuan |
| GET | `/children/:childId/consents` | Melihat status persetujuan |

#### Prevention

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/simulations` | Daftar simulasi |
| GET | `/simulations/:scenarioId` | Detail skenario |
| POST | `/simulations/:scenarioId/attempts` | Memulai simulasi |
| POST | `/simulation-attempts/:attemptId/responses` | Menyimpan jawaban |
| POST | `/simulation-attempts/:attemptId/complete` | Menyelesaikan simulasi |
| GET | `/children/:childId/simulation-history` | Riwayat simulasi |
| GET | `/assessments` | Daftar asesmen |
| GET | `/assessments/:assessmentId` | Detail asesmen |
| POST | `/assessments/:assessmentId/submissions` | Mengirim jawaban asesmen |
| GET | `/assessment-submissions/:submissionId/result` | Hasil dan rekomendasi |
| GET | `/children/:childId/safety-passport` | Mengambil Safety Passport |
| PUT | `/children/:childId/safety-passport` | Membuat/memperbarui Safety Passport |

#### During Disaster

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/disaster-incidents` | Daftar incident sesuai scope |
| POST | `/disaster-incidents` | Membuat incident |
| POST | `/disaster-incidents/:incidentId/children` | Mendaftarkan anak |
| PATCH | `/incident-children/:recordId/status` | Memperbarui status keselamatan |
| PATCH | `/incident-children/:recordId/location` | Memperbarui lokasi, khusus petugas |
| POST | `/incident-children/:recordId/reunification-requests` | Membuat permintaan reunifikasi |
| POST | `/reunification-requests/:requestId/verify` | Verifikasi identitas/relasi |
| POST | `/reunification-requests/:requestId/complete` | Mencatat serah terima |
| GET | `/support-materials` | Materi SOS/PFA |
| POST | `/support-requests` | Mengajukan bantuan |
| PATCH | `/support-requests/:requestId/assign` | Menugaskan pendamping |
| PATCH | `/support-requests/:requestId/status` | Memperbarui status bantuan |
| GET | `/offline/packages` | Daftar paket offline |
| GET | `/offline/packages/:packageId` | Metadata/manifest paket |
| POST | `/sync` | Sinkronisasi aktivitas offline |

#### Recovery

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/children/:childId/recovery-journal` | Daftar jurnal sesuai izin |
| POST | `/children/:childId/recovery-journal` | Membuat entri jurnal |
| PATCH | `/recovery-journal/:entryId` | Memperbarui entri |
| DELETE | `/recovery-journal/:entryId` | Menghapus entri |
| POST | `/media/upload-intents` | Memulai upload aman |
| POST | `/media/:mediaId/complete` | Menyelesaikan upload |
| GET | `/children/:childId/growth-reflections` | Daftar refleksi |
| POST | `/children/:childId/growth-reflections` | Membuat refleksi |
| GET | `/children/:childId/care-circle` | Daftar pendamping |
| POST | `/children/:childId/care-circle/invitations` | Mengundang pendamping |
| PATCH | `/care-circle/invitations/:invitationId` | Menerima/menolak undangan |
| PATCH | `/care-circle/members/:memberId/permissions` | Mengatur izin |
| GET | `/grief-journey/activities` | Daftar aktivitas |
| POST | `/children/:childId/emotion-check-ins` | Menyimpan emotion check-in |
| POST | `/children/:childId/memory-box` | Menyimpan kenangan |
| POST | `/children/:childId/little-steps` | Membuat langkah kecil |
| POST | `/children/:childId/referrals` | Mengajukan rujukan |

#### Smart Technology and Administration

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/content/recommended` | Konten berdasarkan profil wilayah/bahasa |
| GET | `/regions` | Daftar wilayah |
| GET | `/regions/:regionId/content` | Konten wilayah |
| GET | `/dashboard/community-resilience` | Agregasi dashboard |
| GET | `/dashboard/community-resilience/export` | Ekspor laporan sesuai izin |
| POST | `/ai/conversations` | Membuat percakapan |
| POST | `/ai/conversations/:conversationId/messages` | Mengirim pesan |
| GET | `/ai/conversations/:conversationId` | Mengambil percakapan sesuai izin |
| POST | `/ai/feedback` | Melaporkan respons AI |
| CRUD | `/admin/content/*` | Pengelolaan konten |
| CRUD | `/admin/simulations/*` | Pengelolaan simulasi |
| CRUD | `/admin/assessments/*` | Pengelolaan asesmen |
| GET | `/admin/audit-logs` | Audit log dengan akses khusus |

### 7.3 Validasi API

- Semua payload divalidasi di backend menggunakan schema Zod atau validator setara.
- Validasi mencakup tipe, panjang, format, enum, batas ukuran, dan relasi.
- Jangan mempercayai `userId`, `childId`, `organizationId`, atau role yang dikirim client tanpa pemeriksaan otorisasi.
- Gunakan allowlist field untuk update agar mass assignment tidak terjadi.
- Endpoint upload menggunakan signed URL atau mekanisme upload terkontrol.
- Endpoint sensitif wajib memiliki authorization policy khusus.

---

## 8. File and Media Management

File yang berpotensi dikelola:
- Gambar jurnal dan Memory Box.
- Rekaman suara.
- Audio SOS/PFA.
- Ilustrasi edukasi.
- Peta evakuasi.
- Materi pelatihan.

Kebutuhan:
1. File disimpan pada object storage, bukan sebagai binary langsung di PostgreSQL.
2. Database menyimpan metadata, owner, ukuran, MIME type, checksum, dan object key.
3. Upload menggunakan signed URL dengan masa berlaku terbatas atau proxy upload yang aman.
4. Validasi MIME type dan ukuran dilakukan sebelum file dipublikasikan.
5. File privat tidak boleh memiliki URL publik permanen.
6. Akses file dilakukan melalui signed URL berumur pendek setelah authorization check.
7. Terapkan antivirus/malware scanning bila provider dan infrastruktur mendukung.
8. Hapus file yatim melalui proses terjadwal setelah memastikan tidak direferensikan.
9. Retensi media mengikuti kebijakan privasi dan persetujuan.

---

## 9. Security, Privacy, and Child Safeguarding

### 9.1 Security Baseline

- HTTPS wajib untuk seluruh komunikasi.
- CORS hanya mengizinkan origin frontend yang ditetapkan.
- Helmet dan security headers.
- Rate limiting pada autentikasi, pencarian, AI, upload, dan endpoint sensitif.
- Validasi input dan output.
- SQL injection dicegah melalui Prisma query API dan larangan raw query yang tidak aman.
- Proteksi terhadap mass assignment dan insecure direct object reference (IDOR).
- Secret disimpan melalui secret manager/environment yang aman.
- Password di-hash menggunakan algoritma yang sesuai.
- Access token berumur pendek; refresh token dapat dicabut.
- Backup PostgreSQL dan prosedur restore diuji berkala.
- Dependency scanning dan patching berkala.
- Audit log untuk akses dan perubahan data sensitif.

### 9.2 Data Classification

| Kategori | Contoh | Perlakuan |
|---|---|---|
| Public | Konten edukasi yang telah dipublikasikan | Dapat diakses sesuai kebijakan publikasi |
| Internal | Metadata program dan organisasi | Terbatas untuk anggota yang berwenang |
| Personal | Profil dan kontak | Akses berdasarkan relasi dan permission |
| Sensitive Child Data | Jawaban asesmen, jurnal, emotion check-in | Akses sangat terbatas, retensi terdefinisi |
| Critical Operational Data | Lokasi anak, reunifikasi, incident record | Akses petugas berwenang, audit wajib |

### 9.3 Privacy Requirements

- Terapkan prinsip data minimization.
- Catat dasar persetujuan wali dan versi kebijakan yang disetujui.
- Sediakan mekanisme pencabutan persetujuan.
- Terapkan retensi dan penghapusan data yang dapat dikonfigurasi.
- Jangan memasukkan data pribadi anak ke log aplikasi.
- Jangan mengirim data sensitif ke AI provider tanpa kebutuhan, persetujuan, dan kontrol yang memadai.
- Gunakan agregasi dan suppression untuk dashboard.
- Siapkan prosedur insiden kebocoran data.
- Lakukan privacy/security review sebelum fitur SafeConnect dan AI diluncurkan.

Ketentuan hukum yang berlaku, termasuk perlindungan data pribadi dan perlindungan anak di wilayah operasional, harus ditinjau oleh pihak yang kompeten sebelum produksi. PRD ini bukan pengganti kajian hukum.

### 9.4 Audit Logging

Audit log minimal mencatat:
- Actor ID.
- Action.
- Resource type dan resource ID.
- Timestamp.
- Organization/scope.
- Request ID.
- Alasan akses jika diperlukan.
- Metadata perubahan yang aman.

Jangan menyimpan isi jurnal, password, token, atau payload sensitif lengkap dalam audit log.

---

## 10. Non-Functional Requirements

| Area | Persyaratan |
|---|---|
| Availability | Target awal 99,5% per bulan untuk API produksi, ditinjau berdasarkan kapasitas operasional |
| Performance | Target awal p95 di bawah 500 ms untuk endpoint CRUD umum, tidak termasuk AI, upload, dan laporan berat |
| Scalability | Modular monolith dapat ditingkatkan secara horizontal |
| Reliability | Transaksi database untuk operasi kritis dan retry terkontrol untuk integrasi |
| Security | Authentication, authorization, encryption in transit, secret management, audit |
| Privacy | Data minimization, consent, retention, access isolation |
| Maintainability | TypeScript strict mode, modular structure, linting, testing |
| Observability | Structured logs, metrics, tracing/request ID, error monitoring |
| Documentation | OpenAPI/Swagger dan dokumentasi setup |
| Compatibility | API versioning melalui `/api/v1` |
| Backup | Backup terjadwal dan restore drill |
| Localization | Konten dan respons API mendukung bahasa yang dikonfigurasi |

Angka target di atas adalah baseline usulan dan perlu disepakati berdasarkan kapasitas infrastruktur, anggaran, serta SLA organisasi.

---

## 11. Background Jobs and Event Processing

Beberapa aktivitas tidak harus dieksekusi dalam request HTTP:

- Pengiriman email/notifikasi.
- Pemrosesan media dan scanning.
- Pembuatan laporan dashboard.
- Rekalkulasi agregasi.
- Pembersihan file sementara.
- Sinkronisasi data tertentu.
- Penghapusan data sesuai jadwal retensi.
- Pemrosesan AI jika membutuhkan workflow asynchronous.

Gunakan queue jika beban dan kebutuhan retry sudah memerlukannya. Untuk tahap awal, pekerjaan sederhana dapat dijalankan melalui worker terpisah dengan mekanisme retry dan idempotency.

Operasi penting seperti perubahan status reunifikasi harus tetap memiliki transaksi database dan pencatatan audit yang konsisten.

---

## 12. Testing Requirements

### 12.1 Unit Tests

Menguji:
- Business rules simulasi.
- Perhitungan hasil asesmen dan rekomendasi.
- Permission CareCircle.
- Validasi status SafeConnect.
- Aturan agregasi dashboard.
- Aturan versi konten.
- AI safety policy wrapper.

### 12.2 Integration Tests

Menguji:
- Prisma dengan PostgreSQL test database.
- Authentication dan refresh token.
- Relasi wali dan persetujuan.
- CRUD seluruh modul.
- Upload dan akses file.
- Sinkronisasi offline.
- Transaksi perubahan status.
- Integrasi AI menggunakan mock provider.

### 12.3 Authorization Tests

Wajib menguji skenario:
- Anak tidak dapat membaca data anak lain.
- Wali tidak dapat membaca anak yang belum terverifikasi sebagai tanggungannya.
- Guru tidak dapat membaca jurnal privat tanpa izin.
- Relawan tidak dapat membaca lokasi anak tanpa penugasan.
- Petugas yang tidak berwenang tidak dapat mengakses SafeConnect.
- Program manager hanya dapat melihat agregasi dalam scope.
- Content admin tidak otomatis memperoleh akses ke data pribadi anak.

### 12.4 Security Tests

- IDOR dan privilege escalation.
- Brute force/rate limit.
- Token reuse dan token revocation.
- File upload dengan MIME type berbahaya.
- Input validation dan injection.
- Data leakage pada error/log.
- Akses file privat tanpa signed URL valid.

---

## 13. Acceptance Criteria

Backend dapat dianggap memenuhi kebutuhan rilis awal apabila:

1. Express API berjalan terpisah dari Next.js 16 dan terintegrasi dalam Turborepo.
2. Prisma terhubung ke PostgreSQL dan seluruh migration dapat dijalankan dari environment bersih.
3. Authentication, role, permission, dan relasi wali berjalan.
4. API simulasi dapat menyajikan skenario, menerima jawaban, dan menyimpan hasil.
5. API assessment dapat menyimpan jawaban serta menghasilkan rekomendasi edukatif non-diagnostik.
6. Safety Passport dapat dikelola dengan akses terbatas.
7. SafeConnect dapat mencatat incident, status keselamatan, verifikasi, dan reunifikasi dengan audit.
8. Materi SOS/PFA dapat disajikan dan permintaan bantuan dapat dikelola.
9. Paket konten offline dapat diambil beserta versi dan metadata sinkronisasi.
10. Healing Journey, Growth Garden, CareCircle, dan Grief Journey memiliki API dan pembatasan akses masing-masing.
11. Geo-Cultural Adaptation dapat menyajikan konten berdasarkan wilayah dan bahasa.
12. Community Resilience Dashboard hanya mengeluarkan data agregat yang memenuhi aturan privasi.
13. AI Companion menggunakan provider adapter dan memiliki guardrail sesuai batasan produk.
14. OpenAPI tersedia dan seluruh endpoint memiliki validasi serta error format konsisten.
15. Unit test, integration test, dan authorization test untuk alur kritis lulus.
16. Audit log aktif untuk akses dan perubahan data sensitif.
17. Backup dan prosedur restore telah diuji.

---

## 14. Prioritas Implementasi

Prioritas berikut adalah rekomendasi teknis. Dokumen sumber mendeskripsikan fitur, tetapi tidak menetapkan urutan MVP atau jadwal pengembangan.

### Phase 0 — Backend Foundation

- Setup `apps/api` di Turborepo.
- Setup Express + TypeScript.
- Setup Prisma + PostgreSQL.
- Environment configuration.
- Error handling dan logging.
- OpenAPI.
- Authentication dan authorization.
- User, organization, child profile, guardian relationship, consent.
- Audit log baseline.
- CI dan test setup.

**Output:** Backend foundation siap digunakan frontend.

### Phase 1 — Core Prevention

- Disaster Simulated Playground.
- Emotional Readiness Assessment.
- My Safety Passport.
- Content management untuk skenario, asesmen, dan panduan.
- File/media infrastructure dasar.

**Output:** Alur kesiapsiagaan anak dapat berjalan end-to-end.

### Phase 2 — Disaster Response

- Disaster incident.
- SafeConnect.
- Status keselamatan dan reunifikasi.
- SOS Emotional Support.
- Support request dan assignment.
- Offline package manifest dan sync API.

**Output:** Backend dapat mendukung alur saat bencana dengan kontrol akses ketat.

**Catatan:** SafeConnect memerlukan SOP operasional, verifikasi identitas, dan penanggung jawab lapangan sebelum digunakan pada situasi nyata.

### Phase 3 — Recovery

- Healing Journey.
- Growth Garden.
- CareCircle.
- Grief Journey.
- Referral dan support connection dasar.

**Output:** Aktivitas pemulihan dan dukungan sosial tersedia.

### Phase 4 — Smart Technology

- Geo-Cultural Adaptation.
- Community Resilience Dashboard.
- PERMATA AI Companion.

**Output:** Konten adaptif, data komunitas, dan asisten AI tersedia dengan guardrail.

### Phase 5 — Research-Informed Expansion

- Digital Training Module.
- Stress Response Guidance.
- Referral Protocol lanjutan.
- Professional Supervision.
- Child Progress Monitoring.

**Output:** Dukungan pendamping dan pengelola program diperluas.

---

## 15. Environment Configuration

Contoh variabel environment backend:

```env
NODE_ENV=development
PORT=4000
API_BASE_URL=http://localhost:4000
WEB_APP_URL=http://localhost:3000

DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/permata

ACCESS_TOKEN_SECRET=replace-with-secure-secret
REFRESH_TOKEN_SECRET=replace-with-secure-secret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d

OBJECT_STORAGE_ENDPOINT=
OBJECT_STORAGE_BUCKET=
OBJECT_STORAGE_ACCESS_KEY=
OBJECT_STORAGE_SECRET_KEY=

AI_PROVIDER=
AI_API_KEY=
AI_MODEL=

LOG_LEVEL=debug
```

Ketentuan:
- Jangan commit file `.env` berisi secret.
- Sediakan `.env.example` tanpa credential aktif.
- Validasi environment saat aplikasi startup.
- Gunakan secret berbeda untuk development, staging, dan production.
- Jika menggunakan cookie authentication, konfigurasi `HttpOnly`, `Secure`, `SameSite`, CSRF protection, dan domain cookie harus ditentukan sesuai deployment.

---

## 16. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Kebocoran lokasi anak | Risiko keselamatan fisik | Permission khusus, audit, signed access, tidak ada endpoint publik |
| Akses pendamping terlalu luas | Privasi anak terganggu | Permission granular dan relationship-based access |
| Asesmen dianggap diagnosis | Salah interpretasi kondisi anak | Bahasa non-klinis, review ahli, pembatasan hasil |
| AI memberi saran berbahaya | Risiko keselamatan/psikologis | Curated knowledge, guardrails, escalation guidance, monitoring |
| Koneksi internet terputus | Data/panduan tidak tersedia | Offline package dan sinkronisasi dengan versi |
| Konten wilayah tidak akurat | Edukasi tidak relevan | Kurasi dan approval konten lokal |
| Dashboard mengidentifikasi anak | Kebocoran data melalui agregasi | Minimum cohort threshold dan suppression |
| Media sensitif tersebar | Privasi terganggu | Private storage, signed URL, permission check |
| Scope terlalu besar | Implementasi terlambat | Modular monolith dan rilis bertahap |

---

## 17. Asumsi dan Keputusan yang Masih Dibutuhkan

Dokumen sumber belum menentukan beberapa hal berikut. Keputusan ini harus dibuat sebelum implementasi terkait dimulai.

1. **Model akun anak:** apakah anak memiliki akun sendiri, atau menggunakan akun yang dikelola wali/sekolah?
2. **Persetujuan wali:** bagaimana verifikasi wali dan persetujuan pemrosesan data dilakukan?
3. **Wilayah operasi:** apakah PERMATA digunakan secara nasional atau dimulai dari wilayah tertentu?
4. **SafeConnect:** siapa petugas yang berwenang, bagaimana identitas diverifikasi, dan SOP serah terima apa yang digunakan?
5. **Kontak darurat:** dari mana sumber nomor kontak resmi dan bagaimana pembaruannya?
6. **Peta evakuasi:** siapa yang menyediakan, memvalidasi, dan memperbarui peta?
7. **SOS support:** apakah ada petugas aktif, jam layanan, wilayah cakupan, dan jalur eskalasi?
8. **Tenaga profesional:** bagaimana verifikasi kualifikasi dan kewenangan psikolog/konselor dilakukan?
9. **AI provider:** provider/model apa yang digunakan, apakah data boleh diproses provider, dan bagaimana retensi percakapan?
10. **Object storage:** provider dan batas ukuran file apa yang digunakan?
11. **Notifikasi:** apakah sistem membutuhkan email, SMS, push notification, atau kanal lain?
12. **Dashboard:** definisi operasional setiap metrik dan minimum jumlah subjek untuk agregasi.
13. **Retensi data:** berapa lama data jurnal, asesmen, lokasi, dan percakapan AI disimpan?
14. **Skala penggunaan:** estimasi jumlah anak, organisasi, petugas, dan request bersamaan.
15. **Compliance:** kebijakan hukum, perlindungan anak, dan tata kelola data yang berlaku untuk organisasi pengelola.

Jangan menganggap seluruh keputusan di atas telah ditetapkan hanya karena struktur teknis dalam PRD sudah disediakan.

---

## 18. Definition of Done

Sebuah modul backend dinyatakan selesai apabila:
- Prisma model dan migration telah direview.
- Business rules berada di application/domain service, bukan tersebar di controller.
- Seluruh endpoint memiliki schema validation.
- Authentication dan authorization telah diuji.
- Error handling konsisten.
- Audit log diterapkan untuk aksi sensitif.
- Unit dan integration test tersedia.
- Dokumentasi OpenAPI diperbarui.
- Tidak ada secret atau data sensitif dalam repository/log.
- Frontend dapat mengintegrasikan endpoint melalui kontrak API yang disepakati.
- Acceptance criteria modul terpenuhi.

---

## 19. Ringkasan Keputusan Arsitektur

1. PERMATA menggunakan **modular monolith** berbasis Express.js + TypeScript sebagai backend service terpisah.
2. PostgreSQL menjadi relational database utama dan Prisma menjadi ORM serta migration tool.
3. Next.js 16 tetap menjadi frontend existing di dalam Turborepo.
4. Seluruh komunikasi frontend-backend menggunakan REST API berversi.
5. Otorisasi menggabungkan role, relasi pendampingan, organisasi, wilayah, dan penugasan.
6. Data anak dan lokasi SafeConnect mendapat perlindungan khusus.
7. Konten simulasi, asesmen, PFA, recovery, dan geo-cultural dikelola melalui backend.
8. Offline mode didukung melalui paket konten dan API sinkronisasi; penyimpanan offline tetap di frontend.
9. AI Companion menggunakan adapter provider dan batasan keselamatan yang eksplisit.
10. Dashboard hanya menampilkan data agregat yang telah memenuhi aturan privasi.

**Akhir dokumen.**