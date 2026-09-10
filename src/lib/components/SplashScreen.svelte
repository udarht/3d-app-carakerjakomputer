<script lang="ts">
  let { onStart }: { onStart: () => void } = $props();

  let isClosing = $state(false);
  let activeTab = $state<'cp-tp' | 'indikator' | 'materi'>('cp-tp');

  function handleStart() {
    isClosing = true;
    setTimeout(() => {
      onStart();
    }, 450);
  }
</script>

<div
  class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-all duration-500 font-['Plus_Jakarta_Sans',sans-serif]"
  class:opacity-0={isClosing}
  class:pointer-events-none={isClosing}
  class:scale-95={isClosing}
>
  <!-- Main Dialog Window -->
  <div
    class="w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden flex flex-col my-auto transition-all duration-300"
  >
    <!-- Top Education Header Bar -->
    <div class="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white px-6 py-5 relative overflow-hidden">
      <!-- Subtle background graphic elements -->
      <div class="absolute -right-10 -top-10 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute right-1/3 -bottom-10 w-40 h-40 bg-indigo-500/15 rounded-full blur-xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-wrap items-center justify-between gap-4">
        <!-- Education Brand Strip -->
        <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full shadow-inner">
          <img src="/images/Tutwuri_3.png" alt="Tut Wuri Handayani" class="h-7 w-auto object-contain" title="Tut Wuri Handayani" />
          <img src="/images/Logo_02.png" alt="Logo Pendidikan 2" class="h-7 w-auto object-contain" />
          <img src="/images/Logo_03.png" alt="Logo Pendidikan 3" class="h-7 w-auto object-contain" />
          <img src="/images/LogoSobatSMP2025.png" alt="Sobat SMP" class="h-7 w-auto max-w-[56px] object-contain" title="Sobat SMP 2025" />
        </div>

        <!-- Badges Kategori -->
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
            <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
            Media Pembelajaran Interaktif 3D
          </span>
          <span class="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/10">
            Lomba Edukasi Digital
          </span>
        </div>
      </div>

      <!-- Hero Title -->
      <div class="mt-4 relative z-10">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Cara Kerja Komponen Komputer
        </h1>
        <p class="mt-1 text-xs sm:text-sm text-sky-200/90 font-medium">
          Eksplorasi Visual 3D Real-time & Simulasi Alur Siklus Pemrosesan Data (IPOS)
        </p>
      </div>
    </div>

    <!-- Content Grid Area -->
    <div class="p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto max-h-[calc(85vh-160px)]">
      <!-- 1. Metadata Developer & School Grid -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <span class="text-base">📋</span>
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-500">Identitas Pengembang & Pembelajaran</h2>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <!-- Item 1: Mata Pelajaran -->
          <div class="bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 hover:border-sky-200 rounded-2xl p-3.5 transition-all flex items-start gap-3">
            <div class="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg shrink-0">
              💻
            </div>
            <div class="min-w-0">
              <span class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Mata Pelajaran</span>
              <span class="block text-sm font-bold text-slate-800">Informatika</span>
            </div>
          </div>

          <!-- Item 2: Sasaran Pengguna -->
          <div class="bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 hover:border-sky-200 rounded-2xl p-3.5 transition-all flex items-start gap-3">
            <div class="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg shrink-0">
              🎯
            </div>
            <div class="min-w-0">
              <span class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Sasaran Pengguna</span>
              <span class="block text-sm font-bold text-slate-800">Fase D / Kelas VIII SMP</span>
            </div>
          </div>

          <!-- Item 3: Nama Kreator -->
          <div class="bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 hover:border-sky-200 rounded-2xl p-3.5 transition-all flex items-start gap-3 sm:col-span-2 lg:col-span-1">
            <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
              👨‍🏫
            </div>
            <div class="min-w-0 flex-1">
              <span class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Nama Kreator</span>
              <span class="block text-sm font-bold text-slate-800 break-words whitespace-normal leading-snug">Rahmat Hidayat. T, S.Kom, Gr.</span>
            </div>
          </div>

          <!-- Item 4: Asal Sekolah -->
          <div class="bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 hover:border-sky-200 rounded-2xl p-3.5 transition-all flex items-start gap-3 sm:col-span-2">
            <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg shrink-0">
              🏫
            </div>
            <div class="min-w-0 flex-1">
              <span class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Asal Sekolah</span>
              <span class="block text-sm font-bold text-slate-800 break-words whitespace-normal leading-snug">SMP S El Maarif Boarding School</span>
            </div>
          </div>

          <!-- Item 5: NPSN -->
          <div class="bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 hover:border-sky-200 rounded-2xl p-3.5 transition-all flex items-start gap-3 sm:col-span-1">
            <div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg shrink-0">
              🔢
            </div>
            <div class="min-w-0">
              <span class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide">NPSN</span>
              <span class="block text-sm font-bold text-slate-800 font-mono">69979463</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Academic & Curriculum Panel (Clean, Structured, Interactive Tabs) -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-base">🎓</span>
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-500">Informasi Kurikulum & Pedagogik</h2>
          </div>
          
          <!-- Tab Navigation Controls -->
          <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs">
            <button
              type="button"
              class="touch-target min-h-[45px] px-3.5 py-2.5 rounded-lg font-semibold transition-all cursor-pointer {activeTab === 'cp-tp' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'}"
              onclick={() => (activeTab = 'cp-tp')}
            >
              CP & TP
            </button>
            <button
              type="button"
              class="touch-target min-h-[45px] px-3.5 py-2.5 rounded-lg font-semibold transition-all cursor-pointer {activeTab === 'indikator' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'}"
              onclick={() => (activeTab = 'indikator')}
            >
              Indikator TP
            </button>
            <button
              type="button"
              class="touch-target min-h-[45px] px-3.5 py-2.5 rounded-lg font-semibold transition-all cursor-pointer {activeTab === 'materi' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'}"
              onclick={() => (activeTab = 'materi')}
            >
              Materi Esensial
            </button>
          </div>
        </div>

        <!-- Tab Content Card -->
        <div class="bg-gradient-to-br from-slate-50 to-sky-50/40 border border-slate-200/90 rounded-2xl p-5 shadow-sm min-h-[140px] flex flex-col justify-center">
          {#if activeTab === 'cp-tp'}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Capaian Pembelajaran -->
              <div class="bg-white p-4 rounded-xl border border-slate-200/70 shadow-xs">
                <div class="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wide mb-1.5">
                  <span class="w-2 h-2 rounded-full bg-sky-500"></span>
                  Capaian Pembelajaran (CP)
                </div>
                <p class="text-sm font-medium text-slate-700 italic leading-relaxed">
                  "Mampu mendeskripsikan cara kerja komponen komputer."
                </p>
              </div>

              <!-- Tujuan Pembelajaran -->
              <div class="bg-white p-4 rounded-xl border border-slate-200/70 shadow-xs">
                <div class="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wide mb-1.5">
                  <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Tujuan Pembelajaran (TP)
                </div>
                <p class="text-sm font-medium text-slate-700 italic leading-relaxed">
                  "Melalui pengamatan bagan siklus dan simulasi sederhana, murid mampu mendeskripsikan alur cara kerja komponen komputer secara berurutan."
                </p>
              </div>
            </div>
          {:else if activeTab === 'indikator'}
            <div class="bg-white p-4 rounded-xl border border-slate-200/70 shadow-xs">
              <div class="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                Indikator Ketercapaian Tujuan Pembelajaran (IKTP)
              </div>
              <ul class="space-y-2.5">
                <li class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <span class="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0 mt-0.5">1</span>
                  <span>Mengidentifikasi komponen-komponen komputer berdasarkan bagan siklus.</span>
                </li>
                <li class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <span class="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0 mt-0.5">2</span>
                  <span>Menjelaskan hubungan antar komponen dalam alur kerja pemrosesan komputer.</span>
                </li>
                <li class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <span class="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0 mt-0.5">3</span>
                  <span>Mendeskripsikan alur cara kerja komponen komputer secara sistematis dan berurutan.</span>
                </li>
              </ul>
            </div>
          {:else if activeTab === 'materi'}
            <div class="bg-white p-4 rounded-xl border border-slate-200/70 shadow-xs">
              <div class="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wide mb-3">
                <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                Materi Esensial
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="p-3 bg-purple-50/50 rounded-lg border border-purple-100 flex items-start gap-2.5">
                  <span class="text-lg shrink-0">1️⃣</span>
                  <span class="text-xs sm:text-sm font-semibold text-slate-800">Komponen-komponen komputer (Input, Process, Storage, Output).</span>
                </div>
                <div class="p-3 bg-purple-50/50 rounded-lg border border-purple-100 flex items-start gap-2.5">
                  <span class="text-lg shrink-0">2️⃣</span>
                  <span class="text-xs sm:text-sm font-semibold text-slate-800">Bagan siklus dan alur cara kerja komponen komputer secara berurutan.</span>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Bottom Action Footer with Touch-Optimized Button -->
    <div class="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-xs text-slate-500 text-center sm:text-left">
        <span class="font-bold text-slate-700">Petunjuk:</span> Klik tombol untuk memasuki modul inspeksi 3D, simulasi alur siklus IPOS, atau permainan kuis.
      </div>

      <!-- Main Action Button ("Mulai Belajar") - Touch Target >= 48px -->
      <button
        type="button"
        onclick={handleStart}
        class="touch-target w-full sm:w-auto min-h-[48px] min-w-[220px] px-8 py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 active:from-sky-700 active:to-indigo-700 text-white font-bold text-base sm:text-lg rounded-2xl shadow-lg shadow-sky-600/25 hover:shadow-xl hover:shadow-sky-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
      >
        <span>Mulai Belajar</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 group-hover:translate-x-1 transition-transform"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M5 3l14 9-14 9V3z" />
        </svg>
      </button>
    </div>
  </div>
</div>
