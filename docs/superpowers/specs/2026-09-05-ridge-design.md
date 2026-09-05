# Ridge Design

> **Status:** Approved
> **Date:** 2026-09-05
> **Product:** Ridge — professional trajectory instrument

Ridge answers one question: **am I becoming a better engineer?**

It is not a task list, habit tracker, knowledge wiki, or career tracker. It is the ridge line of a professional life: past actually built, present stood on, future walked toward.

**Don't collect knowledge. Build evidence.**

---

## 0. Audience and evolution

**Now:** a personal instrument for one professional path.

**Later:** other people may walk their own ridge. The model must not block that.

**How later works:** one person = one vault. Multi-user is multiple vaults with the same file contract, not accounts bolted onto a private store. v1 has no accounts, auth, sharing, or multi-vault UI.

---

## 1. Spine

### Three layers

1. **Vault** — a folder the user owns. Chronological `events/` markdown files are the only source of truth. Git may wrap the vault. Git is not the capture loop.
2. **Core** — headless. Reads and writes the vault. Extracts candidate meaning. Builds a disposable index. Composes views. Never a second source of truth. Fully rebuildable from files.
3. **Surfaces** — UI and CLI call the same Core. Same capture. Same views. Later people = later vaults, same format.

### Laws

- Body of an event = what happened. Frontmatter = current interpretation. Interpretation is reversible.
- Knowledge, skills, projects, maps = derived views. The user never gardens them.
- The user declares the far destination. Core may propose the next bottleneck from evidence. The user confirms or rejects. Silence is not a goal.
- Automation may later find candidate evidence. It never decides that the user grew.
- Feature gate: *how does this help build the professional path?* If that is unclear, it does not enter Ridge.

### Inner loop

Write → save → done. One box. Capture never requires placing, classifying, or committing.

### Home

**Where am I going?** Capture is one gesture away, never the homepage.

---

## 2. Vault file contract

The vault is a folder the user owns. Ridge never rearranges it into skills. The filesystem is a timeline of evidence, not a taxonomy of a career.

```text
ridge-vault/
  ridge.yaml
  events/
    2026/
      09/
        2026-09-05-bun-http.md
        2026-09-05-docker-network.md
  reflections/
    2026-q3.md
```

### Folders

- `events/YYYY/MM/` — when something happened. Never a skill or concept name.
- `reflections/` — optional user-owned narratives. Not evidence.
- Filenames are dated hints (`YYYY-MM-DD-slug.md`), not identity. Identity is the stable `id` inside the file. Rename freely. Slug may change; the event does not.

### Event file

One event = one markdown file with YAML frontmatter and a markdown body.

**Body = what happened.** The original human-written event. Frozen after capture. If Ridge vanished, this paragraph would still be the memory.

**Notes / annotations** are stored independently from the body. The markdown after frontmatter is exclusively the frozen body, preserved byte-for-byte as the user wrote it. User-authored headings (including `## Notes`) are body text, never a parser boundary. Annotations live in optional frontmatter `notes` (a markdown string). Later understanding does not rewrite what happened. Notes are never copied into the body.

**Frontmatter = current interpretation.** Reversible. Changing it does not rewrite the event.

```yaml
id: evt_01JEXAMPLE
created: 2026-09-05T18:42:00Z
created_offset: "+03:30"
interpretation: pending
kinds: [debugged]
concepts: [docker, networking]
projects: [bunmark]
notes: ""
```

Field rules:

| Field | Rule |
|---|---|
| `id` | Stable unique id, `evt_` + ULID. Assigned at capture. Never reused. Survives rename. |
| `created` | Immutable capture time, stored as UTC (`Z`). |
| `created_offset` | Original UTC offset at capture (e.g. `+03:30`). Immutable. Display uses this. |
| `interpretation` | `pending` \| `confirmed`. Meaning-state, not reality-state. Pending events are still valid evidence because the body is already true. |
| `kinds` | Optional. Empty is valid. Multiple allowed. Closed set only. |
| `concepts` | Reversible human-readable names. Not hidden canonical database ids. |
| `projects` | Same as concepts. |
| `notes` | Optional markdown string. Independent of body. Never merged into body. |

Closed kind vocabulary:

`learned` `built` `broke` `debugged` `shipped` `documented` `decided` `experimented`

An event may exist untyped. Classification serves the growth loop, not the capture moment.

### `ridge.yaml`

Holds user-authored state that cannot be derived:

- format version
- declared destination (the peak), or empty
- confirmed next step, or none
- optional current-milestone text (user-authored)

Destination, confirmed next step, and current milestone are user-authored state. Projections and indexes may read them but never mutate them.

Gaps in the index are not goals. Proposed next steps are not written here until the user explicitly accepts (a Core write of `ridge.yaml`, never an index write).

### Generated, never stored as truth

Concept graph, skill map, timeline, home trajectory, “what changed.” Core may keep an index beside the vault (e.g. `.ridge/index`) for speed. Delete it; Core rebuilds from files. The index is deterministically rebuildable from the vault.

### Git

May wrap this tree for backup, history, sync, later collaboration. Capture does not commit. Inner loop remains: write → save → done.

### Evidence vs reflection

- `events/` = evidence source of truth.
- `reflections/` = user-owned narratives derived from evidence. Never themselves treated as evidence. They never feed stacks, the path, or growth claims.

---

## 3. Core

Core is headless. Surfaces call it. It never owns truth.

**Vault = truth. Core = interpretation / index / views. Surfaces = interaction.**

### Capture

1. User submits one box of prose (optional kinds if chips were tapped).
2. Core writes a new event file immediately:
   - immutable `created` (UTC) + `created_offset`
   - frozen body = exactly what was written
   - `interpretation: pending`
   - `kinds` only if provided
   - `concepts` / `projects` empty until confirmed
3. Done. The event is immediately part of the evidence timeline. “On the ridge” does not imply it already has a semantic position.

Capture invariants:

- **Atomic write.** Event creation is atomic (write temp file in the same directory, then rename). A failed capture must never leave a partially written event file.
- **No overwrite.** Capture must never overwrite an existing event. If the intended filename exists, resolve the collision with a numeric suffix (`-2`, `-3`, …). The stable `id` does not change.
- **Interpretation is optional.** Capture does not wait on it. If the proposal provider fails or is unavailable, the event is still saved with `interpretation: pending`. Proposal output is never truth until an explicit user action confirms it.

### Propose meaning

Interpretation is an optional proposal provider. It may fail or be unavailable without affecting capture. Its output is never truth until an explicit user action confirms it.

After write, Core may extract candidate names from the sentence and show guesses. The user keeps or dismisses.

- Keep → those names go into frontmatter as human-readable strings.
- Dismiss → those guesses are not stored as truth.
- Completing a keep/dismiss pass (including “accept with no names”) sets `interpretation: confirmed`.
- Doing nothing → `interpretation` stays `pending`. Guesses are not written as metadata and do not place the event on the map. The event still counts as evidence.

Rename, merge, or split of concepts/projects updates frontmatter **only as an explicit user action**. Core never autonomously gardens or rearranges the vault. Bodies are never rewritten.

### Index

A disposable materialized view from all event files: by time, by kind, by concept name, by project name, by interpretation state.

- Deterministically rebuildable from the vault.
- Delete and rebuild equals the previous index for the same vault.
- Never a second source of truth.
- Never served if the vault is newer than the index; rebuild first.

### Views Core enables (does not store as truth)

Views are derived projections. They may summarize, filter, or interpret existing evidence, but they never become a source of truth.

- **Trajectory (home)** — past from pending+confirmed events, conservative current position, declared peak, next step only if confirmed.
- **Evidence stack** — events whose confirmed concept/project metadata currently includes that name, grouped by kind. Pending events are excluded until a name is explicitly confirmed.
- **Timeline** — chronological events, optionally filtered by kind.
- **What changed** — derived interpretation over a window, traceable to events.
- **Reflection draft** — optional proposal the user may edit into `reflections/`. Saving that file does not create events.

### What Core refuses

- Treating a GitHub import, a gap, or an unconfirmed guess as growth.
- Writing destination or next-step into the index instead of `ridge.yaml`.
- Moving files into skill folders.
- Rewriting event bodies to clean up meaning.
- Autonomous rename / merge / split.
- Inventing a destination.

---

## 4. Home: Trajectory

Opening Ridge is not “what are today’s tasks.” It is **Where am I going?**

```text
Past ──────────────── ● ──────────────── Future
                      YOU
```

### Left — evidence

What actually happened. Pending and confirmed events both appear on the timeline. Pending has no semantic position yet. This is proof, not a skill list.

### Center — you

A short, **conservative, evidence-backed** reading of current position, derived from recent evidence plus the last confirmed next step.

Ridge must not turn a handful of events into an unsupported professional title. If evidence is insufficient, say so or use softer language (e.g. “currently exploring backend/runtime engineering”).

This is a view, not a title the user gardens.

### Right — declared future

The peak the user set in `ridge.yaml`. Empty right side is valid. Ridge does not invent a destination.

A proposed bottleneck may appear as a suggestion, visually weaker than a confirmed next step. Accept writes `ridge.yaml`. Dismiss leaves the right side unchanged. Silence never becomes a goal.

**Next milestone** is the user’s words, not a generated OKR.

### Always on this page: What changed

Default window: last 90 days.

Not a ritual. Not a reduction to counts. Counts are supporting evidence. The meaningful part is a concise, evidence-backed interpretation that can be traced back to the events behind it (learned / built / shipped / struggled / changed / next).

### Knowledge and Projects on home

Indexes into evidence — names that currently appear on confirmed event metadata. Tapping one opens the evidence stack, not a wiki page to fill.

Counts mean event counts of a kind, not skill scores. A name has no evidentiary weight without linked evidence.

### Capture on home

One global gesture (quick-add / shortcut). Does not navigate off the path. After save, the new event is on the timeline immediately; guessed links wait for keep/dismiss without blocking orientation.

Footer line: **Don’t collect knowledge. Build evidence.**

---

## 5. Capture + meaning

The only other day-one interaction. Cheaper than thinking.

### Gesture

From anywhere: shortcut, quick-add, or CLI. Trajectory stays on screen. No “logging workflow.”

### The box

One field. Write what happened. Optional kind chips. Skip them. Submit.

### Write is the success

Core creates the event file immediately. Capture time frozen. Body frozen. `interpretation: pending`. Event on the timeline. User is done even if they close the box now.

### Meaning is a second, skippable beat — not a form

After save, guessed names as chips (concepts / projects). Keep or dismiss. Doing nothing leaves them pending.

**Never asked at capture:** where on the map, which skill folder, destination, next bottleneck, git commit.

### Later, explicit only

Open an event → add notes (separate from body) → confirm/change kinds → keep/dismiss/rename names. Rename/merge/split is a deliberate action.

### CLI — same loop

```text
ridge add "debugged Docker networking"
```

Writes the file. Optional `--kinds`. Meaning confirmation via `--confirm` or a later `ridge interpret`. Capture never requires a commit.

---

## 6. Other views and refusals

### Evidence stack

Open a name (Docker, Bunmark). Not a wiki. Events whose **confirmed** concept/project metadata currently includes that name, grouped by the growth loop.

Pending events appear on the global Timeline, but not in a named Evidence Stack until their concept/project name is explicitly confirmed. Unconfirmed guesses are not stored as metadata and therefore cannot place an event on a stack.

Empty kinds sit in an untyped group.

“I know X” is only as strong as this stack. A name has no evidentiary weight without linked evidence.

### Timeline

Chronological evidence, by year/month, matching the filesystem. Filter by kind to see the loop, not to score days. Clicking opens the event document (body frozen, notes separate, interpretation editable). Never grouped by skill.

### Reflection

Home already shows traceable “what changed.” Deeper reflection is optional: user asks; Core drafts from events; user edits; saves under `reflections/` as their narrative. That file is not evidence.

Growth is visible continuously. Reflection is intentional, not mandatory.

### Surfaces

Same Core: UI (orient + capture gesture) and CLI (same write → save → done).

Views are derived projections. They may summarize, filter, or interpret existing evidence, but they never become a source of truth.

### Refuse (v1)

If it cannot answer “how does this help build my professional path?” it stays out.

Explicitly out of v1:

- task lists, streaks, hours, XP, leaderboards, skill scores
- auto-destination, silent goals
- GitHub-as-truth, auto-ingest as source of truth
- knowledge wiki the user must fill
- skill folders
- capture that requires commit
- autonomous rename/merge
- treating reflections as evidence
- accounts / sharing / multi-vault UI
- databases, queues, extra services

---

## 7. Architecture

Minimal. Three things: vault on disk, Core operations, disposable projections.

### Modules

| Module | Does | Does not |
|---|---|---|
| `vault` | Read/write event files, `ridge.yaml`, reflections. Parse markdown + frontmatter. Atomic creates. Collision-safe filenames. | Interpret, graph, rewrite bodies; mutate destination/next-step except via explicit APIs |
| `capture` | Create event file from one box. Freeze `created` + body. `interpretation: pending`. Atomic. Never overwrite. | Place on map, confirm names, wait on interpret |
| `interpret` | Optional proposal provider. Produce proposals from body. Apply keep/dismiss/rename/merge only on explicit user action. | Autonomously garden; mutate metadata without an explicit action; block or undo capture |
| `index` | Deterministically rebuild materialized view from files. | Persist as truth |
| `views` | Not a domain-logic container. Projection/query layer: Trajectory, Evidence Stack, Timeline, What Changed, Reflection Draft composed from Core data. | Own truth; hide in UI |

UI and CLI are thin callers. No domain logic in surfaces. UI calls Core; views compose from Core data; UI does not contain view-domain logic.

No extra services, queues, or databases in v1. If speed is needed, the index is a cache file next to the vault, deletable. No database/queue/service layer unless a concrete requirement forces one.

### Data flow

```text
prose  →  capture  →  events/*.md          (truth)
                ↘
            interpret proposals
                ↘  explicit keep/dismiss
            frontmatter                    (reversible metadata)
                              ↓
                         index rebuild     (disposable, deterministic)
                              ↓
              trajectory / stack / timeline / what-changed
```

Interpretation produces proposals. Only explicit user actions mutate event metadata.

Reflection: views draft → user edits → `reflections/*.md`. Never flows back into evidence.

### Errors

- Vault missing / unreadable → fail. Do not invent a vault.
- Corrupt event files are excluded from projections but surfaced explicitly as errors/warnings. No data is silently discarded.
- Index stale or missing → rebuild from files. Never serve index if vault is newer.
- Propose-meaning failure → event already saved; meaning stays pending.
- Confirm next-step / destination → write `ridge.yaml` or fail; never write goals into the index.

### Tests

- Capture writes a valid event file; body unchanged; `created` immutable with timezone/offset.
- Capture is atomic: a failed write leaves no partial event file.
- Filename collision never overwrites; id stays stable.
- A body containing `## Notes` remains entirely body; annotations live only in frontmatter `notes`.
- Pending event is on the timeline; not in a named Evidence Stack until names are confirmed.
- Interpret failure does not affect the saved event.
- Rebuild index from files equals previous index (same vault). Deterministic.
- Index rebuild does not mutate `ridge.yaml`.
- Rename/merge of a concept updates frontmatter only after explicit action; bodies untouched.
- Reflection file does not appear as evidence.
- Corrupt file is reported, excluded from projections, still present on disk.
- Feature-shaped: no skill folders created; no destination invented; hours/XP/streaks do not exist.

---

## 8. v1 success

v1 is done when:

1. The user can open Ridge and see a trajectory (past / you / future), not a task list.
2. The user can capture an event in seconds from one gesture; a file exists in `events/YYYY/MM/` immediately.
3. The event body is frozen; interpretation can stay pending; the event still appears on the timeline.
4. Keep/dismiss of guessed names is optional and reversible; Core never gardens on its own.
5. Home “what changed” is a traceable interpretation, not a score.
6. Destination and next step exist only if the user declared / confirmed them.
7. Deleting the index and rebuilding yields the same projections.
8. If Ridge the app disappeared, the vault would still be a readable professional history.

---

## 9. Out of scope until a later spec

- Auto-discovering evidence from GitHub, deploys, or calendars (may propose candidates; never truth).
- Multi-vault / other people.
- Git as an inner-loop operation.
- Canonical concept ids, global taxonomies, or skill ontologies.
- Mobile-native apps.
- The existing documentation website in this workspace is a separate product surface; this spec does not redesign it.
