# Authority

[![Powered by Vercel](https://badgen.net/badge/vercel/authority.nulldozzer.io/black?icon=zeit)](https://authority.nulldozzer.io/)
[![Node.js CI](https://github.com/oBusk/authority/workflows/Node.js%20CI/badge.svg)](https://github.com/oBusk/authority/actions)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> A life counter for Star Realms

**[authority.nulldozzer.io](https://authority.nulldozzer.io/)**

An on-table companion for the deck building card game _Star Realms_. Put your
phone on the table next to the game and it shows both players' authority in
numbers you can read from across the table. Nothing else.

## Features

- **Two counters, side by side**, sized for a phone lying in landscape.
- **A running tally of your taps.** Tap `+` nine times and it shows `+9`, so
  when a card deals 9 damage you can count taps instead of doing arithmetic.
  The main number updates instantly on every tap; the tally fades about two
  seconds after you stop.
- **Your game is saved.** Close the app mid-game, come back, and the score is
  where you left it.
- **New game** resets both players to 50, after a confirmation.
- **Works offline.** Installable as a PWA; once loaded it needs no network.
- **Keeps the screen awake** where the browser supports it, so the phone does
  not go dark between turns.
- **Pure black in dark mode**, which costs an OLED screen almost no battery.
  Dark by default, with a light theme for playing in the sun.

## Install

```bash
pnpm install
```

## Development

```bash
pnpm run dev
```

Note that offline and service-worker behaviour cannot be verified with the dev
server. Use a production build for that:

```bash
pnpm run build && pnpm run start
```

## Checks

```bash
pnpm run lint       # eslint + prettier
pnpm run test-ci    # jest
pnpm run build      # production build
pnpm run typecheck  # next typegen + tsc --noEmit
```

The first three run in CI on every push and pull request.

## Icons

The app icons and the Open Graph card are committed PNGs, generated from
`public/icons/icon.svg`. Regenerate them after changing the mark:

```bash
node scripts/generate-icons.mjs
```

## Deployment

Deployed automagically using [Vercel](https://vercel.com/) to
[authority.nulldozzer.io](https://authority.nulldozzer.io/).

## Disclaimer

_Star Realms_ is a trademark of Wise Wizard Games. This is an unofficial
fan-made tool with no affiliation to, or endorsement from, the publisher.

## License

ISC © Oscar Busk
