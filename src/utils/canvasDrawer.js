import QRCode from 'qrcode';
import { getBuilderTitle, STACK_OPTIONS } from './titles';

// ─── HH Goa Official Colour Palette ─────────────────────────────────────────
const HH = {
  green:     '#0b6839',   // HH Goa official green
  greenDark: '#084d2a',   // darker shade for gradients/shadows
  greenMid:  '#0d7d44',   // mid green for layering
  yellow:    '#fee101',   // HH Goa official yellow
  yellowAlt: '#ffe94d',   // lighter yellow highlight
  pink:      '#E8357A',   // hot pink magenta (kept for accents)
  black:     '#0F0F0F',   // near-black ticker bar
  cream:     '#F5F0E0',   // warm off-white text
  white:     '#FFFFFF',
};

// Memory cache for QR code images
const qrCache = new Map();

/**
 * Pre-renders QR Code as a data URL image without CORS taint.
 */
export async function getQrImage(text) {
  if (qrCache.has(text)) {
    return qrCache.get(text);
  }
  try {
    const dataUrl = await QRCode.toDataURL(text || 'https://hhgoa.com', {
      margin: 1,
      color: {
        dark: HH.green,
        light: HH.cream
      },
      width: 160
    });

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        qrCache.set(text, img);
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    });
  } catch (err) {
    console.error('QR code generation error:', err);
    return null;
  }
}

/** Helper: Rounded rectangle path (cross-browser) */
function roundRect(ctx, x, y, w, h, r) {
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

/** Helper: Fit-and-crop image into a circle */
function drawCirclePhoto(ctx, image, cx, cy, r) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  const iw = image.naturalWidth || image.width;
  const ih = image.naturalHeight || image.height;
  const minDim = Math.min(iw, ih);
  const sx = (iw - minDim) / 2;
  const sy = (ih - minDim) / 2;
  ctx.drawImage(image, sx, sy, minDim, minDim, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

/** Helper: Auto-resize text to fit within maxWidth */
function fitText(ctx, text, baseFontSize, fontSpec, maxWidth) {
  let size = baseFontSize;
  ctx.font = fontSpec(size);
  while (ctx.measureText(text).width > maxWidth && size > 18) {
    size -= 2;
    ctx.font = fontSpec(size);
  }
  return size;
}

/**
 * Draws either Format A (Event Card Pass) or Format B (X Profile Picture Frame) on canvas.
 * THEME: HH Goa 2026 (hhgoa.com) — Forest Green + Sun Yellow + Hot Pink
 */
export async function drawCard(canvas, {
  image,
  name,
  stack,
  funVibe = 'Shipping on 3hrs sleep ☕',
  cardMode = 'pass',
  builderId = '#001',
  qrUrl = window.location.href
}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = 1080;
  const H = 1080;
  canvas.width = W;
  canvas.height = H;
  ctx.clearRect(0, 0, W, H);

  // Pre-load QR Code Image
  const qrImg = await getQrImage(qrUrl);

  if (cardMode === 'frame') {
    await drawPFPFrame(ctx, W, H, image, name, stack, qrImg);
  } else {
    await drawBuilderPass(ctx, W, H, image, name, stack, funVibe, builderId, qrImg);
  }
}

// ─────────────────────────────────────────────────────────────────
// FORMAT B: PFP FRAME — HH Goa tropical theme
// ─────────────────────────────────────────────────────────────────
async function drawPFPFrame(ctx, W, H, image, name, stack, qrImg) {
  // BG: deep Goa green
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, HH.greenDark);
  bgGrad.addColorStop(1, HH.green);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Palm leaf corner decorations (drawn simple arcs)
  drawPalmCorners(ctx, W, H);

  // Photo: center-crop square, full bleed, clipped to inset
  const inset = 60;
  if (image) {
    ctx.save();
    roundRect(ctx, inset, inset, W - inset * 2, H - inset * 2, 24);
    ctx.clip();
    const iw = image.naturalWidth || image.width;
    const ih = image.naturalHeight || image.height;
    const minDim = Math.min(iw, ih);
    const sx = (iw - minDim) / 2;
    const sy = (ih - minDim) / 2;
    ctx.drawImage(image, sx, sy, minDim, minDim, inset, inset, W - inset * 2, H - inset * 2);
    ctx.restore();
  } else {
    ctx.fillStyle = HH.greenMid;
    ctx.fillRect(inset, inset, W - inset * 2, H - inset * 2);
    ctx.fillStyle = HH.yellow;
    ctx.font = 'bold 160px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌴', W / 2, H / 2);
  }

  // Bottom gradient fade (for text legibility)
  const fade = ctx.createLinearGradient(0, H * 0.55, 0, H);
  fade.addColorStop(0, 'rgba(30, 66, 32, 0)');
  fade.addColorStop(1, 'rgba(30, 66, 32, 0.95)');
  ctx.fillStyle = fade;
  ctx.fillRect(0, H * 0.55, W, H * 0.45);

  // Top badge pill: "HACKER HOUSE GOA 2026"
  ctx.save();
  ctx.fillStyle = HH.yellow;
  roundRect(ctx, W / 2 - 240, 68, 480, 64, 32);
  ctx.fill();
  ctx.fillStyle = HH.greenDark;
  ctx.font = 'bold 26px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HACKER HOUSE GOA  ·  28–31 OCT 2026', W / 2, 100);
  ctx.restore();

  // Name
  ctx.save();
  ctx.fillStyle = HH.cream;
  const dispName = (name || 'BUILDER').toUpperCase();
  fitText(ctx, dispName, 54, (s) => `700 ${s}px "Space Grotesk", sans-serif`, W - 120);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(dispName, W / 2, H - 130);
  ctx.restore();

  // Hashtag + stack pill
  ctx.save();
  ctx.fillStyle = HH.pink;
  ctx.font = '600 28px "Space Grotesk", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('#FrameInGoa', W / 2, H - 72);
  ctx.restore();

  // Outer border frame: yellow + pink double line
  ctx.save();
  ctx.strokeStyle = HH.yellow;
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, W - 14, H - 14);
  ctx.strokeStyle = HH.pink;
  ctx.lineWidth = 4;
  ctx.strokeRect(22, 22, W - 44, H - 44);
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────
// FORMAT A: BUILDER PASS — HH Goa tropical theme (14 layers)
// ─────────────────────────────────────────────────────────────────
async function drawBuilderPass(ctx, W, H, image, name, stack, funVibe, builderId, qrImg) {

  // Layer 0: Background — deep Goa green
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, HH.greenDark);
  bgGrad.addColorStop(0.6, HH.green);
  bgGrad.addColorStop(1, HH.greenMid);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Layer 1: Subtle dot-grid texture (Goa style)
  ctx.save();
  ctx.fillStyle = 'rgba(232, 200, 74, 0.06)';
  for (let x = 20; x < W; x += 30) {
    for (let y = 20; y < H; y += 30) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // Layer 2: Photo circle (left side, upper) — clipped circle
  const photoX = 210;
  const photoY = 270;
  const photoR = 150;

  if (image) {
    // Outer glow ring
    ctx.save();
    ctx.shadowColor = HH.yellow;
    ctx.shadowBlur = 24;
    ctx.strokeStyle = HH.yellow;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR + 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    drawCirclePhoto(ctx, image, photoX, photoY, photoR);
  } else {
    ctx.save();
    ctx.fillStyle = HH.greenMid;
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = HH.yellow;
    ctx.font = 'bold 100px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌴', photoX, photoY);
    ctx.restore();
  }

  // Gold ring around photo
  ctx.save();
  ctx.strokeStyle = HH.yellow;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Layer 3: Big Heading — "HACKER HOUSE" right side
  ctx.save();
  ctx.fillStyle = HH.yellow;
  ctx.font = '800 52px "Space Grotesk", sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('HACKER HOUSE', W - 60, 70);
  ctx.fillStyle = HH.pink;
  ctx.font = '800 72px "Space Grotesk", sans-serif';
  ctx.fillText('GOA 2026', W - 60, 126);
  ctx.restore();

  // Layer 4: Black ticker bar (like HH Goa site)
  ctx.fillStyle = HH.black;
  ctx.fillRect(0, 450, W, 60);

  // Ticker text in yellow
  ctx.save();
  ctx.fillStyle = HH.yellow;
  ctx.font = '700 22px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const tickerText = '⚡ BUILDER CREDENTIAL  ·  28–31 OCT 2026  ·  GOA, INDIA  ·  ⚡ BUILDER CREDENTIAL  ·  28–31 OCT 2026  ·  GOA, INDIA  ·';
  ctx.fillText(tickerText, 30, 480);
  ctx.restore();

  // Layer 5: Divider below ticker
  ctx.fillStyle = HH.pink;
  ctx.fillRect(0, 510, W, 5);

  // Layer 6: Bottom info panel gradient background
  const infoGrad = ctx.createLinearGradient(0, 515, 0, H);
  infoGrad.addColorStop(0, 'rgba(30, 66, 32, 0.6)');
  infoGrad.addColorStop(1, 'rgba(15, 15, 15, 0.92)');
  ctx.fillStyle = infoGrad;
  ctx.fillRect(0, 515, W, H - 515);

  // Layer 7: Name (large, left-aligned)
  ctx.save();
  ctx.fillStyle = HH.cream;
  const displayName = (name || 'YOUR NAME').toUpperCase();
  fitText(ctx, displayName, 72, (s) => `800 ${s}px "Space Grotesk", sans-serif`, W - 120);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(displayName, 60, 540);
  ctx.restore();

  // Layer 8: Pink accent underline under name
  const nameMetrics = (() => {
    ctx.save();
    fitText(ctx, (name || 'YOUR NAME').toUpperCase(), 72, (s) => `800 ${s}px "Space Grotesk", sans-serif`, W - 120);
    const m = ctx.measureText((name || 'YOUR NAME').toUpperCase());
    ctx.restore();
    return m;
  })();
  ctx.fillStyle = HH.pink;
  ctx.fillRect(60, 628, Math.min(nameMetrics.width + 4, W - 120), 5);

  // Layer 9: Builder title / role badge
  ctx.save();
  const titleText = getBuilderTitle(stack).toUpperCase();
  // Pill background
  ctx.fillStyle = HH.yellow;
  roundRect(ctx, 60, 650, 420, 50, 25);
  ctx.fill();
  ctx.fillStyle = HH.greenDark;
  ctx.font = '700 22px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const truncTitle = titleText.length > 24 ? titleText.slice(0, 24) + '…' : titleText;
  ctx.fillText(`⚡ ${truncTitle}`, 80, 676);
  ctx.restore();

  // Layer 10: Stack label
  ctx.save();
  const stackLabel = STACK_OPTIONS.find(o => o.value === stack)?.label || 'Fullstack';
  ctx.fillStyle = 'rgba(245, 240, 224, 0.75)';
  ctx.font = '400 24px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(stackLabel, 60, 718);
  ctx.restore();

  // Layer 11: Fun vibe line (mint/pink)
  ctx.save();
  ctx.fillStyle = HH.pink;
  ctx.font = '600 22px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`✦ ${funVibe}`, 60, 758);
  ctx.restore();

  // Layer 12: QR Code (bottom-left)
  if (qrImg) {
    ctx.save();
    ctx.fillStyle = HH.cream;
    roundRect(ctx, 60, 840, 160, 160, 12);
    ctx.fill();
    ctx.drawImage(qrImg, 68, 848, 144, 144);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'rgba(245, 240, 224, 0.5)';
    ctx.font = '400 16px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('SCAN TO VERIFY', 240, 848);
    ctx.restore();
  }

  // Layer 13: Date + Location (right column, bottom)
  ctx.save();
  ctx.fillStyle = 'rgba(245, 240, 224, 0.65)';
  ctx.font = '400 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText('GOA, INDIA', W - 60, H - 100);
  ctx.fillText('28 – 31 OCT 2026', W - 60, H - 70);

  // Builder ID (coral/pink)
  ctx.fillStyle = HH.pink;
  ctx.font = '800 52px "Space Grotesk", sans-serif';
  ctx.fillText(builderId, W - 60, H - 20);
  ctx.restore();

  // Layer 14: Card outer border (yellow double)
  ctx.save();
  ctx.strokeStyle = HH.yellow;
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, W - 12, H - 12);
  ctx.strokeStyle = 'rgba(232, 200, 74, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, W - 40, H - 40);
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────
// HELPER: Draw simple palm corner decorations
// ─────────────────────────────────────────────────────────────────
function drawPalmCorners(ctx, W, H) {
  ctx.save();
  ctx.globalAlpha = 0.18;
  // Top-left palm (simple rotated triangle fans)
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI / 4) + (i * Math.PI / 16);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 18 - i * 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * 140, Math.sin(angle) * 140);
    ctx.stroke();
  }
  // Bottom-right palm
  ctx.save();
  ctx.translate(W, H);
  for (let i = 0; i < 5; i++) {
    const angle = Math.PI + (Math.PI / 4) + (i * Math.PI / 16);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 18 - i * 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * 140, Math.sin(angle) * 140);
    ctx.stroke();
  }
  ctx.restore();
  ctx.restore();
}
