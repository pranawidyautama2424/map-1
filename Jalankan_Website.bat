@echo off
title Menjalankan JelajahNusantara
echo ========================================================
echo   Memulai Server Lokal JelajahNusantara (Port 8080)...
echo ========================================================
echo.
echo Membuka website di browser default Anda...
start "" "http://localhost:8080"
echo.
echo Server sedang berjalan. Jangan tutup jendela ini selama menggunakan web.
echo Tekan Ctrl+C untuk menghentikan server.
echo.

where python >nul 2>nul
if %errorlevel% equ 0 (
    python -m http.server 8080
    goto end
)

where npx >nul 2>nul
if %errorlevel% equ 0 (
    npx serve -l 8080 .
    goto end
)

echo [INFO] Python atau Node.js tidak ditemukan, membuka file secara langsung...
start "" "index.html"

:end

