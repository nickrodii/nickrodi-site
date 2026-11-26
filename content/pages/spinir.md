---
title: spinir
description: A social platform for cataloging and rating physical music collections, built as a React web app and a native SwiftUI iOS app on a shared Supabase backend.
eyebrow: Page
backHref: /#projects
---

![spinir](/images/projects/spinir.png)

`spinir` is a social platform for tracking, rating, and showing off a physical music collection — vinyl, CDs, and cassettes. It is live at [spinir.app](https://spinir.app), and ships as two clients against one backend: a React single-page web app and a native SwiftUI iOS app.

The project covers the whole stack: the two front ends, the Postgres schema and its access rules, a catalog service built from public music-industry data dumps, and the Linux server the whole thing runs on.

## Overview

**Clients**

- Web: React 19, Vite 8, Tailwind v4, react-router, Motion
- iOS: SwiftUI, iPhone and iPad, minimum iOS 27, Live Activities and home-screen widgets
- Both clients talk to the same Supabase project and the same catalog API

**Backend**

- Supabase: Postgres, Auth, and Storage
- 52 ordered migrations defining schema, policies, triggers, and stored procedures
- Catalog and link-preview services written in Python, running under systemd
- Caddy and Cloudflare in front, on an Ubuntu dedicated server

**Scale of the dataset**

- ~13.4M vinyl and CD pressings across ~7.0M albums
- ~1.23M pressings with matched cover art
- A 2.1 GB SQLite catalog built from ~26 GB of source dumps

## Access Control Lives in the Database

Neither client holds a privileged key. The web app and the iOS app both ship with nothing but Supabase's publishable key, and every rule that matters is enforced inside Postgres:

- **Row-level security** on every table, with policies written against `(select auth.uid())`
- **Helper functions** in a private schema — `private.is_reviewer()`, `private.is_admin()`, `private.can_see_shelf(owner)`, `private.is_terminated()` — so policies stay readable and consistent
- **Security-definer RPCs** for anything that needs to reach past a caller's own rows: `submit_pressing`, `search_albums`, `import_catalog_album`, `profile_stats`, `top_listens`, `terminate_account`, and others
- **Triggers** for derived state — profile creation on email verification, rating aggregates, listen counts, reputation credits

The practical result is that adding a second client was a front-end problem only. The iOS app reuses the same tables, the same policies, and the same RPCs as the website, and inherits every rule for free.

## The Catalog

Users should not have to type in an album that already exists in the world's music databases, so spinir builds its own searchable catalog from public data.

**Sources**

- Discogs monthly CC0 data dumps (~12 GB) — releases, masters, formats, labels, countries
- MusicBrainz export tables (~14 GB) — used to bridge Discogs releases to cover art
- Cover Art Archive — front images, matched through MusicBrainz by Discogs URL links, then by normalized title and artist
- Deezer public API — album runtimes and artist pictures, by exact title/artist match only

**Build pipeline** (`server/catalog/`)

| Module | Responsibility |
| --- | --- |
| `build.py` | Parses the dumps and assembles `catalog.db` |
| `discs.py` | Derives disc color, transparency, size, issue tags, and genres from Discogs format text |
| `covers.py` | Matches and caches cover images |
| `runtimes.py` | Resolves a runtime per pressing, with fallbacks |
| `safety.py` | Image moderation checks |
| `server.py` | The HTTP service the clients query |

Search is SQLite **FTS5**, ranked by text match combined with pressing count, so a well-known record outranks an obscure one with a similar title.

**Look-alike collapsing.** Discogs lists every Limited / Exclusive / Reissue variant separately, but a person holding a record usually cannot tell which one they own. So pressings that look identical are collapsed into one entry: for vinyl, same size, disc color, clear-or-not, and year; for CDs and cassettes, same size and year. Anyone who genuinely has a distinct pressing adds it by hand.

## Content Moderation

No music database flags explicit cover art — Discogs and MusicBrainz "explicit" flags describe lyrics, not artwork — and paying per image was not an option. So every cover is judged **on spinir's own server, by a local model, at no per-image cost**.

**The small classifier did not work.** The first attempt was `image-safety-classifier-m`, a 46 MB ONNX model. It reads bare skin as nudity (a shirtless Harry Styles scored 0.92) while scoring almost everything else at ~0.03 — Nirvana's *Nevermind* at 0.04, Cannibal Corpse's gore also at 0.04. A threshold that catches the gore catches every beach photo too, so it was dropped as a judge.

**What replaced it** is a real vision-language model running locally: **Qwen3-VL 4B Instruct** (Apache-2.0, Q4\_K\_M GGUF, ~3 GB), served by `llama.cpp`'s `llama-server` as a systemd unit on `127.0.0.1`, pinned to 6 of 12 threads at `nice 10` with a 6 GB memory cap so it never starves the other services on the box.

### Describe, then judge

The 4B model describes images well but answers yes/no questions about them badly. Asked directly, it called a robe-covered lap, a baby, and the Rolling Stones tongue logo explicit. So the pipeline never asks it to judge a picture:

1. **First look** (336px, ~5s) — a cheap pass whose only job is clearing plainly fine covers. A "yes" here means *maybe*, not *flagged*.
2. **Describe** (672px) — the model states what is actually visible: which body parts are bare, adult or infant, any sexual act; or any wounds, exposed organs, dismemberment, and whether the image is a painting.
3. **Judge** (text only) — a separate text-only prompt applies the policy to that written description.

Resolution mattered: at 448px the model mistook *The Death of Marat* for exposed organs, so the describe step runs at 672.

The policy is deliberately narrow — blur only rare, extreme cases, with context. Not nude art, not bare breasts, not a non-sexual nude, not blood in a painting, not skeletons or scary-looking zombies. Against a hand-built 25-cover test set spanning both the obvious cases and the deliberately tricky ones, it gets **23 right**, with the two misses on genuinely borderline covers where either answer is defensible.

### Serving it without anyone waiting

Inference takes ~5s for most covers and ~18–20s for one the first look flags, which is far too slow to block a page:

- A cover ships **immediately** with a provisional answer and a `no-store` header
- Clients show it blurred with a spinner and "Checking…" while polling every ~2s
- The answer **updates the image live**, with no refresh
- One background worker judges covers one at a time — two in parallel made each take twice as long — prioritizing covers on a page somebody actually has open, then the newest
- Final answers are cached for a year; verdicts live in a database kept separate from the catalog, so rebuilding the catalog never loses them
- When the policy changes, every stored answer is re-queued, uploads included

Because the verdict rides on an `X-Adult` response header, covers are always proxied through the service rather than served straight off disk. Blurring is a per-user setting, on by default.

## Authentication

Three ways in, on both platforms:

- **Email and password** with verification required, sent through Resend from the project's own domain
- **Google** — on the web, Google Identity Services' own button is rendered invisibly over a look-alike button so the consent screen shows spinir rather than a Supabase subdomain, then `signInWithIdToken`. On iOS, no SDK: Google's page in a system web sign-in sheet with code + PKCE + nonce
- **Apple** — Sign in with Apple JS on the web and `SignInWithAppleButton` on iOS, both hashing a nonce and finishing with `signInWithIdToken`, which avoids needing a rotating client secret

## The iOS App

The app is built to feel native rather than like a wrapped website.

- **Tab transitions** are a custom `UITabBarController` delegate that returns a real animator, so both live pages slide side by side in one spring instead of cross-fading. The top bar holds still when both tabs are on their first page
- **Shelf gestures** are UIKit recognizers wrapped in `UIGestureRecognizerRepresentable`, because SwiftUI's `LongPressGesture.sequenced(before:)` blocked scrolling anywhere a cover was touched
- **Records behave like objects**: tap one and its disc peeks out of the sleeve, drag the disc upward to pull it into a full-screen viewer that spins at 33⅓ (45 for a 7"), with flick momentum and hand-spinning
- **Sleeves with back covers** are a real box drawn in Core Animation — front, back, and an open end with light walls — that turns under your finger
- **Image cropping** includes a perspective-straighten mode: four corner handles pull a photo taken at an angle flat via Core Image, with the disc and label rings bent to match
- **Performance work**: discs only exist while out of their sleeve, reflections are one masked strip per row, spinning discs redraw only their label, and images are shrunk once then cached in memory and on disk

## Deployment

```bash
npm run deploy   # builds, uploads assets, then index.html, fixes permissions, prunes old assets
```

- Assets upload **before** `index.html`, so the live page never references a file that is not there yet
- Static assets are served with a year-long cache and return a plain 404 when missing, rather than falling back to the SPA shell — a missing icon once got cached as HTML by Cloudflare for hours
- Link previews are a separate service: requests from preview bots are routed to a Python renderer that draws a per-record card
- Database changes are ordered migrations pushed with the Supabase CLI; no migration is ever edited after it has been pushed

## Repository Layout

```text
spinir
├── src/              React web app (pages, components, lib)
├── ios/              SwiftUI app + widgets
├── server/
│   ├── catalog/      catalog build pipeline and HTTP service
│   └── og/           link-preview renderer
├── supabase/
│   └── migrations/   every schema change, in order
└── scripts/          deploy, screenshot, and OG-card tooling
```
