import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Download, Share2, RefreshCw, Sparkles, Check, 
  Image as ImageIcon, QrCode, Layers, Frame, FileImage, 
  Calendar, Camera, Zap, ShieldCheck, ExternalLink, UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STACK_OPTIONS, FUN_VIBES, getBuilderTitle } from '../utils/titles';

const PRESET_AVATARS = [
  { id: 'sunset', name: 'Sunset Nomad', emoji: '🌴', gradient: 'from-[#F5A623] via-[#FF5E4D] to-[#0A3D4A]' },
  { id: 'cyber', name: 'Onchain Dev', emoji: '⚡', gradient: 'from-[#00E5A0] via-[#0A3D4A] to-[#141824]' },
  { id: 'model', name: 'AI Whisperer', emoji: '🤖', gradient: 'from-[#FF5E4D] via-[#F5A623] to-[#0D0F1A]' }
];

function generatePresetAvatarUrl(preset) {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  const grad = ctx.createLinearGradient(0, 0, 400, 400);
  if (preset.id === 'sunset') {
    grad.addColorStop(0, '#F5A623');
    grad.addColorStop(0.5, '#FF5E4D');
    grad.addColorStop(1, '#0A3D4A');
  } else if (preset.id === 'cyber') {
    grad.addColorStop(0, '#00E5A0');
    grad.addColorStop(0.5, '#0A3D4A');
    grad.addColorStop(1, '#141824');
  } else {
    grad.addColorStop(0, '#FF5E4D');
    grad.addColorStop(0.5, '#F5A623');
    grad.addColorStop(1, '#0D0F1A');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 400, 400);

  ctx.fillStyle = '#E8EAF0';
  ctx.font = 'bold 160px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(preset.emoji, 200, 200);

  return canvas.toDataURL('image/png');
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 25 }
  }
};

export function WalletPass({
  imageObj,
  previewUrl,
  name,
  setName,
  stack,
  setStack,
  funVibe,
  setFunVibe,
  cardMode,
  setCardMode,
  fileFormat,
  setFileFormat,
  onImageSelected,
  onDownload,
  onOpenInNewTab,
  onShare,
  onReset,
  isProcessing,
  downloadSuccess,
  errorMsg
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F5A623', '#FF5E4D', '#00E5A0', '#E8EAF0']
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelected(e.dataTransfer.files[0]);
      triggerConfetti();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
      triggerConfetti();
    }
  };

  const handleSelectPreset = (preset) => {
    const dataUrl = generatePresetAvatarUrl(preset);
    const img = new Image();
    img.onload = () => {
      onImageSelected(null, { img, dataUrl });
      triggerConfetti();
    };
    img.src = dataUrl;
  };

  return (
    <main className="w-full max-w-[460px] mx-auto min-h-screen px-4 py-8 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F5A623]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#FF5E4D]/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full relative z-10"
      >
        {/* App Branding Header */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623] text-xs font-mono-custom mb-3">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            HH GOA 2026 OFFICIAL
          </div>
          <h1 className="font-display-custom text-3xl font-extrabold tracking-tight text-[#E8EAF0] flex items-center justify-center gap-2">
            BUILDER CREDENTIAL
          </h1>
          <p className="text-xs font-mono-custom text-[#E8EAF0]/60 mt-1">
            Generate your official event card & X profile frame
          </p>
        </motion.div>

        {/* Format Selector Toggle (Builder Pass vs PFP Frame) */}
        <motion.div 
          variants={itemVariants} 
          className="w-full bg-[#141824]/90 p-1.5 rounded-2xl border border-white/10 flex gap-1.5 mb-5 backdrop-blur-xl shadow-xl"
        >
          <button
            type="button"
            onClick={() => setCardMode('pass')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-mono-custom text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
              cardMode === 'pass'
                ? 'bg-gradient-to-r from-[#F5A623] to-[#F5A623]/90 text-[#0D0F1A] shadow-lg shadow-[#F5A623]/25 scale-[1.02]'
                : 'text-[#E8EAF0]/60 hover:text-[#E8EAF0] hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Format A: Builder Pass
          </button>
          <button
            type="button"
            onClick={() => setCardMode('frame')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-mono-custom text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
              cardMode === 'frame'
                ? 'bg-gradient-to-r from-[#FF5E4D] to-[#FF5E4D]/90 text-white shadow-lg shadow-[#FF5E4D]/25 scale-[1.02]'
                : 'text-[#E8EAF0]/60 hover:text-[#E8EAF0] hover:bg-white/5'
            }`}
          >
            <Frame className="w-3.5 h-3.5" />
            Format B: PFP Frame
          </button>
        </motion.div>

        {/* Floating Glassmorphic Pass Container */}
        <motion.div 
          variants={itemVariants}
          layout
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="w-full bg-[#141824]/90 border border-[#F5A623]/25 rounded-[28px] p-6 shadow-2xl shadow-black/80 relative overflow-hidden backdrop-blur-xl"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#E8EAF0]/10 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌴</span>
              <div>
                <span className="font-display-custom font-bold text-sm tracking-wider text-[#E8EAF0] block">
                  HH GOA 2026
                </span>
                <span className="font-mono-custom text-[10px] text-[#E8EAF0]/50 block">AUG 14-16 · GOA</span>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#00E5A0]/10 border border-[#00E5A0]/30 text-[#00E5A0] text-[11px] font-mono-custom font-bold uppercase tracking-wider flex items-center gap-1.5">
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
                className="mb-4 bg-[#FF5E4D]/15 border border-[#FF5E4D]/40 text-[#FF5E4D] px-3.5 py-2.5 rounded-xl text-xs font-mono-custom"
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* State 1: Upload Dropzone & Quick Presets */}
          {!previewUrl ? (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-4"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                animate={isDragOver ? { scale: 1.03, borderColor: '#F5A623', backgroundColor: 'rgba(10, 61, 74, 0.5)' } : {}}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed ${
                  isDragOver ? 'border-[#F5A623] bg-[#0A3D4A]/50' : 'border-[#F5A623]/40 bg-[#0A3D4A]/20'
                } rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 min-h-[220px] group`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.heic,.heif"
                  className="hidden"
                />

                {isProcessing ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <div className="w-10 h-10 border-3 border-[#F5A623] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-mono-custom text-[#F5A623]">Converting photo with HEIC engine...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-[#0A3D4A]/60 flex items-center justify-center text-[#F5A623] border border-[#F5A623]/30 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display-custom font-bold text-base text-[#E8EAF0]">
                        Drop your photo here
                      </h3>
                      <p className="font-mono-custom text-xs text-[#E8EAF0]/60 mt-1">
                        or tap to browse (JPG, PNG, HEIC)
                      </p>
                    </div>
                  </>
                )}
              </motion.div>

              {/* Instant Preset Avatars */}
              <div className="pt-1">
                <p className="text-[11px] font-mono-custom text-[#E8EAF0]/50 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#F5A623]" />
                  Or pick a 1-tap avatar preset:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AVATARS.map((preset) => (
                    <motion.button
                      key={preset.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className="py-2 px-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#F5A623] text-center cursor-pointer transition-all"
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${preset.gradient} mx-auto flex items-center justify-center text-sm shadow-md mb-1`}>
                        {preset.emoji}
                      </div>
                      <span className="block font-mono-custom text-[10px] text-[#E8EAF0]/80 truncate">
                        {preset.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* State 2: Wallet Card Live Preview & Controls */
            <motion.div
              key="pass-controls"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Photo Card Preview Strip */}
              <div className="flex items-center gap-4 bg-[#0A3D4A]/40 p-3 rounded-2xl border border-[#E8EAF0]/10 shadow-inner">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#F5A623] shrink-0 bg-[#0D0F1A] shadow-md">
                  <img
                    src={previewUrl}
                    alt="Uploaded Photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display-custom font-bold text-sm text-[#E8EAF0] truncate">
                    {name || 'YOUR NAME'}
                  </h4>
                  <p className="font-mono-custom text-xs text-[#F5A623] flex items-center gap-1 mt-0.5 truncate">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    {getBuilderTitle(stack)}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-mono-custom text-[#E8EAF0]/60 hover:text-[#F5A623] p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  title="Change photo"
                >
                  <Camera className="w-4 h-4" />
                </motion.button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.heic,.heif"
                  className="hidden"
                />
              </div>

              {/* Form Controls */}
              <div className="space-y-3.5">
                {/* Name Field */}
                <div className="space-y-1">
                  <label 
                    htmlFor="builder-name" 
                    className="block font-mono-custom text-[11px] font-bold text-[#F5A623] uppercase tracking-wider"
                  >
                    Your Name
                  </label>
                  <input
                    id="builder-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={30}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 font-mono-custom text-sm text-[#E8EAF0] focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
                  />
                </div>

                {/* Stack / Role Dropdown */}
                <div className="space-y-1">
                  <label 
                    htmlFor="stack-select" 
                    className="block font-mono-custom text-[11px] font-bold text-[#F5A623] uppercase tracking-wider"
                  >
                    Primary Stack / Role
                  </label>
                  <select
                    id="stack-select"
                    value={stack}
                    onChange={(e) => setStack(e.target.value)}
                    className="w-full bg-[#141824] border border-white/10 rounded-xl px-3.5 py-2.5 font-mono-custom text-sm text-[#E8EAF0] focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all cursor-pointer"
                  >
                    {STACK_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fun Vibe Field */}
                {cardMode === 'pass' && (
                  <div className="space-y-1">
                    <label 
                      htmlFor="vibe-select" 
                      className="block font-mono-custom text-[11px] font-bold text-[#00E5A0] uppercase tracking-wider"
                    >
                      Goa Hackathon Vibe ⚡
                    </label>
                    <select
                      id="vibe-select"
                      value={funVibe}
                      onChange={(e) => setFunVibe(e.target.value)}
                      className="w-full bg-[#141824] border border-white/10 rounded-xl px-3.5 py-2.5 font-mono-custom text-sm text-[#00E5A0] focus:outline-none focus:border-[#00E5A0] focus:ring-2 focus:ring-[#00E5A0]/20 transition-all cursor-pointer"
                    >
                      {FUN_VIBES.map((vibe) => (
                        <option key={vibe.value} value={vibe.label}>
                          {vibe.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Export File Type Selector */}
                <div className="space-y-1 pt-1">
                  <label className="block font-mono-custom text-[11px] font-bold text-[#E8EAF0]/70 uppercase tracking-wider">
                    Select Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFileFormat('png')}
                      className={`py-2 px-2 rounded-xl font-mono-custom text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        fileFormat === 'png'
                          ? 'bg-[#F5A623]/20 border-2 border-[#F5A623] text-[#F5A623] shadow-md'
                          : 'bg-white/5 border border-white/10 text-[#E8EAF0]/60 hover:text-[#E8EAF0]'
                      }`}
                    >
                      <FileImage className="w-4 h-4" />
                      PNG (.png)
                    </button>

                    <button
                      type="button"
                      onClick={() => setFileFormat('jpeg')}
                      className={`py-2 px-2 rounded-xl font-mono-custom text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        fileFormat === 'jpeg'
                          ? 'bg-[#F5A623]/20 border-2 border-[#F5A623] text-[#F5A623] shadow-md'
                          : 'bg-white/5 border border-white/10 text-[#E8EAF0]/60 hover:text-[#E8EAF0]'
                      }`}
                    >
                      <FileImage className="w-4 h-4" />
                      JPG (.jpg)
                    </button>

                    <button
                      type="button"
                      onClick={() => setFileFormat('ics')}
                      className={`py-2 px-2 rounded-xl font-mono-custom text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        fileFormat === 'ics'
                          ? 'bg-[#00E5A0]/20 border-2 border-[#00E5A0] text-[#00E5A0] shadow-md'
                          : 'bg-white/5 border border-white/10 text-[#E8EAF0]/60 hover:text-[#E8EAF0]'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      ICS (.ics)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer Metadata */}
          <div className="mt-5 pt-3 border-t border-[#E8EAF0]/10 flex items-center justify-between text-[11px] font-mono-custom text-[#E8EAF0]/40">
            <span className="flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-[#F5A623]" />
              QR Credential Linked
            </span>
            <span className="text-[#FF5E4D] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              #001
            </span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <AnimatePresence>
          {previewUrl && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="w-full mt-6 space-y-3"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Primary Download Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onDownload}
                  type="button"
                  className="flex-1 bg-gradient-to-r from-[#F5A623] via-[#F5A623] to-[#FF5E4D] text-[#0D0F1A] font-display-custom font-extrabold text-sm py-3.5 px-5 rounded-xl shadow-xl shadow-[#F5A623]/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      Downloaded .{fileFormat.toUpperCase()}!
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download .{fileFormat === 'jpeg' ? 'JPG' : fileFormat.toUpperCase()} File
                    </>
                  )}
                </motion.button>

                {/* Secondary Share on X Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onShare}
                  type="button"
                  className="flex-1 bg-transparent border-2 border-white/20 hover:border-[#E8EAF0] text-[#E8EAF0] font-display-custom font-extrabold text-sm py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share on X
                </motion.button>
              </div>

              {/* View/Open Image in New Tab Option (Alternative for Mac Safari/Chrome) */}
              {fileFormat !== 'ics' && (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={onOpenInNewTab}
                    className="inline-flex items-center gap-1.5 text-xs font-mono-custom text-[#F5A623] hover:underline transition-colors py-1 px-3 rounded-lg cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Image in New Tab (View/Save Directly)
                  </button>
                </div>
              )}

              {/* Start Over Button */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex items-center gap-1.5 text-xs font-mono-custom text-[#E8EAF0]/50 hover:text-[#F5A623] transition-colors py-1 px-3 rounded-lg cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Start over with new photo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
