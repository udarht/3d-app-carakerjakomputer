<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity } from '@threlte/extras';

  interactivity();

  let {
    position = [0, 0, 0] as [number, number, number],
    rotation = [0, 0, 0] as [number, number, number]
  }: {
    position?: [number, number, number];
    rotation?: [number, number, number];
  } = $props();

  let isPowered = $state(true);
  let hovered = $state(false);

  function togglePower(e: any) {
    e.stopPropagation();
    isPowered = !isPowered;
  }
</script>

<T.Group
  {position}
  {rotation}
  scale={hovered ? 1.02 : 1}
  onpointerenter={() => (hovered = true)}
  onpointerleave={() => (hovered = false)}
>
  <!-- Thin Sleek Rear Casing -->
  <T.Mesh position={[0, 1.6, -0.04]}>
    <T.BoxGeometry args={[3.85, 2.35, 0.08]} />
    <T.MeshStandardMaterial color="#334155" roughness={0.5} metalness={0.15} />
  </T.Mesh>

  <!-- Central Electronics Rear Bump -->
  <T.Mesh position={[0, 1.5, -0.1]}>
    <T.BoxGeometry args={[2.2, 1.4, 0.12]} />
    <T.MeshStandardMaterial color="#475569" roughness={0.5} metalness={0.15} />
  </T.Mesh>

  <!-- Rear Vents -->
  <T.Mesh position={[0, 2.05, -0.1]}>
    <T.BoxGeometry args={[1.8, 0.06, 0.13]} />
    <T.MeshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.1} />
  </T.Mesh>

  <!-- Clean Bezel Frame -->
  <T.Mesh position={[0, 1.6, 0.01]}>
    <T.BoxGeometry args={[3.82, 2.32, 0.03]} />
    <T.MeshStandardMaterial color="#1e293b" roughness={0.45} metalness={0.2} />
  </T.Mesh>

  <!-- Bottom Chin Bezel Bar -->
  <T.Mesh position={[0, 0.52, 0.02]}>
    <T.BoxGeometry args={[3.82, 0.16, 0.035]} />
    <T.MeshStandardMaterial color="#334155" roughness={0.45} metalness={0.2} />
  </T.Mesh>

  <!-- LCD Screen Matrix -->
  <T.Mesh position={[0, 1.65, 0.026]}>
    <T.BoxGeometry args={[3.74, 2.15, 0.01]} />
    <T.MeshStandardMaterial
      color={isPowered ? '#0f172a' : '#334155'}
      roughness={0.4}
      metalness={0.1}
      emissive={isPowered ? '#38bdf8' : '#000000'}
      emissiveIntensity={isPowered ? 0.35 : 0}
    />
  </T.Mesh>

  <!-- Active GUI Wallpaper Visualization -->
  {#if isPowered}
    <T.Mesh position={[0, 1.65, 0.033]}>
      <T.BoxGeometry args={[3.6, 2.0, 0.005]} />
      <T.MeshStandardMaterial
        color="#3b82f6"
        roughness={0.4}
        metalness={0.05}
        emissive="#60a5fa"
        emissiveIntensity={0.5}
      />
    </T.Mesh>

    <!-- OS Taskbar Bar -->
    <T.Mesh position={[0, 0.74, 0.036]}>
      <T.BoxGeometry args={[3.6, 0.14, 0.005]} />
      <T.MeshStandardMaterial color="#1e293b" emissive="#0284c7" emissiveIntensity={0.7} roughness={0.5} metalness={0.1} />
    </T.Mesh>

    <!-- UI Window Cards -->
    <T.Mesh position={[-0.8, 1.7, 0.039]}>
      <T.BoxGeometry args={[1.6, 1.1, 0.005]} />
      <T.MeshStandardMaterial
        color="#f8fafc"
        roughness={0.5}
        metalness={0.05}
        emissive="#0284c7"
        emissiveIntensity={0.25}
      />
    </T.Mesh>
    <T.Mesh position={[0.9, 1.5, 0.039]}>
      <T.BoxGeometry args={[1.4, 0.85, 0.005]} />
      <T.MeshStandardMaterial
        color="#f1f5f9"
        roughness={0.5}
        metalness={0.05}
        emissive="#818cf8"
        emissiveIntensity={0.3}
      />
    </T.Mesh>
  {/if}

  <!-- Interactive Power Button -->
  <T.Mesh position={[1.6, 0.52, 0.035]} onclick={togglePower}>
    <T.SphereGeometry args={[0.035, 16, 16]} />
    <T.MeshStandardMaterial
      color={isPowered ? '#06b6d4' : '#ef4444'}
      emissive={isPowered ? '#06b6d4' : '#ef4444'}
      emissiveIntensity={1.8}
      roughness={0.3}
      metalness={0.1}
    />
  </T.Mesh>

  <!-- VESA Mount Connector -->
  <T.Mesh position={[0, 1.5, -0.18]}>
    <T.BoxGeometry args={[0.45, 0.45, 0.06]} />
    <T.MeshStandardMaterial color="#64748b" metalness={0.2} roughness={0.5} />
  </T.Mesh>

  <!-- Solid Stand Column -->
  <T.Mesh position={[0, 0.8, -0.18]}>
    <T.BoxGeometry args={[0.16, 1.45, 0.16]} />
    <T.MeshStandardMaterial color="#64748b" metalness={0.2} roughness={0.5} />
  </T.Mesh>

  <!-- Cable Management Ring -->
  <T.Mesh position={[0, 0.5, -0.18]}>
    <T.TorusGeometry args={[0.12, 0.025, 16, 32]} />
    <T.MeshStandardMaterial color="#475569" metalness={0.2} roughness={0.5} />
  </T.Mesh>

  <!-- Solid Metal Base Pedestal -->
  <T.Mesh position={[0, 0.04, 0]}>
    <T.CylinderGeometry args={[0.75, 0.8, 0.07, 40]} />
    <T.MeshStandardMaterial
      color={hovered ? '#475569' : '#334155'}
      metalness={0.2}
      roughness={0.5}
    />
  </T.Mesh>

  <!-- Cyan Ring on Base -->
  <T.Mesh position={[0, 0.076, 0]} rotation.x={Math.PI / 2}>
    <T.RingGeometry args={[0.55, 0.58, 48]} />
    <T.MeshStandardMaterial
      color={isPowered ? '#0284c7' : '#94a3b8'}
      emissive={isPowered ? '#0284c7' : '#64748b'}
      emissiveIntensity={isPowered ? 0.9 : 0.2}
      roughness={0.3}
      metalness={0.1}
    />
  </T.Mesh>
</T.Group>
