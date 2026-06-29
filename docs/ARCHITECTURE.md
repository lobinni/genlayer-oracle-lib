# 🏗️ Architecture Overview

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              USER / DAPP                                     │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  React Frontend (Vite + TailwindCSS)                                   │  │
│  │  • Wallet management (create/import private keys)                      │  │
│  │  • Contract interaction forms                                          │  │
│  │  • Transaction history                                                 │  │
│  │  • Real-time network status                                            │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬────────────────────────────────────────────┘
                                  │
                                  │ JSON-RPC / Viem
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         GENLAYER TESTNET                                     │
│                         Chain ID: 4221                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                   ReputationOracle Contract                            │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │  │
│  │  │ State Variables                                                  │  │  │
│  │  │ • entities: TreeMap[u256, DynArray[u8]]                         │  │  │
│  │  │ • reviews: TreeMap[u256, DynArray[u8]]                          │  │  │
│  │  │ • scores: TreeMap[u256, u256]                                   │  │  │
│  │  │ • review_counts: TreeMap[u256, u256]                            │  │  │
│  │  │ • verified_hashes: TreeMap[str, bool]                           │  │  │
│  │  └──────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                        │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │  │
│  │  │ Write Methods                                                    │  │  │
│  │  │ • register_entity() ─────────────────────────────► State Update │  │  │
│  │  │ • submit_verified_review() ──┐                                  │  │  │
│  │  │ • check_entity_reputation() ─┤                                  │  │  │
│  │  └──────────────────────────────┼──────────────────────────────────┘  │  │
│  │                                 │                                      │  │
│  │                                 ▼                                      │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │  │
│  │  │           NON-DETERMINISTIC EXECUTION                            │  │  │
│  │  │                                                                  │  │  │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │  │  │
│  │  │  │ Validator 1 │  │ Validator 2 │  │ Validator 3 │              │  │  │
│  │  │  │   GPT-4     │  │   Claude    │  │   Llama     │              │  │  │
│  │  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │  │  │
│  │  │         │                │                │                      │  │  │
│  │  │         ▼                ▼                ▼                      │  │  │
│  │  │  ┌──────────────────────────────────────────────────────────┐   │  │  │
│  │  │  │              gl.get_webpage(evidence_url)                │   │  │  │
│  │  │  │              (Each validator fetches independently)      │   │  │  │
│  │  │  └──────────────────────────────────────────────────────────┘   │  │  │
│  │  │         │                │                │                      │  │  │
│  │  │         ▼                ▼                ▼                      │  │  │
│  │  │  ┌──────────────────────────────────────────────────────────┐   │  │  │
│  │  │  │                gl.exec_prompt(analysis)                  │   │  │  │
│  │  │  │              (Each LLM analyzes independently)           │   │  │  │
│  │  │  └──────────────────────────────────────────────────────────┘   │  │  │
│  │  │         │                │                │                      │  │  │
│  │  │         ▼                ▼                ▼                      │  │  │
│  │  │  ┌──────────────────────────────────────────────────────────┐   │  │  │
│  │  │  │        eq_principle_prompt_comparative()                 │   │  │  │
│  │  │  │   "Same VERDICT + scores within 15 points = AGREE"       │   │  │  │
│  │  │  └──────────────────────────────────────────────────────────┘   │  │  │
│  │  │                          │                                       │  │  │
│  │  │                          ▼                                       │  │  │
│  │  │  ┌──────────────────────────────────────────────────────────┐   │  │  │
│  │  │  │              OPTIMISTIC DEMOCRACY CONSENSUS              │   │  │  │
│  │  │  │         Majority agreement → Transaction accepted        │   │  │  │
│  │  │  └──────────────────────────────────────────────────────────┘   │  │  │
│  │  └──────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                        │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │  │
│  │  │ View Methods (Read-only, no consensus needed)                    │  │  │
│  │  │ • get_entity()                                                   │  │  │
│  │  │ • get_entity_reviews()                                           │  │  │
│  │  │ • get_reputation_score()                                         │  │  │
│  │  │ • get_all_entities()                                             │  │  │
│  │  │ • get_entity_count()                                             │  │  │
│  │  └──────────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Register Entity (Deterministic)

```
User → register_entity("Uniswap", "defi", "https://uniswap.org")
  ↓
Contract increments entity_count
  ↓
Stores entity JSON in TreeMap
  ↓
Initializes scores and review_counts to 0
```

### 2. Submit Verified Review (Non-Deterministic)

```
User → submit_verified_review(1, "Great DEX!", "https://evidence.url", 85)
  ↓
Contract validates inputs (rating 1-100, entity exists)
  ↓
Creates review hash to check for duplicates
  ↓
┌─────────────────────────────────────────────────────────────┐
│           NON-DETERMINISTIC SECTION                         │
│                                                             │
│   def verify_review():                                      │
│       evidence = gl.get_webpage(evidence_url)  ← Web fetch  │
│       result = gl.exec_prompt(analysis)        ← LLM call   │
│       return result                                         │
│                                                             │
│   verified = gl.eq_principle_prompt_comparative(            │
│       verify_review,                                        │
│       "Same VERDICT + score within 15 = equivalent"         │
│   )                                                         │
└─────────────────────────────────────────────────────────────┘
  ↓
Parse CREDIBILITY score and VERDICT from result
  ↓
Store review with AI analysis
  ↓
Update weighted score: (rating × credibility) / 100
  ↓
Increment review_count
  ↓
Mark review_hash as verified
```

### 3. Query Reputation (View Only)

```
User → get_reputation_score(1)
  ↓
Read scores[entity_id] and review_counts[entity_id]
  ↓
Calculate average: total_score / count
  ↓
Return JSON response
```

## State Schema

### Entity Data (JSON)
```json
{
  "id": 1,
  "name": "Uniswap",
  "category": "defi",
  "website": "https://uniswap.org",
  "registrant": "0x...",
  "status": "active",
  "last_check_score": 85,
  "last_check_result": "SCORE: 85\nPOSITIVES: ..."
}
```

### Review Data (JSON)
```json
{
  "entity_id": 1,
  "reviewer": "0x...",
  "review_text": "Great decentralized exchange!",
  "evidence_url": "https://etherscan.io/tx/0x...",
  "rating": 85,
  "credibility_score": 78,
  "verdict": "VERIFIED",
  "ai_analysis": "CREDIBILITY: 78\nVERDICT: VERIFIED\nANALYSIS: ...",
  "review_hash": "abc123..."
}
```

### Reputation Score (JSON)
```json
{
  "entity_id": 1,
  "total_weighted_score": 340,
  "review_count": 5,
  "average_score": 68
}
```

## Key Design Decisions

### 1. Equivalence Principle for Consensus

We use `eq_principle_prompt_comparative` with a tolerance-based comparison:

```python
"Two verifications are equivalent if they assign the same VERDICT "
"(VERIFIED, SUSPICIOUS, or REJECTED) and their CREDIBILITY scores "
"are within 15 points of each other."
```

This allows for natural variation in LLM responses while ensuring validators agree on the important outcome (VERDICT).

### 2. Credibility-Weighted Scoring

Instead of simple average, reviews are weighted by their AI-determined credibility:

```python
weighted_rating = (rating × credibility) / 100
```

A 90/100 rating with 80% credibility contributes 72 points, while a 90/100 rating with 30% credibility only contributes 27 points.

### 3. Duplicate Prevention

Reviews are hashed using:
```python
review_hash = hash(review_text + evidence_url + sender_address)
```

This prevents the same user from submitting identical reviews.

### 4. JSON Storage

All complex data is stored as JSON-encoded byte arrays in TreeMaps, allowing flexible schema evolution and human-readable data inspection.

## Security Considerations

1. **No Oracle Dependencies**: Direct web fetching means no single point of failure
2. **Multi-Validator Consensus**: Different LLMs reduce manipulation risk
3. **On-Chain Evidence**: Evidence URLs are permanently recorded
4. **Credibility Scoring**: Low-credibility reviews have minimal impact
5. **Duplicate Prevention**: Hash-based deduplication

## Gas Optimization

- View methods cost no gas
- Deterministic writes (`register_entity`) are cheap
- Non-deterministic writes (`submit_verified_review`) are expensive due to AI consensus
- Consider batching multiple view calls

## Frontend Components

| Component | Purpose |
|-----------|---------|
| `Header.tsx` | Wallet connection, balance display |
| `NetworkInfo.tsx` | Chain details, RPC info |
| `ContractView.tsx` | Contract code viewer |
| `ContractInteraction.tsx` | Forms for contract methods |
| `TransactionPanel.tsx` | Send GEN transactions |
| `ArchitectureDiagram.tsx` | Visual flow explanation |
| `Footer.tsx` | Resource links |

## Tech Stack

- **Frontend**: React 19 + Vite 7 + TailwindCSS 4
- **Blockchain**: Viem for RPC communication
- **Contract**: Python (GenVM SDK)
- **Consensus**: GenLayer Optimistic Democracy
