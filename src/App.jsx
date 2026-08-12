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
    <div className="min-h-screen bg-[#0D0F1A] text-[#E8EAF0]">
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

export default App;
