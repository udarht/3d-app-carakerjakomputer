<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, HTML, RoundedBoxGeometry } from '@threlte/extras';
  import {
    getGoldPinsTexture,
    getHddStickerTexture,
    getPcbCircuitTexture
  } from '$lib/utils/textures';

  interactivity();

  let {
    position = [0, 0.55, 0] as [number, number, number],
    rotation = [0.38, 0, 0] as [number, number, number]
  }: {
    position?: [number, number, number];
    rotation?: [number, number, number];
  } = $props();

  let rotY = $state(-0.3);
  let platterRot = $state(0);
  let seekTime = $state(0);
  let isRotating = $state(true);
  let showDetails = $state(false);
  let hovered = $state(false);

  const stickerTex = getHddStickerTexture();
  const pcbTex = getPcbCircuitTexture('#064e3b', '#10b981');
  const goldPinsTex = getGoldPinsTexture(24);

  // Realistic actuator arm seek angle (oscillating across inner/outer platter cylinders)
  let armSeekAngle = $derived(
    0.22 + Math.sin(seekTime * 3.2) * 0.16 + Math.sin(seekTime * 9.5) * 0.04
  );

  useTask((delta) => {
    if (isRotating) {
      rotY += delta * 0.38;
    }
    platterRot += delta * 14.0;
    seekTime += delta;
  });

  function toggleClick(e: any) {
    e.stopPropagation();
    showDetails = !showDetails;
    isRotating = !showDetails;
  }

  const spindleScrewAngles = [0, 60, 120, 180, 240, 300];
</script>

<T.Group
  {position}
  rotation={[rotation[0], rotation[1] + rotY, rotation[2]]}
  scale={hovered ? 1.04 : 1}
  onpointerenter={() => (hovered = true)}
  onpointerleave={() => (hovered = false)}
  onclick={toggleClick}
>
  <!-- ============================================== -->
  <!-- 1. DIE-CAST ALUMINUM ALLOY 3.5" ENCLOSURE BASE -->
  <!-- ============================================== -->
  <T.Mesh position={[0, 0, 0]} castShadow receiveShadow>
    <RoundedBoxGeometry args={[2.92, 0.54, 3.95]} radius={0.05} smoothness={4} />
    <T.MeshPhysicalMaterial
      color="#1e293b"
      metalness={0.78}
      roughness={0.32}
      clearcoat={0.2}
    />
  </T.Mesh>

  <!-- CNC Milled Silver Side Rails -->
  {#each [-1.45, 1.45] as x}
    <T.Mesh position={[x, 0.02, 0]}>
      <T.BoxGeometry args={[0.04, 0.44, 3.82]} />
      <T.MeshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
    </T.Mesh>
    <!-- 3 Side Mounting Screw Holes -->
    {#each [-1.45, 0, 1.45] as z}
      <T.Mesh position={[x + (x > 0 ? 0.015 : -0.015), 0.02, z]} rotation.z={Math.PI / 2}>
        <T.CylinderGeometry args={[0.055, 0.055, 0.02, 16]} />
        <T.MeshStandardMaterial color="#0f172a" roughness={0.7} />
      </T.Mesh>
    {/each}
  {/each}

  <!-- Underside Green Controller PCB Board -->
  <T.Mesh position={[0, -0.275, 0.45]}>
    <RoundedBoxGeometry args={[2.55, 0.03, 2.65]} radius={0.015} smoothness={2} />
    <T.MeshStandardMaterial map={pcbTex} color="#065f46" roughness={0.4} metalness={0.25} />
  </T.Mesh>

  <!-- Internal Machined Platter & Actuator Cavity -->
  <T.Mesh position={[0, 0.25, -0.28]} receiveShadow>
    <T.CylinderGeometry args={[1.32, 1.32, 0.06, 48]} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.45} metalness={0.6} />
  </T.Mesh>
  <T.Mesh position={[0.55, 0.25, 0.95]}>
    <RoundedBoxGeometry args={[1.45, 0.06, 1.55]} radius={0.02} smoothness={3} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.45} metalness={0.6} />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 2. DUAL STACKED MIRROR-POLISHED MAGNETIC PLATTERS (7200 RPM) -->
  <!-- ============================================== -->
  <T.Group position={[0, 0.28, -0.28]} rotation.y={platterRot}>
    <!-- Bottom Platter Disk -->
    <T.Mesh position={[0, -0.05, 0]}>
      <T.CylinderGeometry args={[1.24, 1.24, 0.025, 64]} />
      <T.MeshPhysicalMaterial
        color="#e2e8f0"
        metalness={0.98}
        roughness={0.05}
        clearcoat={1.0}
        clearcoatRoughness={0.03}
      />
    </T.Mesh>

    <!-- Top Mirror Platter Disk -->
    <T.Mesh position={[0, 0.02, 0]} castShadow receiveShadow>
      <T.CylinderGeometry args={[1.24, 1.24, 0.028, 64]} />
      <T.MeshPhysicalMaterial
        color="#f8fafc"
        metalness={0.98}
        roughness={0.04}
        clearcoat={1.0}
        clearcoatRoughness={0.02}
      />
    </T.Mesh>

    <!-- Subtle Concentric Magnetic Sector Ring Reflections -->
    {#each [0.55, 0.82, 1.06] as r}
      <T.Mesh position={[0, 0.036, 0]} rotation.x={Math.PI / 2}>
        <T.RingGeometry args={[r, r + 0.04, 64]} />
        <T.MeshStandardMaterial
          color="#cbd5e1"
          metalness={0.95}
          roughness={0.12}
          transparent
          opacity={0.45}
        />
      </T.Mesh>
    {/each}

    <!-- Brushless Spindle Motor Clamp Ring -->
    <T.Mesh position={[0, 0.042, 0]} castShadow>
      <T.CylinderGeometry args={[0.36, 0.38, 0.045, 36]} />
      <T.MeshPhysicalMaterial color="#e2e8f0" metalness={0.92} roughness={0.15} />
    </T.Mesh>

    <!-- 6 Precision Torx Clamp Screws on Spindle Hub -->
    {#each spindleScrewAngles as angle}
      {@const rad = (angle * Math.PI) / 180}
      <T.Mesh position={[Math.cos(rad) * 0.25, 0.066, Math.sin(rad) * 0.25]}>
        <T.CylinderGeometry args={[0.028, 0.028, 0.012, 12]} />
        <T.MeshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </T.Mesh>
    {/each}
  </T.Group>

  <!-- Orange Head Load/Unload Parking Ramp on Platter Perimeter -->
  <T.Mesh position={[1.18, 0.31, 0.22]} rotation.y={-0.3}>
    <RoundedBoxGeometry args={[0.26, 0.07, 0.38]} radius={0.015} smoothness={2} />
    <T.MeshStandardMaterial color="#f97316" roughness={0.35} metalness={0.1} />
  </T.Mesh>

  <!-- White Silica Desiccant Filter Pouch in Top-Left Corner -->
  <T.Mesh position={[-1.12, 0.29, -1.55]} rotation.y={0.6}>
    <RoundedBoxGeometry args={[0.38, 0.05, 0.22]} radius={0.02} smoothness={2} />
    <T.MeshStandardMaterial color="#f8fafc" roughness={0.7} />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 3. VOICE COIL MOTOR (VCM) & DYNAMIC SEEKING ACTUATOR ARM -->
  <!-- ============================================== -->
  <!-- Neodymium VCM Magnet Stator Plate (Bottom-Right Corner) -->
  <T.Group position={[0.88, 0.29, 1.25]}>
    <T.Mesh castShadow>
      <RoundedBoxGeometry args={[0.78, 0.08, 0.68]} radius={0.02} smoothness={3} />
      <T.MeshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.18} />
    </T.Mesh>
    <!-- Copper Voice Coil Winding Accent -->
    <T.Mesh position={[-0.1, 0.045, -0.08]}>
      <T.CylinderGeometry args={[0.2, 0.2, 0.02, 24]} />
      <T.MeshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
    </T.Mesh>
  </T.Group>

  <!-- Flexible Polyimide Ribbon Cable (FPC) & Preamplifier Preamp Junction -->
  <T.Mesh position={[0.15, 0.27, 1.38]} rotation.y={0.25}>
    <T.BoxGeometry args={[0.75, 0.02, 0.22]} />
    <T.MeshStandardMaterial color="#f59e0b" roughness={0.35} metalness={0.4} />
  </T.Mesh>

  <!-- Pivoting Actuator Arm Assembly (Seeks dynamically across platter!) -->
  <T.Group position={[0.82, 0.32, 0.92]} rotation.y={armSeekAngle}>
    <!-- Precision Ball-Bearing Pivot Hub -->
    <T.Mesh position={[0, 0, 0]} castShadow>
      <T.CylinderGeometry args={[0.22, 0.24, 0.09, 32]} />
      <T.MeshPhysicalMaterial color="#e2e8f0" metalness={0.92} roughness={0.16} />
    </T.Mesh>
    <T.Mesh position={[0, 0.05, 0]}>
      <T.CylinderGeometry args={[0.1, 0.1, 0.015, 24]} />
      <T.MeshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
    </T.Mesh>

    <!-- Tapered Perforated Aluminum E-Block Arm -->
    <T.Mesh position={[-0.48, 0.015, -0.52]} rotation.y={0.72} castShadow>
      <RoundedBoxGeometry args={[0.18, 0.025, 1.25]} radius={0.008} smoothness={2} />
      <T.MeshPhysicalMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
    </T.Mesh>

    <!-- Weight-Reduction Circular Cutouts on Arm -->
    {#each [-0.28, -0.5, -0.7] as dist}
      <T.Mesh position={[dist * 0.85, 0.03, dist * 0.92]}>
        <T.CylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
        <T.MeshStandardMaterial color="#0f172a" roughness={0.8} />
      </T.Mesh>
    {/each}

    <!-- Stainless Steel Suspension Flexure & Read/Write Slider Head -->
    <T.Mesh position={[-0.92, 0.012, -1.02]} rotation.y={0.72}>
      <T.BoxGeometry args={[0.06, 0.012, 0.28]} />
      <T.MeshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
    </T.Mesh>

    <!-- Glowing Magneto-Resistive Read/Write Head Tip -->
    <T.Mesh position={[-1.02, 0.01, -1.12]}>
      <T.BoxGeometry args={[0.055, 0.022, 0.08]} />
      <T.MeshStandardMaterial
        color="#38bdf8"
        emissive="#0284c7"
        emissiveIntensity={1.5}
        roughness={0.2}
      />
    </T.Mesh>
  </T.Group>

  <!-- ============================================== -->
  <!-- 4. STAMPED STAINLESS TOP COVER LID & SPEC STICKER -->
  <!-- ============================================== -->
  <!-- When showDetails is false, a clean cutaway window lets students see the spinning platter, and when clicked, the whole lid lifts up! -->
  <T.Group position={[0, showDetails ? 1.15 : 0.3, 0]}>
    <!-- Stainless Steel Cover Plate -->
    <T.Mesh castShadow receiveShadow>
      <RoundedBoxGeometry args={[2.84, 0.045, 3.86]} radius={0.03} smoothness={3} />
      <T.MeshPhysicalMaterial
        color="#e2e8f0"
        metalness={0.75}
        roughness={0.25}
        transparent
        opacity={showDetails ? 0.55 : 0.32}
      />
    </T.Mesh>

    <!-- Enterprise Barcode & Specifications Sticker (Lower half of cover) -->
    <T.Mesh position={[0, 0.025, 0.72]} rotation.x={-Math.PI / 2}>
      <T.PlaneGeometry args={[2.42, 1.95]} />
      <T.MeshStandardMaterial
        map={stickerTex}
        roughness={0.4}
        metalness={0.05}
        transparent={showDetails}
        opacity={showDetails ? 0.85 : 0.96}
      />
    </T.Mesh>

    <!-- 6 Perimeter Torx Screws Securing Cover -->
    {#each [-1.28, 1.28] as x}
      {#each [-1.76, 0, 1.76] as z}
        <T.Mesh position={[x, 0.028, z]}>
          <T.CylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
          <T.MeshPhysicalMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </T.Mesh>
      {/each}
    {/each}
  </T.Group>

  <!-- ============================================== -->
  <!-- 5. REAR SATA POWER + DATA + JUMPER PINS -->
  <!-- ============================================== -->
  <T.Group position={[-0.3, -0.06, 1.98]}>
    <T.Mesh>
      <T.BoxGeometry args={[1.7, 0.22, 0.18]} />
      <T.MeshStandardMaterial color="#0f172a" roughness={0.6} />
    </T.Mesh>
    <T.Mesh position={[-0.32, 0, 0.08]}>
      <T.BoxGeometry args={[0.85, 0.05, 0.08]} />
      <T.MeshStandardMaterial map={goldPinsTex} color="#fbbf24" metalness={0.9} roughness={0.2} />
    </T.Mesh>
    <T.Mesh position={[0.48, 0, 0.08]}>
      <T.BoxGeometry args={[0.45, 0.05, 0.08]} />
      <T.MeshStandardMaterial map={goldPinsTex} color="#fbbf24" metalness={0.9} roughness={0.2} />
    </T.Mesh>
  </T.Group>

  {#if showDetails}
    <HTML position={[0, 1.75, 0]} center>
      <div class="hdd-tag">
        <span class="hdd-title">💽 3.5" Enterprise Hard Disk Drive (7200 RPM)</span>
        <span class="hdd-sub">Dual Cobalt-Alloy Platters • Voice Coil Actuator • Seeking Read/Write Head</span>
        <span class="hdd-hint">Klik objek untuk menutup tampilan eksplodasi</span>
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
