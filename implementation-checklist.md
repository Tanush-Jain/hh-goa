# HH Goa 2026 — Implementation Checklist

> Tick these off as you build. Each item maps to a SKILL in agent-skills.md.

## Phase 1 — Setup (15 min)
- [ ] Create `hh-goa-2026/` folder
- [ ] Create `index.html` with proper head, OG tags, font imports
- [ ] Create `assets/` folder
- [ ] Set up CSS custom properties (all color tokens from ui-design.md)
- [ ] Wire up basic layout (upload zone visible, form + canvas hidden)
- [ ] **Agent Prompt**: Use SKILL 1

## Phase 2 — Photo Upload (20 min)
- [ ] Add heic2any CDN script tag
- [ ] Implement file input (hidden, triggered by upload zone click)
- [ ] Implement drag-and-drop on upload zone
- [ ] Implement handleFile() with HEIC branch
- [ ] Test: JPG upload works
- [ ] Test: PNG upload works
- [ ] Test: HEIC upload works (use an iPhone photo)
- [ ] Show form panel + canvas container after upload
- [ ] **Agent Prompt**: Use SKILL 2

## Phase 3 — Canvas Drawing (45 min — most complex)
- [ ] Add `<canvas id="card-canvas" width="1080" height="1080">` to HTML
- [ ] Implement drawCard() — all 13 layers in order
- [ ] Layer 0: Background fill
- [ ] Layer 1: Noise texture
- [ ] Layer 2: Photo with center-crop + circular clip
- [ ] Layer 3: Gold photo ring
- [ ] Layer 4: Bottom gradient
- [ ] Layer 5: Gold accent bar
- [ ] Layer 6: Name text (Space Grotesk 700)
- [ ] Layer 7: Hexagon icon + Builder Title (JetBrains Mono, gold)
- [ ] Layer 8: Stack/role text
- [ ] Layer 9: "HH GOA 2026" wordmark top-right
- [ ] Layer 10: Event date + location (bottom)
- [ ] Layer 11: Builder ID number
- [ ] Layer 12: Dot grid decoration
- [ ] Layer 13: Card border (roundRect)
- [ ] Wire drawCard() to img.onload
- [ ] Wire drawCard() to input events (150ms debounce)
- [ ] **Agent Prompt**: Use SKILL 3

## Phase 4 — Download + Share (15 min)
- [ ] Implement canvasToBlob() helper
- [ ] Implement Download button: toBlob → URL → anchor click
- [ ] Implement Share button: Web Share API → Twitter Intent fallback
- [ ] Test download on mobile (Android + iPhone)
- [ ] Test share on mobile (native share sheet should appear)
- [ ] Test share on desktop (Twitter Intent tab should open)
- [ ] **Agent Prompt**: Use SKILL 4

## Phase 5 — Polish (20 min)
- [ ] Add reduced-motion media query
- [ ] Add loading spinner for HEIC conversion
- [ ] Add all aria-labels and label associations
- [ ] Add "Start over" button
- [ ] Add inline error banners for 3 failure cases
- [ ] Ensure mobile layout correct (buttons full-width on mobile)
- [ ] **Agent Prompt**: Use SKILL 5

## Phase 6 — Deploy (10 min)
- [ ] Create vercel.json
- [ ] Create README.md
- [ ] Create/source og-preview.jpg (1200×630)
- [ ] Push to GitHub
- [ ] Import project on vercel.com
- [ ] Get live URL
- [ ] **Agent Prompt**: Use SKILL 6

## Phase 7 — QA (15 min)
- [ ] iPhone Safari: upload HEIC → draw card → native share
- [ ] iPhone Chrome: same flow
- [ ] Android Chrome: upload JPG → draw card → native share
- [ ] Desktop Chrome: upload PNG → draw card → download → Twitter Intent
- [ ] Desktop Safari: same
- [ ] Portrait photo: check center crop is sensible
- [ ] Landscape photo: check center crop is sensible
- [ ] Long name (>20 chars): check text doesn't overflow canvas
- [ ] Empty name: check "Builder" placeholder shows
- [ ] All 8 stack options: check all titles render correctly

## Submission
- [ ] Live URL is working
- [ ] URL submitted to: https://forms.gle/jM5hTaGvsrfEfixPA
- [ ] **Deadline: 13th August 2026, 11:59 PM**

---

## Time Budget

| Phase | Estimate | Buffer |
|---|---|---|
| Setup | 15 min | — |
| Photo upload | 20 min | +10 |
| Canvas drawing | 45 min | +20 |
| Download + Share | 15 min | +10 |
| Polish | 20 min | +10 |
| Deploy | 10 min | +5 |
| QA | 15 min | +10 |
| **Total** | **140 min** | **+65 min** |

**Realistic build time: ~3–3.5 hours.** You have until tomorrow 11:59 PM. Plenty of time.

---

## Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| HEIC conversion fails | Medium | heic2any is well-tested; have user "save as JPG" as fallback message |
| Canvas roundRect not in Safari | Low | Safari 15.4+ supports it; polyfill: `if (!ctx.roundRect) ctx.roundRect = roundRectPolyfill` |
| Web Share API blocks non-HTTPS | High | Vercel auto-provides HTTPS; test only on deployed URL |
| Fonts not loaded before canvas draw | Medium | Use FontFace.load() Promise before first drawCard() call |
| Long names overflow canvas | Medium | measureText() → reduce fontSize if > 900px wide |

---

## Font Load Guard (add this to your script)

```js
// Ensure fonts are loaded before first draw
async function ensureFonts() {
  await Promise.all([
    document.fonts.load('700 64px "Space Grotesk"'),
    document.fonts.load('600 28px "JetBrains Mono"'),
    document.fonts.load('400 24px "JetBrains Mono"'),
  ]);
}
// Call before first drawCard()
await ensureFonts();
drawCard();
```

## roundRect Safari Polyfill

```js
// Add at top of <script>, before any canvas usage
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    this.beginPath();
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
  };
}
```

## Text Overflow Guard

```js
function fitText(ctx, text, maxWidth, fontSize, fontSpec) {
  let size = fontSize;
  ctx.font = `${size}px ${fontSpec}`;
  while (ctx.measureText(text).width > maxWidth && size > 20) {
    size -= 2;
    ctx.font = `${size}px ${fontSpec}`;
  }
  return size;
}
// Usage in drawCard():
const nameSize = fitText(ctx, name, 900, 64, '"Space Grotesk"');
ctx.font = `700 ${nameSize}px "Space Grotesk"`;
```
