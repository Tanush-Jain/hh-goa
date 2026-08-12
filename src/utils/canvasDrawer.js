import QRCode from 'qrcode';
import { getBuilderTitle, STACK_OPTIONS } from './titles';

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
    const dataUrl = await QRCode.toDataURL(text || 'https://hhgoa2026.com', {
      margin: 1,
      color: {
        dark: '#F5A623',
        light: '#141824'
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

/**
 * Draws either Format A (Event Card Pass) or Format B (X Profile Picture Frame) synchronously/async on canvas.
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

  const width = 1080;
  const height = 1080;
  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);

  // Pre-load QR Code Image
  const qrImg = await getQrImage(qrUrl);

  if (cardMode === 'frame') {
    // ==========================================
    // FORMAT B: X PROFILE PICTURE FRAME OVERLAY
    // ==========================================
    
    // Background (#0D0F1A)
    ctx.fillStyle = '#0D0F1A';
    ctx.fillRect(0, 0, width, height);

    // Photo Center Crop (Front and Center)
    if (image) {
      ctx.save();
      const imgWidth = image.naturalWidth || image.width;
      const imgHeight = image.naturalHeight || image.height;
      const minDim = Math.min(imgWidth, imgHeight);
      const sx = (imgWidth - minDim) / 2;
      const sy = (imgHeight - minDim) / 2;

      ctx.drawImage(image, sx, sy, minDim, minDim, 40, 40, width - 80, height - 80);
      ctx.restore();
    } else {
      ctx.fillStyle = '#141824';
      ctx.fillRect(40, 40, width - 80, height - 80);
      ctx.fillStyle = '#F5A623';
      ctx.font = 'bold 120px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🌴', width / 2, height / 2);
    }

    // Shading Gradient Overlay
    const overlayGrad = ctx.createLinearGradient(0, 600, 0, 1080);
    overlayGrad.addColorStop(0, 'rgba(13, 15, 26, 0)');
    overlayGrad.addColorStop(1, 'rgba(13, 15, 26, 0.95)');
    ctx.fillStyle = overlayGrad;
    ctx.fillRect(0, 500, width, 580);

    // Accent Bar
    ctx.fillStyle = '#F5A623';
    ctx.fillRect(40, height - 120, width - 80, 8);

    // Top Badge
    ctx.save();
    ctx.fillStyle = '#141824';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 12;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(width / 2 - 160, 60, 320, 56, 28);
      ctx.fill();
    }
    ctx.fillStyle = '#F5A623';
    ctx.font = '700 24px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HH GOA 2026 🌴', width / 2, 88);
    ctx.restore();

    // Bottom Profile Badge (#FrameInGoa + Name)
    ctx.save();
    ctx.fillStyle = '#E8EAF0';
    ctx.font = '700 48px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const displayName = (name || 'BUILDER').toUpperCase();
    ctx.fillText(displayName, width / 2, height - 145);

    ctx.fillStyle = '#00E5A0';
    ctx.font = '600 28px "JetBrains Mono", monospace';
    ctx.fillText('#FrameInGoa · AUG 2026', width / 2, height - 60);
    ctx.restore();

    // Dual Outer Frame Border
    ctx.save();
    ctx.strokeStyle = '#F5A623';
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, width - 12, height - 12);
    ctx.strokeStyle = '#FF5E4D';
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, width - 36, height - 36);
    ctx.restore();

  } else {
    // ==========================================
    // FORMAT A: BUILDER PASS BADGE (14 LAYERS)
    // ==========================================
    
    // Layer 0: Background (#141824 fill)
    ctx.fillStyle = '#141824';
    ctx.fillRect(0, 0, width, height);

    // Layer 1: Noise texture
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = '#FFFFFF';
    for (let x = 0; x < width; x += 16) {
      for (let y = 0; y < height; y += 16) {
        if (Math.random() > 0.5) {
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
    ctx.restore();

    // Layer 2: Photo (circle-clipped, 280px diameter)
    const photoCenterX = 200;
    const photoCenterY = 250;
    const photoRadius = 130;

    if (image) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const imgWidth = image.naturalWidth || image.width;
      const imgHeight = image.naturalHeight || image.height;
      const minDim = Math.min(imgWidth, imgHeight);
      const sx = (imgWidth - minDim) / 2;
      const sy = (imgHeight - minDim) / 2;

      ctx.drawImage(
        image,
        sx, sy, minDim, minDim,
        photoCenterX - photoRadius, photoCenterY - photoRadius, photoRadius * 2, photoRadius * 2
      );
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = '#0A3D4A';
      ctx.beginPath();
      ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F5A623';
      ctx.font = 'bold 72px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🌴', photoCenterX, photoCenterY);
      ctx.restore();
    }

    // Layer 3: Gold photo ring (4px stroke)
    ctx.save();
    ctx.strokeStyle = '#F5A623';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Layer 4: Bottom gradient
    const gradient = ctx.createLinearGradient(0, 460, 0, 1080);
    gradient.addColorStop(0, 'rgba(13, 15, 26, 0)');
    gradient.addColorStop(1, '#0D0F1A');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 460, width, 620);

    // Layer 5: Gold accent bar
    ctx.fillStyle = '#F5A623';
    ctx.fillRect(0, 490, width, 4);

    // Layer 6: Name text
    ctx.save();
    ctx.fillStyle = '#E8EAF0';
    ctx.font = '700 60px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const displayName = (name || 'YOUR NAME').toUpperCase();
    ctx.fillText(displayName, 80, 565);
    ctx.restore();

    // Layer 7: Hexagon icon + Builder Title
    ctx.save();
    const hexCenterX = 96;
    const hexCenterY = 655;
    const hexRadius = 15;

    ctx.fillStyle = '#F5A623';
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = hexCenterX + hexRadius * Math.cos(angle);
      const y = hexCenterY + hexRadius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    const titleText = getBuilderTitle(stack).toUpperCase();
    ctx.font = '600 26px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(titleText, 128, hexCenterY);
    ctx.restore();

    // Layer 8: Stack/Role label
    ctx.save();
    const stackLabel = STACK_OPTIONS.find(o => o.value === stack)?.label || 'Fullstack';
    ctx.fillStyle = 'rgba(232, 234, 240, 0.7)';
    ctx.font = '400 22px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(stackLabel, 80, 698);
    ctx.restore();

    // Fun Vibe Field (Layer 8.5)
    ctx.save();
    ctx.fillStyle = '#00E5A0';
    ctx.font = '600 20px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`⚡ ${funVibe}`, 80, 735);
    ctx.restore();

    // Layer 9: Wordmark top-right
    ctx.save();
    ctx.fillStyle = '#E8EAF0';
    ctx.font = '700 36px "Space Grotesk", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('HH GOA 2026', 1000, 75);

    ctx.fillStyle = '#00E5A0';
    ctx.font = '600 18px "JetBrains Mono", monospace';
    ctx.fillText('BUILDER CREDENTIAL', 1000, 125);
    ctx.restore();

    // Layer 10: Embedded QR Code
    if (qrImg) {
      ctx.save();
      ctx.fillStyle = '#141824';
      ctx.fillRect(80, 840, 140, 140);
      ctx.strokeStyle = 'rgba(245, 166, 35, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, 840, 140, 140);
      ctx.drawImage(qrImg, 90, 850, 120, 120);
      ctx.restore();
    }

    // Layer 11: Date + Location + Builder ID
    ctx.save();
    ctx.fillStyle = 'rgba(232, 234, 240, 0.6)';
    ctx.font = '400 20px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('AUG 2026 · GOA, INDIA', 1000, 940);

    ctx.fillStyle = '#FF5E4D';
    ctx.font = '700 38px "JetBrains Mono", monospace';
    ctx.fillText(builderId, 1000, 990);
    ctx.restore();

    // Layer 12: Dot grid decoration
    ctx.save();
    ctx.fillStyle = 'rgba(232, 234, 240, 0.12)';
    const gridStartX = 720;
    const gridStartY = 750;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 6; c++) {
        ctx.beginPath();
        ctx.arc(gridStartX + c * 22, gridStartY + r * 22, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // Layer 13: Card border
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 166, 35, 0.4)';
    ctx.lineWidth = 6;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(8, 8, width - 16, height - 16, 32);
      ctx.stroke();
    } else {
      ctx.strokeRect(8, 8, width - 16, height - 16);
    }
    ctx.restore();
  }
}
