import { ArrowDown, Brain, Globe, Shield, Database, Users } from 'lucide-react';

export default function ArchitectureDiagram() {
  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700/50">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Shield size={16} className="text-yellow-400" />
          How It Works
        </h3>
        <p className="text-gray-400 text-xs mt-0.5">
          AI-powered review verification via GenLayer consensus
        </p>
      </div>

      <div className="p-5">
        {/* Flow Diagram */}
        <div className="flex flex-col items-center gap-3">
          {/* Step 1 */}
          <div className="w-full flex items-center gap-3 bg-gray-900/50 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20">1</span>
                <span className="text-white text-sm font-medium">User Submits Review</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Review text + evidence URL + rating → sent as transaction with GEN gas fee
              </p>
            </div>
          </div>

          <ArrowDown size={16} className="text-gray-600" />

          {/* Step 2 */}
          <div className="w-full flex items-center gap-3 bg-gray-900/50 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Globe size={18} className="text-cyan-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20">2</span>
                <span className="text-white text-sm font-medium">Validators Fetch Evidence</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Each validator independently fetches the evidence URL via <code className="text-cyan-400 bg-cyan-500/10 px-1 rounded">gl.get_webpage()</code>
              </p>
            </div>
          </div>

          <ArrowDown size={16} className="text-gray-600" />

          {/* Step 3 */}
          <div className="w-full flex items-center gap-3 bg-gray-900/50 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Brain size={18} className="text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-purple-400 text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20">3</span>
                <span className="text-white text-sm font-medium">AI Analysis & Consensus</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                LLMs analyze evidence vs review claims. <code className="text-purple-400 bg-purple-500/10 px-1 rounded">eq_principle_prompt_comparative</code> ensures validators agree on verdict
              </p>
            </div>
          </div>

          <ArrowDown size={16} className="text-gray-600" />

          {/* Step 4 */}
          <div className="w-full flex items-center gap-3 bg-gray-900/50 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <Database size={18} className="text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20">4</span>
                <span className="text-white text-sm font-medium">On-Chain Storage</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Verified review with credibility score (VERIFIED / SUSPICIOUS / REJECTED) stored permanently on-chain
              </p>
            </div>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {[
            { label: 'No Oracles', desc: 'Direct web access', color: 'emerald' },
            { label: 'Multi-LLM', desc: 'Diverse validators', color: 'cyan' },
            { label: 'Trustless', desc: 'No central authority', color: 'purple' },
          ].map((f) => (
            <div
              key={f.label}
              className={`text-center p-3 rounded-lg bg-${f.color}-500/5 border border-${f.color}-500/10`}
              style={{
                backgroundColor: f.color === 'emerald' ? 'rgba(16,185,129,0.05)' : f.color === 'cyan' ? 'rgba(6,182,212,0.05)' : 'rgba(168,85,247,0.05)',
                borderColor: f.color === 'emerald' ? 'rgba(16,185,129,0.1)' : f.color === 'cyan' ? 'rgba(6,182,212,0.1)' : 'rgba(168,85,247,0.1)',
              }}
            >
              <div className="text-white text-xs font-medium">{f.label}</div>
              <div className="text-gray-400 text-[10px]">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
