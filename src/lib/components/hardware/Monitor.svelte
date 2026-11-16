<script lang="ts">
  import { T } from '@threlte/core';
  import { interactivity, RoundedBoxGeometry } from '@threlte/extras';
  import { getMonitorScreenTexture } from '$lib/utils/textures';

  interactivity();

  let {
    position = [0, 0, 0] as [number, number, number],
    rotation = [0, 0, 0] as [number, number, number],
    screenText
  }: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    screenText?: string;
  } = $props();

  let isPowered = $state(true);
  let hovered = $state(false);

  let screenTex = $derived(getMonitorScreenTexture(screenText));

  function togglePower(e: any) {
    e.stopPropagation();
    isPowered = !isPowered;
  }

  const ventSlots = [-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6];
</script>

<T.Group
  {position}
  {rotation}
  scale={hovered ? 1.015 : 1}
  onpointerenter={() => (hovered = true)}
  onpointerleave={() => (hovered = false)}
>
  <!-- ============================================== -->
  <!-- 1. ULTRA-SLIM ANODIZED ALUMINUM DISPLAY CHASSIS -->
  <!-- ============================================== -->
  <T.Mesh position={[0, 1.65, -0.04]} castShadow receiveShadow>
    <RoundedBoxGeometry args={[3.92, 2.34, 0.075]} radius={0.03} smoothness={4} />
    <T.MeshPhysicalMaterial
      color="#334155"
      roughness={0.28}
      metalness={0.82}
      clearcoat={0.2}
    />
  </T.Mesh>

  <!-- Sculpted Rear Electronics Enclosure -->
  <T.Mesh position={[0, 1.56, -0.11]} castShadow>
    <RoundedBoxGeometry args={[2.35, 1.42, 0.1]} radius={0.04} smoothness={4} />
    <T.MeshPhysicalMaterial color="#1e293b" roughness={0.38} metalness={0.65} />
  </T.Mesh>

  <!-- Rear RGB / Bias Lighting Ring on Back of Monitor -->
  <T.Mesh position={[0, 1.56, -0.162]}>
    <T.RingGeometry args={[0.42, 0.46, 48]} />
    <T.MeshStandardMaterial
      color={isPowered ? '#38bdf8' : '#475569'}
      emissive={isPowered ? '#0284c7' : '#000000'}
      emissiveIntensity={isPowered ? 1.1 : 0}
      side={2}
    />
  </T.Mesh>

  <!-- Top Rear Thermal Exhaust Louvers -->
  {#each ventSlots as vx}
    <T.Mesh position={[vx, 2.18, -0.115]}>
      <T.BoxGeometry args={[0.12, 0.04, 0.11]} />
      <T.MeshStandardMaterial color="#020617" roughness={0.8} />
    </T.Mesh>
  {/each}

  <!-- Downward-Facing Rear I/O Port Bay (HDMI, DisplayPort, USB-C, AC Power) -->
  <T.Mesh position={[0.55, 0.92, -0.115]}>
    <T.BoxGeometry args={[0.85, 0.14, 0.08]} />
    <T.MeshStandardMaterial color="#020617" roughness={0.8} />
  </T.Mesh>
  {#each [0.25, 0.45, 0.65, 0.82] as px}
    <T.Mesh position={[px, 0.91, -0.12]}>
      <T.BoxGeometry args={[0.1, 0.04, 0.05]} />
      <T.MeshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
    </T.Mesh>
  {/each}

  <!-- ============================================== -->
  <!-- 2. 3-SIDE MICRO-BEZEL FRAME & BRUSHED CHIN BAR -->
  <!-- ============================================== -->
  <T.Mesh position={[0, 1.65, 0.002]}>
    <RoundedBoxGeometry args={[3.88, 2.3, 0.02]} radius={0.02} smoothness={3} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.4} />
  </T.Mesh>

  <!-- Bottom Brushed Gunmetal Chin Bezel -->
  <T.Mesh position={[0, 0.56, 0.015]}>
    <RoundedBoxGeometry args={[3.88, 0.13, 0.025]} radius={0.01} smoothness={3} />
    <T.MeshPhysicalMaterial color="#1e293b" roughness={0.25} metalness={0.8} />
  </T.Mesh>

  <!-- Chrome Center Brand Badge on Chin -->
  <T.Mesh position={[0, 0.56, 0.03]}>
    <T.BoxGeometry args={[0.28, 0.035, 0.006]} />
    <T.MeshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 3. IPS GLASS LCD PANEL WITH REALISTIC OS TEXTURE -->
  <!-- ============================================== -->
  <T.Mesh position={[0, 1.71, 0.016]}>
    <T.PlaneGeometry args={[3.76, 2.12]} />
    {#if isPowered}
      <T.MeshPhysicalMaterial
        map={screenTex}
        emissiveMap={screenTex}
        emissive="#ffffff"
        emissiveIntensity={0.55}
        roughness={0.12}
        metalness={0.05}
        clearcoat={0.85}
        clearcoatRoughness={0.08}
      />
    {:else}
      <T.MeshPhysicalMaterial
        color="#090d16"
        roughness={0.08}
        metalness={0.15}
        clearcoat={0.95}
        clearcoatRoughness={0.05}
      />
    {/if}
  </T.Mesh>

  <!-- Interactive Tactile Power Button & Status LED -->
  <T.Mesh position={[1.68, 0.56, 0.03]} rotation.x={Math.PI / 2} onclick={togglePower}>
    <T.CylinderGeometry args={[0.028, 0.028, 0.02, 20]} />
    <T.MeshStandardMaterial
      color={isPowered ? '#38bdf8' : '#ef4444'}
      emissive={isPowered ? '#0284c7' : '#ef4444'}
      emissiveIntensity={2.0}
      roughness={0.2}
    />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 4. ERGONOMIC VESA ARM, CABLE ROUTING STAND & DIE-CAST BASE -->
  <!-- ============================================== -->
  <!-- Quick-Release VESA Hinge Hub -->
  <T.Mesh position={[0, 1.56, -0.2]} castShadow>
    <RoundedBoxGeometry args={[0.46, 0.46, 0.1]} radius={0.03} smoothness={3} />
    <T.MeshPhysicalMaterial color="#64748b" metalness={0.88} roughness={0.24} />
  </T.Mesh>

  <!-- Angled Anodized Aluminum Stand Pillar (Left & Right Uprights Framing Cable Slot) -->
  <T.Group position={[0, 0.82, -0.24]} rotation.x={0.06}>
    <!-- Upper Solid Neck -->
    <T.Mesh position={[0, 0.45, 0]} castShadow>
      <RoundedBoxGeometry args={[0.28, 0.65, 0.12]} radius={0.025} smoothness={3} />
      <T.MeshPhysicalMaterial color="#94a3b8" metalness={0.86} roughness={0.25} />
    </T.Mesh>
    <!-- Left & Right Pillar Legs Framing Cable Pass-Through -->
    <T.Mesh position={[-0.09, -0.1, 0]} castShadow>
      <RoundedBoxGeometry args={[0.09, 0.55, 0.12]} radius={0.015} smoothness={3} />
      <T.MeshPhysicalMaterial color="#94a3b8" metalness={0.86} roughness={0.25} />
    </T.Mesh>
    <T.Mesh position={[0.09, -0.1, 0]} castShadow>
      <RoundedBoxGeometry args={[0.09, 0.55, 0.12]} radius={0.015} smoothness={3} />
      <T.MeshPhysicalMaterial color="#94a3b8" metalness={0.86} roughness={0.25} />
    </T.Mesh>
    <!-- Lower Base Collar -->
    <T.Mesh position={[0, -0.55, 0]} castShadow>
      <RoundedBoxGeometry args={[0.28, 0.45, 0.14]} radius={0.025} smoothness={3} />
      <T.MeshPhysicalMaterial color="#94a3b8" metalness={0.86} roughness={0.25} />
    </T.Mesh>
    <!-- Cyan Anodized Cable Routing Grommet Ring -->
    <T.Mesh position={[0, -0.1, 0.062]}>
      <T.RingGeometry args={[0.055, 0.08, 32]} />
      <T.MeshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.25} />
    </T.Mesh>
  </T.Group>

  <!-- Die-Cast Flat Metallic Turntable Pedestal Base -->
  <T.Mesh position={[0, 0.035, -0.05]} castShadow receiveShadow>
    <T.CylinderGeometry args={[0.82, 0.88, 0.06, 64]} />
    <T.MeshPhysicalMaterial
      color={hovered ? '#475569' : '#334155'}
      metalness={0.85}
      roughness={0.25}
      clearcoat={0.2}
    />
  </T.Mesh>

  <!-- Brushed Silver Outer Chamfer Ring on Base -->
  <T.Mesh position={[0, 0.066, -0.05]} rotation.x={Math.PI / 2}>
    <T.RingGeometry args={[0.62, 0.66, 64]} />
    <T.MeshStandardMaterial
      color={isPowered ? '#38bdf8' : '#94a3b8'}
      emissive={isPowered ? '#0284c7' : '#000000'}
      emissiveIntensity={isPowered ? 0.8 : 0}
      roughness={0.2}
      metalness={0.8}
    />
  </T.Mesh>
</T.Group>
