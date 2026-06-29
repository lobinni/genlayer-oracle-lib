# 🛡️ GenLayer Reputation Oracle

> **Decentralized AI-Powered Review Verification System** — A real GenLayer Intelligent Contract

[![GenLayer](https://img.shields.io/badge/GenLayer-Testnet-10b981?style=flat-square)](https://genlayer.com)
[![Chain ID](https://img.shields.io/badge/Chain%20ID-4221-06b6d4?style=flat-square)](https://explorer.testnet-chain.genlayer.com)
[![genlayer-js](https://img.shields.io/badge/SDK-genlayer--js-purple?style=flat-square)](https://www.npmjs.com/package/genlayer-js)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

A **production-ready Intelligent Contract** that enables trustless, on-chain reputation scoring using GenLayer's AI-powered consensus mechanism. This project demonstrates real GenLayer features with actual transactions and gas fees.

## 🔥 Key GenLayer Features Used

| Feature | Implementation | Purpose |
|---------|---------------|---------|
| `gl.get_webpage()` | Fetch evidence URLs | Access real-world web data without oracles |
| `gl.exec_prompt()` | LLM analysis | AI-powered review verification |
| `gl.eq_principle_prompt_comparative()` | Consensus logic | Multi-validator agreement on verdicts |
| `@gl.public.write` | State mutations | On-chain storage with gas fees |
| `@gl.public.view` | Read operations | Free queries |
| `TreeMap` storage | State management | Persistent on-chain data |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GENLAYER INTELLIGENT CONTRACT                        │
│                         ReputationOracle.py                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   submit_verified_review(entity_id, review_text, evidence_url, rating)      │
│                                    │                                         │
│                                    ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    NON-DETERMINISTIC EXECUTION                       │   │
│   │                                                                      │   │
│   │  1. gl.get_webpage(evidence_url)  ← Each validator fetches          │   │
│   │                                                                      │   │
│   │  2. gl.exec_prompt(verification_prompt) ← LLM analyzes               │   │
│   │     "Verify if evidence supports review claims..."                   │   │
│   │                                                                      │   │
│   │  3. gl.eq_principle_prompt_comparative()                             │   │
│   │     "Two verifications are equivalent if VERDICT matches             │   │
│   │      and CREDIBILITY scores within 15 points"                        │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│   Store: { verdict: "VERIFIED", credibility_score: 78, ai_analysis: "..." } │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-username/genlayer-reputation-oracle.git
cd genlayer-reputation-oracle
npm install
npm run dev
```

### 2. Deploy the Contract

**Option A: GenLayer Studio (Recommended)**

1. Go to [studio.genlayer.com](https://studio.genlayer.com)
2. Create new contract, paste code from `contracts/ReputationOracle.py`
3. Click **Deploy** → Confirm transaction
4. Copy the deployed contract address

**Option B: genlayer-js SDK**

```typescript
import { createClient, createAccount } from 'genlayer-js';
import { testnetAsimov } from 'genlayer-js/chains';

const client = createClient({
  chain: testnetAsimov,
  account: createAccount(),
});

const { contractAddress } = await client.deployContract({
  code: contractCode,
  args: [],
});
```

### 3. Get Testnet GEN

Get free testnet tokens: [https://testnet-faucet.genlayer.foundation/](https://testnet-faucet.genlayer.foundation/)

### 4. Use the dApp

1. Create wallet or import private key
2. Set your deployed contract address
3. Register entities, submit AI-verified reviews, query data

## 📜 Intelligent Contract

**File:** `contracts/ReputationOracle.py`

### Write Methods (Require GEN gas)

```python
# Register an entity for reputation tracking
@gl.public.write
def register_entity(self, name: str, category: str, website: str):
    ...

# Submit AI-verified review with evidence URL
@gl.public.write
def submit_verified_review(
    self,
    entity_id: u256,
    review_text: str,
    evidence_url: str,  # Validators fetch this URL
    rating: u256
):
    # Non-deterministic: validators independently verify
    verification_result = gl.eq_principle_prompt_comparative(
        verify_review,
        "Two verifications are equivalent if same VERDICT..."
    )
    ...

# Real-time reputation check from web data
@gl.public.write
def check_entity_reputation(self, entity_id: u256, check_url: str):
    ...
```

### View Methods (Free)

```python
@gl.public.view
def get_entity(self, entity_id: u256) -> str: ...

@gl.public.view
def get_entity_reviews(self, entity_id: u256) -> str: ...

@gl.public.view
def get_reputation_score(self, entity_id: u256) -> str: ...

@gl.public.view
def get_all_entities(self) -> str: ...
```

## 🔧 Network Configuration

| Parameter | Value |
|-----------|-------|
| **Chain ID** | 4221 |
| **RPC URL** | https://rpc.testnet-chain.genlayer.com |
| **Symbol** | GEN |
| **Explorer** | https://explorer.testnet-chain.genlayer.com |
| **Faucet** | https://testnet-faucet.genlayer.foundation/ |

## 💰 Gas Costs

| Operation | Estimated Gas | Notes |
|-----------|---------------|-------|
| `register_entity` | ~50,000 | Simple state write |
| `submit_verified_review` | ~500,000+ | AI consensus (1-3 min) |
| `check_entity_reputation` | ~400,000+ | AI consensus (1-3 min) |
| View methods | 0 | Free |

## 🧰 Tech Stack

- **Contract:** Python (GenVM SDK)
- **Frontend:** React 19 + Vite + TailwindCSS
- **SDK:** [genlayer-js](https://www.npmjs.com/package/genlayer-js)
- **Consensus:** Optimistic Democracy with LLM validators

## 📁 Project Structure

```
├── contracts/
│   └── ReputationOracle.py      # GenLayer Intelligent Contract
├── src/
│   ├── services/
│   │   └── genlayerSDK.ts       # genlayer-js integration
│   ├── context/
│   │   └── WalletContext.tsx    # Wallet state management
│   ├── components/
│   │   ├── Header.tsx           # Wallet connection
│   │   ├── ContractInteraction.tsx  # Contract methods UI
│   │   ├── ContractView.tsx     # Contract code viewer
│   │   └── ...
│   └── config/
│       └── genlayer.ts          # Network configuration
└── docs/
    ├── ARCHITECTURE.md
    └── DEPLOYMENT.md
```

## 🎯 Use Cases

- **DeFi Protocol Reputation** — Verify user experiences with cross-referenced data
- **NFT Project Verification** — AI-verified delivery history
- **DAO Contributor Scoring** — Evidence-based reputation
- **Service Provider Ratings** — Trustless reviews with proof
- **Credential Verification** — Verify claims via public evidence

## 🔗 Resources

- [GenLayer Documentation](https://docs.genlayer.com)
- [GenLayer Studio](https://studio.genlayer.com)
- [GenLayer Explorer](https://explorer.testnet-chain.genlayer.com)
- [Testnet Faucet](https://testnet-faucet.genlayer.foundation/)
- [genlayer-js SDK](https://www.npmjs.com/package/genlayer-js)

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

**Built on GenLayer — The Intelligence Layer of the Internet**

```
🤖 AI Validators + 🌐 Real Web Data + ⛓️ On-Chain Consensus = Trustless Reputation
```
