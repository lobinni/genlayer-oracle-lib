import { GENLAYER_TESTNET } from '../config/genlayer';
import { useWallet } from '../context/WalletContext';
import { Globe, Hash, Coins, Search, Droplets, ExternalLink, Shield, Brain, Cpu } from 'lucide-react';

export default function NetworkInfo() {
  const { blockNumber } = useWallet();

  const networkDetails = [
    { icon: <Hash size={14} />, label: 'Chain ID', value: GENLAYER_TESTNET.chainId.toString() },
    { icon: <Globe size={14} />, label: 'Network', value: GENLAYER_TESTNET.name },
    { icon: <Coins size={14} />, label: 'Symbol', value: GENLAYER_TESTNET.symbol },
    { icon: <Cpu size={14} />, label: 'Block', value: `#${blockNumber.toString()}` },
  ];

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700/50">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Shield size={16} className="text-emerald-400" />
          GenLayer Testnet
        </h3>
        <p className="text-gray-400 text-xs mt-1">AI-powered blockchain with Intelligent Contracts</p>
      </div>

      <div className="p-5 grid grid-cols-2 gap-3">
        {networkDetails.map((item) => (
          <div key={item.label} className="bg-gray-900/50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase tracking-wider">
              {item.icon}
              {item.label}
            </div>
            <div className="text-white text-sm font-medium mt-0.5">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-4 space-y-2">
        <a
          href={GENLAYER_TESTNET.rpcUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors group"
        >
          <span className="text-gray-400 text-xs">RPC URL</span>
          <span className="text-emerald-400 text-xs font-mono group-hover:underline flex items-center gap-1">
            rpc.testnet-chain... <ExternalLink size={10} />
          </span>
        </a>
        <a
          href={GENLAYER_TESTNET.explorer}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors group"
        >
          <span className="flex items-center gap-1.5 text-gray-400 text-xs">
            <Search size={12} />
            Explorer
          </span>
          <span className="text-emerald-400 text-xs group-hover:underline flex items-center gap-1">
            Open <ExternalLink size={10} />
          </span>
        </a>
        <a
          href={GENLAYER_TESTNET.faucet}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors group"
        >
          <span className="flex items-center gap-1.5 text-gray-400 text-xs">
            <Droplets size={12} />
            Faucet
          </span>
          <span className="text-amber-400 text-xs group-hover:underline flex items-center gap-1">
            Get GEN <ExternalLink size={10} />
          </span>
        </a>
      </div>

      <div className="px-5 pb-5">
        <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={16} className="text-emerald-400" />
            <span className="text-emerald-400 text-sm font-semibold">Intelligent Contracts</span>
          </div>
          <p className="text-gray-300 text-xs leading-relaxed">
            GenLayer contracts use AI validators with LLMs to reach consensus on non-deterministic data. 
            Each validator independently fetches web data & processes prompts, then agrees via 
            <span className="text-cyan-400"> Optimistic Democracy</span> consensus.
          </p>
        </div>
      </div>
    </div>
  );
}
