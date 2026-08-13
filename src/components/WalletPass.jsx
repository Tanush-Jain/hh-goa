import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Download, Share2, RefreshCw, Sparkles, Check,
  QrCode, Layers, Frame, Camera, ShieldCheck, ExternalLink,
  UserCheck, Image as ImageIcon, Zap, ArrowLeft, Scan
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STACK_OPTIONS, FUN_VIBES, getBuilderTitle } from '../utils/titles';

// ── HH Goa 2026 Colours (exact brand) ─────────────────────────────
const HH = {
  green:      '#0b6839',
  greenDark:  '#084d2a',
  greenMid:   '#0d7d44',
  yellow:     '#fee101',
  pink:       '#E8357A',
  black:      '#0F0F0F',
  cream:      '#F5F0E0',
};

// Preset quick-avatars
const PRESET_AVATARS = [
  { id: 'sunset', name: 'Goa Sunset', emoji: '🌅', g1: '#E8C84A', g2: '#E8357A' },
  { id: 'cyber',  name: 'Build Mode', emoji: '⚡', g1: '#3A7A3C', g2: '#E8C84A' },
  { id: 'hacker', name: 'Night Ship', emoji: '🛠️', g1: '#E8357A', g2: '#1E4220' },
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

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 340, damping: 26 } },
};

export function WalletPass({
  previewUrl, name, setName, stack, setStack, funVibe, setFunVibe,
  threeWords = '', setThreeWords = () => {},
  cardMode, setCardMode, fileFormat, setFileFormat,
  onImageSelected, onDownload, onOpenInNewTab, onShare, onReset,
  isProcessing, downloadSuccess, errorMsg,
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver]   = useState(false);
  const [step, setStep]               = useState(1); // Step 1: Upload, Step 2: Form Inputs
  const [isScanning, setIsScanning]   = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // Sync format strictly to 'png'
  useEffect(() => {
    if (fileFormat !== 'png') {
      setFileFormat('png');
    }
  }, [fileFormat, setFileFormat]);

  // If previewUrl is cleared (e.g. on reset), revert to Step 1
  useEffect(() => {
    if (!previewUrl) {
      setStep(1);
      setIsScanning(false);
      setScanComplete(false);
    }
  }, [previewUrl]);

  const boom = () => confetti({
    particleCount: 60, spread: 70, origin: { y: 0.8 },
    colors: [HH.yellow, HH.pink, '#ffffff', HH.cream],
  });

  // Handle uploaded image file with human face validation simulation
  const handleUserPhoto = (file) => {
    if (!file) return;
    onImageSelected(file);
    setIsScanning(true);
    setScanComplete(false);

    // 1.5 second simulated face scan delay
    setTimeout(() => {
      setScanComplete(true);
      boom();
      // 0.5s transition to Step 2
      setTimeout(() => {
        setIsScanning(false);
        setStep(2);
      }, 500);
    }, 1500);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleUserPhoto(f);
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      handleUserPhoto(f);
      e.target.value = '';
    }
  };

  // 1-Tap avatar bypasses face scan and goes straight to Step 2
  const handleAvatarClick = (preset) => {
    const url = generatePresetDataUrl(preset);
    const img = new Image();
    img.onload = () => {
      onImageSelected(null, { img, dataUrl: url });
      boom();
      setIsScanning(false);
      setScanComplete(false);
      setStep(2);
    };
    img.src = url;
  };

  // Mandatory fields check
  const isFormValid =
    previewUrl !== '' &&
    name.trim() !== '' &&
    stack !== '' &&
    threeWords.trim() !== '' &&
    (cardMode === 'frame' || funVibe !== '');

  return (
    <main
      className="w-full max-w-[480px] mx-auto min-h-screen px-4 py-8 flex flex-col justify-center items-center relative"
      style={{ background: 'transparent' }}
    >
      {/* Ambient soft glow blobs */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${HH.yellow}18 0%, transparent 70%)` }}
      />
      <div
        className="absolute bottom-1/4 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${HH.pink}14 0%, transparent 70%)` }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full relative z-10"
      >
        {/* ── App Header ── */}
        <motion.div variants={itemVariants} className="text-center mb-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono-custom font-bold uppercase tracking-widest mb-3"
            style={{ background: `${HH.yellow}18`, borderColor: `${HH.yellow}40`, color: HH.yellow }}
          >
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
        <motion.div
          variants={itemVariants}
          className="w-full p-1.5 rounded-2xl flex gap-1.5 mb-4 border"
          style={{ background: 'rgba(0,0,0,0.35)', borderColor: `${HH.yellow}30`, backdropFilter: 'blur(12px)' }}
        >
          {[
            { id: 'pass',  icon: <Layers className="w-3.5 h-3.5" />,  label: 'Format A: Builder Pass', active: HH.yellow, textActive: HH.black },
            { id: 'frame', icon: <Frame className="w-3.5 h-3.5" />,   label: 'Format B: PFP Frame',    active: HH.pink,   textActive: '#fff'   },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setCardMode(f.id)}
              className="flex-1 py-2.5 px-2 rounded-xl font-mono-custom text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
              style={
                cardMode === f.id
                  ? { background: f.active, color: f.textActive, boxShadow: `0 4px 16px ${f.active}40` }
                  : { background: 'transparent', color: `${HH.cream}66` }
              }
            >
              {f.icon}{f.label}
            </button>
          ))}
        </motion.div>

        {/* ── Step Progress Indicator ── */}
        <div className="flex items-center justify-between mb-3 px-2 font-mono-custom text-xs">
          <span style={{ color: HH.yellow }} className="font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: HH.yellow }} />
            STEP {step} OF 2: {step === 1 ? 'UPLOAD PHOTO' : 'BUILDER INFO'}
          </span>
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-[11px] underline cursor-pointer"
              style={{ color: `${HH.cream}75` }}
            >
              <ArrowLeft className="w-3 h-3" /> Change Photo
            </button>
          )}
        </div>

        {/* ── Main Glass Card ── */}
        <motion.div
          variants={itemVariants}
          layout
          className="w-full rounded-[26px] p-5 border relative overflow-hidden"
          style={{
            background: 'rgba(8, 55, 30, 0.38)',
            borderColor: 'rgba(254, 225, 1, 0.35)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(254,225,1,0.15)',
          }}
        >
          {/* Card Header */}
          <div
            className="flex items-center justify-between border-b pb-3.5 mb-4"
            style={{ borderColor: 'rgba(254,225,1,0.18)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🌴</span>
              <div>
                <p className="font-display-custom font-bold text-sm" style={{ color: HH.cream }}>HACKER HOUSE GOA</p>
                <p className="font-mono-custom text-[10px]" style={{ color: `${HH.cream}55` }}>28–31 OCT 2026 · GOA, INDIA</p>
              </div>
            </div>
            <div
              className="px-3 py-1 rounded-full font-mono-custom text-[11px] font-bold uppercase flex items-center gap-1.5"
              style={{ background: `${HH.yellow}20`, border: `1px solid ${HH.yellow}40`, color: HH.yellow }}
            >
              <UserCheck className="w-3 h-3" />
              {cardMode === 'pass' ? 'EVENT BADGE' : 'PFP FRAME'}
            </div>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 px-3.5 py-2.5 rounded-xl text-xs font-mono-custom"
                style={{ background: `${HH.pink}20`, border: `1px solid ${HH.pink}50`, color: HH.pink }}
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════════════════════════════════════════════════════════
             STEP 1: PHOTO UPLOAD & AVATAR SELECTION
             ═══════════════════════════════════════════════════════════ */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {isScanning ? (
                  /* ── Face Scan Validation State ── */
                  <div className="flex flex-col items-center justify-center p-6 min-h-[220px] relative rounded-2xl border border-dashed"
                    style={{ background: `${HH.greenMid}25`, borderColor: HH.yellow }}>
                    
                    {/* Image with laser scan animation */}
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 relative shadow-lg"
                      style={{ borderColor: HH.yellow }}>
                      <img src={previewUrl} alt="Scanning target" className="w-full h-full object-cover" />
                      
                      {!scanComplete && (
                        <motion.div
                          animate={{ y: [0, 96, 0] }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                          className="absolute top-0 left-0 right-0 h-1 bg-yellow-300 shadow-[0_0_12px_#fee101]"
                        />
                      )}
                    </div>

                    <div className="mt-4 text-center">
                      {!scanComplete ? (
                        <div className="flex items-center justify-center gap-2 font-mono-custom text-xs font-bold"
                          style={{ color: HH.yellow }}>
                          <Scan className="w-4 h-4 animate-spin" />
                          <span>Scanning for human face...</span>
                        </div>
                      ) : (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                          className="flex items-center justify-center gap-2 font-mono-custom text-xs font-bold"
                          style={{ color: '#4ADE80' }}>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Face Detected ✓</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* ── Dropzone & Upload Buttons ── */
                  <>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer flex flex-col items-center gap-3 min-h-[190px] justify-center transition-all"
                      style={{
                        borderColor: isDragOver ? HH.yellow : `${HH.yellow}40`,
                        background: isDragOver ? `${HH.yellow}12` : `${HH.greenMid}18`,
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.heic,.heif"
                        className="hidden"
                        onChange={handleFile}
                      />

                      {isProcessing ? (
                        <div className="flex flex-col items-center gap-3">
                          <div
                            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
                            style={{ borderColor: `${HH.yellow}80`, borderTopColor: 'transparent' }}
                          />
                          <p className="text-xs font-mono-custom" style={{ color: HH.yellow }}>Processing photo…</p>
                        </div>
                      ) : (
                        <>
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center border"
                            style={{ background: `${HH.yellow}18`, borderColor: `${HH.yellow}40`, color: HH.yellow }}
                          >
                            <Upload className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-display-custom font-bold text-base" style={{ color: HH.cream }}>
                              Drop photo or tap to browse
                            </p>
                            <p className="font-mono-custom text-xs mt-1" style={{ color: `${HH.cream}66` }}>
                              JPG · PNG · HEIC (iPhone)
                            </p>
                          </div>
                        </>
                      )}
                    </motion.div>

                    {/* Camera & Gallery Spring Buttons with animated icons */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        type="button"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.setAttribute('capture', 'environment');
                          input.addEventListener('change', (e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUserPhoto(f);
                          });
                          input.click();
                        }}
                        className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-mono-custom text-xs font-bold border transition-all cursor-pointer shadow-sm"
                        style={{ background: `${HH.greenMid}35`, borderColor: `${HH.yellow}35`, color: HH.yellow }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.12, 1], rotate: [0, 6, -6, 0] }}
                          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        >
                          <Camera className="w-4 h-4" />
                        </motion.div>
                        <span>Take Photo</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-mono-custom text-xs font-bold border transition-all cursor-pointer shadow-sm"
                        style={{ background: `${HH.greenMid}35`, borderColor: `${HH.yellow}35`, color: HH.yellow }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.08, 1], y: [0, -2, 0] }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                        >
                          <ImageIcon className="w-4 h-4" />
                        </motion.div>
                        <span>Choose Gallery</span>
                      </motion.button>
                    </div>

                    {/* Animated 1-Tap Avatars */}
                    <div className="pt-1">
                      <p className="font-mono-custom text-[11px] mb-2.5 flex items-center gap-1.5" style={{ color: `${HH.cream}75` }}>
                        <Sparkles className="w-3.5 h-3.5" style={{ color: HH.yellow }} />
                        Or pick an animated 1-tap avatar:
                      </p>
                      <div className="grid grid-cols-3 gap-2.5">
                        {PRESET_AVATARS.map((p, index) => (
                          <motion.button
                            key={p.id}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 2.8 + index * 0.4, ease: 'easeInOut' }}
                            whileHover={{ scale: 1.08, y: -7 }}
                            whileTap={{ scale: 0.94 }}
                            type="button"
                            onClick={() => handleAvatarClick(p)}
                            className="py-2.5 px-2 rounded-xl text-center cursor-pointer border transition-all shadow-md"
                            style={{ background: `${HH.greenMid}35`, borderColor: `${HH.yellow}30` }}
                          >
                            <div
                              className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center text-lg shadow-sm"
                              style={{ background: `linear-gradient(135deg, ${p.g1}, ${p.g2})` }}
                            >
                              {p.emoji}
                            </div>
                            <span className="font-mono-custom text-[10px] font-bold truncate block" style={{ color: `${HH.cream}90` }}>
                              {p.name}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════════════════════════════════════════════════════════
             STEP 2: FORM INPUTS & CUSTOMIZATION (Mandatory Fields)
             ═══════════════════════════════════════════════════════════ */}
          <AnimatePresence mode="wait">
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {/* Photo + Name Preview Strip */}
                <div
                  className="flex items-center gap-3 p-3 rounded-2xl border"
                  style={{ background: `${HH.greenMid}25`, borderColor: `${HH.yellow}25` }}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 shrink-0 shadow-sm" style={{ borderColor: HH.yellow }}>
                    <img src={previewUrl} alt="Your avatar preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display-custom font-bold text-sm truncate" style={{ color: name ? HH.cream : `${HH.cream}50` }}>
                      {name || 'ENTER YOUR NAME'}
                    </p>
                    <p className="font-mono-custom text-xs mt-0.5 truncate" style={{ color: stack ? HH.yellow : `${HH.yellow}60` }}>
                      ✦ {stack ? getBuilderTitle(stack) : 'Select Stack below'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="p-2 rounded-xl cursor-pointer transition-all border"
                    style={{ background: `${HH.yellow}15`, borderColor: `${HH.yellow}40`, color: HH.yellow }}
                    title="Change photo / avatar"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Mandatory Form Fields */}
                <div className="space-y-3.5">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="name-field"
                      className="block font-mono-custom text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between"
                      style={{ color: HH.yellow }}
                    >
                      <span>Your Name <span className="text-red-400">*</span></span>
                      {name.trim() !== '' && <Check className="w-3.5 h-3.5 text-green-400" />}
                    </label>
                    <input
                      id="name-field"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Satoshi Nakamoto"
                      maxLength={30}
                      className="w-full rounded-xl px-3.5 py-2.5 font-mono-custom text-sm border outline-none transition-all"
                      style={{
                        background: 'rgba(0,0,0,0.35)',
                        borderColor: name.trim() !== '' ? HH.yellow : 'rgba(254,225,1,0.25)',
                        color: HH.cream,
                        fontSize: '16px',
                      }}
                      onFocus={e => e.target.style.borderColor = HH.yellow}
                      onBlur={e => e.target.style.borderColor = name.trim() !== '' ? HH.yellow : 'rgba(254,225,1,0.25)'}
                    />
                  </div>

                  {/* Stack / Role Select */}
                  <div>
                    <label
                      htmlFor="stack-field"
                      className="block font-mono-custom text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between"
                      style={{ color: HH.yellow }}
                    >
                      <span>Stack / Role <span className="text-red-400">*</span></span>
                      {stack !== '' && <Check className="w-3.5 h-3.5 text-green-400" />}
                    </label>
                    <select
                      id="stack-field"
                      value={stack}
                      onChange={e => setStack(e.target.value)}
                      className="w-full rounded-xl px-3.5 py-2.5 font-mono-custom text-sm border outline-none cursor-pointer"
                      style={{
                        background: HH.greenDark,
                        borderColor: stack !== '' ? HH.yellow : 'rgba(254,225,1,0.25)',
                        color: stack !== '' ? HH.cream : `${HH.cream}60`,
                        fontSize: '16px',
                      }}
                    >
                      <option value="">-- Select your stack / role --</option>
                      {STACK_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>

                  {/* Describe yourself in 3 words (Mandatory) */}
                  <div>
                    <label
                      htmlFor="words-field"
                      className="block font-mono-custom text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between"
                      style={{ color: HH.yellow }}
                    >
                      <span>Describe yourself in 3 words <span className="text-red-400">*</span></span>
                      {threeWords.trim() !== '' && <Check className="w-3.5 h-3.5 text-green-400" />}
                    </label>
                    <input
                      id="words-field"
                      type="text"
                      value={threeWords}
                      onChange={e => setThreeWords(e.target.value)}
                      placeholder="Fast, Curious, Based"
                      maxLength={30}
                      className="w-full rounded-xl px-3.5 py-2.5 font-mono-custom text-sm border outline-none transition-all"
                      style={{
                        background: 'rgba(0,0,0,0.35)',
                        borderColor: threeWords.trim() !== '' ? HH.yellow : 'rgba(254,225,1,0.25)',
                        color: HH.cream,
                        fontSize: '16px',
                      }}
                      onFocus={e => e.target.style.borderColor = HH.yellow}
                      onBlur={e => e.target.style.borderColor = threeWords.trim() !== '' ? HH.yellow : 'rgba(254,225,1,0.25)'}
                    />
                  </div>

                  {/* Goa Vibe Select (Required for Pass Mode) */}
                  {cardMode === 'pass' && (
                    <div>
                      <label
                        htmlFor="vibe-field"
                        className="block font-mono-custom text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between"
                        style={{ color: HH.pink }}
                      >
                        <span>Goa Vibe ⚡ <span className="text-red-400">*</span></span>
                        {funVibe !== '' && <Check className="w-3.5 h-3.5 text-green-400" />}
                      </label>
                      <select
                        id="vibe-field"
                        value={funVibe}
                        onChange={e => setFunVibe(e.target.value)}
                        className="w-full rounded-xl px-3.5 py-2.5 font-mono-custom text-sm border outline-none cursor-pointer"
                        style={{
                          background: HH.greenDark,
                          borderColor: funVibe !== '' ? HH.pink : 'rgba(232,53,122,0.3)',
                          color: funVibe !== '' ? HH.pink : `${HH.pink}80`,
                          fontSize: '16px',
                        }}
                      >
                        <option value="">-- Select your Goa vibe --</option>
                        {FUN_VIBES.map(v => <option key={v.value} value={v.label}>{v.label}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div
            className="mt-4 pt-3 border-t flex items-center justify-between font-mono-custom text-[11px]"
            style={{ borderColor: 'rgba(254,225,1,0.15)', color: `${HH.cream}40` }}
          >
            <span className="flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5" style={{ color: HH.yellow }} />
              QR Credential Linked
            </span>
            <span className="font-bold flex items-center gap-1" style={{ color: HH.pink }}>
              <ShieldCheck className="w-3.5 h-3.5" />#001
            </span>
          </div>
        </motion.div>

        {/* ── Action Buttons (Download & Share) ── */}
        <AnimatePresence>
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="w-full mt-4 space-y-3"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Generate / Download Button — STRICTLY DISABLED UNTIL ALL MANDATORY FIELDS ARE VALID */}
                <motion.button
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.97 } : {}}
                  onClick={onDownload}
                  disabled={!isFormValid}
                  type="button"
                  className={`flex-1 font-display-custom font-extrabold text-sm py-4 px-5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    isFormValid ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                  style={{
                    background: isFormValid
                      ? `linear-gradient(135deg, ${HH.yellow}, #F0D060)`
                      : 'rgba(254,225,1,0.25)',
                    color: isFormValid ? HH.greenDark : `${HH.cream}60`,
                    boxShadow: isFormValid ? `0 8px 28px ${HH.yellow}45` : 'none',
                  }}
                >
                  {downloadSuccess ? (
                    <><Check className="w-4 h-4" />Downloaded!</>
                  ) : (
                    <><Download className="w-4 h-4" />Download .PNG</>
                  )}
                </motion.button>

                {/* Share on X */}
                <motion.button
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.97 } : {}}
                  onClick={onShare}
                  disabled={!isFormValid}
                  type="button"
                  className={`flex-1 font-display-custom font-extrabold text-sm py-4 px-5 rounded-xl flex items-center justify-center gap-2 border-2 transition-all ${
                    isFormValid ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                  }`}
                  style={{
                    background: 'transparent',
                    borderColor: isFormValid ? `${HH.cream}45` : `${HH.cream}15`,
                    color: HH.cream,
                  }}
                >
                  <Share2 className="w-4 h-4" />Share on X
                </motion.button>
              </div>

              {!isFormValid && (
                <p className="text-center font-mono-custom text-[11px]" style={{ color: `${HH.yellow}80` }}>
                  ⚠️ Fill in Name, Stack, 3-Words &amp; Goa Vibe to unlock your card
                </p>
              )}

              {/* Open in new tab */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={onOpenInNewTab}
                  disabled={!isFormValid}
                  className={`inline-flex items-center gap-1.5 font-mono-custom text-xs underline underline-offset-2 ${
                    isFormValid ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                  }`}
                  style={{ color: HH.yellow }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open full PNG in new tab
                </button>
              </div>

              {/* Reset */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    onReset();
                    setStep(1);
                  }}
                  className="inline-flex items-center gap-1.5 font-mono-custom text-xs cursor-pointer"
                  style={{ color: `${HH.cream}50` }}
                >
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
