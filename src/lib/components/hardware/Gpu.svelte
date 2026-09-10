<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, HTML } from '@threlte/extras';

  interactivity();

  let {
    position = [0, 0.5, 0] as [number, number, number],
    rotation = [0.35, 0, 0] as [number, number, number],
    autoRotate = true,
    showOverlay = true,
    gpuVariant,
    onVariantChange
  }: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    autoRotate?: boolean;
    showOverlay?: boolean;
    gpuVariant?: 'integrated' | 'dedicated';
    onVariantChange?: (v: 'integrated' | 'dedicated') => void;
  } = $props();

  let rotY = $state(-0.3);
  let isRotating = $state(autoRotate);
  let showDetails = $state(false);
  let localActiveVariant = $state<'integrated' | 'dedicated'>('dedicated');
  let activeVariant = $derived(gpuVariant ?? localActiveVariant);
  let hovered = $state(false);
  let fanRot = $state(0);

  function setVariant(variant: 'integrated' | 'dedicated') {
    localActiveVariant = variant;
    onVariantChange?.(variant);
  }

  useTask((delta) => {
    if (isRotating) {
      rotY += delta * 0.4;
    }
    fanRot += delta * 8.0;
  });

  function toggleClick(e: any) {
    e.stopPropagation();
    showDetails = !showDetails;
    isRotating = !showDetails;
  }
</script>

<T.Group
  {position}
  rotation={[rotation[0], rotation[1] + rotY, rotation[2]]}
  scale={hovered ? 1.05 : 1}
  onpointerenter={() => (hovered = true)}
  onpointerleave={() => (hovered = false)}
  onclick={toggleClick}
>
  {#if activeVariant === 'integrated'}
    <!-- ============================================== -->
    <!-- VARIAN 1: INTEGRATED GPU (iGPU) -->
    <!-- Bentuk chip persegi ringkas: PCB hijau/hitam, silicon die berkilau di tengah, deretan pin emas di bawah -->
    <!-- ============================================== -->
    <T.Group position={[0, 0, 0]}>
      <!-- 1. PCB Substrate (Hijau Zamrud Bersih / Gelap Elegan) -->
      <T.Mesh position={[0, 0, 0]}>
        <T.BoxGeometry args={[2.5, 0.08, 2.5]} />
        <T.MeshStandardMaterial
          color="#064e3b"
          roughness={0.4}
          metalness={0.2}
        />
      </T.Mesh>

      <!-- 2. Bottom Gold Pin Grid Array / Contact Pads -->
      <T.Mesh position={[0, -0.045, 0]}>
        <T.BoxGeometry args={[2.2, 0.01, 2.2]} />
        <T.MeshStandardMaterial
          color="#f59e0b"
          roughness={0.35}
          metalness={0.3}
        />
      </T.Mesh>

      <!-- 3. Central Shiny Silicon Die (Kepingan Silikon Mengkilap) -->
      <T.Mesh position={[0, 0.08, 0]}>
        <T.BoxGeometry args={[1.3, 0.08, 1.3]} />
        <T.MeshStandardMaterial
          color="#1e293b"
          roughness={0.2}
          metalness={0.6}
          emissive={showDetails ? '#0284c7' : '#000000'}
          emissiveIntensity={showDetails ? 0.35 : 0}
        />
      </T.Mesh>

      <!-- Silicon Die Reflective Core Accent -->
      <T.Mesh position={[0, 0.125, 0]}>
        <T.BoxGeometry args={[1.05, 0.01, 1.05]} />
        <T.MeshStandardMaterial
          color="#38bdf8"
          roughness={0.15}
          metalness={0.7}
          emissive="#38bdf8"
          emissiveIntensity={0.2}
        />
      </T.Mesh>

      <!-- 4. Corner Alignment Mark (Segitiga Emas Penanda Sudut) -->
      <T.Mesh position={[-1.05, 0.045, -1.05]} rotation.y={Math.PI / 4}>
        <T.ConeGeometry args={[0.1, 0.015, 3]} />
        <T.MeshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.4}
        />
      </T.Mesh>

      <!-- 5. Surrounding SMD Capacitors & Resistors (Komponen Mikro Pelindung) -->
      {#each [-0.85, 0.85] as x}
        {#each [-0.5, 0, 0.5] as z}
          <T.Mesh position={[x, 0.05, z]}>
            <T.BoxGeometry args={[0.12, 0.03, 0.2]} />
            <T.MeshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.2} />
          </T.Mesh>
        {/each}
      {/each}

      {#each [-0.5, 0, 0.5] as x}
        {#each [-0.85, 0.85] as z}
          <T.Mesh position={[x, 0.05, z]}>
            <T.BoxGeometry args={[0.2, 0.03, 0.12]} />
            <T.MeshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.2} />
          </T.Mesh>
        {/each}
      {/each}
    </T.Group>
  {:else}
    <!-- ============================================== -->
    <!-- VARIAN 2: DEDICATED GPU (dGPU) -->
    <!-- Bentuk kartu grafis mandiri: PCB persegi panjang horizontal, PCIe connector di bawah, shroud perak cerah, 2 kipas berputar -->
    <!-- ============================================== -->
    <T.Group position={[0, 0, 0]}>
      <!-- 1. Main PCB Board Horizontal (Papan sirkuit kartu grafis) -->
      <T.Mesh position={[0, 0, 0]}>
        <T.BoxGeometry args={[4.4, 0.09, 2.2]} />
        <T.MeshStandardMaterial
          color="#1e293b"
          roughness={0.4}
          metalness={0.2}
        />
      </T.Mesh>

      <!-- 2. PCIe Gold Connector Pins (Sisi Bawah Depan / Slot PCIe x16) -->
      <T.Mesh position={[-0.2, -0.01, 1.15]}>
        <T.BoxGeometry args={[2.5, 0.07, 0.16]} />
        <T.MeshStandardMaterial
          color="#f59e0b"
          roughness={0.4}
          metalness={0.2}
        />
      </T.Mesh>

      <!-- PCIe Key Notch -->
      <T.Mesh position={[-0.6, -0.01, 1.15]}>
        <T.BoxGeometry args={[0.1, 0.08, 0.18]} />
        <T.MeshStandardMaterial color="#0f172a" roughness={0.6} />
      </T.Mesh>

      <!-- 3. Rear Metal I/O Bracket (Braket Belakang Port Display) -->
      <T.Mesh position={[-2.24, 0.35, 0]}>
        <T.BoxGeometry args={[0.08, 1.1, 2.3]} />
        <T.MeshStandardMaterial
          color="#cbd5e1"
          roughness={0.4}
          metalness={0.2}
        />
      </T.Mesh>

      <!-- Display Ports on I/O Bracket (HDMI / DP) -->
      {#each [-0.5, 0.1, 0.7] as z}
        <T.Mesh position={[-2.29, 0.32, z]}>
          <T.BoxGeometry args={[0.04, 0.14, 0.32]} />
          <T.MeshStandardMaterial color="#475569" roughness={0.5} metalness={0.3} />
        </T.Mesh>
      {/each}

      <!-- 4. Backplate Penguat (Sisi Bawah PCB) -->
      <T.Mesh position={[0, -0.06, 0]}>
        <T.BoxGeometry args={[4.2, 0.03, 2.1]} />
        <T.MeshStandardMaterial
          color="#334155"
          roughness={0.4}
          metalness={0.2}
        />
      </T.Mesh>

      <!-- 5. Heatsink Aluminum Fin Array (Sirip Pendingin Metalik) -->
      <T.Mesh position={[0.05, 0.2, 0]}>
        <T.BoxGeometry args={[3.8, 0.3, 2.05]} />
        <T.MeshStandardMaterial
          color="#94a3b8"
          roughness={0.4}
          metalness={0.2}
        />
      </T.Mesh>

      <!-- Copper Heatpipes Accents (Pipa Tembaga Pendingin) -->
      {#each [-0.4, 0.4] as z}
        <T.Mesh position={[0.1, 0.2, z]} rotation.z={Math.PI / 2}>
          <T.CylinderGeometry args={[0.06, 0.06, 3.6, 16]} />
          <T.MeshStandardMaterial color="#d97706" roughness={0.3} metalness={0.5} />
        </T.Mesh>
      {/each}

      <!-- 6. Cooler Shroud Bodi Depan (Abu-abu cerah/perak metalik bersih) -->
      <T.Mesh position={[0.05, 0.44, 0]}>
        <T.BoxGeometry args={[4.1, 0.18, 2.15]} />
        <T.MeshStandardMaterial
          color="#e2e8f0"
          roughness={0.4}
          metalness={0.2}
        />
      </T.Mesh>

      <!-- Shroud Geometric Sporty Inset / Dark Accents -->
      <T.Mesh position={[0.05, 0.535, 0]}>
        <T.BoxGeometry args={[3.9, 0.015, 2.0]} />
        <T.MeshStandardMaterial color="#475569" roughness={0.4} metalness={0.2} />
      </T.Mesh>

      <!-- Cyber Neon Accent Stripe on Top Edge -->
      <T.Mesh position={[0.05, 0.45, -1.06]}>
        <T.BoxGeometry args={[3.0, 0.06, 0.03]} />
        <T.MeshStandardMaterial
          color="#0284c7"
          emissive="#38bdf8"
          emissiveIntensity={0.8}
          roughness={0.3}
        />
      </T.Mesh>

      <!-- 8-Pin PCIe Power Connector on Top Right -->
      <T.Mesh position={[1.6, 0.46, -0.9]}>
        <T.BoxGeometry args={[0.5, 0.2, 0.25]} />
        <T.MeshStandardMaterial color="#0f172a" roughness={0.6} />
      </T.Mesh>

      <!-- 7. Dual Cooling Fans (2 Silinder Kipas Pendingin Berputar) -->
      <!-- Fan 1 (Kiri) -->
      <T.Group position={[-0.95, 0.54, 0]} rotation.y={fanRot}>
        <!-- Fan Center Hub -->
        <T.Mesh position={[0, 0.02, 0]}>
          <T.CylinderGeometry args={[0.3, 0.3, 0.07, 24]} />
          <T.MeshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.3} />
        </T.Mesh>
        <!-- Center Logo Badge -->
        <T.Mesh position={[0, 0.06, 0]}>
          <T.CylinderGeometry args={[0.18, 0.18, 0.01, 24]} />
          <T.MeshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.5} roughness={0.4} />
        </T.Mesh>
        <!-- Fan Blades (8 Bilah Kipas Aerodinamis) -->
        {#each [0, 45, 90, 135, 180, 225, 270, 315] as angle}
          <T.Mesh
            position={[0, 0.01, 0]}
            rotation.y={(angle * Math.PI) / 180}
            rotation.z={0.15}
          >
            <T.BoxGeometry args={[0.75, 0.02, 0.18]} />
            <T.MeshStandardMaterial color="#334155" roughness={0.4} metalness={0.2} />
          </T.Mesh>
        {/each}
      </T.Group>

      <!-- Fan 1 Outer Ring Frame -->
      <T.Mesh position={[-0.95, 0.54, 0]}>
        <T.RingGeometry args={[0.78, 0.88, 32]} />
        <T.MeshBasicMaterial color="#94a3b8" />
      </T.Mesh>

      <!-- Fan 2 (Kanan) -->
      <T.Group position={[1.05, 0.54, 0]} rotation.y={fanRot}>
        <!-- Fan Center Hub -->
        <T.Mesh position={[0, 0.02, 0]}>
          <T.CylinderGeometry args={[0.3, 0.3, 0.07, 24]} />
          <T.MeshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.3} />
        </T.Mesh>
        <!-- Center Logo Badge -->
        <T.Mesh position={[0, 0.06, 0]}>
          <T.CylinderGeometry args={[0.18, 0.18, 0.01, 24]} />
          <T.MeshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.5} roughness={0.4} />
        </T.Mesh>
        <!-- Fan Blades -->
        {#each [0, 45, 90, 135, 180, 225, 270, 315] as angle}
          <T.Mesh
            position={[0, 0.01, 0]}
            rotation.y={(angle * Math.PI) / 180}
            rotation.z={0.15}
          >
            <T.BoxGeometry args={[0.75, 0.02, 0.18]} />
            <T.MeshStandardMaterial color="#334155" roughness={0.4} metalness={0.2} />
          </T.Mesh>
        {/each}
      </T.Group>

      <!-- Fan 2 Outer Ring Frame -->
      <T.Mesh position={[1.05, 0.54, 0]}>
        <T.RingGeometry args={[0.78, 0.88, 32]} />
        <T.MeshBasicMaterial color="#94a3b8" />
      </T.Mesh>
    </T.Group>
  {/if}
</T.Group>

<!-- ============================================== -->
<!-- FLOATING PILL BUTTON SWITCHER (PERSIS SEPERTI SSD) -->
<!-- ============================================== -->
{#if showOverlay}
  <HTML position={[position[0], position[1] + 1.35, position[2]]} center pointerEvents="auto">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="gpu-overlay"
      onpointerdown={(e) => e.stopPropagation()}
      onclick={(e) => e.stopPropagation()}
    >
      <div class="tab-switch">
        <button
          type="button"
          class="tab-btn"
          class:active={activeVariant === 'integrated'}
          onpointerdown={(e) => e.stopPropagation()}
          onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setVariant('integrated');
          }}
        >
          🧩 Integrated (iGPU)
        </button>
        <button
          type="button"
          class="tab-btn"
          class:active={activeVariant === 'dedicated'}
          onpointerdown={(e) => e.stopPropagation()}
          onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setVariant('dedicated');
          }}
        >
          🎮 Dedicated (dGPU)
        </button>
      </div>

      {#if showDetails}
        <div class="detail-box">
          <span class="detail-title">
            {activeVariant === 'integrated'
              ? '🧩 Integrated GPU (iGPU)'
              : '🎮 Dedicated GPU (dGPU)'}
          </span>
          <span class="detail-desc">
            {activeVariant === 'integrated'
              ? 'Menyatu dalam CPU/SoC • Berbagi Memori RAM • Hemat Daya Efisien'
              : 'Kartu Ekspansi PCIe x16 • VRAM Mandiri GDDR6 • Dual Fan Cooling Aktif'}
          </span>
          <span class="detail-hint">Klik objek 3D untuk menutup detail</span>
        </div>
      {/if}
    </div>
  </HTML>
{/if}

<style>
  .gpu-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    user-select: none;
  }
  .tab-switch {
    display: flex;
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(2, 132, 199, 0.5);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    border-radius: 9999px;
    padding: 3px;
    gap: 4px;
    pointer-events: auto;
  }
  .tab-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0 16px;
    min-height: 45px;
    min-width: 45px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s;
    box-sizing: border-box;
  }
  .tab-btn.active {
    background: #0284c7;
    color: #ffffff;
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.6);
  }
  .tab-btn:hover:not(.active) {
    color: #f8fafc;
    background: rgba(255, 255, 255, 0.05);
  }
  .detail-box {
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid #0284c7;
    box-shadow: 0 4px 20px rgba(2, 132, 199, 0.4);
    border-radius: 10px;
    padding: 8px 14px;
    color: #f8fafc;
    font-family: system-ui, sans-serif;
    font-size: 0.78rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    pointer-events: none;
    white-space: nowrap;
    animation: fadeIn 0.2s ease-out;
  }
  .detail-title {
    font-weight: 700;
    color: #38bdf8;
  }
  .detail-desc {
    font-size: 0.7rem;
    color: #cbd5e1;
  }
  .detail-hint {
    font-size: 0.65rem;
    color: #94a3b8;
    margin-top: 2px;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
