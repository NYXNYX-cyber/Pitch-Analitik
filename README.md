# Pitch Deck Diagnostic Audit (PDA)

Platform diagnostik otomatis untuk menilai kesiapan investasi dokumen pitch deck startup menggunakan model AI vision multimodal dan database vektor.

## Fitur Utama
* **Konversi Dokumen Otomatis**: Mendukung unggahan berkas `.docx` dan konversi ke `.pdf` secara asinkron menggunakan LibreOffice headless.
* **Analisis Multimodal AI**: Menggunakan vLLM dengan model **Qwen2.5-VL** untuk memindai dokumen halaman demi halaman.
* **Scraping Real-Time**: Integrasi **Firecrawl API** untuk memperkaya data kompetitor yang terdeteksi di slide deck secara otomatis dari web.
* **Semantic RAG Match**: Menggunakan **Qdrant Vector DB** untuk melakukan pencocokan dan tolok ukur (*benchmarking*) kompetitor secara semantik.
* **UI/UX Neo-Brutalis**: Antarmuka kontras tinggi menggunakan font *Syne* & *Space Mono*, *split-screen editor*, visual penampil PDF tersinkronisasi, dan dashboard statistik audit.

---

## Prasyarat Sistem
* PHP >= 8.2
* Composer
* Node.js & NPM
* Redis Server (untuk Laravel Horizon queue)
* Docker (untuk Firecrawl local server)
* LibreOffice (untuk konversi berkas `.docx`)
* API Key Firecrawl, vLLM Server, dan Qdrant DB Instance.

---

## Langkah Instalasi & Pengujian

### 1. Kloning & Persiapan Environment
```bash
# Buat database SQLite kosong
touch database/database.sqlite

# Salin berkas environment
cp .env.example .env

# Jalankan migrasi basis data
php artisan migrate
```

### 2. Jalankan Firecrawl Lokal (Docker)
Aplikasi ini menggunakan Firecrawl lokal yang berjalan di Docker untuk web scraping:
```bash
cd firecrawl-local
docker compose up -d
```
Pastikan port `3002` (API) dan `6379` (Redis) terhubung dengan host lokal.

### 3. Isi Kredensial API (`.env`)
Buka berkas `.env` dan tambahkan variabel berikut:
```env
VLLM_URL=http://43.156.111.140:20128/v1
QDRANT_URL=https://f4c49278-c471-4dbf-b1e0-77e4003e647d.australia-southeast1-0.gcp.cloud.qdrant.io
QDRANT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwic3ViamVjdCI6ImFwaS1rZXk6NTIyMjI2ODMtZDM4ZS00YWY4LTlkMzEtNzUzYmRkYWRkNGMzIn0.q2p-LncNXrhr9ryyuJxTyAg-mZU3P9W7fdJyty8N74U
FIRECRAWL_URL=http://localhost:3002
QUEUE_CONNECTION=redis
```

### 4. Jalankan Aplikasi
Jalankan skrip otomatis untuk menyalakan Laravel, Vite, dan Horizon sekaligus:
```bash
./run-all.sh
```
Arahkan browser Anda ke `http://127.0.0.1:8000`.

---

## Peta Jalan (Roadmap Project)

### Fase 1: Dasar & Antrean (Selesai)
* [x] Inisialisasi Laravel 11 + Breeze Inertia React.
* [x] Integrasi antrean Horizon Redis.
* [x] Job konversi dokumen LibreOffice.

### Fase 2: Pipeline Analitik AI (Selesai)
* [x] Pemisahan slide PDF ke PNG.
* [x] Integrasi API vLLM (Qwen2.5-VL) & JSON parsing.
* [x] Web scraping kompetitor via Firecrawl API.
* [x] Integrasi semantic search Qdrant DB.

### Fase 3: Antarmuka Neo-Brutalis (Selesai)
* [x] Implementasi UI/UX Neo-Brutalis dengan Tailwind CSS.
* [x] Split-view penampil PDF menggunakan `react-pdf`.
* [x] Sinkronisasi data analisis halaman demi halaman.
* [x] Dashboard analitik riwayat audit kolektif & status progress real-time.

### Fase 4: Pengayaan & Produksi (Mendatang)
* [ ] Ekspor hasil audit diagnostik ke PDF ringkasan.
* [ ] Multi-tenant dan kolaborasi tim.

---

## Lisensi

Aplikasi ini dilisensikan di bawah **Apache License 2.0**. Silakan lihat berkas `LICENSE` untuk detail selengkapnya.
