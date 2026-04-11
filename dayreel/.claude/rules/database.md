# Database

## Domain terms

Use these terms everywhere — code, types, columns, props, comments. No synonyms.

| Term             | Meaning                                         |
| ---------------- | ----------------------------------------------- |
| **clip**         | A single recorded video segment                 |
| **reel**         | The compiled daily video from all clips         |
| **journal**      | End-of-day reflection (voice or text)           |
| **date**         | Always `YYYY-MM-DD`, the primary organizing key |
| **compilation**  | The process of stitching clips into a reel      |
| **wake_up_time** | User's morning time, `HH:MM` format             |
| **profile**      | User account record                             |

Never abbreviate: `clip` not `clp`, `journal` not `jrnl`, `compilation` not `comp`.

## Naming conventions

- DB columns: `snake_case` — `file_path`, `created_at`, `duration_seconds`
- Types/interfaces: `PascalCase` — `Clip`, `Reel`, `Journal`
- Variables/functions: `camelCase` — `getClipsByDate`, `reelFilePath`
- Stores: `use[Domain]Store` — `useClipStore`, `useJournalStore`

## Relationships

- One **date** → many **clips** (ordered by `order_index`)
- One **date** → one **journal**
- One **date** → one **reel**
- One **profile** owns all their clips, journals, and reels

## Storage split

- **SQLite**: All metadata + settings. Source of truth. Works offline.
- **Supabase PostgreSQL**: User profiles, remote metadata sync. No video files.
- **File system**: All video/audio files in `FileSystem.documentDirectory`:
  ```
  clips/{YYYY-MM-DD}/{uuid}.mp4
  reels/{YYYY-MM-DD}.mp4
  journals/{YYYY-MM-DD}.m4a
  thumbnails/{uuid}.jpg
  ```

## Rules

- Every table must have `id` (UUID), `created_at` (ISO timestamp).
- Dates are strings (`TEXT`), never Date objects in the DB.
- Durations are always in seconds (`REAL`), never milliseconds.
- File paths stored in DB are relative to `documentDirectory`, never absolute.
- Always enable Row Level Security on Supabase tables.
- Every Supabase query must filter by `user_id`.
