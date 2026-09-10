<script lang="ts">
  import { onMount } from 'svelte';

  let {
    isOpen = false,
    onClose
  }: {
    isOpen: boolean;
    onClose: () => void;
  } = $props();

  let activeTab = $state<'3d' | 'ipos' | 'kuis'>('3d');
  let isClosing = $state(false);

  function handleClose() {
    isClosing = true;
    setTimeout(() => {
      isClosing = false;
      onClose();
    }, 200);
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (isOpen && e.key === 'Escape') {
      handleClose();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

{#if isOpen}
  <!-- Backdrop Overlay (Dark transparent with blur) -->
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Panduan Penggunaan Media Pembelajaran"
    tabindex="-1"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-opacity duration-200 font-['Plus_Jakarta_Sans',sans-serif]"
    class:opacity-0={isClosing}
    onclick={handleBackdropClick}
    onkeydown={(e) => { if (e.key === 'Escape') handleClose(); }}
  >
    <!-- Modal Card Container -->
    <div
      class="w-full max-w-3xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden flex flex-col my-auto transition-all duration-300 transform"
      class:scale-95={isClosing}
    >
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white px-5 sm:px-7 py-4.5 flex items-center justify-between gap-4 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-xl shadow-inner">
            📖
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase tracking-wider">
                Petunjuk Interaktif
              </span>
            </div>
            <h2 class="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
              Panduan Penggunaan Media
            </h2>
          </div>
        </div>

        <!-- Tombol Silang [✕] (Min 44x44 px) -->
        <button
          type="button"
          onclick={handleClose}
          class="min-w-[44px] min-h-[44px] w-11 h-11 rounded-2xl bg-white/10 hover:bg-rose-500/80 active:bg-rose-600 text-white/80 hover:text-white flex items-center justify-center text-lg font-bold transition-all cursor-pointer border border-white/10 shadow-sm"
          title="Tutup Panduan (Esc)"
          aria-label="Tutup Panduan"
        >
          ✕
        </button>
      </div>

      <!-- Tab Navigation Bar (3 Tabs) -->
      <div class="bg-slate-100/90 border-b border-slate-200 px-4 sm:px-7 pt-3 flex gap-2 overflow-x-auto">
        <!-- Tab 1 -->
        <button
          type="button"
          class="min-h-[44px] px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap {activeTab === '3d'
            ? 'bg-white text-sky-700 border-sky-600 shadow-xs'
            : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-white/50'}"
          onclick={() => (activeTab = '3d')}
        >
          <span>🌐</span>
          <span>1. Kontrol 3D Interaktif</span>
        </button>

        <!-- Tab 2 -->
        <button
          type="button"
          class="min-h-[44px] px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap {activeTab === 'ipos'
            ? 'bg-white text-indigo-700 border-indigo-600 shadow-xs'
            : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-white/50'}"
          onclick={() => (activeTab = 'ipos')}
        >
          <span>⚡</span>
          <span>2. Menjalankan Simulasi IPOS</span>
        </button>

        <!-- Tab 3 -->
        <button
          type="button"
          class="min-h-[44px] px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap {activeTab === 'kuis'
            ? 'bg-white text-emerald-700 border-emerald-600 shadow-xs'
            : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-white/50'}"
          onclick={() => (activeTab = 'kuis')}
        >
          <span>🧩</span>
          <span>3. Memainkan Kuis Drag & Drop</span>
        </button>
      </div>

      <!-- Tab Content Body Area -->
      <div class="p-5 sm:p-7 space-y-4 overflow-y-auto max-h-[60vh]">
        <!-- TAB 1: KONTROL OBJEK 3D -->
        {#if activeTab === '3d'}
          <div class="space-y-4">
            <div class="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 flex items-center gap-3">
              <span class="text-2xl">💡</span>
              <p class="text-xs sm:text-sm text-sky-900 font-medium">
                Setiap model perangkat keras dirender dalam <strong>grafis 3D WebGL nyata</strong>. Anda dapat mengamati komponen dari sudut manapun secara leluasa.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <!-- Card 1: Memutar / Orbit -->
              <div class="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
                <div>
                  <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl mb-3 font-bold">
                    🔄
                  </div>
                  <h3 class="font-bold text-sm text-slate-900 mb-2">Memutar / Orbit 360°</h3>
                  <div class="space-y-2 text-xs text-slate-600">
                    <div class="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <strong class="text-slate-800 block text-[11px] uppercase tracking-wide">🖥️ Desktop (Mouse)</strong>
                      Klik kiri mouse, tahan & geser ke arah yang diinginkan.
                    </div>
                    <div class="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <strong class="text-slate-800 block text-[11px] uppercase tracking-wide">📱 Touchscreen</strong>
                      Sentuh dan geser layar dengan 1 jari.
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card 2: Memperbesar / Zoom -->
              <div class="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
                <div>
                  <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl mb-3 font-bold">
                    🔍
                  </div>
                  <h3 class="font-bold text-sm text-slate-900 mb-2">Memperbesar / Zoom</h3>
                  <div class="space-y-2 text-xs text-slate-600">
                    <div class="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <strong class="text-slate-800 block text-[11px] uppercase tracking-wide">🖥️ Desktop (Mouse)</strong>
                      Putar roda gulir (scroll wheel) mouse maju / mundur.
                    </div>
                    <div class="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <strong class="text-slate-800 block text-[11px] uppercase tracking-wide">📱 Touchscreen</strong>
                      Cubit (pinch) layar dengan 2 jari mendekat atau menjauh.
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card 3: Melihat Detail Komponen -->
              <div class="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
                <div>
                  <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-3 font-bold">
                    📋
                  </div>
                  <h3 class="font-bold text-sm text-slate-900 mb-2">Melihat Detail Hardware</h3>
                  <div class="space-y-2 text-xs text-slate-600">
                    <div class="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <strong class="text-slate-800 block text-[11px] uppercase tracking-wide">👆 Interaksi Langsung</strong>
                      Klik langsung pada objek 3D atau pilih tombol navigasi perangkat di bilah bawah.
                    </div>
                    <div class="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <strong class="text-slate-800 block text-[11px] uppercase tracking-wide">📖 Panel Informasi</strong>
                      Kartu di kanan akan menampilkan deskripsi, kategori, spesifikasi, dan prinsip kerja.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <!-- TAB 2: MENJALANKAN SIMULASI ALUR KERJA IPOS -->
        {:else if activeTab === 'ipos'}
          <div class="space-y-3.5">
            <div class="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 flex items-center gap-3">
              <span class="text-2xl">⚡</span>
              <p class="text-xs sm:text-sm text-indigo-950 font-medium">
                Simulasi ini menggambarkan siklus pengolahan data komputer: <strong>Input ➔ Process ➔ Output ➔ Storage (IPOS)</strong> secara visual dan berurutan.
              </p>
            </div>

            <div class="space-y-2.5">
              <!-- Tahap 1 -->
              <div class="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-3.5">
                <div class="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <h4 class="font-bold text-sm text-slate-900 flex items-center gap-2">
                    Tahap Input (Pemasukan Data)
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">Keyboard</span>
                  </h4>
                  <p class="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Masukkan teks melalui formulir/keyboard virtual di layar, lalu klik tombol <strong>'Kirim Data'</strong> untuk mentransmisikan sinyal biner ke arah prosesor.
                  </p>
                </div>
              </div>

              <!-- Tahap 2 -->
              <div class="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-3.5">
                <div class="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <h4 class="font-bold text-sm text-slate-900 flex items-center gap-2">
                    Tahap Process (Pemrosesan Data)
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">CPU & RAM</span>
                  </h4>
                  <p class="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Amati denyut sinyal data yang diproses oleh <strong>CPU</strong> dan disimpan sementara dalam chip memori berkecepatan tinggi <strong>RAM</strong>.
                  </p>
                </div>
              </div>

              <!-- Tahap 3 -->
              <div class="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-3.5">
                <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <div>
                  <h4 class="font-bold text-sm text-slate-900 flex items-center gap-2">
                    Tahap Output (Pengeluaran Hasil)
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Monitor 3D</span>
                  </h4>
                  <p class="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Perhatikan hasil pemrosesan informasi yang langsung dikirimkan dan ditampilkan secara jelas pada panel layar <strong>Monitor 3D</strong>.
                  </p>
                </div>
              </div>

              <!-- Tahap 4 -->
              <div class="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-3.5">
                <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                  4
                </div>
                <div>
                  <h4 class="font-bold text-sm text-slate-900 flex items-center gap-2">
                    Tahap Storage (Penyimpanan Permanen)
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">SSD / Harddisk</span>
                  </h4>
                  <p class="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Klik tombol <strong>'Simpan ke Disk'</strong> untuk mengalirkan data dari RAM ke media penyimpanan sekunder (SSD/HDD) secara permanen dan aman.
                  </p>
                </div>
              </div>
            </div>
          </div>

        <!-- TAB 3: MEMAINKAN KUIS DRAG & DROP -->
        {:else if activeTab === 'kuis'}
          <div class="space-y-4">
            <div class="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
              <span class="text-2xl">🎯</span>
              <p class="text-xs sm:text-sm text-emerald-950 font-medium">
                Uji dan asah pemahaman Anda mengenai klasifikasi 4 kategori utama perangkat keras komputer melalui game interaktif drag & drop.
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Panduan Cara Menjawab -->
              <div class="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl font-bold">
                  🖐️
                </div>
                <h4 class="font-bold text-sm text-slate-900">Cara Menjawab (Drag & Drop)</h4>
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Sentuh/klik kartu nama perangkat di area <strong>Bank Soal</strong>, tahan dan geser (<em>drag</em>) ke dalam salah satu dari 4 kotak wadah kategori yang tepat:
                </p>
                <div class="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <span class="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 text-center">📥 Input</span>
                  <span class="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 text-center">⚙️ Process</span>
                  <span class="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 text-center">💾 Storage</span>
                  <span class="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-center">📤 Output</span>
                </div>
              </div>

              <!-- Panduan Evaluasi & Skor -->
              <div class="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold">
                  ✅
                </div>
                <h4 class="font-bold text-sm text-slate-900">Evaluasi Jawaban & Skor</h4>
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Setelah menempatkan kartu ke wadah, klik tombol <strong>'Periksa Jawaban'</strong> untuk memvalidasi:
                </p>
                <ul class="space-y-2 text-xs text-slate-600">
                  <li class="flex items-center gap-2">
                    <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span><strong>Hijau:</strong> Penempatan kategori sudah benar.</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">✕</span>
                    <span><strong>Merah:</strong> Penempatan salah (dilengkapi kunci jawaban & alasan).</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-sm">🏆</span>
                    <span>Skor akhir dan predikat evaluasi akan langsung ditampilkan.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Modal Footer -->
      <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span class="text-xs text-slate-500 text-center sm:text-left">
          💡 Tips: Anda dapat menekan tombol <kbd class="px-1.5 py-0.5 rounded-md bg-white border border-slate-300 font-mono text-[11px] text-slate-700 shadow-xs">Esc</kbd> atau klik di luar untuk menutup.
        </span>

        <!-- Tombol Penutup "Saya Mengerti, Lanjutkan" (Min height 44px) -->
        <button
          type="button"
          onclick={handleClose}
          class="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 active:from-sky-700 active:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-600/20 hover:shadow-lg hover:shadow-sky-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Saya Mengerti, Lanjutkan</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
{/if}
