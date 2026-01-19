# radix-marketing

Marketing source of truth for Radix vocabulary learning app.

## Strategy

### Positioning

**One-liner:** Learn word roots. Decode any word.

**Core insight:** Kids who speak Romance languages have an unfair vocabulary advantage—they recognize Latin roots intuitively. Radix gives everyone that same edge.

### Target Markets

| Market | Hook | Status |
|--------|------|--------|
| 🇰🇷 Korea | Suneung (수능) English prep - pattern over brute force | ✅ Landing page |
| 🇻🇳 Vietnam | "Đừng học thuộc lòng" - decode, don't memorize | ✅ Landing page |
| 🇯🇵 Japan | TOEIC/Eiken prep | 📋 Planned |
| 🇨🇳 China | GaoKao English | 📋 Planned |
| 🌐 Global | SAT/GRE/academic English | 📋 Planned |

### Messaging Framework

| Audience Pain | Radix Solution |
|---------------|----------------|
| "I memorize words but forget them" | Spaced repetition with root patterns |
| "English vocabulary feels random" | Systematic: 200 roots → thousands of words |
| "I can't guess unfamiliar words" | Decode new words using root knowledge |
| "Vocab apps track me / need internet" | 100% on-device, privacy-first |

### Key Differentiators

- **On-device only** — Zero cloud, zero tracking, school-safe
- **Root-first** — Pattern recognition over brute memorization
- **Science-backed** — Spaced repetition + morphological awareness research

---

## Execution Status

```
┌────────────────────────────────────────────────────────────────┐
│  LANDING PAGE                                                  │
├────────────────────────────────────────────────────────────────┤
│  Core Page             ✅ Complete                             │
│  Hero Section          ✅ "Stop memorizing. Start decoding."   │
│  Decode Animation      ✅ CSS sequence: word → roots → mastery │
│  Screenshots           ✅ 5 device mockups                     │
│  Privacy Badge         ✅ On-device, school-safe messaging     │
│  Global Learners       ✅ Korean + Vietnamese hooks            │
│  X-Ray Theme           ✅ Neon Cyan + Naver Green palette      │
├────────────────────────────────────────────────────────────────┤
│  App Store Link        📋 Placeholder (pending launch)         │
│  SEO/Indexing          📋 noindex until launch                 │
│  Pricing Section       📋 Deferred                             │
└────────────────────────────────────────────────────────────────┘
```

**Live:** https://radix-marketing.vercel.app/

### Landing Page Sections

1. **Hero** — "Stop memorizing words. Start decoding them."
2. **Decode Animation** — CSS sequence: INCREDIBLE → IN+CRED+IBLE → Mastery (8s loop)
3. **Demo Table** — vid/aud/port root examples
4. **Screenshots** — 5 device mockups
5. **Insight** — "Unfair Advantage" (Romance language parallel)
6. **Features** — Spaced repetition, streaks, packs, Root Web
7. **Privacy** — 100% on-device, GDPR/PIPA compliant
8. **Global Learners** — Korean + Vietnamese localized hooks
9. **CTA** — Download button

---

## Design System: "Linguistic X-Ray"

Unified dark theme across landing page and iOS app. Creates "proprietary tech" feel to differentiate from textbook-style competitors.

### Color Palette

| Element | Color | Hex | CSS Variable |
|---------|-------|-----|--------------|
| Background | Deep Slate | `#121212` | `--bg` |
| Card Surface | Charcoal | `#1E1E1E` | `--bg-card` |
| Primary | Neon Cyan | `#00F0FF` | `--primary` |
| CTA Buttons | Naver Green | `#00C73C` | `--cta` |
| Success | Naver Green | `#00C73C` | `--success` |
| Text | White | `#FFFFFF` | `--text` |
| Text Dim | Gray | `#A0A0A0` | `--text-dim` |

### Why These Colors

| Color | Strategic Purpose |
|-------|-------------------|
| **Deep Slate** | "Black Box" environment for X-Ray effects |
| **Neon Cyan** | High-tech "decoding" accent, outdoor-readable for VN |
| **Naver Green** | Trust signal for Korean market (matches Naver brand) |

### Typography

- **System fonts only** — Ensures Vietnamese diacritics render correctly
- **Font stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace for roots** — `'SF Mono', Monaco, monospace` for "decoding" aesthetic

### Design Consistency

Landing page CSS variables must match iOS `Theme.swift`:

```css
:root {
    --primary: #00F0FF;    /* Theme.primary */
    --bg: #121212;         /* Theme.background */
    --bg-card: #1E1E1E;    /* Theme.cardSurface */
    --success: #00C73C;    /* Theme.success */
}
```

---

## Files

```
index.html              # Single-page landing
images/
├── mockup-dashboard.png   # Device mockups (5)
├── mockup-quiz.png
├── mockup-etymology.png
├── mockup-result.png
├── mockup-mastery.png
├── INCREDIBLE.png         # Decode animation (3)
├── IN-CRED-IBLE.png
└── INCREDIBLE-RESULT.png
```

## Deployment

Vercel auto-deploys from `main` branch.

---

## Pre-Launch Checklist

- [ ] Replace `href="#"` with App Store URL
- [ ] Remove `<meta name="robots" content="noindex, nofollow">`
- [ ] Add pricing section (if needed)
- [ ] Add JP/CN locale hooks
- [ ] Set up App Store Connect marketing assets
