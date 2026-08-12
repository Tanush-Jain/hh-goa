# HH Goa 2026 — ID Card Generator: Architecture

## 0. Decision Log (read first)

| Decision | Choice | Reason |
|---|---|---|
| Framework | Vanilla HTML/CSS/JS (single file) | Zero build step, instant deploy on Vercel/Netlify/GitHub Pages, works offline after load |
| Image generation | `<canvas>` API in-browser | No server, no cost, near-instant, no file size limits, works on mobile |
| Format | **Format B (Builder ID Card)** | More shareable as a post, richer brand surface, more memorable than a frame |
| Hosting | Vercel (recommended) or GitHub Pages | Free tier, instant CDN, HTTPS, custom domain ready |
| Share flow | Web Share API (mobile) + Twitter Intent URL (desktop) | Native share sheet on iOS/Android; fallback works everywhere |
| Storage | None (pure client-side) | No GDPR, no infra, no backend |
| HEIC support | `heic2any` JS library (CDN) | iPhones shoot HEIC; must support |

---

## 1. High-Level Design (HLD)

```
┌──────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                        │
│                                                          │
│  ┌─────────────┐    ┌──────────────┐   ┌─────────────┐  │
│  │  Upload UI  │───▶│ Canvas Engine│──▶│ Download /  │  │
│  │  + Form     │    │ (compositor) │   │ Share Panel │  │
│  └─────────────┘    └──────────────┘   └─────────────┘  │
│         │                  │                             │
│         ▼                  ▼                             │
│  ┌─────────────┐    ┌──────────────┐                     │
│  │ heic2any    │    │ FontFace API │                     │
│  │ (HEIC conv) │    │ (Google Fnt) │                     │
│  └─────────────┘    └──────────────┘                     │
└──────────────────────────────────────────────────────────┘
         │                                      │
         ▼                                      ▼
┌────────────────┐                   ┌──────────────────────┐
│  Static Host   │                   │   Twitter Intent URL  │
│  (Vercel /     │                   │   twitter.com/intent  │
│   GH Pages)    │                   │   /tweet?text=...     │
└────────────────┘                   └──────────────────────┘
```

**No server. No API keys. No database. Everything runs in the browser.**

---

## 2. Low-Level Design (LLD)

### 2.1 File Structure

```
hh-goa-2026/
├── index.html          ← entire app (HTML + CSS + JS in one file)
├── assets/
│   ├── logo.svg        ← HH Goa 2026 wordmark (inline-able)
│   ├── bg-texture.png  ← card background texture (optional, base64-embeddable)
│   └── og-preview.jpg  ← static OG image for the page itself (for Twitter card)
├── README.md
└── vercel.json         ← (optional) headers for CORS / cache
```

> **Single-file-first**: For hackathon speed, embed all CSS and JS in `index.html`. Move to separate files only if the linter complains.

---

### 2.2 Component Map

```
index.html
│
├── <head>
│   ├── OG meta tags (title, description, og:image → /assets/og-preview.jpg)
│   ├── Google Fonts preconnect (Space Grotesk + JetBrains Mono)
│   └── CDN: heic2any (HEIC support)
│
├── <body>
│   ├── #upload-zone          ← drag-drop + click-to-browse
│   ├── #form-panel           ← name, stack/role, vibe (hidden until photo loaded)
│   ├── #canvas-container
│   │   └── <canvas id="card-canvas">  ← 1080×1080 px output
│   ├── #preview-panel        ← scaled display of canvas
│   └── #action-bar
│       ├── #btn-download     ← canvas.toBlob → link.click()
│       └── #btn-share        ← Web Share API or Twitter Intent
│
└── <script>
    ├── State machine (IDLE → PHOTO_LOADED → FIELDS_FILLED → RENDERED)
    ├── FileReader + heic2any pipeline
    ├── Canvas compositor (see 2.3)
    └── Share handler
```

---

### 2.3 Canvas Compositor — Layer Stack (bottom → top)

```
Layer 0: Card background  (solid colour + subtle noise texture, drawn with CSS pattern trick via canvas)
Layer 1: Photo            (smart crop to circle or rounded rect, object-fit: cover logic in canvas)
Layer 2: Brand gradient   (bottom fade from transparent to brand-dark, for text legibility)
Layer 3: HH Goa 2026 logo / wordmark (drawn as text or SVG path)
Layer 4: Name             (large, display weight)
Layer 5: Stack / Role     (smaller, monospace)
Layer 6: Generated Title  (fun badge-style label, e.g. "Onchain Wizard 🧙")
Layer 7: Decorative marks (event date, location pill, QR-code placeholder or dot grid)
Layer 8: Border / frame   (rounded rect stroke in brand accent)
```

**Canvas size: 1080 × 1080 px** (square = best for Twitter/X, Instagram cross-post)

---

### 2.4 Photo Handling Pipeline

```
User picks file
      │
      ▼
Is HEIC? ──yes──▶ heic2any(blob, {toType:'image/jpeg'}) ──▶ JPEG blob
      │ no
      ▼
FileReader.readAsDataURL(blob)
      │
      ▼
new Image(); img.src = dataURL; img.onload = () => composite()
      │
      ▼
composite():
  - Compute crop rect (center-crop to square, maintaining aspect ratio)
  - drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)  ← smart center crop
  - Apply circular clip path (ctx.arc) or rounded rect (ctx.roundRect)
```

---

### 2.5 Generated "Builder Title" Logic

No API call needed. Pure JS lookup table:

```js
const TITLES = {
  "solidity / smart contracts": "Onchain Architect 🏗️",
  "frontend / react": "Interface Conjurer ✨",
  "backend / node": "Infra Whisperer 🛠️",
  "ai / ml": "Model Tamer 🤖",
  "full stack": "Digital Alchemist ⚗️",
  "devrel": "Community Catalyst 🔥",
  "design": "Pixel Philosopher 🎨",
  "product": "Vision Merchant 🧭",
  // default
  "default": "Builder Extraordinaire 🚀"
};
```

Map the `stack/role` dropdown value → title. Displayed on card automatically.

---

### 2.6 Download Flow

```js
btn_download.onclick = () => {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HH-Goa-2026-${name.replace(/\s+/g,'-')}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
};
```

---

### 2.7 Share Flow

```js
const TWEET_TEXT = `Just got my builder card for HH Goa 2026! 🌴⚡
Building something real in Goa this August.
#FrameInGoa #HHGoa2026`;

btn_share.onclick = async () => {
  // Try native share (mobile)
  if (navigator.share && navigator.canShare) {
    const blob = await canvasToBlob(canvas);
    const file = new File([blob], 'hh-goa-card.png', { type: 'image/png' });
    if (navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text: TWEET_TEXT });
      return;
    }
  }
  // Fallback: Twitter Intent (desktop)
  const encoded = encodeURIComponent(TWEET_TEXT);
  window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank');
};
```

> **Note on OG image for link preview**: Since we can't dynamically generate OG images without a server, the share flow uses **direct image attach** via Web Share API on mobile (works on iOS/Android Chrome/Safari). On desktop, it falls back to Twitter Intent with text only. The page's own OG image (`/assets/og-preview.jpg`) serves as the preview when someone shares the page URL itself.

---

### 2.8 State Machine

```
IDLE
  └─[photo uploaded]──▶ PHOTO_LOADED
                              └─[fields updated]──▶ RENDERING
                                                        └─[canvas drawn]──▶ READY
                                                                               ├─[download]
                                                                               ├─[share]
                                                                               └─[re-upload / re-fill]──▶ back to PHOTO_LOADED
```

State drives UI visibility: upload zone hidden in READY state; action bar hidden in IDLE state.

---

## 3. Performance Budget

| Metric | Target | How |
|---|---|---|
| Time to interactive | < 1.5s | Single HTML file, minimal deps |
| Photo → card render | < 500ms | Synchronous canvas draw, no network |
| Download trigger | < 200ms | toBlob is async but fast |
| HEIC conversion | < 3s | heic2any is WASM-based, acceptable |
| Bundle size | < 150KB (excl. fonts) | heic2any ~80KB, rest is vanilla |

---

## 4. Deployment Checklist

```
[ ] Push to GitHub repo
[ ] Connect repo to Vercel (import project)
[ ] Set custom domain (optional)
[ ] Add /assets/og-preview.jpg (1200×630 static preview image)
[ ] Verify HTTPS (Vercel auto-provides)
[ ] Test on real iPhone (HEIC + Web Share API)
[ ] Test on Android Chrome (Web Share API)
[ ] Test on desktop Chrome + Safari
[ ] Submit live URL to hackathon form
```

---

## 5. What NOT to build (scope control)

- ❌ Backend / server — not needed
- ❌ User accounts / login — explicitly forbidden by brief
- ❌ Database — no persistence needed
- ❌ Format A (PFP frame) — Format B is richer, build one format well
- ❌ Real-time OG image generation — too complex for hackathon timeline
- ❌ Multiple card templates — one great template beats three mediocre ones
