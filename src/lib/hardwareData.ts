export interface HardwareItem {
  id: string;
  name: string;
  category: 'Input' | 'Output' | 'Processing & Memory' | 'Storage';
  icon: string;
  shortDesc: string;
  description: string;
  specs: { label: string; value: string }[];
  workingPrinciple: string;
}

export const HARDWARE_LIST: HardwareItem[] = [
  {
    id: 'monitor',
    name: 'Monitor',
    category: 'Output',
    icon: '🖥️',
    shortDesc: 'Perangkat penampil visual hasil pemrosesan data komputer.',
    description: 'Monitor adalah perangkat keras keluaran (output device) yang berfungsi menampilkan data grafis, teks, gambar, dan video kepada pengguna dalam antarmuka visual beresolusi tinggi.',
    specs: [
      { label: 'Resolusi Umum', value: '1920x1080 (FHD) s.d 4K' },
      { label: 'Refresh Rate', value: '60Hz - 240Hz+' },
      { label: 'Panel Type', value: 'IPS / OLED / VA' },
      { label: 'Koneksi', value: 'HDMI, DisplayPort, USB-C' }
    ],
    workingPrinciple: 'Menerima sinyal video digital dari GPU, lalu mengubahnya menjadi sinyal pencahayaan piksel RGB pada matriks layar panel kristal cair atau LED/OLED.'
  },
  {
    id: 'keyboard',
    name: 'Keyboard',
    category: 'Input',
    icon: '⌨️',
    shortDesc: 'Papan ketik mekanis/membran untuk memasukkan karakter & perintah.',
    description: 'Keyboard adalah perangkat input utama yang terdiri dari serangkaian tombol untuk menginput teks, angka, simbol, serta kombinasi tombol pintas (shortcuts) ke sistem operasi.',
    specs: [
      { label: 'Tipe Switch', value: 'Mechanical Switch / Membrane' },
      { label: 'Layout', value: 'ANSI 60% / 75% / TKL / Full 104' },
      { label: 'Polling Rate', value: '1000 Hz' },
      { label: 'Koneksi', value: 'USB / Wireless 2.4GHz / BT' }
    ],
    workingPrinciple: 'Ketika tombol ditekan, sirkuit matriks di bawahnya terhubung, mengirimkan kode scan biner (key code) ke mikrokontroler keyboard lalu diteruskan ke CPU sebagai interupsi input.'
  },
  {
    id: 'mouse',
    name: 'Mouse',
    category: 'Input',
    icon: '🖱️',
    shortDesc: 'Perangkat penunjuk (pointer) untuk navigasi antarmuka GUI.',
    description: 'Mouse komputer adalah perangkat penunjuk genggam yang mendeteksi gerakan dua dimensi relatif terhadap permukaan dan menggerakkan kursor di layar.',
    specs: [
      { label: 'Sensor', value: 'Optical Gaming Sensor' },
      { label: 'DPI / CPI', value: '800 - 26,000 DPI' },
      { label: 'Buttons', value: '6 Tombol Programmable' },
      { label: 'Desain', value: 'Ergonomis Ringan' }
    ],
    workingPrinciple: 'Lampu LED/Laser menyinari permukaan dan kamera mini optik berkecepatan tinggi menangkap ribuan gambar per detik untuk menghitung delta perpindahan koordinat (X, Y).'
  },
  {
    id: 'ram',
    name: 'RAM (Memory)',
    category: 'Processing & Memory',
    icon: '⚡',
    shortDesc: 'Memori kerja berkecepatan ultra tinggi bersifat volatile.',
    description: 'Random Access Memory (RAM) adalah media penyimpanan data sementara yang digunakan CPU untuk memuat instruksi dan data aplikasi yang sedang aktif berjalan dengan latensi sangat rendah.',
    specs: [
      { label: 'Standar', value: 'DDR5 / DDR4 SDRAM' },
      { label: 'Kecepatan', value: '3200 MT/s - 7200+ MT/s' },
      { label: 'Kapasitas Keping', value: '16GB / 32GB Dual Channel' },
      { label: 'Tegangan Operasi', value: '1.1V - 1.35V' }
    ],
    workingPrinciple: 'Menggunakan jutaan pasangan transistor dan kapasitor mikro untuk menyimpan bit 1 atau 0 sementara waktu. Memerlukan refresh daya terus-menerus agar muatan tidak hilang (volatile).'
  },
  {
    id: 'ssd',
    name: 'SSD (NVMe / SATA)',
    category: 'Storage',
    icon: '💾',
    shortDesc: 'Penyimpanan non-volatile berbasis chip flash NAND super cepat.',
    description: 'Solid State Drive (SSD) adalah media penyimpanan generasi modern tanpa komponen bergerak, menggunakan memori flash semikonduktor berkecepatan tinggi untuk booting OS dan loading file instan.',
    specs: [
      { label: 'Form Factor', value: 'M.2 NVMe 2280 / 2.5 SATA' },
      { label: 'Protokol', value: 'PCIe 4.0 / 5.0 x4 (NVMe)' },
      { label: 'Kecepatan Baca', value: 'Hingga 7000+ MB/s' },
      { label: 'Tipe Flash', value: '3D TLC NAND Flash' }
    ],
    workingPrinciple: 'Menyimpan muatan elektron pada sel gerbang isolasi (floating gate / charge trap transistor) tanpa bagian mekanik, sehingga data tetap tersimpan saat listrik mati (non-volatile).'
  },
  {
    id: 'harddisk',
    name: 'Harddisk (HDD)',
    category: 'Storage',
    icon: '💽',
    shortDesc: 'Penyimpanan kapasitas masif berbasis piringan magnetik berputar.',
    description: 'Hard Disk Drive (HDD) adalah perangkat penyimpanan data sekunder magnetik yang menggunakan piringan (platter) logam berputar cepat dan head pembaca/penulis mekanik.',
    specs: [
      { label: 'Kecepatan Putar', value: '5400 RPM / 7200 RPM' },
      { label: 'Interface', value: 'SATA III 6 Gbps' },
      { label: 'Kapasitas', value: '1TB - 22TB+' },
      { label: 'Cache Buffer', value: '64MB - 256MB' }
    ],
    workingPrinciple: 'Head elektromagnetik mengambang di atas piringan magnetik yang berputar cepat, mengubah polaritas medan magnet mikroskopis untuk menulis dan membaca deretan bit biner 0 dan 1.'
  },
  {
    id: 'speaker',
    name: 'Speaker',
    category: 'Output',
    icon: '🔊',
    shortDesc: 'Transduser pengubah sinyal listrik audio menjadi gelombang suara.',
    description: 'Speaker komputer adalah perangkat output audio yang mengubah sinyal gelombang suara elektrik dari sound card / DAC menjadi getaran akustik mekanis yang dapat didengar telinga manusia.',
    specs: [
      { label: 'Driver Suara', value: 'Subwoofer + Dual Tweeter' },
      { label: 'Daya Output', value: '20W - 60W RMS' },
      { label: 'Respon Frekuensi', value: '50Hz - 20kHz' },
      { label: 'Koneksi', value: '3.5mm Aux / USB / Bluetooth' }
    ],
    workingPrinciple: 'Sinyal arus listrik audio dialirkan ke voice coil (kumparan kawat) di dalam medan magnet permanen, menyebabkan membran/kerucut speaker bergetar maju-mundur dan menciptakan gelombang tekanan udara (suara).'
  },
  {
    id: 'printer',
    name: 'Printer',
    category: 'Output',
    icon: '🖨️',
    shortDesc: 'Perangkat pencetak dokumen digital ke media fisik kertas.',
    description: 'Printer adalah perangkat keras output yang bertugas mencetak teks, dokumen, gambar grafis, atau foto dari format digital di komputer ke atas kertas atau media fisik cetak lainnya.',
    specs: [
      { label: 'Teknologi Cetak', value: 'Color Ink Tank / Laser Mono' },
      { label: 'Resolusi Cetak', value: 'Up to 4800 x 1200 DPI' },
      { label: 'Kecepatan Cetak', value: '15 - 33 PPM (Lembar/Menit)' },
      { label: 'Fitur', value: 'Print, Scan, Copy & Wi-Fi' }
    ],
    workingPrinciple: 'Pada inkjet/ink-tank: nosel mikroskopis menyemprotkan tetesan mikro tinta dengan pemanasan termal atau piezoelektrik secara presisi ke atas kertas yang digerakkan oleh roller motor stepper.'
  }
];
