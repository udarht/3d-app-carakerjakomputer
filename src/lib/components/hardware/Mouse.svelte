<script lang="ts">
  import { T } from '@threlte/core';
  import { interactivity } from '@threlte/extras';

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
    setTimeout(() => (wheelPressed = false), 140);
  }
</script>

<!-- Outer Container: diletakkan pas di atas meja (Y=0) -->
<T.Group
  {position}
  {rotation}
  scale={hovered ? 1.02 : 1}
  onpointerenter={handlePointerEnter}
  onpointerleave={handlePointerLeave}
>
  <!-- ============================================== -->
  <!-- 1. BAGIAN BAWAH (Base Plate, Mouse Feet & Optik) -->
  <!-- ============================================== -->
  <!-- Base Chassis (Alas Bawah Datar Matte Dark Slate) -->
  <T.Mesh position={[0, 0.04, 0]}>
    <T.BoxGeometry args={[1.36, 0.075, 2.3]} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.2} />
  </T.Mesh>

  <!-- Front Curved Skid Foot (Mouse skate depan) -->
  <T.Mesh position={[0, 0.005, -0.88]}>
    <T.BoxGeometry args={[0.96, 0.01, 0.26]} />
    <T.MeshStandardMaterial color="#1e293b" roughness={0.25} metalness={0.15} />
  </T.Mesh>

  <!-- Rear Skid Foot (Mouse skate belakang) -->
  <T.Mesh position={[0, 0.005, 0.88]}>
    <T.BoxGeometry args={[1.06, 0.01, 0.32]} />
    <T.MeshStandardMaterial color="#1e293b" roughness={0.25} metalness={0.15} />
  </T.Mesh>

  <!-- Optical Sensor Cavity (Cincin Sensor Optik) -->
  <T.Mesh position={[0, 0.008, 0.04]} rotation.x={Math.PI / 2}>
    <T.RingGeometry args={[0.07, 0.16, 24]} />
    <T.MeshStandardMaterial color="#334155" roughness={0.6} />
  </T.Mesh>
  <!-- Optical Lens / Sensor Glow Lembut -->
  <T.Mesh position={[0, 0.007, 0.04]} rotation.x={Math.PI / 2}>
    <T.CircleGeometry args={[0.065, 20]} />
    <T.MeshStandardMaterial
      color="#38bdf8"
      emissive="#0ea5e9"
      emissiveIntensity={hovered ? 1.0 : 0.4}
      roughness={0.2}
    />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 2. PUNGGUNG MOUSE (Kubah Ergonomis Lembut & Melandai) -->
  <!-- ============================================== -->
  <!-- Kubah Punggung Belakang (Higher rear palm dome - Space Grey / Graphite #334155) -->
  <T.Mesh position={[0, 0.46, 0.36]} scale={[1.36, 0.82, 1.4]}>
    <T.SphereGeometry args={[0.5, 32, 24]} />
    <T.MeshStandardMaterial
      color={hovered ? '#3e4c5e' : '#334155'}
      roughness={0.4}
      metalness={0.25}
    />
  </T.Mesh>

  <!-- Badan Tengah Melandai ke Depan (Mid-arch smooth slope transition) -->
  <T.Mesh position={[0, 0.41, -0.06]} rotation.x={-0.18}>
    <T.BoxGeometry args={[1.32, 0.46, 0.88]} />
    <T.MeshStandardMaterial
      color={hovered ? '#3e4c5e' : '#334155'}
      roughness={0.4}
      metalness={0.25}
    />
  </T.Mesh>

  <!-- Sisi Kiri & Kanan Berlekuk Halus (Smooth Ergonomic Side Walls - Sedikit lebih gelap) -->
  <T.Mesh position={[-0.62, 0.26, 0.05]} rotation.z={-0.16} scale={[0.16, 0.46, 1.95]}>
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.2} />
  </T.Mesh>
  <T.Mesh position={[0.62, 0.26, 0.05]} rotation.z={0.16} scale={[0.16, 0.46, 1.95]}>
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.2} />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 3. TOMBOL KLIK KIRI & KANAN (Dengan Animasi Tekan) -->
  <!-- ============================================== -->
  <!-- Tombol Klik Kiri (Left Click Button) -->
  <T.Mesh
    position={[-0.32, (leftPressed ? 0.30 : 0.325), -0.68]}
    rotation.x={-0.22}
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
    <T.BoxGeometry args={[0.56, 0.09, 0.84]} />
    <T.MeshStandardMaterial
      color={leftPressed ? '#1e293b' : '#334155'}
      roughness={0.42}
      metalness={0.2}
      emissive={leftPressed ? '#0284c7' : '#000000'}
      emissiveIntensity={leftPressed ? 0.4 : 0}
    />
  </T.Mesh>

  <!-- Tombol Klik Kanan (Right Click Button) -->
  <T.Mesh
    position={[0.32, (rightPressed ? 0.30 : 0.325), -0.68]}
    rotation.x={-0.22}
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
    <T.BoxGeometry args={[0.56, 0.09, 0.84]} />
    <T.MeshStandardMaterial
      color={rightPressed ? '#1e293b' : '#334155'}
      roughness={0.42}
      metalness={0.2}
      emissive={rightPressed ? '#0284c7' : '#000000'}
      emissiveIntensity={rightPressed ? 0.4 : 0}
    />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 4. CELAH PEMISAH (Seam/Slit) & CERUK RODA GULIR -->
  <!-- ============================================== -->
  <!-- Garis Pemisah Tengah (Center Divider Seam - Garis tegas gelap) -->
  <T.Mesh position={[0, 0.30, -0.68]} rotation.x={-0.22}>
    <T.BoxGeometry args={[0.035, 0.11, 0.86]} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.7} />
  </T.Mesh>

  <!-- Celah Melintang Horisontal Pemisah Tombol dari Bodi Belakang -->
  <T.Mesh position={[0, 0.38, -0.25]}>
    <T.BoxGeometry args={[1.28, 0.06, 0.03]} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.7} />
  </T.Mesh>

  <!-- Ceruk Tempat Dudukan Scroll Wheel (Wheel Well Cavity) -->
  <T.Mesh position={[0, 0.33, -0.58]}>
    <T.BoxGeometry args={[0.18, 0.16, 0.44]} />
    <T.MeshStandardMaterial color="#0b0f19" roughness={0.9} />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 5. RODA GULIR (Scroll Wheel) -->
  <!-- ============================================== -->
  <T.Group
    position={[0, (wheelPressed ? 0.38 : 0.395), -0.58]}
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
    <!-- Silinder Karet Scroll Wheel (#475569 dengan aksen metallic hub) -->
    <T.Mesh rotation.z={Math.PI / 2}>
      <T.CylinderGeometry args={[0.14, 0.14, 0.11, 24]} />
      <T.MeshStandardMaterial
        color={wheelPressed ? '#0f172a' : wheelHovered ? '#64748b' : '#475569'}
        roughness={0.5}
        metalness={0.25}
      />
    </T.Mesh>

    <!-- Lingkar Tekstur Grip Tengah Roda -->
    <T.Mesh rotation.z={Math.PI / 2}>
      <T.TorusGeometry args={[0.141, 0.015, 12, 24]} />
      <T.MeshStandardMaterial
        color={wheelHovered ? '#38bdf8' : '#1e293b'}
        roughness={0.7}
      />
    </T.Mesh>
  </T.Group>
</T.Group>

