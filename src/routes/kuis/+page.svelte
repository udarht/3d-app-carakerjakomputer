<script lang="ts">
  import { onMount } from 'svelte';
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
</script>

<svelte:head>
  <title>Kuis Interaktif Perangkat Keras | Drag & Drop Game</title>
  <meta name="description" content="Uji pemahaman klasifikasi perangkat keras komputer (Input, Process, Storage, Output) dengan kuis drag and drop interaktif." />
</svelte:head>

<div class="min-h-screen bg-slate-100 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
  <!-- TOP NAVIGATION HEADER (Light theme with subtle blur and border, consistent with 3D Viewer) -->
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
    <div class="flex items-center gap-3">
      <!-- Education Logos Strip -->
      <div class="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200/80 rounded-full px-2.5 py-1 shadow-sm">
        <img src="/images/Tutwuri_3.png" alt="Tut Wuri Handayani" class="h-7 w-auto object-contain hover:scale-110 transition-transform" title="Tut Wuri Handayani" />
        <img src="/images/Logo_02.png" alt="Logo Pendidikan 2" class="h-7 w-auto object-contain hover:scale-110 transition-transform" />
        <img src="/images/Logo_03.png" alt="Logo Pendidikan 3" class="h-7 w-auto object-contain hover:scale-110 transition-transform" />
        <img src="/images/LogoSobatSMP2025.png" alt="Sobat SMP" class="h-7 w-auto max-w-[60px] object-contain hover:scale-110 transition-transform" title="Sobat SMP 2025" />
      </div>
      <div class="hidden sm:block w-[1px] h-6 bg-slate-300"></div>
      <div>
        <h1 class="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
          KUIS DRAG & DROP <span class="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-semibold">Game Edukasi</span>
        </h1>
        <p class="text-xs text-slate-500">Kelompokkan 9 perangkat ke kotak kategori yang tepat!</p>
      </div>
    </div>

    <!-- Mode Navigation Switcher -->
    <div class="flex items-center gap-1.5 bg-slate-200/70 p-1.5 rounded-full border border-slate-300/80 text-sm shadow-inner">
      <a
        href="/"
        class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all text-xs font-semibold"
      >
        <span>🔍</span>
        <span class="hidden sm:inline">Mode Eksplorasi</span>
      </a>
      <a
        href="/simulasi"
        class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all text-xs font-semibold"
      >
        <span>🚀</span>
        <span class="hidden sm:inline">Mode Simulasi</span>
      </a>
      <a
        href="/kuis"
        class="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold shadow-md text-xs transition-all"
      >
        <span>🧩</span>
        <span>Kuis Game</span>
      </a>
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
        class="p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
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

                  <!-- Feedback Penjelasan jika Salah atau Benar -->
                  {#if isChecked}
                    <div class="mt-2 pt-2 border-t text-[11px] leading-relaxed"
                         style={isCorrect ? 'border-color: #a7f3d0; color: #065f46;' : 'border-color: #fecaca; color: #991b1b;'}>
                      {#if !isCorrect}
                        <div class="font-bold text-rose-700 mb-0.5">
                          ⚠️ Seharusnya: {item.correctCategory} Device
                        </div>
                      {/if}
                      <p>{item.explanation}</p>
                    </div>
                  {:else}
                    <!-- Petunjuk Singkat Saat Belum Diperiksa -->
                    <div class="mt-1 text-[10px] text-slate-500 truncate">
                      {item.hint}
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
</style>
