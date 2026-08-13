import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { WalletPass } from './components/WalletPass';
import { processImageFile } from './utils/heic';
import { drawCard } from './utils/canvasDrawer';

/* ═══════════════════════════════════════════════════════════════
   ICS generator
   ═══════════════════════════════════════════════════════════════ */
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
    'DTSTART:20261028T090000Z',
    'DTEND:20261031T180000Z',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/* ═══════════════════════════════════════════════════════════════
   GLOBAL CSS ANIMATIONS — Clouds, Sun, Palm Sway & Sea Waves
   ═══════════════════════════════════════════════════════════════ */
const PANEL_CSS = `
/* Cloud drifting & gentle bobbing animations */
@keyframes cloud-drift-1 {
  0%   { transform: translateX(-200px) translateY(0px); }
  50%  { transform: translateX(calc(50vw)) translateY(-12px); }
  100% { transform: translateX(calc(100vw + 200px)) translateY(0px); }
}
@keyframes cloud-drift-2 {
  0%   { transform: translateX(-180px) translateY(0px); }
  50%  { transform: translateX(calc(50vw)) translateY(10px); }
  100% { transform: translateX(calc(100vw + 180px)) translateY(0px); }
}
@keyframes cloud-drift-3 {
  0%   { transform: translateX(calc(100vw + 220px)) translateY(0px); }
  50%  { transform: translateX(calc(50vw)) translateY(-8px); }
  100% { transform: translateX(-220px) translateY(0px); }
}
@keyframes cloud-drift-4 {
  0%   { transform: translateX(-150px) translateY(0px); }
  50%  { transform: translateX(calc(50vw)) translateY(-14px); }
  100% { transform: translateX(calc(100vw + 150px)) translateY(0px); }
}

/* Palm tree breeze swaying */
@keyframes tree-sway-left {
  0%, 100% { transform: rotate(0deg); }
  50%      { transform: rotate(3.5deg); }
}
@keyframes tree-sway-right {
  0%, 100% { transform: scaleX(-1) rotate(0deg); }
  50%      { transform: scaleX(-1) rotate(-3.5deg); }
}
.tree-sway-l {
  animation: tree-sway-left 6.5s ease-in-out infinite;
  transform-origin: bottom center;
}
.tree-sway-r {
  animation: tree-sway-right 7.2s ease-in-out infinite 0.8s;
  transform-origin: bottom center;
}

/* Sun pulse */
@keyframes sun-pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
}

/* Neo-Brutalist Wave Morphing */
@keyframes brut-wave1 {
  0%,100% { d: path("M0,45 C75,15 150,75 225,45 C300,15 375,75 450,45 C525,15 600,75 675,45 C750,15 825,75 900,45 C975,15 1050,75 1125,45 C1200,15 1275,75 1350,45 L1350,150 L0,150 Z"); }
  50%     { d: path("M0,65 C75,35 150,95 225,65 C300,35 375,95 450,65 C525,35 600,95 675,65 C750,35 825,95 900,65 C975,35 1050,95 1125,65 C1200,35 1275,95 1350,65 L1350,150 L0,150 Z"); }
}
@keyframes brut-wave2 {
  0%,100% { d: path("M0,60 C80,30 160,90 240,60 C320,30 400,90 480,60 C560,30 640,90 720,60 C800,30 880,90 960,60 C1040,30 1120,90 1200,60 C1280,30 1360,90 1440,60 L1440,150 L0,150 Z"); }
  50%     { d: path("M0,40 C80,10 160,70 240,40 C320,10 400,70 480,40 C560,10 640,70 720,40 C800,10 880,70 960,40 C1040,10 1120,70 1200,40 C1280,10 1360,70 1440,40 L1440,150 L0,150 Z"); }
}
@keyframes brut-wave3 {
  0%,100% { d: path("M0,75 C90,50 180,100 270,75 C360,50 450,100 540,75 C630,50 720,100 810,75 C900,50 990,100 1080,75 C1170,50 1260,100 1350,75 L1350,150 L0,150 Z"); }
  50%     { d: path("M0,55 C90,30 180,80 270,55 C360,30 450,80 540,55 C630,30 720,80 810,55 C900,30 990,80 1080,55 C1170,30 1260,80 1350,55 L1350,150 L0,150 Z"); }
}
.brut-w1 { animation: brut-wave1 4.5s ease-in-out infinite; }
.brut-w2 { animation: brut-wave2 6.2s ease-in-out infinite 1.1s; }
.brut-w3 { animation: brut-wave3 3.8s ease-in-out infinite 0.5s; }

/* Coastal breeze & shower */
@keyframes goa-breeze {
  0%   { transform: translateX(0) translateY(0); opacity: 0; }
  15%  { opacity: 0.75; }
  85%  { opacity: 0.45; }
  100% { transform: translateX(var(--bx)) translateY(var(--by)); opacity: 0; }
}
@keyframes goa-shower {
  0%   { transform: translateY(0) translateX(0); opacity: 0; }
  10%  { opacity: 0.7; }
  90%  { opacity: 0.35; }
  100% { transform: translateY(var(--sy)) translateX(var(--sx)); opacity: 0; }
}
.goa-breeze-dot {
  position: absolute;
  border-radius: 4px;
  background: rgba(200,245,255,0.75);
  box-shadow: 0 0 8px rgba(254,225,1,0.3);
  animation: goa-breeze var(--dur) ease-out infinite var(--delay);
}
.goa-shower-drop {
  position: absolute;
  border-radius: 2px;
  background: linear-gradient(180deg, rgba(200,240,255,0.85), rgba(200,240,255,0));
  animation: goa-shower var(--dur) linear infinite var(--delay);
}
`;

function InjectPanelCSS() {
  useEffect(() => {
    if (document.getElementById('goa-panel-css')) return;
    const s = document.createElement('style');
    s.id = 'goa-panel-css';
    s.textContent = PANEL_CSS;
    document.head.appendChild(s);
  }, []);
  return null;
}

/* ═══════════════════════════════════════════════════════════════
   NEO-BRUTALIST SUNSET — Positioned on the LEFT side
   ═══════════════════════════════════════════════════════════════ */
function NeoBrutalistSunset() {
  return (
    <div
      className="fixed left-[4%] lg:left-[12%] pointer-events-none select-none"
      style={{ top: '6%', zIndex: 0, animation: 'sun-pulse 8s ease-in-out infinite' }}
    >
      <svg width="220" height="220" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(6px 6px 0px #0a0a0a)' }}>
        <defs>
          <linearGradient id="sunGrad" x1="100" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fee101" />
            <stop offset="55%" stopColor="#ff7b00" />
            <stop offset="100%" stopColor="#E8357A" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="100" r="92" fill="#fee101" opacity="0.18" />
        <circle cx="100" cy="100" r="82" fill="url(#sunGrad)" stroke="#0a0a0a" strokeWidth="4.5" />

        <rect x="20" y="112" width="160" height="5" fill="#084d2a" rx="2" />
        <rect x="25" y="128" width="150" height="7" fill="#084d2a" rx="2" />
        <rect x="34" y="145" width="132" height="9" fill="#084d2a" rx="2" />
        <rect x="48" y="163" width="104" height="11" fill="#084d2a" rx="2" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NEO-BRUTALIST DRIFTING CLOUDS
   ═══════════════════════════════════════════════════════════════ */
function NeoBrutalistClouds() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Cloud 1 */}
      <div style={{
        position: 'absolute', top: '7%', left: 0,
        animation: 'cloud-drift-1 34s linear infinite',
      }}>
        <svg width="160" height="80" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(5px 5px 0px #0a0a0a)' }}>
          <path
            d="M 25 65 H 135 C 150 65 155 50 145 38 C 148 20 130 10 115 18 C 105 5 80 5 70 20 C 58 10 38 18 35 32 C 20 32 10 48 25 65 Z"
            fill="#faf5e4" stroke="#0a0a0a" strokeWidth="3.5" strokeLinejoin="round"
          />
          <circle cx="95" cy="38" r="4" fill="#fee101" stroke="#0a0a0a" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Cloud 2 */}
      <div style={{
        position: 'absolute', top: '15%', right: 0,
        animation: 'cloud-drift-3 44s linear infinite 4s',
      }}>
        <svg width="180" height="90" viewBox="0 0 180 90" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(5px 5px 0px #0a0a0a)' }}>
          <path
            d="M 30 75 H 155 C 170 75 175 60 165 46 C 168 25 148 15 130 24 C 118 8 92 8 80 24 C 66 12 44 20 40 38 C 22 38 12 56 30 75 Z"
            fill="#fee101" stroke="#0a0a0a" strokeWidth="3.5" strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Cloud 3 */}
      <div style={{
        position: 'absolute', top: '22%', left: 0,
        animation: 'cloud-drift-2 28s linear infinite 10s',
      }}>
        <svg width="135" height="68" viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(4px 4px 0px #0a0a0a)' }}>
          <path
            d="M 20 58 H 120 C 132 58 138 45 128 34 C 130 18 114 8 100 15 C 92 4 70 4 60 16 C 50 8 32 14 28 28 C 12 28 5 42 20 58 Z"
            fill="#faf5e4" stroke="#0a0a0a" strokeWidth="3" strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Cloud 4 */}
      <div style={{
        position: 'absolute', top: '30%', left: 0,
        animation: 'cloud-drift-4 38s linear infinite 18s',
      }}>
        <svg width="155" height="78" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(4px 4px 0px #0a0a0a)' }}>
          <path
            d="M 25 65 H 135 C 150 65 155 50 145 38 C 148 20 130 10 115 18 C 105 5 80 5 70 20 C 58 10 38 18 35 32 C 20 32 10 48 25 65 Z"
            fill="#E8357A" stroke="#0a0a0a" strokeWidth="3.5" strokeLinejoin="round" opacity="0.9"
          />
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NEO-BRUTALIST MOVING SEA
   ═══════════════════════════════════════════════════════════════ */
function NeoBrutalistSea() {
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none select-none" style={{ height: 130, zIndex: 0 }}>
      <svg
        viewBox="0 0 1350 150"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        <path
          className="brut-w1"
          d="M0,45 C75,15 150,75 225,45 C300,15 375,75 450,45 C525,15 600,75 675,45 C750,15 825,75 900,45 C975,15 1050,75 1125,45 C1200,15 1275,75 1350,45 L1350,150 L0,150 Z"
          fill="#054022"
          stroke="#0a0a0a"
          strokeWidth="3"
        />
        <path
          className="brut-w2"
          d="M0,60 C80,30 160,90 240,60 C320,30 400,90 480,60 C560,30 640,90 720,60 C800,30 880,90 960,60 C1040,30 1120,90 1200,60 C1280,30 1360,90 1440,60 L1440,150 L0,150 Z"
          fill="#0b6839"
          stroke="#0a0a0a"
          strokeWidth="3"
        />
        <path
          className="brut-w3"
          d="M0,75 C90,50 180,100 270,75 C360,50 450,100 540,75 C630,50 720,100 810,75 C900,50 990,100 1080,75 C1170,50 1260,100 1350,75 L1350,150 L0,150 Z"
          fill="#0d7d44"
          stroke="#0a0a0a"
          strokeWidth="3.5"
        />
        {[40, 140, 240, 340, 440, 540, 640, 740, 840, 940, 1040, 1140, 1240].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={65 + (i % 3) * 8} r="4" fill="#fee101" stroke="#0a0a0a" strokeWidth="1.5" />
            <circle cx={x + 18} cy={72 + (i % 2) * 6} r="2.5" fill="#ffffff" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FULL SCREEN BREEZE PARTICLES
   ═══════════════════════════════════════════════════════════════ */
function FullscreenBreeze() {
  const dots = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    top:   `${5 + (i * 17 + 3) % 85}%`,
    left:  `${(i * 13 + 5) % 90}%`,
    w: 16 + (i % 5) * 8,
    h: 2 + (i % 2) * 0.5,
    bx: `${(i % 2 === 0 ? 1 : -1) * (40 + (i % 4) * 25)}px`,
    by: `${-10 + (i % 5) * 6}px`,
    dur: `${2.2 + (i % 4) * 0.6}s`,
    delay: `${(i * 0.23) % 4}s`,
  }));
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {dots.map(d => (
        <div key={d.id} className="goa-breeze-dot" style={{
          top: d.top, left: d.left,
          width: d.w, height: d.h,
          '--bx': d.bx, '--by': d.by,
          '--dur': d.dur, '--delay': d.delay,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FULL SCREEN SHOWER PARTICLES
   ═══════════════════════════════════════════════════════════════ */
function FullscreenShower() {
  const drops = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${2 + (i * 17 + 5) % 95}%`,
    w: 1.2 + (i % 2) * 0.8,
    h: 12 + (i % 4) * 6,
    sy: `${140 + (i % 3) * 60}px`,
    sx: `${(i % 2 === 0 ? 1 : -1) * (6 + (i % 4) * 4)}px`,
    dur: `${1.7 + (i % 5) * 0.4}s`,
    delay: `${(i * 0.17) % 3.5}s`,
  }));
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {drops.map(d => (
        <div key={d.id} className="goa-shower-drop" style={{
          top: '-20px', left: d.left,
          width: d.w, height: d.h,
          '--sy': d.sy, '--sx': d.sx,
          '--dur': d.dur, '--delay': d.delay,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIDE PALM TREES — Breeze sway animation (Left & Right 100% visible)
   ═══════════════════════════════════════════════════════════════ */
function SidePanel({ side }) {
  const isRight = side === 'right';
  return (
    <div
      className="fixed top-0 bottom-0 hidden lg:block overflow-hidden pointer-events-none select-none"
      style={{
        [side]: 0,
        width: 320,
        zIndex: 0,
        background: 'transparent',
      }}
    >
      <img
        src="/palm-tree.png"
        alt=""
        className={isRight ? 'tree-sway-r' : 'tree-sway-l'}
        style={{
          position: 'absolute',
          bottom: 70,
          [side]: 0,
          width: '300px',
          height: 'auto',
          objectFit: 'contain',
          objectPosition: `bottom ${side}`,
          mixBlendMode: 'screen',
          filter: 'saturate(1.8) brightness(1.1) contrast(1.05)',
          opacity: 1,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════ */
export function App() {
  const [imageObj, setImageObj]             = useState(null);
  const [previewUrl, setPreviewUrl]         = useState('');
  const [name, setName]                     = useState('');
  const [stack, setStack]                   = useState('');
  const [funVibe, setFunVibe]               = useState('');
  const [threeWords, setThreeWords]         = useState('');
  const [cardMode, setCardMode]             = useState('pass');
  const [fileFormat, setFileFormat]         = useState('png');
  const [builderId]                         = useState('#001');
  const [isProcessing, setIsProcessing]     = useState(false);
  const [errorMsg, setErrorMsg]             = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawCard(canvasRef.current, {
        image: imageObj, name, stack, funVibe, threeWords, cardMode, builderId,
        qrUrl: window.location.href,
      });
    }
  }, [imageObj, name, stack, funVibe, threeWords, cardMode, builderId]);

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
        const icsString = createIcsString({ name });
        const dataUrl = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsString);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `HH-Goa-2026-${safeName}.ics`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      } else {
        if (!canvasRef.current) throw new Error('Canvas element missing.');
        await drawCard(canvasRef.current, {
          image: imageObj, name, stack, funVibe, threeWords, cardMode, builderId,
          qrUrl: window.location.href,
        });
        const isJpeg    = fileFormat === 'jpeg';
        const mimeType  = isJpeg ? 'image/jpeg' : 'image/png';
        const extension = isJpeg ? 'jpg' : 'png';
        const prefix    = cardMode === 'pass' ? 'HH-Goa-2026-Pass' : 'HH-Goa-2026-PFP';
        const filename  = `${prefix}-${safeName}.${extension}`;
        const dataUrl   = canvasRef.current.toDataURL(mimeType, 0.95);
        const a = document.createElement('a');
        a.download = filename; a.href = dataUrl;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      }
      confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 },
        colors: ['#fee101', '#E8357A', '#ffffff', '#F5F0E0'] });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Download error:', err);
      setErrorMsg(err.message || 'Download failed. Try "Open in new tab".');
    }
  };

  const handleOpenInNewTab = async () => {
    if (!canvasRef.current) return;
    await drawCard(canvasRef.current, {
      image: imageObj, name, stack, funVibe, threeWords, cardMode, builderId,
      qrUrl: window.location.href,
    });
    const isJpeg  = fileFormat === 'jpeg';
    const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
    const dataUrl  = canvasRef.current.toDataURL(mimeType, 0.95);
    const win = window.open();
    if (win) {
      win.document.write(`<!DOCTYPE html><html><head><title>HH Goa 2026 Card</title></head>
      <body style="margin:0;background:#084d2a;display:flex;align-items:center;justify-content:center;min-height:100vh;">
        <img src="${dataUrl}" style="max-width:100%;max-height:100vh;object-fit:contain;box-shadow:0 20px 50px rgba(0,0,0,0.8);" />
      </body></html>`);
    }
  };

  const handleShare = async () => {
    const hashtag = '#FrameInGoa #HHGoa2026';
    const caption = cardMode === 'pass'
      ? `Just got my HH Goa 2026 builder card 🌴⚡\nBuilding something real in Goa this October.\n${hashtag}`
      : `Ready to build at HH Goa 2026! 🌴⚡\n${hashtag}`;
    if (!canvasRef.current) {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`, '_blank');
      return;
    }
    try {
      if (navigator.share && navigator.canShare) {
        const isJpeg   = fileFormat === 'jpeg';
        const mimeType  = isJpeg ? 'image/jpeg' : 'image/png';
        const extension = isJpeg ? 'jpg' : 'png';
        const blob = await new Promise(resolve => canvasRef.current.toBlob(resolve, mimeType, 0.95));
        if (blob) {
          const file = new File([blob], `hh-goa-2026-${cardMode}.${extension}`, { type: mimeType });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ title: 'HH Goa 2026 Builder Card', text: caption, files: [file] });
            return;
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.warn('Native share failed:', err);
    }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`, '_blank');
  };

  const handleReset = () => {
    setImageObj(null); setPreviewUrl(''); setName('');
    setStack(''); setFunVibe(''); setThreeWords(''); setErrorMsg('');
  };

  return (
    <>
      <InjectPanelCSS />

      <div className="min-h-screen relative overflow-hidden" style={{ background: '#084d2a', color: '#F5F0E0' }}>

        {/* ── Neo-Brutalist Sunset on the LEFT ── */}
        <NeoBrutalistSunset />

        {/* ── Neo-Brutalist Drifting Clouds ── */}
        <NeoBrutalistClouds />

        {/* ── Fullscreen breeze streaks & shower rain mist ── */}
        <FullscreenBreeze />
        <FullscreenShower />

        {/* ── Side Palm Trees with Sway Motion (Left & Right 100% visible) ── */}
        <SidePanel side="left" />
        <SidePanel side="right" />

        {/* ── Neo-Brutalist Moving Sea (bottom waves) ── */}
        <NeoBrutalistSea />

        {/* ── Wallet Pass Form & Card UI ── */}
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
            threeWords={threeWords}
            setThreeWords={setThreeWords}
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

        {/* Hidden 1080×1920 Vintage Boarding Pass export canvas */}
        <canvas
          ref={canvasRef}
          width={1080}
          height={1920}
          aria-label="HH Goa 2026 builder card canvas export"
          style={{ display: 'none' }}
        />
      </div>
    </>
  );
}

export default App;
