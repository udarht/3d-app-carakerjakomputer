<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, RoundedBoxGeometry } from '@threlte/extras';
  import { getWoodCabinetTexture } from '$lib/utils/textures';

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
  let wavePhase = $state(0);
  let time = 0;

  const woodTex = getWoodCabinetTexture();
  const screwAngles = [45, 135, 225, 315];

  useTask((delta) => {
    if (isPlaying) {
      time += delta * 14;
      pulse = Math.sin(time) * 0.042 + Math.sin(time * 2.3) * 0.015;
      wavePhase = (wavePhase + delta * 1.4) % 1;
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
  scale={hovered ? 1.025 : 1}
  onpointerenter={() => (hovered = true)}
  onpointerleave={() => (hovered = false)}
  onclick={toggleAudio}
>
  <!-- ============================================== -->
  <!-- 1. WALNUT ACOUSTIC MDF CABINET ENCLOSURE -->
  <!-- ============================================== -->
  <T.Mesh position={[0, 1.5, 0]} castShadow receiveShadow>
    <RoundedBoxGeometry args={[1.95, 2.92, 2.05]} radius={0.07} smoothness={4} />
    <T.MeshPhysicalMaterial
      map={woodTex}
      color="#92400e"
      roughness={0.38}
      metalness={0.08}
      clearcoat={0.35}
      clearcoatRoughness={0.25}
    />
  </T.Mesh>

  <!-- Matte Charcoal Acoustic Front Baffle Plate -->
  <T.Mesh position={[0, 1.5, 1.01]} castShadow receiveShadow>
    <RoundedBoxGeometry args={[1.76, 2.74, 0.07]} radius={0.04} smoothness={4} />
    <T.MeshPhysicalMaterial
      color="#0f172a"
      roughness={0.52}
      metalness={0.18}
      clearcoat={0.12}
    />
  </T.Mesh>

  <!-- Rear Brushed Aluminum Amplifier Heatsink Plate -->
  <T.Mesh position={[0, 1.35, -1.03]}>
    <RoundedBoxGeometry args={[1.45, 2.1, 0.03]} radius={0.02} smoothness={2} />
    <T.MeshPhysicalMaterial color="#1e293b" metalness={0.85} roughness={0.28} />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 2. 1-INCH SILK-DOME WAVEGUIDE TWEETER (UPPER) -->
  <!-- ============================================== -->
  <T.Group position={[0, 2.24, 1.045]}>
    <!-- Brushed Aluminum Waveguide Flange -->
    <T.Mesh rotation.x={Math.PI / 2} castShadow>
      <T.CylinderGeometry args={[0.34, 0.36, 0.025, 40]} />
      <T.MeshPhysicalMaterial color="#334155" metalness={0.85} roughness={0.24} />
    </T.Mesh>

    <!-- Anodized Cyan/Silver Trim Ring -->
    <T.Mesh position={[0, 0, 0.014]}>
      <T.TorusGeometry args={[0.28, 0.018, 16, 40]} />
      <T.MeshStandardMaterial
        color={isPlaying ? '#38bdf8' : '#64748b'}
        emissive={isPlaying ? '#0284c7' : '#000000'}
        emissiveIntensity={isPlaying ? 0.8 : 0}
        metalness={0.8}
        roughness={0.2}
      />
    </T.Mesh>

    <!-- Silk Tweeter Diaphragm Dome -->
    <T.Mesh position={[0, 0, 0.01 + pulse * 0.35]}>
      <T.SphereGeometry args={[0.17, 32, 24]} />
      <T.MeshPhysicalMaterial
        color="#090d16"
        roughness={0.22}
        metalness={0.15}
        clearcoat={0.75}
        clearcoatRoughness={0.15}
      />
    </T.Mesh>

    <!-- 4 Tweeter Mounting Screws -->
    {#each screwAngles as ang}
      {@const rad = (ang * Math.PI) / 180}
      <T.Mesh position={[Math.cos(rad) * 0.3, Math.sin(rad) * 0.3, 0.015]} rotation.x={Math.PI / 2}>
        <T.CylinderGeometry args={[0.018, 0.018, 0.01, 12]} />
        <T.MeshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </T.Mesh>
    {/each}
  </T.Group>

  <!-- ============================================== -->
  <!-- 3. 5.5-INCH WOVEN KEVLAR BASS/MID WOOFER (LOWER) -->
  <!-- ============================================== -->
  <T.Group position={[0, 1.18, 1.045]}>
    <!-- Die-Cast Brushed Aluminum Basket Trim Ring -->
    <T.Mesh castShadow>
      <T.TorusGeometry args={[0.63, 0.055, 24, 48]} />
      <T.MeshPhysicalMaterial color="#cbd5e1" metalness={0.88} roughness={0.22} />
    </T.Mesh>

    <!-- 4 Woofer Basket Hex Screws -->
    {#each screwAngles as ang}
      {@const rad = (ang * Math.PI) / 180}
      <T.Mesh position={[Math.cos(rad) * 0.63, Math.sin(rad) * 0.63, 0.045]} rotation.x={Math.PI / 2}>
        <T.CylinderGeometry args={[0.025, 0.025, 0.015, 12]} />
        <T.MeshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
      </T.Mesh>
    {/each}

    <!-- Butyl Rubber Half-Roll Surround Suspension (Pumps with Bass) -->
    <T.Mesh position={[0, 0, -0.01 + pulse * 0.8]}>
      <T.TorusGeometry args={[0.53, 0.052, 24, 48]} />
      <T.MeshPhysicalMaterial
        color="#18181b"
        roughness={0.42}
        metalness={0.08}
        clearcoat={0.25}
      />
    </T.Mesh>

    <!-- Woven Golden-Amber Kevlar Cone Diaphragm -->
    <T.Mesh position={[0, 0, -0.06 + pulse]} rotation.x={Math.PI / 2}>
      <T.ConeGeometry args={[0.51, 0.22, 48, 1, true]} />
      <T.MeshPhysicalMaterial
        color="#d97706"
        roughness={0.35}
        metalness={0.35}
        clearcoat={0.2}
        side={2}
      />
    </T.Mesh>

    <!-- Central Anodized Bullet Phase Plug / Dust Cap -->
    <T.Mesh position={[0, 0, -0.01 + pulse * 1.15]}>
      <T.SphereGeometry args={[0.18, 32, 24]} />
      <T.MeshPhysicalMaterial
        color="#0f172a"
        metalness={0.85}
        roughness={0.18}
        clearcoat={0.6}
      />
    </T.Mesh>

    <!-- Expanding Acoustic Soundwave Rings When Playing -->
    {#if isPlaying}
      <T.Mesh position={[0, 0, 0.08 + wavePhase * 0.55]}>
        <T.RingGeometry args={[0.35 + wavePhase * 0.45, 0.38 + wavePhase * 0.45, 48]} />
        <T.MeshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={(1 - wavePhase) * 0.55}
          side={2}
        />
      </T.Mesh>
    {/if}
  </T.Group>

  <!-- ============================================== -->
  <!-- 4. FRONT CONTROL PANEL, KNOBS & FLARED BASS PORT -->
  <!-- ============================================== -->
  <!-- Brushed Metal Control Escutcheon Plate -->
  <T.Mesh position={[0, 0.36, 1.045]}>
    <RoundedBoxGeometry args={[1.52, 0.32, 0.02]} radius={0.01} smoothness={2} />
    <T.MeshPhysicalMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
  </T.Mesh>

  <!-- Master Volume & Tone Knurled Aluminum Knobs -->
  {#each [-0.52, -0.18] as kx, idx}
    <T.Group position={[kx, 0.36, 1.08]}>
      <T.Mesh rotation.x={Math.PI / 2} castShadow>
        <T.CylinderGeometry args={[0.1, 0.11, 0.09, 32]} />
        <T.MeshPhysicalMaterial color="#cbd5e1" metalness={0.92} roughness={0.18} />
      </T.Mesh>
      <!-- Illuminated Volume Halo Ring -->
      <T.Mesh position={[0, 0, -0.025]}>
        <T.TorusGeometry args={[0.12, 0.012, 16, 32]} />
        <T.MeshStandardMaterial
          color={isPlaying ? '#38bdf8' : '#64748b'}
          emissive={isPlaying ? '#0284c7' : '#000000'}
          emissiveIntensity={isPlaying ? 1.2 : 0}
        />
      </T.Mesh>
      <!-- Indicator Notch Line on Knob Face -->
      <T.Mesh position={[0, 0.05, 0.048]}>
        <T.BoxGeometry args={[0.015, 0.05, 0.008]} />
        <T.MeshStandardMaterial color="#0f172a" />
      </T.Mesh>
    </T.Group>
  {/each}

  <!-- Active Bi-Amp Status LED -->
  <T.Mesh position={[0.12, 0.36, 1.06]}>
    <T.SphereGeometry args={[0.025, 16, 16]} />
    <T.MeshStandardMaterial
      color={isPlaying ? '#10b981' : '#ef4444'}
      emissive={isPlaying ? '#10b981' : '#ef4444'}
      emissiveIntensity={2.0}
    />
  </T.Mesh>

  <!-- Flared Aerodynamic Bass Reflex Port Tube -->
  <T.Group position={[0.48, 0.36, 1.03]}>
    <T.Mesh>
      <T.TorusGeometry args={[0.13, 0.028, 20, 36]} />
      <T.MeshPhysicalMaterial color="#334155" roughness={0.3} metalness={0.6} />
    </T.Mesh>
    <T.Mesh position={[0, 0, -0.05]} rotation.x={Math.PI / 2}>
      <T.CylinderGeometry args={[0.12, 0.12, 0.14, 32]} />
      <T.MeshStandardMaterial color="#020617" roughness={0.9} />
    </T.Mesh>
  </T.Group>

  <!-- ============================================== -->
  <!-- 5. ACOUSTIC ISOLATION FEET PADS -->
  <!-- ============================================== -->
  {#each [-0.75, 0.75] as x}
    {#each [-0.75, 0.75] as z}
      <T.Group position={[x, 0.035, z]}>
        <T.Mesh>
          <T.CylinderGeometry args={[0.14, 0.15, 0.07, 24]} />
          <T.MeshStandardMaterial color="#0f172a" roughness={0.8} />
        </T.Mesh>
        <!-- Gold Isolation Trim Ring -->
        <T.Mesh position={[0, 0.01, 0]}>
          <T.CylinderGeometry args={[0.145, 0.145, 0.018, 24]} />
          <T.MeshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </T.Mesh>
      </T.Group>
    {/each}
  {/each}
</T.Group>
