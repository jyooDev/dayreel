# DayReel

Record your day clip by clip, and compile short-form reel every night.

## Tech stack

- **Framework**: Expo SDK 52+ (managed workflow, iOS-first)
- **Language**: TypeScript (strict)
- **Navigation**: Expo Router (file-based)
- **State**: Zustand
- **Local DB**: expo-sqlite
- **Auth/Remote DB**: Supabase (Auth + PostgreSQL)
- **Video**: expo-camera, expo-av, ffmpeg-kit-react-native
- **Notifications**: expo-notifications + expo-task-manager

## Commands

```bash
bun install                    # Install dependencies
bun start                     # Start Expo dev server
bun run ios                    # Start on iOS simulator
bun run android                # Start on Android emulator
bun run lint                   # Lint (expo lint)
bun run typecheck              # tsc --noEmit
bun run test                   # Run tests
```

**Always use `bun`, never `npm` or `yarn`.**

## Development workflow

1. Make a feature branch
2. Make changes
3. Commit often with clear messages (e.g. `feat: add camera viewfinder`, `fix: clip thumbnail sizing`)
4. Run `bun run typecheck`
5. Run `bun run test`
6. Run `bun run lint` before the final commit
7. Open a PR

## Database

See `.claude/rules/` for detailed specs on architecture, database schema, design tokens, and feature implementation.
