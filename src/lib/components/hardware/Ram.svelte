<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, HTML } from '@threlte/extras';

  interactivity();

  let {
    position = [0, 0.8, 0] as [number, number, number],
    rotation = [0, 0, 0] as [number, number, number],
    autoRotate = true
  }: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    autoRotate?: boolean;
  } = $props();

  let rotY = $state(0);
  let isRotating = $state(autoRotate);
  let showDetails = $state(false);
  let hovered = $state(false);

  useTask((delta) => {
    if (isRotating) {
      rotY += delta * 0.4;
    }
  });

  const chipPositions = [-1.4, -0.9, -0.4, 0.1, 0.6, 1.1];

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
  <!-- Green / Blue Vibrant PCB Board -->
  <T.Mesh position={[0, 0, 0]}>
    <T.BoxGeometry args={[3.8, 1.3, 0.06]} />
    <T.MeshStandardMaterial
      color={showDetails ? '#059669' : '#0f766e'}
      roughness={0.5}
      metalness={0.15}
    />
  </T.Mesh>

  <!-- Gold Contact Pins -->
  <T.Mesh position={[0, -0.72, 0]}>
    <T.BoxGeometry args={[3.6, 0.18, 0.08]} />
    <T.MeshStandardMaterial
      color="#f59e0b"
      metalness={0.2}
      roughness={0.45}
      emissive="#f59e0b"
      emissiveIntensity={0.3}
    />
  </T.Mesh>

  <!-- Gold Pin Notch Split -->
  <T.Mesh position={[0.25, -0.72, 0]}>
    <T.BoxGeometry args={[0.22, 0.22, 0.1]} />
    <T.MeshStandardMaterial color="#334155" roughness={0.6} metalness={0.1} />
  </T.Mesh>

  <!-- Aluminum Heatsink Shield Armor (Front) -->
  <T.Mesh position={[0, 0.12, showDetails ? 0.22 : 0.09]}>
    <T.BoxGeometry args={[3.7, 1.15, 0.08]} />
    <T.MeshStandardMaterial
      color={showDetails ? '#475569' : '#334155'}
      metalness={0.2}
      roughness={0.5}
      transparent
      opacity={showDetails ? 0.75 : 1}
    />
  </T.Mesh>

  <!-- Aluminum Heatsink Shield Armor (Back) -->
  <T.Mesh position={[0, 0.12, showDetails ? -0.22 : -0.09]}>
    <T.BoxGeometry args={[3.7, 1.15, 0.08]} />
    <T.MeshStandardMaterial
      color="#334155"
      metalness={0.2}
      roughness={0.5}
      transparent
      opacity={showDetails ? 0.75 : 1}
    />
  </T.Mesh>

  <!-- Thermal Groove Fins -->
  <T.Mesh position={[0, 0.3, showDetails ? 0.27 : 0.14]}>
    <T.BoxGeometry args={[3.2, 0.2, 0.04]} />
    <T.MeshStandardMaterial color="#64748b" metalness={0.2} roughness={0.5} />
  </T.Mesh>

  <!-- Top RGB Light Diffuser Bar -->
  <T.Mesh position={[0, 0.74, 0]}>
    <T.BoxGeometry args={[3.75, 0.18, 0.2]} />
    <T.MeshStandardMaterial
      color={showDetails ? '#a855f7' : '#0284c7'}
      emissive={showDetails ? '#a855f7' : '#0284c7'}
      emissiveIntensity={1.0}
      roughness={0.4}
      metalness={0.1}
    />
  </T.Mesh>

  <!-- Glowing Brand Logo Badge -->
  <T.Mesh position={[0, 0.12, showDetails ? 0.27 : 0.14]}>
    <T.BoxGeometry args={[1.0, 0.35, 0.02]} />
    <T.MeshStandardMaterial
      color="#38bdf8"
      emissive="#0284c7"
      emissiveIntensity={0.6}
      roughness={0.4}
      metalness={0.15}
    />
  </T.Mesh>

  <!-- DRAM IC Chips -->
  {#each chipPositions as x}
    <T.Mesh position={[x, -0.15, 0.06]}>
      <T.BoxGeometry args={[0.38, 0.42, 0.04]} />
      <T.MeshStandardMaterial
        color="#1e293b"
        roughness={0.5}
        metalness={0.2}
        emissive={showDetails ? '#0284c7' : '#000000'}
        emissiveIntensity={showDetails ? 0.4 : 0}
      />
    </T.Mesh>
  {/each}

  {#if showDetails}
    <HTML position={[0, 1.3, 0]} center>
      <div class="detail-tag">
        <span class="tag-title">⚡ DDR5 Synchronous DRAM</span>
        <span class="tag-sub">Dual Armor Heatsink • BGA IC Chips • Gold Pins</span>
        <span class="tag-action">Klik lagi untuk menutup</span>
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
