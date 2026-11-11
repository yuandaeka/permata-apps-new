# PERMATA Monorepo (Next.js 16 + Turborepo)

Platform integrasi pendidikan resiliensi mental untuk pertumbuhan pasca-trauma berbasis kearifan lokal Nusantara.

Proyek ini telah dimigrasi ke **Next.js 16 (App Router + Turbopack)** dengan arsitektur **Turborepo Monorepo** menggunakan package manager **pnpm**.

---

## 🏗️ Struktur Monorepo

```tree
permata-apps-new/
├── apps/
│   └── web/                         # Next.js 16 App Router application (@permata/web)
│       ├── public/                  # Standalone HTML games, audio, tiles, and images
│       │   ├── audio/               # Background audio & sound effects (bgm.mp3, quake.mp3)
│       │   ├── tiles/               # Tilemaps & tilesets untuk game Phaser
│       │   ├── Breathing.html       # Standalone ZenBreath Game
│       │   ├── PickAndDrop.html     # Standalone Disaster Ready Game
│       │   └── SiagaMinang.html     # Standalone Siaga Minang Game
│       ├── src/
│       │   ├── app/                 # Next.js 16 App Router routes & API endpoints
│       │   │   ├── page.tsx         # Landing Page (/)
│       │   │   ├── dashboard/       # Dashboard (/dashboard)
│       │   │   ├── jurnal/          # Jurnal Hikmah (/jurnal)
│       │   │   ├── game-quake/      # Phaser Disaster Evacuation Game (/game-quake)
│       │   │   ├── game-healing/    # Pinch and Drop (/game-healing)
│       │   │   ├── game-adventure/  # Adventure Budaya (/game-adventure)
│       │   │   ├── game-breath/     # Breathing Calm (/game-breath)
│       │   │   ├── game-siagaminang/# Siaga Minang (/game-siagaminang)
│       │   │   ├── roleplay/        # Roleplay Psikoedukasi (/roleplay)
│       │   │   ├── tele-screening/  # Tele-Screening & Triage DASS (/tele-screening)
│       │   │   ├── ai-companion/    # AI Mental Support Companion (/ai-companion)
│       │   │   ├── mood-food/       # Mood + Food AI Analyzer (/mood-food)
│       │   │   └── api/             # Next.js Serverless Route Handlers
│       │   │       ├── chat/        # POST /api/chat (Gemini AI Chat)
│       │   │       └── mood-food/   # POST /api/mood-food (Gemini Multimodal)
│       │   ├── components/          # Reusable page components & layout
│       │   ├── context/             # CultureContext (Geo-Cultural Tagging: Aceh / Sumbar)
│       │   ├── data/                # DASS questions data
│       │   ├── game/                # Phaser 3 scenes & configuration
│       │   └── utils/               # DASS scoring & calculation utilities
│       ├── next.config.ts           # Next.js 16 configuration
│       └── package.json
│
├── packages/
│   ├── ui/                          # Shared UI Component Library (@permata/ui)
│   │   ├── src/
│   │   │   ├── HopeTree.tsx         # HopeTree component
│   │   │   └── index.ts
│   │   └── package.json
│   └── config-tailwind/             # Shared Tailwind CSS presets (@permata/config-tailwind)
│       ├── tailwind.config.ts
│       └── package.json
│
├── turbo.json                       # Turborepo task pipeline configuration
├── pnpm-workspace.yaml              # pnpm workspace definition
└── package.json                     # Root monorepo workspace scripts
```

---

## 🚀 Perintah (Commands)

Pastikan menggunakan `pnpm` sebagai package manager.

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Jalankan Mode Development (Turbopack)

```bash
pnpm dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

### 3. Build Semua Package (Turborepo)

```bash
pnpm build
```

### 4. Jalankan Production Server

```bash
pnpm --filter @permata/web start
```

---

## 🌟 Fitur & Halaman yang Dimigrasi 1:1

- **Geo-Cultural Tagging**: State tema dinamis Aceh vs Sumatera Barat melalui `CultureContext`.
- **Landing Page**: UI, animasi Framer Motion, copywriting, navigasi.
- **Dashboard**: HopeTree, daily goals, shortcut modul resiliensi dan game center.
- **Jurnal Hikmah**: Refleksi budaya lokal dan integrasi AI.
- **Phaser 3 Game (Sigap Bencana)**: Render client-side Phaser 3 engine dengan audio BGM & Quake, tilemap Tiled, dan kuis interaktif UI.
- **Mini Game Standalone**: Breathing, Pick & Drop, Siaga Minang dilayani secara statis melalui `/public/`.
- **Tele-Screening & Triage**: Kalkulasi skor DASS-21 (Depresi, Kecemasan, Stres) dan interpretasi hasil.
- **AI Mental Support Companion**: Chatbot Gemini AI (`gemini-2.5-flash`) dengan deteksi krisis otomatis hotline 119.
- **Mood + Food AI Analyzer**: Analisis multimodal upload gambar / kamera untuk nutrisi dan emosi.
