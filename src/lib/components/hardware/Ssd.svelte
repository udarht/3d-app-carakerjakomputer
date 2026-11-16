<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, HTML, RoundedBoxGeometry } from '@threlte/extras';
  import {
    getChipMarkingTexture,
    getGoldPinsTexture,
    getPcbCircuitTexture,
    getSsdLabelTexture
  } from '$lib/utils/textures';

  interactivity();

  let {
    position = [0, 0.55, 0] as [number, number, number],
    rotation = [0.38, 0, 0] as [number, number, number],
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
  let isPaused = $state(false);
  let showDetails = $state(false);
  let localActiveTab = $state<'m2' | 'sata'>('m2');
  let activeTab = $derived(ssdVariant ?? localActiveTab);
  let hovered = $state(false);

  const pcbTex = getPcbCircuitTexture('#0f172a', '#0284c7');
  const goldPinsTex = getGoldPinsTexture(28);
  const nandTex = getChipMarkingTexture('SAMSUNG', '3D V-NAND', '176-LAYER TLC');
  const ctrlTex = getChipMarkingTexture('CONTROLLER', 'NVMe Gen4', '8-CHANNEL ARM');
  const dramTex = getChipMarkingTexture('DRAM CACHE', 'LPDDR4X', '2GB BUFFER');
  const m2LabelTex = getSsdLabelTexture('m2');
  const sataLabelTex = getSsdLabelTexture('sata');

  function setTab(tab: 'm2' | 'sata') {
    localActiveTab = tab;
    onVariantChange?.(tab);
  }

  useTask((delta) => {
    if (autoRotate && !isPaused) {
      rotY += delta * 0.4;
    }
  });

  function toggleClick(e: any) {
    e.stopPropagation();
    showDetails = !showDetails;
    isPaused = showDetails;
  }
</script>

<T.Group
  {position}
  rotation={[rotation[0], rotation[1] + rotY, rotation[2]]}
  scale={hovered ? 1.04 : 1}
  onpointerenter={() => (hovered = true)}
  onpointerleave={() => (hovered = false)}
  onclick={toggleClick}
>
  {#if activeTab === 'm2'}
    <!-- ============================================== -->
    <!-- VARIAN 1: M.2 2280 NVMe PCIe 4.0 x4 SSD -->
    <!-- ============================================== -->
    <T.Group position={[0, 0, 0]}>
      <!-- 1. M.2 2280 Matte Black PCB Board -->
      <T.Mesh position={[0, 0, 0]} castShadow receiveShadow>
        <RoundedBoxGeometry args={[3.4, 0.065, 1.15]} radius={0.015} smoothness={3} />
        <T.MeshPhysicalMaterial
          map={pcbTex}
          color="#0f172a"
          roughness={0.42}
          metalness={0.22}
          clearcoat={0.25}
        />
      </T.Mesh>

      <!-- 2. M-Key Gold Edge Connector Fingers (Right End) -->
      <!-- Main Pin Bank -->
      <T.Mesh position={[1.72, 0, -0.14]}>
        <T.BoxGeometry args={[0.22, 0.055, 0.68]} />
        <T.MeshStandardMaterial map={goldPinsTex} color="#fbbf24" metalness={0.9} roughness={0.2} />
      </T.Mesh>
      <!-- 5-Pin M-Key Segment -->
      <T.Mesh position={[1.72, 0, 0.38]}>
        <T.BoxGeometry args={[0.22, 0.055, 0.22]} />
        <T.MeshStandardMaterial map={goldPinsTex} color="#fbbf24" metalness={0.9} roughness={0.2} />
      </T.Mesh>
      <!-- M-Key Cutout Gap -->
      <T.Mesh position={[1.73, 0, 0.23]}>
        <T.BoxGeometry args={[0.25, 0.08, 0.09]} />
        <T.MeshStandardMaterial color="#020617" roughness={0.9} />
      </T.Mesh>

      <!-- 3. Copper-Plated Half-Moon M.2 Mounting Standoff Ring (Left End) -->
      <T.Mesh position={[-1.68, 0, 0]}>
        <T.CylinderGeometry args={[0.14, 0.14, 0.07, 24]} />
        <T.MeshStandardMaterial color="#f59e0b" metalness={0.88} roughness={0.22} />
      </T.Mesh>
      <T.Mesh position={[-1.71, 0, 0]}>
        <T.CylinderGeometry args={[0.09, 0.09, 0.08, 24]} />
        <T.MeshStandardMaterial color="#020617" roughness={0.9} />
      </T.Mesh>

      <!-- 4. Internal Chips: 2x 3D V-NAND Flash + DRAM Cache + PCIe Controller -->
      <!-- NAND Chip 1 (Left) -->
      <T.Mesh position={[-0.95, 0.058, 0]} castShadow>
        <RoundedBoxGeometry args={[0.82, 0.055, 0.82]} radius={0.01} smoothness={2} />
        <T.MeshStandardMaterial
          map={nandTex}
          color="#18181b"
          roughness={0.35}
          metalness={0.25}
          emissive={showDetails ? '#0284c7' : '#000000'}
          emissiveIntensity={showDetails ? 0.45 : 0}
        />
      </T.Mesh>

      <!-- NAND Chip 2 (Center) -->
      <T.Mesh position={[-0.02, 0.058, 0]} castShadow>
        <RoundedBoxGeometry args={[0.82, 0.055, 0.82]} radius={0.01} smoothness={2} />
        <T.MeshStandardMaterial
          map={nandTex}
          color="#18181b"
          roughness={0.35}
          metalness={0.25}
          emissive={showDetails ? '#0284c7' : '#000000'}
          emissiveIntensity={showDetails ? 0.45 : 0}
        />
      </T.Mesh>

      <!-- LPDDR4 DRAM Cache Chip -->
      <T.Mesh position={[0.68, 0.054, -0.22]} castShadow>
        <RoundedBoxGeometry args={[0.38, 0.05, 0.42]} radius={0.008} smoothness={2} />
        <T.MeshStandardMaterial
          map={dramTex}
          color="#1e293b"
          roughness={0.35}
          metalness={0.35}
        />
      </T.Mesh>

      <!-- Nickel-Capped PCIe 4.0 NVMe Controller IC (Near Connector) -->
      <T.Mesh position={[1.18, 0.062, 0.06]} castShadow>
        <RoundedBoxGeometry args={[0.52, 0.065, 0.52]} radius={0.01} smoothness={3} />
        <T.MeshPhysicalMaterial
          map={ctrlTex}
          color="#cbd5e1"
          metalness={0.82}
          roughness={0.24}
          clearcoat={0.3}
          emissive={showDetails ? '#ec4899' : '#000000'}
          emissiveIntensity={showDetails ? 0.35 : 0}
        />
      </T.Mesh>

      <!-- Activity Status SMD LED -->
      <T.Mesh position={[-1.48, 0.05, -0.42]}>
        <T.SphereGeometry args={[0.032, 16, 16]} />
        <T.MeshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={2.0}
          roughness={0.2}
        />
      </T.Mesh>

      <!-- 5. Extruded Aluminum Heatsink & Branding Plate (Lifts when showDetails is active) -->
      <T.Group position={[0.02, showDetails ? 0.52 : 0.14, 0]}>
        <!-- Silicone Thermal Pad Underneath Heatsink -->
        <T.Mesh position={[0, -0.052, 0]}>
          <T.BoxGeometry args={[2.82, 0.02, 1.02]} />
          <T.MeshStandardMaterial color="#38bdf8" roughness={0.6} transparent opacity={0.85} />
        </T.Mesh>

        <!-- Anodized Aluminum Heatsink Body -->
        <T.Mesh castShadow receiveShadow>
          <RoundedBoxGeometry args={[2.92, 0.1, 1.1]} radius={0.02} smoothness={3} />
          <T.MeshPhysicalMaterial
            color="#1e293b"
            metalness={0.85}
            roughness={0.26}
            clearcoat={0.25}
          />
        </T.Mesh>

        <!-- Longitudinal Cooling Fins -->
        {#each [-0.42, -0.28, 0.28, 0.42] as fz}
          <T.Mesh position={[0, 0.065, fz]} castShadow>
            <T.BoxGeometry args={[2.86, 0.045, 0.05]} />
            <T.MeshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
          </T.Mesh>
        {/each}

        <!-- Center Product Spec Label Plate -->
        <T.Mesh position={[0, 0.055, 0]} rotation.x={-Math.PI / 2}>
          <T.PlaneGeometry args={[2.3, 0.46]} />
          <T.MeshStandardMaterial map={m2LabelTex} roughness={0.35} metalness={0.2} />
        </T.Mesh>
      </T.Group>
    </T.Group>
  {:else}
    <!-- ============================================== -->
    <!-- VARIAN 2: 2.5" SATA III SOLID STATE DRIVE -->
    <!-- ============================================== -->
    <T.Group position={[0, 0, 0]}>
      <!-- 1. Bottom Aluminum Tray Chassis -->
      <T.Mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <RoundedBoxGeometry args={[2.72, 0.16, 3.82]} radius={0.04} smoothness={4} />
        <T.MeshPhysicalMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </T.Mesh>

      <!-- Side Brass Mounting Screw Inserts -->
      {#each [-1.37, 1.37] as x}
        {#each [-1.35, 1.35] as z}
          <T.Mesh position={[x, 0.08, z]} rotation.z={Math.PI / 2}>
            <T.CylinderGeometry args={[0.045, 0.045, 0.02, 16]} />
            <T.MeshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.25} />
          </T.Mesh>
        {/each}
      {/each}

      <!-- 2. Internal Compact SATA PCB & NAND Chips (Visible when showDetails is active) -->
      <T.Group position={[0, 0.17, 0.35]}>
        <T.Mesh>
          <RoundedBoxGeometry args={[2.35, 0.04, 2.6]} radius={0.015} smoothness={2} />
          <T.MeshStandardMaterial map={pcbTex} color="#065f46" roughness={0.4} />
        </T.Mesh>
        {#each [-0.65, 0.65] as nx}
          {#each [-0.5, 0.35] as nz}
            <T.Mesh position={[nx, 0.035, nz]}>
              <T.BoxGeometry args={[0.62, 0.04, 0.62]} />
              <T.MeshStandardMaterial
                map={nandTex}
                color="#18181b"
                roughness={0.35}
                emissive={showDetails ? '#0284c7' : '#000000'}
                emissiveIntensity={showDetails ? 0.45 : 0}
              />
            </T.Mesh>
          {/each}
        {/each}
        <!-- SATA Controller IC -->
        <T.Mesh position={[0, 0.04, 0.85]}>
          <T.BoxGeometry args={[0.45, 0.045, 0.45]} />
          <T.MeshStandardMaterial map={ctrlTex} color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </T.Mesh>
      </T.Group>

      <!-- 3. Top Brushed Gunmetal Cover Shell (Lifts when showDetails is active) -->
      <T.Group position={[0, showDetails ? 0.62 : 0.22, 0]}>
        <T.Mesh castShadow receiveShadow>
          <RoundedBoxGeometry args={[2.72, 0.16, 3.82]} radius={0.04} smoothness={4} />
          <T.MeshPhysicalMaterial
            color="#334155"
            metalness={0.82}
            roughness={0.26}
            clearcoat={0.25}
          />
        </T.Mesh>

        <!-- Diamond-Chamfered Silver Trim Frame -->
        <T.Mesh position={[0, 0.082, 0]} rotation.x={-Math.PI / 2}>
          <T.PlaneGeometry args={[2.42, 3.48]} />
          <T.MeshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.2} />
        </T.Mesh>

        <!-- Product Branding Label Sticker -->
        <T.Mesh position={[0, 0.085, 0]} rotation.x={-Math.PI / 2}>
          <T.PlaneGeometry args={[2.32, 3.38]} />
          <T.MeshStandardMaterial map={sataLabelTex} roughness={0.35} metalness={0.15} />
        </T.Mesh>
      </T.Group>

      <!-- 4. L-Shaped 15-Pin Power + 7-Pin SATA III Data Gold Connectors -->
      <T.Group position={[-0.25, 0.09, 1.96]}>
        <!-- Molded Black Connector Housing -->
        <T.Mesh>
          <T.BoxGeometry args={[1.65, 0.16, 0.22]} />
          <T.MeshStandardMaterial color="#0f172a" roughness={0.6} />
        </T.Mesh>
        <!-- 15-Pin Power Gold Fingers (Wide) -->
        <T.Mesh position={[-0.32, -0.01, 0.08]}>
          <T.BoxGeometry args={[0.85, 0.04, 0.12]} />
          <T.MeshStandardMaterial map={goldPinsTex} color="#fbbf24" metalness={0.9} roughness={0.2} />
        </T.Mesh>
        <!-- 7-Pin Data Gold Fingers (Narrow) -->
        <T.Mesh position={[0.48, -0.01, 0.08]}>
          <T.BoxGeometry args={[0.46, 0.04, 0.12]} />
          <T.MeshStandardMaterial map={goldPinsTex} color="#fbbf24" metalness={0.9} roughness={0.2} />
        </T.Mesh>
      </T.Group>
    </T.Group>
  {/if}
</T.Group>

{#if showOverlay}
  <HTML position={[position[0], position[1] + 1.32, position[2]]} center pointerEvents="auto">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="ssd-overlay" onpointerdown={(e) => e.stopPropagation()}>
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
            {activeTab === 'm2' ? '⚡ M.2 2280 NVMe PCIe 4.0 SSD' : '📦 2.5" SATA III 6Gb/s SSD'}
          </span>
          <span class="detail-desc">
            {activeTab === 'm2'
              ? '176-Layer 3D V-NAND • LPDDR4X Cache • 8-Ch NVMe Controller'
              : 'Anodized Aluminum Case • Internal NAND PCB • 15+7 Pin SATA'}
          </span>
          <span class="detail-hint">Klik objek 3D untuk menutup tampilan internal</span>
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
