#!/bin/bash

# Fungsi untuk menghentikan semua proses latar belakang saat script dihentikan (Ctrl+C)
cleanup() {
    echo -e "\n\n[+] Menghentikan semua proses..."
    kill $SERVE_PID $DEV_PID $HORIZON_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "[+] Memulai Server Analitik Pitch Deck..."

# 1. Jalankan Laravel Server
php artisan serve --port=8000 &
SERVE_PID=$!
echo "[+] Laravel Serve berjalan di PID: $SERVE_PID (http://127.0.0.1:8000)"

# 2. Jalankan Vite Development Server
npm run dev &
DEV_PID=$!
echo "[+] Vite Dev Server berjalan di PID: $DEV_PID"

# 3. Jalankan Laravel Horizon (Antrean Queue)
php artisan horizon &
HORIZON_PID=$!
echo "[+] Laravel Horizon berjalan di PID: $HORIZON_PID"

echo "[+] Semua sistem berjalan. Tekan Ctrl+C untuk menghentikan."

# Tunggu semua proses selesai
wait
