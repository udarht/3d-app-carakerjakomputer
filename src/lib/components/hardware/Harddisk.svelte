<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, HTML } from '@threlte/extras';

  interactivity();

  let {
    position = [0, 0.5, 0] as [number, number, number],
    rotation = [0.4, 0, 0] as [number, number, number]
  }: {
    position?: [number, number, number];
    rotation?: [number, number, number];
  } = $props();

  let rotY = $state(-0.3);
  let platterRot = $state(0);
  let isRotating = $state(true);
  let showDetails = $state(false);
  let hovered = $state(false);

  useTask((delta) => {
    if (isRotating) {
      rotY += delta * 0.4;
    }
    platterRot += delta * 8.0;
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
  <!-- Metal Housing Base -->
  <T.Mesh position={[0, 0, 0]}>
    <T.BoxGeometry args={[2.9, 0.55, 3.9]} />
    <T.MeshStandardMaterial
      color="#475569"
      metalness={0.2}
      roughness={0.5}
    />
  </T.Mesh>

  <!-- Internal Recess -->
  <T.Mesh position={[0, 0.28, -0.2]}>
    <T.BoxGeometry args={[2.6, 0.04, 3.2]} />
    <T.MeshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.1} />
  </T.Mesh>

  <!-- Magnetic Platter & Spindle -->
  <T.Group position={[0, 0.3, -0.2]} rotation.y={platterRot}>
    <!-- Bright Metal Platter Disk -->
    <T.Mesh>
      <T.CylinderGeometry args={[1.22, 1.22, 0.03, 48]} />
      <T.MeshStandardMaterial
        color="#f8fafc"
        metalness={0.2}
        roughness={0.4}
      />
    </T.Mesh>

    <!-- Concentric Track Ring -->
    <T.Mesh position={[0, 0.02, 0]} rotation.x={Math.PI / 2}>
      <T.RingGeometry args={[0.65, 1.15, 48]} />
      <T.MeshStandardMaterial color="#94a3b8" metalness={0.2} roughness={0.45} />
    </T.Mesh>

    <!-- Spindle Motor Center Hub -->
    <T.Mesh position={[0, 0.025, 0]}>
      <T.CylinderGeometry args={[0.38, 0.38, 0.04, 32]} />
      <T.MeshStandardMaterial color="#cbd5e1" metalness={0.2} roughness={0.45} />
    </T.Mesh>

    <!-- Center Screws -->
    <T.Mesh position={[0, 0.048, 0]}>
      <T.CylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
      <T.MeshStandardMaterial color="#64748b" metalness={0.2} roughness={0.5} />
    </T.Mesh>
  </T.Group>

  <!-- Actuator Arm & Head -->
  <T.Group position={[0.9, 0.32, 0.9]} rotation.y={showDetails ? 0.35 : 0.15}>
    <T.Mesh position={[0, 0, 0]}>
      <T.CylinderGeometry args={[0.22, 0.22, 0.08, 24]} />
      <T.MeshStandardMaterial color="#64748b" metalness={0.2} roughness={0.5} />
    </T.Mesh>

    <!-- VCM Magnet -->
    <T.Mesh position={[0.2, 0, 0.25]}>
      <T.BoxGeometry args={[0.35, 0.06, 0.45]} />
      <T.MeshStandardMaterial color="#ec4899" emissive="#db2777" emissiveIntensity={0.6} roughness={0.4} metalness={0.1} />
    </T.Mesh>

    <!-- Arm Beam -->
    <T.Mesh position={[-0.55, 0.02, -0.6]} rotation.y={0.7}>
      <T.BoxGeometry args={[0.12, 0.025, 1.25]} />
      <T.MeshStandardMaterial color="#cbd5e1" metalness={0.2} roughness={0.45} />
    </T.Mesh>

    <!-- Head Slider -->
    <T.Mesh position={[-0.95, 0.015, -1.05]}>
      <T.BoxGeometry args={[0.06, 0.02, 0.1]} />
      <T.MeshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.8} roughness={0.4} metalness={0.1} />
    </T.Mesh>
  </T.Group>

  <!-- Top Cover Lid -->
  <T.Group position={[0, showDetails ? 1.2 : 0.3, 0]}>
    <T.Mesh position={[0, 0, 0]}>
      <T.BoxGeometry args={[2.8, 0.04, 3.8]} />
      <T.MeshStandardMaterial
        color="#cbd5e1"
        metalness={0.2}
        roughness={0.5}
        transparent
        opacity={showDetails ? 0.5 : 0.9}
      />
    </T.Mesh>

    <!-- Spec Sticker -->
    <T.Mesh position={[0, 0.025, 0.6]}>
      <T.BoxGeometry args={[2.4, 0.01, 1.6]} />
      <T.MeshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.05} />
    </T.Mesh>

    <!-- Label Colored Banner -->
    <T.Mesh position={[0, 0.032, 1.2]}>
      <T.BoxGeometry args={[2.4, 0.01, 0.35]} />
      <T.MeshStandardMaterial color="#2563eb" emissive="#1d4ed8" emissiveIntensity={0.4} roughness={0.5} metalness={0.1} />
    </T.Mesh>

    <!-- Corner Screws -->
    {#each [-1.25, 1.25] as x}
      {#each [-1.75, 1.75] as z}
        <T.Mesh position={[x, 0.025, z]}>
          <T.CylinderGeometry args={[0.065, 0.065, 0.02, 16]} />
          <T.MeshStandardMaterial color="#64748b" metalness={0.2} roughness={0.5} />
        </T.Mesh>
      {/each}
    {/each}
  </T.Group>

  <!-- SATA Connector -->
  <T.Mesh position={[-0.4, -0.05, 2.0]}>
    <T.BoxGeometry args={[1.5, 0.25, 0.2]} />
    <T.MeshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.1} />
  </T.Mesh>
  <T.Mesh position={[-0.4, -0.05, 2.1]}>
    <T.BoxGeometry args={[1.3, 0.1, 0.04]} />
    <T.MeshStandardMaterial color="#f59e0b" metalness={0.2} roughness={0.45} />
  </T.Mesh>

  {#if showDetails}
    <HTML position={[0, 1.8, 0]} center>
      <div class="hdd-tag">
        <span class="hdd-title">💽 Hard Disk Drive (HDD 3.5")</span>
        <span class="hdd-sub">Spinning Magnetic Platter • Spindle Motor • Actuator Arm Head</span>
        <span class="hdd-hint">Klik objek untuk menutup detail</span>
      </div>
    </HTML>
  {/if}
</T.Group>

<style>
  .hdd-tag {
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
  .hdd-title {
    font-weight: 700;
    color: #38bdf8;
  }
  .hdd-sub {
    font-size: 0.7rem;
    color: #cbd5e1;
  }
  .hdd-hint {
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
