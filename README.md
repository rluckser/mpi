# MPI Matematika SMP — Prototipe Bilangan Bulat

Media Pembelajaran Interaktif (MPI) Matematika SMP Fase D, Kurikulum Merdeka,
pendekatan Pembelajaran Mendalam. Situs statis, siap untuk GitHub Pages.

## Isi prototipe ini

- `index.html` — beranda, Mode Siswa/Guru, dasbor skor dan riwayat, peta belajar Fase D (29 TP).
- `bilangan-bulat.html` — materi lengkap Kelas 7 Semester 1:
  - **B.1** — menjelaskan, menyatakan, membandingkan, mengurutkan, dan menentukan
    hasil operasi hitung bilangan bulat.
  - **B.2** — menyelesaikan permasalahan keseharian yang melibatkan konsep bilangan
    bulat, termasuk penguatan literasi finansial.
- `assets/css/style.css` dan `assets/js/main.js` — tampilan dan logika bersama.
- Materi lain (Kelas 7 Semester 2, Kelas 8, Kelas 9) sengaja ditandai
  **Segera Hadir** sampai dibuat dengan template yang sama.

## Fitur yang sudah jalan

- Simulasi garis bilangan interaktif (buatan sendiri, bisa dipakai tanpa internet
  setelah halaman dimuat).
- Sematan GeoGebra Number Line: https://mat.geogebra.org/m/CfJPUyfJ
  (kalau sematan gagal dimuat, buka tautan itu langsung).
- Latihan bebas acak dengan umpan balik langsung (tidak masuk riwayat).
- Kuis formatif 10 soal B.1–B.2 dengan umpan balik langsung, skor, dan riwayat.
- Refleksi siswa yang tersimpan di perangkat.
- Mode Guru: panduan ATP/TP, alokasi JP, miskonsepsi, diferensiasi, dan tombol cetak.
- Skor dan riwayat tersimpan di `localStorage` perangkat siswa.
  Siswa mengekspor riwayat sebagai JSON untuk dikirim ke guru, karena situs
  statis GitHub Pages tidak punya server dan tidak bisa memantau siswa
  secara real time.

## Menjalankan lokal

```bash
python3 -m http.server 8000
```

Lalu buka http://localhost:8000 — atau buka `index.html` langsung di browser.

## Menerbitkan ke GitHub Pages (repo rluckser/mpi)

1. Salin seluruh isi folder ini ke root repo `rluckser/mpi`, branch `main`.
2. Di GitHub: Settings → Pages → Build and deployment → Source: **Deploy from a branch**,
   Branch: `main`, Folder: `/ (root)`.
3. Simpan, tunggu beberapa menit, lalu buka alamat Pages repo tersebut.

Sumber ATP: MGMP Matematika SMP Kabupaten Lampung Tengah, Tahun Pelajaran
2026/2027, Fase D.
