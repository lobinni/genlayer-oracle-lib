# 🚀 Deployment & Usage Guide

This guide explains how to deploy the ReputationOracle contract and use the dApp with MetaMask.

## Prerequisites

1. **MetaMask** browser extension installed
2. **GEN Tokens** from the [Faucet](https://testnet-faucet.genlayer.foundation/)

## Step 1: Setup MetaMask

### Automatic Setup (Recommended)

When you click "Connect MetaMask" in the dApp, it will automatically:
1. Add GenLayer Testnet to your wallet
2. Switch to the correct network

### Manual Setup

If needed, add the network manually:

| Parameter | Value |
|-----------|-------|
| **Network Name** | GenLayer Testnet |
| **RPC URL** | https://rpc.testnet-chain.genlayer.com |
| **Chain ID** | 4221 |
| **Symbol** | GEN |
| **Explorer** | https://explorer.testnet-chain.genlayer.com |

## Step 2: Get Testnet GEN

1. Go to [https://testnet-faucet.genlayer.foundation/](https://testnet-faucet.genlayer.foundation/)
2. Enter your MetaMask wallet address
3. Request GEN tokens (you'll receive testnet tokens for free)
4. Wait for the transaction to confirm

## Step 3: Deploy the Contract

### Option A: GenLayer Studio (Recommended)

1. Go to [studio.genlayer.com](https://studio.genlayer.com)
2. Click "New Contract"
3. Copy the entire content of `contracts/ReputationOracle.py`
4. Paste into the editor
5. Click "Deploy"
6. Confirm the transaction in MetaMask
7. **Save the contract address!**

### Option B: Using the SDK

```typescript
import { createClient, createAccount } from 'genlayer-js';
import { testnetAsimov } from 'genlayer-js/chains';
import { readFileSync } from 'fs';

const account = createAccount();
const client = createClient({
  chain: testnetAsimov,
  account,
});

const contractCode = readFileSync('./contracts/ReputationOracle.py', 'utf-8');

const { contractAddress, transactionHash } = await client.deployContract({
  code: contractCode,
  args: [],
});

console.log('Contract deployed at:', contractAddress);
```

## Step 4: Configure the dApp

1. Open the dApp
2. Connect MetaMask
3. Go to "Interact" → "Setup" tab
4. Paste your deployed contract address
5. Click "Save Contract Address"

## Step 5: Using the dApp

### Send GEN Tokens

1. Go to "Transact" tab
2. Enter recipient address
3. Enter amount
4. Click "Send Transaction"
5. **Confirm in MetaMask** (you'll see the gas fee)
6. Wait for confirmation

### Register an Entity

1. Go to "Interact" → "Register" tab
2. Fill in entity name, category, website
3. Click "Register Entity"
4. **Confirm in MetaMask**
5. Gas: ~50,000

### Submit AI-Verified Review

1. Go to "Interact" → "Review" tab
2. Enter entity ID
3. Write your review
4. Provide evidence URL (must be publicly accessible)
5. Set rating (1-100)
6. Click "Submit Verified Review"
7. **Confirm in MetaMask**
8. **Wait 1-3 minutes** for AI consensus!

### Query Data (Free)

1. Go to "Interact" → "Query" tab
2. Select query type
3. Click "Query Contract"
4. No gas required (view methods)

## Gas Costs Reference

| Operation | Gas | GEN Cost (approx) |
|-----------|-----|-------------------|
| Simple Transfer | 21,000 | ~0.00005 GEN |
| Register Entity | 50,000 | ~0.00012 GEN |
| Submit Review | 500,000+ | ~0.001+ GEN |
| Reputation Check | 400,000+ | ~0.001+ GEN |
| View Methods | 0 | Free |

> Note: AI consensus operations use more gas and take longer (1-3 minutes)

## Troubleshooting

### "User rejected the request"
- You cancelled the transaction in MetaMask
- Try again and click "Confirm"

### "Insufficient funds"
- Get more GEN from the [faucet](https://testnet-faucet.genlayer.foundation/)
- Check your balance in MetaMask

### "Wrong network"
- Click the "Switch Network" button in the dApp
- Or manually switch to GenLayer Testnet in MetaMask

### Transaction stuck "Pending"
- AI consensus can take 1-3 minutes
- Check the [Explorer](https://explorer.testnet-chain.genlayer.com) for status

### "Contract not found"
- Make sure you entered the correct contract address
- Verify the contract is deployed on the explorer

## Security Notes

⚠️ **Testnet Only** — This is for testing. Never use mainnet private keys.

⚠️ **Evidence URLs** — Make sure evidence URLs are publicly accessible for validators to fetch.

⚠️ **Gas Limits** — AI consensus operations may fail if gas limit is too low.

## Verifying Transactions

All transactions can be verified on the [GenLayer Explorer](https://explorer.testnet-chain.genlayer.com):

1. Copy the transaction hash
2. Search on the explorer
3. View transaction details, status, and gas used

---

**Need help?** Join the [GenLayer Discord](https://discord.gg/genlayer)
