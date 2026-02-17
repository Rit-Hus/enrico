# Enrico Design System

Copy-paste reference library for all frontend designers. Extracted from 5 reference screens (Dream Input, Local Reality Check, Opportunity Detection, Niche Suggestions, Activation Steps).

---

## 1. Foundation — Setup & Tokens

### Tailwind Config

```js
// tailwind.config.js
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#9719f0",
        "background-light": "#f7f6f8",
        "background-dark": "#1b1022",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
    },
  },
};
```

### Required Imports

```html
<!-- Google Fonts (add to <head>) -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet" />

<!-- Material Symbols (add to <head>) -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
```

### Body Base Classes

```html
<body class="bg-background-light dark:bg-background-dark font-display text-[#160d1c] dark:text-white antialiased">
```

### Color Palette

| Token | Value | Tailwind Class | Usage |
|-------|-------|---------------|-------|
| Primary | `#9719f0` | `bg-primary` / `text-primary` | Brand purple, CTAs, active states |
| BG Light | `#f7f6f8` | `bg-background-light` | Page background (light mode) |
| BG Dark | `#1b1022` | `bg-background-dark` | Page background (dark mode) |
| Text Primary | `#160d1c` | `text-[#160d1c]` | Main body text (light mode) |
| Text Muted | `#794b9b` | `text-[#794b9b]` | Subtitles, secondary text |
| Surface Dark | `#251630` | `bg-[#251630]` | Elevated dark mode surfaces |

**Opacity variants used throughout:**

```
bg-primary/5       — subtle background tint
bg-primary/10      — icon boxes, tag backgrounds
bg-primary/20      — borders, glow effects
shadow-primary/20  — button glow shadow
shadow-primary/40  — FAB / hover glow shadow
text-primary/60    — overline / label text
```

### Semantic Colors

```
bg-green-100 text-green-600          — success
bg-orange-50 text-orange-700         — warning
bg-emerald-500/10 text-emerald-500   — positive metric
```

---

## 2. Typography

### Page Title — Hero (Poppins)

Used on the Dream Input (home) screen.

```html
<h1 class="font-poppins text-[38px] leading-[1.1] font-bold text-[#160d1c] dark:text-white">
  Vad drömmer du om att starta?
</h1>
```

### Page Title — Standard

Used on Activation, Opportunity Detection screens.

```html
<h1 class="text-3xl font-extrabold leading-tight tracking-tight text-[#160d1c] dark:text-white">
  Redo att förverkliga din dröm?
</h1>
```

### Section Title (H2)

```html
<!-- Smaller section heading -->
<h2 class="text-lg font-bold tracking-tight text-[#160d1c] dark:text-white">
  Välj din väg
</h2>

<!-- Larger section heading (in cards) -->
<h2 class="text-2xl font-bold tracking-tight text-[#160d1c] dark:text-white">
  Café i Eskilstuna
</h2>
```

### Card / Item Title (H3/H4)

```html
<!-- Standard item title -->
<h4 class="font-bold text-[#160d1c] dark:text-white">
  Fokus på Takeaway
</h4>

<!-- Larger card title -->
<p class="text-lg font-bold leading-tight text-[#160d1c] dark:text-white">
  Starta enskild firma
</p>
```

### Body Text

```html
<!-- Subtitle / intro paragraph -->
<p class="text-lg font-medium text-[#794b9b]">
  Berätta om din affärsidé så analyserar vi den lokala marknaden åt dig.
</p>

<!-- Card description -->
<p class="text-sm text-slate-500 dark:text-slate-400 leading-snug">
  Den enklaste formen att komma igång med eget företag.
</p>

<!-- AI message / longer body -->
<p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
  Eskilstuna centrum har en mättnad av traditionella caféer...
</p>
```

### Overline / Label / Caption

```html
<!-- Category overline (above headings) -->
<p class="text-[10px] font-bold uppercase tracking-widest text-primary/60">
  Analys för
</p>

<!-- Step indicator -->
<span class="text-[10px] uppercase tracking-widest text-primary font-bold">
  Steg 4 av 5
</span>

<!-- Metric label (below stat numbers) -->
<p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
  Caféer inom 3 km
</p>

<!-- Section action link -->
<span class="text-[10px] font-bold text-primary tracking-widest cursor-pointer">
  VISA FULLSKÄRM
</span>

<!-- Helper / footnote -->
<p class="text-xs text-slate-400 italic text-center">
  Tips: Klicka på en nisch för att se djupare data.
</p>
```

### Large Stat Numbers

```html
<!-- Big stat -->
<p class="text-3xl font-bold tracking-tighter">14</p>

<!-- Stat with denominator -->
<p class="text-3xl font-bold tracking-tighter">
  4.2<span class="text-lg text-slate-400">/5</span>
</p>

<!-- Score (extra large) -->
<span class="text-4xl font-black text-primary">92</span>
```

### Inline Highlight

```html
<span class="text-primary font-bold">hantverksbagerier</span>
```

---

## 3. Buttons

### Primary CTA — Full Width

Main action button. Rounded pill shape with glow shadow.

```html
<button class="w-full bg-primary text-white py-4 rounded-full text-lg font-bold
  shadow-xl shadow-primary/20 flex items-center justify-center gap-2
  transition-transform active:scale-95 hover:shadow-primary/40">
  Analysera
  <span class="material-symbols-outlined">arrow_forward</span>
</button>
```

### Primary CTA — In-Card

Smaller CTA used inside action cards.

```html
<button class="flex w-full items-center justify-center rounded-full h-12
  bg-primary text-white text-base font-bold
  transition-transform active:scale-95">
  Kom igång
</button>
```

### Secondary Button

Neutral background, used for non-primary actions.

```html
<button class="flex w-full items-center justify-center rounded-full h-12
  bg-slate-100 dark:bg-white/10 text-[#160d1c] dark:text-white
  text-base font-bold transition-transform active:scale-95">
  Läs mer
</button>
```

### Ghost / Text Button

Text-only, for dismissals or low-priority actions.

```html
<button class="w-full text-[#794b9b] dark:text-primary/60 font-medium py-2">
  Inte intresserad
</button>
```

### Suggestion Chip

Tappable example/suggestion pill.

```html
<button class="rounded-lg border border-primary/20 bg-white/50 dark:bg-[#251630]/50
  px-4 py-2 text-sm font-medium text-[#794b9b]
  hover:bg-primary/5 transition-colors">
  "Ett bageri i Malmö"
</button>
```

### Icon Button — Bordered Circle

Used in headers (back, menu, more).

```html
<button class="w-10 h-10 flex items-center justify-center rounded-full
  bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
  <span class="material-symbols-outlined text-primary">arrow_back_ios_new</span>
</button>
```

### Icon Button — Transparent

Used in glass-morphism headers.

```html
<button class="w-10 h-10 flex items-center justify-center rounded-full
  hover:bg-primary/10 transition-colors">
  <span class="material-symbols-outlined text-primary">share</span>
</button>
```

### Icon Button — Profile

```html
<button class="flex h-10 w-10 items-center justify-center rounded-full
  bg-primary/10 text-primary">
  <span class="material-symbols-outlined">account_circle</span>
</button>
```

### FAB (Floating Action Button)

```html
<button class="bg-primary text-white w-14 h-14 rounded-full
  shadow-lg shadow-primary/40 flex items-center justify-center
  hover:scale-105 transition-transform">
  <span class="material-symbols-outlined">add</span>
</button>
```

---

## 4. Form Elements

### Textarea with Glow Focus Effect

Glowing gradient appears behind the input on focus.

```html
<div class="relative group">
  <!-- Glow layer -->
  <div class="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5
    rounded-lg blur transition duration-1000
    group-focus-within:duration-200"></div>

  <div class="relative">
    <textarea
      class="flex w-full min-h-[220px] resize-none overflow-hidden rounded-lg
        border border-primary/20 bg-white dark:bg-[#251630]
        p-6 text-xl font-normal leading-relaxed
        text-[#160d1c] dark:text-white
        placeholder:text-[#794b9b]/50
        focus:border-primary focus:ring-4 focus:ring-primary/10
        focus:outline-none transition-all"
      placeholder="T.ex. Jag vill öppna ett café i Eskilstuna..."
    ></textarea>

    <!-- Sparkle icon (bottom-right) -->
    <div class="absolute bottom-4 right-4 flex items-center gap-2
      text-primary/40 pointer-events-none">
      <span class="material-symbols-outlined text-lg">auto_awesome</span>
    </div>
  </div>
</div>
```

---

## 5. Cards

### Stat Card (2-up Grid)

```html
<section class="grid grid-cols-2 gap-4">
  <div class="bg-white dark:bg-zinc-900 p-5 rounded border border-primary/10 shadow-sm">
    <div class="w-10 h-10 bg-primary/10 rounded flex items-center justify-center mb-4">
      <span class="material-symbols-outlined text-primary">groups</span>
    </div>
    <p class="text-3xl font-bold tracking-tighter">14</p>
    <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
      Caféer inom 3 km
    </p>
  </div>

  <div class="bg-white dark:bg-zinc-900 p-5 rounded border border-primary/10 shadow-sm">
    <div class="w-10 h-10 bg-emerald-500/10 rounded flex items-center justify-center mb-4">
      <span class="material-symbols-outlined text-emerald-500">star</span>
    </div>
    <p class="text-3xl font-bold tracking-tighter">
      4.2<span class="text-lg text-slate-400">/5</span>
    </p>
    <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
      Genomsnittsbetyg
    </p>
  </div>
</section>
```

### Action Card (with CTA)

```html
<div class="flex flex-col gap-4 rounded bg-white dark:bg-white/5 p-5
  border border-primary/10"
  style="box-shadow: 0 2px 12px -2px rgba(0,0,0,0.08)">

  <div class="flex justify-between items-start">
    <div class="flex flex-col gap-1 pr-4">
      <p class="text-lg font-bold leading-tight text-[#160d1c] dark:text-white">
        Starta enskild firma
      </p>
      <p class="text-sm text-slate-500 dark:text-slate-400 leading-snug">
        Den enklaste formen att komma igång.
      </p>
    </div>
    <!-- Primary icon box -->
    <div class="size-14 rounded bg-primary/10 flex items-center justify-center shrink-0">
      <span class="material-symbols-outlined text-primary text-3xl">storefront</span>
    </div>
  </div>

  <!-- Primary CTA -->
  <button class="flex w-full items-center justify-center rounded-full h-12
    bg-primary text-white text-base font-bold
    transition-transform active:scale-95">
    Kom igång
  </button>
</div>
```

**Secondary variant** — swap the icon box and button:

```html
<!-- Neutral icon box -->
<div class="size-14 rounded bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0">
  <span class="material-symbols-outlined text-slate-600 dark:text-slate-300 text-3xl">receipt_long</span>
</div>

<!-- Secondary button -->
<button class="flex w-full items-center justify-center rounded-full h-12
  bg-slate-100 dark:bg-white/10 text-[#160d1c] dark:text-white
  text-base font-bold transition-transform active:scale-95">
  Läs mer
</button>
```

### Info Card (with Header Bar)

```html
<div class="bg-white dark:bg-zinc-900 rounded shadow-sm border border-primary/10 overflow-hidden">
  <div class="px-5 py-4 border-b border-primary/5 flex justify-between items-center">
    <h3 class="text-xs font-bold uppercase tracking-widest">Konkurrentkarta</h3>
    <span class="text-[10px] font-bold text-primary tracking-widest cursor-pointer">
      VISA FULLSKÄRM
    </span>
  </div>
  <div class="p-5">
    <!-- Content here -->
  </div>
</div>
```

### Image Card (with Gradient Overlay)

```html
<section class="bg-white dark:bg-zinc-900 rounded shadow-sm border border-primary/10 p-5">
  <div class="flex items-start justify-between mb-4">
    <div class="space-y-1">
      <p class="text-[10px] font-bold uppercase tracking-widest text-primary/60">Analys för</p>
      <h2 class="text-2xl font-bold tracking-tight">Café i Eskilstuna</h2>
    </div>
    <!-- Badge goes here (see Badges section) -->
  </div>

  <div class="h-[180px] w-full rounded overflow-hidden relative group">
    <img class="w-full h-full object-cover transition-transform duration-500
      group-hover:scale-105" src="..." alt="..." />
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    <div class="absolute bottom-4 left-4 right-4 text-white">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">location_on</span>
        <span class="text-xs font-semibold tracking-wide uppercase">Eskilstuna Centrum</span>
      </div>
    </div>
  </div>
</section>
```

### Data Pill (Inline Fact)

```html
<div class="flex items-center gap-1.5 bg-background-light dark:bg-white/5
  px-3 py-1.5 rounded border border-gray-100 dark:border-white/5">
  <span class="material-symbols-outlined text-primary text-lg">coffee</span>
  <span class="text-sm font-medium">0 caféer inom 5 km</span>
</div>
```

---

## 6. Badges & Tags

### Warning Status Badge (Pulsing)

```html
<div class="bg-orange-50 dark:bg-orange-900/20
  border border-orange-200 dark:border-orange-800/30
  px-3 py-1.5 rounded-full flex items-center gap-1.5">
  <span class="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
  <span class="text-orange-700 dark:text-orange-400 text-[10px]
    font-bold uppercase tracking-wider">
    Hög Konkurrens
  </span>
</div>
```

### Category Tag

```html
<span class="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
  HÖG GAP
</span>
```

Common values: `HÖG GAP`, `SAKNAS IDAG`, `TRENDANDE`

### Score Pill

```html
<div class="bg-primary text-white px-4 py-1.5 rounded-full text-sm
  font-bold shadow-lg flex items-center gap-1">
  <span class="material-symbols-outlined text-sm">trending_up</span>
  Hög potential
</div>
```

### Success Icon Badge

```html
<div class="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400
  p-2 rounded-sm">
  <span class="material-symbols-outlined">location_on</span>
</div>
```

---

## 7. Navigation

### Header — Logo (Home Screen)

```html
<header class="flex items-center justify-between px-6 pt-12 pb-6">
  <div class="flex items-center gap-2">
    <div class="bg-primary rounded-full p-2 flex items-center justify-center">
      <span class="material-symbols-outlined text-white text-xl">rocket_launch</span>
    </div>
    <div class="flex flex-col">
      <span class="text-sm font-bold tracking-tight leading-none">Enrico</span>
      <span class="text-[10px] uppercase tracking-widest text-primary/80
        font-semibold leading-none">by Robin</span>
    </div>
  </div>
  <button class="flex h-10 w-10 items-center justify-center rounded-full
    bg-primary/10 text-primary">
    <span class="material-symbols-outlined">account_circle</span>
  </button>
</header>
```

### Header — Back + Title (Glassmorphism)

```html
<header class="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80
  backdrop-blur-md border-b border-primary/10 px-4 py-4
  flex items-center justify-between">

  <button class="w-10 h-10 flex items-center justify-center rounded-full
    hover:bg-primary/10 transition-colors">
    <span class="material-symbols-outlined text-primary">arrow_back_ios_new</span>
  </button>

  <h1 class="text-[13px] font-bold uppercase tracking-[0.1em] text-center flex-1">
    Local Reality Check
  </h1>

  <button class="w-10 h-10 flex items-center justify-center rounded-full
    hover:bg-primary/10 transition-colors">
    <span class="material-symbols-outlined text-primary">share</span>
  </button>
</header>
```

### Header — Step Indicator (Centered)

```html
<header class="flex items-center justify-between px-6 py-4">
  <button class="w-10 h-10 flex items-center justify-center rounded-full
    bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
    <span class="material-symbols-outlined text-primary">arrow_back_ios_new</span>
  </button>
  <div class="flex flex-col items-center">
    <span class="text-[10px] uppercase tracking-widest text-primary font-bold">
      Steg 4 av 5
    </span>
    <h1 class="text-sm font-bold opacity-60">Marknadsanalys</h1>
  </div>
  <button class="w-10 h-10 flex items-center justify-center rounded-full
    bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
    <span class="material-symbols-outlined text-primary">more_horiz</span>
  </button>
</header>
```

### Bottom Tab Bar

```html
<nav class="sticky bottom-0 bg-white/90 dark:bg-background-dark/90
  backdrop-blur-lg border-t border-primary/10 px-6 pb-8 pt-3">
  <div class="flex justify-between items-center max-w-md mx-auto">

    <!-- Active tab -->
    <a class="flex flex-col items-center gap-1 text-primary" href="#">
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
        <span class="material-symbols-outlined"
          style="font-variation-settings: 'FILL' 1">home</span>
      </div>
      <p class="text-[10px] font-bold uppercase tracking-wider">Start</p>
    </a>

    <!-- Inactive tab -->
    <a class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500" href="#">
      <div class="flex h-8 w-8 items-center justify-center">
        <span class="material-symbols-outlined">bar_chart</span>
      </div>
      <p class="text-[10px] font-bold uppercase tracking-wider">Analyser</p>
    </a>

    <!-- Inactive tab -->
    <a class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500" href="#">
      <div class="flex h-8 w-8 items-center justify-center">
        <span class="material-symbols-outlined">explore</span>
      </div>
      <p class="text-[10px] font-bold uppercase tracking-wider">Marknad</p>
    </a>

    <!-- Inactive tab -->
    <a class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500" href="#">
      <div class="flex h-8 w-8 items-center justify-center">
        <span class="material-symbols-outlined">settings</span>
      </div>
      <p class="text-[10px] font-bold uppercase tracking-wider">Inställningar</p>
    </a>

  </div>
</nav>
```

**Key details:**
- Active tab: `text-primary`, icon gets `bg-primary/10` circle + `FILL 1` for filled icon
- Inactive tab: `text-slate-400 dark:text-slate-500`, no icon background
- `pb-8` accounts for iPhone safe area

---

## 8. Layout Patterns

### Page Shell (Mobile App Wrapper)

Use this as the root structure for every screen.

```html
<body class="bg-background-light dark:bg-background-dark font-display
  text-[#160d1c] dark:text-white antialiased">

  <div class="relative flex min-h-screen w-full max-w-[430px] mx-auto
    flex-col bg-background-light dark:bg-background-dark
    overflow-x-hidden shadow-2xl">

    <header>...</header>

    <main class="flex-1 overflow-y-auto px-6 py-6 space-y-6">
      <!-- Screen content -->
    </main>

    <nav class="sticky bottom-0 ...">...</nav>
  </div>
</body>
```

### Sticky Bottom CTA (Floating over content)

For screens where a primary action floats above the content with a blurred background.

```html
<div class="absolute bottom-0 left-0 right-0 p-6
  bg-background-light/80 dark:bg-background-dark/80
  backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50">

  <button class="w-full bg-primary text-white font-bold py-4 rounded-full
    shadow-lg shadow-primary/20 flex items-center justify-center gap-2
    transition-transform active:scale-95">
    Det här låter intressant
    <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
  </button>

  <!-- Home indicator bar -->
  <div class="mt-6 flex justify-center">
    <div class="w-32 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
  </div>
</div>
```

When using a sticky bottom CTA, add `pb-32` to the `<main>` element so content isn't hidden behind it.

### Footer Info Line

```html
<div class="mt-12 flex items-center justify-center gap-2
  text-xs font-medium text-[#794b9b]/70">
  <span class="material-symbols-outlined text-sm">location_on</span>
  <span>Använder realtidsdata för din lokala marknad</span>
</div>
```

---

## 9. AI Elements

### AI Identity Badge

```html
<div class="flex items-center gap-3">
  <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center
    text-white border-2 border-white dark:border-zinc-800 shadow-md">
    <span class="material-symbols-outlined">smart_toy</span>
  </div>
  <div>
    <h4 class="font-bold text-sm">Enrico</h4>
    <p class="text-[10px] text-primary font-bold uppercase tracking-widest">AI Agent</p>
  </div>
</div>
```

### AI Chat Bubble (with Arrow)

```html
<div class="bg-primary/5 dark:bg-primary/10 rounded p-5 relative">
  <!-- Triangle pointer -->
  <div class="absolute -top-2 left-4 w-4 h-4 bg-primary/5 dark:bg-primary/10"
    style="clip-path: polygon(50% 0%, 0% 100%, 100% 100%)"></div>

  <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
    Eskilstuna centrum har en mättnad av traditionella caféer,
    men det finns en tydlig lucka för
    <span class="text-primary font-bold">hantverksbagerier</span>.
  </p>
</div>
```

### AI Avatar — Large (with Online Indicator)

```html
<div class="relative">
  <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-purple-400 p-1">
    <div class="w-full h-full rounded-full bg-white dark:bg-slate-900
      flex items-center justify-center overflow-hidden">
      <span class="material-symbols-outlined text-4xl text-primary">smart_toy</span>
    </div>
  </div>
  <div class="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full
    border-4 border-background-light dark:border-background-dark"></div>
</div>
```

### Score Ring

Requires one line of custom CSS. Calculate degrees as `(score / 100) * 360`.

```css
/* For score 92: 92/100 * 360 = 331.2deg */
.circular-progress {
  background: conic-gradient(#9719f0 331.2deg, #ddcfe8 0deg);
}
```

```html
<div class="relative flex items-center justify-center">
  <div class="w-48 h-48 rounded-full circular-progress
    flex items-center justify-center shadow-lg">
    <div class="w-40 h-40 bg-background-light dark:bg-background-dark
      rounded-full flex flex-col items-center justify-center shadow-inner">
      <span class="text-4xl font-black text-primary">92</span>
      <span class="text-xs font-medium text-primary/60 uppercase tracking-widest">Score</span>
    </div>
  </div>

  <!-- Floating label -->
  <div class="absolute -bottom-4 bg-primary text-white px-4 py-1.5 rounded-full
    text-sm font-bold shadow-lg flex items-center gap-1">
    <span class="material-symbols-outlined text-sm">trending_up</span>
    Hög potential
  </div>
</div>
```

---

## 10. List Items

### Niche / Feature List Item

```html
<div class="bg-white dark:bg-slate-900 p-4 rounded border border-slate-100
  dark:border-slate-800 flex items-start gap-4
  transition-all hover:border-primary/30">

  <div class="w-12 h-12 rounded-full bg-primary/10
    flex items-center justify-center shrink-0">
    <span class="material-symbols-outlined text-primary">shopping_bag</span>
  </div>

  <div class="flex-1">
    <div class="flex justify-between items-start">
      <h4 class="font-bold text-[#160d1c] dark:text-white">Fokus på Takeaway</h4>
      <span class="bg-primary/10 text-primary text-[10px] font-bold
        px-2 py-0.5 rounded-full">HÖG GAP</span>
    </div>
    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
      Hög efterfrågan men få alternativ i centrum under lunchtid.
    </p>
  </div>
</div>
```

### Checklist / Step List

```html
<div class="bg-white dark:bg-white/5 rounded p-2"
  style="box-shadow: 0 2px 12px -2px rgba(0,0,0,0.08)">

  <!-- ✅ Completed step -->
  <div class="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-white/5">
    <div class="size-6 rounded-full border-2 border-primary
      flex items-center justify-center bg-primary text-white">
      <span class="material-symbols-outlined text-sm leading-none">check</span>
    </div>
    <div class="flex flex-col">
      <p class="font-bold text-sm text-[#160d1c] dark:text-white">Registrera företagsnamn</p>
      <p class="text-xs text-slate-500">Klart hos Bolagsverket</p>
    </div>
  </div>

  <!-- ⬚ Pending step (with external link) -->
  <div class="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-white/5">
    <div class="size-6 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
    <div class="flex flex-col">
      <p class="font-bold text-sm text-[#160d1c] dark:text-white">Ansök om F-skatt</p>
      <p class="text-xs text-slate-500">Logga in på Skatteverket</p>
    </div>
    <span class="material-symbols-outlined ml-auto text-slate-400 text-lg">open_in_new</span>
  </div>

  <!-- ⬚ Pending step (with chevron) -->
  <div class="flex items-center gap-4 p-4">
    <div class="size-6 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
    <div class="flex flex-col">
      <p class="font-bold text-sm text-[#160d1c] dark:text-white">Öppna företagskonto</p>
      <p class="text-xs text-slate-500">Välj en partnerbank i appen</p>
    </div>
    <span class="material-symbols-outlined ml-auto text-slate-400 text-lg">chevron_right</span>
  </div>
</div>
```

---

## 11. Utility Patterns

### Glass-Morphism Background

```html
class="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md"
```

### iOS-Style Shadow

```css
.ios-shadow {
  box-shadow: 0 2px 12px -2px rgba(0, 0, 0, 0.08);
}
```

### Hover Scale Image

```html
<div class="overflow-hidden relative group">
  <img class="w-full h-full object-cover transition-transform duration-500
    group-hover:scale-105" src="..." />
</div>
```

### Gradient Overlay (on images)

```html
<!-- Bottom-heavy (for text on image) -->
<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

<!-- Stronger bottom (for hero images) -->
<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
```

### Active Press Effect

Always use on tappable elements:

```html
class="transition-transform active:scale-95"    /* buttons */
class="hover:scale-105 transition-transform"     /* FAB */
class="active:scale-[0.98]"                      /* large buttons */
```

---

## Quick Reference — Icon Names

Common Material Symbols used across screens:

| Icon | Name | Usage |
|------|------|-------|
| 🏠 | `home` | Tab bar |
| 📊 | `bar_chart` | Analytics tab |
| 🧭 | `explore` | Market tab |
| ⚙️ | `settings` | Settings tab |
| 👤 | `person` | Profile tab |
| ← | `arrow_back_ios_new` | Back navigation |
| → | `arrow_forward` | CTA arrows |
| 🚀 | `rocket_launch` | Logo icon |
| 🤖 | `smart_toy` | AI avatar |
| ✨ | `auto_awesome` | AI sparkle |
| 📍 | `location_on` | Location markers |
| 👥 | `groups` | Competitors |
| ⭐ | `star` | Ratings |
| 🎉 | `celebration` | Success states |
| 📈 | `trending_up` | Positive trend |
| ☕ | `coffee` | Café-related |
| 🌙 | `nights_stay` | Evening theme |
| 🌿 | `eco` | Sustainability |
| 🛍️ | `shopping_bag` | Commerce |
| 🏪 | `storefront` | Business |
| 🧾 | `receipt_long` | Invoice |
| 💬 | `forum` | Consultation |
| ✅ | `check` | Completed step |
| ✅ | `task_alt` | Steps tab (filled) |
| ↗️ | `open_in_new` | External link |
| › | `chevron_right` | Internal navigation |
| ⋯ | `more_horiz` | More options |
| 📤 | `share` | Share action |
| ➕ | `add` | FAB |
| ❓ | `help` | Help button |

**Filled icon variant** (for active tab bar icons):

```html
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">home</span>
```
