<script lang="ts">
  import { onMount } from 'svelte';
  import CanvasContainer from '$lib/components/CanvasContainer.svelte';
  import SplashScreen from '$lib/components/SplashScreen.svelte';
  import { hardwareData } from '$lib/data/hardware.js';

  let isMounted = $state(false);
  let showSplash = $state(true);
  let selectedId = $state('keyboard');
  let selectedCategory = $state('Semua');
  let isInfoOpen = $state(true);
  let ssdVariant = $state<'m2' | 'sata'>('m2');

  const categories = ['Semua', 'Input', 'Process', 'Storage', 'Output'];

  // Filter hardware based on active category tab
  let filteredHardware = $derived(
    selectedCategory === 'Semua'
      ? hardwareData
      : hardwareData.filter((item) => item.category === selectedCategory)
  );

  // Active hardware details
  let selectedHardware = $derived(
    hardwareData.find((item) => item.id === selectedId) || hardwareData[0]
  );

  onMount(() => {
    isMounted = true;
  });

  function selectCategory(cat: string) {
    selectedCategory = cat;
    // Auto-select first item in filtered list if current selection is outside this category
    if (cat !== 'Semua') {
      const match = hardwareData.find((item) => item.category === cat);
      if (match && selectedHardware.category !== cat) {
        selectedId = match.id;
      }
    }
  }

  function selectHardware(id: string) {
    selectedId = id;
  }
</script>

<svelte:head>
  <title>3D Computer Hardware Viewer | Cara Kerja Komputer</title>
  <meta name="description" content="Visualisasi 3D Interaktif Kategori Perangkat Keras Komputer dengan Threlte & SvelteKit" />
</svelte:head>

<div class="viewer-container">
  <!-- 3D Canvas Background View -->
  <div class="canvas-area">
    {#if isMounted}
      <CanvasContainer {selectedId} {ssdVariant} onVariantChange={(v) => (ssdVariant = v)} />
    {:else}
      <div class="loading-state">
        <div class="spinner"></div>
        <span>Memuat 3D Hardware Engine...</span>
      </div>
    {/if}
  </div>

  <!-- Splash Screen / Opening Page -->
  {#if showSplash}
    <SplashScreen onStart={() => (showSplash = false)} />
  {/if}

  <!-- Header Branding -->
  <header class="top-header">
    <div class="brand">
      <!-- Logo Pendidikan Kemdikbud / Sobat SMP Strip -->
      <div class="edu-logos">
        <img src="/images/Tutwuri_3.png" alt="Tut Wuri Handayani" class="edu-logo-img" title="Tut Wuri Handayani - Kemdikbudristek" />
        <img src="/images/Logo_02.png" alt="Logo Pendidikan 2" class="edu-logo-img" />
        <img src="/images/Logo_03.png" alt="Logo Pendidikan 3" class="edu-logo-img" />
        <img src="/images/LogoSobatSMP2025.png" alt="Sobat SMP 2025" class="edu-logo-img logo-sobat" title="Sobat SMP 2025" />
      </div>
      <div class="brand-divider"></div>
      <div class="brand-text">
        <h1 class="brand-title">CARA KERJA KOMPUTER</h1>
        <p class="brand-subtitle">Interactive 3D Hardware Exploration</p>
      </div>
    </div>

    <!-- Header Right Controls: Mode Toggle, Info & Hint -->
    <div class="header-right-group">
      <!-- Tombol Buka Kembali Splash / Info Kurikulum -->
      <button
        type="button"
        class="info-panduan-btn"
        onclick={() => (showSplash = true)}
        title="Buka Info Media & Kurikulum Pembelajaran"
      >
        <span>📖</span>
        <span class="hidden sm:inline">Info Media</span>
      </button>

      <div class="mode-toggle-group">
        <a href="/" class="mode-link active">
          <span class="mode-icon">🔍</span>
          <span>Mode Eksplorasi</span>
        </a>
        <a href="/simulasi" class="mode-link">
          <span class="mode-icon">🚀</span>
          <span>Mode Simulasi</span>
        </a>
        <a href="/kuis" class="mode-link">
          <span class="mode-icon">🧩</span>
          <span>Kuis Game</span>
        </a>
      </div>

      <!-- Orbit Controls Hint -->
      <div class="interaction-hint">
        <span class="hint-icon">🔄</span>
        <span>Klik & Geser untuk memutar • Scroll untuk zoom</span>
      </div>
    </div>
  </header>

  <!-- Category Filter Tabs & Hardware Navigation -->
  <div class="bottom-dock">
    <!-- Category Tabs Filter -->
    <div class="category-tabs">
      {#each categories as cat}
        <button
          type="button"
          class="cat-tab"
          class:active={selectedCategory === cat}
          class:cat-input={cat === 'Input'}
          class:cat-process={cat === 'Process'}
          class:cat-storage={cat === 'Storage'}
          class:cat-output={cat === 'Output'}
          onclick={() => selectCategory(cat)}
        >
          {#if cat === 'Input'}
            <span class="cat-dot dot-input"></span>
          {:else if cat === 'Process'}
            <span class="cat-dot dot-process"></span>
          {:else if cat === 'Storage'}
            <span class="cat-dot dot-storage"></span>
          {:else if cat === 'Output'}
            <span class="cat-dot dot-output"></span>
          {/if}
          <span>{cat}</span>
        </button>
      {/each}
    </div>

    <!-- Hardware Items Navigation Menu -->
    <nav class="hardware-nav">
      <div class="nav-scroll-container">
        {#each filteredHardware as item}
          <button
            type="button"
            class="nav-btn"
            class:active={selectedId === item.id}
            class:cat-border-input={item.category === 'Input' && selectedId === item.id}
            class:cat-border-process={item.category === 'Process' && selectedId === item.id}
            class:cat-border-storage={item.category === 'Storage' && selectedId === item.id}
            class:cat-border-output={item.category === 'Output' && selectedId === item.id}
            onclick={() => selectHardware(item.id)}
          >
            <span class="nav-icon">{item.icon}</span>
            <div class="nav-label-box">
              <span class="nav-name">{item.name}</span>
              <span
                class="nav-cat-pill"
                class:pill-input={item.category === 'Input'}
                class:pill-process={item.category === 'Process'}
                class:pill-storage={item.category === 'Storage'}
                class:pill-output={item.category === 'Output'}
              >
                {item.category}
              </span>
            </div>
            {#if selectedId === item.id}
              <span
                class="active-indicator"
                class:indicator-input={item.category === 'Input'}
                class:indicator-process={item.category === 'Process'}
                class:indicator-storage={item.category === 'Storage'}
                class:indicator-output={item.category === 'Output'}
              ></span>
            {/if}
          </button>
        {/each}
      </div>
    </nav>
  </div>

  <!-- Floating Information Card (Corner Overlay) -->
  <aside class="info-card-container" class:collapsed={!isInfoOpen}>
    <div class="info-card">
      <!-- Card Header -->
      <div class="card-header">
        <div class="header-left">
          <span
            class="category-badge"
            class:badge-input={selectedHardware.category === 'Input'}
            class:badge-process={selectedHardware.category === 'Process'}
            class:badge-storage={selectedHardware.category === 'Storage'}
            class:badge-output={selectedHardware.category === 'Output'}
          >
            {selectedHardware.category} Device
          </span>
          <h2 class="hardware-title">
            <span class="title-icon">{selectedHardware.icon}</span>
            {selectedHardware.name}
          </h2>
        </div>
        <button
          type="button"
          class="toggle-btn"
          onclick={() => (isInfoOpen = !isInfoOpen)}
          title={isInfoOpen ? 'Sembunyikan Informasi' : 'Tampilkan Informasi'}
        >
          {isInfoOpen ? '−' : '+'}
        </button>
      </div>

      {#if isInfoOpen}
        <div class="card-body">
          <div class="section-block">
            <h3 class="section-title">📖 Deskripsi & Fungsi</h3>
            <p class="section-text desc-box">{selectedHardware.desc}</p>
          </div>

          {#if selectedId === 'ssd'}
            <div class="section-block ssd-model-select">
              <h3 class="section-title">🔧 Tipe / Model SSD</h3>
              <div class="ssd-type-tabs">
                <button
                  type="button"
                  class="ssd-type-btn"
                  class:active={ssdVariant === 'm2'}
                  onclick={() => (ssdVariant = 'm2')}
                >
                  ⚡ M.2 NVMe PCIe
                </button>
                <button
                  type="button"
                  class="ssd-type-btn"
                  class:active={ssdVariant === 'sata'}
                  onclick={() => (ssdVariant = 'sata')}
                >
                  📦 2.5" SATA III
                </button>
              </div>
              <span class="ssd-type-note">
                {ssdVariant === 'm2'
                  ? 'Model chip PCIe Gen4/5 kecepatan transfer tinggi (3000-7000+ MB/s)'
                  : 'Model form-factor 2.5 inci SATA kecepatan standar (550 MB/s)'}
              </span>
            </div>
          {/if}

          <div class="category-meta-block">
            <div class="meta-row">
              <span class="meta-label">Kategori:</span>
              <span
                class="meta-value"
                class:val-input={selectedHardware.category === 'Input'}
                class:val-process={selectedHardware.category === 'Process'}
                class:val-storage={selectedHardware.category === 'Storage'}
                class:val-output={selectedHardware.category === 'Output'}
              >
                {selectedHardware.category === 'Input' ? '📥 Perangkat Input (Masukan)' :
                 selectedHardware.category === 'Process' ? '⚙️ Perangkat Process (Pemrosesan)' :
                 selectedHardware.category === 'Storage' ? '💾 Perangkat Storage (Penyimpanan)' :
                 '📤 Perangkat Output (Keluaran)'}
              </span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Status 3D:</span>
              <span class="meta-value-live">● Interaktif Real-time</span>
            </div>
          </div>

          <!-- Educational Attribution Badge -->
          <div class="edu-attribution-card">
            <div class="edu-attr-logos">
              <img src="/images/Tutwuri_3.png" alt="Tut Wuri Handayani" class="edu-attr-img" />
              <img src="/images/Logo_02.png" alt="Logo Pendidikan" class="edu-attr-img" />
              <img src="/images/Logo_03.png" alt="Logo Pendidikan" class="edu-attr-img" />
              <img src="/images/LogoSobatSMP2025.png" alt="Sobat SMP" class="edu-attr-img logo-sobat" />
            </div>
            <span class="edu-attr-text">Media Pembelajaran Informatika Interaktif</span>
          </div>
        </div>
      {/if}
    </div>
  </aside>
</div>


<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
      Cantarell, sans-serif;
    background-color: #f1f5f9;
    color: #0f172a;
  }

  .viewer-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    user-select: none;
  }

  .canvas-area {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .loading-state {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    background: #f1f5f9;
    color: #0284c7;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(2, 132, 199, 0.2);
    border-top-color: #0284c7;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* TOP HEADER */
  .top-header {
    position: absolute;
    top: 20px;
    left: 24px;
    right: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;
    z-index: 10;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(226, 232, 240, 0.9);
    padding: 6px 16px 6px 10px;
    border-radius: 9999px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
    pointer-events: auto;
  }

  .edu-logos {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(241, 245, 249, 0.7);
    padding: 3px 8px;
    border-radius: 9999px;
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .edu-logo-img {
    height: 28px;
    width: auto;
    max-width: 42px;
    object-fit: contain;
    transition: transform 0.2s ease;
  }

  .edu-logo-img:hover {
    transform: scale(1.1);
  }

  .logo-sobat {
    max-width: 58px;
  }

  .brand-divider {
    width: 1px;
    height: 24px;
    background-color: #cbd5e1;
  }

  .brand-title {
    margin: 0;
    font-size: 1.02rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: #0f172a;
  }

  .brand-subtitle {
    margin: 0;
    font-size: 0.7rem;
    color: #64748b;
  }

  /* Educational Attribution Badge in Info Drawer */
  .edu-attribution-card {
    margin-top: 14px;
    padding: 10px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .edu-attr-logos {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .edu-attr-img {
    height: 22px;
    width: auto;
    max-width: 36px;
    object-fit: contain;
  }

  .edu-attr-text {
    font-size: 0.65rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: center;
  }

  .header-right-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .info-panduan-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(226, 232, 240, 0.9);
    padding: 7px 14px;
    border-radius: 9999px;
    font-size: 0.82rem;
    font-weight: 700;
    color: #0284c7;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    pointer-events: auto;
  }

  .info-panduan-btn:hover {
    background: #0284c7;
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(2, 132, 199, 0.25);
  }

  .mode-toggle-group {
    display: flex;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(226, 232, 240, 0.9);
    padding: 4px;
    border-radius: 9999px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    pointer-events: auto;
  }

  .mode-link {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 9999px;
    text-decoration: none;
    font-size: 0.82rem;
    font-weight: 600;
    color: #64748b;
    transition: all 0.2s;
  }

  .mode-link:hover:not(.active) {
    color: #0f172a;
    background: #f1f5f9;
  }

  .mode-link.active {
    background: #0f172a;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);
  }

  .interaction-hint {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(226, 232, 240, 0.8);
    padding: 8px 16px;
    border-radius: 9999px;
    font-size: 0.82rem;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    pointer-events: auto;
  }

  .hint-icon {
    font-size: 1rem;
    animation: rotate 6s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* BOTTOM DOCK & CATEGORY TABS */
  .bottom-dock {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    z-index: 10;
    max-width: 95vw;
  }

  .category-tabs {
    display: flex;
    gap: 6px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(226, 232, 240, 0.9);
    padding: 5px 8px;
    border-radius: 9999px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
  }

  .cat-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: 1px solid transparent;
    padding: 6px 14px;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cat-tab:hover:not(.active) {
    background: #f1f5f9;
    color: #0f172a;
  }

  .cat-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .dot-input { background-color: #0284c7; }
  .dot-process { background-color: #9333ea; }
  .dot-storage { background-color: #eab308; }
  .dot-output { background-color: #16a34a; }

  .cat-tab.active {
    background: #0f172a;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);
  }

  .cat-tab.active.cat-input {
    background: linear-gradient(135deg, #0284c7, #2563eb);
    box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
  }
  .cat-tab.active.cat-process {
    background: linear-gradient(135deg, #9333ea, #7c3aed);
    box-shadow: 0 4px 14px rgba(147, 51, 234, 0.35);
  }
  .cat-tab.active.cat-storage {
    background: linear-gradient(135deg, #d97706, #ca8a04);
    box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);
  }
  .cat-tab.active.cat-output {
    background: linear-gradient(135deg, #16a34a, #059669);
    box-shadow: 0 4px 14px rgba(22, 163, 74, 0.35);
  }

  /* HARDWARE NAVIGATION */
  .hardware-nav {
    max-width: 100%;
  }

  .nav-scroll-container {
    display: flex;
    gap: 10px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(226, 232, 240, 0.9);
    border-radius: 20px;
    box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
  }

  .nav-btn {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 15px;
    background: rgba(241, 245, 249, 0.85);
    border: 1px solid rgba(203, 213, 225, 0.6);
    border-radius: 14px;
    color: #475569;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
  }

  .nav-btn:hover {
    background: #ffffff;
    color: #0f172a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  .nav-btn.active {
    background: #ffffff;
    color: #0f172a;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }

  .nav-btn.cat-border-input { border-color: #0284c7; box-shadow: 0 4px 16px rgba(2, 132, 199, 0.25); }
  .nav-btn.cat-border-process { border-color: #9333ea; box-shadow: 0 4px 16px rgba(147, 51, 234, 0.25); }
  .nav-btn.cat-border-storage { border-color: #eab308; box-shadow: 0 4px 16px rgba(234, 179, 8, 0.25); }
  .nav-btn.cat-border-output { border-color: #16a34a; box-shadow: 0 4px 16px rgba(22, 163, 74, 0.25); }

  .nav-icon {
    font-size: 1.3rem;
  }

  .nav-label-box {
    display: flex;
    flex-direction: column;
    text-align: left;
    gap: 2px;
  }

  .nav-name {
    font-size: 0.88rem;
    font-weight: 600;
  }

  .nav-cat-pill {
    font-size: 0.65rem;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 4px;
    display: inline-block;
    width: fit-content;
  }

  .pill-input { background: #e0f2fe; color: #0369a1; }
  .pill-process { background: #f3e8ff; color: #7e22ce; }
  .pill-storage { background: #fef9c3; color: #a16207; }
  .pill-output { background: #dcfce7; color: #15803d; }

  .active-indicator {
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 22px;
    height: 3px;
    border-radius: 9999px;
  }

  .indicator-input { background: #0284c7; }
  .indicator-process { background: #9333ea; }
  .indicator-storage { background: #eab308; }
  .indicator-output { background: #16a34a; }

  /* INFORMATION CARD */
  .info-card-container {
    position: absolute;
    top: 85px;
    right: 24px;
    width: 360px;
    max-height: calc(100vh - 210px);
    z-index: 10;
    transition: all 0.3s ease;
  }

  .info-card-container.collapsed {
    width: 280px;
  }

  .info-card {
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(226, 232, 240, 0.9);
    border-radius: 20px;
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 100%;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 18px 20px;
    background: rgba(248, 250, 252, 0.85);
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  }

  /* CATEGORY BADGE COLORS */
  .category-badge {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 3px 10px;
    border-radius: 6px;
    margin-bottom: 6px;
  }

  .badge-input {
    color: #0284c7;
    background: #e0f2fe;
    border: 1px solid #bae6fd;
  }
  .badge-process {
    color: #9333ea;
    background: #f3e8ff;
    border: 1px solid #e9d5ff;
  }
  .badge-storage {
    color: #b45309;
    background: #fef3c7;
    border: 1px solid #fde68a;
  }
  .badge-output {
    color: #16a34a;
    background: #dcfce7;
    border: 1px solid #bbf7d0;
  }

  .hardware-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .title-icon {
    font-size: 1.35rem;
  }

  .toggle-btn {
    background: #e2e8f0;
    border: 1px solid #cbd5e1;
    color: #334155;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    font-size: 1.2rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .toggle-btn:hover {
    background: #cbd5e1;
    color: #0f172a;
  }

  .card-body {
    padding: 20px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .section-block {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .section-title {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
  }

  .desc-box {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.6;
    color: #334155;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 12px 14px;
    border-radius: 12px;
  }

  /* SSD VARIANT TOGGLE */
  .ssd-model-select {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 12px 14px;
    border-radius: 12px;
  }

  .ssd-type-tabs {
    display: flex;
    gap: 8px;
    margin-top: 6px;
  }

  .ssd-type-btn {
    flex: 1;
    padding: 8px 10px;
    font-size: 0.78rem;
    font-weight: 700;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #ffffff;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
  }

  .ssd-type-btn:hover:not(.active) {
    background: #f1f5f9;
    color: #0f172a;
    border-color: #94a3b8;
  }

  .ssd-type-btn.active {
    background: linear-gradient(135deg, #0284c7, #0369a1);
    color: #ffffff;
    border-color: #0284c7;
    box-shadow: 0 4px 10px rgba(2, 132, 199, 0.3);
  }

  .ssd-type-note {
    font-size: 0.72rem;
    color: #64748b;
    margin-top: 6px;
    display: block;
    line-height: 1.4;
  }

  .category-meta-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #f8fafc;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }

  .meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
  }

  .meta-label {
    color: #64748b;
    font-weight: 500;
  }

  .meta-value {
    font-weight: 700;
  }

  .val-input { color: #0284c7; }
  .val-process { color: #9333ea; }
  .val-storage { color: #b45309; }
  .val-output { color: #16a34a; }

  .meta-value-live {
    color: #10b981;
    font-weight: 600;
    font-size: 0.78rem;
  }

  @media (max-width: 768px) {
    .top-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    .interaction-hint {
      display: none;
    }
    .info-card-container {
      top: auto;
      bottom: 140px;
      right: 12px;
      left: 12px;
      width: auto;
      max-height: 35vh;
    }
    .bottom-dock {
      bottom: 12px;
    }
  }
</style>