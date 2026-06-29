/**
 * GenLayer SDK Integration
 * 
 * This module provides proper integration with GenLayer Intelligent Contracts
 * using the official genlayer-js SDK.
 * 
 * Note: GenLayer Intelligent Contracts run on GenVM (not EVM), so we use
 * the genlayer-js SDK instead of standard Ethereum tools like MetaMask.
 */

import { createClient, createAccount, generatePrivateKey } from 'genlayer-js';
import { testnetAsimov } from 'genlayer-js/chains';
import { TransactionStatus } from 'genlayer-js/types';
import { GENLAYER_TESTNET } from '../config/genlayer';

// Storage keys
const PRIVATE_KEY_STORAGE = 'genlayer_wallet_pk';
const CONTRACT_ADDRESS_STORAGE = 'genlayer_contract_address';

// Types
export interface GenLayerAccount {
  address: string;
  privateKey: string;
}

export interface ContractCallResult {
  success: boolean;
  data?: any;
  error?: string;
  txHash?: string;
}

// ============================================================================
// WALLET MANAGEMENT
// ============================================================================

/**
 * Generate a new GenLayer wallet
 */
export function generateWallet(): GenLayerAccount {
  const privateKey = generatePrivateKey();
  const account = createAccount(privateKey);
  return {
    address: account.address,
    privateKey: privateKey,
  };
}

/**
 * Import wallet from private key
 */
export function importWallet(privateKey: string): GenLayerAccount {
  const pk = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
  const account = createAccount(pk as `0x${string}`);
  return {
    address: account.address,
    privateKey: pk,
  };
}

/**
 * Save wallet to localStorage
 */
export function saveWallet(privateKey: string): void {
  localStorage.setItem(PRIVATE_KEY_STORAGE, privateKey);
}

/**
 * Load wallet from localStorage
 */
export function loadWallet(): GenLayerAccount | null {
  const privateKey = localStorage.getItem(PRIVATE_KEY_STORAGE);
  if (!privateKey) return null;
  
  try {
    return importWallet(privateKey);
  } catch {
    return null;
  }
}

/**
 * Remove wallet from localStorage
 */
export function removeWallet(): void {
  localStorage.removeItem(PRIVATE_KEY_STORAGE);
}

// ============================================================================
// CONTRACT ADDRESS MANAGEMENT
// ============================================================================

export function saveContractAddress(address: string): void {
  localStorage.setItem(CONTRACT_ADDRESS_STORAGE, address);
}

export function loadContractAddress(): string | null {
  return localStorage.getItem(CONTRACT_ADDRESS_STORAGE);
}

// ============================================================================
// GENLAYER CLIENT
// ============================================================================

/**
 * Create GenLayer client for testnet with account
 */
export function createGenLayerClient(privateKey: string) {
  const pk = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
  const account = createAccount(pk as `0x${string}`);
  
  const client = createClient({
    chain: testnetAsimov,
    account: account,
    endpoint: GENLAYER_TESTNET.rpcUrl,
  });

  return client;
}

/**
 * Create read-only client (no account needed)
 */
export function createReadOnlyClient() {
  return createClient({
    chain: testnetAsimov,
    endpoint: GENLAYER_TESTNET.rpcUrl,
  });
}

// ============================================================================
// CONTRACT INTERACTIONS
// ============================================================================

/**
 * Read from contract (view methods - no gas required)
 */
export async function readContract(
  contractAddress: string,
  functionName: string,
  args: any[] = []
): Promise<ContractCallResult> {
  try {
    const client = createReadOnlyClient();
    
    const result = await client.readContract({
      address: contractAddress as `0x${string}`,
      functionName: functionName,
      args: args,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error('Read contract error:', error);
    return {
      success: false,
      error: error.message || 'Failed to read from contract',
    };
  }
}

/**
 * Write to contract (state-changing methods - requires gas)
 */
export async function writeContract(
  privateKey: string,
  contractAddress: string,
  functionName: string,
  args: any[] = [],
  value: bigint = 0n
): Promise<ContractCallResult> {
  try {
    const client = createGenLayerClient(privateKey);

    // Send the transaction
    const txHash = await client.writeContract({
      address: contractAddress as `0x${string}`,
      functionName: functionName,
      args: args,
      value: value,
    });

    // Wait for transaction to be accepted
    const receipt = await client.waitForTransactionReceipt({
      hash: txHash,
      status: TransactionStatus.ACCEPTED,
      retries: 60,
      interval: 5000,
    });

    return {
      success: true,
      data: receipt,
      txHash: txHash,
    };
  } catch (error: any) {
    console.error('Write contract error:', error);
    return {
      success: false,
      error: error.message || 'Transaction failed',
    };
  }
}

/**
 * Write to contract and wait for FINALIZED status
 */
export async function writeContractFinalized(
  privateKey: string,
  contractAddress: string,
  functionName: string,
  args: any[] = [],
  value: bigint = 0n
): Promise<ContractCallResult> {
  try {
    const client = createGenLayerClient(privateKey);

    const txHash = await client.writeContract({
      address: contractAddress as `0x${string}`,
      functionName: functionName,
      args: args,
      value: value,
    });

    const receipt = await client.waitForTransactionReceipt({
      hash: txHash,
      status: TransactionStatus.FINALIZED,
      retries: 120,
      interval: 5000,
    });

    return {
      success: true,
      data: receipt,
      txHash: txHash,
    };
  } catch (error: any) {
    console.error('Write contract error:', error);
    return {
      success: false,
      error: error.message || 'Transaction failed',
    };
  }
}

/**
 * Get contract schema
 */
export async function getContractSchema(contractAddress: string): Promise<any> {
  try {
    const client = createReadOnlyClient();
    const schema = await client.getContractSchema(contractAddress as `0x${string}`);
    return schema;
  } catch (error) {
    console.error('Get schema error:', error);
    return null;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTxHash(hash: string): string {
  if (!hash || hash.length < 10) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function getExplorerTxUrl(hash: string): string {
  return `${GENLAYER_TESTNET.explorer}/tx/${hash}`;
}

export function getExplorerAddressUrl(address: string): string {
  return `${GENLAYER_TESTNET.explorer}/address/${address}`;
}

// ============================================================================
// BALANCE & BLOCK NUMBER (via JSON-RPC)
// ============================================================================

export async function getBalance(address: string): Promise<string> {
  try {
    const response = await fetch(GENLAYER_TESTNET.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1,
      }),
    });

    const data = await response.json();
    if (data.result) {
      const balanceWei = BigInt(data.result);
      const balanceEth = Number(balanceWei) / 1e18;
      return balanceEth.toFixed(6);
    }
    return '0';
  } catch (error) {
    console.error('Get balance error:', error);
    return '0';
  }
}

export async function getBlockNumber(): Promise<number> {
  try {
    const response = await fetch(GENLAYER_TESTNET.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
    });

    const data = await response.json();
    if (data.result) {
      return parseInt(data.result, 16);
    }
    return 0;
  } catch (error) {
    console.error('Get block number error:', error);
    return 0;
  }
}
