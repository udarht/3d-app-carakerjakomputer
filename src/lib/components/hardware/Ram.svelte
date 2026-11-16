<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, HTML, RoundedBoxGeometry } from '@threlte/extras';
  import {
    getChipMarkingTexture,
    getGoldPinsTexture,
    getPcbCircuitTexture
  } from '$lib/utils/textures';

  interactivity();

  let {
    position = [0, 0.85, 0] as [number, number, number],
    rotation = [0, 0, 0] as [number, number, number],
    autoRotate = true
  }: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    autoRotate?: boolean;
  } = $props();

  let rotY = $state(0);
  let rgbTime = $state(0);
  let isPaused = $state(false);
  let showDetails = $state(false);
  let hovered = $state(false);

  const pcbTexture = getPcbCircuitTexture('#0f172a', '#0284c7');
  const goldPinsTex = getGoldPinsTexture(64);
  const dramChipTex = getChipMarkingTexture('SK hynix', 'H5CG48AGBD', 'DDR5-6400');

  useTask((delta) => {
    rgbTime += delta * 2.5;
    if (autoRotate && !isPaused) {
      rotY += delta * 0.4;
    }
  });

  // 4 DRAM chips on left bank, 4 on right bank (around center PMIC)
  const leftBankX = [-1.52, -1.16, -0.8, -0.44];
  const rightBankX = [0.44, 0.8, 1.16, 1.52];
  const allChipX = [...leftBankX, ...rightBankX];

  // Multi-zone RGB segments
  const rgbZones = [-1.4, -0.7, 0, 0.7, 1.4];

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
  <!-- ============================================== -->
  <!-- 1. 10-LAYER MATTE BLACK/SLATE DDR5 PCB BOARD -->
  <!-- ============================================== -->
  <T.Mesh position={[0, 0, 0]} castShadow receiveShadow>
    <RoundedBoxGeometry args={[3.9, 1.26, 0.055]} radius={0.015} smoothness={3} />
    <T.MeshPhysicalMaterial
      map={pcbTexture}
      color="#0f172a"
      roughness={0.42}
      metalness={0.2}
      clearcoat={0.25}
    />
  </T.Mesh>

  <!-- Side DIMM Latch Retention Notches (Kiri & Kanan) -->
  {#each [-1.94, 1.94] as x}
    <T.Mesh position={[x, 0.15, 0]}>
      <T.BoxGeometry args={[0.08, 0.14, 0.07]} />
      <T.MeshStandardMaterial color="#020617" roughness={0.8} />
    </T.Mesh>
  {/each}

  <!-- ============================================== -->
  <!-- 2. 288-PIN GOLD EDGE CONNECTOR (LEFT & RIGHT OF KEY NOTCH) -->
  <!-- ============================================== -->
  <!-- Left Gold Finger Section -->
  <T.Mesh position={[-0.92, -0.68, 0]} castShadow>
    <T.BoxGeometry args={[1.92, 0.16, 0.062]} />
    <T.MeshStandardMaterial
      map={goldPinsTex}
      color="#fbbf24"
      metalness={0.88}
      roughness={0.22}
    />
  </T.Mesh>

  <!-- Right Gold Finger Section -->
  <T.Mesh position={[1.05, -0.68, 0]} castShadow>
    <T.BoxGeometry args={[1.66, 0.16, 0.062]} />
    <T.MeshStandardMaterial
      map={goldPinsTex}
      color="#fbbf24"
      metalness={0.88}
      roughness={0.22}
    />
  </T.Mesh>

  <!-- DDR5 Keying Notch Gap -->
  <T.Mesh position={[0.13, -0.69, 0]}>
    <T.BoxGeometry args={[0.16, 0.18, 0.08]} />
    <T.MeshStandardMaterial color="#020617" roughness={0.9} />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 3. ON-BOARD BGA DRAM CHIPS & DDR5 PMIC CONTROLLER -->
  <!-- ============================================== -->
  {#each allChipX as x}
    <!-- Front & Back BGA DRAM IC Packages -->
    {#each [-0.042, 0.042] as z}
      <T.Mesh position={[x, -0.14, z]} castShadow>
        <RoundedBoxGeometry args={[0.29, 0.42, 0.035]} radius={0.008} smoothness={2} />
        <T.MeshStandardMaterial
          map={dramChipTex}
          color="#18181b"
          roughness={0.35}
          metalness={0.25}
          emissive={showDetails ? '#0284c7' : '#000000'}
          emissiveIntensity={showDetails ? 0.35 : 0}
        />
      </T.Mesh>
    {/each}
  {/each}

  <!-- Central DDR5 On-DIMM PMIC (Power Management IC) & Inductor -->
  <T.Mesh position={[0, -0.05, 0.045]}>
    <T.BoxGeometry args={[0.24, 0.24, 0.04]} />
    <T.MeshStandardMaterial
      color="#334155"
      roughness={0.3}
      metalness={0.6}
      emissive={showDetails ? '#a855f7' : '#000000'}
      emissiveIntensity={showDetails ? 0.6 : 0}
    />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 4. ANODIZED BRUSHED ALUMINUM HEATSPREADER ARMOR (FRONT & BACK) -->
  <!-- ============================================== -->
  {#each [1, -1] as dir}
    {@const zOffset = dir * (showDetails ? 0.34 : 0.075)}
    <T.Group position={[0, 0.12, zOffset]}>
      <!-- Main Brushed Gunmetal Aluminum Shield -->
      <T.Mesh castShadow receiveShadow>
        <RoundedBoxGeometry args={[3.82, 1.16, 0.065]} radius={0.025} smoothness={4} />
        <T.MeshPhysicalMaterial
          color="#1e293b"
          metalness={0.82}
          roughness={0.28}
          clearcoat={0.25}
          transparent={showDetails}
          opacity={showDetails ? 0.82 : 1}
        />
      </T.Mesh>

      <!-- Silver CNC-Machined Angular Wing Accent -->
      <T.Mesh position={[0, 0.16, dir * 0.036]} castShadow>
        <RoundedBoxGeometry args={[3.45, 0.34, 0.018]} radius={0.01} smoothness={3} />
        <T.MeshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.22} />
      </T.Mesh>

      <!-- Diagonal Heat Dissipation Fins -->
      {#each [-1.35, -1.05, -0.75, 0.75, 1.05, 1.35] as fx}
        <T.Mesh position={[fx, 0.16, dir * 0.044]} rotation.z={0.35}>
          <T.BoxGeometry args={[0.08, 0.28, 0.015]} />
          <T.MeshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.4} />
        </T.Mesh>
      {/each}

      <!-- Center Chrome Brand Medallion Plate -->
      <T.Mesh position={[0, -0.04, dir * 0.038]}>
        <RoundedBoxGeometry args={[1.05, 0.32, 0.02]} radius={0.01} smoothness={3} />
        <T.MeshPhysicalMaterial
          color="#e2e8f0"
          metalness={0.92}
          roughness={0.15}
          clearcoat={0.5}
        />
      </T.Mesh>
    </T.Group>
  {/each}

  <!-- ============================================== -->
  <!-- 5. TOP MULTI-ZONE TRANSLUCENT RGB DIFFUSER LIGHT BAR -->
  <!-- ============================================== -->
  <T.Mesh position={[0, 0.74, 0]} castShadow>
    <RoundedBoxGeometry args={[3.84, 0.18, 0.19]} radius={0.04} smoothness={4} />
    <T.MeshPhysicalMaterial
      color="#e0f2fe"
      emissive="#0284c7"
      emissiveIntensity={0.75}
      roughness={0.18}
      metalness={0.05}
      transmission={0.4}
      thickness={0.2}
    />
  </T.Mesh>

  <!-- Animated Addressable RGB LED Zones Inside Diffuser -->
  {#each rgbZones as zx, idx}
    {@const pulse = Math.sin(rgbTime + idx * 0.9) * 0.5 + 0.5}
    <T.Mesh position={[zx, 0.74, 0]}>
      <T.BoxGeometry args={[0.68, 0.12, 0.14]} />
      <T.MeshStandardMaterial
        color={idx % 2 === 0 ? '#38bdf8' : '#a855f7'}
        emissive={idx % 2 === 0 ? '#0284c7' : '#9333ea'}
        emissiveIntensity={0.9 + pulse * 0.9}
        roughness={0.2}
      />
    </T.Mesh>
  {/each}

  {#if showDetails}
    <HTML position={[0, 1.38, 0]} center>
      <div class="detail-tag">
        <span class="tag-title">⚡ DDR5-6400 Synchronous DRAM (288-Pin DIMM)</span>
        <span class="tag-sub">CNC Aluminum Heatsink • 8x SK hynix BGA ICs • On-DIMM PMIC</span>
        <span class="tag-action">Klik lagi untuk menutup tampilan eksplodasi</span>
      </div>
    </HTML>
  {/if}
</T.Group>

<style>
  .detail-tag {
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
  .tag-title {
    font-weight: 700;
    color: #38bdf8;
  }
  .tag-sub {
    font-size: 0.7rem;
    color: #cbd5e1;
  }
  .tag-action {
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
