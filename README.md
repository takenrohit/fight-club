# Fight Club

A turn-based, two-player browser battler inspired by *Jujutsu Kaisen*. Pick a fighter, trade moves, manage your cursed energy, and watch the fight play out in a 3D arena.

## Features
- Two-player local hot-seat battles
- Fighter select screen with ready-up flow
- Moves with accuracy, crit rate, and cursed energy (CE) costs
- Per-character passives (Infinity, Black Flash, King of Curses)
- 3D arena built with React Three Fiber
- Combat log and rematch / change-fighter options

## Tech Stack
Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · React Three Fiber + drei · Vitest

## Getting Started
Requires Node.js 22.12+.

```bash
npm install
npm run dev     # http://localhost:3000
```

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm test` | Vitest (watch mode) |

## How to Play
1. Click **Play Game**, then each player picks a different fighter and presses **Ready**.
2. Player 1 moves first; players alternate turns.
3. Each move costs CE. The active player regains 10 CE at the start of their turn.
4. Attacks can miss (accuracy), crit for 1.5x damage (crit rate), or be blocked by passives.
5. First fighter to reduce the opponent to 0 HP wins.

## Fighters
| Fighter | HP | CE | Passive |
| --- | --- | --- | --- |
| Gojo Satoru | 120 | 100 | **Infinity**: chance to fully block an attack |
| Ryomen Sukuna | 120 | 90 | **King of Curses**: +25% damage below 50% HP |
| Yuji Itadori | 150 | 100 | **Black Flash**: chance on a non-crit hit for 1.5x damage and a CE refund |

## Project Structure
```
src/
├── app/            # Routes: / (home), /select, /battle
├── components/     # BattleScreen, Arena (3D), FighterPanel, MoveButton, CombatLog, PlayerColumn
└── game/           # Pure game logic (no React)
    ├── types.ts        # Shared types
    ├── characters.ts   # Fighter and move data
    ├── passives.ts     # Passive hooks (blocksAttack, modifyDamage)
    ├── engine.ts       # performMove: resolves a single move
    ├── battle.ts       # Turn order, CE regen, win detection
    └── engine.test.ts
public/
├── images/         # Select-screen portraits ({id}.png) + home-bg.png
└── models/         # 3D models ({id}.glb)
```

## Adding a Custom Fighter
1. Add a character to `src/game/characters.ts` (unique `id`, moves, optional passive).
2. If it has a passive, add hooks keyed by the passive `id` in `src/game/passives.ts`.
3. Add `public/images/{id}.png` and `public/models/{id}.glb`.
4. Add its scale/offset entry in `Arena.tsx` and a colour if desired.

## Testing
Game logic is framework-free and tested by mocking `Math.random`:
```bash
npx vitest run
```