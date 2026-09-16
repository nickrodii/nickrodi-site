---
title: NircraftCORE
description: The main custom plugin behind my Nircraft Minecraft server, built to power RPG systems, server-side gameplay logic, and custom progression.
eyebrow: Page
backHref: /#projects
showRepositoryReadmeNotice: true
---

![Nircraft Logo](https://cdn.modrinth.com/data/cached_images/9657e9f84d10b6110c5efb94a8a63ae31b985ba1.png)

`NircraftCORE` is the main Paper plugin that powers the Nircraft network, and is the server's core gameplay layer. The codebase owns progression, menus, collections, land/team systems, travel, duels, supporter features, market trading, Discord/network glue, and most of the custom survival rules that define the server.

The current codebase is organized as a feature-oriented monolith: one deployable plugin, split internally into domain packages and bootstrap modules instead of flat `service` / `listener` / `command` buckets.

## Overview

**Artifact**

- Maven coordinates: `com.nickrodi:nircraftcore:2.1.0`
- Main class: `com.nickrodi.nircraft.NirPlugin`
- API target: Paper `1.21.11-R0.1-SNAPSHOT`
- Java target: `21`

**Hard / soft integrations**

- Hard dependency: `WorldEdit`
- Optional integrations: `LuckPerms`, `Multiverse-Core`, `Multiverse-Inventories`, `DiscordSRV`, `FancyHolograms`, `FancyNpcs`, `Votifier`, `FastAsyncWorldEdit`

**Primary goals**

- Turn barebones Minecraft survival into a long-term progression game without replacing vanilla world interaction
- Provide first-party menus and UX for progression, stats, market, supporter perks, teleportation, and tutorials
- Keep network-specific logic in one place, including Discord bridge behavior, role formatting, and moderation helpers
- Persist player progression in plugin-owned storage rather than relying on third-party quest/progression plugins

## Feature Set

### Progression and XP economy

- Full account progression with a custom level curve, prestige hooks, and version-aware playtime tracking
- XP sources across mining, farming, breeding, taming, PvE, PvP, bosses, fishing, trades, advancements, build reviews, night events, structure rewards, collections, and more
- Daily cap systems for selected categories through `ProgressionService`
- Health and hunger scaling tied to progression through `HealthService` and `HungerService`
- In-game stat display routing so players can expose selected stats to other players

### Menu, player UI, and collections

- `/info` with custom chest UI style menu for player overview, progression, collections, caps, and stats
- Collection tracking for enchants, biomes, fishing, discs, bestiary, and night events
- Collection reward scaling handled centrally by `CollectionXpScale`
- Text-heavy book/menu rendering through `QuestBookService`, `StatsMenuService`, `CollectionsMenuService`, `PlayerMenuService`, and `XpCapsMenuService`
- Leaderboards and top-player presentation through command and hologram services

### World and travel systems

- Spawn, homes, warps, world-center routing, and teleport requests
- RTP routing that can target both the vanilla overworld and Dreamland
- World-aware gameplay gating through `WorldAccess`
- Safety checks for teleport cancellation, request acceptance warnings, and home limits

### Territory and social grouping

- Team creation, invites, renames, privacy, team homes, and team chat
- Land claiming with claim validation, center protection, invitations, bans, and metadata
- Friendly-fire and shared team progression support
- Team ranking via `/ttop`

### Player market and trade

- In-plugin market offers with GUI flow for listing items and specifying requested return items
- Support for both vanilla and plugin-defined custom items in market matching
- "My Offers" claim flow for sold listings and seller-side notifications when offers are purchased
- Separate synchronous player-to-player trade request flow via the trade package

### Duel and competitive systems

- Duel requests, spectator flow, post-duel command restrictions, queue entry, dequeue, and duel kit selection
- Duel arenas and duel-specific startup/login guards
- Queue-based PvP flow implemented inside the plugin rather than delegated to an arena plugin

### Custom survival gameplay layers

- Death chests with player-owned retrieval behavior
- Sleep vote system instead of forcing full-server sleep
- Bestiary and biome discovery tracking through movement and entity listeners
- Heavy Core, Sheer Forger, Star of Nir, trial chamber unlocks, Nether unlocks, and other custom survival unlock paths
- Dragon egg tracking, special activation flows, custom loot hooks, and structure reward pipelines
- Combat tagging, totem tracking, attack indicator, suspicious mining alerts, and other live gameplay instrumentation

### Social, moderation, and network integration

- Chat formatting, nickname handling, role-aware tab ordering, and profile formatting
- Discord account sync, slash-link flow, chat relay, moderation relay, and system announcements via `DiscordSRV`
- Player suggestions, reports, warnings, audit log, punishment history, vanish-aware staff tooling, invsee, and staff watch/spectate helpers
- Owner / mod / supporter role presentation and permission-aware display services

### Supporter systems

- Supporter / Elite / Ultra tier handling through `SupporterRoleService`
- Theme, tag, claim, ender chest, back, gift, and store entry flows
- Supporter reminder and promo messaging helpers
- Tier-aware UI/menu services for perk access

### Onboarding and documentation UX

- Help menu, tutorial flow, and rules UI
- Join-time onboarding hooks
- NPC-driven dialogue systems for guided feature discovery

## Architecture

The plugin is intentionally split by feature domain.

| Package | Responsibility |
| --- | --- |
| `bootstrap` | Startup wiring, command registration, event registration, scheduled task setup |
| `core` | Shared models, world access, keys, migration, formatting glue |
| `player` | Progression, questbook, menus, stats, health, hunger, storage |
| `travel` | Spawn, RTP, homes, warps, teleport requests |
| `territory` | Teams, land claims, team chat, team rankings |
| `duel` | Duel requests, queues, duel sessions, arenas, spectate |
| `gameplay` | World rules, collections, unlocks, loot, bosses, death chests, sleep vote, custom systems |
| `market` | Offer creation, matching, storage, GUI flow |
| `trade` | Direct player trade requests and menu interactions |
| `social` | Chat, nicknames, Discord bridge, reports, suggestions, role formatting, tab list |
| `supporter` | Paid-tier access, perks, themes, gifts, supporter storage |
| `help` | Tutorial, rules, help menu, onboarding |
| `admin` | Staff/admin commands, build review, invsee, punishment history, alerts |

### Storage model

Persistence is **MariaDB-backed**. The connection is a pooled `Database` (HikariCP); the MariaDB JDBC driver and the pool are shaded into the plugin jar, and the driver class is registered explicitly so it loads under Paper's isolated plugin classloader.

- Player state is owned by `PlayerData`; `StorageService` reads and writes it through the database
- Two databases are used:
  - a **per-server** database (default `nircraft`) for this backend's own data
  - a **shared** database (`nirmc_shared`) for cross-server data that every backend connects to (joined non-fatally — the server still boots if it is down)
- **Reuse-the-serialization design:** every store keeps its exact existing Bukkit/YAML serialization and persists that payload as-is, so there is no field-mapping drift between the old files and the database. The tables in the per-server database are:
  - `player_data` — one row per player UUID; `level` and `total_xp` are promoted to real columns for querying/leaderboards, alongside the full serialized payload
  - `profiles` — one row per player UUID (social profile state)
  - `document_store` — one row per single-file store (homes, teams, lands, market, board, NPC dialogue, etc.), each holding that store's serialized YAML document
  - `schema_meta` — schema/version bookkeeping
- Two helpers sit on top of `Database`: `KeyedYamlStore` (per-UUID keyed rows) and `YamlDocumentStore` (whole-document, one-row stores). Schemas live in `schema.sql` / `shared-schema.sql`
- **Fail-fast:** the plugin refuses to enable if the database is unreachable, so it never serves empty/partial profiles or silently overwrites real data
- **One-time import:** `DataImporter` migrates the legacy YAML into the database on first boot — it is re-runnable, self-guards on per-store emptiness, and never modifies the original YAML, so a rollback is always possible
- The plugin persists progression, collection progress, supporter-related state, duel stats, playtime metrics, daily-cap tracking, and settings flags
- A few cross-plugin shared stores (network roles, punishments, supporter profiles, nicknames) still use shared `nirmc-network/` files so other network services can read them today; they move to the shared database once those services migrate together
- Migration hooks exist for legacy/renamed fields and world-config changes


### World model

- Supports a split between vanilla overworld and Dreamland-style custom generation
- Uses server/world name configuration rather than hardcoding a single survival world
- Keeps gameplay gating centralized so listeners can opt into only the intended world set

## Command Surface

The plugin registers a large command surface because it is effectively the server's primary gameplay framework.

**Core player commands**

- `/questbook`, `/info`, `/stats`, `/player`, `/menu`
- `/leaderboard`
- `/xpcaps`
- `/market`
- `/settings`
- `/vote`
- `/kit`

**Travel**

- `/spawn`, `/spawnfast`
- `/rtp`, `/rtpfast`
- `/warp`, `/warpfast`
- `/sethome`, `/home`, `/homes`, `/delhome`
- `/tpa`, `/tpahere`, `/tpaccept`, `/tpdecline`

**Territory**

- `/team`
- `/tc`
- `/ttop`
- `/land`

**PvP / trade**

- `/duel`
- `/queue`, `/dequeue`
- `/spectate`
- `/trade`

**Supporter / social**

- `/supporter`, `/rank`, `/claim`, `/gift`
- `/nick`, `/theme`, `/tag`, `/realname`
- `/report`, `/reports`, `/suggest`, `/suggestions`

**Admin**

- `/nir`
- `/build`
- `/builder`
- `/warn`, `/unmute`, `/auditlog`, `/mmtext`

Inside the internal repository, `plugin.yml` is the canonical command and permission definition file.

## Build and Test

```bash
mvn test
mvn package
```

**Runtime assumptions**

- Java 21
- Paper 1.21.11
- A local `nuvotifier.jar` is expected at `../service/plugins/nuvotifier.jar` during compilation because the Maven build references it as a system-scoped dependency

**Current test coverage includes**

- progression math and level curve behavior
- health and hunger systems
- market matching and service behavior
- territory helpers and world-specific land rules
- RTP command behavior
- bootstrap and world-access logic
- collection reward scaling

## Repository Layout

```text
nircraft/source
├── pom.xml
├── src/main/java/com/nickrodi/nircraft
│   ├── bootstrap
│   ├── core
│   ├── player
│   ├── travel
│   ├── territory
│   ├── duel
│   ├── gameplay
│   ├── market
│   ├── trade
│   ├── social
│   ├── supporter
│   ├── help
│   └── admin
└── src/main/resources/plugin.yml
```

## Operational Notes

- This repository is the source tree for the live Nircraft plugin, not a generic library
- `nircraft/service` is the main server runtime tree (not included within this repository)
- `smptest/service` is the staging/test deployment target used for pre-production validation (not included within this repository)
- The plugin contains Nircraft-specific assumptions about ranks, world names, Discord integration, and gameplay progression; should not be reused on another server
