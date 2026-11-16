<script lang="ts">
  import { onMount } from 'svelte';
  import { T, useTask, useThrelte } from '@threlte/core';
  import { OrbitControls, interactivity, RoundedBoxGeometry } from '@threlte/extras';
  import * as THREE from 'three';
  import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
  import { getPcbCircuitTexture } from '$lib/utils/textures';
  import Keyboard from './hardware/Keyboard.svelte';
  import Cpu from './hardware/Cpu.svelte';
  import Ram from './hardware/Ram.svelte';
  import Ssd from './hardware/Ssd.svelte';
  import Monitor from './hardware/Monitor.svelte';

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
    scene.environmentIntensity = 0.6;

    return () => {
      kbCableGeo.dispose();
      dpCableGeo.dispose();
      envTarget.dispose();
      roomEnv.dispose();
      pmremGenerator.dispose();
    };
  });

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

  const moboTex = getPcbCircuitTexture('#091e16', '#10b981');

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

  // Curve paths for visual signals & physical 3D cables
  const kbToCpuCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.08, 1.5),
    new THREE.Vector3(-0.65, 0.12, 1.15),
    new THREE.Vector3(-1.35, 0.14, 0.72),
    new THREE.Vector3(-1.5, 0.2, 0.15)
  ]);

  const cpuToMonitorCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.5, 0.2, -0.35),
    new THREE.Vector3(-1.25, 0.18, -1.35),
    new THREE.Vector3(-0.45, 0.55, -2.35),
    new THREE.Vector3(-0.1, 1.35, -2.55)
  ]);

  const ramToSsdCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.5, 0.28, 0),
    new THREE.Vector3(1.5, 0.42, 0.04),
    new THREE.Vector3(2.5, 0.22, 0)
  ]);

  const kbCableGeo = new THREE.TubeGeometry(kbToCpuCurve, 40, 0.028, 12, false);
  const dpCableGeo = new THREE.TubeGeometry(cpuToMonitorCurve, 48, 0.032, 12, false);

  // Animate signals and glow pulsing
  useTask((delta) => {
    pulseTime += delta * 4;

    if (isSignalKbToCpu) {
      kbSignalT = (kbSignalT + delta * 1.5) % 1;
    } else {
      kbSignalT = 0;
    }

    if (isSignalCpuToMonitor) {
      monitorSignalT = (monitorSignalT + delta * 1.5) % 1;
    } else {
      monitorSignalT = 0;
    }

    if (isSignalRamToSsd) {
      ssdSignalT = (ssdSignalT + delta * 1.5) % 1;
    } else {
      ssdSignalT = 0;
    }
  });

  // Staggered 3-packet streams for realistic digital bus pulse train
  const packetOffsets = [0, 0.18, 0.36];
  let kbPacketPositions = $derived(
    packetOffsets.map((off) => kbToCpuCurve.getPoint((kbSignalT + off) % 1))
  );
  let monitorPacketPositions = $derived(
    packetOffsets.map((off) => cpuToMonitorCurve.getPoint((monitorSignalT + off) % 1))
  );
  let ssdPacketPositions = $derived(
    packetOffsets.map((off) => ramToSsdCurve.getPoint((ssdSignalT + off) % 1))
  );

  let glowIntensity = $derived(Math.sin(pulseTime) * 0.4 + 0.6);
</script>

<!-- Camera Setup for Desk Overview -->
<T.PerspectiveCamera makeDefault position={[0, 7.4, 9.4]} fov={40}>
  <OrbitControls
    enableDamping
    dampingFactor={0.05}
    minDistance={4}
    maxDistance={20}
    target={[0, 0.8, -0.4]}
    maxPolarAngle={Math.PI / 2.05}
  />
</T.PerspectiveCamera>

<!-- Realistic PBR Studio Lighting -->
<T.AmbientLight color="#f8fafc" intensity={0.65} />
<T.HemisphereLight args={['#ffffff', '#cbd5e1', 0.85]} position={[0, 20, 0]} />
<T.DirectionalLight
  position={[6, 12, 8]}
  intensity={1.55}
  castShadow
  color="#fffaf0"
  shadow.mapSize.width={2048}
  shadow.mapSize.height={2048}
  shadow.camera.near={1}
  shadow.camera.far={30}
  shadow.camera.left={-7}
  shadow.camera.right={7}
  shadow.camera.top={7}
  shadow.camera.bottom={-7}
  shadow.bias={-0.0005}
/>
<T.DirectionalLight position={[-6, 8, -4]} intensity={0.8} color="#e0f2fe" />
<T.DirectionalLight position={[0, 3, 7]} intensity={0.45} color="#ffffff" />

<!-- Studio Floor -->
<T.Mesh position={[0, -0.6, 0]} rotation.x={-Math.PI / 2} receiveShadow>
  <T.PlaneGeometry args={[45, 45]} />
  <T.MeshStandardMaterial color="#f1f5f9" roughness={0.7} metalness={0.05} />
</T.Mesh>

<!-- Subtle Architectural Floor Grid -->
<T.GridHelper args={[32, 32, '#cbd5e1', '#e2e8f0']} position={[0, -0.58, 0]} />

<!-- ============================================== -->
<!-- 1. STUDIO WORKBENCH DESK (Meja Kerja Simulasi) -->
<!-- ============================================== -->
<T.Group position={[0, -0.1, -0.3]}>
  <!-- Ergonomic Matte Slate Tabletop -->
  <T.Mesh position={[0, 0, 0]} receiveShadow castShadow>
    <RoundedBoxGeometry args={[9.6, 0.22, 7.4]} radius={0.05} smoothness={4} />
    <T.MeshPhysicalMaterial
      color="#1e293b"
      roughness={0.35}
      metalness={0.28}
      clearcoat={0.2}
    />
  </T.Mesh>

  <!-- Anodized Cyan/Silver Chamfered Edge Strip -->
  <T.Mesh position={[0, 0.08, 0]}>
    <RoundedBoxGeometry args={[9.64, 0.025, 7.44]} radius={0.03} smoothness={3} />
    <T.MeshStandardMaterial color="#38bdf8" roughness={0.25} metalness={0.7} transparent opacity={0.45} />
  </T.Mesh>

  <!-- Large Stitched Microfiber Desk Mat -->
  <T.Mesh position={[0, 0.114, 0.22]} receiveShadow>
    <RoundedBoxGeometry args={[8.6, 0.015, 6.3]} radius={0.02} smoothness={3} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.78} metalness={0.08} />
  </T.Mesh>

  <!-- Cable Routing Grommet on Rear Desk Surface -->
  <T.Mesh position={[-1.25, 0.116, -2.0]} rotation.x={Math.PI / 2}>
    <T.RingGeometry args={[0.18, 0.26, 32]} />
    <T.MeshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
  </T.Mesh>

  <!-- Heavy-Duty Steel Desk Legs -->
  {#each [-4.3, 4.3] as lx}
    <T.Mesh position={[lx, -1.8, 0]} castShadow>
      <RoundedBoxGeometry args={[0.32, 3.4, 6.5]} radius={0.04} smoothness={3} />
      <T.MeshPhysicalMaterial color="#334155" roughness={0.4} metalness={0.65} />
    </T.Mesh>
  {/each}
</T.Group>

<!-- ============================================== -->
<!-- 2. UNIFIED ATX MOTHERBOARD TESTBENCH -->
<!-- ============================================== -->
<T.Group position={[0.5, 0.035, 0]}>
  <!-- Multi-Layer Fiberglass PCB Board with Copper Traces -->
  <T.Mesh position={[0, 0, 0]} receiveShadow castShadow>
    <RoundedBoxGeometry args={[6.95, 0.06, 2.75]} radius={0.03} smoothness={4} />
    <T.MeshPhysicalMaterial
      map={moboTex}
      color="#064e3b"
      roughness={0.38}
      metalness={0.25}
      clearcoat={0.28}
    />
  </T.Mesh>

  <!-- Brushed Aluminum VRM Heatsink Block (Left of CPU Socket) -->
  <T.Mesh position={[-3.12, 0.16, -0.1]} castShadow>
    <RoundedBoxGeometry args={[0.42, 0.26, 1.85]} radius={0.02} smoothness={3} />
    <T.MeshPhysicalMaterial color="#475569" metalness={0.85} roughness={0.24} />
  </T.Mesh>
  <!-- Top VRM Fin Block -->
  <T.Mesh position={[-2.0, 0.15, -1.12]} castShadow>
    <RoundedBoxGeometry args={[1.65, 0.24, 0.34]} radius={0.02} smoothness={3} />
    <T.MeshPhysicalMaterial color="#475569" metalness={0.85} roughness={0.24} />
  </T.Mesh>

  <!-- Solid Polymer VRM Capacitors & Ferrite Chokes next to CPU -->
  {#each [-0.55, -0.25, 0.05, 0.35, 0.65] as cz}
    <T.Mesh position={[-2.8, 0.09, cz]} castShadow>
      <T.CylinderGeometry args={[0.055, 0.055, 0.12, 16]} />
      <T.MeshPhysicalMaterial color="#cbd5e1" metalness={0.92} roughness={0.15} />
    </T.Mesh>
  {/each}

  <!-- CR2032 Silver CMOS Battery Cell -->
  <T.Mesh position={[0.85, 0.045, 0.95]}>
    <T.CylinderGeometry args={[0.18, 0.18, 0.03, 24]} />
    <T.MeshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
  </T.Mesh>

  <!-- 24-Pin ATX Main Power Header on Right Edge of Motherboard -->
  <T.Mesh position={[3.32, 0.1, -0.35]}>
    <T.BoxGeometry args={[0.18, 0.16, 1.15]} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.5} />
  </T.Mesh>

  <!-- Chipset (PCH) Brushed Heatsink near SSD -->
  <T.Mesh position={[1.95, 0.065, 0.88]} castShadow>
    <RoundedBoxGeometry args={[0.85, 0.08, 0.65]} radius={0.015} smoothness={3} />
    <T.MeshPhysicalMaterial color="#334155" metalness={0.86} roughness={0.22} />
  </T.Mesh>

  <!-- Outer Motherboard Neon Diagnostic Trim -->
  <T.Mesh position={[0, 0.032, 0]}>
    <T.BoxGeometry args={[6.97, 0.004, 2.77]} />
    <T.MeshStandardMaterial
      color="#38bdf8"
      emissive="#0284c7"
      emissiveIntensity={0.45}
      roughness={0.3}
    />
  </T.Mesh>
</T.Group>

<!-- ============================================== -->
<!-- 3. PHYSICAL 3D BRAIDED CABLES & MULTI-LANE PCB BUS TRACES -->
<!-- ============================================== -->
<!-- Physical Braided USB Cable: Keyboard -> Motherboard/CPU -->
<T.Mesh geometry={kbCableGeo} castShadow>
  <T.MeshPhysicalMaterial
    color={isSignalKbToCpu ? '#0284c7' : '#1e293b'}
    emissive={isSignalKbToCpu ? '#38bdf8' : '#000000'}
    emissiveIntensity={isSignalKbToCpu ? 0.65 : 0}
    roughness={0.55}
    metalness={0.2}
  />
</T.Mesh>

<!-- Physical High-Speed DisplayPort Cable: Motherboard/iGPU -> Monitor -->
<T.Mesh geometry={dpCableGeo} castShadow>
  <T.MeshPhysicalMaterial
    color={isSignalCpuToMonitor ? '#16a34a' : '#1e293b'}
    emissive={isSignalCpuToMonitor ? '#4ade80' : '#000000'}
    emissiveIntensity={isSignalCpuToMonitor ? 0.65 : 0}
    roughness={0.5}
    metalness={0.25}
  />
</T.Mesh>

<!-- Multi-Lane High-Speed Copper/Optical Motherboard Traces -->
<T.Group position={[0, 0.068, 0]}>
  <!-- 3 Parallel Lanes: CPU <-> DDR5 RAM Memory Bus -->
  {#each [-0.12, 0, 0.12] as zLane}
    <T.Mesh position={[-0.5, 0, zLane]}>
      <T.BoxGeometry args={[1.65, 0.008, 0.035]} />
      <T.MeshStandardMaterial
        color={isCpuProcessing || isRamProcessing ? '#a855f7' : '#f59e0b'}
        emissive={isCpuProcessing || isRamProcessing ? '#c084fc' : '#000000'}
        emissiveIntensity={isCpuProcessing || isRamProcessing ? 1.2 : 0}
        metalness={0.8}
        roughness={0.25}
      />
    </T.Mesh>
  {/each}

  <!-- 3 Parallel Lanes: RAM/CPU <-> M.2 NVMe PCIe 4.0 x4 Bus -->
  {#each [-0.1, 0, 0.1] as zLane}
    <T.Mesh position={[1.5, 0, zLane]}>
      <T.BoxGeometry args={[1.65, 0.008, 0.035]} />
      <T.MeshStandardMaterial
        color={isSignalRamToSsd || ssdSaved ? '#eab308' : '#f59e0b'}
        emissive={isSignalRamToSsd || ssdSaved ? '#facc15' : '#000000'}
        emissiveIntensity={isSignalRamToSsd ? 1.3 : ssdSaved ? 0.55 : 0}
        metalness={0.8}
        roughness={0.25}
      />
    </T.Mesh>
  {/each}
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
<T.Group position={CPU_POS} scale={0.65}>
  <Cpu
    position={[0, 0.05, 0]}
    rotation={[0, 0, 0]}
    autoRotate={false}
    showIgpuCore={true}
    isIgpuActive={isIgpuProcessing}
  />

  <!-- Realistic LGA1700 Socket ILM Retention Frame & Lever Arm -->
  <T.Mesh position={[0, 0.015, 0]}>
    <RoundedBoxGeometry args={[3.22, 0.045, 3.22]} radius={0.02} smoothness={3} />
    <T.MeshPhysicalMaterial color="#94a3b8" roughness={0.25} metalness={0.88} />
  </T.Mesh>
  <!-- Chrome Socket Retention Lever Arm -->
  <T.Mesh position={[1.72, 0.03, 0]} rotation.x={Math.PI / 2}>
    <T.CylinderGeometry args={[0.035, 0.035, 3.1, 16]} />
    <T.MeshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.12} />
  </T.Mesh>

  <!-- CPU Socket Glow Pulse when general processing -->
  {#if isCpuProcessing}
    <T.Mesh position={[0, 0.04, 0]}>
      <T.BoxGeometry args={[3.35, 0.05, 3.35]} />
      <T.MeshBasicMaterial color="#a855f7" transparent opacity={0.38 * glowIntensity} />
    </T.Mesh>
    <T.PointLight position={[0, 1.0, 0]} color="#a855f7" intensity={3.5 * glowIntensity} distance={3.0} />
  {/if}

  <!-- CPU iGPU Graphics Glow Pulse when rendering -->
  {#if isIgpuProcessing}
    <T.Mesh position={[0, 0.04, 0]}>
      <T.BoxGeometry args={[3.4, 0.055, 3.4]} />
      <T.MeshBasicMaterial color="#00f0ff" transparent opacity={0.45 * glowIntensity} />
    </T.Mesh>
    <T.PointLight position={[0, 1.2, 0]} color="#00f0ff" intensity={4.5 * glowIntensity} distance={3.5} />
  {/if}

  <!-- Pedestal Aura -->
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
<T.Group position={RAM_POS} scale={0.58} rotation={[0, 0, 0]}>
  <Ram position={[0, 0.72, 0]} rotation={[0, 0, 0]} autoRotate={false} />

  <!-- DDR5 DIMM Slot Socket with Locking Latches -->
  <T.Mesh position={[0, 0.03, 0]}>
    <RoundedBoxGeometry args={[4.25, 0.12, 0.42]} radius={0.015} smoothness={2} />
    <T.MeshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.3} />
  </T.Mesh>
  <!-- White DIMM Retention Ejector Clips (Left & Right) -->
  {#each [-2.18, 2.18] as cx}
    <T.Mesh position={[cx, 0.12, 0]}>
      <RoundedBoxGeometry args={[0.12, 0.22, 0.36]} radius={0.01} smoothness={2} />
      <T.MeshStandardMaterial color="#cbd5e1" roughness={0.35} />
    </T.Mesh>
  {/each}

  {#if isRamProcessing}
    <T.PointLight position={[0, 0.8, 0.5]} color="#38bdf8" intensity={3.2 * glowIntensity} distance={2.5} />
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
  <Monitor screenText={showMonitorText ? inputText : undefined} />

  {#if showMonitorText}
    <T.PointLight position={[0, 1.7, 0.85]} color="#38bdf8" intensity={2.0} distance={3.2} />
  {/if}

  <!-- Pedestal Aura -->
  <T.Mesh position={[0, 0.01, -0.05]} rotation.x={Math.PI / 2}>
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
<T.Group position={SSD_POS} scale={0.65} rotation={[0, 0, 0]}>
  <Ssd position={[0, 0.06, 0]} rotation={[0, 0, 0]} autoRotate={false} showOverlay={false} />

  <!-- M.2 PCIe 4.0 Socket Header & Standoff Screw on Motherboard -->
  <T.Mesh position={[1.15, 0.03, 0]}>
    <T.BoxGeometry args={[0.28, 0.08, 0.85]} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.5} />
  </T.Mesh>
  <T.Mesh position={[-1.1, 0.04, 0]}>
    <T.CylinderGeometry args={[0.08, 0.08, 0.09, 16]} />
    <T.MeshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
  </T.Mesh>

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
<!-- FLYING DATA PACKET STREAMS (3-Pulses per Active Bus) -->
<!-- ============================================== -->
<!-- 1. Stream Keyboard -> CPU -->
{#if isSignalKbToCpu}
  {#each kbPacketPositions as pos, idx}
    <T.Mesh position={[pos.x, pos.y + 0.06, pos.z]} scale={1 - idx * 0.2}>
      <T.SphereGeometry args={[0.14, 16, 16]} />
      <T.MeshBasicMaterial color={idx === 0 ? '#e0f2fe' : '#38bdf8'} />
    </T.Mesh>
  {/each}
  <T.PointLight
    position={[kbPacketPositions[0].x, kbPacketPositions[0].y + 0.1, kbPacketPositions[0].z]}
    color="#38bdf8"
    intensity={3.5}
    distance={2.5}
  />
{/if}

<!-- 2. Stream CPU -> Monitor -->
{#if isSignalCpuToMonitor}
  {#each monitorPacketPositions as pos, idx}
    <T.Mesh position={[pos.x, pos.y + 0.06, pos.z]} scale={1 - idx * 0.2}>
      <T.SphereGeometry args={[0.15, 16, 16]} />
      <T.MeshBasicMaterial color={idx === 0 ? '#dcfce7' : '#4ade80'} />
    </T.Mesh>
  {/each}
  <T.PointLight
    position={[monitorPacketPositions[0].x, monitorPacketPositions[0].y + 0.1, monitorPacketPositions[0].z]}
    color="#4ade80"
    intensity={3.5}
    distance={2.5}
  />
{/if}

<!-- 3. Stream RAM -> SSD -->
{#if isSignalRamToSsd}
  {#each ssdPacketPositions as pos, idx}
    <T.Mesh position={[pos.x, pos.y, pos.z]} scale={1 - idx * 0.2}>
      <T.SphereGeometry args={[0.14, 16, 16]} />
      <T.MeshBasicMaterial color={idx === 0 ? '#fef9c3' : '#facc15'} />
    </T.Mesh>
  {/each}
  <T.PointLight
    position={[ssdPacketPositions[0].x, ssdPacketPositions[0].y, ssdPacketPositions[0].z]}
    color="#facc15"
    intensity={3.5}
    distance={2.5}
  />
{/if}
