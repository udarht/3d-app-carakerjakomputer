<script lang="ts">
  let {
    isOpen = false,
    onClose,
    onSelectModule
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSelectModule?: (route: string) => void;
  } = $props();

  const modules = [
    {
      id: 'eksplorasi',
      title: 'Modul 1: Eksplorasi 3D Hardware',
      subtitle: 'Inspeksi & Anatomi Komponen',
      desc: 'Menjelajahi bentuk fisik, detail pin, dan fungsi 9 komponen komputer dalam grafis 3D interaktif real-time 360 derajat.',
      href: '/',
      icon: '🔍',
      tag: 'Eksplorasi 3D',
      theme: 'from-sky-500 to-blue-600',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      hoverBorder: 'hover:border-sky-400',
      buttonGrad: 'from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500',
      specs: ['9 Model Hardware 3D', 'Bebas Orbit & Zoom', 'Detail Spek & Fungsi']
    },
    {
      id: 'simulasi',
      title: 'Modul 2: Simulasi Alur Kerja IPOS',
      subtitle: 'Siklus Input ➔ Process ➔ Output ➔ Storage',
      desc: 'Memperagakan siklus kerja komputer dari pemasukan data (Keyboard), olah data (CPU & RAM), hasil monitor, hingga simpan disk (SSD).',
      href: '/simulasi',
      icon: '🚀',
      tag: 'Simulasi Siklus',
      theme: 'from-indigo-500 to-purple-600',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      hoverBorder: 'hover:border-indigo-400',
      buttonGrad: 'from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500',
      specs: ['Animasi Jalur Bus Data', 'Alur Sinyal Biner', 'Tahapan Interaktif']
    },
    {
      id: 'kuis',
      title: 'Modul 3: Evaluasi & Kuis',
      subtitle: 'Game Edukasi Klasifikasi Perangkat',
      desc: 'Uji pemahaman mengelompokkan perangkat komputer ke kategori yang tepat dengan permainan kuis interaktif Drag & Drop beranimasi.',
      href: '/kuis',
      icon: '🧩',
      tag: 'Game Edukatif',
      theme: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      hoverBorder: 'hover:border-emerald-400',
      buttonGrad: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500',
      specs: ['Drag & Drop Interaktif', 'Feedback Benar/Salah', 'Skor & Pembahasan']
    }
  ];

  function handleCardClick(href: string) {
    if (onSelectModule) {
      onSelectModule(href);
    }
    onClose();
  }
</script>

{#if isOpen}
  <!-- Backdrop Overlay -->
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Hub Menu Utama Media Pembelajaran"
    tabindex="-1"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-all duration-300 font-['Plus_Jakarta_Sans',sans-serif]"
    onclick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}
  >
    <!-- Modal Card Container -->
    <div
      class="w-full max-w-5xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden flex flex-col my-auto transition-all duration-300"
    >
      <!-- Hub Header Banner -->
      <div class="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white p-6 sm:p-8 relative overflow-hidden border-b border-white/10">
        <div class="absolute -right-16 -top-16 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute left-1/3 -bottom-16 w-60 h-60 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <!-- Identity Strip -->
          <div class="flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full">
            <img src="/images/Tutwuri_3.png" alt="Tut Wuri Handayani" class="h-7 w-auto object-contain" />
            <img src="/images/Logo_02.png" alt="Logo Pendidikan 2" class="h-7 w-auto object-contain" />
            <img src="/images/Logo_03.png" alt="Logo Pendidikan 3" class="h-7 w-auto object-contain" />
            <img src="/images/LogoSobatSMP2025.png" alt="Sobat SMP" class="h-7 w-auto max-w-[56px] object-contain" />
            <span class="text-xs font-semibold text-sky-200 border-l border-white/20 pl-2 ml-0.5">Fase D SMP</span>
          </div>

          <!-- Close Button [✕] (Min 45x45 px) -->
          <button
            type="button"
            onclick={onClose}
            class="touch-target min-w-[45px] min-h-[45px] w-12 h-12 rounded-2xl bg-white/10 hover:bg-rose-500/80 active:bg-rose-600 text-white/80 hover:text-white flex items-center justify-center text-lg font-bold transition-all cursor-pointer border border-white/10"
            title="Tutup Menu Utama (Esc)"
            aria-label="Tutup Menu Utama"
          >
            ✕
          </button>
        </div>

        <div class="relative z-10 mt-5">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 mb-2">
            ⚡ Dashboard Menu Utama
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Pilih Modul Pembelajaran
          </h2>
          <p class="text-xs sm:text-sm text-sky-200/90 mt-1 max-w-2xl font-medium">
            Silakan pilih modul pembelajaran interaktif di bawah ini untuk memulai belajar secara sistematis dan menyenangkan.
          </p>
        </div>
      </div>

      <!-- Hub Content: 3 Feature Cards Grid -->
      <div class="p-5 sm:p-8 overflow-y-auto max-h-[65vh]">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          {#each modules as mod}
            <div
              class="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between {mod.hoverBorder} hover:-translate-y-1"
            >
              <!-- Card Top Icon & Badge -->
              <div>
                <div class="flex items-center justify-between gap-2 mb-4">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr {mod.theme} text-white flex items-center justify-center text-2xl shadow-md">
                    {mod.icon}
                  </div>
                  <span class="text-xs font-bold px-2.5 py-1 rounded-full border {mod.badgeColor}">
                    {mod.tag}
                  </span>
                </div>

                <!-- Title & Subtitle -->
                <h3 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {mod.title}
                </h3>
                <p class="text-xs font-semibold text-slate-500 mb-2.5">
                  {mod.subtitle}
                </p>

                <!-- Description -->
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {mod.desc}
                </p>

                <!-- Key Highlights Specs -->
                <div class="space-y-1.5 pt-3 border-t border-slate-100 mb-6">
                  {#each mod.specs as spec}
                    <div class="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                      <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      <span>{spec}</span>
                    </div>
                  {/each}
                </div>
              </div>

              <!-- Large Touch Action Button (>= 48px height) -->
              <a
                href={mod.href}
                onclick={() => handleCardClick(mod.href)}
                class="touch-target min-h-[48px] w-full px-5 py-3 rounded-2xl bg-gradient-to-r {mod.buttonGrad} text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all no-underline cursor-pointer group-hover:scale-[1.02] active:scale-[0.98]"
                aria-label="Mulai {mod.title}"
              >
                <span>Buka Modul</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          {/each}
        </div>
      </div>

      <!-- Hub Footer -->
      <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div class="flex items-center gap-2">
          <span>🏫</span>
          <span class="font-medium text-slate-700">SMP S El Maarif Boarding School • Informatika Fase D</span>
        </div>
        <div>
          <span>Kreator: <strong>Rahmat Hidayat. T, S.Kom, Gr.</strong></span>
        </div>
      </div>
    </div>
  </div>
{/if}
