<script lang="ts">
  import { T } from '@threlte/core';
  import { interactivity, Text } from '@threlte/extras';

  interactivity();

  let {
    position = [0, 0, 0] as [number, number, number],
    rotation = [0.15, 0, 0] as [number, number, number]
  }: {
    position?: [number, number, number];
    rotation?: [number, number, number];
  } = $props();

  let chassisHovered = $state(false);
  let trackpadHovered = $state(false);
  let trackpadPressed = $state(false);
  let activeKeyIndex = $state<string | null>(null);
  let pressedKeyIndex = $state<string | null>(null);

  // Layout Chromebook specification:
  // Standard full-width row = ~14.5 - 15 units in relative key units
  interface KeyDef {
    id: string;
    label: string;
    width: number; // width in units (standard 1.0)
    displayLabel?: string;
    fontSize?: number;
  }

  // Row 1 (Shortcut/Top): 12 keys
  const row1: KeyDef[] = [
    { id: 'esc', label: 'esc', width: 1.15, fontSize: 0.055 },
    { id: 'f1', label: '←', width: 1.0 },
    { id: 'f2', label: '→', width: 1.0 },
    { id: 'f3', label: '↻', width: 1.0 },
    { id: 'f4', label: '⛶', width: 1.0 },
    { id: 'f5', label: '▢', width: 1.0 },
    { id: 'f6', label: '☼-', width: 1.0, fontSize: 0.055 },
    { id: 'f7', label: '☼+', width: 1.0, fontSize: 0.055 },
    { id: 'f8', label: '🔇', width: 1.0 },
    { id: 'f9', label: '🔉', width: 1.0 },
    { id: 'f10', label: '🔊', width: 1.0 },
    { id: 'power', label: '⏻', width: 1.15 }
  ];

  // Row 2 (Angka): 13 keys
  const row2: KeyDef[] = [
    { id: '`', label: '`', width: 1.0 },
    { id: '1', label: '1', width: 1.0 },
    { id: '2', label: '2', width: 1.0 },
    { id: '3', label: '3', width: 1.0 },
    { id: '4', label: '4', width: 1.0 },
    { id: '5', label: '5', width: 1.0 },
    { id: '6', label: '6', width: 1.0 },
    { id: '7', label: '7', width: 1.0 },
    { id: '8', label: '8', width: 1.0 },
    { id: '9', label: '9', width: 1.0 },
    { id: '0', label: '0', width: 1.0 },
    { id: '-', label: '-', width: 1.0 },
    { id: '=', label: '=', width: 1.0 },
    { id: 'backspace', label: 'backspace', width: 1.6, fontSize: 0.046 }
  ];

  // Row 3 (QWERTY): 14 keys
  const row3: KeyDef[] = [
    { id: 'tab', label: 'tab', width: 1.45, fontSize: 0.052 },
    { id: 'q', label: 'q', width: 1.0 },
    { id: 'w', label: 'w', width: 1.0 },
    { id: 'e', label: 'e', width: 1.0 },
    { id: 'r', label: 'r', width: 1.0 },
    { id: 't', label: 't', width: 1.0 },
    { id: 'y', label: 'y', width: 1.0 },
    { id: 'u', label: 'u', width: 1.0 },
    { id: 'i', label: 'i', width: 1.0 },
    { id: 'o', label: 'o', width: 1.0 },
    { id: 'p', label: 'p', width: 1.0 },
    { id: '[', label: '[', width: 1.0 },
    { id: ']', label: ']', width: 1.0 },
    { id: '\\', label: '\\', width: 1.15 }
  ];

  // Row 4 (Home Row): 13 keys with search/🔍
  const row4: KeyDef[] = [
    { id: 'search', label: '🔍 search', width: 1.7, fontSize: 0.046 },
    { id: 'a', label: 'a', width: 1.0 },
    { id: 's', label: 's', width: 1.0 },
    { id: 'd', label: 'd', width: 1.0 },
    { id: 'f', label: 'f', width: 1.0 },
    { id: 'g', label: 'g', width: 1.0 },
    { id: 'h', label: 'h', width: 1.0 },
    { id: 'j', label: 'j', width: 1.0 },
    { id: 'k', label: 'k', width: 1.0 },
    { id: 'l', label: 'l', width: 1.0 },
    { id: ';', label: ';', width: 1.0 },
    { id: "'", label: "'", width: 1.0 },
    { id: 'enter', label: 'enter', width: 1.9, fontSize: 0.052 }
  ];

  // Row 5 (Shift Row): 12 keys
  const row5: KeyDef[] = [
    { id: 'shift_l', label: 'shift', width: 2.15, fontSize: 0.052 },
    { id: 'z', label: 'z', width: 1.0 },
    { id: 'x', label: 'x', width: 1.0 },
    { id: 'c', label: 'c', width: 1.0 },
    { id: 'v', label: 'v', width: 1.0 },
    { id: 'b', label: 'b', width: 1.0 },
    { id: 'n', label: 'n', width: 1.0 },
    { id: 'm', label: 'm', width: 1.0 },
    { id: ',', label: ',', width: 1.0 },
    { id: '.', label: '.', width: 1.0 },
    { id: '/', label: '/', width: 1.0 },
    { id: 'shift_r', label: 'shift', width: 2.45, fontSize: 0.052 }
  ];

  // Row 6 (Bottom): ctrl, alt, space, alt, ctrl
  const row6: KeyDef[] = [
    { id: 'ctrl_l', label: 'ctrl', width: 1.45, fontSize: 0.052 },
    { id: 'alt_l', label: 'alt', width: 1.3, fontSize: 0.052 },
    { id: 'space', label: 'space', width: 7.1, fontSize: 0.048 },
    { id: 'alt_r', label: 'alt', width: 1.3, fontSize: 0.052 },
    { id: 'ctrl_r', label: 'ctrl', width: 1.45, fontSize: 0.052 }
  ];

  const KEYBOARD_ROWS = [row1, row2, row3, row4, row5, row6];

  // Dimensions
  const UNIT_SIZE = 0.205; // Base pitch per unit
  const KEY_GAP = 0.016; // Inter-key spacing
  const KEY_DEPTH = 0.19; // Keycap depth along Z
  const KEY_TOP_ROW_DEPTH = 0.14; // Thinner function row
  const TOTAL_ROW_WIDTH = 3.12; // Total active width of keyboard row
  const KEY_HEIGHT = 0.04; // Chiclet height

  // Pre-calculate key positions per row so everything is centered
  interface PositionedKey {
    id: string;
    label: string;
    fontSize: number;
    x: number;
    z: number;
    w: number;
    d: number;
  }

  // Centered around Z=0 for external keyboard
  const rowZPositions = [-0.50, -0.30, -0.10, 0.10, 0.30, 0.50];

  function computeRowKeys(keys: KeyDef[], zPos: number, isTopRow = false): PositionedKey[] {
    const totalUnits = keys.reduce((sum, k) => sum + k.width, 0);
    const gaps = (keys.length - 1) * KEY_GAP;
    const availableWidth = TOTAL_ROW_WIDTH - gaps;
    const unitWidth = availableWidth / totalUnits;
    const d = isTopRow ? KEY_TOP_ROW_DEPTH : KEY_DEPTH;

    let currentX = -TOTAL_ROW_WIDTH / 2;
    const result: PositionedKey[] = [];

    for (const k of keys) {
      const w = k.width * unitWidth;
      const x = currentX + w / 2;
      result.push({
        id: k.id,
        label: k.label,
        fontSize: k.fontSize ?? 0.065,
        x,
        z: zPos,
        w,
        d
      });
      currentX += w + KEY_GAP;
    }
    return result;
  }

  const computedKeyRows: PositionedKey[][] = KEYBOARD_ROWS.map((row, idx) =>
    computeRowKeys(row, rowZPositions[idx], idx === 0)
  );

  function handleKeyEnter(id: string, e: any) {
    e.stopPropagation();
    activeKeyIndex = id;
  }

  function handleKeyLeave(id: string, e: any) {
    e.stopPropagation();
    if (activeKeyIndex === id) activeKeyIndex = null;
    if (pressedKeyIndex === id) pressedKeyIndex = null;
  }

  function handleKeyPointerDown(id: string, e: any) {
    e.stopPropagation();
    pressedKeyIndex = id;
  }

  function handleKeyPointerUp(id: string, e: any) {
    e.stopPropagation();
    if (pressedKeyIndex === id) pressedKeyIndex = null;
  }

  function handleKeyClick(id: string, e: any) {
    e.stopPropagation();
    pressedKeyIndex = id;
    setTimeout(() => {
      if (pressedKeyIndex === id) pressedKeyIndex = null;
    }, 180);
  }
</script>

<T.Group
  {position}
  {rotation}
  scale={chassisHovered ? 1.015 : 1}
  onpointerenter={() => (chassisHovered = true)}
  onpointerleave={() => {
    chassisHovered = false;
    activeKeyIndex = null;
    pressedKeyIndex = null;
  }}
>
  <!-- ============================================== -->
  <!-- 1. STANDALONE EXTERNAL KEYBOARD CHASSIS -->
  <!-- ============================================== -->
  <!-- Bottom Base Plate (Aluminium anodized bottom with ergonomic wedge tilt) -->
  <T.Mesh position={[0, 0.045, 0]}>
    <T.BoxGeometry args={[3.38, 0.08, 1.48]} />
    <T.MeshStandardMaterial
      color={chassisHovered ? '#334155' : '#1e293b'}
      roughness={0.4}
      metalness={0.7}
    />
  </T.Mesh>

  <!-- Top Bevel Housing Plate (Dark aluminium finish) -->
  <T.Mesh position={[0, 0.09, 0]}>
    <T.BoxGeometry args={[3.34, 0.02, 1.44]} />
    <T.MeshStandardMaterial
      color={chassisHovered ? '#475569' : '#334155'}
      roughness={0.35}
      metalness={0.8}
    />
  </T.Mesh>

  <!-- Chamfered Outer Edge Accent (Premium chamfer line) -->
  <T.Mesh position={[0, 0.098, 0]}>
    <T.BoxGeometry args={[3.32, 0.006, 1.42]} />
    <T.MeshStandardMaterial
      color="#64748b"
      roughness={0.3}
      metalness={0.85}
    />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 2. RECESSED KEY BED (Ceruk Tombol Presisi) -->
  <!-- ============================================== -->
  <T.Mesh position={[0, 0.095, 0]}>
    <T.BoxGeometry args={[3.2, 0.012, 1.3]} />
    <T.MeshStandardMaterial
      color="#0f172a"
      roughness={0.7}
      metalness={0.3}
    />
  </T.Mesh>

  <!-- Subtle Inner Border Trim -->
  <T.Mesh position={[0, 0.102, -0.655]}>
    <T.BoxGeometry args={[3.22, 0.008, 0.012]} />
    <T.MeshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
  </T.Mesh>
  <T.Mesh position={[0, 0.102, 0.655]}>
    <T.BoxGeometry args={[3.22, 0.008, 0.012]} />
    <T.MeshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
  </T.Mesh>
  <T.Mesh position={[-1.605, 0.102, 0]}>
    <T.BoxGeometry args={[0.012, 0.008, 1.31]} />
    <T.MeshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
  </T.Mesh>
  <T.Mesh position={[1.605, 0.102, 0]}>
    <T.BoxGeometry args={[0.012, 0.008, 1.31]} />
    <T.MeshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 3. EXTERNAL HARDWARE DETAILS (USB-C & Feet & LED) -->
  <!-- ============================================== -->
  <!-- Rear USB-C Connector Port -->
  <T.Mesh position={[0, 0.05, -0.74]}>
    <T.BoxGeometry args={[0.16, 0.035, 0.015]} />
    <T.MeshStandardMaterial color="#020617" roughness={0.9} />
  </T.Mesh>
  <!-- USB-C Inner Port Contact -->
  <T.Mesh position={[0, 0.05, -0.742]}>
    <T.BoxGeometry args={[0.1, 0.015, 0.01]} />
    <T.MeshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
  </T.Mesh>

  <!-- Power / Bluetooth LED Indicator Dot -->
  <T.Mesh position={[1.45, 0.103, -0.67]}>
    <T.CylinderGeometry args={[0.012, 0.012, 0.005, 16]} />
    <T.MeshStandardMaterial
      color={chassisHovered ? '#38bdf8' : '#10b981'}
      emissive={chassisHovered ? '#38bdf8' : '#10b981'}
      emissiveIntensity={0.8}
    />
  </T.Mesh>

  <!-- Non-slip Rubber Feet (4 corners under keyboard) -->
  <T.Mesh position={[-1.5, 0.002, 0.6]}>
    <T.CylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.9} />
  </T.Mesh>
  <T.Mesh position={[1.5, 0.002, 0.6]}>
    <T.CylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.9} />
  </T.Mesh>
  <T.Mesh position={[-1.5, 0.002, -0.6]}>
    <T.CylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.9} />
  </T.Mesh>
  <T.Mesh position={[1.5, 0.002, -0.6]}>
    <T.CylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.9} />
  </T.Mesh>

  <!-- Rear ergonomic tilt risers / feet -->
  <T.Mesh position={[-1.3, 0.01, -0.58]}>
    <T.BoxGeometry args={[0.2, 0.02, 0.06]} />
    <T.MeshStandardMaterial color="#334155" roughness={0.7} />
  </T.Mesh>
  <T.Mesh position={[1.3, 0.01, -0.58]}>
    <T.BoxGeometry args={[0.2, 0.02, 0.06]} />
    <T.MeshStandardMaterial color="#334155" roughness={0.7} />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 4. CHICLET KEYCAPS MATRIX & LABELS -->
  <!-- ============================================== -->
  {#each computedKeyRows as rowKeys}
    {#each rowKeys as key (key.id)}
      {@const isHovered = activeKeyIndex === key.id}
      {@const isPressed = pressedKeyIndex === key.id}
      {@const keyY = 0.115 + (isPressed ? -0.016 : isHovered ? -0.005 : 0)}

      <T.Group position={[key.x, keyY, key.z]}>
        <!-- Keycap Mesh (Chiclet balok tipis, matte abu-abu gelap / hitam) -->
        <T.Mesh
          onpointerenter={(e: any) => handleKeyEnter(key.id, e)}
          onpointerleave={(e: any) => handleKeyLeave(key.id, e)}
          onpointerdown={(e: any) => handleKeyPointerDown(key.id, e)}
          onpointerup={(e: any) => handleKeyPointerUp(key.id, e)}
          onclick={(e: any) => handleKeyClick(key.id, e)}
        >
          <T.BoxGeometry args={[key.w, KEY_HEIGHT, key.d]} />
          <T.MeshStandardMaterial
            color={isPressed ? '#2563eb' : isHovered ? '#334155' : '#1e2025'}
            roughness={0.5}
            metalness={0.1}
            emissive={isPressed ? '#1d4ed8' : isHovered ? '#0284c7' : '#000000'}
            emissiveIntensity={isPressed ? 0.7 : isHovered ? 0.3 : 0}
          />
        </T.Mesh>

        <!-- Subtle keycap underside skirt / switch stem visual -->
        {#if isHovered || isPressed}
          <T.Mesh position={[0, -0.015, 0]}>
            <T.BoxGeometry args={[key.w * 0.9, 0.01, key.d * 0.9]} />
            <T.MeshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.5} />
          </T.Mesh>
        {/if}

        <!-- Key Label Text: @threlte/extras <Text> slightly above key surface (y + 0.021) to prevent z-fighting -->
        <Text
          text={key.label}
          fontSize={key.fontSize}
          color={isPressed ? '#93c5fd' : isHovered ? '#38bdf8' : '#f8fafc'}
          position={[0, KEY_HEIGHT / 2 + 0.002, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.95}
        />
      </T.Group>
    {/each}
  {/each}
</T.Group>

