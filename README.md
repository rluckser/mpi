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
- `bilangan-rasional.html` — materi lengkap Kelas 7 Semester 1:
  - **B.3** — mengidentifikasi, menyatakan, membandingkan, menentukan operasi
    hitung, menaksir, dan melakukan estimasi bilangan rasional serta
    menyelesaikan permasalahan kontekstual termasuk literasi finansial.
  - Catatan JP dibaca apa adanya: tabel ATP menulis B.3 = 22 JP (Bilangan
    Rasional dan Aritmetika Sosial), sedangkan distribusi materi menulis
    Bilangan Rasional = 16 JP dan Aritmetika Sosial = 12 JP.
- `assets/css/style.css`, `assets/js/main.js` (beranda dan Bilangan Bulat),
  dan `assets/js/rasional.js` (Bilangan Rasional) — tampilan dan logika.
- Kelas 8 Semester 1 (live sejak 2026-11-05):
  - `bilangan-berpangkat-akar.html` + `assets/js/berpangkat.js` — **B.5, B.6, B.7**
    (24 JP; tidak ada konflik JP: 10 + 8 + 6 = 24). GeoGebra terverifikasi:
    Laws of exponents (gajdzwde), Scientific notation (m9d5vyvx);
    Radical simplification (yzsffu5t) hanya ditautkan.
  - `pythagoras.html` + `assets/js/pythagoras.js` — **G.4** (20 JP).
    GeoGebra terverifikasi: Investigating Pythagorean Theorem (ybpfw2fq).
  - `plsv-ptlsv.html` + `assets/js/plsv.js` — **A.2, A.3** (10 + 10 JP).
    GeoGebra terverifikasi: Solve Simple Linear Equations in One Variable
    (faquv9aQ, disematkan) dan Representing Linear Inequalities on a Number
    Line (r3enbtkw, ditautkan).
  - Setiap halaman Kelas 8 Semester 1: kuis formatif 10 soal dengan kunci
    yang dihitung ulang 10/10 benar, 0 kesalahan; target ketuntasan
    [PERLU DIISI GURU]. Sematan GeoGebra berbahasa Inggris; rendering
    iframe di browser sungguhan dan tampilan di HP belum diuji.
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
