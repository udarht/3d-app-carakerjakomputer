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

  let isPlaying = $state(true);
  let hovered = $state(false);
  let pulse = $state(0);
  let time = 0;

  useTask((delta) => {
    if (isPlaying) {
      time += delta * 12;
      pulse = Math.sin(time) * 0.035;
    } else {
      pulse = 0;
    }
  });

  function toggleAudio(e: any) {
    e.stopPropagation();
    isPlaying = !isPlaying;
  }
</script>

<T.Group
  {position}
  {rotation}
  scale={hovered ? 1.03 : 1}
  onpointerenter={() => (hovered = true)}
  onpointerleave={() => (hovered = false)}
  onclick={toggleAudio}
>
  <!-- Wood Cabinet -->
  <T.Mesh position={[0, 1.5, 0]}>
    <T.BoxGeometry args={[1.9, 2.9, 2.0]} />
    <T.MeshStandardMaterial
      color="#78350f"
      roughness={0.55}
      metalness={0.1}
    />
  </T.Mesh>

  <!-- Front Baffle Faceplate -->
  <T.Mesh position={[0, 1.5, 1.01]}>
    <T.BoxGeometry args={[1.74, 2.74, 0.06]} />
    <T.MeshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.15} />
  </T.Mesh>

  <!-- Upper Tweeter -->
  <T.Mesh position={[0, 2.22, 1.04]} rotation.x={Math.PI / 2}>
    <T.TorusGeometry args={[0.3, 0.035, 16, 32]} />
    <T.MeshStandardMaterial
      color={isPlaying ? '#0284c7' : '#64748b'}
      emissive={isPlaying ? '#0284c7' : '#000000'}
      emissiveIntensity={isPlaying ? 0.6 : 0}
      metalness={0.2}
      roughness={0.45}
    />
  </T.Mesh>

  <T.Mesh position={[0, 2.22, 1.03 + (pulse * 0.5)]}>
    <T.SphereGeometry args={[0.2, 24, 24]} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.45} metalness={0.2} />
  </T.Mesh>

  <!-- Lower Woofer -->
  <T.Mesh position={[0, 1.15, 1.04]} rotation.x={Math.PI / 2}>
    <T.TorusGeometry args={[0.62, 0.065, 24, 40]} />
    <T.MeshStandardMaterial color="#cbd5e1" metalness={0.2} roughness={0.45} />
  </T.Mesh>

  <T.Mesh position={[0, 1.15, 1.02 + pulse]} rotation.x={Math.PI / 2}>
    <T.TorusGeometry args={[0.54, 0.05, 20, 36]} />
    <T.MeshStandardMaterial color="#334155" roughness={0.6} metalness={0.1} />
  </T.Mesh>

  <T.Mesh position={[0, 1.15, 0.96 + pulse]} rotation.x={Math.PI / 2}>
    <T.ConeGeometry args={[0.5, 0.2, 32]} />
    <T.MeshStandardMaterial
      color="#475569"
      roughness={0.5}
      metalness={0.15}
      emissive={isPlaying ? '#0284c7' : '#000000'}
      emissiveIntensity={isPlaying ? 0.2 : 0}
    />
  </T.Mesh>

  <T.Mesh position={[0, 1.15, 1.03 + pulse]}>
    <T.SphereGeometry args={[0.22, 24, 24]} />
    <T.MeshStandardMaterial color="#0f172a" metalness={0.2} roughness={0.45} />
  </T.Mesh>

  <!-- Volume Knob -->
  <T.Mesh position={[-0.45, 0.42, 1.06]} rotation.x={Math.PI / 2}>
    <T.CylinderGeometry args={[0.14, 0.14, 0.12, 32]} />
    <T.MeshStandardMaterial color="#94a3b8" metalness={0.2} roughness={0.45} />
  </T.Mesh>

  <T.Mesh position={[-0.45, 0.42, 1.04]} rotation.x={Math.PI / 2}>
    <T.TorusGeometry args={[0.18, 0.02, 16, 32]} />
    <T.MeshStandardMaterial
      color={isPlaying ? '#0284c7' : '#94a3b8'}
      emissive={isPlaying ? '#0284c7' : '#64748b'}
      emissiveIntensity={isPlaying ? 1.0 : 0.2}
      roughness={0.4}
      metalness={0.1}
    />
  </T.Mesh>

  <!-- Bass Port -->
  <T.Mesh position={[0.45, 0.42, 1.0]} rotation.x={Math.PI / 2}>
    <T.CylinderGeometry args={[0.16, 0.16, 0.15, 24]} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.1} />
  </T.Mesh>

  <!-- Feet -->
  {#each [-0.75, 0.75] as x}
    {#each [-0.75, 0.75] as z}
      <T.Mesh position={[x, 0.04, z]}>
        <T.CylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
        <T.MeshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.1} />
      </T.Mesh>
    {/each}
  {/each}
</T.Group>
