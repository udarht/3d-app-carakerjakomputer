export const quizItems = [
  {
    id: 'keyboard',
    name: 'Keyboard',
    correctCategory: 'Input',
    hint: 'Memasukkan karakter teks, angka, dan perintah instruksi ke sistem komputer.',
    icon: '⌨️',
    explanation: 'Keyboard adalah Input Device karena berfungsi memasukkan sinyal ketikan pengguna ke komputer.'
  },
  {
    id: 'mouse',
    name: 'Mouse',
    correctCategory: 'Input',
    hint: 'Mengarahkan kursor pointer untuk navigasi dan klik pada antarmuka grafis.',
    icon: '🖱️',
    explanation: 'Mouse adalah Input Device yang mengirimkan data koordinat gerak dan klik ke sistem.'
  },
  {
    id: 'cpu',
    name: 'CPU / Processor',
    correctCategory: 'Process',
    hint: 'Otak komputasi utama yang mengeksekusi instruksi dan mengolah data biner.',
    icon: '🔲',
    explanation: 'CPU adalah Process Device (otak utama) yang menjalankan siklus fetch, decode, dan execute.'
  },
  {
    id: 'ram',
    name: 'RAM',
    correctCategory: 'Process',
    hint: 'Memori kerja berkecepatan tinggi penyimpan data aktif sementara (volatile).',
    icon: '⚡',
    explanation: 'RAM termasuk dalam Process Device (Working Memory) tempat CPU menaruh data saat diproses.'
  },
  {
    id: 'ssd',
    name: 'SSD',
    correctCategory: 'Storage',
    hint: 'Media simpan permanen berbasis chip flash NAND super cepat tanpa piringan bergerak.',
    icon: '💾',
    explanation: 'SSD adalah Storage Device sekunder non-volatile untuk menyimpan OS, software, dan file.'
  },
  {
    id: 'harddisk',
    name: 'Harddisk',
    correctCategory: 'Storage',
    hint: 'Media simpan permanen kapasitas besar berbasis piringan magnetik yang berputar.',
    icon: '💽',
    explanation: 'Harddisk adalah Storage Device magnetik untuk menyimpan data digital jangka panjang.'
  },
  {
    id: 'monitor',
    name: 'Monitor',
    correctCategory: 'Output',
    hint: 'Menampilkan sinyal grafis visual, antarmuka teks, dan video kepada pengguna.',
    icon: '🖥️',
    explanation: 'Monitor adalah Output Device yang mengonversi sinyal video menjadi visual yang tampak pada layar.'
  },
  {
    id: 'speaker',
    name: 'Speaker',
    correctCategory: 'Output',
    hint: 'Mengubah sinyal elektrik audio menjadi getaran gelombang suara akustik.',
    icon: '🔊',
    explanation: 'Speaker adalah Output Device yang mengeluarkan bunyi/audio hasil pemrosesan komputer.'
  },
  {
    id: 'printer',
    name: 'Printer',
    correctCategory: 'Output',
    hint: 'Mencetak dokumen digital atau gambar dari komputer ke atas lembar kertas fisik.',
    icon: '🖨️',
    explanation: 'Printer adalah Output Device yang menghasilkan salinan cetak fisik (hardcopy) dari data komputer.'
  }
];

export const categoryDefinitions = [
  {
    id: 'Input',
    title: 'Input Device',
    subtitle: 'Perangkat Masukan',
    desc: 'Alat untuk memasukkan data atau perintah instruksi ke komputer.',
    icon: '📥',
    color: '#0284c7'
  },
  {
    id: 'Process',
    title: 'Process Device',
    subtitle: 'Perangkat Pemrosesan',
    desc: 'Komponen yang mengolah data, instruksi program, dan memori kerja.',
    icon: '⚙️',
    color: '#9333ea'
  },
  {
    id: 'Storage',
    title: 'Storage Device',
    subtitle: 'Perangkat Penyimpanan',
    desc: 'Media untuk menyimpan data, program, dan file secara permanen.',
    icon: '💾',
    color: '#eab308'
  },
  {
    id: 'Output',
    title: 'Output Device',
    subtitle: 'Perangkat Keluaran',
    desc: 'Alat untuk menampilkan atau mengeluarkan hasil pemrosesan komputer.',
    icon: '📤',
    color: '#16a34a'
  }
];
