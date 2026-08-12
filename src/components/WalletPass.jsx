import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Download, Share2, RefreshCw, Sparkles, Check,
  QrCode, Layers, Frame, FileImage,
  Calendar, Camera, Zap, ShieldCheck, ExternalLink, UserCheck, Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STACK_OPTIONS, FUN_VIBES, getBuilderTitle } from '../utils/titles';

// ── HH Goa 2026 Colours (exact brand) ─────────────────────────────
const HH = {
  green:      '#0b6839',  // HH Goa official green
  greenDark:  '#084d2a',  // darker shade
  greenMid:   '#0d7d44',  // mid for layering
  yellow:     '#fee101',  // HH Goa official yellow
  pink:       '#E8357A',  // hot pink accent
  black:      '#0F0F0F',
  cream:      '#F5F0E0',
};

// Preset quick-avatars
const PRESET_AVATARS = [
  { id: 'sunset', name: 'Goa Sunset', emoji: '🌴', g1: '#E8C84A', g2: '#E8357A' },
  { id: 'cyber',  name: 'Build Mode', emoji: '⚡', g1: '#3A7A3C', g2: '#E8C84A' },
  { id: 'hacker', name: 'Night Ship', emoji: '🛠️',  g1: '#E8357A', g2: '#1E4220' }
];

function generatePresetDataUrl(preset) {
  const c = document.createElement('canvas');
  c.width = 400; c.height = 400;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 400, 400);
  g.addColorStop(0, preset.g1);
  g.addColorStop(1, preset.g2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 400, 400);
  ctx.font = 'bold 160px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(preset.emoji, 200, 200);
  return c.toDataURL('image/png');
}

const container = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.07 } }
};
const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 340, damping: 26 } }
};

export function WalletPass({
  previewUrl, name, setName, stack, setStack, funVibe, setFunVibe,
  cardMode, setCardMode, fileFormat, setFileFormat,
  onImageSelected, onDownload, onOpenInNewTab, onShare, onReset,
  isProcessing, downloadSuccess, errorMsg
}) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const boom = () => confetti({
    particleCount: 55, spread: 65, origin: { y: 0.82 },
    colors: [HH.yellow, HH.pink, '#ffffff', HH.cream]
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
      style={{ background: `linear-gradient(160deg, ${HH.greenDark} 0%, ${HH.green} 60%, ${HH.greenMid} 100%)` }}
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${HH.yellow}1A 0%, transparent 70%)` }} />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${HH.pink}18 0%, transparent 70%)` }} />

      <motion.div variants={container} initial="hidden" animate="visible" className="w-full relative z-10">

        {/* ── App Header ── */}
        <motion.div variants={item} className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono-custom font-bold uppercase tracking-widest mb-3"
            style={{ background: `${HH.yellow}22`, borderColor: `${HH.yellow}55`, color: HH.yellow }}>
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            Hacker House GOA 2026
          </div>
          <h1 className="font-display-custom text-3xl font-extrabold tracking-tight" style={{ color: HH.cream }}>
            BUILDER CREDENTIAL
          </h1>
          <p className="text-xs font-mono-custom mt-1" style={{ color: `${HH.cream}99` }}>
            Generate your event card &amp; X profile frame
          </p>
        </motion.div>

        {/* ── Format Toggle ── */}
        <motion.div variants={item}
          className="w-full p-1.5 rounded-2xl flex gap-1.5 mb-4 border"
          style={{ background: `${HH.black}cc`, borderColor: `${HH.yellow}30` }}
        >
          {[
            { id: 'pass',  icon: <Layers className="w-3.5 h-3.5" />,  label: 'Format A: Builder Pass', active: HH.yellow, textActive: HH.black },
            { id: 'frame', icon: <Frame className="w-3.5 h-3.5" />,   label: 'Format B: PFP Frame',    active: HH.pink,   textActive: '#fff' }
          ].map(f => (
            <button key={f.id} type="button" onClick={() => setCardMode(f.id)}
              className="flex-1 py-2.5 px-2 rounded-xl font-mono-custom text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
              style={cardMode === f.id
                ? { background: f.active, color: f.textActive, boxShadow: `0 4px 18px ${f.active}55` }
                : { background: 'transparent', color: `${HH.cream}66` }
              }>
              {f.icon}{f.label}
            </button>
          ))}
        </motion.div>

        {/* ── Main Card ── */}
        <motion.div variants={item} layout
          className="w-full rounded-[26px] p-5 border relative overflow-hidden"
          style={{ background: `${HH.greenDark}ee`, borderColor: `${HH.yellow}50`, backdropFilter: 'blur(16px)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
        >
          {/* Card header */}
          <div className="flex items-center justify-between border-b pb-4 mb-4" style={{ borderColor: `${HH.yellow}22` }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌴</span>
              <div>
                <p className="font-display-custom font-bold text-sm" style={{ color: HH.cream }}>HACKER HOUSE GOA</p>
                <p className="font-mono-custom text-[10px]" style={{ color: `${HH.cream}55` }}>28–31 OCT 2026 · GOA, INDIA</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full font-mono-custom text-[11px] font-bold uppercase flex items-center gap-1.5"
              style={{ background: `${HH.yellow}20`, border: `1px solid ${HH.yellow}50`, color: HH.yellow }}>
              <UserCheck className="w-3 h-3" />
              {cardMode === 'pass' ? 'EVENT BADGE' : 'PFP FRAME'}
            </div>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="mb-4 px-3.5 py-2.5 rounded-xl text-xs font-mono-custom"
                style={{ background: `${HH.pink}20`, border: `1px solid ${HH.pink}50`, color: HH.pink }}>
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Upload State ── */}
          {!previewUrl ? (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

              {/* Dropzone */}
              <motion.div
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer flex flex-col items-center gap-3 min-h-[200px] justify-center transition-all"
                style={{ borderColor: isDragOver ? HH.yellow : `${HH.yellow}40`, background: isDragOver ? `${HH.yellow}12` : `${HH.greenMid}20` }}
              >
                {/* Hidden file inputs */}
                {/* Primary: gallery/file picker (works on all platforms) */}
                <input ref={fileInputRef} type="file" accept="image/*,.heic,.heif" className="hidden" onChange={handleFile} />

                {isProcessing ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${HH.yellow}80`, borderTopColor: 'transparent' }} />
                    <p className="text-xs font-mono-custom" style={{ color: HH.yellow }}>Converting photo…</p>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center border group-hover:scale-110 transition-transform"
                      style={{ background: `${HH.yellow}18`, borderColor: `${HH.yellow}40`, color: HH.yellow }}>
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-display-custom font-bold text-base" style={{ color: HH.cream }}>Drop photo or tap to browse</p>
                      <p className="font-mono-custom text-xs mt-1" style={{ color: `${HH.cream}66` }}>JPG · PNG · HEIC (iPhone)</p>
                    </div>
                  </>
                )}
              </motion.div>

              {/* Mobile: separate "Camera" and "Gallery" buttons for iOS/Android */}
              <div className="grid grid-cols-2 gap-2">
                <button type="button"
                  onClick={() => {
                    // On iOS/Android, `capture=environment` opens camera directly
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.setAttribute('capture', 'environment'); // rear camera
                    input.addEventListener('change', (e) => { const f = e.target.files?.[0]; if (f) { onImageSelected(f); boom(); } });
                    input.click();
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-mono-custom text-xs font-bold border transition-all cursor-pointer"
                  style={{ background: `${HH.greenMid}40`, borderColor: `${HH.yellow}30`, color: HH.yellow }}
                >
                  <Camera className="w-4 h-4" />
                  Take Photo
                </button>
                <button type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-mono-custom text-xs font-bold border transition-all cursor-pointer"
                  style={{ background: `${HH.greenMid}40`, borderColor: `${HH.yellow}30`, color: HH.yellow }}
                >
                  <ImageIcon className="w-4 h-4" />
                  Choose from Gallery
                </button>
              </div>

              {/* Preset Avatars */}
              <div>
                <p className="font-mono-custom text-[11px] mb-2 flex items-center gap-1" style={{ color: `${HH.cream}60` }}>
                  <Sparkles className="w-3 h-3" style={{ color: HH.yellow }} />
                  Or pick a 1-tap avatar:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AVATARS.map(p => (
                    <motion.button key={p.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button"
                      onClick={() => handlePreset(p)}
                      className="py-2 px-2 rounded-xl text-center cursor-pointer border transition-all"
                      style={{ background: `${HH.greenMid}30`, borderColor: `${HH.yellow}25` }}>
                      <div className="w-9 h-9 rounded-full mx-auto mb-1 flex items-center justify-center text-base shadow-md"
                        style={{ background: `linear-gradient(135deg, ${p.g1}, ${p.g2})` }}>
                        {p.emoji}
                      </div>
                      <span className="font-mono-custom text-[10px] truncate block" style={{ color: `${HH.cream}90` }}>{p.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

          ) : (
            /* ── Controls State ── */
            <motion.div key="controls" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

              {/* Photo + name preview strip */}
              <div className="flex items-center gap-3 p-3 rounded-2xl border" style={{ background: `${HH.greenMid}25`, borderColor: `${HH.yellow}20` }}>
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: HH.yellow }}>
                  <img src={previewUrl} alt="Your photo" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display-custom font-bold text-sm truncate" style={{ color: HH.cream }}>{name || 'YOUR NAME'}</p>
                  <p className="font-mono-custom text-xs mt-0.5 truncate" style={{ color: HH.yellow }}>✦ {getBuilderTitle(stack)}</p>
                </div>
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl cursor-pointer transition-all"
                  style={{ background: `${HH.yellow}18`, color: HH.yellow }}
                  title="Change photo">
                  <Camera className="w-4 h-4" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*,.heic,.heif" className="hidden" onChange={handleFile} />
              </div>

              {/* Form fields */}
              <div className="space-y-3">
                {/* Name */}
                <div>
                  <label htmlFor="name-field" className="block font-mono-custom text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: HH.yellow }}>Your Name</label>
                  <input id="name-field" type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Enter your name" maxLength={30}
                    className="w-full rounded-xl px-3.5 py-2.5 font-mono-custom text-sm border outline-none transition-all"
                    style={{ background: `${HH.black}70`, borderColor: `${HH.yellow}30`, color: HH.cream,
                      fontSize: '16px' /* prevents iOS zoom */ }}
                    onFocus={e => e.target.style.borderColor = HH.yellow}
                    onBlur={e => e.target.style.borderColor = `${HH.yellow}30`}
                  />
                </div>

                {/* Stack */}
                <div>
                  <label htmlFor="stack-field" className="block font-mono-custom text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: HH.yellow }}>Stack / Role</label>
                  <select id="stack-field" value={stack} onChange={e => setStack(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 font-mono-custom text-sm border outline-none cursor-pointer"
                    style={{ background: HH.greenDark, borderColor: `${HH.yellow}30`, color: HH.cream, fontSize: '16px' }}>
                    {STACK_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Vibe (only for Builder Pass) */}
                {cardMode === 'pass' && (
                  <div>
                    <label htmlFor="vibe-field" className="block font-mono-custom text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: HH.pink }}>Goa Vibe ⚡</label>
                    <select id="vibe-field" value={funVibe} onChange={e => setFunVibe(e.target.value)}
                      className="w-full rounded-xl px-3.5 py-2.5 font-mono-custom text-sm border outline-none cursor-pointer"
                      style={{ background: HH.greenDark, borderColor: `${HH.pink}40`, color: HH.pink, fontSize: '16px' }}>
                      {FUN_VIBES.map(v => <option key={v.value} value={v.label}>{v.label}</option>)}
                    </select>
                  </div>
                )}

                {/* Export format */}
                <div>
                  <p className="font-mono-custom text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: `${HH.cream}70` }}>Export Format</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'png',  label: 'PNG', icon: <FileImage className="w-4 h-4" /> },
                      { id: 'jpeg', label: 'JPG', icon: <FileImage className="w-4 h-4" /> },
                      { id: 'ics',  label: 'ICS', icon: <Calendar className="w-4 h-4" /> },
                    ].map(f => (
                      <button key={f.id} type="button" onClick={() => setFileFormat(f.id)}
                        className="py-2.5 px-2 rounded-xl font-mono-custom text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer border-2"
                        style={fileFormat === f.id
                          ? { background: `${HH.yellow}25`, borderColor: HH.yellow, color: HH.yellow }
                          : { background: 'transparent', borderColor: `${HH.cream}18`, color: `${HH.cream}55` }}>
                        {f.icon}{f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <div className="mt-4 pt-3 border-t flex items-center justify-between font-mono-custom text-[11px]" style={{ borderColor: `${HH.yellow}18`, color: `${HH.cream}40` }}>
            <span className="flex items-center gap-1.5"><QrCode className="w-3.5 h-3.5" style={{ color: HH.yellow }} />QR Credential Linked</span>
            <span className="font-bold flex items-center gap-1" style={{ color: HH.pink }}><ShieldCheck className="w-3.5 h-3.5" />#001</span>
          </div>
        </motion.div>

        {/* ── Action Buttons (appear after upload) ── */}
        <AnimatePresence>
          {previewUrl && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
              className="w-full mt-5 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Download */}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onDownload} type="button"
                  className="flex-1 font-display-custom font-extrabold text-sm py-4 px-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${HH.yellow}, #F0D060)`, color: HH.greenDark, boxShadow: `0 8px 28px ${HH.yellow}45` }}>
                  {downloadSuccess
                    ? <><Check className="w-4 h-4" />Downloaded!</>
                    : <><Download className="w-4 h-4" />Download .{fileFormat === 'jpeg' ? 'JPG' : fileFormat.toUpperCase()}</>
                  }
                </motion.button>

                {/* Share */}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onShare} type="button"
                  className="flex-1 font-display-custom font-extrabold text-sm py-4 px-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer border-2"
                  style={{ background: 'transparent', borderColor: `${HH.cream}35`, color: HH.cream }}>
                  <Share2 className="w-4 h-4" />Share on X
                </motion.button>
              </div>

              {/* Open in new tab link */}
              {fileFormat !== 'ics' && (
                <div className="text-center">
                  <button type="button" onClick={onOpenInNewTab}
                    className="inline-flex items-center gap-1.5 font-mono-custom text-xs cursor-pointer underline underline-offset-2"
                    style={{ color: HH.yellow }}>
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open full image in new tab (right-click to save)
                  </button>
                </div>
              )}

              {/* Reset */}
              <div className="text-center">
                <button type="button" onClick={onReset}
                  className="inline-flex items-center gap-1.5 font-mono-custom text-xs cursor-pointer"
                  style={{ color: `${HH.cream}50` }}>
                  <RefreshCw className="w-3.5 h-3.5" />Start over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </main>
  );
}
