# Architecture

## Project structure

```
app/                        # Expo Router file-based routes
├── _layout.tsx             # Root layout (providers, global state)
├── (auth)/                 # Auth group (login, onboarding)
├── (tabs)/                 # Main tab navigator
│   ├── _layout.tsx         # Tab bar config
│   ├── record.tsx          # Camera screen
│   ├── calendar.tsx        # Monthly calendar
│   └── reflect.tsx         # End-of-day journal
└── player/
    └── [date].tsx          # Reel playback by date

components/                 # Reusable UI components
├── ui/                     # Primitives (Button, Card, etc.)
├── camera/                 # Camera-related components
├── calendar/               # Calendar-related components
├── reflect/                # Journal-related components
└── player/                 # Playback-related components

lib/                        # Business logic, no UI
├── supabase.ts             # Supabase client init
├── database.ts             # SQLite schema + queries
├── video/                  # Recording, compilation, file storage
├── notifications.ts        # Push notification helpers
└── background.ts           # Background task registration

stores/                     # Zustand stores
├── useClipStore.ts         # Today's clips
├── useJournalStore.ts      # Journal entries
└── useSettingsStore.ts     # User preferences

constants/                  # Static values
├── colors.ts               # Design tokens
└── config.ts               # App config

types/                      # Shared TypeScript types
└── index.ts
```

## Rules

- **One component per file.** File name matches the default export.
- **No business logic in components.** Components call hooks or `lib/` functions. They don't fetch, transform, or persist data directly.
- **Screens are thin.** A screen file in `app/` composes components and connects stores. It should not contain complex JSX trees — extract to `components/`.
- **`lib/` has zero React imports.** Everything in `lib/` is plain TypeScript. No hooks, no JSX, no React Native imports.
- **Stores are flat.** One Zustand store per domain. No nested stores or store-in-store patterns.
- **Types go in `types/index.ts`** unless they're internal to a single file.
- **Imports use path aliases.** Use `@/components`, `@/lib`, `@/stores`, `@/constants`, `@/types`.
- **No default exports except screens and the root layout.** Everything else uses named exports.
- **Co-locate tests.** Test files live next to the file they test: `Button.tsx` → `Button.test.tsx`.
