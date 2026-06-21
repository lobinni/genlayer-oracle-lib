# genlayer-oracle-lib

> An Intelligent Contract library for calling weather, price feed, and social media APIs on GenLayer.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GenLayer](https://img.shields.io/badge/Built%20on-GenLayer-orange)](https://docs.genlayer.com)

This library provides 4 Intelligent Contracts written in Python (GenVM SDK) that let smart contracts call weather, price, and social media APIs directly — reaching consensus across validators through GenLayer's `eq_principle` mechanism, with no traditional middleman oracle required.

> **Project status**: in progress. All 4 contracts are coded, **not yet deployed** to localnet/testnet. See [Status & roadmap](#status--roadmap) below.

---

## Table of contents

- [Features](#features)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Installation](#installation)
- [Project structure](#project-structure)
- [The 4 contracts](#the-4-contracts)
- [API key / secrets management](#api-key--secrets-management)
- [Deployment](#deployment)
- [Testing](#testing)
- [Linting](#linting)
- [Status & roadmap](#status--roadmap)
- [References](#references)
- [License](#license)

---

## Features

- Calls weather, price, and social media APIs directly from a contract via `gl.nondet.web.request`
- Validator consensus via `eq_principle.strict_eq` (quantitative data) and `eq_principle.prompt_comparative` (qualitative data via LLM)
- API keys are protected behind an off-chain proxy gateway — never exposed in contract state or in the URL called from the contract
- Handles error responses (4xx/5xx) and rounds time-sensitive data (prices, follower counts) to avoid validator disagreement

## Architecture

```
Contract (on-chain)  →  gl.nondet.web.request  →  Off-chain gateway (holds the API key)  →  Real API
                                                          (Weather / Price / Social)
```

Each validator independently makes the same request; results are compared via `eq_principle` to reach consensus before being written to state.

## Requirements

| Tool | Version |
|---|---|
| Python | 3.12+ |
| Node.js | 18+ |
| Docker Desktop | 26+ (required for `localnet`) |
| GenLayer CLI | latest |

Get free testnet GEN: https://testnet-faucet.genlayer.foundation/

## Installation

```bash
git clone https://github.com/lobinni/genlayer-oracle-lib.git
cd genlayer-oracle-lib

# Install Python deps (genvm-linter, gltest)
pip install -r requirements.txt

# Install the GenLayer CLI globally
npm install -g genlayer

# Install Node deps for the deploy script
npm install
```

Copy the environment variable template and fill in your real keys (the `.env` file is **not** committed to git):

```bash
cp .env.example .env
```

## Project structure

```
genlayer-oracle-lib/
│
├── contracts/
│   ├── oracle_base.py          # Shared base class (API call helper, error handling)
│   ├── weather_oracle.py       # Weather oracle
│   ├── price_oracle.py         # Price feed oracle
│   └── social_oracle.py        # Social media oracle (quantitative + LLM-based qualitative)
│
├── deploy/
│   └── deployScript.ts         # Batch-deploys all 4 contracts using genlayer-js
│
├── tests/
│   └── test_oracles.py         # Unit/integration tests run against localnet
│
├── docs/
│   └── secrets-management.md   # Architecture decision record for API key handling
│
├── .env.example                # Environment variable template (safe to commit)
├── .gitignore
├── LICENSE
├── package.json
├── tsconfig.json
├── gltest.config.yaml
└── requirements.txt
```

## The 4 contracts

| Contract | File | Equivalence principle | Description |
|---|---|---|---|
| `WeatherOracle` | `contracts/weather_oracle.py` | `strict_eq` | Fetches current temperature for a given city |
| `PriceOracle` | `contracts/price_oracle.py` | `strict_eq` (price rounded) | Fetches an asset price by symbol, rounded to 2 decimal places to avoid validator mismatches |
| `SocialOracle.fetch_follower_count` | `contracts/social_oracle.py` | `strict_eq` | Counts followers/subscribers for an account |
| `SocialOracle.fetch_content_summary` | `contracts/social_oracle.py` | `prompt_comparative` | Summarizes post content via LLM, matched by meaning rather than exact characters |

Every contract follows the pattern set in `oracle_base.py`: all web calls live inside a non-deterministic block wrapped by `eq_principle` before anything is written to state.

## API key / secrets management

Because Intelligent Contract state is public on-chain, **API keys must never be stored directly in the contract or in the URL the contract calls.**

This project uses **Approach A — off-chain proxy gateway**: a small gateway (Cloudflare Worker / AWS Lambda / your own server) sits between the contract and the real API, injecting the key from a server-side environment variable. The contract only ever calls the gateway URL and never sees the real key.

Full details and the key-rotation checklist live in [`docs/secrets-management.md`](docs/secrets-management.md).

## Deployment

> ⚠️ Not yet performed — the commands below are for reference once you're ready to deploy.

**Step 1 — Start Docker Desktop**, then start localnet:

```bash
genlayer up
```

**Step 2 — Lint before deploying** (see [Linting](#linting)).

**Step 3 — Deploy each contract via the CLI** (interactive; you'll be prompted for constructor arguments):

```bash
genlayer network set localnet        # or testnet-bradbury for the public testnet
genlayer deploy --contract contracts/weather_oracle.py
genlayer deploy --contract contracts/price_oracle.py
genlayer deploy --contract contracts/social_oracle.py
```

**Or deploy all at once** with the TypeScript script:

```bash
genlayer deploy
```

The CLI auto-detects the `deploy/` folder and runs `deployScript.ts`, deploying every contract in sequence with the arguments already configured there.

After a successful deploy, save the contract addresses to `docs/deployed-addresses.md` (create this file on your first deploy).

## Testing

```bash
genlayer up          # make sure localnet is running (requires Docker Desktop)
gltest tests/
```

## Linting

Always lint before deploying:

```bash
genvm-lint check contracts/oracle_base.py
genvm-lint check contracts/weather_oracle.py
genvm-lint check contracts/price_oracle.py
genvm-lint check contracts/social_oracle.py
```

The linter catches forbidden imports (`os`, `sys`, `subprocess`), non-deterministic calls made outside an `eq_principle` block, and invalid storage types.

## Status & roadmap

- [x] Scaffold project structure
- [x] Write `oracle_base.py`
- [x] Write `weather_oracle.py`
- [x] Write `price_oracle.py`
- [x] Write `social_oracle.py`
- [x] Configure TypeScript + `genlayer-js` for the deploy script
- [ ] Stand up the off-chain gateway holding the real API keys
- [ ] Lint all contracts (`genvm-lint`)
- [ ] Write tests in `tests/test_oracles.py`
- [ ] Deploy to `localnet`
- [ ] Deploy to `testnet-bradbury` and record contract addresses
- [ ] Improve Studio UX (key/secrets management, oracle call monitoring)

## References

- [GenLayer Docs](https://docs.genlayer.com)
- [GenLayer SDK Reference](https://sdk.genlayer.com)
- [GenVM Linter Docs](https://docs.genlayer.com/api-references/genlayer-linter)
- [Testnet Faucet](https://testnet-faucet.genlayer.foundation/)
- Structure reference: [genlayer-x402](https://github.com/habiiyt31/genlayer-x402)

## License

MIT — see [LICENSE](LICENSE) for details.