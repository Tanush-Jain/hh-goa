import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Download, Share2, RefreshCw, Sparkles, Check,
  QrCode, Layers, Frame, FileImage,
  Calendar, Camera, Zap, ShieldCheck, ExternalLink, UserCheck, Image as ImageIcon,
  Terminal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STACK_OPTIONS, FUN_VIBES, getBuilderTitle } from '../utils/titles';

/* ─── Neo-Brutalist HH Goa Palette ────────────────────────────────────────── */
const C = {
  green:      '#0b6839',
  greenDark:  '#084d2a',
  yellow:     '#fee101',
  pink:       '#E8357A',
  black:      '#0a0a0a',
  white:      '#f5f5f0',
  cream:      '#faf5e4',
  border:     '#0a0a0a',
};

/* Preset quick-avatars */
const PRESET_AVATARS = [
  { id: 'sunset', name: 'Goa Sunset', emoji: '🌴', g1: '#fee101', g2: '#E8357A' },
  { id: 'cyber',  name: 'Build Mode', emoji: '⚡', g1: '#0b6839', g2: '#fee101' },
  { id: 'hacker', name: 'Night Ship', emoji: '🛠️', g1: '#E8357A', g2: '#084d2a' }
];

function generatePresetDataUrl(preset) {
  const c = document.createElement('canvas');
  c.width = 400; c.height = 400;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 400, 400);
  g.addColorStop(0, preset.g1);
  g.addColorStop(1, preset.g2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, 400, 400);
  ctx.font = 'bold 160px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(preset.emoji, 200, 200);
  return c.toDataURL('image/png');
}

/* ─── Animated Ocean Wave Panel ──────────────────────────────────────────── */
export function OceanPanel({ side }) {
  return (
    <div
      className="fixed top-0 bottom-0 hidden lg:flex flex-col justify-end overflow-hidden pointer-events-none select-none"
      style={{
        [side]: 0,
        width: 290,
        zIndex: 0,
        background: `linear-gradient(180deg, ${C.greenDark} 0%, ${C.green} 60%, #0a5028 100%)`,
      }}
    >
      {/* Palm tree photo — blend mode screen so colors show true */}
      <img
        src="/palm-tree.png"
        alt=""
        style={{
          position: 'absolute',
          bottom: 0,
          [side]: 0,
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
          objectPosition: `bottom ${side}`,
          transform: side === 'right' ? 'scaleX(-1)' : 'none',
          mixBlendMode: 'screen',
          filter: 'saturate(1.6) brightness(1.05) contrast(1.1)',
          opacity: 1,
        }}
      />

      {/* Urrak & Feni bottles — bottom decoration */}
      <div className="absolute bottom-6 flex gap-3 justify-center w-full" style={{ paddingBottom: 4 }}>
        <UrrakBottle />
        <FeniBottle />
      </div>

      {/* Coastal sea spray / breeze particles */}
      <SeaSpray />

      {/* Animated ocean waves */}
      <div className="relative w-full" style={{ height: 120 }}>
        <WaveStack />
      </div>

      {/* Neo-Brutalist inner border on card side */}
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0,
        [side === 'left' ? 'right' : 'left']: 0,
        width: 5,
        background: C.black,
      }} />
    </div>
  );
}

/* ─── Wave Stack (3 layered animated SVG waves) ──────────────────────────── */
function WaveStack() {
  return (
    <svg viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%' }}>
      <defs>
        <style>{`
          @keyframes wave1 { 0%,100%{d:path("M0,60 C50,30 100,90 150,60 C200,30 250,90 300,60 L300,120 L0,120 Z")} 50%{d:path("M0,80 C50,50 100,110 150,80 C200,50 250,110 300,80 L300,120 L0,120 Z")} }
          @keyframes wave2 { 0%,100%{d:path("M0,75 C40,50 90,100 150,75 C210,50 260,100 300,75 L300,120 L0,120 Z")} 50%{d:path("M0,55 C40,30 90,80 150,55 C210,30 260,80 300,55 L300,120 L0,120 Z")} }
          @keyframes wave3 { 0%,100%{d:path("M0,90 C60,65 110,115 180,90 C240,65 270,115 300,90 L300,120 L0,120 Z")} 50%{d:path("M0,70 C60,45 110,95 180,70 C240,45 270,95 300,70 L300,120 L0,120 Z")} }
          .w1 { animation: wave1 4s ease-in-out infinite; fill: rgba(0,150,100,0.35); }
          .w2 { animation: wave2 5.5s ease-in-out infinite 0.8s; fill: rgba(0,180,120,0.25); }
          .w3 { animation: wave3 3.5s ease-in-out infinite 0.3s; fill: rgba(11,104,57,0.55); }
        `}</style>
      </defs>
      <path className="w1" d="M0,60 C50,30 100,90 150,60 C200,30 250,90 300,60 L300,120 L0,120 Z" />
      <path className="w2" d="M0,75 C40,50 90,100 150,75 C210,50 260,100 300,75 L300,120 L0,120 Z" />
      <path className="w3" d="M0,90 C60,65 110,115 180,90 C240,65 270,115 300,90 L300,120 L0,120 Z" />
      {/* Sea foam dots */}
      {[30,80,130,190,240].map((x, i) => (
        <circle key={i} cx={x} cy={78 + (i % 2) * 10} r="3"
          fill="rgba(255,255,255,0.55)"
          style={{ animation: `wave${(i % 3) + 1} ${3 + i * 0.4}s ease-in-out infinite ${i * 0.3}s` }} />
      ))}
    </svg>
  );
}

/* ─── Sea Spray / Coastal Breeze Particles ───────────────────────────────── */
function SeaSpray() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 120, overflow: 'hidden', pointerEvents: 'none' }}>
      <style>{`
        @keyframes spray {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.7; }
          50%  { opacity: 0.4; }
          100% { transform: translateY(-120px) translateX(var(--drift)) scale(0); opacity: 0; }
        }
        .spray-dot {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.75);
          animation: spray var(--dur) ease-out infinite;
          animation-delay: var(--delay);
          width: var(--sz); height: var(--sz);
          left: var(--x); bottom: var(--y);
          --drift: 0px;
        }
      `}</style>
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="spray-dot" style={{
          '--x':    `${8 + (i * 17) % 90}%`,
          '--y':    `${(i * 23) % 80}px`,
          '--sz':   `${2 + (i % 4)}px`,
          '--dur':  `${2 + (i % 3) * 0.8}s`,
          '--delay':`${(i * 0.37) % 3}s`,
          '--drift':`${(i % 2 === 0 ? 1 : -1) * (8 + (i % 5) * 4)}px`,
        }} />
      ))}
    </div>
  );
}

/* ─── Urrak Bottle (clear/golden liquor) ─────────────────────────────────── */
function UrrakBottle() {
  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox="0 0 40 80" width="32" height="64" xmlns="http://www.w3.org/2000/svg">
        {/* Cap */}
        <rect x="15" y="2" width="10" height="8" rx="2" fill="#fee101" stroke="#0a0a0a" strokeWidth="1.5"/>
        {/* Neck */}
        <rect x="17" y="9" width="6" height="10" fill="#f5deb3" stroke="#0a0a0a" strokeWidth="1.2"/>
        {/* Body */}
        <rect x="10" y="18" width="20" height="46" rx="4" fill="#f5c842" stroke="#0a0a0a" strokeWidth="2"/>
        {/* Liquid shine */}
        <rect x="14" y="22" width="5" height="36" rx="2" fill="rgba(255,255,255,0.35)"/>
        {/* Label */}
        <rect x="12" y="30" width="16" height="18" rx="2" fill="#fff8dc" stroke="#0a0a0a" strokeWidth="1"/>
        <text x="20" y="41" textAnchor="middle" fontSize="4" fontFamily="monospace" fontWeight="bold" fill="#0a0a0a">URRAK</text>
        {/* Bubbles */}
        <circle cx="22" cy="55" r="1.5" fill="rgba(255,255,255,0.5)"/>
        <circle cx="18" cy="60" r="1"   fill="rgba(255,255,255,0.4)"/>
      </svg>
      <p style={{ color: C.yellow, fontSize: 8, fontFamily: 'monospace', fontWeight: 'bold', margin: 0, letterSpacing: 1 }}>URRAK</p>
    </div>
  );
}

/* ─── Feni Bottle (amber/dark cashew spirit) ─────────────────────────────── */
function FeniBottle() {
  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox="0 0 40 80" width="32" height="64" xmlns="http://www.w3.org/2000/svg">
        {/* Cap */}
        <rect x="15" y="2" width="10" height="7" rx="2" fill="#E8357A" stroke="#0a0a0a" strokeWidth="1.5"/>
        {/* Neck */}
        <rect x="17" y="8" width="6" height="12" fill="#cd853f" stroke="#0a0a0a" strokeWidth="1.2"/>
        {/* Shoulder flare */}
        <path d="M11 20 Q10 18 17 18 L23 18 Q30 18 29 20 Z" fill="#8B4513" stroke="#0a0a0a" strokeWidth="1"/>
        {/* Body */}
        <rect x="11" y="20" width="18" height="44" rx="3" fill="#8B4513" stroke="#0a0a0a" strokeWidth="2"/>
        {/* Amber liquid */}
        <rect x="13" y="24" width="14" height="36" rx="2" fill="#cd853f"/>
        {/* Shine */}
        <rect x="14" y="26" width="4" height="30" rx="2" fill="rgba(255,255,255,0.2)"/>
        {/* Label */}
        <rect x="13" y="32" width="14" height="16" rx="2" fill="#faf5e4" stroke="#0a0a0a" strokeWidth="1"/>
        <text x="20" y="42" textAnchor="middle" fontSize="4" fontFamily="monospace" fontWeight="bold" fill="#0a0a0a">FENI</text>
        <text x="20" y="47" textAnchor="middle" fontSize="2.5" fontFamily="monospace" fill="#8B4513">GOA</text>
      </svg>
      <p style={{ color: C.pink, fontSize: 8, fontFamily: 'monospace', fontWeight: 'bold', margin: 0, letterSpacing: 1 }}>FENI</p>
    </div>
  );
}

/* ─── Retro Terminal Prompt ──────────────────────────────────────────────── */
function TerminalPrompt({ text }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVisible(v => !v), 550);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ fontFamily: 'monospace', color: C.yellow, fontSize: 11 }}>
      <span style={{ color: C.green }}>~/hh-goa</span>
      <span style={{ color: C.white }}> $ </span>
      {text}
      <span style={{ opacity: visible ? 1 : 0, background: C.yellow, color: C.black }}>&nbsp;</span>
    </span>
  );
}

/* ─── Neo-Brutalist Box ──────────────────────────────────────────────────── */
const BrutalBox = ({ children, accent = C.yellow, style = {} }) => (
  <div style={{
    border: `3px solid ${C.black}`,
    boxShadow: `5px 5px 0 ${C.black}`,
    background: C.cream,
    borderRadius: 2,
    ...style,
  }}>
    {children}
  </div>
);

/* ─── Main WalletPass Component ─────────────────────────────────────────── */
const container = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.07 } }
};
const item = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export function WalletPass({
  previewUrl, name, setName, stack, setStack, funVibe, setFunVibe,
  cardMode, setCardMode, fileFormat, setFileFormat,
  onImageSelected, onDownload, onOpenInNewTab, onShare, onReset,
  isProcessing, downloadSuccess, errorMsg
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const boom = () => confetti({
    particleCount: 60, spread: 70, origin: { y: 0.85 },
    colors: [C.yellow, C.pink, '#fff', C.green]
  });

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) { onImageSelected(f); boom(); }
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) { onImageSelected(f); boom(); e.target.value = ''; }
  };

  const handlePreset = (preset) => {
    const url = generatePresetDataUrl(preset);
    const img = new Image();
    img.onload = () => { onImageSelected(null, { img, dataUrl: url }); boom(); };
    img.src = url;
  };

  return (
    <main
      className="w-full max-w-[480px] mx-auto min-h-screen px-4 py-8 flex flex-col justify-center items-center relative"
      style={{ background: 'transparent' }}
    >
      {/* CRT Scanlines overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
      }} />

      <motion.div variants={container} initial="hidden" animate="visible" className="w-full relative z-10">

        {/* ── Header: Neo-Brutalist terminal style ── */}
        <motion.div variants={item} className="mb-5">
          {/* Top ticker bar */}
          <div style={{
            background: C.black, color: C.yellow,
            fontFamily: 'monospace', fontSize: 11, fontWeight: 'bold',
            padding: '6px 14px', letterSpacing: 2, textTransform: 'uppercase',
            border: `3px solid ${C.black}`,
            borderBottom: 'none',
            overflow: 'hidden', whiteSpace: 'nowrap',
          }}>
            <span style={{ display: 'inline-block', animation: 'scroll-left 18s linear infinite' }}>
              &nbsp;&nbsp;⚡ HACKER HOUSE GOA 2026 &nbsp;·&nbsp; 28–31 OCT &nbsp;·&nbsp; GOA, INDIA &nbsp;·&nbsp; BUILD. SHIP. REPEAT &nbsp;·&nbsp; 🌴 COCONUT COUNT: INFINITE &nbsp;·&nbsp; URRAK: COLD &nbsp;·&nbsp; FENI: FLOWING &nbsp;·&nbsp; ⚡ HACKER HOUSE GOA 2026
            </span>
          </div>

          {/* Main title box */}
          <div style={{
            background: C.yellow, border: `3px solid ${C.black}`,
            padding: '12px 18px', position: 'relative',
          }}>
            <h1 style={{
              fontFamily: 'monospace', fontWeight: 900, fontSize: 28,
              color: C.black, margin: 0, letterSpacing: -1,
              textTransform: 'uppercase',
            }}>
              BUILDER_CREDENTIAL
            </h1>
            <div style={{ height: 2, background: C.black, margin: '6px 0 4px' }} />
            <TerminalPrompt text="generate --card --format=pass --goa" />
          </div>

          {/* Bottom bar */}
          <div style={{
            background: C.green, border: `3px solid ${C.black}`,
            borderTop: 'none', padding: '4px 14px',
            fontFamily: 'monospace', fontSize: 10, color: C.yellow,
            letterSpacing: 1,
          }}>
            {'>'} Your event badge & X PFP frame · 1080×1080px PNG
          </div>
        </motion.div>

        {/* ── Format Toggle (Neo-Brutalist tabs) ── */}
        <motion.div variants={item} className="flex gap-0 mb-4">
          {[
            { id: 'pass',  icon: '▣', label: 'FORMAT A: PASS' },
            { id: 'frame', icon: '◎', label: 'FORMAT B: PFP' }
          ].map((f, i) => (
            <button key={f.id} type="button" onClick={() => setCardMode(f.id)}
              style={{
                flex: 1, padding: '10px 8px',
                fontFamily: 'monospace', fontWeight: 'bold', fontSize: 11,
                textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
                border: `3px solid ${C.black}`,
                borderRight: i === 0 ? `1.5px solid ${C.black}` : `3px solid ${C.black}`,
                borderLeft: i === 1 ? `1.5px solid ${C.black}` : `3px solid ${C.black}`,
                background: cardMode === f.id ? C.pink : '#1a4a2e',
                color:      cardMode === f.id ? C.white : `${C.yellow}99`,
                boxShadow:  cardMode === f.id ? `3px 3px 0 ${C.black}` : 'none',
                transform:  cardMode === f.id ? 'translate(-2px,-2px)' : 'none',
                transition: 'all 0.1s',
              }}>
              {f.icon} {f.label}
            </button>
          ))}
        </motion.div>

        {/* ── Main Card ── */}
        <motion.div variants={item} style={{
          border: `3px solid ${C.black}`,
          boxShadow: `6px 6px 0 ${C.black}`,
          background: '#0f2d1a',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Card Header */}
          <div style={{
            background: C.black, padding: '8px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: `3px solid ${C.black}`,
          }}>
            <span style={{ fontFamily: 'monospace', color: C.yellow, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 }}>
              🌴 HACKER_HOUSE_GOA.sh
            </span>
            <span style={{ fontFamily: 'monospace', color: C.green, fontSize: 10, letterSpacing: 1 }}>
              {cardMode === 'pass' ? '[EVENT_BADGE]' : '[PFP_FRAME]'}
            </span>
          </div>

          <div style={{ padding: 18 }}>
            {/* Error */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  style={{
                    marginBottom: 14, padding: '8px 12px',
                    border: `2px solid ${C.pink}`, background: 'rgba(232,53,122,0.15)',
                    fontFamily: 'monospace', fontSize: 11, color: C.pink,
                    boxShadow: `3px 3px 0 ${C.pink}`,
                  }}>
                  {'>'} ERROR: {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            {!previewUrl ? (
              /* ── UPLOAD STATE ── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Dropzone */}
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `3px dashed ${isDragOver ? C.yellow : C.green}`,
                    background: isDragOver ? `${C.yellow}18` : 'rgba(11,104,57,0.12)',
                    padding: 28, textAlign: 'center', cursor: 'pointer',
                    minHeight: 160, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxShadow: isDragOver ? `4px 4px 0 ${C.yellow}` : `4px 4px 0 ${C.green}`,
                    transition: 'all 0.1s',
                  }}>
                  <input ref={fileInputRef} type="file" accept="image/*,.heic,.heif" style={{ display: 'none' }} onChange={handleFile} />
                  {isProcessing ? (
                    <>
                      <div style={{ fontFamily: 'monospace', color: C.yellow, fontSize: 13 }}>
                        {'>>> '}CONVERTING.HEIC → JPEG...
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[0,1,2,3,4].map(i => (
                          <div key={i} style={{
                            width: 8, height: 8, background: C.yellow,
                            animation: `bounce 0.6s ${i * 0.1}s ease-in-out infinite alternate`,
                          }} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{
                        width: 52, height: 52, border: `3px solid ${C.yellow}`,
                        background: 'rgba(254,225,1,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `4px 4px 0 ${C.black}`,
                      }}>
                        <Upload size={22} color={C.yellow} />
                      </div>
                      <div>
                        <p style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: 14, color: C.cream, margin: '0 0 3px' }}>
                          DROP_PHOTO() or TAP
                        </p>
                        <p style={{ fontFamily: 'monospace', fontSize: 10, color: `${C.cream}66`, margin: 0, letterSpacing: 1 }}>
                          ['jpg','png','heic','jpeg'].includes(format)
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Camera + Gallery buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    {
                      label: '[ TAKE PHOTO ]', icon: <Camera size={14} />,
                      onClick: () => {
                        const inp = document.createElement('input');
                        inp.type = 'file'; inp.accept = 'image/*';
                        inp.setAttribute('capture', 'environment');
                        inp.addEventListener('change', (e) => {
                          const f = e.target.files?.[0]; if (f) { onImageSelected(f); boom(); }
                        });
                        inp.click();
                      }
                    },
                    { label: '[ GALLERY ]', icon: <ImageIcon size={14} />, onClick: () => fileInputRef.current?.click() }
                  ].map(b => (
                    <button key={b.label} type="button" onClick={b.onClick}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '10px 8px', cursor: 'pointer',
                        fontFamily: 'monospace', fontSize: 11, fontWeight: 'bold', letterSpacing: 1,
                        color: C.yellow, background: '#0a1a0f',
                        border: `2px solid ${C.yellow}`,
                        boxShadow: `3px 3px 0 ${C.black}`,
                        transition: 'all 0.08s',
                      }}
                      onMouseEnter={e => { e.target.style.transform = 'translate(-2px,-2px)'; e.target.style.boxShadow = `5px 5px 0 ${C.black}`; }}
                      onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = `3px 3px 0 ${C.black}`; }}>
                      {b.icon}{b.label}
                    </button>
                  ))}
                </div>

                {/* Presets */}
                <div>
                  <p style={{ fontFamily: 'monospace', fontSize: 10, color: `${C.cream}55`, marginBottom: 8, letterSpacing: 1 }}>
                    {'>'} OR PICK 1-TAP AVATAR:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {PRESET_AVATARS.map(p => (
                      <motion.button key={p.id} whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} type="button"
                        onClick={() => handlePreset(p)}
                        style={{
                          padding: '10px 4px', cursor: 'pointer', textAlign: 'center',
                          background: '#0a1a0f',
                          border: `2px solid ${C.green}`,
                          boxShadow: `3px 3px 0 ${C.black}`,
                        }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: '50%', margin: '0 auto 6px',
                          background: `linear-gradient(135deg,${p.g1},${p.g2})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18, border: `2px solid ${C.black}`,
                        }}>{p.emoji}</div>
                        <span style={{ fontFamily: 'monospace', fontSize: 9, color: `${C.cream}90`, letterSpacing: 0.5, display: 'block' }}>{p.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

            ) : (
              /* ── CONTROLS STATE ── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Photo strip */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 10,
                  border: `2px solid ${C.green}`, background: '#0a1a0f',
                  boxShadow: `3px 3px 0 ${C.black}`,
                }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${C.yellow}`, flexShrink: 0, boxShadow: `3px 3px 0 ${C.black}` }}>
                    <img src={previewUrl} alt="Your photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: 13, color: C.cream, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name || 'YOUR_NAME'}</p>
                    <p style={{ fontFamily: 'monospace', fontSize: 10, color: C.yellow, margin: 0 }}>✦ {getBuilderTitle(stack)}</p>
                  </div>
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    style={{ padding: 6, cursor: 'pointer', background: '#0a1a0f', border: `2px solid ${C.yellow}`, color: C.yellow, boxShadow: `2px 2px 0 ${C.black}` }}>
                    <Camera size={14} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*,.heic,.heif" style={{ display: 'none' }} onChange={handleFile} />
                </div>

                {/* Fields */}
                {[
                  { id: 'name-f', label: '// NAME', value: name, setter: setName, type: 'text', max: 30, accent: C.yellow },
                ].map(f => (
                  <div key={f.id}>
                    <label htmlFor={f.id} style={{ display: 'block', fontFamily: 'monospace', fontSize: 10, fontWeight: 'bold', color: f.accent, marginBottom: 5, letterSpacing: 1, textTransform: 'uppercase' }}>{f.label}</label>
                    <input id={f.id} type="text" value={f.value} onChange={e => f.setter(e.target.value)}
                      placeholder="Enter your name" maxLength={f.max}
                      style={{
                        width: '100%', padding: '10px 12px', boxSizing: 'border-box',
                        fontFamily: 'monospace', fontSize: 14, fontWeight: 'bold',
                        background: '#0a0a0a', color: C.cream,
                        border: `2px solid ${f.accent}`, outline: 'none',
                        boxShadow: `3px 3px 0 ${C.black}`,
                        letterSpacing: 0.5,
                      }}
                    />
                  </div>
                ))}

                {/* Stack select */}
                <div>
                  <label htmlFor="stack-f" style={{ display: 'block', fontFamily: 'monospace', fontSize: 10, fontWeight: 'bold', color: C.yellow, marginBottom: 5, letterSpacing: 1, textTransform: 'uppercase' }}>// STACK / ROLE</label>
                  <select id="stack-f" value={stack} onChange={e => setStack(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px',
                      fontFamily: 'monospace', fontSize: 14,
                      background: '#0a0a0a', color: C.cream,
                      border: `2px solid ${C.yellow}`, outline: 'none', cursor: 'pointer',
                      boxShadow: `3px 3px 0 ${C.black}`,
                    }}>
                    {STACK_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Vibe select (pass only) */}
                {cardMode === 'pass' && (
                  <div>
                    <label htmlFor="vibe-f" style={{ display: 'block', fontFamily: 'monospace', fontSize: 10, fontWeight: 'bold', color: C.pink, marginBottom: 5, letterSpacing: 1, textTransform: 'uppercase' }}>// GOA VIBE ⚡</label>
                    <select id="vibe-f" value={funVibe} onChange={e => setFunVibe(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px',
                        fontFamily: 'monospace', fontSize: 13,
                        background: '#0a0a0a', color: C.pink,
                        border: `2px solid ${C.pink}`, outline: 'none', cursor: 'pointer',
                        boxShadow: `3px 3px 0 ${C.black}`,
                      }}>
                      {FUN_VIBES.map(v => <option key={v.value} value={v.label}>{v.label}</option>)}
                    </select>
                  </div>
                )}

                {/* Format */}
                <div>
                  <p style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 'bold', color: `${C.cream}70`, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>// EXPORT_FORMAT</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                    {[
                      { id: 'png',  label: '.PNG',  icon: '◈' },
                      { id: 'jpeg', label: '.JPG',  icon: '◈' },
                      { id: 'ics',  label: '.ICS',  icon: '◈' },
                    ].map(f => (
                      <button key={f.id} type="button" onClick={() => setFileFormat(f.id)}
                        style={{
                          padding: '10px 4px', cursor: 'pointer', textAlign: 'center',
                          fontFamily: 'monospace', fontSize: 11, fontWeight: 'bold',
                          border: `2px solid ${fileFormat === f.id ? C.yellow : `${C.cream}30`}`,
                          background: fileFormat === f.id ? C.yellow : 'transparent',
                          color: fileFormat === f.id ? C.black : `${C.cream}55`,
                          boxShadow: fileFormat === f.id ? `3px 3px 0 ${C.black}` : 'none',
                          transition: 'all 0.1s',
                        }}>
                        {f.icon} {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer status bar */}
            <div style={{
              marginTop: 14, paddingTop: 10,
              borderTop: `2px solid rgba(11,104,57,0.4)`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: `${C.cream}40`, display: 'flex', alignItems: 'center', gap: 5 }}>
                <QrCode size={12} color={C.yellow} /> QR_LINKED
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: C.pink, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={12} /> #001
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Actions ── */}
        <AnimatePresence>
          {previewUrl && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                {/* Download */}
                <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} onClick={onDownload} type="button"
                  style={{
                    flex: 1, padding: '14px 12px', cursor: 'pointer',
                    fontFamily: 'monospace', fontWeight: 900, fontSize: 13,
                    background: C.yellow, color: C.black, letterSpacing: 1,
                    border: `3px solid ${C.black}`,
                    boxShadow: `5px 5px 0 ${C.black}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}>
                  {downloadSuccess ? <><Check size={16} /> DOWNLOADED!</> : <><Download size={16} /> DOWNLOAD.{fileFormat.toUpperCase()}</>}
                </motion.button>

                {/* Share */}
                <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} onClick={onShare} type="button"
                  style={{
                    flex: 1, padding: '14px 12px', cursor: 'pointer',
                    fontFamily: 'monospace', fontWeight: 900, fontSize: 13,
                    background: C.pink, color: C.white, letterSpacing: 1,
                    border: `3px solid ${C.black}`,
                    boxShadow: `5px 5px 0 ${C.black}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}>
                  <Share2 size={16} /> POST_X
                </motion.button>
              </div>

              {fileFormat !== 'ics' && (
                <div style={{ textAlign: 'center' }}>
                  <button type="button" onClick={onOpenInNewTab}
                    style={{ fontFamily: 'monospace', fontSize: 11, color: C.yellow, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <ExternalLink size={11} /> open in new tab → right-click to save
                  </button>
                </div>
              )}

              <div style={{ textAlign: 'center' }}>
                <button type="button" onClick={onReset}
                  style={{ fontFamily: 'monospace', fontSize: 11, color: `${C.cream}50`, background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <RefreshCw size={11} /> reset --hard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ticker keyframes */}
        <style>{`
          @keyframes scroll-left {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes bounce {
            0%   { transform: scaleY(1); }
            100% { transform: scaleY(1.8); }
          }
        `}</style>
      </motion.div>
    </main>
  );
}
