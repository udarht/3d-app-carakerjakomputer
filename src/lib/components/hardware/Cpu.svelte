<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, HTML, RoundedBoxGeometry } from '@threlte/extras';
  import {
    getCpuIhsTexture,
    getCpuLgaPadsTexture,
    getPcbCircuitTexture
  } from '$lib/utils/textures';

  interactivity();

  let {
    position = [0, 0.65, 0] as [number, number, number],
    rotation = [0.38, 0, 0] as [number, number, number],
    autoRotate = true,
    showIgpuCore = false,
    isIgpuActive = false
  }: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    autoRotate?: boolean;
    showIgpuCore?: boolean;
    isIgpuActive?: boolean;
  } = $props();

  let rotY = $state(0);
  let isPaused = $state(false);
  let hovered = $state(false);
  let showDetails = $state(false);

  const ihsTexture = getCpuIhsTexture();
  const lgaPadsTexture = getCpuLgaPadsTexture();
  const pcbTexture = getPcbCircuitTexture('#064e3b', '#10b981');

  // Slow smooth rotation animation around Y-axis
  useTask((delta) => {
    if (autoRotate && !isPaused) {
      rotY += delta * 0.45;
    }
  });

  function toggleClick(e: any) {
    e.stopPropagation();
    showDetails = !showDetails;
    isPaused = showDetails;
  }

  // SMD capacitor positions around outer perimeter of substrate
  const smdEdgeOffsets = [-0.75, -0.45, -0.15, 0.15, 0.45, 0.75];
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
  <!-- 1. MULTI-LAYER FR4 PCB SUBSTRATE -->
  <!-- ============================================== -->
  <T.Mesh position={[0, 0, 0]} castShadow receiveShadow>
    <RoundedBoxGeometry args={[2.85, 0.09, 2.85]} radius={0.03} smoothness={4} />
    <T.MeshPhysicalMaterial
      map={pcbTexture}
      color="#065f46"
      roughness={0.38}
      metalness={0.18}
      clearcoat={0.35}
      clearcoatRoughness={0.25}
    />
  </T.Mesh>

  <!-- Copper Core Layer Sandwich Edge Strip -->
  <T.Mesh position={[0, 0, 0]}>
    <T.BoxGeometry args={[2.86, 0.018, 2.86]} />
    <T.MeshStandardMaterial color="#d97706" roughness={0.25} metalness={0.85} />
  </T.Mesh>

  <!-- Underside Gold Land Grid Array (1700+ LGA Contact Pads & Center MLCCs) -->
  <T.Mesh position={[0, -0.047, 0]} rotation.x={Math.PI / 2}>
    <T.PlaneGeometry args={[2.68, 2.68]} />
    <T.MeshStandardMaterial
      map={lgaPadsTexture}
      roughness={0.25}
      metalness={0.85}
    />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 2. NICKEL-PLATED COPPER IHS (INTEGRATED HEAT SPREADER) -->
  <!-- ============================================== -->
  <!-- IHS Base Flange with Side Retention Ears (Translates up slightly when showDetails is active) -->
  <T.Group position={[0, showDetails ? 0.36 : 0, 0]}>
    <!-- Lower Stepped Flange -->
    <T.Mesh position={[0, 0.075, 0]} castShadow receiveShadow>
      <RoundedBoxGeometry args={[2.32, 0.065, 2.32]} radius={0.04} smoothness={4} />
      <T.MeshPhysicalMaterial
        color="#cbd5e1"
        roughness={0.24}
        metalness={0.88}
        clearcoat={0.25}
        clearcoatRoughness={0.2}
      />
    </T.Mesh>

    <!-- Retention Notch Wings (Left & Right Socket ILM Clamping Ears) -->
    <T.Mesh position={[-1.22, 0.068, 0]} castShadow>
      <RoundedBoxGeometry args={[0.18, 0.05, 0.78]} radius={0.02} smoothness={3} />
      <T.MeshPhysicalMaterial color="#94a3b8" roughness={0.28} metalness={0.85} />
    </T.Mesh>
    <T.Mesh position={[1.22, 0.068, 0]} castShadow>
      <RoundedBoxGeometry args={[0.18, 0.05, 0.78]} radius={0.02} smoothness={3} />
      <T.MeshPhysicalMaterial color="#94a3b8" roughness={0.28} metalness={0.85} />
    </T.Mesh>

    <!-- Main Raised IHS Top Plateau -->
    <T.Mesh position={[0, 0.14, 0]} castShadow receiveShadow>
      <RoundedBoxGeometry args={[2.04, 0.08, 2.04]} radius={0.035} smoothness={4} />
      <T.MeshPhysicalMaterial
        color="#e2e8f0"
        roughness={0.2}
        metalness={0.9}
        clearcoat={0.3}
        clearcoatRoughness={0.18}
      />
    </T.Mesh>

    <!-- Laser-Etched Brushed Nickel Top Surface Texture -->
    <T.Mesh position={[0, 0.181, 0]} rotation.x={-Math.PI / 2}>
      <T.PlaneGeometry args={[1.92, 1.92]} />
      <T.MeshStandardMaterial
        map={ihsTexture}
        roughness={0.24}
        metalness={0.82}
      />
    </T.Mesh>

    <!-- Pressure-Relief Vent Hole on IHS Corner -->
    <T.Mesh position={[-0.86, 0.182, -0.86]}>
      <T.CylinderGeometry args={[0.032, 0.032, 0.01, 16]} />
      <T.MeshStandardMaterial color="#0f172a" roughness={0.8} />
    </T.Mesh>
  </T.Group>

  <!-- ============================================== -->
  <!-- 3. INTERNAL MONOLITHIC SILICON DIE (Exposed when clicked or iGPU active) -->
  <!-- ============================================== -->
  {#if showDetails || showIgpuCore || isIgpuActive}
    <T.Group position={[0, showDetails ? 0.065 : 0.185, showDetails ? 0 : -0.22]}>
      <!-- Mirror-Polished Silicon Die Crystal -->
      <T.Mesh position={[0, 0, 0]} castShadow>
        <RoundedBoxGeometry args={[1.36, 0.035, 0.92]} radius={0.01} smoothness={3} />
        <T.MeshPhysicalMaterial
          color={isIgpuActive ? '#0284c7' : '#1e293b'}
          emissive={isIgpuActive ? '#38bdf8' : '#0369a1'}
          emissiveIntensity={isIgpuActive ? 1.3 : 0.3}
          roughness={0.08}
          metalness={0.92}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </T.Mesh>

      <!-- Compute Cores & iGPU Execution Units Architecture Grid -->
      {#each [-0.42, 0, 0.42] as cx, idx}
        <T.Mesh position={[cx, 0.02, 0]}>
          <T.BoxGeometry args={[0.32, 0.008, 0.74]} />
          <T.MeshPhysicalMaterial
            color={isIgpuActive ? '#bae6fd' : idx === 2 ? '#0284c7' : '#4f46e5'}
            emissive={isIgpuActive ? '#00f0ff' : idx === 2 ? '#0284c7' : '#6366f1'}
            emissiveIntensity={isIgpuActive ? 1.6 : 0.45}
            roughness={0.12}
            metalness={0.85}
          />
        </T.Mesh>
      {/each}

      {#if isIgpuActive}
        <T.PointLight position={[0, 0.45, 0]} color="#00f0ff" intensity={3.5} distance={2.5} />
      {/if}
    </T.Group>
  {/if}

  <!-- ============================================== -->
  <!-- 4. PIN-1 GOLD ALIGNMENT TRIANGLE & PERIMETER SMD CAPACITORS -->
  <!-- ============================================== -->
  <!-- Gold Pin-1 Triangle Marker on Bottom-Left Corner -->
  <T.Mesh position={[-1.24, 0.048, 1.24]} rotation.y={-Math.PI / 4}>
    <T.ConeGeometry args={[0.11, 0.012, 3]} />
    <T.MeshStandardMaterial
      color="#fbbf24"
      emissive="#d97706"
      emissiveIntensity={0.35}
      roughness={0.2}
      metalness={0.9}
    />
  </T.Mesh>

  <!-- Socket Keying Cutout Notches on Substrate Edges -->
  {#each [-1.41, 1.41] as x}
    <T.Mesh position={[x, 0, 0.25]}>
      <T.BoxGeometry args={[0.07, 0.1, 0.2]} />
      <T.MeshStandardMaterial color="#022c22" roughness={0.7} />
    </T.Mesh>
    <T.Mesh position={[x, 0, -0.45]}>
      <T.BoxGeometry args={[0.07, 0.1, 0.2]} />
      <T.MeshStandardMaterial color="#022c22" roughness={0.7} />
    </T.Mesh>
  {/each}

  <!-- Surface-Mount Ceramic Capacitors (MLCCs) with Silver Solder Terminations -->
  {#each smdEdgeOffsets as x}
    {#each [-1.29, 1.29] as z}
      <T.Group position={[x, 0.056, z]}>
        <!-- Ceramic Body -->
        <T.Mesh>
          <T.BoxGeometry args={[0.11, 0.028, 0.055]} />
          <T.MeshStandardMaterial color="#92400e" roughness={0.35} metalness={0.2} />
        </T.Mesh>
        <!-- Left & Right Solder Caps -->
        <T.Mesh position={[-0.045, 0, 0]}>
          <T.BoxGeometry args={[0.025, 0.03, 0.057]} />
          <T.MeshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.9} />
        </T.Mesh>
        <T.Mesh position={[0.045, 0, 0]}>
          <T.BoxGeometry args={[0.025, 0.03, 0.057]} />
          <T.MeshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.9} />
        </T.Mesh>
      </T.Group>
    {/each}
  {/each}

  {#if showDetails}
    <HTML position={[0, 1.5, 0]} center>
      <div class="cpu-tag">
        <span class="cpu-title">⚡ Central Processing Unit (LGA1700)</span>
        <span class="cpu-sub">Nickel-Plated Copper IHS • Monolithic Silicon Die • 1700 Gold Pads</span>
        <span class="cpu-hint">Klik objek untuk menutup tampilan internal</span>
      </div>
    </HTML>
  {/if}
</T.Group>

<style>
  .cpu-tag {
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid #9333ea;
    box-shadow: 0 4px 20px rgba(147, 51, 234, 0.4);
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
  .cpu-title {
    font-weight: 700;
    color: #c084fc;
  }
  .cpu-sub {
    font-size: 0.7rem;
    color: #cbd5e1;
  }
  .cpu-hint {
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
