<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, HTML, RoundedBoxGeometry } from '@threlte/extras';
  import {
    getCpuLgaPadsTexture,
    getGoldPinsTexture,
    getPcbCircuitTexture
  } from '$lib/utils/textures';

  interactivity();

  let {
    position = [0, 0.55, 0] as [number, number, number],
    rotation = [0.35, 0, 0] as [number, number, number],
    autoRotate = true,
    showOverlay = true,
    gpuVariant,
    onVariantChange
  }: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    autoRotate?: boolean;
    showOverlay?: boolean;
    gpuVariant?: 'integrated' | 'dedicated';
    onVariantChange?: (v: 'integrated' | 'dedicated') => void;
  } = $props();

  let rotY = $state(-0.3);
  let isPaused = $state(false);
  let showDetails = $state(false);
  let localActiveVariant = $state<'integrated' | 'dedicated'>('dedicated');
  let activeVariant = $derived(gpuVariant ?? localActiveVariant);
  let hovered = $state(false);
  let fanRot = $state(0);

  const igpuPcbTex = getPcbCircuitTexture('#064e3b', '#10b981');
  const dgpuPcbTex = getPcbCircuitTexture('#0f172a', '#38bdf8');
  const lgaPadsTex = getCpuLgaPadsTexture();
  const pciePinsTex = getGoldPinsTexture(48);

  // 28 individual aluminum heatsink fins for realistic fin stack
  const finPositions = Array.from({ length: 28 }, (_, i) => -1.75 + i * 0.13);
  // 9 fan blade angles
  const fanBladeAngles = [0, 40, 80, 120, 160, 200, 240, 280, 320];

  function setVariant(variant: 'integrated' | 'dedicated') {
    localActiveVariant = variant;
    onVariantChange?.(variant);
  }

  useTask((delta) => {
    if (autoRotate && !isPaused) {
      rotY += delta * 0.4;
    }
    fanRot += delta * 9.0;
  });

  function toggleClick(e: any) {
    e.stopPropagation();
    showDetails = !showDetails;
    isPaused = showDetails;
  }
</script>

<T.Group
  {position}
  rotation={[rotation[0], rotation[1] + rotY, rotation[2]]}
  scale={hovered ? 1.04 : 1}
  onpointerenter={() => (hovered = true)}
  onpointerleave={() => (hovered = false)}
  onclick={toggleClick}
>
  {#if activeVariant === 'integrated'}
    <!-- ============================================== -->
    <!-- VARIAN 1: INTEGRATED GPU (iGPU / SoC Architecture) -->
    <!-- ============================================== -->
    <T.Group position={[0, 0, 0]}>
      <!-- 1. Multi-Layer Emerald FR4 Substrate -->
      <T.Mesh position={[0, 0, 0]} castShadow receiveShadow>
        <RoundedBoxGeometry args={[2.6, 0.085, 2.6]} radius={0.03} smoothness={4} />
        <T.MeshPhysicalMaterial
          map={igpuPcbTex}
          color="#065f46"
          roughness={0.38}
          metalness={0.2}
          clearcoat={0.3}
        />
      </T.Mesh>

      <!-- 2. Underside Gold BGA/LGA Contact Matrix -->
      <T.Mesh position={[0, -0.045, 0]} rotation.x={Math.PI / 2}>
        <T.PlaneGeometry args={[2.4, 2.4]} />
        <T.MeshStandardMaterial map={lgaPadsTex} roughness={0.25} metalness={0.85} />
      </T.Mesh>

      <!-- 3. Nickel Stiffener Frame Around Silicon Die -->
      <T.Mesh position={[0, 0.055, 0]} castShadow>
        <RoundedBoxGeometry args={[2.25, 0.03, 2.25]} radius={0.02} smoothness={3} />
        <T.MeshPhysicalMaterial color="#cbd5e1" roughness={0.25} metalness={0.88} />
      </T.Mesh>
      <T.Mesh position={[0, 0.058, 0]}>
        <T.BoxGeometry args={[1.82, 0.032, 1.82]} />
        <T.MeshStandardMaterial map={igpuPcbTex} color="#064e3b" roughness={0.4} />
      </T.Mesh>

      <!-- 4. Exposed Mirror-Polished SoC Silicon Die (CPU + iGPU Tile) -->
      <T.Mesh position={[0, 0.095, 0]} castShadow>
        <RoundedBoxGeometry args={[1.42, 0.065, 1.15]} radius={0.015} smoothness={3} />
        <T.MeshPhysicalMaterial
          color="#0f172a"
          roughness={0.06}
          metalness={0.95}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
        />
      </T.Mesh>

      <!-- CPU Cores Zone (Left Tile) -->
      <T.Mesh position={[-0.34, 0.13, 0]}>
        <T.BoxGeometry args={[0.56, 0.008, 0.98]} />
        <T.MeshPhysicalMaterial
          color="#6366f1"
          emissive="#4f46e5"
          emissiveIntensity={0.35}
          roughness={0.12}
          metalness={0.85}
        />
      </T.Mesh>

      <!-- iGPU Compute Shaders Zone (Right Highlighted Tile) -->
      <T.Mesh position={[0.3, 0.132, 0]}>
        <T.BoxGeometry args={[0.62, 0.01, 0.98]} />
        <T.MeshPhysicalMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={showDetails ? 1.1 : 0.65}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1.0}
        />
      </T.Mesh>

      <!-- Shader Core Sub-Grid Lines on iGPU Tile -->
      {#each [-0.32, 0, 0.32] as sz}
        <T.Mesh position={[0.3, 0.138, sz]}>
          <T.BoxGeometry args={[0.54, 0.005, 0.22]} />
          <T.MeshStandardMaterial
            color="#e0f2fe"
            emissive="#38bdf8"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </T.Mesh>
      {/each}

      <!-- 5. Gold Pin-1 Corner Triangle -->
      <T.Mesh position={[-1.08, 0.075, 1.08]} rotation.y={-Math.PI / 4}>
        <T.ConeGeometry args={[0.09, 0.012, 3]} />
        <T.MeshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.9} />
      </T.Mesh>

      <!-- 6. Surrounding Micro SMD MLCC Decoupling Capacitors -->
      {#each [-0.55, -0.2, 0.2, 0.55] as pos}
        {#each [-0.76, 0.76] as side}
          <T.Mesh position={[pos, 0.082, side]}>
            <T.BoxGeometry args={[0.14, 0.025, 0.06]} />
            <T.MeshStandardMaterial color="#b45309" roughness={0.35} metalness={0.3} />
          </T.Mesh>
        {/each}
      {/each}
    </T.Group>
  {:else}
    <!-- ============================================== -->
    <!-- VARIAN 2: DEDICATED GPU (dGPU PCIe 4.0 x16 Graphics Card) -->
    <!-- ============================================== -->
    <T.Group position={[0, 0, 0]}>
      <!-- 1. High-Density Matte Black GPU PCB -->
      <T.Mesh position={[0, 0, 0]} castShadow receiveShadow>
        <RoundedBoxGeometry args={[4.4, 0.08, 2.2]} radius={0.02} smoothness={3} />
        <T.MeshPhysicalMaterial
          map={dgpuPcbTex}
          color="#0f172a"
          roughness={0.4}
          metalness={0.25}
          clearcoat={0.2}
        />
      </T.Mesh>

      <!-- 2. PCIe x16 Gold Edge Connector + Retention Hook -->
      <!-- Short Power Pins Section -->
      <T.Mesh position={[-1.12, -0.01, 1.16]}>
        <T.BoxGeometry args={[0.42, 0.055, 0.16]} />
        <T.MeshStandardMaterial map={pciePinsTex} color="#fbbf24" metalness={0.9} roughness={0.2} />
      </T.Mesh>
      <!-- Long x16 Data Lanes Section -->
      <T.Mesh position={[0.08, -0.01, 1.16]}>
        <T.BoxGeometry args={[1.82, 0.055, 0.16]} />
        <T.MeshStandardMaterial map={pciePinsTex} color="#fbbf24" metalness={0.9} roughness={0.2} />
      </T.Mesh>
      <!-- PCIe Retention Lock Tab -->
      <T.Mesh position={[1.12, -0.01, 1.15]}>
        <T.BoxGeometry args={[0.16, 0.06, 0.14]} />
        <T.MeshStandardMaterial color="#0f172a" roughness={0.5} />
      </T.Mesh>

      <!-- 3. Stainless Steel Dual-Slot Rear I/O Bracket -->
      <T.Mesh position={[-2.24, 0.34, 0]} castShadow>
        <RoundedBoxGeometry args={[0.07, 1.05, 2.32]} radius={0.015} smoothness={3} />
        <T.MeshPhysicalMaterial color="#cbd5e1" roughness={0.22} metalness={0.9} />
      </T.Mesh>
      <!-- Bracket Top Mounting Flange -->
      <T.Mesh position={[-2.32, 0.34, -1.16]}>
        <T.BoxGeometry args={[0.22, 1.05, 0.05]} />
        <T.MeshPhysicalMaterial color="#cbd5e1" roughness={0.22} metalness={0.9} />
      </T.Mesh>

      <!-- 3x DisplayPort + 1x HDMI Gold-Plated Port Housings -->
      {#each [-0.65, -0.2, 0.25, 0.7] as z, idx}
        <T.Group position={[-2.28, 0.26, z]}>
          <T.Mesh>
            <T.BoxGeometry args={[0.06, 0.13, idx === 3 ? 0.28 : 0.32]} />
            <T.MeshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
          </T.Mesh>
          <T.Mesh position={[-0.02, 0, 0]}>
            <T.BoxGeometry args={[0.03, 0.04, 0.2]} />
            <T.MeshStandardMaterial color="#fbbf24" roughness={0.25} metalness={0.9} />
          </T.Mesh>
        </T.Group>
      {/each}

      <!-- 4. Anodized Aluminum Vented Backplate (Underside of PCB) -->
      <T.Mesh position={[0, -0.06, 0]} castShadow receiveShadow>
        <RoundedBoxGeometry args={[4.32, 0.035, 2.16]} radius={0.015} smoothness={3} />
        <T.MeshPhysicalMaterial color="#1e293b" roughness={0.32} metalness={0.82} />
      </T.Mesh>
      <!-- Backplate GPU Core X-Clamp & MLCC Cavity -->
      <T.Mesh position={[-0.75, -0.08, 0]} rotation.y={Math.PI / 4}>
        <T.BoxGeometry args={[0.55, 0.015, 0.55]} />
        <T.MeshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.9} />
      </T.Mesh>
      <T.Mesh position={[-0.75, -0.085, 0]}>
        <T.BoxGeometry args={[0.32, 0.015, 0.32]} />
        <T.MeshStandardMaterial color="#b45309" roughness={0.35} metalness={0.5} />
      </T.Mesh>

      <!-- 5. Dense Aluminum Fin Stack Array & 4 Copper Heatpipes -->
      <T.Group position={[0.05, 0.21, 0]}>
        {#each finPositions as fx}
          <T.Mesh position={[fx, 0, 0]} castShadow>
            <T.BoxGeometry args={[0.035, 0.32, 2.02]} />
            <T.MeshStandardMaterial color="#cbd5e1" roughness={0.28} metalness={0.88} />
          </T.Mesh>
        {/each}

        <!-- 4 Polished Copper Heatpipes Running Through Fins -->
        {#each [-0.62, -0.22, 0.22, 0.62] as hz}
          <T.Mesh position={[0.05, 0, hz]} rotation.z={Math.PI / 2} castShadow>
            <T.CylinderGeometry args={[0.052, 0.052, 4.05, 20]} />
            <T.MeshPhysicalMaterial
              color="#d97706"
              roughness={0.18}
              metalness={0.92}
              clearcoat={0.35}
            />
          </T.Mesh>
        {/each}
      </T.Group>

      <!-- 6. Sculpted Brushed Aluminum/Gunmetal Cooler Shroud (Lifts when showDetails is active) -->
      <T.Group position={[0.05, showDetails ? 0.82 : 0.45, 0]}>
        <!-- Main Shroud Body -->
        <T.Mesh castShadow receiveShadow>
          <RoundedBoxGeometry args={[4.22, 0.18, 2.16]} radius={0.04} smoothness={4} />
          <T.MeshPhysicalMaterial
            color="#334155"
            roughness={0.28}
            metalness={0.78}
            clearcoat={0.25}
          />
        </T.Mesh>

        <!-- Brushed Silver Top Faceplate Accent -->
        <T.Mesh position={[0, 0.085, 0]} castShadow>
          <RoundedBoxGeometry args={[4.02, 0.025, 1.96]} radius={0.02} smoothness={3} />
          <T.MeshPhysicalMaterial color="#cbd5e1" roughness={0.22} metalness={0.86} />
        </T.Mesh>

        <!-- Illuminated GEFORCE RTX Style Side RGB Bar -->
        <T.Mesh position={[-0.2, 0.02, -1.08]}>
          <RoundedBoxGeometry args={[2.2, 0.075, 0.03]} radius={0.01} smoothness={3} />
          <T.MeshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.2}
            roughness={0.2}
          />
        </T.Mesh>

        <!-- 16-Pin 12VHPWR PCIe 5.0 Power Header on Top Edge -->
        <T.Mesh position={[1.45, 0.04, -0.98]}>
          <T.BoxGeometry args={[0.48, 0.18, 0.24]} />
          <T.MeshStandardMaterial color="#020617" roughness={0.6} />
        </T.Mesh>

        <!-- 7. Dual Axial Cooling Fans with 9 Curved Blades -->
        {#each [-1.02, 1.02] as fanX}
          <!-- Recessed Dark Fan Shroud Cavity -->
          <T.Mesh position={[fanX, 0.08, 0]}>
            <T.CylinderGeometry args={[0.88, 0.88, 0.04, 40]} />
            <T.MeshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.3} />
          </T.Mesh>

          <!-- Anodized Fan Bezel Ring -->
          <T.Mesh position={[fanX, 0.102, 0]} rotation.x={Math.PI / 2}>
            <T.RingGeometry args={[0.83, 0.9, 48]} />
            <T.MeshStandardMaterial color="#64748b" roughness={0.25} metalness={0.85} />
          </T.Mesh>

          <!-- Spinning Fan Rotor -->
          <T.Group position={[fanX, 0.1, 0]} rotation.y={fanRot}>
            <!-- Central Metallic Motor Hub -->
            <T.Mesh position={[0, 0.015, 0]} castShadow>
              <T.CylinderGeometry args={[0.28, 0.28, 0.06, 32]} />
              <T.MeshPhysicalMaterial color="#1e293b" roughness={0.25} metalness={0.85} />
            </T.Mesh>
            <!-- Concentric Copper/Cyan Hub Medallion -->
            <T.Mesh position={[0, 0.046, 0]}>
              <T.CylinderGeometry args={[0.17, 0.17, 0.008, 32]} />
              <T.MeshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={0.55}
                metalness={0.8}
                roughness={0.2}
              />
            </T.Mesh>
            <!-- 9 Swept Impeller Blades -->
            {#each fanBladeAngles as angle}
              <T.Group rotation.y={(angle * Math.PI) / 180}>
                <T.Mesh position={[0.48, 0.01, 0]} rotation.x={0.38} rotation.z={-0.08}>
                  <RoundedBoxGeometry args={[0.56, 0.018, 0.22]} radius={0.006} smoothness={2} />
                  <T.MeshPhysicalMaterial color="#1e293b" roughness={0.32} metalness={0.45} />
                </T.Mesh>
              </T.Group>
            {/each}
          </T.Group>
        {/each}
      </T.Group>
    </T.Group>
  {/if}
</T.Group>

<!-- ============================================== -->
<!-- FLOATING PILL BUTTON SWITCHER -->
<!-- ============================================== -->
{#if showOverlay}
  <HTML position={[position[0], position[1] + 1.4, position[2]]} center pointerEvents="auto">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="gpu-overlay" onpointerdown={(e) => e.stopPropagation()}>
      <div class="tab-switch">
        <button
          type="button"
          class="tab-btn"
          class:active={activeVariant === 'integrated'}
          onpointerdown={(e) => e.stopPropagation()}
          onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setVariant('integrated');
          }}
        >
          🧩 Integrated (iGPU)
        </button>
        <button
          type="button"
          class="tab-btn"
          class:active={activeVariant === 'dedicated'}
          onpointerdown={(e) => e.stopPropagation()}
          onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setVariant('dedicated');
          }}
        >
          🎮 Dedicated (dGPU)
        </button>
      </div>

      {#if showDetails}
        <div class="detail-box">
          <span class="detail-title">
            {activeVariant === 'integrated'
              ? '🧩 Integrated GPU (SoC Die Architecture)'
              : '🎮 Dedicated GPU (PCIe 4.0 x16 Graphics Card)'}
          </span>
          <span class="detail-desc">
            {activeVariant === 'integrated'
              ? 'Menyatu dalam SoC CPU • Shared DDR5 Memory • Efisiensi Daya Tinggi'
              : '28 Aluminum Fins • 4 Copper Heatpipes • Dual Axial Fans • GDDR6X VRAM'}
          </span>
          <span class="detail-hint">Klik objek 3D untuk menutup detail internal</span>
        </div>
      {/if}
    </div>
  </HTML>
{/if}

<style>
  .gpu-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    user-select: none;
  }
  .tab-switch {
    display: flex;
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(2, 132, 199, 0.5);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    border-radius: 9999px;
    padding: 3px;
    gap: 4px;
    pointer-events: auto;
  }
  .tab-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0 16px;
    min-height: 45px;
    min-width: 45px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s;
    box-sizing: border-box;
  }
  .tab-btn.active {
    background: #0284c7;
    color: #ffffff;
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.6);
  }
  .tab-btn:hover:not(.active) {
    color: #f8fafc;
    background: rgba(255, 255, 255, 0.05);
  }
  .detail-box {
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
  .detail-title {
    font-weight: 700;
    color: #38bdf8;
  }
  .detail-desc {
    font-size: 0.7rem;
    color: #cbd5e1;
  }
  .detail-hint {
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
