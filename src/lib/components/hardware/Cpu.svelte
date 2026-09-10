<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, HTML } from '@threlte/extras';

  interactivity();

  let {
    position = [0, 0.6, 0] as [number, number, number],
    rotation = [0.4, 0, 0] as [number, number, number],
    autoRotate = true
  }: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    autoRotate?: boolean;
  } = $props();

  let rotY = $state(0);
  let isRotating = $state(autoRotate);
  let hovered = $state(false);
  let showDetails = $state(false);

  // Slow smooth rotation animation around Y-axis
  useTask((delta) => {
    if (isRotating) {
      rotY += delta * 0.5;
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
  <!-- 1. Bottom PCB Substrate (Lapisan Bawah Papan Tipis Hijau Tua / Hitam Gelap) -->
  <T.Mesh position={[0, 0, 0]}>
    <T.BoxGeometry args={[2.8, 0.08, 2.8]} />
    <T.MeshStandardMaterial
      color="#064e3b"
      roughness={0.5}
      metalness={0.15}
    />
  </T.Mesh>

  <!-- Underside Gold Land Grid Array (LGA Contact Pads) -->
  <T.Mesh position={[0, -0.045, 0]}>
    <T.BoxGeometry args={[2.5, 0.01, 2.5]} />
    <T.MeshStandardMaterial
      color="#f59e0b"
      roughness={0.35}
      metalness={0.3}
    />
  </T.Mesh>

  <!-- 2. Integrated Heat Spreader (IHS) Base Lip (Penutup Logam Tebal Bawah) -->
  <T.Mesh position={[0, 0.07, 0]}>
    <T.BoxGeometry args={[2.4, 0.06, 2.4]} />
    <T.MeshStandardMaterial
      color="#cbd5e1"
      roughness={0.3}
      metalness={0.4}
    />
  </T.Mesh>

  <!-- 3. IHS Main Raised Cap with Beveled Stepped Edge (Penutup Logam Atas) -->
  <T.Mesh position={[0, 0.13, 0]}>
    <T.BoxGeometry args={[2.05, 0.07, 2.05]} />
    <T.MeshStandardMaterial
      color="#e2e8f0"
      roughness={0.3}
      metalness={0.4}
    />
  </T.Mesh>

  <!-- Top Center Laser Engraving Plate / Brand Mark -->
  <T.Mesh position={[0, 0.17, 0]}>
    <T.BoxGeometry args={[1.65, 0.012, 1.65]} />
    <T.MeshStandardMaterial
      color="#94a3b8"
      roughness={0.28}
      metalness={0.4}
    />
  </T.Mesh>

  <!-- Laser Etched CPU Branding Typography Accent -->
  <T.Mesh position={[0, 0.18, 0.2]}>
    <T.BoxGeometry args={[1.2, 0.005, 0.25]} />
    <T.MeshStandardMaterial
      color="#475569"
      roughness={0.4}
      metalness={0.2}
    />
  </T.Mesh>

  <!-- 4. Gold Triangle Alignment Notch on Top-Left Corner of PCB (Tanda Segitiga Emas) -->
  <T.Mesh position={[-1.22, 0.045, -1.22]} rotation.y={Math.PI / 4}>
    <T.ConeGeometry args={[0.12, 0.015, 3]} />
    <T.MeshStandardMaterial
      color="#fbbf24"
      emissive="#f59e0b"
      emissiveIntensity={0.6}
      roughness={0.25}
      metalness={0.4}
    />
  </T.Mesh>

  <!-- Alignment Notches on Substrate Sides (Kiri & Kanan) -->
  <T.Mesh position={[-1.38, 0, 0]}>
    <T.BoxGeometry args={[0.08, 0.09, 0.25]} />
    <T.MeshStandardMaterial color="#022c22" roughness={0.6} metalness={0.1} />
  </T.Mesh>
  <T.Mesh position={[1.38, 0, 0]}>
    <T.BoxGeometry args={[0.08, 0.09, 0.25]} />
    <T.MeshStandardMaterial color="#022c22" roughness={0.6} metalness={0.1} />
  </T.Mesh>

  <!-- SMD Capacitors on Substrate Edge -->
  {#each [-0.6, -0.2, 0.2, 0.6] as x}
    <T.Mesh position={[x, 0.05, 1.25]}>
      <T.BoxGeometry args={[0.16, 0.03, 0.08]} />
      <T.MeshStandardMaterial color="#64748b" roughness={0.3} metalness={0.4} />
    </T.Mesh>
  {/each}

  {#if showDetails}
    <HTML position={[0, 1.4, 0]} center>
      <div class="cpu-tag">
        <span class="cpu-title">⚡ Central Processing Unit (CPU)</span>
        <span class="cpu-sub">Metallic IHS • Multi-Core Silicon Die • LGA Substrate</span>
        <span class="cpu-hint">Klik objek untuk melanjutkan rotasi</span>
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
