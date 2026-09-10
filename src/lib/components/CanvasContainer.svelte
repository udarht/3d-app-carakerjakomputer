<script lang="ts">
  import { Canvas } from '@threlte/core';
  import Scene from './Scene.svelte';

  let {
    selectedId = 'monitor',
    ssdVariant = 'm2',
    onVariantChange
  }: {
    selectedId: string;
    ssdVariant?: 'm2' | 'sata';
    onVariantChange?: (v: 'm2' | 'sata') => void;
  } = $props();
</script>

<div class="canvas-wrapper">
  <Canvas>
    <Scene {selectedId} {ssdVariant} {onVariantChange} />
  </Canvas>
</div>

<style>
  .canvas-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    background: radial-gradient(circle at center, #ffffff 0%, #f1f5f9 60%, #e2e8f0 100%);
  }
</style>
