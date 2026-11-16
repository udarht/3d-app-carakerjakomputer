# 🖥️ Cara Kerja Komputer 3D — Media Pembelajaran Informatika Interaktif

Aplikasi web edukasi **3D interaktif** untuk mengenal perangkat keras komputer dan memahami siklus kerja komputer (**Input ➔ Process ➔ Output ➔ Storage**) secara visual, *real-time*, dan mudah dipahami.

Dibangun menggunakan **SvelteKit**, **Svelte 5**, **Threlte**, dan **Three.js** dengan material PBR (*Physically Based Rendering*) serta tekstur prosedural sehingga dapat berjalan **100% offline** tanpa bergantung pada aset model 3D eksternal.

---

## ✨ Fitur Utama

### 1. 🔍 Mode Eksplorasi 3D (`/`)
Jelajahi **10 perangkat keras komputer** dalam tampilan 3D interaktif dengan kontrol kamera bebas (*orbit, zoom, pan*), pencahayaan studio PBR, dan bayangan lembut:
- **Filter Kategori**: `Semua`, `Input`, `Process`, `Storage`, dan `Output`.
- **Interaksi Langsung pada Objek 3D**:
  - **Keyboard**: Tombol *chiclet* mekanikal dapat ditekan dan memberikan respons visual.
  - **Mouse**: Tombol klik kiri/kanan, *scroll wheel*, serta tombol pengubah profil warna DPI.
  - **CPU / Processor**: Klik untuk membuka pelindung logam (IHS) dan melihat *silicon die* internal.
  - **RAM (DDR5)**: Klik untuk melihat tampilan eksplodasi *heatspreader* dan chip DRAM BGA.
  - **GPU**: Tersedia sakelar varian **Integrated (iGPU)** dan **Dedicated (dGPU)** dengan kipas ganda berputar.
  - **SSD**: Tersedia sakelar varian **M.2 NVMe PCIe** dan **2.5" SATA III**, klik untuk membuka *heatsink*/casing.
  - **Harddisk (HDD)**: Piringan magnetik berputar dengan lengan aktuator yang bergerak (*seeking*) secara dinamis, klik untuk mengangkat penutup atas.
  - **Monitor**: Klik tombol daya untuk menyalakan/mematikan layar OS desktop interaktif.
  - **Speaker**: Animasi getaran *woofer* dan gelombang suara akustik, klik untuk *play/pause*.
  - **Printer**: Animasi *printhead* bergerak, pemindai *flatbed*, tangki tinta CMYK, dan kertas dokumen yang tercetak keluar.

### 2. 🚀 Mode Simulasi Alur IPOS (`/simulasi`)
Simulasi interaktif 5 tahap yang memvisualisasikan bagaimana data mengalir di atas meja kerja & *motherboard* ATX:
1. **Input (Keyboard)**: Ketik teks Anda sendiri dan kirim sinyal digital biner melalui kabel USB 3D ke CPU.
2. **Process — Logika & Memori (CPU & RAM)**: CPU memproses instruksi dan bertukar data melalui bus memori ke RAM.
3. **Process — Grafis (iGPU)**: Inti grafis terintegrasi pada CPU merender tampilan piksel visual.
4. **Output (Monitor)**: Sinyal video mengalir ke monitor 3D dan menampilkan teks input Anda secara langsung di layar.
5. **Storage (SSD)**: Simpan data secara permanen ke memori flash NAND non-volatile pada SSD.

### 3. 🧩 Kuis Game Drag & Drop (`/kuis`)
Uji pemahaman klasifikasi perangkat keras dengan mengelompokkan kartu perangkat ke dalam 4 kategori (**Input**, **Process**, **Storage**, **Output**):
- Dilengkapi petunjuk (*hint*) di setiap kartu perangkat.
- Penilaian otomatis lengkap dengan skor akhir, persentase, dan panel **Pembahasan & Ulasan Konsep Ilmiah** (dapat difilter untuk melihat semua perangkat atau hanya jawaban yang keliru).

---

## 📦 Daftar Perangkat Keras 3D

| Kategori | Perangkat | Fitur / Varian |
| :--- | :--- | :--- |
| **Input** | ⌨️ Keyboard | Layout lengkap, tombol tekan interaktif, USB-C & *underglow* |
| **Input** | 🖱️ Mouse | Klik kiri/kanan, *scroll wheel*, tombol DPI & sensor optik |
| **Process** | 🔲 CPU / Processor | IHS *brushed nickel*, pin LGA1700, kapasitor SMD, *cutaway die* |
| **Process** | ⚡ RAM (Memory) | DDR5 288-pin, chip DRAM BGA, *heatspreader* & RGB |
| **Process** | 🎮 GPU | Pilihan varian **Integrated (iGPU)** & **Dedicated (dGPU)** |
| **Storage** | 💾 SSD | Pilihan varian **M.2 NVMe PCIe** & **2.5" SATA III** |
| **Storage** | 💽 Harddisk | Platter berputar, *voice coil actuator*, label spesifikasi |
| **Output** | 🖥️ Monitor | Layar IPS interaktif, tombol daya, port I/O & dudukan VESA |
| **Output** | 🔊 Speaker | Kabinet kayu, *tweeter*, *woofer* Kevlar berdenyut & *bass port* |
| **Output** | 🖨️ Printer | *Printhead* bergerak, scanner *flatbed*, tangki tinta CMYK |

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: [SvelteKit](https://svelte.dev/docs/kit) (`@sveltejs/adapter-static`) + [Svelte 5](https://svelte.dev/)
- **3D Engine**: [Threlte 8](https://threlte.xyz/) (`@threlte/core`, `@threlte/extras`) & [Three.js](https://threejs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Bahasa**: TypeScript & JavaScript

---

## 🚀 Cara Menjalankan di Komputer Lokal

### Prasyarat
- **Node.js** versi 18 atau lebih baru (disarankan LTS)
- **npm** (bawaan Node.js)

### 1. Clone Repositori
```bash
git clone https://github.com/username-anda/3d-app-carakerjakomputer.git
cd 3d-app-carakerjakomputer
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan
```bash
npm run dev
```
Atau langsung buka di browser:
```bash
npm run dev -- --open
```

---

## 📜 Perintah Lainnya

| Perintah | Keterangan |
| :--- | :--- |
| `npm run build` | Membangun versi produksi statis ke folder `build/` |
| `npm run preview` | Menjalankan pratinjau hasil *build* produksi |
| `npm run check` | Menjalankan pemeriksaan tipe TypeScript & Svelte (`svelte-check`) |
| `npm run lint` | Memeriksa format kode dengan Prettier dan ESLint |
| `npm run format` | Merapikan format kode secara otomatis dengan Prettier |

---

## 🌐 Build & Deployment Statis

Proyek ini sudah dikonfigurasi menggunakan `@sveltejs/adapter-static` dengan `paths.relative: true` dan `fallback: '404.html'` pada `svelte.config.js`. Hasil `npm run build` pada folder `build/` siap langsung di-*deploy* ke **GitHub Pages**, **Vercel**, **Netlify**, atau layanan *static hosting* lainnya.

---

## 📁 Struktur Proyek

```text
src/
├── lib/
│   ├── components/
│   │   ├── hardware/        # 10 komponen model 3D perangkat keras
│   │   ├── CanvasContainer.svelte
│   │   ├── Scene.svelte     # Scene 3D Mode Eksplorasi & pencahayaan PBR
│   │   ├── SimulasiCanvas.svelte
│   │   ├── SimulasiScene.svelte # Scene 3D Mode Simulasi IPOS
│   │   ├── GuideModal.svelte
│   │   ├── MainMenu.svelte
│   │   └── SplashScreen.svelte
│   ├── data/
│   │   ├── hardware.js      # Data deskripsi perangkat keras
│   │   └── quiz.js          # Data soal & pembahasan kuis
│   └── utils/
│       └── textures.ts      # Generator tekstur prosedural CanvasTexture
└── routes/
    ├── +layout.svelte       # Layout utama & peringatan mode lanskap
    ├── +page.svelte         # Halaman Mode Eksplorasi 3D
    ├── simulasi/+page.svelte # Halaman Mode Simulasi IPOS
    └── kuis/+page.svelte    # Halaman Kuis Game Drag & Drop
```

---

## 📄 Lisensi

Proyek ini dibuat sebagai media pembelajaran informatika interaktif. Silakan gunakan, pelajari, dan kembangkan lebih lanjut sesuai kebutuhan pembelajaran Anda.
