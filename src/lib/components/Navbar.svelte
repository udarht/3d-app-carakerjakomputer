<script lang="ts">
  import { page } from '$app/state';

  let {
    onOpenGuide,
    onOpenHome
  }: {
    onOpenGuide?: () => void;
    onOpenHome?: () => void;
  } = $props();

  let pathname = $derived(page.url.pathname);
</script>

<!-- Persistent Global Top Navbar -->
<nav
  class="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 py-2.5 shadow-xs font-['Plus_Jakarta_Sans',sans-serif] select-none"
  aria-label="Navigasi Utama Media Pembelajaran"
>
  <div class="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
    <!-- ============================================== -->
    <!-- SISI KIRI: Tombol Konsisten Kembali ke Beranda & Logo -->
    <!-- ============================================== -->
    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
      <!-- Tombol Beranda / Menu Utama (Min 45 x 45 px) -->
      {#if onOpenHome}
        <button
          type="button"
          onclick={onOpenHome}
          class="touch-target min-h-[45px] min-w-[45px] px-3 sm:px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-sky-50 active:bg-sky-100 text-slate-700 hover:text-sky-700 border border-slate-200/80 hover:border-sky-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          title="Buka Hub Menu Utama / Beranda"
          aria-label="Kembali ke Beranda atau Menu Utama"
        >
          <span class="text-base sm:text-lg">🏠</span>
          <span class="hidden md:inline">Beranda</span>
        </button>
      {:else}
        <a
          href="/"
          class="touch-target min-h-[45px] min-w-[45px] px-3 sm:px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-sky-50 active:bg-sky-100 text-slate-700 hover:text-sky-700 border border-slate-200/80 hover:border-sky-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-2xs no-underline"
          title="Kembali ke Beranda"
          aria-label="Kembali ke Beranda"
        >
          <span class="text-base sm:text-lg">🏠</span>
          <span class="hidden md:inline">Beranda</span>
        </a>
      {/if}

      <!-- Logo Pendidikan Kemdikbud & Sobat SMP -->
      <div class="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-full px-2.5 py-1">
        <img src="/images/Tutwuri_3.png" alt="Tut Wuri Handayani" class="h-6 w-auto object-contain" title="Tut Wuri Handayani - Kemdikbudristek" />
        <img src="/images/Logo_02.png" alt="Logo Pendidikan 2" class="h-6 w-auto object-contain" />
        <img src="/images/Logo_03.png" alt="Logo Pendidikan 3" class="h-6 w-auto object-contain" />
        <img src="/images/LogoSobatSMP2025.png" alt="Sobat SMP" class="h-6 w-auto max-w-[50px] object-contain" title="Sobat SMP 2025" />
      </div>
    </div>

    <!-- ============================================== -->
    <!-- SISI TENGAH: Navigasi Cepat Antar Modul (Desktop) -->
    <!-- ============================================== -->
    <div class="hidden sm:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200 shadow-inner">
      <!-- Modul 1: Eksplorasi 3D -->
      <a
        href="/"
        class="touch-target min-h-[45px] min-w-[45px] flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all no-underline {pathname === '/'
          ? 'bg-white text-sky-700 shadow-xs border border-sky-100'
          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'}"
        aria-label="Navigasi ke Modul 1: Eksplorasi 3D Hardware"
        aria-current={pathname === '/' ? 'page' : undefined}
      >
        <span>🔍</span>
        <span>Eksplorasi 3D</span>
      </a>

      <!-- Modul 2: Simulasi IPOS -->
      <a
        href="/simulasi"
        class="touch-target min-h-[45px] min-w-[45px] flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all no-underline {pathname.startsWith('/simulasi')
          ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'}"
        aria-label="Navigasi ke Modul 2: Simulasi Alur Kerja IPOS"
        aria-current={pathname.startsWith('/simulasi') ? 'page' : undefined}
      >
        <span>🚀</span>
        <span>Simulasi IPOS</span>
      </a>

      <!-- Modul 3: Evaluasi & Kuis -->
      <a
        href="/kuis"
        class="touch-target min-h-[45px] min-w-[45px] flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all no-underline {pathname.startsWith('/kuis')
          ? 'bg-white text-emerald-700 shadow-xs border border-emerald-100'
          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'}"
        aria-label="Navigasi ke Modul 3: Evaluasi dan Kuis Game"
        aria-current={pathname.startsWith('/kuis') ? 'page' : undefined}
      >
        <span>🧩</span>
        <span>Kuis Game</span>
      </a>
    </div>

    <!-- ============================================== -->
    <!-- SISI KANAN: Tombol Panduan -->
    <!-- ============================================== -->
    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
      <!-- Tombol Panduan (Min 45 x 45 px) -->
      {#if onOpenGuide}
        <button
          type="button"
          onclick={onOpenGuide}
          class="touch-target min-h-[45px] min-w-[45px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 active:from-sky-700 active:to-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-sky-600/20 hover:shadow-lg hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer box-border"
          title="Buka Panduan Interaktif Penggunaan Media"
          aria-label="Buka Panduan Penggunaan Media"
        >
          <span class="text-sm sm:text-base">❓</span>
          <span>Panduan</span>
        </button>
      {/if}
    </div>
  </div>

  <!-- Mobile Secondary Tab Bar (di bawah navbar pada layar ponsel) -->
  <div class="flex sm:hidden items-center justify-around gap-1 mt-2 pt-2 border-t border-slate-200/70">
    <a
      href="/"
      class="touch-target min-h-[45px] min-w-[45px] flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all no-underline {pathname === '/'
        ? 'bg-sky-50 text-sky-700 border border-sky-200 font-extrabold'
        : 'text-slate-600 hover:text-slate-900'}"
      aria-label="Modul 1: Eksplorasi 3D"
    >
      <span>🔍</span>
      <span>3D Hardware</span>
    </a>
    <a
      href="/simulasi"
      class="touch-target min-h-[45px] min-w-[45px] flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all no-underline {pathname.startsWith('/simulasi')
        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-extrabold'
        : 'text-slate-600 hover:text-slate-900'}"
      aria-label="Modul 2: Simulasi IPOS"
    >
      <span>🚀</span>
      <span>Simulasi</span>
    </a>
    <a
      href="/kuis"
      class="touch-target min-h-[45px] min-w-[45px] flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all no-underline {pathname.startsWith('/kuis')
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold'
        : 'text-slate-600 hover:text-slate-900'}"
      aria-label="Modul 3: Kuis Game"
    >
      <span>🧩</span>
      <span>Kuis</span>
    </a>
  </div>
</nav>
