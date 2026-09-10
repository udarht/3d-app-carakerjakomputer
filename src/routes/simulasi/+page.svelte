<script lang="ts">
  import { onMount } from 'svelte';
  import SimulasiCanvas from '$lib/components/SimulasiCanvas.svelte';
  import GuideModal from '$lib/components/GuideModal.svelte';
  import MainMenu from '$lib/components/MainMenu.svelte';

  let isMounted = $state(false);
  let isGuideOpen = $state(false);
  let isMenuOpen = $state(false);

  // Simulation State
  let currentStep = $state<1 | 2 | 3 | 4>(1);
  let userInput = $state('Belajar Komputer Asik!');
  let processedData = $state('');

  // Animation triggers
  let isSignalKbToCpu = $state(false);
  let isCpuProcessing = $state(false);
  let isRamProcessing = $state(false);
  let isSignalCpuToMonitor = $state(false);
  let showMonitorText = $state(false);
  let isSignalRamToSsd = $state(false);
  let ssdSaved = $state(false);
  let isBusy = $state(false);

  // Narration cards data
  const stepNarrations = [
    {
      step: 1,
      tag: 'TAHAP 1: INPUT',
      title: 'Memasukkan Data (Input)',
      color: '#0284c7',
      bgClass: 'step-input',
      icon: '⌨️',
      summary: 'Data teks dimasukkan melalui Keyboard dan dikonversi menjadi sinyal biner.',
      detail:
        'Saat Anda mengetik dan menekan tombol Kirim, saklar tombol keyboard menutup rangkaian elektrik. Mikrokontroler keyboard membaca penekanan tersebut, mengubah karakter menjadi sinyal digital (kode biner 0 dan 1), lalu mengirimkannya ke bus data menuju CPU.'
    },
    {
      step: 2,
      tag: 'TAHAP 2: PROCESS',
      title: 'Pemrosesan Data (Process)',
      color: '#9333ea',
      bgClass: 'step-process',
      icon: '⚙️',
      summary: 'CPU mengeksekusi instruksi dan menggunakan RAM sebagai memori kerja cepat.',
      detail:
        'CPU (Central Processing Unit) mengambil instruksi dari memori (Fetch), menerjemahkannya (Decode), lalu mengeksekusi (Execute) proses pengolahan data. Selama proses ini, RAM (Random Access Memory) bertindak sebagai area kerja sementara berkecepatan tinggi untuk menampung teks yang sedang diproses.'
    },
    {
      step: 3,
      tag: 'TAHAP 3: OUTPUT',
      title: 'Keluaran Hasil (Output)',
      color: '#16a34a',
      bgClass: 'step-output',
      icon: '🖥️',
      summary: 'Hasil olah data dikirim dari pemrosesan untuk ditampilkan ke Monitor.',
      detail:
        'Setelah data teks selesai diproses, CPU mengirimkan instruksi grafis ke sistem display. Sinyal video digital diteruskan ke Monitor sehingga layar dapat menampilkan teks hasil pemrosesan secara visual yang dapat dibaca manusia.'
    },
    {
      step: 4,
      tag: 'TAHAP 4: STORAGE',
      title: 'Penyimpanan Permanen (Storage)',
      color: '#d97706',
      bgClass: 'step-storage',
      icon: '💾',
      summary: 'Data disimpan dari RAM ke SSD agar tidak hilang saat komputer dimatikan.',
      detail:
        'Karena RAM bersifat sementara (volatile) dan akan hilang jika listrik padam, data perlu disimpan ke media penyimpanan sekunder yaitu SSD (Solid State Drive). Data disalin dari RAM lalu ditulis ke dalam chip NAND Flash non-volatile secara permanen dan aman.'
    }
  ];

  let currentNarration = $derived(stepNarrations[currentStep - 1]);

  onMount(() => {
    isMounted = true;
  });

  // Action Step 1: Input -> Send signal to CPU
  function handleStep1Send() {
    if (isBusy || !userInput.trim()) return;
    isBusy = true;
    isSignalKbToCpu = true;
    processedData = userInput.trim();

    setTimeout(() => {
      isSignalKbToCpu = false;
      currentStep = 2;
      isBusy = false;
      // Auto trigger processing animation for step 2
      startStep2Process();
    }, 1800);
  }

  // Action Step 2: CPU & RAM pulse
  function startStep2Process() {
    isBusy = true;
    isCpuProcessing = true;
    isRamProcessing = true;

    setTimeout(() => {
      isCpuProcessing = false;
      isRamProcessing = false;
      currentStep = 3;
      isBusy = false;
      // Trigger output to monitor
      startStep3Output();
    }, 2400);
  }

  // Action Step 3: Signal to Monitor
  function startStep3Output() {
    isBusy = true;
    isSignalCpuToMonitor = true;

    setTimeout(() => {
      isSignalCpuToMonitor = false;
      showMonitorText = true;
      currentStep = 4;
      isBusy = false;
    }, 1800);
  }

  // Action Step 4: Save to SSD
  function handleStep4Save() {
    if (isBusy) return;
    isBusy = true;
    isSignalRamToSsd = true;

    setTimeout(() => {
      isSignalRamToSsd = false;
      ssdSaved = true;
      isBusy = false;
    }, 1900);
  }

  // Reset entire simulation
  function resetSimulation() {
    isBusy = false;
    currentStep = 1;
    isSignalKbToCpu = false;
    isCpuProcessing = false;
    isRamProcessing = false;
    isSignalCpuToMonitor = false;
    showMonitorText = false;
    isSignalRamToSsd = false;
    ssdSaved = false;
  }
</script>

<svelte:head>
  <title>Simulasi Alur Kerja Komputer (IPOS) | Cara Kerja Komputer 3D</title>
  <meta
    name="description"
    content="Simulasi 3D Interaktif Alur Siklus IPOS: Input, Process, Output, dan Storage."
  />
</svelte:head>

<div class="simulation-container">
  <!-- 3D Canvas Area -->
  <div class="canvas-area">
    {#if isMounted}
      <SimulasiCanvas
        activeStep={currentStep}
        inputText={processedData || userInput}
        {isCpuProcessing}
        {isRamProcessing}
        {isSignalKbToCpu}
        {isSignalCpuToMonitor}
        {isSignalRamToSsd}
        {showMonitorText}
        {ssdSaved}
      />
    {:else}
      <div class="loading-state">
        <div class="spinner"></div>
        <span>Memuat Simulasi IPOS 3D...</span>
      </div>
    {/if}
  </div>

  <!-- Guide Modal / Panduan Penggunaan -->
  <GuideModal isOpen={isGuideOpen} onClose={() => (isGuideOpen = false)} />

  <!-- Main Menu Dashboard Modal -->
  <MainMenu isOpen={isMenuOpen} onClose={() => (isMenuOpen = false)} />

  <!-- TOP HEADER -->
  <header class="top-header">
    <div class="brand-row">
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
          <h1 class="brand-title">SIMULASI ALUR KERJA KOMPUTER</h1>
          <p class="brand-subtitle">Siklus Input ➔ Process ➔ Output ➔ Storage</p>
        </div>
      </div>
    </div>

    <!-- Right Header Controls: Kotak Menu Fitur & Kotak Mode Switcher -->
    <div class="header-right-group">
      <!-- Kotak Menu Utama dan Panduan (Disatukan dalam 1 Kotak Kapsul) -->
      <div class="menu-action-group">
        <button
          type="button"
          class="touch-target menu-item-btn"
          onclick={() => (isMenuOpen = true)}
          title="Buka Menu Utama / Dashboard Pembelajaran"
          aria-label="Menu Utama Pembelajaran"
        >
          <span class="menu-item-icon">🏠</span>
          <span>Menu Utama</span>
        </button>

        <button
          type="button"
          class="touch-target menu-item-btn"
          onclick={() => (isGuideOpen = true)}
          title="Buka Panduan Penggunaan Media"
          aria-label="Panduan Penggunaan Media"
        >
          <span class="menu-item-icon">❓</span>
          <span>Panduan</span>
        </button>
      </div>

      <!-- Mode Toggle Switch -->
      <div class="mode-toggle-group">
        <a href="/" class="touch-target mode-link">
          <span class="mode-icon">🔍</span>
          <span>Mode Eksplorasi</span>
        </a>
        <a href="/simulasi" class="touch-target mode-link active">
          <span class="mode-icon">🚀</span>
          <span>Mode Simulasi</span>
        </a>
        <a href="/kuis" class="touch-target mode-link">
          <span class="mode-icon">🧩</span>
          <span>Kuis Game</span>
        </a>
      </div>
    </div>
  </header>

  <!-- STEP PROGRESS TRACKER BAR -->
  <div class="progress-dock">
    <div class="step-tracker">
      <button
        type="button"
        class="touch-target tracker-node"
        class:active={currentStep === 1}
        class:done={currentStep > 1}
        onclick={() => (currentStep = 1)}
      >
        <div class="node-badge badge-input">1</div>
        <div class="node-label">
          <span class="node-title">Input</span>
          <span class="node-device">Keyboard</span>
        </div>
      </button>

      <div class="tracker-connector" class:done={currentStep > 1}></div>

      <button
        type="button"
        class="touch-target tracker-node"
        class:active={currentStep === 2}
        class:done={currentStep > 2}
        onclick={() => (currentStep = 2)}
      >
        <div class="node-badge badge-process">2</div>
        <div class="node-label">
          <span class="node-title">Process</span>
          <span class="node-device">CPU & RAM</span>
        </div>
      </button>

      <div class="tracker-connector" class:done={currentStep > 2}></div>

      <button
        type="button"
        class="touch-target tracker-node"
        class:active={currentStep === 3}
        class:done={currentStep > 3}
        onclick={() => (currentStep = 3)}
      >
        <div class="node-badge badge-output">3</div>
        <div class="node-label">
          <span class="node-title">Output</span>
          <span class="node-device">Monitor</span>
        </div>
      </button>

      <div class="tracker-connector" class:done={currentStep > 3}></div>

      <button
        type="button"
        class="touch-target tracker-node"
        class:active={currentStep === 4}
        class:done={ssdSaved}
        onclick={() => (currentStep = 4)}
      >
        <div class="node-badge badge-storage">4</div>
        <div class="node-label">
          <span class="node-title">Storage</span>
          <span class="node-device">SSD</span>
        </div>
      </button>
    </div>
  </div>

  <!-- INTERACTIVE CONTROL PANEL (BOTTOM LEFT) -->
  <div class="control-panel">
    <div class="panel-header">
      <div class="panel-title-wrap">
        <span class="panel-icon">🎮</span>
        <span class="panel-title">Kontrol Alur Simulasi</span>
      </div>
      <button
        type="button"
        class="touch-target reset-btn"
        onclick={resetSimulation}
        title="Ulangi dari Langkah 1"
      >
        🔄 Reset
      </button>
    </div>

    <div class="panel-content">
      <!-- Step 1 Controller -->
      {#if currentStep === 1}
        <div class="control-step-box">
          <div class="step-instruction">
            <span class="step-num">Langkah 1:</span>
            <span>Ketik teks masukan data untuk dikirim ke sistem:</span>
          </div>

          <div class="input-form">
            <input
              type="text"
              class="text-input"
              bind:value={userInput}
              placeholder="Ketik kalimat di sini..."
              disabled={isBusy}
            />
            <button
              type="button"
              class="touch-target action-btn btn-input"
              onclick={handleStep1Send}
              disabled={isBusy || !userInput.trim()}
            >
              {#if isSignalKbToCpu}
                <span class="btn-spinner"></span> Mengirim Sinyal...
              {:else}
                🚀 Kirim ke CPU
              {/if}
            </button>
          </div>
          <span class="tip-text">💡 Mengetik di keyboard menghasilkan sinyal listrik biner menuju CPU.</span>
        </div>

      <!-- Step 2 Controller -->
      {:else if currentStep === 2}
        <div class="control-step-box">
          <div class="step-instruction">
            <span class="step-num">Langkah 2:</span>
            <span>CPU dan RAM sedang memproses data masukan:</span>
          </div>

          <div class="processing-status-box">
            <div class="proc-indicator">
              <span class="pulse-dot cpu-dot"></span>
              <span>CPU: Menguraikan kode ASCII biner "{processedData}"</span>
            </div>
            <div class="proc-indicator">
              <span class="pulse-dot ram-dot"></span>
              <span>RAM: Menyimpan data sementara di alamat memori</span>
            </div>
          </div>

          <div class="btn-row">
            <button
              type="button"
              class="touch-target action-btn btn-process"
              onclick={startStep2Process}
              disabled={isBusy}
            >
              {#if isCpuProcessing}
                <span class="btn-spinner"></span> Memproses Instruksi...
              {:else}
                ⚙️ Putar Ulang Pemrosesan
              {/if}
            </button>
            <button
              type="button"
              class="touch-target action-btn btn-next"
              onclick={() => {
                currentStep = 3;
                startStep3Output();
              }}
              disabled={isBusy}
            >
              Lanjut ke Output ➔
            </button>
          </div>
        </div>

      <!-- Step 3 Controller -->
      {:else if currentStep === 3}
        <div class="control-step-box">
          <div class="step-instruction">
            <span class="step-num">Langkah 3:</span>
            <span>Hasil pemrosesan dikirim ke Monitor:</span>
          </div>

          <div class="output-preview-card">
            <span class="preview-label">Tampilan pada Layar Monitor:</span>
            <div class="preview-screen">
              <span class="screen-prompt">&gt; Output:</span>
              <span class="screen-text">"{processedData}"</span>
            </div>
          </div>

          <div class="btn-row">
            <button
              type="button"
              class="touch-target action-btn btn-output"
              onclick={startStep3Output}
              disabled={isBusy}
            >
              {#if isSignalCpuToMonitor}
                <span class="btn-spinner"></span> Mengirim ke Layar...
              {:else}
                🖥️ Tampilkan Ulang di Layar
              {/if}
            </button>
            <button
              type="button"
              class="touch-target action-btn btn-next"
              onclick={() => (currentStep = 4)}
              disabled={isBusy}
            >
              Lanjut ke Storage ➔
            </button>
          </div>
        </div>

      <!-- Step 4 Controller -->
      {:else if currentStep === 4}
        <div class="control-step-box">
          <div class="step-instruction">
            <span class="step-num">Langkah 4:</span>
            <span>Simpan data dari RAM ke media penyimpanan permanen (SSD):</span>
          </div>

          <div class="storage-action-box">
            {#if ssdSaved}
              <div class="saved-badge">
                <span class="saved-icon">✅</span>
                <div>
                  <strong>Data Berhasil Disimpan ke SSD!</strong>
                  <p class="saved-desc">Data "{processedData}" tersimpan aman di sel flash NAND non-volatile.</p>
                </div>
              </div>
            {:else}
              <p class="unsaved-warning">
                ⚠️ Data saat ini hanya ada di RAM (volatile) dan akan hilang jika komputer mati.
              </p>
            {/if}

            <button
              type="button"
              class="touch-target action-btn btn-storage"
              onclick={handleStep4Save}
              disabled={isBusy || ssdSaved}
            >
              {#if isSignalRamToSsd}
                <span class="btn-spinner"></span> Menulis ke Sel Flash NAND...
              {:else if ssdSaved}
                💾 Tersimpan Permanen
              {:else}
                💾 Simpan Data ke SSD
              {/if}
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- NARRATION & EXPLANATION PANEL (TOP RIGHT) -->
  <aside class="narration-dock">
    <div class="narration-card">
      <div class="narration-header {currentNarration.bgClass}">
        <span class="step-tag">{currentNarration.tag}</span>
        <h2 class="narration-title">
          <span class="narration-icon">{currentNarration.icon}</span>
          {currentNarration.title}
        </h2>
      </div>

      <div class="narration-body">
        <div class="concept-summary">
          <strong>Inti Konsep:</strong>
          <p>{currentNarration.summary}</p>
        </div>

        <div class="explanation-box">
          <h3 class="box-title">🔍 Apa yang Sedang Terjadi?</h3>
          <p class="box-text">{currentNarration.detail}</p>
        </div>

        <!-- Flow Visual Pill Indicator -->
        <div class="ipos-mini-flow">
          <span class="mini-node" class:highlight={currentStep === 1}>Input</span>
          <span class="mini-arrow">➔</span>
          <span class="mini-node" class:highlight={currentStep === 2}>Process</span>
          <span class="mini-arrow">➔</span>
          <span class="mini-node" class:highlight={currentStep === 3}>Output</span>
          <span class="mini-arrow">➔</span>
          <span class="mini-node" class:highlight={currentStep === 4}>Storage</span>
        </div>
      </div>
    </div>
  </aside>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f1f5f9;
    color: #0f172a;
  }

  .simulation-container {
    position: relative;
    width: 100%;
    height: 100%;
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

  /* TOP HEADER NAVBAR (Kunci tinggi presisi 56px / h-14, rata tengah vertikal) */
  .top-header {
    position: absolute;
    top: 16px;
    left: 24px;
    right: 24px;
    height: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;
    z-index: 10;
    box-sizing: border-box;
    padding: 0;
  }

  .brand-row {
    display: flex;
    align-items: center;
    height: 100%;
    margin: 0;
    padding: 0;
    pointer-events: auto;
    box-sizing: border-box;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(226, 232, 240, 0.9);
    height: 52px;
    padding: 0 16px 0 8px;
    border-radius: 9999px;
    box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.07);
    pointer-events: auto;
    box-sizing: border-box;
    margin: 0;
  }

  .edu-logos {
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(241, 245, 249, 0.7);
    padding: 3px 8px;
    border-radius: 9999px;
    border: 1px solid rgba(226, 232, 240, 0.8);
    height: 36px;
    box-sizing: border-box;
  }

  .edu-logo-img {
    height: 24px;
    max-height: 28px;
    width: auto;
    max-width: 36px;
    object-fit: contain;
    transition: transform 0.2s ease;
    display: block;
  }

  .edu-logo-img:hover {
    transform: scale(1.1);
  }

  .logo-sobat {
    max-width: 46px;
  }

  .brand-divider {
    width: 1px;
    height: 24px;
    background-color: #cbd5e1;
    margin: 0 2px;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0;
  }

  .brand-title {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    color: #0f172a;
    line-height: 1.15;
    white-space: nowrap;
  }

  .brand-subtitle {
    margin: 0;
    font-size: 0.58rem;
    font-weight: 600;
    color: #64748b;
    line-height: 1;
    white-space: nowrap;
  }

  .header-right-group {
    display: flex;
    align-items: center;
    height: 100%;
    gap: 10px;
    box-sizing: border-box;
  }

  .menu-action-group {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(226, 232, 240, 0.9);
    height: 52px;
    padding: 3px 6px;
    border-radius: 9999px;
    box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.07);
    pointer-events: auto;
    box-sizing: border-box;
    gap: 4px;
    margin: 0;
  }

  .menu-item-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 45px;
    height: 45px;
    min-width: 45px;
    padding: 0 14px;
    border: none;
    background: transparent;
    border-radius: 9999px;
    font-size: 0.82rem;
    font-weight: 700;
    color: #334155;
    cursor: pointer;
    transition: all 0.2s;
    box-sizing: border-box;
    white-space: normal;
    text-align: left;
    line-height: 1.2;
    margin: 0;
  }

  .menu-item-btn:hover {
    color: #0284c7;
    background: #f1f5f9;
  }

  .menu-item-btn:active {
    transform: scale(0.97);
  }

  .menu-item-icon {
    font-size: 0.95rem;
  }

  /* MODE TOGGLE SWITCH */
  .mode-toggle-group {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(226, 232, 240, 0.9);
    height: 52px;
    padding: 3px 6px;
    border-radius: 9999px;
    box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.07);
    pointer-events: auto;
    box-sizing: border-box;
    gap: 4px;
    margin: 0;
  }

  .mode-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 45px;
    height: 45px;
    min-width: 45px;
    padding: 0 16px;
    border-radius: 9999px;
    text-decoration: none;
    font-size: 0.82rem;
    font-weight: 600;
    color: #64748b;
    transition: all 0.2s;
    box-sizing: border-box;
    margin: 0;
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

  /* STEP PROGRESS TRACKER DOCK */
  .progress-dock {
    position: absolute;
    top: 82px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    pointer-events: auto;
  }

  .step-tracker {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(226, 232, 240, 0.9);
    padding: 8px 18px;
    border-radius: 9999px;
    box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.09);
  }

  .tracker-node {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    min-height: 45px;
    min-width: 45px;
    padding: 6px 14px;
    border-radius: 9999px;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .tracker-node:hover {
    background: #f8fafc;
  }

  .node-badge {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    background: #e2e8f0;
    color: #334155;
    transition: all 0.25s;
  }

  .node-label {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .node-title {
    font-size: 0.8rem;
    font-weight: 700;
    color: #1e293b;
  }

  .node-device {
    font-size: 0.68rem;
    color: #64748b;
  }

  .tracker-node.active .node-badge.badge-input {
    background: #0284c7;
    color: #ffffff;
    box-shadow: 0 0 12px rgba(2, 132, 199, 0.6);
  }
  .tracker-node.active .node-badge.badge-process {
    background: #9333ea;
    color: #ffffff;
    box-shadow: 0 0 12px rgba(147, 51, 234, 0.6);
  }
  .tracker-node.active .node-badge.badge-output {
    background: #16a34a;
    color: #ffffff;
    box-shadow: 0 0 12px rgba(22, 163, 74, 0.6);
  }
  .tracker-node.active .node-badge.badge-storage {
    background: #d97706;
    color: #ffffff;
    box-shadow: 0 0 12px rgba(217, 119, 6, 0.6);
  }

  .tracker-node.active .node-title {
    color: #0f172a;
  }

  .tracker-connector {
    width: 28px;
    height: 2px;
    background: #e2e8f0;
    transition: all 0.3s;
  }

  .tracker-connector.done {
    background: #0284c7;
  }

  /* CONTROL PANEL (BOTTOM LEFT) */
  .control-panel {
    position: absolute;
    bottom: 24px;
    left: 24px;
    width: 380px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(226, 232, 240, 0.9);
    border-radius: 20px;
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.12);
    z-index: 10;
    overflow: hidden;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 18px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .panel-title-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .panel-title {
    font-size: 0.88rem;
    font-weight: 700;
    color: #0f172a;
  }

  .reset-btn {
    background: #e2e8f0;
    border: 1px solid #cbd5e1;
    color: #1e293b;
    font-size: 0.78rem;
    font-weight: 700;
    min-height: 45px;
    min-width: 45px;
    padding: 6px 16px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .reset-btn:hover {
    background: #cbd5e1;
    color: #0f172a;
  }

  .panel-content {
    padding: 18px;
  }

  .control-step-box {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .step-instruction {
    font-size: 0.84rem;
    color: #1e293b;
    line-height: 1.4;
  }

  .step-num {
    font-weight: 700;
    color: #0284c7;
  }

  .input-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .text-input {
    width: 100%;
    box-sizing: border-box;
    min-height: 45px;
    padding: 10px 14px;
    font-size: 0.88rem;
    border: 1.5px solid #cbd5e1;
    border-radius: 10px;
    outline: none;
    transition: all 0.2s;
    color: #0f172a;
  }

  .text-input:focus {
    border-color: #0284c7;
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.2);
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 45px;
    min-width: 45px;
    padding: 10px 18px;
    border: none;
    border-radius: 12px;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    color: #ffffff;
    box-sizing: border-box;
  }

  .action-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  .action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-input {
    background: linear-gradient(135deg, #0284c7, #2563eb);
  }

  .btn-process {
    background: linear-gradient(135deg, #9333ea, #7c3aed);
  }

  .btn-output {
    background: linear-gradient(135deg, #16a34a, #059669);
  }

  .btn-storage {
    background: linear-gradient(135deg, #d97706, #b45309);
  }

  .btn-next {
    background: #0f172a;
    color: #ffffff;
  }

  .btn-row {
    display: flex;
    gap: 8px;
  }

  .btn-row .action-btn {
    flex: 1;
  }

  .btn-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  .tip-text {
    font-size: 0.72rem;
    color: #64748b;
  }

  .processing-status-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .proc-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    color: #334155;
  }

  .pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulseGlow 1.2s infinite;
  }

  .cpu-dot { background-color: #9333ea; }
  .ram-dot { background-color: #06b6d4; }

  @keyframes pulseGlow {
    0%, 100% { opacity: 0.4; transform: scale(0.9); }
    50% { opacity: 1; transform: scale(1.2); }
  }

  .output-preview-card {
    background: #0f172a;
    border-radius: 12px;
    padding: 12px;
    color: #f8fafc;
  }

  .preview-label {
    font-size: 0.7rem;
    color: #94a3b8;
    display: block;
    margin-bottom: 6px;
  }

  .preview-screen {
    font-family: monospace;
    font-size: 0.88rem;
    display: flex;
    gap: 6px;
  }

  .screen-prompt {
    color: #22c55e;
  }

  .screen-text {
    color: #38bdf8;
    font-weight: 600;
  }

  .storage-action-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .unsaved-warning {
    margin: 0;
    font-size: 0.78rem;
    color: #b45309;
    background: #fef3c7;
    border: 1px solid #fde68a;
    padding: 8px 12px;
    border-radius: 8px;
  }

  .saved-badge {
    display: flex;
    gap: 10px;
    background: #dcfce7;
    border: 1px solid #86efac;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 0.8rem;
    color: #166534;
  }

  .saved-icon {
    font-size: 1.2rem;
  }

  .saved-desc {
    margin: 2px 0 0 0;
    font-size: 0.72rem;
    color: #15803d;
  }

  /* NARRATION DOCK (TOP RIGHT) */
  .narration-dock {
    position: absolute;
    top: 82px;
    right: 24px;
    width: 360px;
    z-index: 10;
    pointer-events: auto;
  }

  .narration-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(226, 232, 240, 0.9);
    border-radius: 20px;
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.12);
    overflow: hidden;
  }

  .narration-header {
    padding: 16px 20px;
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .step-tag {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.06em;
  }

  .step-input { background: #e0f2fe; color: #0369a1; }
  .step-process { background: #f3e8ff; color: #7e22ce; }
  .step-output { background: #dcfce7; color: #15803d; }
  .step-storage { background: #fef3c7; color: #a16207; }

  .narration-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .narration-icon {
    font-size: 1.2rem;
  }

  .narration-body {
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .concept-summary {
    font-size: 0.82rem;
    color: #334155;
    line-height: 1.5;
  }

  .concept-summary p {
    margin: 4px 0 0 0;
    color: #475569;
  }

  .explanation-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 12px 14px;
    border-radius: 12px;
  }

  .box-title {
    margin: 0 0 6px 0;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
  }

  .box-text {
    margin: 0;
    font-size: 0.82rem;
    line-height: 1.6;
    color: #334155;
  }

  .ipos-mini-flow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f1f5f9;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
  }

  .mini-node.highlight {
    color: #0284c7;
    font-weight: 800;
    text-decoration: underline;
  }

  .mini-arrow {
    color: #94a3b8;
  }

  @media (max-width: 900px) {
    .progress-dock {
      display: none;
    }
    .control-panel {
      width: calc(100vw - 32px);
      left: 16px;
      bottom: 16px;
      max-height: 38vh;
      overflow-y: auto;
    }
    .narration-dock {
      top: 76px;
      right: 16px;
      left: 16px;
      width: auto;
      max-height: 28vh;
      overflow-y: auto;
    }
  }
</style>
