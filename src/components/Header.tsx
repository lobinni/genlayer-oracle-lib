import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatAddress, getExplorerAddressUrl } from '../services/genlayerSDK';
import { GENLAYER_TESTNET } from '../config/genlayer';
import { 
  Wallet, 
  LogOut, 
  Copy, 
  ExternalLink, 
  ChevronDown, 
  Fuel,
  RefreshCw,
  Key,
  Plus,
  AlertCircle
} from 'lucide-react';

export default function Header() {
  const { 
    isConnected, 
    isLoading,
    address, 
    privateKey,
    balance, 
    blockNumber, 
    createWallet,
    importWalletFromKey,
    disconnect,
    refreshBalance,
    error 
  } = useWallet();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importKey, setImportKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedPK, setCopiedPK] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyPrivateKey = () => {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey);
      setCopiedPK(true);
      setTimeout(() => setCopiedPK(false), 2000);
    }
  };

  const handleImport = () => {
    if (importKey) {
      const success = importWalletFromKey(importKey);
      if (success) {
        setImportKey('');
        setShowImport(false);
      }
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-sm">GL</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Reputation Oracle</h1>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  GenLayer Testnet
                </span>
                <span>·</span>
                <span>Block #{blockNumber}</span>
              </div>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="flex items-center gap-3">
            {/* Faucet Link */}
            <a
              href={GENLAYER_TESTNET.faucet}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors"
            >
              <Fuel size={12} />
              Faucet
              <ExternalLink size={10} />
            </a>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle size={12} />
                {error}
              </div>
            )}

            {isConnected && address ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-700/50 border border-gray-600/50 hover:bg-gray-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                    <Wallet size={12} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-white text-xs font-medium">{formatAddress(address)}</div>
                    <div className="text-emerald-400 text-[10px]">{parseFloat(balance).toFixed(4)} GEN</div>
                  </div>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl bg-gray-800 border border-gray-700 shadow-2xl overflow-hidden z-50">
                    {/* Address */}
                    <div className="p-4 border-b border-gray-700">
                      <div className="text-gray-400 text-xs mb-1">Your Address</div>
                      <div className="flex items-center gap-2">
                        <code className="text-white text-xs font-mono flex-1 truncate">{address}</code>
                        <button onClick={copyAddress} className="text-gray-400 hover:text-white transition-colors">
                          <Copy size={14} />
                        </button>
                      </div>
                      {copied && <div className="text-emerald-400 text-xs mt-1">Copied!</div>}
                    </div>

                    {/* Balance */}
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400 text-xs">Balance</span>
                        <button 
                          onClick={refreshBalance}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <RefreshCw size={12} />
                        </button>
                      </div>
                      <div className="text-white text-lg font-bold">{parseFloat(balance).toFixed(6)} GEN</div>
                      <a
                        href={GENLAYER_TESTNET.faucet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 text-xs hover:underline mt-1 inline-flex items-center gap-1"
                      >
                        Get testnet GEN tokens <ExternalLink size={10} />
                      </a>
                    </div>

                    {/* Private Key */}
                    <div className="p-4 border-b border-gray-700 bg-yellow-500/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-yellow-400 text-xs font-medium flex items-center gap-1">
                          <Key size={10} />
                          Private Key (Testnet Only)
                        </span>
                        <button onClick={copyPrivateKey} className="text-gray-400 hover:text-white transition-colors">
                          <Copy size={12} />
                        </button>
                      </div>
                      <code className="text-yellow-400/70 text-[10px] font-mono break-all">
                        {privateKey ? `${privateKey.slice(0, 20)}...${privateKey.slice(-10)}` : ''}
                      </code>
                      {copiedPK && <div className="text-emerald-400 text-xs mt-1">Private key copied!</div>}
                      <div className="text-red-400/60 text-[10px] mt-1">⚠️ Save this key to access your wallet later</div>
                    </div>

                    {/* Actions */}
                    <div className="p-2">
                      <a
                        href={getExplorerAddressUrl(address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 text-sm hover:bg-gray-700 transition-colors"
                      >
                        <ExternalLink size={14} />
                        View on Explorer
                      </a>
                      <button
                        onClick={() => { disconnect(); setShowDropdown(false); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 text-sm hover:bg-gray-700 transition-colors w-full text-left"
                      >
                        <LogOut size={14} />
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={createWallet}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}
                  Create Wallet
                </button>
                <button
                  onClick={() => setShowImport(!showImport)}
                  className="px-3 py-2 rounded-xl border border-gray-600 text-gray-300 text-sm hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <Key size={14} />
                  Import
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Import Key Panel */}
        {showImport && !isConnected && (
          <div className="pb-4">
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Enter your private key (0x...)"
                value={importKey}
                onChange={(e) => setImportKey(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm font-mono placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleImport}
                disabled={!importKey || importKey.length < 64}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
              >
                Connect
              </button>
              <button
                onClick={() => { setShowImport(false); setImportKey(''); }}
                className="px-3 py-2 rounded-lg border border-gray-600 text-gray-400 text-sm hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
}
