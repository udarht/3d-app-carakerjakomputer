<script lang="ts">
  import { onMount } from 'svelte';
  import { T, useThrelte } from '@threlte/core';
  import { OrbitControls, ContactShadows } from '@threlte/extras';
  import * as THREE from 'three';
  import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
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

  const { renderer, scene } = useThrelte();

  onMount(() => {
    if (!renderer || !scene) return;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.65;

    return () => {
      envTarget.dispose();
      roomEnv.dispose();
      pmremGenerator.dispose();
    };
  });

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
<T.PerspectiveCamera makeDefault position={[0, 2.8, 5.8]} fov={42}>
  <OrbitControls
    enableDamping
    dampingFactor={0.05}
    minDistance={2.2}
    maxDistance={14}
    autoRotate
    autoRotateSpeed={0.7}
    target={[0, 0.65, 0]}
    maxPolarAngle={Math.PI / 2 - 0.02}
  />
</T.PerspectiveCamera>

<!-- ============================================== -->
<!-- REALISTIC PBR STUDIO LIGHTING SETUP -->
<!-- ============================================== -->
<!-- 1. Soft Ambient Base -->
<T.AmbientLight color="#f8fafc" intensity={0.55} />

<!-- 2. Studio Hemisphere Light (Cool skylight & warm-gray floor bounce) -->
<T.HemisphereLight args={['#ffffff', '#cbd5e1', 0.85]} position={[0, 18, 0]} />

<!-- 3. Main Key Directional Light with High-Res Soft Shadow Map -->
<T.DirectionalLight
  position={[5.5, 9.5, 6.5]}
  intensity={1.65}
  castShadow
  color="#fffaf0"
  shadow.mapSize.width={2048}
  shadow.mapSize.height={2048}
  shadow.camera.near={0.5}
  shadow.camera.far={25}
  shadow.camera.left={-4.5}
  shadow.camera.right={4.5}
  shadow.camera.top={4.5}
  shadow.camera.bottom={-4.5}
  shadow.bias={-0.0005}
/>

<!-- 4. Cool Rim / Backlight for Metallic Edge Definition -->
<T.DirectionalLight position={[-6, 6, -5]} intensity={0.9} color="#e0f2fe" />

<!-- 5. Front Gentle Fill Light -->
<T.DirectionalLight position={[0, 2.5, 8]} intensity={0.5} color="#ffffff" />

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

<!-- Soft Contact Shadows directly underneath the 3D Hardware -->
<ContactShadows
  position={[0, -0.01, 0]}
  opacity={0.42}
  scale={9}
  blur={2.2}
  far={4.5}
  resolution={512}
  color="#0f172a"
/>

<!-- Brushed Studio Showcase Pedestal -->
<T.Group position={[0, -0.06, 0]}>
  <!-- Main Turntable Platform -->
  <T.Mesh position={[0, 0, 0]} receiveShadow>
    <T.CylinderGeometry args={[2.35, 2.48, 0.08, 64]} />
    <T.MeshPhysicalMaterial
      color="#f8fafc"
      roughness={0.35}
      metalness={0.15}
      clearcoat={0.25}
      clearcoatRoughness={0.2}
    />
  </T.Mesh>

  <!-- Metallic Anodized Outer Bevel Ring -->
  <T.Mesh position={[0, 0.042, 0]} rotation.x={Math.PI / 2}>
    <T.RingGeometry args={[2.22, 2.34, 64]} />
    <T.MeshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.8} />
  </T.Mesh>

  <!-- Glowing Cyan Telemetry Ring -->
  <T.Mesh position={[0, 0.044, 0]} rotation.x={Math.PI / 2}>
    <T.RingGeometry args={[2.17, 2.21, 64]} />
    <T.MeshBasicMaterial color="#0284c7" transparent opacity={0.55} />
  </T.Mesh>
</T.Group>

<!-- Infinite Studio Backdrop Floor -->
<T.Mesh position={[0, -0.1, 0]} rotation.x={-Math.PI / 2} receiveShadow>
  <T.PlaneGeometry args={[45, 45]} />
  <T.MeshStandardMaterial color="#e2e8f0" roughness={0.75} metalness={0.05} />
</T.Mesh>
