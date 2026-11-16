<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, RoundedBoxGeometry } from '@threlte/extras';
  import { getPrintedDocumentTexture } from '$lib/utils/textures';

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
  let printTime = $state(0);

  const docTexture = getPrintedDocumentTexture();

  // Printhead sweeps rapidly back and forth along chrome rail while printing
  let printHeadX = $derived(isPrinting ? Math.sin(printTime * 7.5) * 0.82 : -0.82);
  let scannerLightZ = $derived(isPrinting ? Math.sin(printTime * 2.2) * 0.65 : -0.65);

  useTask((delta) => {
    if (isPrinting) {
      printTime += delta;
      paperZ = (paperZ + delta * 0.28) % 0.72;
    }
  });

  function togglePrint(e: any) {
    e.stopPropagation();
    isPrinting = !isPrinting;
  }

  const cmykTanks = [
    { offset: -0.22, color: '#06b6d4', label: 'C' },
    { offset: -0.075, color: '#ec4899', label: 'M' },
    { offset: 0.075, color: '#eab308', label: 'Y' },
    { offset: 0.22, color: '#0f172a', label: 'K' }
  ];
</script>

<T.Group
  {position}
  {rotation}
  scale={hovered ? 1.02 : 1}
  onpointerenter={() => (hovered = true)}
  onpointerleave={() => (hovered = false)}
  onclick={togglePrint}
>
  <!-- ============================================== -->
  <!-- 1. SCULPTED TWO-TONE MAIN PRINTER BODY -->
  <!-- ============================================== -->
  <!-- Lower Dark Slate Base Plinth -->
  <T.Mesh position={[0, 0.14, 0]} castShadow receiveShadow>
    <RoundedBoxGeometry args={[3.48, 0.28, 2.48]} radius={0.05} smoothness={4} />
    <T.MeshPhysicalMaterial color="#1e293b" roughness={0.45} metalness={0.18} />
  </T.Mesh>

  <!-- Main Pearl-White Molded ABS Housing -->
  <T.Mesh position={[0, 0.68, 0]} castShadow receiveShadow>
    <RoundedBoxGeometry args={[3.42, 0.92, 2.42]} radius={0.08} smoothness={4} />
    <T.MeshPhysicalMaterial
      color="#f8fafc"
      roughness={0.28}
      metalness={0.06}
      clearcoat={0.35}
      clearcoatRoughness={0.2}
    />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 2. INTERNAL PRINT ENGINE BAY & MOVING PRINTHEAD CARRIAGE -->
  <!-- ============================================== -->
  <!-- Dark Internal Print Cavity -->
  <T.Mesh position={[-0.2, 0.85, 0.22]}>
    <T.BoxGeometry args={[2.35, 0.28, 0.95]} />
    <T.MeshStandardMaterial color="#090d16" roughness={0.8} />
  </T.Mesh>

  <!-- Chrome Stainless Steel Printhead Guide Rod -->
  <T.Mesh position={[-0.2, 0.88, 0.22]} rotation.z={Math.PI / 2}>
    <T.CylinderGeometry args={[0.025, 0.025, 2.2, 20]} />
    <T.MeshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
  </T.Mesh>

  <!-- Animated Piezo Printhead Carriage & CMYK Cartridges -->
  <T.Group position={[-0.2 + printHeadX, 0.91, 0.22]}>
    <T.Mesh castShadow>
      <RoundedBoxGeometry args={[0.38, 0.16, 0.34]} radius={0.02} smoothness={3} />
      <T.MeshPhysicalMaterial color="#1e293b" roughness={0.35} metalness={0.4} />
    </T.Mesh>
    <!-- 4 Mini CMYK Cartridge Caps on Printhead -->
    {#each [-0.11, -0.038, 0.038, 0.11] as cx, idx}
      <T.Mesh position={[cx, 0.085, 0]}>
        <T.BoxGeometry args={[0.06, 0.02, 0.22]} />
        <T.MeshStandardMaterial color={cmykTanks[idx].color} roughness={0.3} />
      </T.Mesh>
    {/each}
  </T.Group>

  <!-- Smoked Acrylic Top Inspection Window Over Printhead Bay -->
  <T.Mesh position={[-0.2, 1.145, 0.22]}>
    <RoundedBoxGeometry args={[2.32, 0.02, 0.88]} radius={0.008} smoothness={2} />
    <T.MeshPhysicalMaterial
      color="#0f172a"
      roughness={0.1}
      metalness={0.1}
      transparent
      opacity={0.45}
      clearcoat={1.0}
    />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 3. PAPER EXIT ROLLERS, OUTPUT TRAY & PRINTED DOCUMENT -->
  <!-- ============================================== -->
  <!-- Recessed Front Paper Exit Cavity -->
  <T.Mesh position={[-0.2, 0.38, 1.2]}>
    <T.BoxGeometry args={[2.35, 0.24, 0.08]} />
    <T.MeshStandardMaterial color="#090d16" roughness={0.85} />
  </T.Mesh>

  <!-- Rubber Paper Feed Rollers Inside Slot -->
  {#each [-0.85, -0.45, -0.05, 0.35] as rx}
    <T.Mesh position={[rx, 0.38, 1.18]} rotation.z={Math.PI / 2}>
      <T.CylinderGeometry args={[0.035, 0.035, 0.14, 16]} />
      <T.MeshStandardMaterial color="#334155" roughness={0.8} />
    </T.Mesh>
  {/each}

  <!-- Telescopic Multi-Stage Output Catch Tray -->
  <T.Mesh position={[-0.2, 0.2, 1.56]} rotation.x={0.06} castShadow receiveShadow>
    <RoundedBoxGeometry args={[2.15, 0.045, 1.28]} radius={0.015} smoothness={3} />
    <T.MeshPhysicalMaterial color="#334155" roughness={0.42} metalness={0.2} />
  </T.Mesh>

  <!-- Flip-Up Paper Stopper Extension -->
  <T.Mesh position={[-0.2, 0.25, 2.18]} rotation.x={0.35}>
    <RoundedBoxGeometry args={[1.65, 0.03, 0.26]} radius={0.01} smoothness={2} />
    <T.MeshPhysicalMaterial color="#475569" roughness={0.4} metalness={0.2} />
  </T.Mesh>

  <!-- Emerging Printed A4 Document with Real Report & Chart Texture -->
  <T.Group position={[-0.2, 0.25, 1.28 + (isPrinting ? paperZ : 0.45)]} rotation.x={0.06}>
    <T.Mesh castShadow receiveShadow>
      <T.BoxGeometry args={[1.76, 0.012, 1.48]} />
      <T.MeshStandardMaterial color="#ffffff" roughness={0.65} />
    </T.Mesh>
    <T.Mesh position={[0, 0.008, 0]} rotation.x={-Math.PI / 2}>
      <T.PlaneGeometry args={[1.68, 1.4]} />
      <T.MeshStandardMaterial map={docTexture} roughness={0.5} />
    </T.Mesh>
  </T.Group>

  <!-- ============================================== -->
  <!-- 4. REAR VERTICAL PAPER FEEDER & A4 PAPER STACK -->
  <!-- ============================================== -->
  <T.Group position={[-0.2, 1.48, -0.94]} rotation.x={-0.38}>
    <!-- Rear Tray Backrest -->
    <T.Mesh castShadow>
      <RoundedBoxGeometry args={[2.18, 1.15, 0.06]} radius={0.02} smoothness={3} />
      <T.MeshPhysicalMaterial color="#334155" roughness={0.45} metalness={0.2} />
    </T.Mesh>

    <!-- Cyan Sliding Edge Width Guides -->
    {#each [-0.94, 0.94] as gx}
      <T.Mesh position={[gx, -0.05, 0.05]}>
        <RoundedBoxGeometry args={[0.07, 0.85, 0.06]} radius={0.01} smoothness={2} />
        <T.MeshStandardMaterial color="#0284c7" roughness={0.35} />
      </T.Mesh>
    {/each}

    <!-- Stack of Blank A4 Paper Sheets -->
    <T.Mesh position={[0, 0.05, 0.055]} castShadow>
      <T.BoxGeometry args={[1.78, 1.05, 0.055]} />
      <T.MeshStandardMaterial color="#ffffff" roughness={0.65} />
    </T.Mesh>
  </T.Group>

  <!-- ============================================== -->
  <!-- 5. FLATBED SCANNER GLASS BED, CIS LIGHT BAR & LID -->
  <!-- ============================================== -->
  <!-- Scanner Bed Frame -->
  <T.Mesh position={[-0.2, 1.18, -0.35]} castShadow>
    <RoundedBoxGeometry args={[2.55, 0.06, 1.45]} radius={0.02} smoothness={3} />
    <T.MeshPhysicalMaterial color="#1e293b" roughness={0.4} metalness={0.25} />
  </T.Mesh>

  <!-- Tempered Scanner Glass Plate -->
  <T.Mesh position={[-0.2, 1.215, -0.35]} rotation.x={-Math.PI / 2}>
    <T.PlaneGeometry args={[2.25, 1.25]} />
    <T.MeshPhysicalMaterial
      color="#e0f2fe"
      roughness={0.05}
      metalness={0.1}
      clearcoat={1.0}
      transparent
      opacity={0.55}
    />
  </T.Mesh>

  <!-- Glowing Green Optical CIS Scanner Sensor Bar Sweeping Under Glass -->
  <T.Mesh position={[-0.2, 1.2, -0.35 + scannerLightZ * 0.65]}>
    <T.BoxGeometry args={[2.15, 0.015, 0.04]} />
    <T.MeshStandardMaterial
      color="#4ade80"
      emissive="#22c55e"
      emissiveIntensity={isPrinting ? 1.8 : 0.2}
    />
  </T.Mesh>

  <!-- Slightly Raised Hinged Scanner Top Cover Lid -->
  <T.Group position={[-0.2, 1.23, -1.04]} rotation.x={isPrinting ? -0.18 : -0.04}>
    <T.Mesh position={[0, 0.03, 0.7]} castShadow receiveShadow>
      <RoundedBoxGeometry args={[2.55, 0.06, 1.45]} radius={0.025} smoothness={3} />
      <T.MeshPhysicalMaterial color="#334155" roughness={0.35} metalness={0.25} clearcoat={0.2} />
    </T.Mesh>
    <!-- White Document Backing Mat Underneath Scanner Lid -->
    <T.Mesh position={[0, -0.002, 0.7]}>
      <T.BoxGeometry args={[2.25, 0.008, 1.25]} />
      <T.MeshStandardMaterial color="#f8fafc" roughness={0.6} />
    </T.Mesh>
  </T.Group>

  <!-- ============================================== -->
  <!-- 6. TILTED FRONT CONTROL PANEL & ECOTANK CMYK INK SYSTEM -->
  <!-- ============================================== -->
  <!-- Angled Control Panel Pod -->
  <T.Group position={[1.22, 1.05, 0.85]} rotation.x={-0.35}>
    <T.Mesh castShadow>
      <RoundedBoxGeometry args={[0.88, 0.06, 0.56]} radius={0.015} smoothness={3} />
      <T.MeshPhysicalMaterial color="#0f172a" roughness={0.35} metalness={0.3} />
    </T.Mesh>

    <!-- Color LCD Status Touchscreen -->
    <T.Mesh position={[0.08, 0.033, 0]}>
      <T.BoxGeometry args={[0.46, 0.01, 0.34]} />
      <T.MeshStandardMaterial
        color="#0284c7"
        emissive={isPrinting ? '#38bdf8' : '#0369a1'}
        emissiveIntensity={isPrinting ? 0.95 : 0.35}
        roughness={0.15}
      />
    </T.Mesh>

    <!-- Illuminated Power & Wi-Fi Buttons -->
    <T.Mesh position={[-0.26, 0.035, -0.1]}>
      <T.CylinderGeometry args={[0.045, 0.045, 0.015, 20]} />
      <T.MeshStandardMaterial
        color={isPrinting ? '#10b981' : '#ef4444'}
        emissive={isPrinting ? '#10b981' : '#ef4444'}
        emissiveIntensity={1.8}
      />
    </T.Mesh>
    <T.Mesh position={[-0.26, 0.035, 0.1]}>
      <T.CylinderGeometry args={[0.035, 0.035, 0.015, 20]} />
      <T.MeshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.1} />
    </T.Mesh>
  </T.Group>

  <!-- Integrated Front-Right EcoTank CMYK Ink Reservoir Bay -->
  <T.Group position={[1.22, 0.52, 1.18]}>
    <!-- Dark Ink Tank Housing -->
    <T.Mesh castShadow>
      <RoundedBoxGeometry args={[0.78, 0.56, 0.22]} radius={0.03} smoothness={3} />
      <T.MeshPhysicalMaterial color="#1e293b" roughness={0.35} metalness={0.2} />
    </T.Mesh>

    <!-- Smoked Clear Inspection Window Frame -->
    <T.Mesh position={[0, -0.02, 0.105]}>
      <RoundedBoxGeometry args={[0.68, 0.42, 0.02]} radius={0.015} smoothness={2} />
      <T.MeshPhysicalMaterial
        color="#e2e8f0"
        roughness={0.1}
        transparent
        opacity={0.35}
        clearcoat={1.0}
      />
    </T.Mesh>

    <!-- 4 Individual CMYK Ink Level Columns & Top Refill Caps -->
    {#each cmykTanks as tank, idx}
      <!-- Liquid Ink Column -->
      <T.Mesh position={[tank.offset, -0.04, 0.09]}>
        <RoundedBoxGeometry args={[0.11, 0.34 - idx * 0.02, 0.04]} radius={0.008} smoothness={2} />
        <T.MeshPhysicalMaterial
          color={tank.color}
          emissive={tank.color}
          emissiveIntensity={isPrinting ? 0.55 : 0.2}
          roughness={0.15}
          clearcoat={0.8}
        />
      </T.Mesh>
      <!-- Top Silicone Refill Cap -->
      <T.Mesh position={[tank.offset, 0.285, 0]}>
        <T.CylinderGeometry args={[0.045, 0.045, 0.03, 16]} />
        <T.MeshStandardMaterial color={tank.color} roughness={0.4} />
      </T.Mesh>
    {/each}
  </T.Group>
</T.Group>
