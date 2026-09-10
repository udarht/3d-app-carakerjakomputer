<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, HTML } from '@threlte/extras';

  interactivity();

  let {
    position = [0, 0.5, 0] as [number, number, number],
    rotation = [0.4, 0, 0] as [number, number, number],
    autoRotate = true,
    showOverlay = true,
    ssdVariant,
    onVariantChange
  }: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    autoRotate?: boolean;
    showOverlay?: boolean;
    ssdVariant?: 'm2' | 'sata';
    onVariantChange?: (v: 'm2' | 'sata') => void;
  } = $props();

  let rotY = $state(-0.4);
  let isRotating = $state(autoRotate);
  let showDetails = $state(false);
  let localActiveTab = $state<'m2' | 'sata'>('m2');
  let activeTab = $derived(ssdVariant ?? localActiveTab);
  let hovered = $state(false);

  function setTab(tab: 'm2' | 'sata') {
    localActiveTab = tab;
    onVariantChange?.(tab);
  }

  useTask((delta) => {
    if (isRotating) {
      rotY += delta * 0.4;
    }
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
  {#if activeTab === 'm2'}
    <!-- M.2 NVMe PCIe SSD -->
    <T.Group position={[0, 0, 0]}>
      <!-- PCB Board -->
      <T.Mesh position={[0, 0, 0]}>
        <T.BoxGeometry args={[3.2, 0.08, 1.2]} />
        <T.MeshStandardMaterial
          color="#334155"
          roughness={0.5}
          metalness={0.15}
        />
      </T.Mesh>

      <!-- Gold Connector Pins -->
      <T.Mesh position={[1.65, 0, 0]}>
        <T.BoxGeometry args={[0.2, 0.06, 1.0]} />
        <T.MeshStandardMaterial color="#f59e0b" metalness={0.2} roughness={0.45} />
      </T.Mesh>

      <!-- M-Key Notch -->
      <T.Mesh position={[1.65, 0, 0.2]}>
        <T.BoxGeometry args={[0.25, 0.1, 0.15]} />
        <T.MeshStandardMaterial color="#1e293b" roughness={0.5} />
      </T.Mesh>

      <!-- Screw Notch -->
      <T.Mesh position={[-1.58, 0, 0]}>
        <T.CylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
        <T.MeshStandardMaterial color="#94a3b8" metalness={0.2} roughness={0.5} />
      </T.Mesh>

      <!-- Heatsink Plate -->
      <T.Mesh position={[0, showDetails ? 0.45 : 0.12, 0]}>
        <T.BoxGeometry args={[2.7, 0.15, 1.15]} />
        <T.MeshStandardMaterial
          color={showDetails ? '#64748b' : '#475569'}
          metalness={0.2}
          roughness={0.5}
        />
      </T.Mesh>

      <!-- Heatsink Fins -->
      {#each [-0.35, -0.15, 0.05, 0.25] as z}
        <T.Mesh position={[0, (showDetails ? 0.45 : 0.12) + 0.1, z]}>
          <T.BoxGeometry args={[2.6, 0.06, 0.08]} />
          <T.MeshStandardMaterial color="#334155" metalness={0.2} roughness={0.5} />
        </T.Mesh>
      {/each}

      <!-- 3D NAND Flash Chips -->
      <T.Mesh position={[-0.7, 0.08, 0]}>
        <T.BoxGeometry args={[0.72, 0.06, 0.72]} />
        <T.MeshStandardMaterial
          color="#1e293b"
          roughness={0.5}
          metalness={0.2}
          emissive={showDetails ? '#0284c7' : '#000000'}
          emissiveIntensity={showDetails ? 0.5 : 0}
        />
      </T.Mesh>

      <T.Mesh position={[0.2, 0.08, 0]}>
        <T.BoxGeometry args={[0.72, 0.06, 0.72]} />
        <T.MeshStandardMaterial
          color="#1e293b"
          roughness={0.5}
          metalness={0.2}
          emissive={showDetails ? '#0284c7' : '#000000'}
          emissiveIntensity={showDetails ? 0.5 : 0}
        />
      </T.Mesh>

      <!-- PCIe Controller IC -->
      <T.Mesh position={[0.95, 0.08, 0]}>
        <T.BoxGeometry args={[0.48, 0.08, 0.48]} />
        <T.MeshStandardMaterial
          color="#94a3b8"
          metalness={0.2}
          roughness={0.5}
          emissive={showDetails ? '#ec4899' : '#000000'}
          emissiveIntensity={showDetails ? 0.4 : 0}
        />
      </T.Mesh>

      <!-- LED -->
      <T.Mesh position={[-1.2, 0.1, -0.4]}>
        <T.SphereGeometry args={[0.035, 16, 16]} />
        <T.MeshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2.0} roughness={0.4} />
      </T.Mesh>
    </T.Group>
  {:else}
    <!-- SSD SATA 2.5 Inci -->
    <T.Group position={[0, 0, 0]}>
      <!-- Casing -->
      <T.Mesh position={[0, 0.15, 0]}>
        <T.BoxGeometry args={[2.7, 0.35, 3.8]} />
        <T.MeshStandardMaterial
          color="#475569"
          metalness={0.2}
          roughness={0.5}
        />
      </T.Mesh>

      <!-- Faceplate -->
      <T.Mesh position={[0, 0.33, 0]}>
        <T.BoxGeometry args={[2.3, 0.02, 3.2]} />
        <T.MeshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.1} />
      </T.Mesh>

      <!-- Cyan Accent -->
      <T.Mesh position={[0, 0.345, 0]}>
        <T.BoxGeometry args={[2.0, 0.015, 0.4]} />
        <T.MeshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.6} roughness={0.4} />
      </T.Mesh>

      <!-- SATA Connector -->
      <T.Mesh position={[-0.3, 0.1, 1.95]}>
        <T.BoxGeometry args={[1.5, 0.2, 0.2]} />
        <T.MeshStandardMaterial color="#334155" roughness={0.6} />
      </T.Mesh>
      <T.Mesh position={[-0.3, 0.1, 2.05]}>
        <T.BoxGeometry args={[1.3, 0.08, 0.05]} />
        <T.MeshStandardMaterial color="#f59e0b" metalness={0.2} roughness={0.45} />
      </T.Mesh>
    </T.Group>
  {/if}
</T.Group>

{#if showOverlay}
  <HTML position={[position[0], position[1] + 1.25, position[2]]} center pointerEvents="auto">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="ssd-overlay"
      onpointerdown={(e) => e.stopPropagation()}
      onclick={(e) => e.stopPropagation()}
    >
      <div class="tab-switch">
        <button
          type="button"
          class="tab-btn"
          class:active={activeTab === 'm2'}
          onpointerdown={(e) => e.stopPropagation()}
          onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTab('m2');
          }}
        >
          ⚡ M.2 NVMe
        </button>
        <button
          type="button"
          class="tab-btn"
          class:active={activeTab === 'sata'}
          onpointerdown={(e) => e.stopPropagation()}
          onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTab('sata');
          }}
        >
          📦 SATA 2.5"
        </button>
      </div>

      {#if showDetails}
        <div class="detail-box">
          <span class="detail-title">
            {activeTab === 'm2' ? '⚡ M.2 NVMe PCIe SSD' : '📦 2.5" SATA III SSD'}
          </span>
          <span class="detail-desc">
            {activeTab === 'm2'
              ? '3D NAND Flash • PCIe Controller • M-Key 32Gbps+'
              : 'Enclosure Logam • SATA 6Gbps • Kompatibilitas Universal'}
          </span>
          <span class="detail-hint">Klik objek 3D untuk menutup detail</span>
        </div>
      {/if}
    </div>
  </HTML>
{/if}

<style>
  .ssd-overlay {
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
    font-size: 0.75rem;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .tab-btn.active {
    background: #0284c7;
    color: #ffffff;
    box-shadow: 0 0 10px rgba(56, 189, 248, 0.6);
  }
  .tab-btn:hover:not(.active) {
    color: #f8fafc;
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
