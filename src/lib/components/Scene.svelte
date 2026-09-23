<script lang="ts">
  import { T, useThrelte } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { PCFShadowMap } from 'three';
  import Monitor from './hardware/Monitor.svelte';
  import Keyboard from './hardware/Keyboard.svelte';
  import Mouse from './hardware/Mouse.svelte';
  import Cpu from './hardware/Cpu.svelte';
  import Ram from './hardware/Ram.svelte';
  import Ssd from './hardware/Ssd.svelte';
  import Gpu from './hardware/Gpu.svelte';
  import Harddisk from './hardware/Harddisk.svelte';
  import Speaker from './hardware/Speaker.svelte';
  import Printer from './hardware/Printer.svelte';

  const { renderer } = useThrelte();
  if (renderer) {
    renderer.shadowMap.type = PCFShadowMap;
  }

  let {
    selectedId = 'monitor',
    ssdVariant = 'm2',
    gpuVariant = 'dedicated',
    onVariantChange,
    onGpuVariantChange
  }: {
    selectedId: string;
    ssdVariant?: 'm2' | 'sata';
    gpuVariant?: 'integrated' | 'dedicated';
    onVariantChange?: (v: 'm2' | 'sata') => void;
    onGpuVariantChange?: (v: 'integrated' | 'dedicated') => void;
  } = $props();
</script>

<!-- Camera with Smooth Orbit Controls -->
<T.PerspectiveCamera makeDefault position={[0, 3, 6]} fov={45}>
  <OrbitControls
    enableDamping
    dampingFactor={0.05}
    minDistance={2}
    maxDistance={15}
    autoRotate
    autoRotateSpeed={0.8}
    maxPolarAngle={Math.PI / 2 + 0.05}
  />
</T.PerspectiveCamera>

<!-- ============================================== -->
<!-- BRIGHT STUDIO LIGHTING SETUP -->
<!-- ============================================== -->
<!-- 1. Ambient Light (Intensitas 0.9 merata) -->
<T.AmbientLight color="#ffffff" intensity={0.9} />

<!-- 2. Hemisphere Light (Langit putih bersih & pantulan lantai abu-abu) -->
<T.HemisphereLight
  args={['#ffffff', '#cbd5e1', 1.0]}
  position={[0, 20, 0]}
/>

<!-- 3. Key Directional Light (Intensitas 1.5 sudut atas depan) -->
<T.DirectionalLight
  position={[6, 10, 7]}
  intensity={1.5}
  castShadow
  color="#ffffff"
/>

<!-- 4. Fill Directional Light (Sisi berlawanan untuk bayangan lembut) -->
<T.DirectionalLight
  position={[-6, 6, -4]}
  intensity={0.8}
  color="#f8fafc"
/>

<!-- 5. Front Gentle Fill Light -->
<T.DirectionalLight
  position={[0, 2, 8]}
  intensity={0.6}
  color="#ffffff"
/>

<!-- Hardware Component Display Switcher -->
<T.Group position={[0, 0, 0]}>
  {#if selectedId === 'monitor'}
    <Monitor />
  {:else if selectedId === 'keyboard'}
    <Keyboard />
  {:else if selectedId === 'mouse'}
    <Mouse />
  {:else if selectedId === 'cpu'}
    <Cpu />
  {:else if selectedId === 'ram'}
    <Ram />
  {:else if selectedId === 'gpu'}
    <Gpu {gpuVariant} onVariantChange={onGpuVariantChange} />
  {:else if selectedId === 'ssd'}
    <Ssd {ssdVariant} {onVariantChange} />
  {:else if selectedId === 'harddisk'}
    <Harddisk />
  {:else if selectedId === 'speaker'}
    <Speaker />
  {:else if selectedId === 'printer'}
    <Printer />
  {/if}
</T.Group>


<!-- Soft Studio Floor (Abu-abu terang bersih #f1f5f9) -->
<T.Mesh position={[0, -0.05, 0]} rotation.x={-Math.PI / 2} receiveShadow>
  <T.PlaneGeometry args={[30, 30]} />
  <T.MeshStandardMaterial color="#f1f5f9" roughness={0.6} metalness={0.05} />
</T.Mesh>

<!-- Circular Clean Pedestal Ring Accent -->
<T.Mesh position={[0, -0.04, 0]} rotation.x={Math.PI / 2}>
  <T.RingGeometry args={[2.2, 2.26, 64]} />
  <T.MeshBasicMaterial color="#0284c7" transparent opacity={0.35} />
</T.Mesh>
