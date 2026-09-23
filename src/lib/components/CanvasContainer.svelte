<script lang="ts">
  import { Canvas } from '@threlte/core';
  import { PCFShadowMap } from 'three';
  import Scene from './Scene.svelte';

  let {
    selectedId = 'monitor',
    ssdVariant = 'm2',
    gpuVariant = 'dedicated',
    onVariantChange,
    onGpuVariantChange
  }: {
    selectedId: string;
    ssdVariant?: 'm2' | 'sata';
    gpuVariant?: 'integrated' | 'dedicated';
    onVariantChange?: (v: 'm2' | 'sata') => void;
    onGpuVariantChange?: (v: 'integrated' | 'dedicated') => void;
  } = $props();
</script>

<div class="canvas-wrapper">
  <Canvas shadows={PCFShadowMap}>
    <Scene {selectedId} {ssdVariant} {gpuVariant} {onVariantChange} {onGpuVariantChange} />
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
