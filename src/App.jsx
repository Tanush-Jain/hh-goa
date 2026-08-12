import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { WalletPass } from './components/WalletPass';
import { processImageFile } from './utils/heic';
import { drawCard } from './utils/canvasDrawer';

/**
 * Generates an iCalendar (.ics) event string for HH Goa 2026.
 */
function createIcsString({ name = 'Builder' }) {
  const displayName = (name || 'Builder').trim();
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HH Goa 2026//Builder Card//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:HH Goa 2026 Hackathon - ${displayName}`,
    'DESCRIPTION:HH Goa 2026 Builder Event! Building something real in Goa.',
    'LOCATION:Goa\\, India',
    'DTSTART:20260814T090000Z',
    'DTEND:20260816T180000Z',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

export function App() {
  const [imageObj, setImageObj] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [name, setName] = useState('');
  const [stack, setStack] = useState('fullstack');
  const [funVibe, setFunVibe] = useState('Shipping on 3hrs sleep ☕');
  const [cardMode, setCardMode] = useState('pass'); // 'pass' or 'frame'
  const [fileFormat, setFileFormat] = useState('png'); // 'png', 'jpeg', or 'ics'
  const [builderId] = useState('#001');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const canvasRef = useRef(null);

  // Redraw canvas whenever inputs or mode changes
  useEffect(() => {
    if (canvasRef.current) {
      drawCard(canvasRef.current, {
        image: imageObj,
        name,
        stack,
        funVibe,
        cardMode,
        builderId,
        qrUrl: window.location.href
      });
    }
  }, [imageObj, name, stack, funVibe, cardMode, builderId]);

  const handleImageSelected = async (file, overrideObj) => {
    setErrorMsg('');
    setIsProcessing(true);
    try {
      if (overrideObj) {
        setImageObj(overrideObj.img);
        setPreviewUrl(overrideObj.dataUrl);
      } else if (file) {
        const { img, dataUrl } = await processImageFile(file);
        setImageObj(img);
        setPreviewUrl(dataUrl);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to process photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    setErrorMsg('');
    const safeName = (name || 'builder').replace(/[^a-z0-9]/gi, '-').toLowerCase();

    try {
      if (fileFormat === 'ics') {
        // ===================================
        // 1. ICS Calendar File Download
        // ===================================
        const icsString = createIcsString({ name });
        const dataUrl = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsString);
        
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `HH-Goa-2026-${safeName}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // ===================================
        // 2. PNG or JPG Image File Download
        // ===================================
        if (!canvasRef.current) throw new Error('Canvas element missing.');

        // Re-draw canvas immediately before export
        await drawCard(canvasRef.current, {
          image: imageObj,
          name,
          stack,
          funVibe,
          cardMode,
          builderId,
          qrUrl: window.location.href
        });

        const isJpeg = fileFormat === 'jpeg';
        const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
        const extension = isJpeg ? 'jpg' : 'png'; // Standard 3-letter extension for Mac Preview
        const filenamePrefix = cardMode === 'pass' ? 'HH-Goa-2026-Pass' : 'HH-Goa-2026-PFP';
        const filename = `${filenamePrefix}-${safeName}.${extension}`;

        // Convert canvas to Data URL (Preserves exact file name & extension on macOS Safari/Chrome)
        const dataUrl = canvasRef.current.toDataURL(mimeType, 0.95);
        
        // Trigger browser native file save with explicit filename & extension
        const a = document.createElement('a');
        a.download = filename;
        a.href = dataUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Fallback: If browser prevents direct download, open image in new window/tab
        setTimeout(() => {
          if (!downloadSuccess) {
            const win = window.open();
            if (win) {
              win.document.write(`<title>${filename}</title><img src="${dataUrl}" style="max-width:100%;height:auto;margin:auto;display:block;background:#0D0F1A;" />`);
            }
          }
        }, 800);
      }

      // Celebratory Confetti Burst
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#F5A623', '#FF5E4D', '#00E5A0', '#E8EAF0']
      });

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Download error:', err);
      setErrorMsg(err.message || 'Download failed. Click "Open Image" to save directly.');
    }
  };

  const handleOpenInNewTab = async () => {
    if (!canvasRef.current) return;
    await drawCard(canvasRef.current, {
      image: imageObj,
      name,
      stack,
      funVibe,
      cardMode,
      builderId,
      qrUrl: window.location.href
    });

    const isJpeg = fileFormat === 'jpeg';
    const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
    const dataUrl = canvasRef.current.toDataURL(mimeType, 0.95);
    
    const win = window.open();
    if (win) {
      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head><title>HH Goa 2026 Card</title></head>
        <body style="margin:0;background:#0D0F1A;display:flex;align-items:center;justify-content:center;min-height:100vh;">
          <img src="${dataUrl}" style="max-width:100%;max-height:100vh;object-contain;box-shadow:0 20px 50px rgba(0,0,0,0.8);" />
        </body>
        </html>
      `);
    }
  };

  const handleShare = async () => {
    const hashtag = '#FrameInGoa #HHGoa2026';
    const caption = cardMode === 'pass'
      ? `Just got my HH Goa 2026 builder card 🌴⚡\nBuilding something real in Goa this August.\n${hashtag}`
      : `Ready to build at HH Goa 2026! 🌴⚡ Check out my builder profile.\n${hashtag}`;

    if (!canvasRef.current) {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`, '_blank');
      return;
    }

    try {
      if (navigator.share && navigator.canShare) {
        const isJpeg = fileFormat === 'jpeg';
        const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
        const extension = isJpeg ? 'jpg' : 'png';

        const blob = await new Promise((resolve) => {
          canvasRef.current.toBlob(resolve, mimeType, 0.95);
        });

        if (blob) {
          const file = new File([blob], `hh-goa-2026-${cardMode}.${extension}`, { type: mimeType });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'HH Goa 2026 Builder Card',
              text: caption,
              files: [file]
            });
            return;
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Native share failed, falling back to Web intent:', err);
      }
    }

    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`, '_blank');
  };

  const handleReset = () => {
    setImageObj(null);
    setPreviewUrl('');
    setName('');
    setStack('fullstack');
    setFunVibe('Shipping on 3hrs sleep ☕');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#084d2a', color: '#F5F0E0' }}>

      {/* ── Left Palm Tree ── */}
      <div className="fixed left-0 bottom-0 pointer-events-none select-none hidden lg:block" style={{ zIndex: 0, width: 260, height: '100vh' }}>
        <PalmTree flip={false} />
      </div>

      {/* ── Right Palm Tree ── */}
      <div className="fixed right-0 bottom-0 pointer-events-none select-none hidden lg:block" style={{ zIndex: 0, width: 260, height: '100vh' }}>
        <PalmTree flip={true} />
      </div>

      {/* Main content above palms */}
      <div className="relative" style={{ zIndex: 1 }}>
        <WalletPass
          imageObj={imageObj}
          previewUrl={previewUrl}
          name={name}
          setName={setName}
          stack={stack}
          setStack={setStack}
          funVibe={funVibe}
          setFunVibe={setFunVibe}
          cardMode={cardMode}
          setCardMode={setCardMode}
          fileFormat={fileFormat}
          setFileFormat={setFileFormat}
          onImageSelected={handleImageSelected}
          onDownload={handleDownload}
          onOpenInNewTab={handleOpenInNewTab}
          onShare={handleShare}
          onReset={handleReset}
          isProcessing={isProcessing}
          downloadSuccess={downloadSuccess}
          errorMsg={errorMsg}
        />
      </div>

      {/* Hidden Canvas Element for 1080x1080 Export */}
      <canvas
        ref={canvasRef}
        width={1080}
        height={1080}
        aria-label="Your HH Goa 2026 builder card canvas export"
        style={{ display: 'none' }}
      />
    </div>
  );
}

/**
 * HH Goa style palm tree SVG — white trunk, dark green layered fronds, yellow outlines.
 * flip=true mirrors it for the right side.
 */
function PalmTree({ flip }) {
  return (
    <svg
      viewBox="0 0 260 700"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        bottom: 0,
        left: flip ? 'auto' : 0,
        right: flip ? 0 : 'auto',
        width: '100%',
        height: '100%',
        transform: flip ? 'scaleX(-1)' : 'none',
        opacity: 0.92,
      }}
    >
      {/* ─── Trunk ─────────────────────────────────────── */}
      {/* Main white trunk body — slightly curved */}
      <path
        d="M 100 700 C 108 580, 95 460, 115 340 C 125 270, 135 200, 145 140"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="28"
        strokeLinecap="round"
      />
      {/* Yellow trunk outline (left) */}
      <path
        d="M 100 700 C 108 580, 95 460, 115 340 C 125 270, 135 200, 145 140"
        fill="none"
        stroke="#fee101"
        strokeWidth="32"
        strokeLinecap="round"
        opacity="0.35"
      />
      {/* Dark green trunk centre-line texture */}
      <path
        d="M 104 700 C 112 580, 99 460, 119 340 C 129 270, 139 200, 149 140"
        fill="none"
        stroke="#0b6839"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* ─── Frond Layer 1 (lowest / widest) ─────────── */}
      <g transform="translate(145,140) rotate(-10)">
        {/* Big sweep left */}
        <path d="M 0 0 C -40 -20, -100 10, -160 -10 C -120 -30, -60 -40, 0 0 Z"
          fill="#1a6b3a" stroke="#fee101" strokeWidth="2" />
        {/* Big sweep right */}
        <path d="M 0 0 C 40 -20, 90 -10, 130 -40 C 90 -50, 40 -35, 0 0 Z"
          fill="#1a6b3a" stroke="#fee101" strokeWidth="2" />
        {/* Sweep down-left */}
        <path d="M 0 0 C -30 20, -80 50, -110 80 C -75 55, -30 25, 0 0 Z"
          fill="#0b6839" stroke="#fee101" strokeWidth="2" />
        {/* Sweep down-right */}
        <path d="M 0 0 C 30 20, 70 55, 90 90 C 60 60, 25 28, 0 0 Z"
          fill="#0b6839" stroke="#fee101" strokeWidth="2" />
      </g>

      {/* ─── Frond Layer 2 (upper) ─────────────────────── */}
      <g transform="translate(145,140) rotate(5)">
        {/* Far left sweep */}
        <path d="M 0 0 C -50 -30, -120 -20, -180 -50 C -130 -55, -60 -45, 0 0 Z"
          fill="#22874a" stroke="#fee101" strokeWidth="1.5" />
        {/* Far right sweep */}
        <path d="M 0 0 C 55 -25, 110 -45, 155 -80 C 110 -70, 55 -40, 0 0 Z"
          fill="#22874a" stroke="#fee101" strokeWidth="1.5" />
        {/* Upper-left */}
        <path d="M 0 0 C -20 -50, -50 -100, -60 -150 C -40 -105, -15 -55, 0 0 Z"
          fill="#1a6b3a" stroke="#fee101" strokeWidth="1.5" />
        {/* Upper-right */}
        <path d="M 0 0 C 20 -45, 45 -95, 50 -140 C 35 -98, 15 -50, 0 0 Z"
          fill="#1a6b3a" stroke="#fee101" strokeWidth="1.5" />
        {/* Straight up */}
        <path d="M 0 0 C 0 -50, 5 -110, 10 -160 C 5 -112, 0 -55, 0 0 Z"
          fill="#22874a" stroke="#fee101" strokeWidth="1.5" />
      </g>

      {/* ─── Crown leaf tips (top spray) ──────────────── */}
      <g transform="translate(145,140)">
        <ellipse cx="-15" cy="-170" rx="14" ry="7" fill="#22874a" stroke="#fee101" strokeWidth="1.5" transform="rotate(-25,-15,-170)" />
        <ellipse cx="15"  cy="-175" rx="14" ry="7" fill="#22874a" stroke="#fee101" strokeWidth="1.5" transform="rotate(15,15,-175)" />
        <ellipse cx="0"   cy="-180" rx="12" ry="6" fill="#2a9e58" stroke="#fee101" strokeWidth="1.5" />
        <ellipse cx="-35" cy="-158" rx="16" ry="6" fill="#1a6b3a" stroke="#fee101" strokeWidth="1.5" transform="rotate(-35,-35,-158)" />
        <ellipse cx="40"  cy="-155" rx="16" ry="6" fill="#1a6b3a" stroke="#fee101" strokeWidth="1.5" transform="rotate(30,40,-155)" />
      </g>

      {/* ─── Coconuts ─────────────────────────────────── */}
      <circle cx="138" cy="150" r="9"  fill="#3d2008" stroke="#fee101" strokeWidth="1.5" />
      <circle cx="153" cy="155" r="8"  fill="#3d2008" stroke="#fee101" strokeWidth="1.5" />
      <circle cx="145" cy="162" r="7"  fill="#3d2008" stroke="#fee101" strokeWidth="1.5" />

      {/* ─── Pink flower / ground decoration ─────────── */}
      <g transform="translate(60, 680)">
        {[-60,-30,0,30,60].map((x,i) => (
          <g key={i} transform={`translate(${x},0)`}>
            <circle cx="0" cy="-12" r="8" fill="#e8357a" opacity="0.85" />
            <circle cx="0" cy="0"   r="5" fill="#fee101" />
          </g>
        ))}
      </g>

      {/* ─── Ground grass blades ─────────────────────── */}
      {[-40,-20,0,20,40,60,80,100,120].map((x,i) => (
        <path key={i}
          d={`M ${x+20} 700 C ${x+10} 670, ${x+30} 650, ${x+20} 630`}
          fill="none"
          stroke="#0d7d44"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.7"
        />
      ))}
    </svg>
  );
}

export default App;
