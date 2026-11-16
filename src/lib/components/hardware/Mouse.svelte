<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, RoundedBoxGeometry } from '@threlte/extras';

  interactivity();

  let {
    position = [0, 0, 0] as [number, number, number],
    rotation = [0, 0, 0] as [number, number, number]
  }: {
    position?: [number, number, number];
    rotation?: [number, number, number];
  } = $props();

  let hovered = $state(false);
  let leftPressed = $state(false);
  let rightPressed = $state(false);
  let wheelHovered = $state(false);
  let wheelPressed = $state(false);
  let dpiIndex = $state(1);
  let wheelRot = $state(0);

  const dpiColors = ['#22c55e', '#38bdf8', '#a855f7', '#ef4444'];

  useTask((delta) => {
    if (wheelHovered) {
      wheelRot += delta * 4.5;
    }
  });

  function handlePointerEnter() {
    hovered = true;
  }

  function handlePointerLeave() {
    hovered = false;
    leftPressed = false;
    rightPressed = false;
    wheelHovered = false;
    wheelPressed = false;
  }

  function handleLeftClick(e: any) {
    e.stopPropagation();
    leftPressed = true;
    setTimeout(() => (leftPressed = false), 140);
  }

  function handleRightClick(e: any) {
    e.stopPropagation();
    rightPressed = true;
    setTimeout(() => (rightPressed = false), 140);
  }

  function handleWheelClick(e: any) {
    e.stopPropagation();
    wheelPressed = true;
    wheelRot += 0.8;
    setTimeout(() => (wheelPressed = false), 140);
  }

  function cycleDpi(e: any) {
    e.stopPropagation();
    dpiIndex = (dpiIndex + 1) % dpiColors.length;
  }
</script>

<!-- Outer Container seated on surface (Y=0) -->
<T.Group
  {position}
  {rotation}
  scale={hovered ? 1.025 : 1}
  onpointerenter={handlePointerEnter}
  onpointerleave={handlePointerLeave}
>
  <!-- ============================================== -->
  <!-- 1. UNDERSIDE CHASSIS, PTFE GLIDE SKATES & OPTICAL SENSOR -->
  <!-- ============================================== -->
  <!-- Matte Dark Lower Tub Chassis -->
  <T.Mesh position={[0, 0.055, 0]} castShadow receiveShadow>
    <RoundedBoxGeometry args={[1.34, 0.09, 2.32]} radius={0.04} smoothness={4} />
    <T.MeshPhysicalMaterial color="#0f172a" roughness={0.5} metalness={0.2} />
  </T.Mesh>

  <!-- Subtle Underglow RGB Accent Strip Along Rear Base Skirt -->
  <T.Mesh position={[0, 0.022, 0.92]}>
    <RoundedBoxGeometry args={[1.12, 0.018, 0.42]} radius={0.008} smoothness={3} />
    <T.MeshStandardMaterial
      color={dpiColors[dpiIndex]}
      emissive={dpiColors[dpiIndex]}
      emissiveIntensity={hovered ? 1.4 : 0.7}
    />
  </T.Mesh>

  <!-- White Virgin-Grade PTFE Glide Feet (Front, Rear & Sensor Ring) -->
  <T.Mesh position={[0, 0.006, -0.88]}>
    <RoundedBoxGeometry args={[0.98, 0.012, 0.28]} radius={0.005} smoothness={2} />
    <T.MeshPhysicalMaterial color="#f8fafc" roughness={0.12} clearcoat={0.8} />
  </T.Mesh>
  <T.Mesh position={[0, 0.006, 0.88]}>
    <RoundedBoxGeometry args={[1.06, 0.012, 0.34]} radius={0.005} smoothness={2} />
    <T.MeshPhysicalMaterial color="#f8fafc" roughness={0.12} clearcoat={0.8} />
  </T.Mesh>

  <!-- 26,000 DPI Optical Sensor Aperture & Glass Prism Lens -->
  <T.Mesh position={[0, 0.008, 0.04]} rotation.x={Math.PI / 2}>
    <T.RingGeometry args={[0.075, 0.16, 32]} />
    <T.MeshStandardMaterial color="#f8fafc" roughness={0.2} />
  </T.Mesh>
  <T.Mesh position={[0, 0.007, 0.04]} rotation.x={Math.PI / 2}>
    <T.CircleGeometry args={[0.07, 24]} />
    <T.MeshStandardMaterial
      color="#38bdf8"
      emissive="#0284c7"
      emissiveIntensity={hovered ? 1.5 : 0.6}
      roughness={0.1}
    />
  </T.Mesh>

  <!-- Front Recessed USB-C Charging Port -->
  <T.Mesh position={[0, 0.07, -1.16]}>
    <T.BoxGeometry args={[0.2, 0.045, 0.02]} />
    <T.MeshStandardMaterial color="#020617" roughness={0.9} />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 2. ERGONOMIC SCULPTED PALM DOME & TEXTURED SIDE GRIPS -->
  <!-- ============================================== -->
  <!-- Rear Contoured Palm Rest Dome -->
  <T.Mesh position={[0, 0.44, 0.35]} scale={[1.34, 0.82, 1.42]} castShadow receiveShadow>
    <T.SphereGeometry args={[0.5, 40, 32]} />
    <T.MeshPhysicalMaterial
      color={hovered ? '#334155' : '#1e293b'}
      roughness={0.32}
      metalness={0.22}
      clearcoat={0.28}
      clearcoatRoughness={0.25}
    />
  </T.Mesh>

  <!-- Mid-Body Arch Bridging Dome to Click Paddles -->
  <T.Mesh position={[0, 0.4, -0.06]} rotation.x={-0.18} castShadow receiveShadow>
    <RoundedBoxGeometry args={[1.3, 0.46, 0.92]} radius={0.12} smoothness={4} />
    <T.MeshPhysicalMaterial
      color={hovered ? '#334155' : '#1e293b'}
      roughness={0.32}
      metalness={0.22}
      clearcoat={0.28}
      clearcoatRoughness={0.25}
    />
  </T.Mesh>

  <!-- Illuminated Palm Logo Emblem on Rear Arch -->
  <T.Mesh position={[0, 0.72, 0.62]} rotation.x={0.48}>
    <T.RingGeometry args={[0.08, 0.125, 6]} />
    <T.MeshStandardMaterial
      color={dpiColors[dpiIndex]}
      emissive={dpiColors[dpiIndex]}
      emissiveIntensity={1.2}
      side={2}
    />
  </T.Mesh>

  <!-- Textured Rubberized Side Grips (Left & Right Flanks) -->
  {#each [-0.63, 0.63] as sx}
    <T.Mesh
      position={[sx, 0.25, 0.06]}
      rotation.z={sx < 0 ? -0.14 : 0.14}
      scale={[0.14, 0.44, 1.92]}
      castShadow
    >
      <RoundedBoxGeometry args={[1, 1, 1]} radius={0.15} smoothness={3} />
      <T.MeshStandardMaterial color="#0f172a" roughness={0.68} metalness={0.1} />
    </T.Mesh>
  {/each}

  <!-- Left-Side Thumb Buttons (Mouse 4 Forward & Mouse 5 Back) -->
  {#each [-0.22, 0.16] as tz}
    <T.Mesh position={[-0.67, 0.36, tz]} rotation.z={-0.12} castShadow>
      <RoundedBoxGeometry args={[0.05, 0.075, 0.3]} radius={0.015} smoothness={3} />
      <T.MeshPhysicalMaterial color="#475569" metalness={0.6} roughness={0.25} clearcoat={0.4} />
    </T.Mesh>
  {/each}

  <!-- ============================================== -->
  <!-- 3. CONTOURED LEFT & RIGHT CLICK BUTTON PADDLES -->
  <!-- ============================================== -->
  <!-- Left Click Button (LMB) -->
  <T.Mesh
    position={[-0.33, leftPressed ? 0.295 : 0.325, -0.68]}
    rotation.x={-0.22}
    castShadow
    receiveShadow
    onpointerdown={(e: any) => {
      e.stopPropagation();
      leftPressed = true;
    }}
    onpointerup={(e: any) => {
      e.stopPropagation();
      leftPressed = false;
    }}
    onclick={handleLeftClick}
  >
    <RoundedBoxGeometry args={[0.55, 0.085, 0.88]} radius={0.03} smoothness={4} />
    <T.MeshPhysicalMaterial
      color={leftPressed ? '#0284c7' : '#334155'}
      roughness={0.32}
      metalness={0.25}
      clearcoat={0.3}
      emissive={leftPressed ? '#0284c7' : '#000000'}
      emissiveIntensity={leftPressed ? 0.45 : 0}
    />
  </T.Mesh>

  <!-- Right Click Button (RMB) -->
  <T.Mesh
    position={[0.33, rightPressed ? 0.295 : 0.325, -0.68]}
    rotation.x={-0.22}
    castShadow
    receiveShadow
    onpointerdown={(e: any) => {
      e.stopPropagation();
      rightPressed = true;
    }}
    onpointerup={(e: any) => {
      e.stopPropagation();
      rightPressed = false;
    }}
    onclick={handleRightClick}
  >
    <RoundedBoxGeometry args={[0.55, 0.085, 0.88]} radius={0.03} smoothness={4} />
    <T.MeshPhysicalMaterial
      color={rightPressed ? '#0284c7' : '#334155'}
      roughness={0.32}
      metalness={0.25}
      clearcoat={0.3}
      emissive={rightPressed ? '#0284c7' : '#000000'}
      emissiveIntensity={rightPressed ? 0.45 : 0}
    />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 4. CENTER CHANNEL SEAM, DPI BUTTON & ANODIZED SCROLL WHEEL -->
  <!-- ============================================== -->
  <!-- Dark Center Channel Valley -->
  <T.Mesh position={[0, 0.3, -0.68]} rotation.x={-0.22}>
    <T.BoxGeometry args={[0.12, 0.1, 0.88]} />
    <T.MeshStandardMaterial color="#090d16" roughness={0.8} />
  </T.Mesh>

  <!-- DPI Profile Switch Button + Stage Indicator LED -->
  <T.Mesh position={[0, 0.48, -0.22]} rotation.x={-0.18} onclick={cycleDpi}>
    <RoundedBoxGeometry args={[0.11, 0.04, 0.18]} radius={0.01} smoothness={2} />
    <T.MeshPhysicalMaterial color="#64748b" metalness={0.7} roughness={0.25} />
  </T.Mesh>
  <T.Mesh position={[0, 0.51, -0.06]} rotation.x={-0.12}>
    <T.SphereGeometry args={[0.02, 16, 16]} />
    <T.MeshStandardMaterial
      color={dpiColors[dpiIndex]}
      emissive={dpiColors[dpiIndex]}
      emissiveIntensity={2.0}
    />
  </T.Mesh>

  <!-- Scroll Wheel Assembly -->
  <T.Group
    position={[0, wheelPressed ? 0.375 : 0.395, -0.6]}
    rotation.x={wheelRot}
    onpointerenter={(e: any) => {
      e.stopPropagation();
      wheelHovered = true;
    }}
    onpointerleave={(e: any) => {
      e.stopPropagation();
      wheelHovered = false;
      wheelPressed = false;
    }}
    onpointerdown={(e: any) => {
      e.stopPropagation();
      wheelPressed = true;
    }}
    onpointerup={(e: any) => {
      e.stopPropagation();
      wheelPressed = false;
    }}
    onclick={handleWheelClick}
  >
    <!-- Rubberized Outer Tire -->
    <T.Mesh rotation.z={Math.PI / 2} castShadow>
      <T.CylinderGeometry args={[0.145, 0.145, 0.1, 32]} />
      <T.MeshStandardMaterial
        color={wheelPressed ? '#0284c7' : '#1e293b'}
        roughness={0.65}
        metalness={0.15}
      />
    </T.Mesh>

    <!-- Anodized Silver Inner Wheel Rim Spokes -->
    <T.Mesh rotation.z={Math.PI / 2}>
      <T.CylinderGeometry args={[0.1, 0.1, 0.11, 24]} />
      <T.MeshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.18} />
    </T.Mesh>

    <!-- Illuminated Center Scroll Ring -->
    <T.Mesh rotation.z={Math.PI / 2}>
      <T.TorusGeometry args={[0.146, 0.012, 12, 32]} />
      <T.MeshStandardMaterial
        color={wheelHovered ? '#38bdf8' : dpiColors[dpiIndex]}
        emissive={wheelHovered ? '#38bdf8' : dpiColors[dpiIndex]}
        emissiveIntensity={wheelHovered ? 1.4 : 0.7}
      />
    </T.Mesh>
  </T.Group>
</T.Group>
