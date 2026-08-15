# Demo images — Asteria Diamond House

These are **temporary demo image paths** for local development and seed data. Replace files with real licensed brand photography before production.

Keep **filenames stable** so seed data and components do not need code changes.

## Brand direction

Asteria Diamond House is a **diamond-focused** luxury website — not a general jewellery store.

Recommended photography style:

- Minimalist diamond macro photography
- Solitaire and custom diamond rings
- Soft ivory, navy, and gold tones
- Quiet luxury — calm, refined, premium
- No busy jewellery trays or crowded displays
- No earrings, necklaces, bracelets, or fashion accessories
- No overly flashy or aggressive stock photos

## Folder structure

```
public/images/demo/
├── hero/           Homepage hero backgrounds
├── diamonds/       Loose diamond demo assets
├── rings/          Diamond ring product demos
├── settings/       Ring builder setting demos
├── create-ring/    Ring builder step card images
├── products/       Per-metal product variant images
├── consultation/   Consultation / trust section
└── placeholders/   Fallback when specific assets are missing
```

## Planned filenames

### Hero (`hero/`)

| File | Usage |
|------|--------|
| `hero-diamond-minimal.jpg` | Primary homepage hero — loose diamond close-up |
| `hero-solitaire-ring.jpg` | Alternate hero — minimal solitaire editorial |

### Diamonds (`diamonds/`)

| File | Usage |
|------|--------|
| `round-brilliant-diamond.jpg` | Round brilliant loose diamond |
| `oval-diamond.jpg` | Oval loose diamond |
| `emerald-cut-diamond.jpg` | Emerald cut loose diamond |
| `pear-diamond.jpg` | Pear shape loose diamond |
| `marquise-diamond.jpg` | Marquise loose diamond |
| `princess-diamond.jpg` | Princess cut loose diamond |
| `cushion-diamond.jpg` | Cushion cut loose diamond |
| `radiant-diamond.jpg` | Radiant cut loose diamond |
| `asscher-diamond.jpg` | Asscher cut loose diamond |
| `heart-diamond.jpg` | Heart shape loose diamond |

### Rings (`rings/`)

| File | Usage |
|------|--------|
| `oval-solitaire-ring.jpg` | Oval solitaire diamond ring |
| `round-solitaire-ring.jpg` | Round brilliant / halo solitaire ring |
| `round-halo-ring.jpg` | Round halo pavé ring |
| `emerald-cut-ring.jpg` | Emerald cut signature ring |
| `hidden-halo-ring.jpg` | Hidden halo diamond ring |
| `radiant-hidden-halo-ring.jpg` | Radiant with hidden halo |
| `cushion-split-shank-ring.jpg` | Cushion split-shank pavé |
| `princess-channel-ring.jpg` | Princess channel-set ring |
| `pear-filigree-ring.jpg` | Pear filigree yellow gold |
| `marquise-bezel-ring.jpg` | East-west marquise bezel |
| `asscher-three-stone-ring.jpg` | Asscher three-stone ring |

### Settings (`settings/`)

| File | Usage |
|------|--------|
| `classic-solitaire-setting.jpg` | Classic four-prong solitaire |
| `hidden-halo-setting.jpg` | Hidden halo setting |
| `cathedral-setting.jpg` | Cathedral solitaire setting |
| `signature-prong-setting.jpg` | Signature prong setting |

### About (`about/`)

| File | Usage |
|------|--------|
| `diana-angelaki-founder.jpg` | About page — founder portrait (Diana Angelaki) |

### Consultation (`consultation/`)

| File | Usage |
|------|--------|
| `private-diamond-consultation.jpg` | Prefer personal guidance / consultation section |
| `ring-design-consultation.jpg` | Ring design consultation |

### Placeholders (`placeholders/`)

| File | Usage |
|------|--------|
| `diamond-placeholder.jpg` | Generic diamond fallback |
| `ring-placeholder.jpg` | Generic ring fallback |
| `setting-placeholder.jpg` | Generic setting fallback |

### Create ring (`create-ring/`)

| File | Usage |
|------|--------|
| `create-ring-diamond.jpg` | Ring builder — choose diamond step |
| `create-ring-setting.jpg` | Ring builder — choose setting step |
| `create-ring-metal.jpg` | Ring builder — choose metal step |
| `create-ring-review.jpg` | Ring builder — review step |

### Products (`products/`)

Per-metal variant images for product swatches:

| File | Usage |
|------|--------|
| `product-solitaire-yellow-gold.jpg` | Yellow gold solitaire variant |
| `product-solitaire-white-gold.jpg` | White gold solitaire variant |
| `product-solitaire-rose-gold.jpg` | Rose gold solitaire variant |
| `product-solitaire-platinum.jpg` | Platinum solitaire variant |

If placeholder JPGs are also missing, the UI shows a soft ivory panel with a diamond mark — no broken image icon.

When `NEXT_PUBLIC_DEMO_ASSETS_READY=true`, missing individual files still fall back gracefully: the component tries the primary path, then an explicit fallback path, then the ivory placeholder — never a broken image icon.

## Enabling demo JPGs locally

By default, paths under `/images/demo/` render the styled UI placeholder so missing files do not trigger 404s in the dev server.

After you add licensed JPGs using the filenames above:

1. Set in `.env.local`:
   ```
   NEXT_PUBLIC_DEMO_ASSETS_READY=true
   ```
2. Restart `npm run dev`

The app will then load images from `public/images/demo/`. Keep filenames stable when replacing files.

All paths are defined in `constants/demo-images.ts`:

- `DEMO_HERO_IMAGES`
- `DEMO_DIAMOND_IMAGES`
- `DEMO_RING_IMAGES`
- `DEMO_SETTING_IMAGES`
- `DEMO_CONSULTATION_IMAGES`
- `DEMO_PLACEHOLDER_IMAGES`
- `DEMO_CREATE_RING_IMAGES`
- `DEMO_PRODUCT_VARIANT_IMAGES`

Seed data: `scripts/seed.ts`
