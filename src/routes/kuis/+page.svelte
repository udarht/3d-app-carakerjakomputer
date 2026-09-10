<script lang="ts">
  import { onMount } from 'svelte';
  import GuideModal from '$lib/components/GuideModal.svelte';
  import MainMenu from '$lib/components/MainMenu.svelte';
  import { quizItems, categoryDefinitions } from '$lib/data/quiz.js';

  interface QuizCard {
    id: string;
    name: string;
    correctCategory: string;
    hint: string;
    icon: string;
    explanation: string;
  }

  // State
  let isGuideOpen = $state(false);
  let isMenuOpen = $state(false);
  let bankItems = $state<QuizCard[]>([]);
  let categorySlots = $state<Record<string, QuizCard[]>>({
    Input: [],
    Process: [],
    Storage: [],
    Output: []
  });

  // Dragging state
  let draggedItemId = $state<string | null>(null);
  let dragSourceCategory = $state<string | null>(null);
  let activeDropTarget = $state<string | null>(null);

  // Evaluation & Score state
  let isChecked = $state(false);
  let score = $state(0);
  let scorePercent = $state(0);
  let showHintId = $state<string | null>(null);

  // Initialize and Shuffle
  function initQuiz() {
    isChecked = false;
    score = 0;
    scorePercent = 0;
    draggedItemId = null;
    dragSourceCategory = null;
    activeDropTarget = null;
    showHintId = null;

    categorySlots = {
      Input: [],
      Process: [],
      Storage: [],
      Output: []
    };

    // Fisher-Yates Shuffle
    const shuffled = [...quizItems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    bankItems = shuffled;
  }

  onMount(() => {
    initQuiz();
  });

  // Find item by ID in either bank or category slots
  function findItem(id: string): { item: QuizCard; source: 'bank' | string; index: number } | null {
    const bankIdx = bankItems.findIndex((x) => x.id === id);
    if (bankIdx !== -1) {
      return { item: bankItems[bankIdx], source: 'bank', index: bankIdx };
    }
    for (const cat of ['Input', 'Process', 'Storage', 'Output']) {
      const idx = categorySlots[cat].findIndex((x) => x.id === id);
      if (idx !== -1) {
        return { item: categorySlots[cat][idx], source: cat, index: idx };
      }
    }
    return null;
  }

  // Move item to target category or back to bank
  function moveItem(id: string, targetCategory: string | 'bank') {
    const found = findItem(id);
    if (!found) return;

    const { item, source, index } = found;
    if (source === targetCategory) return;

    // Remove from current location
    if (source === 'bank') {
      bankItems = bankItems.filter((_, i) => i !== index);
    } else {
      categorySlots[source] = categorySlots[source].filter((_, i) => i !== index);
    }

    // Add to target location
    if (targetCategory === 'bank') {
      bankItems = [...bankItems, item];
    } else {
      categorySlots[targetCategory] = [...categorySlots[targetCategory], item];
    }

    if (isChecked) {
      isChecked = false;
    }
  }

  // HTML5 Drag and Drop Handlers
  function handleDragStart(event: DragEvent, id: string, source: string | null) {
    draggedItemId = id;
    dragSourceCategory = source;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  function handleDragEnd() {
    draggedItemId = null;
    dragSourceCategory = null;
    activeDropTarget = null;
  }

  function handleDragOver(event: DragEvent, target: string) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    activeDropTarget = target;
  }

  function handleDragLeave(target: string) {
    if (activeDropTarget === target) {
      activeDropTarget = null;
    }
  }

  function handleDrop(event: DragEvent, targetCategory: string | 'bank') {
    event.preventDefault();
    const id = event.dataTransfer?.getData('text/plain') || draggedItemId;
    if (id) {
      moveItem(id, targetCategory);
    }
    handleDragEnd();
  }

  // Check Answers
  function checkAnswers() {
    let totalCorrect = 0;
    for (const cat of ['Input', 'Process', 'Storage', 'Output']) {
      for (const item of categorySlots[cat]) {
        if (item.correctCategory === cat) {
          totalCorrect++;
        }
      }
    }
    score = totalCorrect;
    scorePercent = Math.round((totalCorrect / quizItems.length) * 100);
    isChecked = true;
  }

  // Total placed items
  let totalPlaced = $derived(
    categorySlots.Input.length +
    categorySlots.Process.length +
    categorySlots.Storage.length +
    categorySlots.Output.length
  );

  // Review Filter: 'all' | 'wrong'
  let reviewFilter = $state<'all' | 'wrong'>('all');

  // Evaluated items list for comprehensive review section
  interface EvaluatedItem extends QuizCard {
    placedCategory: string | null;
    isCorrect: boolean;
  }

  let evaluatedList = $derived<EvaluatedItem[]>(() => {
    return quizItems.map((item) => {
      let placedCat: string | null = null;
      for (const cat of ['Input', 'Process', 'Storage', 'Output']) {
        if (categorySlots[cat].some((x) => x.id === item.id)) {
          placedCat = cat;
          break;
        }
      }
      const isCorrect = placedCat === item.correctCategory;
      return {
        ...item,
        placedCategory: placedCat,
        isCorrect
      };
    });
  });

  let filteredReviewList = $derived(() => {
    const list = evaluatedList();
    if (reviewFilter === 'wrong') {
      return list.filter((x) => !x.isCorrect);
    }
    return list;
  });

  let wrongCount = $derived(() => evaluatedList().filter((x) => !x.isCorrect).length);
</script>

<svelte:head>
  <title>Kuis Interaktif Perangkat Keras | Drag & Drop Game</title>
  <meta name="description" content="Uji pemahaman klasifikasi perangkat keras komputer (Input, Process, Storage, Output) dengan kuis drag and drop interaktif." />
</svelte:head>

<!-- Guide Modal / Panduan Penggunaan -->
<GuideModal isOpen={isGuideOpen} onClose={() => (isGuideOpen = false)} />

<!-- Main Menu Dashboard Modal -->
<MainMenu isOpen={isMenuOpen} onClose={() => (isMenuOpen = false)} />

<div class="min-h-screen bg-slate-100 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
  <!-- TOP NAVIGATION HEADER (Light theme with subtle blur and border, consistent with 3D Viewer) -->
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
    <div class="flex items-center gap-2.5 sm:gap-3">
      <!-- Tombol Beranda / Menu Utama Konsisten (Min 44x44 px) -->
      <button
        type="button"
        onclick={() => (isMenuOpen = true)}
        class="min-h-[44px] min-w-[44px] px-3 sm:px-4 py-2 rounded-2xl bg-white hover:bg-sky-50 active:bg-sky-100 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
        title="Buka Menu Utama / Dashboard Pembelajaran"
        aria-label="Menu Utama Pembelajaran"
      >
        <span class="text-base sm:text-lg">🏠</span>
        <span class="hidden md:inline">Menu Utama</span>
      </button>

      <!-- Education Logos Strip -->
      <div class="hidden sm:flex items-center gap-1.5 bg-slate-100/90 border border-slate-200/80 rounded-full px-2.5 py-1 shadow-sm">
        <img src="/images/Tutwuri_3.png" alt="Tut Wuri Handayani" class="h-6 w-auto object-contain hover:scale-110 transition-transform" title="Tut Wuri Handayani" />
        <img src="/images/Logo_02.png" alt="Logo Pendidikan 2" class="h-6 w-auto object-contain hover:scale-110 transition-transform" />
        <img src="/images/Logo_03.png" alt="Logo Pendidikan 3" class="h-6 w-auto object-contain hover:scale-110 transition-transform" />
        <img src="/images/LogoSobatSMP2025.png" alt="Sobat SMP" class="h-6 w-auto max-w-[50px] object-contain hover:scale-110 transition-transform" title="Sobat SMP 2025" />
      </div>
      <div class="hidden md:block w-[1px] h-6 bg-slate-300"></div>
      <div>
        <h1 class="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
          KUIS DRAG & DROP <span class="text-xs px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-semibold">Game Edukasi</span>
        </h1>
        <p class="text-[11px] sm:text-xs text-slate-500 hidden sm:block">Kelompokkan 9 perangkat ke kotak kategori yang tepat!</p>
      </div>
    </div>

    <!-- Header Controls: Mode Navigation Switcher & Panduan Button -->
    <div class="flex items-center gap-2.5">
      <!-- Tombol Panduan Penggunaan (Tinggi 44px) -->
      <button
        type="button"
        onclick={() => (isGuideOpen = true)}
        class="h-[44px] min-w-[44px] px-4 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 hover:shadow-lg hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer box-border"
        title="Buka Panduan Penggunaan Media"
        aria-label="Panduan Penggunaan Media"
      >
        <span class="text-sm">❓</span>
        <span>Panduan</span>
      </button>

      <!-- Mode Navigation Switcher -->
      <div class="h-[44px] flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-full border border-slate-300/80 text-sm shadow-inner box-border">
        <a
          href="/"
          class="h-full flex items-center gap-1.5 px-3.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all text-xs font-semibold box-border"
        >
          <span>🔍</span>
          <span class="hidden sm:inline">Mode Eksplorasi</span>
        </a>
        <a
          href="/simulasi"
          class="h-full flex items-center gap-1.5 px-3.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all text-xs font-semibold box-border"
        >
          <span>🚀</span>
          <span class="hidden sm:inline">Mode Simulasi</span>
        </a>
        <a
          href="/kuis"
          class="h-full flex items-center gap-1.5 px-4 rounded-full bg-slate-900 text-white font-bold shadow-md text-xs transition-all box-border"
        >
          <span>🧩</span>
          <span>Kuis Game</span>
        </a>
      </div>
    </div>
  </header>

  <!-- MAIN PLAYGROUND -->
  <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
    <!-- INFO & PROGRESS BAR -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm backdrop-blur-sm">
      <div class="flex items-center gap-3">
        <div class="flex flex-col">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Status Penempatan</span>
          <span class="text-base font-bold text-slate-900">
            <span class="text-sky-600 font-extrabold">{totalPlaced}</span> / {quizItems.length} Perangkat Terpasang
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          onclick={initQuiz}
          class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:scale-95 text-slate-700 border border-slate-300 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span>🔄</span>
          <span>Ulangi Kuis</span>
        </button>

        <button
          type="button"
          onclick={checkAnswers}
          disabled={totalPlaced === 0}
          class="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-sky-600/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 cursor-pointer"
        >
          <span>✓</span>
          <span>Periksa Jawaban</span>
        </button>
      </div>
    </div>

    <!-- RESULT BANNER (IF CHECKED) -->
    {#if isChecked}
      <div
        class="p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-feedback-slide"
        style={score === quizItems.length
          ? 'background-color: #ecfdf5; border-color: #a7f3d0;'
          : 'background-color: #ffffff; border-color: #e2e8f0;'}
      >
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0 shadow-sm"
               style={score === quizItems.length ? 'background: #10b981; color: white;' : 'background: #0284c7; color: white;'}>
            {score === quizItems.length ? '🏆' : '🎯'}
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              {#if score === quizItems.length}
                <span class="text-emerald-600">Luar Biasa! Skor Sempurna!</span>
              {:else if score >= 6}
                <span class="text-sky-600">Bagus Sekali! Hampir Tuntas!</span>
              {:else}
                <span class="text-amber-600">Terus Coba & Pelajari Lagi!</span>
              {/if}
            </h2>
            <p class="text-xs text-slate-600 mt-0.5">
              Anda berhasil mengelompokkan <span class="font-bold text-slate-900">{score} dari {quizItems.length}</span> perangkat dengan tepat ({scorePercent}%).
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span class="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Skor Akhir</span>
            <span class="text-xl font-extrabold text-sky-600">{score} / {quizItems.length}</span>
          </div>
          <div class="px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span class="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Nilai</span>
            <span class="text-xl font-extrabold {scorePercent >= 80 ? 'text-emerald-600' : scorePercent >= 60 ? 'text-sky-600' : 'text-amber-600'}">
              {scorePercent}%
            </span>
          </div>
        </div>
      </div>

      <!-- PANEL RINGKASAN & PEMBAHASAN KONSEP ILMIAH (REVIEW SECTION) -->
      <section class="bg-white/95 rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col gap-4 animate-feedback-slide">
        <!-- Header Panel Pembahasan & Filter Cepat -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xl">📚</span>
              <h3 class="text-base font-bold text-slate-900">Pembahasan & Ulasan Konsep Ilmiah</h3>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              Analisis mendalam fungsi dan dasar sains komputer untuk setiap perangkat keras.
            </p>
          </div>

          <!-- Filter Cepat: Semua vs Hanya yang Salah -->
          <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200 text-xs">
            <button
              type="button"
              onclick={() => (reviewFilter = 'all')}
              class="px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer {reviewFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'}"
            >
              Semua Perangkat ({quizItems.length})
            </button>
            <button
              type="button"
              onclick={() => (reviewFilter = 'wrong')}
              class="px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 {reviewFilter === 'wrong'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'}"
            >
              <span>Hanya yang Salah</span>
              {#if wrongCount() > 0}
                <span class="px-1.5 py-0.2 rounded-full text-[10px] {reviewFilter === 'wrong' ? 'bg-white text-rose-700' : 'bg-rose-100 text-rose-800'}">
                  {wrongCount()}
                </span>
              {/if}
            </button>
          </div>
        </div>

        <!-- Daftar Kartu Pembahasan Konsep -->
        {#if filteredReviewList().length === 0}
          <div class="py-8 text-center bg-emerald-50/60 rounded-xl border border-emerald-200/70 p-4">
            <span class="text-2xl mb-1 block">🎉</span>
            <span class="text-sm font-bold text-emerald-800">Hebat! Tidak ada jawaban yang salah!</span>
            <p class="text-xs text-emerald-700 mt-1">Anda telah menguasai semua klasifikasi perangkat keras dengan sempurna.</p>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {#each filteredReviewList() as item (item.id)}
              <div
                class="p-4 rounded-xl border transition-all flex flex-col justify-between gap-2.5"
                class:bg-emerald-50={item.isCorrect}
                class:border-emerald-200={item.isCorrect}
                class:bg-rose-50={!item.isCorrect}
                class:border-rose-200={!item.isCorrect}
              >
                <!-- Header Kartu Pembahasan -->
                <div>
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div class="flex items-center gap-2">
                      <span class="text-2xl p-1.5 rounded-lg bg-white shadow-2xs">{item.icon}</span>
                      <div>
                        <h4 class="text-sm font-bold text-slate-900">{item.name}</h4>
                        <span class="text-[11px] font-semibold text-slate-500">Kategori Resmi: {item.correctCategory} Device</span>
                      </div>
                    </div>

                    <!-- Status Evaluasi -->
                    {#if item.isCorrect}
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                        ✓ TEPAT
                      </span>
                    {:else}
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 shrink-0">
                        ✗ KELIRU
                      </span>
                    {/if}
                  </div>

                  <!-- Rekap Status Penempatan -->
                  {#if !item.isCorrect}
                    <div class="mb-2 p-2 rounded-lg bg-white/80 border border-rose-200 text-[11px] leading-tight space-y-1">
                      <div class="text-rose-900">
                        <span class="font-bold">Jawaban Anda:</span> {item.placedCategory ? `${item.placedCategory} Device` : 'Belum Ditempatkan'}
                      </div>
                      <div class="text-emerald-900 font-semibold">
                        <span class="font-bold">Kategori Tepat:</span> {item.correctCategory} Device
                      </div>
                    </div>
                  {/if}

                  <!-- Teks Penjelasan Konsep Ilmiah Lengkap -->
                  <div class="text-xs leading-relaxed {item.isCorrect ? 'text-emerald-950' : 'text-rose-950'}">
                    <span class="font-bold block mb-0.5 text-slate-900">🔬 Dasar Konsep Ilmiah:</span>
                    <p class="font-medium bg-white/70 p-2 rounded-lg border {item.isCorrect ? 'border-emerald-100 text-emerald-900' : 'border-rose-100 text-rose-900'}">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </section>
    {/if}

    <!-- AREA ATAS: BANK KARTU PERANGKAT -->
    <section
      class="bg-white/95 rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-3 transition-colors"
      style={activeDropTarget === 'bank' ? 'border-color: #0284c7; background: #f0f9ff;' : ''}
      ondragover={(e) => handleDragOver(e, 'bank')}
      ondragleave={() => handleDragLeave('bank')}
      ondrop={(e) => handleDrop(e, 'bank')}
      role="region"
      aria-label="Bank Kartu Perangkat"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg">📦</span>
          <h2 class="font-bold text-sm sm:text-base text-slate-900">Bank Kartu Perangkat (Tarik ke Wadah Kategori Bawah)</h2>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
            {bankItems.length} tersisa
          </span>
        </div>
        <span class="text-xs text-slate-500 hidden sm:inline">💡 Sentuh atau drag kartu ke bawah</span>
      </div>

      <!-- Kartu-kartu dalam Bank -->
      <div class="min-h-[90px] p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-3 transition-all">
        {#if bankItems.length === 0}
          <div class="w-full text-center py-4 text-xs sm:text-sm text-slate-500 italic">
            🎉 Semua kartu telah ditempatkan ke dalam kategori! Klik tombol "Periksa Jawaban" di atas untuk melihat nilai.
          </div>
        {:else}
          {#each bankItems as item (item.id)}
            <div
              draggable="true"
              ondragstart={(e) => handleDragStart(e, item.id, null)}
              ondragend={handleDragEnd}
              class="group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-sky-400 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all select-none"
              class:opacity-40={draggedItemId === item.id}
            >
              <span class="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span class="font-semibold text-xs sm:text-sm text-slate-800">{item.name}</span>
              <button
                type="button"
                title="Tampilkan Hint Fungsi"
                onclick={(e) => {
                  e.stopPropagation();
                  showHintId = showHintId === item.id ? null : item.id;
                }}
                class="ml-1 text-slate-400 hover:text-sky-600 text-xs px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                ❓
              </button>

              <!-- Popover Hint -->
              {#if showHintId === item.id}
                <div class="absolute bottom-full left-0 mb-2 w-64 z-50 p-3 rounded-xl bg-white border border-sky-300 shadow-xl text-left text-xs text-slate-700">
                  <div class="font-bold text-sky-600 mb-1 flex items-center gap-1">
                    <span>💡 Petunjuk:</span>
                  </div>
                  <p class="leading-relaxed">{item.hint}</p>
                </div>
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    </section>

    <!-- AREA BAWAH: 4 DROP ZONE KATEGORI -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 flex-1">
      {#each categoryDefinitions as cat}
        {@const isDropActive = activeDropTarget === cat.id}
        {@const itemsInCat = categorySlots[cat.id]}

        <div
          ondragover={(e) => handleDragOver(e, cat.id)}
          ondragleave={() => handleDragLeave(cat.id)}
          ondrop={(e) => handleDrop(e, cat.id)}
          role="region"
          aria-label={cat.title}
          class="flex flex-col rounded-2xl border transition-all duration-200 p-4 bg-white shadow-sm min-h-[360px]"
          style={isDropActive
            ? `border-color: ${cat.color}; background-color: #f8fafc; transform: translateY(-2px); box-shadow: 0 10px 25px -5px ${cat.color}25;`
            : 'border-color: #e2e8f0;'}
        >
          <!-- Header Wadah -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{cat.icon}</span>
              <div>
                <h3 class="font-bold text-sm text-slate-900">{cat.title}</h3>
                <span class="text-[11px] text-slate-500 block">{cat.subtitle}</span>
              </div>
            </div>
            <span
              class="px-2.5 py-0.5 rounded-full text-xs font-bold border"
              style={`color: ${cat.color}; border-color: ${cat.color}40; background-color: ${cat.color}15;`}
            >
              {itemsInCat.length}
            </span>
          </div>

          <!-- Keterangan Singkat Kategori -->
          <p class="text-[11px] text-slate-500 mt-2 mb-3 leading-relaxed">
            {cat.desc}
          </p>

          <!-- Drop Slot Body -->
          <div
            class="flex-1 rounded-xl p-2.5 flex flex-col gap-2.5 transition-colors border border-dashed"
            style={isDropActive
              ? `border-color: ${cat.color}; background-color: ${cat.color}08;`
              : 'border-color: #cbd5e1; background-color: #f8fafc;'}
          >
            {#if itemsInCat.length === 0}
              <div class="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
                <span class="text-xl mb-1 opacity-60">🎯</span>
                <span>Tarik & Lepas kartu di sini</span>
              </div>
            {:else}
              {#each itemsInCat as item (item.id)}
                {@const isCorrect = item.correctCategory === cat.id}

                <div
                  draggable="true"
                  ondragstart={(e) => handleDragStart(e, item.id, cat.id)}
                  ondragend={handleDragEnd}
                  class="rounded-xl p-3 border shadow-sm transition-all select-none cursor-grab active:cursor-grabbing relative"
                  style={!isChecked
                    ? 'background-color: #ffffff; border-color: #cbd5e1;'
                    : isCorrect
                    ? 'background-color: #ecfdf5; border-color: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);'
                    : 'background-color: #fef2f2; border-color: #ef4444; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);'}
                  class:opacity-40={draggedItemId === item.id}
                >
                  <!-- Baris Atas Item -->
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <span class="text-xl">{item.icon}</span>
                      <span class="font-bold text-xs sm:text-sm text-slate-900">{item.name}</span>
                    </div>

                    <div class="flex items-center gap-1.5">
                      <!-- Badge Benar / Salah jika sudah diperiksa -->
                      {#if isChecked}
                        {#if isCorrect}
                          <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center gap-0.5">
                            ✓ BENAR
                          </span>
                        {:else}
                          <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-300 flex items-center gap-0.5">
                            ✗ SALAH
                          </span>
                        {/if}
                      {/if}

                      <!-- Tombol Kembalikan ke Bank -->
                      <button
                        type="button"
                        onclick={() => moveItem(item.id, 'bank')}
                        title="Keluarkan dari kotak ini"
                        class="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-slate-100 transition-colors text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <!-- Feedback Penjelasan Ilmiah Terstruktur saat Diperiksa -->
                  {#if isChecked}
                    <div
                      class="mt-2.5 p-2.5 rounded-xl border text-xs leading-relaxed animate-feedback-slide"
                      class:bg-emerald-50={isCorrect}
                      class:border-emerald-200={isCorrect}
                      class:text-emerald-950={isCorrect}
                      class:bg-rose-50={!isCorrect}
                      class:border-rose-200={!isCorrect}
                      class:text-rose-950={!isCorrect}
                    >
                      {#if isCorrect}
                        <div class="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                          <span class="text-sm">✅</span>
                          <span>Konsep Ilmiah Tepat:</span>
                        </div>
                        <p class="text-[11px] text-emerald-900 font-medium">
                          {item.explanation}
                        </p>
                      {:else}
                        <div class="space-y-1 mb-1.5 pb-1.5 border-b border-rose-200/80">
                          <div class="flex items-center gap-1 font-bold text-rose-800">
                            <span class="text-sm">⚠️</span>
                            <span>Evaluasi Jawaban:</span>
                          </div>
                          <div class="grid grid-cols-2 gap-1 text-[10px]">
                            <div class="bg-rose-100/80 px-2 py-1 rounded text-rose-900 font-semibold">
                              Jawaban Anda: <span class="underline font-bold">{cat.title}</span>
                            </div>
                            <div class="bg-emerald-100/90 px-2 py-1 rounded text-emerald-900 font-bold">
                              Kategori Tepat: <span class="underline">{item.correctCategory} Device</span>
                            </div>
                          </div>
                        </div>
                        <div class="text-[11px] text-rose-900 font-medium leading-normal">
                          <span class="font-bold text-rose-950">Penjelasan Konsep:</span> {item.explanation}
                        </div>
                      {/if}
                    </div>
                  {:else}
                    <!-- Petunjuk Singkat Saat Belum Diperiksa -->
                    <div class="mt-1.5 text-[10px] text-slate-500 flex items-center gap-1 truncate">
                      <span class="text-slate-400">💡</span>
                      <span class="truncate">{item.hint}</span>
                    </div>
                  {/if}
                </div>
              {/each}
            {/if}
          </div>
        </div>
      {/each}
    </section>
  </main>

  <!-- Educational Attribution Footer -->
  <footer class="mt-auto py-4 border-t border-slate-200/90 bg-white/70 backdrop-blur-sm px-4">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
      <div class="flex items-center gap-2">
        <img src="/images/Tutwuri_3.png" alt="Tut Wuri Handayani" class="h-6 w-auto object-contain" />
        <img src="/images/Logo_02.png" alt="Logo Pendidikan 2" class="h-6 w-auto object-contain" />
        <img src="/images/Logo_03.png" alt="Logo Pendidikan 3" class="h-6 w-auto object-contain" />
        <img src="/images/LogoSobatSMP2025.png" alt="Sobat SMP" class="h-6 w-auto max-w-[50px] object-contain" />
        <span class="font-medium text-slate-600 ml-1">Media Pembelajaran Informatika Interaktif</span>
      </div>
      <p class="text-slate-400">Direktorat SMP • Kemdikbudristek</p>
    </div>
  </footer>
</div>

<style>
  :global(html),
  :global(body) {
    overflow-y: auto !important;
    overflow-x: hidden;
    background-color: #f1f5f9;
  }

  @keyframes feedbackSlideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-feedback-slide {
    animation: feedbackSlideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    word-break: break-word;
    overflow-wrap: break-word;
  }
</style>
