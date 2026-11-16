<script lang="ts">
  import { Canvas } from '@threlte/core';
  import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
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
  <Canvas shadows={PCFSoftShadowMap} toneMapping={ACESFilmicToneMapping}>
    <Scene {selectedId} {ssdVariant} {gpuVariant} {onVariantChange} {onGpuVariantChange} />
  </Canvas>
</div>

<style>
  .canvas-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    background: radial-gradient(circle at 50% 42%, #ffffff 0%, #f1f5f9 58%, #cbd5e1 100%);
  }
</style>
