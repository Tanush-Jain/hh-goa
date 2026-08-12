# HH Goa 2026 — UI Design System

## 0. Design Brief Summary

**Product**: Single-page web tool. Upload photo → get branded ID card → download/share to X.  
**Audience**: Hackathon builders (devs, designers, PMs) aged 20–32, heavily mobile.  
**Single job**: Make it feel like *the* credential for HH Goa 2026. Not generic. Not corporate.  
**Mood board words**: Coastal tech energy, Goa sunsets, late-night builders, neon on terracotta.

---

## 1. Color System

```
Brand Palette:
─────────────────────────────────────────────────────────
--color-night:     #0D0F1A   ← card background, page bg
--color-deep-teal: #0A3D4A   ← secondary bg, gradients
--color-goa-gold:  #F5A623   ← PRIMARY accent (sunset gold)
--color-coral:     #FF5E4D   ← secondary accent (Goa sunset coral)
--color-mint:      #00E5A0   ← highlight, online-green feel
--color-fog:       #E8EAF0   ← body text on dark bg
--color-card-bg:   #141824   ← card surface (slightly lighter than night)
```

**Rationale**: Night/teal = coastal dark, like the Arabian Sea at night. Gold + coral = Goa sunset. Mint = the "builder" signal (terminal green, slightly softened). Not a cream-with-terracotta combo. Not acid green on black. Deliberately tropical-dark.

---

## 2. Typography

```
Display (name, hero):  "Space Grotesk" — 700–800 weight
                        Tight tracking: -0.02em
                        All-caps for role/badge labels

Monospace (stack/role, event info, builder title):
                       "JetBrains Mono" — 400–600 weight
                        Signals "technical", feels native to builders

Caption / utility:     "Space Grotesk" — 400 weight, fog color
```

**Google Fonts import**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

**Type Scale (card canvas, 1080px)**:
```
Name:           56–72px  Space Grotesk 700
Builder Title:  28px     JetBrains Mono 600, uppercase, gold
Stack/Role:     24px     JetBrains Mono 400, fog
Event label:    18px     Space Grotesk 600, uppercase, coral
Date/location:  16px     JetBrains Mono 400, fog/60%
```

---

## 3. Layout — Page UI

```
Mobile (375px):                    Desktop (1200px):
┌────────────────────┐             ┌──────────┬──────────────┐
│  HH GOA 2026  🌴   │             │  Form    │   Card       │
│  [Upload Zone]     │             │  Panel   │   Preview    │
│  ┌──────────────┐  │             │          │              │
│  │ tap to upload│  │             │  Name    │  [canvas]    │
│  └──────────────┘  │             │  Stack   │              │
│                    │             │  [Upload]│              │
│  Name: _________   │             │          │              │
│  Stack: [select]   │             │  [DL] [Share]           │
│                    │             └──────────┴──────────────┘
│  [Download]        │
│  [Share to X]      │
└────────────────────┘
```

**Key layout rules**:
- Upload zone: dashed border, animated on drag-over (border pulses gold)
- Form fields: minimal, dark-surfaced inputs — no white boxes
- Canvas preview: live-updates on every field keystroke (debounced 150ms)
- Action buttons: sticky at bottom on mobile
- No sidebar on mobile, single column

---

## 4. The Card — Visual Design (1080×1080 Canvas)

```
┌──────────────────────────────────────────┐  ← rounded rect, 32px radius
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← subtle noise texture (low opacity)
│                                          │
│  [PHOTO]                 HH GOA 2026    │
│  ┌────────────┐          ——————————      │  ← circular photo, 280px
│  │            │          Aug 2026 · Goa  │
│  │   photo    │                          │
│  │            │                          │
│  └────────────┘                          │
│                                          │
│  ████████████████████████████████████   │  ← gold accent bar (4px)
│                                          │
│  FIRSTNAME LASTNAME                      │  ← Space Grotesk 700, fog
│                                          │
│  ⬡ ONCHAIN ARCHITECT                    │  ← JetBrains Mono, gold, uppercase
│                                          │
│  Solidity / Smart Contracts              │  ← JetBrains Mono, fog/70%
│                                          │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │  ← dot grid decoration (bottom-right)
│                                   #001   │  ← builder ID number (coral)
└──────────────────────────────────────────┘
```

**Signature element**: The **hexagon icon (⬡)** next to the builder title — nods to blockchain (Monad/crypto builders), and to Goa's honeycomb patterns. Rendered as a canvas path, not emoji. Filled gold, builder title beside it in monospace caps.

**Photo treatment**:
- Circle clip (280px diameter), positioned top-left quadrant
- Thin gold ring border (4px stroke, --color-goa-gold)
- Smart center-crop: always takes the center square of any photo

**Background texture**:
- Base: `#141824`
- Overlay: subtle SVG noise pattern (drawn on canvas with `globalAlpha: 0.04`)
- Corner: faint Goa-inspired geometric pattern (bottom-right, very low opacity)

**Bottom gradient**:
- `linear-gradient(to top, #0D0F1A 0%, transparent 40%)` over photo area for text legibility

---

## 5. UI Component Specs

### Upload Zone
```css
.upload-zone {
  border: 2px dashed rgba(245, 166, 35, 0.4);  /* gold, 40% */
  border-radius: 16px;
  background: rgba(10, 61, 74, 0.3);
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.upload-zone:hover,
.upload-zone.drag-over {
  border-color: #F5A623;
  background: rgba(10, 61, 74, 0.6);
  box-shadow: 0 0 24px rgba(245, 166, 35, 0.15);
}
```

### Input Fields
```css
.field-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #E8EAF0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  padding: 12px 16px;
  width: 100%;
  transition: border-color 0.2s;
}
.field-input:focus {
  border-color: #F5A623;
  outline: none;
  box-shadow: 0 0 0 3px rgba(245, 166, 35, 0.15);
}
```

### Primary Button (Download)
```css
.btn-primary {
  background: linear-gradient(135deg, #F5A623, #FF5E4D);
  color: #0D0F1A;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.02em;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(245, 166, 35, 0.3);
}
.btn-primary:active { transform: translateY(0); }
```

### Share Button (X / Twitter)
```css
.btn-share {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: #E8EAF0;
  /* same font/size as primary */
  border-radius: 12px;
  padding: 14px 28px;
  transition: border-color 0.2s, background 0.2s;
}
.btn-share:hover {
  border-color: #E8EAF0;
  background: rgba(255, 255, 255, 0.05);
}
```

---

## 6. Micro-interactions

| Trigger | Behaviour |
|---|---|
| Drag photo onto upload zone | Border animates to solid gold, bg teal brightens |
| Photo loads | Upload zone fades out, card preview fades in (200ms ease) |
| Typing name / stack | Canvas re-renders with 150ms debounce (no flash) |
| Download click | Button shows checkmark icon for 1.5s |
| Share click | Opens native share sheet or new tab |

**No skeleton loaders. No spinners for canvas render (it's sync). Keep it instant.**

---

## 7. Mobile-First Breakpoints

```css
/* Base = mobile (375px) */
.container { padding: 16px; }
.card-preview { width: 100%; max-width: 360px; margin: 0 auto; }
canvas { width: 100%; height: auto; } /* CSS scaling, canvas is still 1080px */

/* Tablet+ */
@media (min-width: 768px) {
  .layout { display: grid; grid-template-columns: 320px 1fr; gap: 32px; }
  .card-preview { max-width: 480px; }
}

/* Desktop */
@media (min-width: 1024px) {
  .layout { grid-template-columns: 360px 1fr; }
  .card-preview { max-width: 540px; }
}
```

---

## 8. Copy / Content

**Page headline**: `Build something real.`  
**Subhead**: `Get your HH Goa 2026 builder card. Upload. Fill. Share.`  
**Upload CTA**: `Drop your photo here` / `or tap to browse`  
**Download button**: `Download Card`  
**Share button**: `Share on X`  
**Pre-filled tweet**:
```
Just got my HH Goa 2026 builder card 🌴⚡
Heading to Goa to build something real.
#FrameInGoa #HHGoa2026
```

---

## 9. Accessibility Checklist

- [ ] All interactive elements keyboard-focusable
- [ ] Focus rings visible (gold, 3px offset)
- [ ] `<canvas>` has `aria-label="Your HH Goa 2026 builder card preview"`
- [ ] File input has `<label>` associated via `for`
- [ ] Color contrast: fog (#E8EAF0) on night (#0D0F1A) = 13.5:1 ✅
- [ ] `prefers-reduced-motion`: disable transition animations
- [ ] Alt text on any `<img>` elements
