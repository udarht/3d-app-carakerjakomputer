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

  let isPrinting = $state(true);
  let hovered = $state(false);
  let paperZ = $state(0);

  useTask((delta) => {
    if (isPrinting) {
      paperZ = (paperZ + delta * 0.4) % 0.6;
    }
  });

  function togglePrint(e: any) {
    e.stopPropagation();
    isPrinting = !isPrinting;
  }
</script>

<T.Group
  {position}
  {rotation}
  scale={hovered ? 1.02 : 1}
  onpointerenter={() => (hovered = true)}
  onpointerleave={() => (hovered = false)}
  onclick={togglePrint}
>
  <!-- Main Housing -->
  <T.Mesh position={[0, 0.65, 0]}>
    <T.BoxGeometry args={[3.4, 1.15, 2.4]} />
    <T.MeshStandardMaterial
      color="#ffffff"
      roughness={0.45}
      metalness={0.1}
    />
  </T.Mesh>

  <!-- Bottom Rim -->
  <T.Mesh position={[0, 0.08, 0]}>
    <T.BoxGeometry args={[3.45, 0.12, 2.45]} />
    <T.MeshStandardMaterial color="#334155" roughness={0.5} metalness={0.15} />
  </T.Mesh>

  <!-- Paper Exit Slot -->
  <T.Mesh position={[0, 0.45, 1.21]}>
    <T.BoxGeometry args={[2.5, 0.22, 0.04]} />
    <T.MeshStandardMaterial color="#1e293b" roughness={0.6} />
  </T.Mesh>

  <!-- Catch Tray -->
  <T.Mesh position={[0, 0.22, 1.5]} rotation.x={0.08}>
    <T.BoxGeometry args={[2.3, 0.06, 1.2]} />
    <T.MeshStandardMaterial color="#475569" roughness={0.5} metalness={0.15} />
  </T.Mesh>

  <!-- Flap -->
  <T.Mesh position={[0, 0.27, 2.1]} rotation.x={0.3}>
    <T.BoxGeometry args={[1.8, 0.05, 0.3]} />
    <T.MeshStandardMaterial color="#64748b" roughness={0.5} metalness={0.15} />
  </T.Mesh>

  <!-- Printed Paper -->
  <T.Mesh position={[0, 0.26, 1.35 + (isPrinting ? paperZ : 0.3)]} rotation.x={0.08}>
    <T.BoxGeometry args={[1.8, 0.012, 1.4]} />
    <T.MeshStandardMaterial color="#ffffff" roughness={0.8} metalness={0.05} />
  </T.Mesh>

  <!-- Printed Graphics -->
  <T.Mesh position={[0, 0.275, 1.35 + (isPrinting ? paperZ : 0.3)]} rotation.x={0.08}>
    <T.BoxGeometry args={[1.4, 0.008, 0.9]} />
    <T.MeshStandardMaterial
      color="#2563eb"
      roughness={0.5}
      metalness={0.05}
      emissive={isPrinting ? '#38bdf8' : '#1d4ed8'}
      emissiveIntensity={isPrinting ? 0.5 : 0.2}
    />
  </T.Mesh>

  <!-- Input Feeder Tray -->
  <T.Mesh position={[0, 1.45, -0.92]} rotation.x={-0.42}>
    <T.BoxGeometry args={[2.3, 1.1, 0.08]} />
    <T.MeshStandardMaterial color="#475569" roughness={0.5} metalness={0.15} />
  </T.Mesh>

  <!-- Paper Width Guides -->
  <T.Mesh position={[-0.95, 1.45, -0.88]} rotation.x={-0.42}>
    <T.BoxGeometry args={[0.08, 0.9, 0.06]} />
    <T.MeshStandardMaterial color="#94a3b8" metalness={0.2} roughness={0.5} />
  </T.Mesh>
  <T.Mesh position={[0.95, 1.45, -0.88]} rotation.x={-0.42}>
    <T.BoxGeometry args={[0.08, 0.9, 0.06]} />
    <T.MeshStandardMaterial color="#94a3b8" metalness={0.2} roughness={0.5} />
  </T.Mesh>

  <!-- Blank Paper Stack -->
  <T.Mesh position={[0, 1.5, -0.87]} rotation.x={-0.42}>
    <T.BoxGeometry args={[1.82, 1.0, 0.05]} />
    <T.MeshStandardMaterial color="#ffffff" roughness={0.7} metalness={0.05} />
  </T.Mesh>

  <!-- Flatbed Scanner Glass Bed Cover -->
  <T.Mesh position={[0, 1.25, 0.05]}>
    <T.BoxGeometry args={[3.32, 0.08, 2.15]} />
    <T.MeshStandardMaterial color="#334155" roughness={0.45} metalness={0.2} />
  </T.Mesh>

  <!-- Handle -->
  <T.Mesh position={[0, 1.26, 1.05]}>
    <T.BoxGeometry args={[0.8, 0.03, 0.08]} />
    <T.MeshStandardMaterial color="#64748b" metalness={0.2} roughness={0.5} />
  </T.Mesh>

  <!-- Control Touch Display Screen -->
  <T.Mesh position={[1.15, 1.31, 0.72]} rotation.x={-0.25}>
    <T.BoxGeometry args={[0.75, 0.04, 0.52]} />
    <T.MeshStandardMaterial
      color={isPrinting ? '#0f172a' : '#1e293b'}
      emissive={isPrinting ? '#0284c7' : '#0369a1'}
      emissiveIntensity={isPrinting ? 0.7 : 0.3}
      roughness={0.4}
      metalness={0.1}
    />
  </T.Mesh>

  <!-- Power Status Button Indicator -->
  <T.Mesh position={[0.55, 1.31, 0.72]}>
    <T.SphereGeometry args={[0.045, 16, 16]} />
    <T.MeshStandardMaterial
      color={isPrinting ? '#10b981' : '#ef4444'}
      emissive={isPrinting ? '#10b981' : '#ef4444'}
      emissiveIntensity={1.8}
      roughness={0.3}
      metalness={0.1}
    />
  </T.Mesh>

  <!-- Transparent Ink Tank Window Casing -->
  <T.Mesh position={[1.2, 0.55, 1.2]}>
    <T.BoxGeometry args={[0.65, 0.45, 0.08]} />
    <T.MeshStandardMaterial color="#334155" roughness={0.3} metalness={0.1} transparent opacity={0.8} />
  </T.Mesh>

  <!-- Individual Ink Level Vials (Cyan, Magenta, Yellow, Black) -->
  {#each [-0.2, -0.07, 0.07, 0.2] as offset, idx}
    <T.Mesh position={[1.2 + offset, 0.52, 1.23]}>
      <T.BoxGeometry args={[0.08, 0.3, 0.02]} />
      <T.MeshStandardMaterial
        color={['#06b6d4', '#ec4899', '#eab308', '#0f172a'][idx]}
        emissive={['#06b6d4', '#ec4899', '#eab308', '#0284c7'][idx]}
        emissiveIntensity={isPrinting ? 0.7 : 0.3}
        roughness={0.3}
        metalness={0.1}
      />
    </T.Mesh>
  {/each}
</T.Group>
