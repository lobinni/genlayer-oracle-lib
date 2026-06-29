import { useState } from 'react';
import { INTELLIGENT_CONTRACT_CODE } from '../config/genlayer';
import { Copy, Check, ChevronDown, ChevronUp, FileCode2, Eye } from 'lucide-react';

export default function ContractView() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(INTELLIGENT_CONTRACT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get line count and preview
  const lines = INTELLIGENT_CONTRACT_CODE.split('\n');
  const preview = lines.slice(0, 30).join('\n');

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700/50 flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2">
            <FileCode2 size={16} className="text-cyan-400" />
            Intelligent Contract
          </h3>
          <p className="text-gray-400 text-xs mt-0.5">ReputationOracle.py — {lines.length} lines</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 text-gray-300 text-xs hover:bg-gray-600 transition-colors"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="relative">
        <pre className="p-4 overflow-x-auto text-xs leading-relaxed font-mono max-h-96 overflow-y-auto">
          <code className="text-gray-300">
            {expanded ? INTELLIGENT_CONTRACT_CODE : preview}
            {!expanded && '\n...'}
          </code>
        </pre>

        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-800/90 to-transparent"></div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-gray-700/50 flex justify-between items-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-cyan-400 text-xs hover:text-cyan-300 transition-colors"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Collapse' : `Show all ${lines.length} lines`}
        </button>
        <a
          href="https://docs.genlayer.com/developers/intelligent-contracts/introduction"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-gray-400 text-xs hover:text-gray-300 transition-colors"
        >
          <Eye size={12} />
          Docs
        </a>
      </div>

      {/* Contract Features */}
      <div className="px-5 pb-5 grid grid-cols-2 gap-2">
        {[
          { label: 'Web Data Fetching', desc: 'gl.get_webpage()' },
          { label: 'AI Consensus', desc: 'gl.exec_prompt()' },
          { label: 'Equivalence Check', desc: 'prompt_comparative' },
          { label: 'State Management', desc: 'TreeMap storage' },
        ].map((f) => (
          <div key={f.label} className="bg-gray-900/50 rounded-lg px-3 py-2">
            <div className="text-gray-300 text-xs font-medium">{f.label}</div>
            <div className="text-cyan-400/70 text-[10px] font-mono">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
