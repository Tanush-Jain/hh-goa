import QRCode from 'qrcode';
import { getBuilderTitle, STACK_OPTIONS } from './titles';

// ─── Vintage Travel Ticket & Neo-Brutalist Palette ──────────────────────────
const HH = {
  forestGreen: '#0F5132',   // Deep Vintage Forest Green Base
  greenDark:   '#0B4628',
  greenLight:  '#16653E',
  gold:        '#F5A623',   // Warm Ticket Gold
  goldLight:   '#FEE101',
  coral:       '#FF5E4D',   // Vibrant Ticket Coral Accent
  pink:        '#E8357A',
  cream:       '#F5F0E0',   // Warm Vintage Off-White
  white:       '#FFFFFF',
  black:       '#0A0A0A',
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
        dark: HH.forestGreen,
        light: HH.cream
      },
      width: 220
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

/** Helper: Rounded rectangle path */
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

/**
 * Draws the Vintage Boarding Pass canvas export (1080x1920, 9:16 aspect ratio)
 * with integrated Neo-Brutalist elements & offset shadows.
 */
export async function drawCard(canvas, {
  image,
  name = '',
  stack = '',
  funVibe = '',
  threeWords = '',
  cardMode = 'pass',
  builderId = '#001',
  qrUrl = window.location.href
}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = 1080;
  const H = 1920;
  canvas.width = W;
  canvas.height = H;
  ctx.clearRect(0, 0, W, H);

  // Pre-load QR Code Image
  const qrImg = await getQrImage(qrUrl);

  // Draw 1080x1920 Vintage Boarding Pass with Neo-Brutalist details
  await drawVintageBoardingPass(ctx, W, H, image, name, stack, funVibe, threeWords, builderId, qrImg);
}

// ─────────────────────────────────────────────────────────────────
// VINTAGE BOARDING PASS (1080x1920 Canvas Generation with Neo-Brutalism)
// ─────────────────────────────────────────────────────────────────
async function drawVintageBoardingPass(ctx, W, H, image, name, stack, funVibe, threeWords, builderId, qrImg) {

  // 1. BASE FILL & ORNATE NEO-BRUTALIST BORDERS
  ctx.fillStyle = HH.forestGreen;
  ctx.fillRect(0, 0, W, H);

  // Background subtle cross-hatch texture
  ctx.save();
  ctx.strokeStyle = 'rgba(245, 166, 35, 0.05)';
  ctx.lineWidth = 1;
  for (let i = -H; i < W + H; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + H, H);
    ctx.stroke();
  }
  ctx.restore();

  // Outer Double Borders:
  // Outer Stroke: 16px from edge, 4px wide, Coral (#FF5E4D)
  ctx.save();
  ctx.strokeStyle = HH.coral;
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, W - 32, H - 32);

  // Inner Stroke: 32px from edge, 4px wide, Gold (#F5A623), DASHED line
  ctx.strokeStyle = HH.gold;
  ctx.lineWidth = 4;
  ctx.setLineDash([15, 15]);
  ctx.strokeRect(32, 32, W - 64, H - 64);
  ctx.setLineDash([]); // Reset line dash
  ctx.restore();

  // Ornate Side Ribbon Border Pattern (Left & Right margins)
  drawBorderRibbons(ctx, W, H);

  // 2. TOP SECTION (Header & Line-Art & Photo)
  // Headline Text (Centered X: 540)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  ctx.fillStyle = HH.white;
  ctx.font = '700 70px "Space Grotesk", sans-serif';
  ctx.fillText('HACKER HOUSE', 540, 110);

  ctx.font = '700 90px "Space Grotesk", sans-serif';
  ctx.fillText('GOA 2026', 540, 190);
  ctx.restore();

  // Line-Art Background behind Photo (Center X: 540, Y: 500)
  drawPhotoBackgroundLineArt(ctx, 540, 500);

  // PHOTO: Center at X: 540, Y: 500, Radius: 200px
  const photoX = 540;
  const photoY = 500;
  const photoR = 200;

  if (image) {
    drawCirclePhoto(ctx, image, photoX, photoY, photoR);
  } else {
    ctx.save();
    ctx.fillStyle = HH.greenDark;
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = HH.gold;
    ctx.font = 'bold 120px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌴', photoX, photoY);
    ctx.restore();
  }

  // Photo Rings: 10px Gold border + outer 2px Coral ring spaced 10px apart
  ctx.save();
  ctx.strokeStyle = HH.gold;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = HH.coral;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoR + 14, 0, Math.PI * 2);
  ctx.stroke();

  // Neo-Brutalist Black Ring Accent
  ctx.strokeStyle = HH.black;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoR + 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();


  // 3. MIDDLE SECTION (Ticket Panels: DEPARTURE & ARRIVAL with Neo-Brutalist Offset Shadows)

  // ── DEPARTURE PANEL ──
  const depX = 80;
  const depY = 780;
  const depW = 920;
  const depH = 360;

  // Hard Neo-Brutalist Black Offset Shadow under Departure Panel
  ctx.save();
  ctx.fillStyle = HH.black;
  roundRect(ctx, depX + 10, depY + 10, depW, depH, 20);
  ctx.fill();

  // Departure Box Fill & Gold Stroke with Black Edge Accent
  ctx.fillStyle = 'rgba(11, 60, 36, 0.95)';
  roundRect(ctx, depX, depY, depW, depH, 20);
  ctx.fill();
  ctx.strokeStyle = HH.gold;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.strokeStyle = HH.black;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Solid Gold Header Tab inside top (Neo-Brutalist Tab)
  roundRect(ctx, depX + 34, depY + 4, 252, 48, 10);
  ctx.fillStyle = HH.black;
  ctx.fill();
  roundRect(ctx, depX + 30, depY - 2, 252, 48, 10);
  ctx.fillStyle = HH.gold;
  ctx.fill();
  ctx.strokeStyle = HH.black;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = HH.black;
  ctx.font = '700 24px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DEPARTURE', depX + 156, depY + 23);

  // Departure Divider Line
  ctx.strokeStyle = 'rgba(245, 166, 35, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(depX + 30, depY + 68);
  ctx.lineTo(depX + depW - 30, depY + 68);
  ctx.stroke();

  // Departure Data Grid
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Row 1: NAME
  ctx.fillStyle = 'rgba(245, 166, 35, 0.85)';
  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillText('PASSENGER NAME', depX + 40, depY + 90);
  ctx.fillStyle = HH.white;
  ctx.font = '700 36px "Space Grotesk", sans-serif';
  const nameDisp = (name || 'BUILDER PASSENGER').toUpperCase();
  ctx.fillText(nameDisp, depX + 40, depY + 115, 420);

  // Row 1 (Right): BUILDER ID
  ctx.fillStyle = 'rgba(245, 166, 35, 0.85)';
  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillText('BUILDER ID', depX + 540, depY + 90);
  ctx.fillStyle = HH.coral;
  ctx.font = '800 38px "Space Grotesk", sans-serif';
  ctx.fillText(builderId, depX + 540, depY + 115);

  // Row 2: TITLE & ROLE
  ctx.fillStyle = 'rgba(245, 166, 35, 0.85)';
  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillText('ROLE / TITLE', depX + 40, depY + 180);
  const titleText = getBuilderTitle(stack).toUpperCase();
  ctx.fillStyle = HH.gold;
  ctx.font = '700 30px "Space Grotesk", sans-serif';
  ctx.fillText(`⚡ ${titleText}`, depX + 40, depY + 205, 430);

  // Row 2 (Right): STACK / TECH
  ctx.fillStyle = 'rgba(245, 166, 35, 0.85)';
  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillText('STACK', depX + 540, depY + 180);
  const stackLabel = (STACK_OPTIONS.find(o => o.value === stack)?.label || stack || 'FULLSTACK').toUpperCase();
  ctx.fillStyle = HH.white;
  ctx.font = '600 26px "JetBrains Mono", monospace';
  ctx.fillText(stackLabel, depX + 540, depY + 208, 330);

  // Row 3: 3 WORDS DESCRIPTION
  ctx.fillStyle = 'rgba(245, 166, 35, 0.85)';
  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillText('3 WORDS DESCRIPTION', depX + 40, depY + 270);
  ctx.fillStyle = HH.goldLight;
  ctx.font = 'italic 700 30px "Space Grotesk", sans-serif';
  const wordsDisp = threeWords ? `"${threeWords}"` : '"FAST, CURIOUS, BASED"';
  ctx.fillText(wordsDisp, depX + 40, depY + 295, 820);
  ctx.restore();


  // ── ARRIVAL PANEL ──
  const arrX = 80;
  const arrY = 1190;
  const arrW = 920;
  const arrH = 250;

  // Hard Neo-Brutalist Black Offset Shadow under Arrival Panel
  ctx.save();
  ctx.fillStyle = HH.black;
  roundRect(ctx, arrX + 10, arrY + 10, arrW, arrH, 20);
  ctx.fill();

  ctx.fillStyle = 'rgba(11, 60, 36, 0.95)';
  roundRect(ctx, arrX, arrY, arrW, arrH, 20);
  ctx.fill();
  ctx.strokeStyle = HH.coral;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.strokeStyle = HH.black;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Solid Coral Header Tab
  roundRect(ctx, arrX + 34, arrY + 4, 212, 48, 10);
  ctx.fillStyle = HH.black;
  ctx.fill();
  roundRect(ctx, arrX + 30, arrY - 2, 212, 48, 10);
  ctx.fillStyle = HH.coral;
  ctx.fill();
  ctx.strokeStyle = HH.black;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = HH.black;
  ctx.font = '700 24px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ARRIVAL', arrX + 136, arrY + 23);

  // Arrival Divider
  ctx.strokeStyle = 'rgba(255, 94, 77, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(arrX + 30, arrY + 68);
  ctx.lineTo(arrX + arrW - 30, arrY + 68);
  ctx.stroke();

  // Arrival Data Grid
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Location
  ctx.fillStyle = 'rgba(255, 94, 77, 0.85)';
  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillText('DESTINATION', arrX + 40, arrY + 90);
  ctx.fillStyle = HH.white;
  ctx.font = '700 32px "Space Grotesk", sans-serif';
  ctx.fillText('GOA, INDIA 🌴', arrX + 40, arrY + 115);

  // Event Dates
  ctx.fillStyle = 'rgba(255, 94, 77, 0.85)';
  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillText('EVENT DATES', arrX + 440, arrY + 90);
  ctx.fillStyle = HH.white;
  ctx.font = '700 32px "Space Grotesk", sans-serif';
  ctx.fillText('28 – 31 OCT 2026', arrX + 440, arrY + 115);

  // Goa Vibe / Status
  ctx.fillStyle = 'rgba(255, 94, 77, 0.85)';
  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillText('GOA VIBE & STATUS', arrX + 40, arrY + 175);
  ctx.fillStyle = HH.coral;
  ctx.font = '600 26px "JetBrains Mono", monospace';
  const vibeDisp = funVibe ? `✦ ${funVibe}` : '✦ SHIPPING ON 3HRS SLEEP ☕';
  ctx.fillText(vibeDisp, arrX + 40, arrY + 198, 830);
  ctx.restore();


  // 4. BOTTOM SECTION (QR & Passport Stamps & Ocean Waves & Footer)

  // QR CODE: Centered at X: 540, Y: 1600, Size: 220px
  const qrSize = 220;
  const qrX = 540 - qrSize / 2;
  const qrY = 1490;

  if (qrImg) {
    ctx.save();
    // Neo-Brutalist Hard Black Offset Shadow under QR container
    ctx.fillStyle = HH.black;
    roundRect(ctx, qrX - 4, qrY + 4, qrSize + 20, qrSize + 20, 18);
    ctx.fill();

    ctx.fillStyle = HH.cream;
    roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 18);
    ctx.fill();
    ctx.strokeStyle = HH.black;
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
    ctx.restore();
  }

  // PASSPORT STAMPS (Flanking QR Code)
  // Left Stamp: Tilted Circular Compass Stamp (Gold + Black outline)
  drawLeftPassportStamp(ctx, 230, 1600);

  // Right Stamp: Tilted Rectangular Postal Stamp with cancellation lines (Coral + Black outline)
  drawRightPassportStamp(ctx, 850, 1600);

  // BOTTOM EDGE OCEAN WAVES (Y: 1780 to 1920)
  drawBottomEdgeWaves(ctx, W, H);

  // FOOTER QUOTE TEXT: Centered at Y: 1850
  ctx.save();
  ctx.fillStyle = HH.white;
  ctx.font = 'italic 400 22px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('"Building something real. - GOA, INDIA"', 540, 1850);
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────
// HELPER 1: Ornate Border Ribbon Patterns
// ─────────────────────────────────────────────────────────────────
function drawBorderRibbons(ctx, W, H) {
  ctx.save();
  ctx.strokeStyle = 'rgba(245, 166, 35, 0.45)';
  ctx.lineWidth = 2;

  // Left Margin Ribbon Pattern
  for (let y = 50; y < H - 50; y += 24) {
    ctx.beginPath();
    ctx.moveTo(32, y);
    ctx.lineTo(44, y + 12);
    ctx.stroke();
  }
  // Right Margin Ribbon Pattern
  for (let y = 50; y < H - 50; y += 24) {
    ctx.beginPath();
    ctx.moveTo(W - 32, y);
    ctx.lineTo(W - 44, y + 12);
    ctx.stroke();
  }
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────
// HELPER 2: Photo Background Line-Art (Rays, Fronds, Airplane, Waves)
// ─────────────────────────────────────────────────────────────────
function drawPhotoBackgroundLineArt(ctx, cx, cy) {
  ctx.save();

  // Radiating Sun Rays from Photo Center
  ctx.strokeStyle = 'rgba(245, 166, 35, 0.2)';
  ctx.lineWidth = 3;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 220, cy + Math.sin(a) * 220);
    ctx.lineTo(cx + Math.cos(a) * 440, cy + Math.sin(a) * 440);
    ctx.stroke();
  }

  // Compass Line-Art (Top-Left of photo)
  ctx.strokeStyle = 'rgba(245, 166, 35, 0.5)';
  ctx.lineWidth = 3;
  const compX = 200;
  const compY = 360;
  ctx.beginPath(); ctx.arc(compX, compY, 45, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(compX, compY, 35, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(compX, compY - 50); ctx.lineTo(compX, compY + 50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(compX - 50, compY); ctx.lineTo(compX + 50, compY); ctx.stroke();

  // Airplane Line-Art & Flight Path (Top-Right of photo)
  ctx.strokeStyle = 'rgba(255, 94, 77, 0.65)';
  ctx.lineWidth = 3;
  const planeX = 880;
  const planeY = 360;

  // Dashed Flight Arc
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.arc(planeX - 100, planeY + 80, 120, -Math.PI / 4, Math.PI / 6);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Airplane Vector
  ctx.save();
  ctx.translate(planeX, planeY);
  ctx.rotate(-Math.PI / 6);
  ctx.fillStyle = HH.coral;
  ctx.strokeStyle = HH.black;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(8, -5);
  ctx.lineTo(26, 6);
  ctx.lineTo(8, 6);
  ctx.lineTo(4, 22);
  ctx.lineTo(-4, 22);
  ctx.lineTo(-8, 6);
  ctx.lineTo(-26, 6);
  ctx.lineTo(-8, -5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Palm Fronds & Waves line art flanking photo bottom
  ctx.strokeStyle = 'rgba(245, 166, 35, 0.45)';
  ctx.lineWidth = 3;

  // Left waves
  ctx.beginPath();
  ctx.arc(180, 680, 30, Math.PI, Math.PI * 2);
  ctx.arc(240, 680, 30, Math.PI, Math.PI * 2);
  ctx.stroke();

  // Right waves
  ctx.beginPath();
  ctx.arc(840, 680, 30, Math.PI, Math.PI * 2);
  ctx.arc(900, 680, 30, Math.PI, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────
// HELPER 3: Left Passport Stamp (Circular Compass, Gold + Black accent)
// ─────────────────────────────────────────────────────────────────
function drawLeftPassportStamp(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.15); // Slight tilt

  ctx.strokeStyle = HH.gold;
  ctx.lineWidth = 3.5;

  // Double circle stamp outline
  ctx.beginPath(); ctx.arc(0, 0, 72, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 64, 0, Math.PI * 2); ctx.stroke();

  // Inner star/compass
  ctx.beginPath();
  ctx.moveTo(0, -50); ctx.lineTo(10, -10); ctx.lineTo(50, 0); ctx.lineTo(10, 10);
  ctx.lineTo(0, 50); ctx.lineTo(-10, 10); ctx.lineTo(-50, 0); ctx.lineTo(-10, -10);
  ctx.closePath();
  ctx.stroke();

  // Stamp text
  ctx.fillStyle = HH.gold;
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE', 0, -25);
  ctx.fillText('★ GOA ★', 0, 32);

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────
// HELPER 4: Right Passport Stamp (Rectangular Postal & Waves, Coral + Black outline)
// ─────────────────────────────────────────────────────────────────
function drawRightPassportStamp(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(0.12); // Slight tilt

  ctx.strokeStyle = HH.coral;
  ctx.lineWidth = 4;

  // Rectangular stamp outline with rounded corners
  roundRect(ctx, -75, -55, 150, 110, 10);
  ctx.stroke();

  // Inner dashed border
  ctx.setLineDash([6, 6]);
  roundRect(ctx, -68, -48, 136, 96, 8);
  ctx.stroke();
  ctx.setLineDash([]);

  // Stamp Content
  ctx.fillStyle = HH.coral;
  ctx.font = '700 15px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GOA 2026', 0, -22);

  ctx.font = '700 12px "JetBrains Mono", monospace';
  ctx.fillText('PASSPORT', 0, 0);
  ctx.fillText('★ APPROVED ★', 0, 22);

  // Wavy cancellation lines extending to the right
  ctx.strokeStyle = 'rgba(255, 94, 77, 0.75)';
  ctx.lineWidth = 3;
  for (let offset = -30; offset <= 30; offset += 20) {
    ctx.beginPath();
    ctx.moveTo(80, offset);
    ctx.quadraticCurveTo(105, offset - 10, 130, offset);
    ctx.quadraticCurveTo(155, offset + 10, 180, offset);
    ctx.stroke();
  }

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────
// HELPER 5: Bottom Edge Overlapping Ocean Waves with Neo-Brutalist Foam Dots
// ─────────────────────────────────────────────────────────────────
function drawBottomEdgeWaves(ctx, W, H) {
  ctx.save();

  // Wave 1: Deep Coral (#FF5E4D)
  ctx.fillStyle = 'rgba(255, 94, 77, 0.9)';
  ctx.strokeStyle = HH.black;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, H - 90);
  for (let x = 0; x <= W; x += 180) {
    ctx.quadraticCurveTo(x + 45, H - 140, x + 90, H - 90);
    ctx.quadraticCurveTo(x + 135, H - 40, x + 180, H - 90);
  }
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Wave 2: Gold Accent (#F5A623)
  ctx.fillStyle = 'rgba(245, 166, 35, 0.85)';
  ctx.strokeStyle = HH.black;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, H - 60);
  for (let x = 0; x <= W; x += 200) {
    ctx.quadraticCurveTo(x + 50, H - 105, x + 100, H - 60);
    ctx.quadraticCurveTo(x + 150, H - 15, x + 200, H - 60);
  }
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Neo-Brutalist Foam Dots along sea surface
  for (let x = 40; x <= W - 40; x += 100) {
    ctx.fillStyle = HH.goldLight;
    ctx.beginPath();
    ctx.arc(x, H - 75, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = HH.white;
    ctx.beginPath();
    ctx.arc(x + 16, H - 68, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
