<script lang="ts">
  import { T } from '@threlte/core';
  import { interactivity, RoundedBoxGeometry } from '@threlte/extras';
  import * as THREE from 'three';

  interactivity();

  const keyTextureCache = new Map<string, THREE.CanvasTexture>();

  // Cached crisp CanvasTexture for keycap label completely offline using local system fonts
  function createKeyLabelTexture(
    label: string,
    isPressed: boolean,
    isHovered: boolean
  ): THREE.CanvasTexture {
    const cacheKey = `${label}|${isPressed ? 1 : 0}|${isHovered ? 1 : 0}`;
    const cached = keyTextureCache.get(cacheKey);
    if (cached) return cached;

    if (typeof document === 'undefined') {
      return new THREE.CanvasTexture(null as unknown as HTMLCanvasElement);
    }

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, 256, 256);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isPressed ? '#e0f2fe' : isHovered ? '#38bdf8' : '#f8fafc';

    let fontSize = 90;
    if (label.length > 5) {
      fontSize = 44;
    } else if (label.length > 2) {
      fontSize = 56;
    }

    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
    ctx.fillText(label.toUpperCase(), 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    keyTextureCache.set(cacheKey, texture);
    return texture;
  }

  let {
    position = [0, 0, 0] as [number, number, number],
    rotation = [0.15, 0, 0] as [number, number, number]
  }: {
    position?: [number, number, number];
    rotation?: [number, number, number];
  } = $props();

  let chassisHovered = $state(false);
  let activeKeyIndex = $state<string | null>(null);
  let pressedKeyIndex = $state<string | null>(null);

  interface KeyDef {
    id: string;
    label: string;
    width: number;
    variant?: 'alpha' | 'mod' | 'accent';
    fontSize?: number;
  }

  // Row 1 (Function/Media Row): 12 keys
  const row1: KeyDef[] = [
    { id: 'esc', label: 'esc', width: 1.15, variant: 'accent', fontSize: 0.055 },
    { id: 'f1', label: '←', width: 1.0, variant: 'mod' },
    { id: 'f2', label: '→', width: 1.0, variant: 'mod' },
    { id: 'f3', label: '↻', width: 1.0, variant: 'mod' },
    { id: 'f4', label: '⛶', width: 1.0, variant: 'mod' },
    { id: 'f5', label: '▢', width: 1.0, variant: 'mod' },
    { id: 'f6', label: '☼-', width: 1.0, variant: 'mod', fontSize: 0.055 },
    { id: 'f7', label: '☼+', width: 1.0, variant: 'mod', fontSize: 0.055 },
    { id: 'f8', label: '🔇', width: 1.0, variant: 'mod' },
    { id: 'f9', label: '🔉', width: 1.0, variant: 'mod' },
    { id: 'f10', label: '🔊', width: 1.0, variant: 'mod' },
    { id: 'power', label: '⏻', width: 1.15, variant: 'accent' }
  ];

  // Row 2 (Number Row)
  const row2: KeyDef[] = [
    { id: '`', label: '`', width: 1.0, variant: 'mod' },
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
    { id: 'backspace', label: '⌫ back', width: 1.6, variant: 'mod', fontSize: 0.046 }
  ];

  // Row 3 (QWERTY)
  const row3: KeyDef[] = [
    { id: 'tab', label: 'tab ⇥', width: 1.45, variant: 'mod', fontSize: 0.052 },
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
    { id: '\\', label: '\\', width: 1.15, variant: 'mod' }
  ];

  // Row 4 (Home Row)
  const row4: KeyDef[] = [
    { id: 'search', label: '🔍 caps', width: 1.7, variant: 'mod', fontSize: 0.046 },
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
    { id: 'enter', label: '↵ enter', width: 1.9, variant: 'accent', fontSize: 0.052 }
  ];

  // Row 5 (Shift Row)
  const row5: KeyDef[] = [
    { id: 'shift_l', label: '⇧ shift', width: 2.15, variant: 'mod', fontSize: 0.052 },
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
    { id: 'shift_r', label: '⇧ shift', width: 2.45, variant: 'mod', fontSize: 0.052 }
  ];

  // Row 6 (Bottom Modifiers + Spacebar)
  const row6: KeyDef[] = [
    { id: 'ctrl_l', label: 'ctrl', width: 1.45, variant: 'mod', fontSize: 0.052 },
    { id: 'alt_l', label: 'alt', width: 1.3, variant: 'mod', fontSize: 0.052 },
    { id: 'space', label: '', width: 7.1, variant: 'alpha', fontSize: 0.048 },
    { id: 'alt_r', label: 'alt', width: 1.3, variant: 'mod', fontSize: 0.052 },
    { id: 'ctrl_r', label: 'ctrl', width: 1.45, variant: 'mod', fontSize: 0.052 }
  ];

  const KEYBOARD_ROWS = [row1, row2, row3, row4, row5, row6];

  const KEY_GAP = 0.017;
  const KEY_DEPTH = 0.188;
  const KEY_TOP_ROW_DEPTH = 0.145;
  const TOTAL_ROW_WIDTH = 3.12;
  const KEY_HEIGHT = 0.048;

  interface PositionedKey {
    id: string;
    label: string;
    variant: 'alpha' | 'mod' | 'accent';
    fontSize: number;
    x: number;
    z: number;
    w: number;
    d: number;
  }

  const rowZPositions = [-0.5, -0.3, -0.1, 0.1, 0.3, 0.5];

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
        variant: k.variant ?? 'alpha',
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

  function getKeyBaseColor(variant: 'alpha' | 'mod' | 'accent', isPressed: boolean, isHovered: boolean) {
    if (isPressed) return '#2563eb';
    if (isHovered) return '#334155';
    if (variant === 'accent') return '#0284c7';
    if (variant === 'mod') return '#334155';
    return '#1e293b';
  }

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
  <!-- 1. CNC ANODIZED ALUMINUM CUSTOM KEYBOARD CHASSIS -->
  <!-- ============================================== -->
  <!-- Lower CNC Aluminum Case Body -->
  <T.Mesh position={[0, 0.048, 0]} castShadow receiveShadow>
    <RoundedBoxGeometry args={[3.42, 0.088, 1.52]} radius={0.035} smoothness={4} />
    <T.MeshPhysicalMaterial
      color="#1e293b"
      roughness={0.28}
      metalness={0.82}
      clearcoat={0.25}
    />
  </T.Mesh>

  <!-- Upper Beveled Aluminum Top Frame -->
  <T.Mesh position={[0, 0.092, 0]} castShadow receiveShadow>
    <RoundedBoxGeometry args={[3.36, 0.026, 1.46]} radius={0.025} smoothness={4} />
    <T.MeshPhysicalMaterial
      color="#334155"
      roughness={0.25}
      metalness={0.86}
      clearcoat={0.3}
    />
  </T.Mesh>

  <!-- Underside Brushed Brass Acoustic Weight Bar -->
  <T.Mesh position={[0, 0.003, -0.15]}>
    <RoundedBoxGeometry args={[2.1, 0.01, 0.48]} radius={0.005} smoothness={2} />
    <T.MeshPhysicalMaterial color="#f59e0b" metalness={0.92} roughness={0.18} />
  </T.Mesh>

  <!-- Side RGB Underglow Diffuser Strips (Left & Right Flanks) -->
  {#each [-1.71, 1.71] as x}
    <T.Mesh position={[x, 0.045, 0]}>
      <T.BoxGeometry args={[0.012, 0.02, 1.15]} />
      <T.MeshStandardMaterial
        color="#38bdf8"
        emissive="#0284c7"
        emissiveIntensity={chassisHovered ? 1.2 : 0.65}
      />
    </T.Mesh>
  {/each}

  <!-- ============================================== -->
  <!-- 2. RECESSED SWITCH PLATE & PER-KEY BACKLIGHT GLOW -->
  <!-- ============================================== -->
  <T.Mesh position={[0, 0.096, 0]} receiveShadow>
    <T.BoxGeometry args={[3.2, 0.012, 1.3]} />
    <T.MeshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.4} />
  </T.Mesh>

  <!-- Subtle Per-Key Backlight Bleeding Sheet on Switch Plate -->
  <T.Mesh position={[0, 0.103, 0]} rotation.x={-Math.PI / 2}>
    <T.PlaneGeometry args={[3.14, 1.24]} />
    <T.MeshBasicMaterial
      color="#38bdf8"
      transparent
      opacity={chassisHovered ? 0.22 : 0.12}
    />
  </T.Mesh>

  <!-- ============================================== -->
  <!-- 3. DETACHABLE USB-C PORT, INDICATOR LEDS & RUBBER FEET -->
  <!-- ============================================== -->
  <!-- Rear Gold-Plated USB-C Female Port Housing -->
  <T.Mesh position={[0, 0.055, -0.76]}>
    <RoundedBoxGeometry args={[0.22, 0.05, 0.02]} radius={0.01} smoothness={2} />
    <T.MeshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
  </T.Mesh>
  <T.Mesh position={[0, 0.055, -0.768]}>
    <T.BoxGeometry args={[0.14, 0.022, 0.01]} />
    <T.MeshStandardMaterial color="#020617" roughness={0.9} />
  </T.Mesh>

  <!-- Status Indicator LED Trio (Caps, Wireless, Battery) -->
  {#each [1.38, 1.45, 1.52] as lx, idx}
    <T.Mesh position={[lx, 0.106, -0.68]}>
      <T.CylinderGeometry args={[0.01, 0.01, 0.005, 16]} />
      <T.MeshStandardMaterial
        color={idx === 0 ? '#38bdf8' : idx === 1 ? '#a855f7' : '#10b981'}
        emissive={idx === 0 ? '#38bdf8' : idx === 1 ? '#a855f7' : '#10b981'}
        emissiveIntensity={1.2}
      />
    </T.Mesh>
  {/each}

  <!-- 4 Non-Slip Silicone Feet & Flip-Out Kickstands -->
  {#each [-1.52, 1.52] as fx}
    {#each [-0.62, 0.62] as fz}
      <T.Mesh position={[fx, 0.004, fz]}>
        <T.CylinderGeometry args={[0.05, 0.05, 0.012, 16]} />
        <T.MeshStandardMaterial color="#090d16" roughness={0.9} />
      </T.Mesh>
    {/each}
    <T.Mesh position={[fx * 0.85, 0.012, -0.58]}>
      <RoundedBoxGeometry args={[0.22, 0.025, 0.08]} radius={0.006} smoothness={2} />
      <T.MeshStandardMaterial color="#334155" roughness={0.5} metalness={0.5} />
    </T.Mesh>
  {/each}

  <!-- ============================================== -->
  <!-- 4. SCULPTED PBT KEYCAPS & MECHANICAL SWITCH STEMS -->
  <!-- ============================================== -->
  {#each computedKeyRows as rowKeys}
    {#each rowKeys as key (key.id)}
      {@const isHovered = activeKeyIndex === key.id}
      {@const isPressed = pressedKeyIndex === key.id}
      {@const keyY = 0.122 + (isPressed ? -0.018 : isHovered ? -0.005 : 0)}
      {@const keyColor = getKeyBaseColor(key.variant, isPressed, isHovered)}

      <T.Group position={[key.x, keyY, key.z]}>
        <!-- Mechanical Switch Housing / Stem Under Keycap -->
        <T.Mesh position={[0, -0.018, 0]}>
          <T.BoxGeometry args={[key.w * 0.72, 0.016, key.d * 0.72]} />
          <T.MeshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={isPressed ? 1.4 : isHovered ? 0.8 : 0.25}
          />
        </T.Mesh>

        <!-- Sculpted Doubleshot PBT Keycap with Rounded Bevel Edges -->
        <T.Mesh
          castShadow
          receiveShadow
          onpointerenter={(e: any) => handleKeyEnter(key.id, e)}
          onpointerleave={(e: any) => handleKeyLeave(key.id, e)}
          onpointerdown={(e: any) => handleKeyPointerDown(key.id, e)}
          onpointerup={(e: any) => handleKeyPointerUp(key.id, e)}
          onclick={(e: any) => handleKeyClick(key.id, e)}
        >
          <RoundedBoxGeometry args={[key.w, KEY_HEIGHT, key.d]} radius={0.012} smoothness={3} />
          <T.MeshPhysicalMaterial
            color={keyColor}
            roughness={0.42}
            metalness={0.08}
            clearcoat={0.15}
            clearcoatRoughness={0.35}
            emissive={isPressed ? '#1d4ed8' : isHovered ? '#0284c7' : '#000000'}
            emissiveIntensity={isPressed ? 0.6 : isHovered ? 0.25 : 0}
          />
        </T.Mesh>

        <!-- Tactile Homing Bar on F and J Keys -->
        {#if key.id === 'f' || key.id === 'j'}
          <T.Mesh position={[0, KEY_HEIGHT / 2 + 0.002, 0.045]}>
            <T.BoxGeometry args={[0.06, 0.004, 0.012]} />
            <T.MeshStandardMaterial color="#94a3b8" roughness={0.3} />
          </T.Mesh>
        {/if}

        <!-- Keycap Legend Texture -->
        {#if key.label}
          <T.Mesh position={[0, KEY_HEIGHT / 2 + 0.0015, 0]} rotation.x={-Math.PI / 2}>
            <T.PlaneGeometry args={[key.w * 0.88, key.d * 0.82]} />
            <T.MeshBasicMaterial
              map={createKeyLabelTexture(key.label, isPressed, isHovered)}
              transparent
              opacity={0.96}
              depthWrite={false}
            />
          </T.Mesh>
        {/if}
      </T.Group>
    {/each}
  {/each}
</T.Group>
