# Rencana Implementasi: Platform Analitik Pitch Deck Berbasis AI Lokal (Versi Laravel + UI Neo-Brutalis)

## Konteks
Platform analitik proposal bisnis/pitch deck berbasis AI lokal ini dirancang untuk melakukan audit diagnostik terhadap presentasi bisnis (PDF/DOCX) secara asinkron. Menggunakan Laravel sebagai backend utama, Redis Queue + Horizon untuk antrean, dan UI/UX bertema **Neo-Brutalist/Swiss Editorial** (kontras tinggi, tipografi unik, bebas dari gradien AI ungu/biru standar).

## Pendekatan yang Direkomendasikan

### 1. Desain UI/UX & Identitas Visual
* **Palet Warna (Kontras Tinggi & Bebas Gradien AI)**:
  * Latar Belakang Utama: `#F4F0EA` (Sand / Warm Alabaster)
  * Teks & Border: `#111111` (Pure Charcoal)
  * Aksen Utama (Highlight): `#FF4F00` (Safety Orange / International Klein Orange)
  * Indikator Peringatan (Red Flags): `#E63946` (Solid Crimson)
  * Indikator Aman (Pass): `#2A9D8F` (Deep Teal)
* **Tipografi (Font Unik & Karakter Kuat)**:
  * Judul (Headings): *Syne* atau *Clash Display* (Excentric Geometric Sans-serif)
  * Konten / Data Metrik: *Space Mono* atau *JetBrains Mono* (Technical Monospace)
* **Gaya UI (Neo-Brutalist)**:
  * Batasan (Borders) menggunakan garis solid hitam tebal (`border-2 border-black`).
  * Bayangan (Shadows) bertipe solid/hard block (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`).
  * Tanpa gradien warna ungu/biru atau efek blur (glassmorphism) yang klise pada situs AI modern.

### 2. Tumpukan Teknologi (Tech Stack)
* **Frontend**: React.js (via Inertia.js + Vite), Tailwind CSS (untuk styling Neo-Brutalist), `react-pdf` (untuk render dokumen).
* **Backend**: Laravel 11.x (API, Auth, Controller).
* **Antrean**: Laravel Queue (Redis) + Laravel Horizon.
* **Konversi & Parsing**: LibreOffice headless (DOCX to PDF), vLLM (Qwen2.5-VL) lokal untuk ekstraksi halaman.
* **RAG & Scraper**: Firecrawl API (Competitor research), Qdrant (Penyimpanan vektor lokal).

### 3. Alur Kerja Sistem (Pipeline)
1. **Ingest**: Dokumen diunggah -> Laravel validasi -> Konversi ke PDF via LibreOffice jika diperlukan.
2. **Analysis**: Pekerja memotong PDF per halaman menjadi gambar -> Mengirim ke Qwen2.5-VL untuk ekstraksi JSON metrik & kompetitor.
3. **Enrichment (Firecrawl)**: Laravel memanggil Firecrawl API untuk melakukan scraping detail startup kompetitor yang terdeteksi.
4. **Embedding**: Hasil komparasi dimasukkan ke basis data Qdrant.
5. **Render & Sync**: UI menampilkan PDF di sebelah kiri (dengan tema minimalis/stark) dan hasil analisis ber-border tebal di sebelah kanan. Halaman PDF yang aktif secara otomatis mensinkronisasikan kartu detail analisis di panel kanan.

## Berkas Kritis yang Akan Dibuat/Modifikasi
* `tailwind.config.js` - Mengonfigurasi font *Syne* dan *Space Mono*, serta palet warna kustom.
* `resources/views/app.blade.php` - Impor Google Fonts (*Syne* & *Space Mono*).
* `resources/js/Pages/Analyzer.jsx` - Halaman analisis utama dengan tata letak split-screen Neo-Brutalis.
* `resources/js/Components/AnalysisCard.jsx` - Komponen kartu analisis ber-border tebal dan bayangan solid.
* `app/Jobs/AnalyzePitchDeckJob.php` - Job Laravel mengelola antrean pemrosesan dokumen.

## Rencana Pengujian & Verifikasi
1. **Verifikasi Desain**: Buka antarmuka UI, pastikan font terender dengan benar dan skema warna kontras tinggi (Sand, Charcoal, Safety Orange) konsisten tanpa gradien.
2. **Verifikasi Fungsionalitas Split-Screen**: Pastikan navigasi halaman PDF di panel kiri memperbarui konten kartu analisis di panel kanan secara instan.
3. **Verifikasi Responsifitas Grid**: Uji tata letak grid neo-brutalis pada berbagai ukuran layar untuk memastikan batas border dan shadow tetap presisi.
