<script lang="ts">
  import { T, useTask, useThrelte } from '@threlte/core';
  import { OrbitControls, interactivity } from '@threlte/extras';
  import * as THREE from 'three';
  import Keyboard from './hardware/Keyboard.svelte';
  import Cpu from './hardware/Cpu.svelte';
  import Ram from './hardware/Ram.svelte';
  import Ssd from './hardware/Ssd.svelte';
  import Monitor from './hardware/Monitor.svelte';

  const { renderer } = useThrelte();
  if (renderer) {
    renderer.shadowMap.type = THREE.PCFShadowMap;
  }

  interactivity();

  let {
    activeStep = 1,
    inputText = 'Halo Komputer!',
    isCpuProcessing = false,
    isRamProcessing = false,
    isIgpuProcessing = false,
    isSignalKbToCpu = false,
    isSignalCpuToMonitor = false,
    isSignalRamToSsd = false,
    showMonitorText = false,
    ssdSaved = false
  }: {
    activeStep?: number;
    inputText?: string;
    isCpuProcessing?: boolean;
    isRamProcessing?: boolean;
    isIgpuProcessing?: boolean;
    isSignalKbToCpu?: boolean;
    isSignalCpuToMonitor?: boolean;
    isSignalRamToSsd?: boolean;
    showMonitorText?: boolean;
    ssdSaved?: boolean;
  } = $props();

  // Positions on desk
  const KB_POS: [number, number, number] = [0, 0, 2.2];
  const CPU_POS: [number, number, number] = [-1.5, 0.12, 0];
  const RAM_POS: [number, number, number] = [0.5, 0.5, 0];
  const SSD_POS: [number, number, number] = [2.5, 0.1, 0];
  const MONITOR_POS: [number, number, number] = [-0.1, 0, -2.6];

  // Progress variables [0 to 1]
  let kbSignalT = $state(0);
  let monitorSignalT = $state(0);
  let ssdSignalT = $state(0);
  let pulseTime = $state(0);

  // Curve paths for visual signals / data bus
  const kbToCpuCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.35, 1.4),
    new THREE.Vector3(-0.8, 0.55, 0.7),
    new THREE.Vector3(-1.5, 0.35, 0.1)
  ]);

  const cpuToMonitorCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.5, 0.35, -0.2),
    new THREE.Vector3(-0.8, 1.1, -1.5),
    new THREE.Vector3(-0.1, 1.5, -2.4)
  ]);

  const ramToSsdCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.5, 0.3, 0),
    new THREE.Vector3(1.5, 0.5, 0.05),
    new THREE.Vector3(2.5, 0.25, 0)
  ]);

  // Animate signals and glow pulsing
  useTask((delta) => {
    pulseTime += delta * 4;

    if (isSignalKbToCpu) {
      kbSignalT = (kbSignalT + delta * 1.8) % 1;
    } else {
      kbSignalT = 0;
    }

    if (isSignalCpuToMonitor) {
      monitorSignalT = (monitorSignalT + delta * 1.8) % 1;
    } else {
      monitorSignalT = 0;
    }

    if (isSignalRamToSsd) {
      ssdSignalT = (ssdSignalT + delta * 1.8) % 1;
    } else {
      ssdSignalT = 0;
    }
  });

  // Calculate moving packet positions
  let kbPacketPos = $derived(kbToCpuCurve.getPoint(kbSignalT));
  let monitorPacketPos = $derived(cpuToMonitorCurve.getPoint(monitorSignalT));
  let ssdPacketPos = $derived(ramToSsdCurve.getPoint(ssdSignalT));

  let glowIntensity = $derived(Math.sin(pulseTime) * 0.4 + 0.6);
</script>

<!-- Camera Setup for Desk Overview -->
<T.PerspectiveCamera makeDefault position={[0, 7.5, 9.5]} fov={42}>
  <OrbitControls
    enableDamping
    dampingFactor={0.05}
    minDistance={4}
    maxDistance={20}
    target={[0, 0.8, -0.4]}
    maxPolarAngle={Math.PI / 2.05}
  />
</T.PerspectiveCamera>

<!-- Lighting -->
<T.AmbientLight color="#ffffff" intensity={0.9} />
<T.HemisphereLight args={['#ffffff', '#cbd5e1', 0.9]} position={[0, 20, 0]} />
<T.DirectionalLight position={[6, 12, 8]} intensity={1.4} castShadow color="#ffffff" />
<T.DirectionalLight position={[-6, 8, -4]} intensity={0.7} color="#f8fafc" />
<T.DirectionalLight position={[0, 3, 7]} intensity={0.5} color="#ffffff" />

<!-- Studio Floor -->
<T.Mesh position={[0, -0.6, 0]} rotation.x={-Math.PI / 2} receiveShadow>
  <T.PlaneGeometry args={[40, 40]} />
  <T.MeshStandardMaterial color="#f1f5f9" roughness={0.65} metalness={0.05} />
</T.Mesh>

<!-- Grid pattern on floor -->
<T.GridHelper args={[30, 30, '#cbd5e1', '#e2e8f0']} position={[0, -0.58, 0]} />

<!-- ============================================== -->
<!-- WORKBENCH / DESK (Meja Kerja Simulasi) -->
<!-- ============================================== -->
<T.Group position={[0, -0.1, -0.3]}>
  <!-- Desktop Top Plate -->
  <T.Mesh position={[0, 0, 0]} receiveShadow castShadow>
    <T.BoxGeometry args={[9.4, 0.2, 7.2]} />
    <T.MeshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.25} />
  </T.Mesh>

  <!-- Desk Edge Highlight Bevel -->
  <T.Mesh position={[0, 0.105, 0]}>
    <T.BoxGeometry args={[9.44, 0.01, 7.24]} />
    <T.MeshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.4} transparent opacity={0.4} />
  </T.Mesh>

  <!-- Desk Mat / Mousepad Area -->
  <T.Mesh position={[0, 0.105, 0.2]}>
    <T.BoxGeometry args={[8.4, 0.01, 6.2]} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.1} />
  </T.Mesh>

  <!-- Desk Legs (Futuristic Pedestal) -->
  <T.Mesh position={[-4.2, -1.8, 0]} castShadow>
    <T.BoxGeometry args={[0.3, 3.4, 6.4]} />
    <T.MeshStandardMaterial color="#334155" roughness={0.5} metalness={0.3} />
  </T.Mesh>
  <T.Mesh position={[4.2, -1.8, 0]} castShadow>
    <T.BoxGeometry args={[0.3, 3.4, 6.4]} />
    <T.MeshStandardMaterial color="#334155" roughness={0.5} metalness={0.3} />
  </T.Mesh>
</T.Group>

<!-- ============================================== -->
<!-- UNIFIED MOTHERBOARD WORKBENCH / ALAS KERJA TUNGGAL -->
<!-- ============================================== -->
<!-- Alas Motherboard Tunggal Memanjang di Bawah CPU, RAM, dan SSD -->
<T.Group position={[0.5, 0.03, 0]}>
  <!-- Motherboard PCB Board (Hijau Tua Beraksen Sirkuit Elegan) -->
  <T.Mesh position={[0, 0, 0]} receiveShadow>
    <T.BoxGeometry args={[6.8, 0.05, 2.6]} />
    <T.MeshStandardMaterial
      color="#0f291e"
      roughness={0.45}
      metalness={0.2}
    />
  </T.Mesh>

  <!-- Motherboard Golden Traces / Circuit Edge Accent -->
  <T.Mesh position={[0, 0.026, 0]}>
    <T.BoxGeometry args={[6.72, 0.005, 2.52]} />
    <T.MeshStandardMaterial
      color="#d97706"
      metalness={0.4}
      roughness={0.3}
      transparent
      opacity={0.35}
    />
  </T.Mesh>
  
  <!-- Outer Motherboard Neon Border Glow -->
  <T.Mesh position={[0, 0.028, 0]}>
    <T.BoxGeometry args={[6.82, 0.002, 2.62]} />
    <T.MeshStandardMaterial
      color="#38bdf8"
      emissive="#0284c7"
      emissiveIntensity={0.4}
      roughness={0.3}
    />
  </T.Mesh>
</T.Group>

<!-- ============================================== -->
<!-- CIRCUIT BOARD BUS LINES (Jalur Data Bus di Meja) -->
<!-- ============================================== -->
<T.Group position={[0, 0.065, 0]}>
  <!-- Bus 1: Keyboard -> CPU -->
  <T.Mesh position={[-0.75, 0, 1.1]} rotation.y={-0.4}>
    <T.BoxGeometry args={[0.12, 0.01, 2.2]} />
    <T.MeshStandardMaterial
      color={isSignalKbToCpu ? '#0284c7' : '#334155'}
      emissive={isSignalKbToCpu ? '#38bdf8' : '#000000'}
      emissiveIntensity={isSignalKbToCpu ? 0.9 : 0}
      roughness={0.3}
    />
  </T.Mesh>

  <!-- Bus 2: CPU <-> RAM (Jalur Data Bus Antar Komponen di Motherboard) -->
  <T.Mesh position={[-0.5, 0, 0]}>
    <T.BoxGeometry args={[1.7, 0.01, 0.16]} />
    <T.MeshStandardMaterial
      color={isCpuProcessing || isRamProcessing ? '#a855f7' : '#334155'}
      emissive={isCpuProcessing || isRamProcessing ? '#c084fc' : '#000000'}
      emissiveIntensity={isCpuProcessing || isRamProcessing ? 0.9 : 0}
      roughness={0.3}
    />
  </T.Mesh>

  <!-- Bus 3: CPU -> Monitor -->
  <T.Mesh position={[-0.8, 0, -1.3]} rotation.y={0.42}>
    <T.BoxGeometry args={[0.12, 0.01, 2.6]} />
    <T.MeshStandardMaterial
      color={isSignalCpuToMonitor ? '#16a34a' : '#334155'}
      emissive={isSignalCpuToMonitor ? '#4ade80' : '#000000'}
      emissiveIntensity={isSignalCpuToMonitor ? 0.9 : 0}
      roughness={0.3}
    />
  </T.Mesh>

  <!-- Bus 4: RAM -> SSD -->
  <T.Mesh position={[1.5, 0, 0]}>
    <T.BoxGeometry args={[1.7, 0.01, 0.16]} />
    <T.MeshStandardMaterial
      color={isSignalRamToSsd || ssdSaved ? '#eab308' : '#334155'}
      emissive={isSignalRamToSsd || ssdSaved ? '#facc15' : '#000000'}
      emissiveIntensity={isSignalRamToSsd ? 1.0 : ssdSaved ? 0.5 : 0}
      roughness={0.3}
    />
  </T.Mesh>
</T.Group>

<!-- ============================================== -->
<!-- COMPONENT 1: KEYBOARD (Input) -->
<!-- ============================================== -->
<T.Group position={KB_POS} scale={0.92}>
  <Keyboard />

  <!-- Pedestal Aura / Label ring -->
  <T.Mesh position={[0, 0.01, 0]} rotation.x={Math.PI / 2}>
    <T.RingGeometry args={[1.9, 1.98, 48]} />
    <T.MeshBasicMaterial
      color="#0284c7"
      transparent
      opacity={activeStep === 1 || isSignalKbToCpu ? 0.9 : 0.25}
    />
  </T.Mesh>
</T.Group>

<!-- ============================================== -->
<!-- COMPONENT 2: CPU (Process - Tengah-Kiri) -->
<!-- ============================================== -->
<!-- Mendatar dengan IHS menghadap ke atas, scale proporsional terhadap keyboard -->
<T.Group position={CPU_POS} scale={0.65}>
  <Cpu
    position={[0, 0.04, 0]}
    rotation={[0, 0, 0]}
    autoRotate={false}
    showIgpuCore={true}
    isIgpuActive={isIgpuProcessing}
  />

  <!-- CPU Socket Latch Frame pada Motherboard -->
  <T.Mesh position={[0, 0.01, 0]}>
    <T.BoxGeometry args={[3.2, 0.04, 3.2]} />
    <T.MeshStandardMaterial color="#334155" roughness={0.4} metalness={0.3} />
  </T.Mesh>

  <!-- CPU Socket Glow Pulse when general processing -->
  {#if isCpuProcessing}
    <T.Mesh position={[0, 0.04, 0]}>
      <T.BoxGeometry args={[3.3, 0.05, 3.3]} />
      <T.MeshBasicMaterial
        color="#a855f7"
        transparent
        opacity={0.35 * glowIntensity}
      />
    </T.Mesh>
    <!-- CPU Activity Light -->
    <T.PointLight position={[0, 1.0, 0]} color="#a855f7" intensity={3.5 * glowIntensity} distance={3.0} />
  {/if}

  <!-- CPU iGPU Graphics Glow Pulse when rendering -->
  {#if isIgpuProcessing}
    <T.Mesh position={[0, 0.04, 0]}>
      <T.BoxGeometry args={[3.35, 0.055, 3.35]} />
      <T.MeshBasicMaterial
        color="#00f0ff"
        transparent
        opacity={0.45 * glowIntensity}
      />
    </T.Mesh>
    <T.PointLight position={[0, 1.2, 0]} color="#00f0ff" intensity={4.5 * glowIntensity} distance={3.5} />
  {/if}

  <!-- Pedestal Aura / Label ring -->
  <T.Mesh position={[0, 0.01, 0]} rotation.x={Math.PI / 2}>
    <T.RingGeometry args={[1.8, 1.88, 48]} />
    <T.MeshBasicMaterial
      color={isIgpuProcessing || activeStep === 3 ? '#00f0ff' : '#a855f7'}
      transparent
      opacity={activeStep === 2 || activeStep === 3 || isCpuProcessing || isIgpuProcessing ? 0.9 : 0.25}
    />
  </T.Mesh>
</T.Group>

<!-- ============================================== -->
<!-- COMPONENT 3: RAM (Memory - Tengah) -->
<!-- ============================================== -->
<!-- Berdiri tegak menghadap ke arah kamera, di kanan CPU -->
<T.Group position={RAM_POS} scale={0.58} rotation={[0, 0, 0]}>
  <Ram position={[0, 0.72, 0]} rotation={[0, 0, 0]} autoRotate={false} />

  <!-- RAM DIMM Slot Socket pada Motherboard -->
  <T.Mesh position={[0, 0.03, 0]}>
    <T.BoxGeometry args={[4.2, 0.1, 0.45]} />
    <T.MeshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
  </T.Mesh>

  <!-- RAM Activity Glow Pulse when processing -->
  {#if isRamProcessing}
    <T.PointLight position={[0, 0.8, 0.5]} color="#38bdf8" intensity={3.0 * glowIntensity} distance={2.5} />
  {/if}

  <!-- Pedestal Aura -->
  <T.Mesh position={[0, 0.01, 0]} rotation.x={Math.PI / 2}>
    <T.RingGeometry args={[1.6, 1.68, 48]} />
    <T.MeshBasicMaterial
      color="#06b6d4"
      transparent
      opacity={activeStep === 2 || isRamProcessing ? 0.9 : 0.25}
    />
  </T.Mesh>
</T.Group>

<!-- ============================================== -->
<!-- COMPONENT 4: MONITOR (Output - Belakang) -->
<!-- ============================================== -->
<T.Group position={MONITOR_POS} scale={0.88}>
  <Monitor />

  <!-- Monitor Screen Text Overlay Simulation -->
  {#if showMonitorText}
    <T.Group position={[0, 1.7, 0.05]}>
      <!-- Screen Backdrop Accent Banner -->
      <T.Mesh position={[0, 0, 0]}>
        <T.BoxGeometry args={[3.2, 1.2, 0.01]} />
        <T.MeshBasicMaterial color="#0284c7" />
      </T.Mesh>

      <!-- Inner Display Window -->
      <T.Mesh position={[0, 0, 0.01]}>
        <T.BoxGeometry args={[3.0, 1.0, 0.01]} />
        <T.MeshBasicMaterial color="#0f172a" />
      </T.Mesh>

      <!-- Terminal Header Bar -->
      <T.Mesh position={[0, 0.36, 0.02]}>
        <T.BoxGeometry args={[2.9, 0.16, 0.005]} />
        <T.MeshBasicMaterial color="#1e293b" />
      </T.Mesh>

      <!-- Window control dots -->
      <T.Mesh position={[-1.25, 0.36, 0.025]}>
        <T.SphereGeometry args={[0.04, 12, 12]} />
        <T.MeshBasicMaterial color="#ef4444" />
      </T.Mesh>
      <T.Mesh position={[-1.12, 0.36, 0.025]}>
        <T.SphereGeometry args={[0.04, 12, 12]} />
        <T.MeshBasicMaterial color="#eab308" />
      </T.Mesh>
      <T.Mesh position={[-0.99, 0.36, 0.025]}>
        <T.SphereGeometry args={[0.04, 12, 12]} />
        <T.MeshBasicMaterial color="#22c55e" />
      </T.Mesh>

      <!-- Text representation bars & glowing output -->
      <T.Mesh position={[0, 0.05, 0.02]}>
        <T.BoxGeometry args={[2.4, 0.22, 0.005]} />
        <T.MeshBasicMaterial color="#38bdf8" />
      </T.Mesh>

      <T.Mesh position={[0, -0.22, 0.02]}>
        <T.BoxGeometry args={[1.8, 0.14, 0.005]} />
        <T.MeshBasicMaterial color="#22c55e" />
      </T.Mesh>

      <!-- Screen glow light -->
      <T.PointLight position={[0, 0, 0.8]} color="#38bdf8" intensity={2.2} distance={3.0} />
    </T.Group>
  {/if}

  <!-- Pedestal Aura -->
  <T.Mesh position={[0, 0.01, 0]} rotation.x={Math.PI / 2}>
    <T.RingGeometry args={[1.5, 1.58, 48]} />
    <T.MeshBasicMaterial
      color="#16a34a"
      transparent
      opacity={activeStep === 4 || isSignalCpuToMonitor ? 0.9 : 0.25}
    />
  </T.Mesh>
</T.Group>

<!-- ============================================== -->
<!-- COMPONENT 5: SSD (Storage - Kanan RAM) -->
<!-- ============================================== -->
<!-- Baring mendatar sejajar meja, tanpa rotasi miring, showOverlay=false agar UI tidak tumpang tindih -->
<T.Group position={SSD_POS} scale={0.65} rotation={[0, 0, 0]}>
  <Ssd position={[0, 0.05, 0]} rotation={[0, 0, 0]} autoRotate={false} showOverlay={false} />

  <!-- M.2 SSD Slot Heatsink Tray pada Motherboard -->
  <T.Mesh position={[0, 0.01, 0]}>
    <T.BoxGeometry args={[3.4, 0.03, 1.5]} />
    <T.MeshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.3} />
  </T.Mesh>

  <!-- SSD Saved Glow Indicator -->
  {#if ssdSaved}
    <T.PointLight position={[0, 0.5, 0]} color="#10b981" intensity={3.0} distance={2.5} />
  {:else if isSignalRamToSsd}
    <T.PointLight position={[0, 0.5, 0]} color="#eab308" intensity={2.8 * glowIntensity} distance={2.5} />
  {/if}

  <!-- Pedestal Aura -->
  <T.Mesh position={[0, 0.01, 0]} rotation.x={Math.PI / 2}>
    <T.RingGeometry args={[1.4, 1.48, 48]} />
    <T.MeshBasicMaterial
      color="#eab308"
      transparent
      opacity={activeStep === 5 || isSignalRamToSsd || ssdSaved ? 0.9 : 0.25}
    />
  </T.Mesh>
</T.Group>

<!-- ============================================== -->
<!-- FLYING DATA PACKETS / PARTICLES (Sinyal Animasi) -->
<!-- ============================================== -->
<!-- 1. Packet Keyboard -> CPU -->
{#if isSignalKbToCpu}
  <T.Mesh position={[kbPacketPos.x, kbPacketPos.y, kbPacketPos.z]}>
    <T.SphereGeometry args={[0.18, 16, 16]} />
    <T.MeshBasicMaterial color="#38bdf8" />
  </T.Mesh>
  <T.PointLight
    position={[kbPacketPos.x, kbPacketPos.y, kbPacketPos.z]}
    color="#38bdf8"
    intensity={3.5}
    distance={2.5}
  />
{/if}

<!-- 2. Packet CPU -> Monitor -->
{#if isSignalCpuToMonitor}
  <T.Mesh position={[monitorPacketPos.x, monitorPacketPos.y, monitorPacketPos.z]}>
    <T.SphereGeometry args={[0.2, 16, 16]} />
    <T.MeshBasicMaterial color="#4ade80" />
  </T.Mesh>
  <T.PointLight
    position={[monitorPacketPos.x, monitorPacketPos.y, monitorPacketPos.z]}
    color="#4ade80"
    intensity={3.5}
    distance={2.5}
  />
{/if}

<!-- 3. Packet RAM -> SSD -->
{#if isSignalRamToSsd}
  <T.Mesh position={[ssdPacketPos.x, ssdPacketPos.y, ssdPacketPos.z]}>
    <T.SphereGeometry args={[0.18, 16, 16]} />
    <T.MeshBasicMaterial color="#facc15" />
  </T.Mesh>
  <T.PointLight
    position={[ssdPacketPos.x, ssdPacketPos.y, ssdPacketPos.z]}
    color="#facc15"
    intensity={3.5}
    distance={2.5}
  />
{/if}
