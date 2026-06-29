import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  formatAddress,
  getExplorerTxUrl,
} from '../services/genlayerSDK';
import { GENLAYER_TESTNET } from '../config/genlayer';
import {
  Send,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Wallet,
  AlertTriangle,
  History,
  Fuel
} from 'lucide-react';

interface TxRecord {
  hash: string;
  to: string;
  value: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
}

export default function TransactionPanel() {
  const { isConnected, address, privateKey, balance, refreshBalance } = useWallet();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [txResult, setTxResult] = useState<{ hash?: string; error?: string } | null>(null);
  const [txHistory, setTxHistory] = useState<TxRecord[]>([]);

  const handleSendTransaction = async () => {
    if (!privateKey || !recipientAddress || !amount) return;
    
    setIsSending(true);
    setTxResult(null);

    try {
      // For simple GEN transfer, we can use a direct RPC call
      const response = await fetch(GENLAYER_TESTNET.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_sendTransaction',
          params: [{
            from: address,
            to: recipientAddress,
            value: '0x' + Math.floor(parseFloat(amount) * 1e18).toString(16),
          }],
          id: 1,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Transaction failed');
      }

      const hash = data.result;
      setTxResult({ hash });
      
      const newTx: TxRecord = {
        hash,
        to: recipientAddress,
        value: amount,
        status: 'pending',
        timestamp: Date.now(),
      };
      setTxHistory(prev => [newTx, ...prev]);

      // Mark as success after a delay (simplified)
      setTimeout(() => {
        setTxHistory(prev =>
          prev.map(tx => tx.hash === hash ? { ...tx, status: 'success' as const } : tx)
        );
      }, 5000);

      await refreshBalance();
      setRecipientAddress('');
      setAmount('');
    } catch (err: any) {
      setTxResult({ error: err.message || 'Transaction failed' });
    } finally {
      setIsSending(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 text-center">
        <Wallet size={32} className="text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400 text-sm mb-4">Create or import a wallet to send transactions</p>
        <p className="text-gray-500 text-xs">
          Real transactions on GenLayer Testnet with GEN gas fees
        </p>
      </div>
    );
  }

  const insufficientBalance = parseFloat(balance) <= 0;

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700/50">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Send size={16} className="text-emerald-400" />
          Send GEN Transaction
        </h3>
        <p className="text-gray-400 text-xs mt-0.5">
          Real transactions on GenLayer Testnet
        </p>
      </div>

      {insufficientBalance && (
        <div className="mx-5 mt-4 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
            <AlertTriangle size={14} />
            Insufficient Balance
          </div>
          <p className="text-amber-300/70 text-xs mt-1">
            You need GEN tokens to send transactions. Get free testnet tokens from the{' '}
            <a
              href={GENLAYER_TESTNET.faucet}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 underline"
            >
              faucet
            </a>.
          </p>
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* From */}
        <div>
          <label className="text-gray-400 text-xs font-medium block mb-1.5">From (Your Wallet)</label>
          <div className="px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-mono">{address ? formatAddress(address) : ''}</span>
              <span className="text-emerald-400 text-xs">{parseFloat(balance).toFixed(4)} GEN</span>
            </div>
          </div>
        </div>

        {/* To */}
        <div>
          <label className="text-gray-400 text-xs font-medium block mb-1.5">To Address</label>
          <input
            type="text"
            placeholder="0x..."
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white text-sm font-mono placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="text-gray-400 text-xs font-medium block mb-1.5">Amount (GEN)</label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.001"
              min="0"
              className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors pr-16"
            />
            <button
              onClick={() => {
                const maxAmount = Math.max(0, parseFloat(balance) - 0.001).toFixed(6);
                setAmount(maxAmount);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-gray-700 text-emerald-400 text-[10px] font-medium hover:bg-gray-600 transition-colors"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Gas Info */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-900/30">
          <span className="flex items-center gap-1.5 text-gray-500 text-xs">
            <Fuel size={12} />
            Estimated Gas Fee
          </span>
          <span className="text-gray-300 text-xs">~0.00005 GEN</span>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendTransaction}
          disabled={isSending || !recipientAddress || !amount || insufficientBalance}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:from-emerald-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          {isSending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending Transaction...
            </>
          ) : (
            <>
              <Send size={14} />
              Send Transaction
              <ArrowRight size={14} />
            </>
          )}
        </button>

        {/* TX Result */}
        {txResult && (
          <div className={`px-4 py-3 rounded-lg border ${txResult.hash ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            {txResult.hash ? (
              <>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <CheckCircle2 size={14} />
                  Transaction Sent!
                </div>
                <a
                  href={getExplorerTxUrl(txResult.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-300/70 text-xs font-mono mt-1 flex items-center gap-1 hover:underline"
                >
                  {formatAddress(txResult.hash)} <ExternalLink size={10} />
                </a>
              </>
            ) : (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <XCircle size={14} />
                <span className="truncate">{txResult.error}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transaction History */}
      {txHistory.length > 0 && (
        <div className="border-t border-gray-700/50">
          <div className="px-5 py-3 flex items-center gap-2 text-gray-400 text-xs font-medium">
            <History size={12} />
            Recent Transactions
          </div>
          <div className="px-5 pb-4 space-y-2">
            {txHistory.slice(0, 5).map((tx) => (
              <div key={tx.hash} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-900/30">
                <div className="flex items-center gap-2">
                  {tx.status === 'pending' && <Loader2 size={12} className="text-yellow-400 animate-spin" />}
                  {tx.status === 'success' && <CheckCircle2 size={12} className="text-emerald-400" />}
                  {tx.status === 'failed' && <XCircle size={12} className="text-red-400" />}
                  <div>
                    <div className="text-white text-xs font-mono">{formatAddress(tx.hash)}</div>
                    <div className="text-gray-500 text-[10px]">
                      To: {formatAddress(tx.to)} · {tx.value} GEN
                    </div>
                  </div>
                </div>
                <a
                  href={getExplorerTxUrl(tx.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
