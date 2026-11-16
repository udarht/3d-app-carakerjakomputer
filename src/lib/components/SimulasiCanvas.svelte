<script lang="ts">
  import { Canvas } from '@threlte/core';
  import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
  import SimulasiScene from './SimulasiScene.svelte';

  let {
    activeStep = 1,
    inputText = 'Halo Komputer!',
    isCpuProcessing = false,
    isRamProcessing = false,
    isIgpuProcessing = false,
    isSignalKbToCpu = false,
    isSignalCpuToMonitor = false,
    isSignalRamToSsd = false,
    showMonitorText = false,
    ssdSaved = false
  }: {
    activeStep?: number;
    inputText?: string;
    isCpuProcessing?: boolean;
    isRamProcessing?: boolean;
    isIgpuProcessing?: boolean;
    isSignalKbToCpu?: boolean;
    isSignalCpuToMonitor?: boolean;
    isSignalRamToSsd?: boolean;
    showMonitorText?: boolean;
    ssdSaved?: boolean;
  } = $props();
</script>

<div class="simulasi-canvas-wrapper">
  <Canvas shadows={PCFSoftShadowMap} toneMapping={ACESFilmicToneMapping}>
    <SimulasiScene
      {activeStep}
      {inputText}
      {isCpuProcessing}
      {isRamProcessing}
      {isIgpuProcessing}
      {isSignalKbToCpu}
      {isSignalCpuToMonitor}
      {isSignalRamToSsd}
      {showMonitorText}
      {ssdSaved}
    />
  </Canvas>
</div>

<style>
  .simulasi-canvas-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    background: radial-gradient(circle at 50% 30%, #ffffff 0%, #f1f5f9 60%, #cbd5e1 100%);
  }
</style>
