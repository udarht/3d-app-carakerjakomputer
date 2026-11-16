import * as THREE from 'three';

const textureCache = new Map<string, THREE.CanvasTexture>();

function getCachedTexture(
  key: string,
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
): THREE.CanvasTexture {
  if (typeof document === 'undefined') {
    return new THREE.CanvasTexture(null as unknown as HTMLCanvasElement);
  }
  const existing = textureCache.get(key);
  if (existing) return existing;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  textureCache.set(key, texture);
  return texture;
}

/**
 * Realistic CPU IHS (Integrated Heat Spreader) brushed metal + laser-etched typography
 */
export function getCpuIhsTexture(): THREE.CanvasTexture {
  return getCachedTexture('cpu-ihs-v1', 512, 512, (ctx, w, h) => {
    // Base brushed nickel-silver gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#e2e8f0');
    grad.addColorStop(0.5, '#cbd5e1');
    grad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle horizontal brushed metal lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 3) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Subtle border groove
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.35)';
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, w - 48, h - 48);

    // Laser-etched markings
    ctx.fillStyle = '#334155';
    ctx.textAlign = 'center';
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.fillText('CORE ULTRA PROCESSOR', w / 2, 130);

    ctx.fillStyle = '#1e293b';
    ctx.font = '800 38px system-ui, -apple-system, sans-serif';
    ctx.fillText('i9-14900K', w / 2, 185);

    ctx.fillStyle = '#475569';
    ctx.font = '600 22px monospace';
    ctx.fillText('SRL4V   3.20GHZ   24-CORE', w / 2, 232);
    ctx.fillText('LGA1700 • 36MB SMART CACHE', w / 2, 268);

    // 2D DataMatrix / QR laser-etched patch
    const qrX = 95;
    const qrY = 330;
    const cell = 6;
    ctx.fillStyle = '#1e293b';
    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 12; c++) {
        if (r === 0 || c === 0 || (r + c * 3) % 2 === 0 || (r * c) % 5 === 1) {
          ctx.fillRect(qrX + c * cell, qrY + r * cell, cell - 1, cell - 1);
        }
      }
    }

    // Batch serial right of QR
    ctx.textAlign = 'left';
    ctx.font = '600 20px monospace';
    ctx.fillStyle = '#334155';
    ctx.fillText('BATCH: X412B892', 190, 358);
    ctx.fillText('DIFFUSED IN USA / ASM MY', 190, 388);
  });
}

/**
 * Realistic CPU Underside LGA Gold Contact Pads & Center MLCC Array
 */
export function getCpuLgaPadsTexture(): THREE.CanvasTexture {
  return getCachedTexture('cpu-lga-pads-v1', 512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, 0, w, h);

    // Draw dense grid of gold LGA pads
    const padW = 8;
    const padH = 6;
    const gap = 3;
    for (let y = 20; y < h - 20; y += padH + gap) {
      for (let x = 20; x < w - 20; x += padW + gap) {
        // Leave center cavity for SMD capacitors
        if (x > 165 && x < 347 && y > 155 && y < 357) continue;
        // Socket keying notches
        if (y > 235 && y < 275 && (x < 40 || x > w - 40)) continue;

        ctx.fillStyle = (x + y) % 5 === 0 ? '#fbbf24' : '#f59e0b';
        ctx.fillRect(x, y, padW, padH);
      }
    }

    // Center dark cavity with tiny SMD MLCC capacitors
    ctx.fillStyle = '#022c22';
    ctx.fillRect(175, 165, 162, 182);
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 5; c++) {
        const cx = 190 + c * 28;
        const cy = 182 + r * 27;
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(cx, cy, 18, 12);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(cx + 3, cy, 12, 12);
      }
    }
  });
}

/**
 * Gold Connector Fingers Texture (for RAM DIMM, GPU PCIe, M.2 NVMe)
 */
export function getGoldPinsTexture(count = 48): THREE.CanvasTexture {
  return getCachedTexture(`gold-pins-${count}`, 512, 64, (ctx, w, h) => {
    ctx.fillStyle = '#0f291e';
    ctx.fillRect(0, 0, w, h);

    const step = w / count;
    const pinW = Math.max(2, step * 0.68);
    for (let i = 0; i < count; i++) {
      const x = i * step + (step - pinW) / 2;
      const grad = ctx.createLinearGradient(x, 0, x + pinW, h);
      grad.addColorStop(0, '#fde047');
      grad.addColorStop(0.5, '#f59e0b');
      grad.addColorStop(1, '#d97706');
      ctx.fillStyle = grad;
      ctx.fillRect(x, 4, pinW, h - 8);
    }
  });
}

/**
 * PCB Circuit Board Texture with fine copper traces, vias & silkscreen
 */
export function getPcbCircuitTexture(
  baseColor = '#064e3b',
  traceColor = '#10b981'
): THREE.CanvasTexture {
  return getCachedTexture(`pcb-${baseColor}-${traceColor}`, 512, 512, (ctx, w, h) => {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, w, h);

    // Subtle fiberglass weave grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.moveTo(0, i);
      ctx.lineTo(w, i);
      ctx.stroke();
    }

    // Copper traces under solder mask
    ctx.strokeStyle = traceColor;
    ctx.globalAlpha = 0.28;
    ctx.lineWidth = 2;

    for (let i = 0; i < 36; i++) {
      const y = 16 + i * 13.5;
      ctx.beginPath();
      ctx.moveTo(10, y);
      ctx.lineTo(140 + (i % 5) * 20, y);
      ctx.lineTo(170 + (i % 5) * 20, y + ((i % 2 === 0 ? 1 : -1) * 18));
      ctx.lineTo(w - 10, y + ((i % 2 === 0 ? 1 : -1) * 18));
      ctx.stroke();
    }

    // Gold via pads
    ctx.globalAlpha = 0.65;
    for (let i = 0; i < 60; i++) {
      const vx = ((i * 97) % (w - 40)) + 20;
      const vy = ((i * 53) % (h - 40)) + 20;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(vx, vy, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(vx, vy, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
}

/**
 * IC Chip Package Marking Texture (NAND, DRAM, Controller)
 */
export function getChipMarkingTexture(
  brand: string,
  model: string,
  sub: string
): THREE.CanvasTexture {
  return getCachedTexture(`chip-${brand}-${model}-${sub}`, 256, 256, (ctx, w, h) => {
    // Dark matte epoxy package
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, w, h);

    // Subtle package border
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    // Pin 1 dimple
    ctx.fillStyle = '#52525b';
    ctx.beginPath();
    ctx.arc(28, 28, 8, 0, Math.PI * 2);
    ctx.fill();

    // Laser-marked text
    ctx.fillStyle = '#a1a1aa';
    ctx.textAlign = 'left';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.fillText(brand, 26, 95);

    ctx.fillStyle = '#71717a';
    ctx.font = '600 20px monospace';
    ctx.fillText(model, 26, 135);
    ctx.fillText(sub, 26, 168);

    ctx.fillStyle = '#52525b';
    ctx.font = '16px monospace';
    ctx.fillText('KOR 2644 • HAL-FREE', 26, 215);
  });
}

/**
 * HDD 3.5" Enterprise Spec Sticker Label
 */
export function getHddStickerTexture(): THREE.CanvasTexture {
  return getCachedTexture('hdd-sticker-v1', 512, 340, (ctx, w, h) => {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Top Blue Brand Header
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#1d4ed8');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, 68);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillText('ULTRADRIVE PRO', 24, 44);
    ctx.textAlign = 'right';
    ctx.font = '800 32px system-ui, sans-serif';
    ctx.fillText('4.0 TB', w - 24, 45);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('3.5" ENTERPRISE HDD • 7200 RPM • 256MB CACHE', 24, 105);

    ctx.fillStyle = '#475569';
    ctx.font = '600 16px monospace';
    ctx.fillText('MDL: ST4000NM000A-2HZ100     SATA AF 6.0Gb/s', 24, 138);
    ctx.fillText('S/N: WJG1892X4               P/N: 2HZ100-002', 24, 164);
    ctx.fillText('RATED: +5V 0.75A / +12V 0.90A   DOM: NOV 2026', 24, 190);

    // Barcode stripes
    ctx.fillStyle = '#0f172a';
    let bx = 24;
    for (let i = 0; i < 65; i++) {
      const bw = ((i * 7) % 3) + 2;
      if (i % 2 === 0) {
        ctx.fillRect(bx, 212, bw, 46);
      }
      bx += bw + 2;
    }

    // Bottom warning bar
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, h - 52, w, 52);
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText('⚠ WARRANTY VOID IF SEAL OR COVER IS REMOVED OR DAMAGED', 24, h - 22);
  });
}

/**
 * SSD M.2 & 2.5" SATA Top Label Texture
 */
export function getSsdLabelTexture(variant: 'm2' | 'sata'): THREE.CanvasTexture {
  return getCachedTexture(`ssd-label-${variant}-v1`, 512, 256, (ctx, w, h) => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Diagonal cyber accent stripe
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(w - 180, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, h);
    ctx.lineTo(w - 260, h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, h - 10, w, 10);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 36px system-ui, sans-serif';
    ctx.fillText(variant === 'm2' ? 'NVMe M.2 PRO' : 'EVO SATA III', 28, 76);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(
      variant === 'm2' ? 'PCIe 4.0 x4 • 7450 MB/s' : '2.5" SOLID STATE DRIVE • 6Gb/s',
      28,
      118
    );

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px system-ui, sans-serif';
    ctx.fillText('2TB', 28, 195);

    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'right';
    ctx.font = '800 24px system-ui, sans-serif';
    ctx.fillText('V-NAND', w - 22, 195);
  });
}

/**
 * Monitor Desktop OS Screen Texture (for Exploration Mode & Default Simulasi)
 */
export function getMonitorScreenTexture(outputText?: string): THREE.CanvasTexture {
  const key = outputText ? `monitor-screen-out-${outputText}` : 'monitor-screen-default-v1';
  return getCachedTexture(key, 1024, 576, (ctx, w, h) => {
    // Rich dark desktop wallpaper gradient
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#090d16');
    bg.addColorStop(0.45, '#0f172a');
    bg.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Decorative glowing wallpaper aura circles
    const rad = ctx.createRadialGradient(w * 0.72, h * 0.35, 20, w * 0.72, h * 0.35, 280);
    rad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    rad.addColorStop(0.5, 'rgba(147, 51, 234, 0.18)');
    rad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, w, h);

    // Left Window: System Hardware Telemetry
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(48, 42, 430, 390, 14);
    ctx.fill();
    ctx.stroke();

    // Window header dots
    ['#ef4444', '#eab308', '#22c55e'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(76 + i * 22, 68, 7, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('Hardware Telemetry Monitor', 155, 74);

    // Telemetry bars
    const metrics = [
      { label: 'CPU Core i9 (24C)', val: 0.74, color: '#a855f7', text: '4.8 GHz • 52°C' },
      { label: 'DDR5 RAM (32GB)', val: 0.58, color: '#38bdf8', text: '18.5 GB • 6000 MT/s' },
      { label: 'GPU RTX Core', val: 0.82, color: '#22c55e', text: '98% • 144 FPS' },
      { label: 'NVMe SSD PCIe 4.0', val: 0.45, color: '#f59e0b', text: '6,850 MB/s Read' }
    ];

    metrics.forEach((m, idx) => {
      const y = 122 + idx * 72;
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.fillText(m.label, 72, y);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 15px monospace';
      ctx.fillText(m.text, 452, y);
      ctx.textAlign = 'left';

      // Track
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(72, y + 12, 380, 14, 7);
      ctx.fill();

      // Fill
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.roundRect(72, y + 12, 380 * m.val, 14, 7);
      ctx.fill();
    });

    // Right Window: Interactive Output Terminal
    ctx.fillStyle = 'rgba(9, 13, 22, 0.92)';
    ctx.strokeStyle = outputText ? '#4ade80' : 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = outputText ? 3 : 2;
    ctx.beginPath();
    ctx.roundRect(512, 64, 464, 368, 14);
    ctx.fill();
    ctx.stroke();

    ['#ef4444', '#eab308', '#22c55e'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(540 + i * 22, 90, 7, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('bash — ipos-simulation@komputer:~', 618, 95);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 18px monospace';
    ctx.fillText('$ ./run_ipos_cycle --verify', 536, 148);

    ctx.fillStyle = '#a855f7';
    ctx.fillText('[CPU] Fetching & decoding binary stream...', 536, 184);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('[iGPU] Framebuffer rendered (1920x1080)', 536, 218);

    if (outputText) {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.16)';
      ctx.beginPath();
      ctx.roundRect(534, 248, 420, 110, 10);
      ctx.fill();

      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('> OUTPUT DISPLAYED:', 552, 282);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px system-ui, sans-serif';
      const clipped = outputText.length > 26 ? outputText.slice(0, 26) + '…' : outputText;
      ctx.fillText(`"${clipped}"`, 552, 326);
    } else {
      ctx.fillStyle = '#eab308';
      ctx.fillText('> Ready for keyboard input stream_', 536, 268);
    }

    // Bottom OS Taskbar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(0, h - 54, w, 54);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.moveTo(0, h - 54);
    ctx.lineTo(w, h - 54);
    ctx.stroke();

    // Taskbar centered dock icons
    const iconColors = ['#0284c7', '#9333ea', '#16a34a', '#eab308', '#ec4899'];
    iconColors.forEach((ic, idx) => {
      ctx.fillStyle = ic;
      ctx.beginPath();
      ctx.roundRect(w / 2 - 110 + idx * 46, h - 43, 32, 32, 8);
      ctx.fill();
    });
  });
}

/**
 * Printed Paper Document Texture (for Printer Output)
 */
export function getPrintedDocumentTexture(): THREE.CanvasTexture {
  return getCachedTexture('printed-doc-v1', 512, 640, (ctx, w, h) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Header banner
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(42, 42, w - 84, 56);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.fillText('LAPORAN HASIL PEMROSESAN DATA', 62, 78);

    // Text lines
    ctx.fillStyle = '#334155';
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(42, 128 + i * 24, i === 5 ? 240 : w - 84, 10);
    }

    // Color Bar Chart in middle of page
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(42, 290, w - 84, 180);

    const bars = [
      { h: 110, c: '#0284c7' },
      { h: 145, c: '#9333ea' },
      { h: 95, c: '#eab308' },
      { h: 135, c: '#16a34a' },
      { h: 120, c: '#ec4899' }
    ];
    bars.forEach((b, i) => {
      ctx.fillStyle = b.c;
      ctx.fillRect(78 + i * 74, 445 - b.h, 46, b.h);
    });

    // Footer lines
    ctx.fillStyle = '#64748b';
    ctx.fillRect(42, 500, w - 84, 10);
    ctx.fillRect(42, 524, w - 160, 10);
    ctx.fillRect(42, 548, 180, 10);
  });
}

/**
 * Wood Grain Texture for Studio Bookshelf Speaker Cabinet
 */
export function getWoodCabinetTexture(): THREE.CanvasTexture {
  return getCachedTexture('wood-cabinet-v1', 512, 512, (ctx, w, h) => {
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#5c2808');
    grad.addColorStop(0.5, '#78350f');
    grad.addColorStop(1, '#451a03');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(28, 10, 0, 0.28)';
    ctx.lineWidth = 2;
    for (let x = 0; x < w; x += 6) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(
        x + Math.sin(x * 0.05) * 14,
        h * 0.33,
        x - Math.cos(x * 0.04) * 14,
        h * 0.66,
        x,
        h
      );
      ctx.stroke();
    }
  });
}
