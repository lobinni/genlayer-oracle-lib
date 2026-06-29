import { useState } from 'react';
import { WalletProvider } from './context/WalletContext';
import Header from './components/Header';
import NetworkInfo from './components/NetworkInfo';
import ContractView from './components/ContractView';
import TransactionPanel from './components/TransactionPanel';
import ContractInteraction from './components/ContractInteraction';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import Footer from './components/Footer';
import { GENLAYER_TESTNET } from './config/genlayer';
import {
  Shield,
  Zap,
  Globe,
  Brain,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Star,
  Lock,
  Eye,
  Sparkles,
} from 'lucide-react';

type PageTab = 'overview' | 'contract' | 'interact' | 'transact';

function AppContent() {
  const [activeSection, setActiveSection] = useState<PageTab>('overview');

  const sections: { id: PageTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Eye size={16} /> },
    { id: 'contract', label: 'Contract', icon: <Brain size={16} /> },
    { id: 'interact', label: 'Interact', icon: <Zap size={16} /> },
    { id: 'transact', label: 'Transact', icon: <Sparkles size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
              <Shield size={12} />
              GenLayer Intelligent Contract · Chain ID {GENLAYER_TESTNET.chainId}
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Decentralized{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Reputation Oracle
              </span>
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              AI-powered review verification on GenLayer. Validators independently fetch web evidence,
              analyze reviews with LLMs, and reach consensus via{' '}
              <span className="text-cyan-400 font-medium">Optimistic Democracy</span>.
              Real transactions with real gas fees.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mb-8">
              {[
                { label: 'Consensus', value: 'AI-Powered', icon: <Brain size={14} className="text-purple-400" /> },
                { label: 'Data Source', value: 'Real Web', icon: <Globe size={14} className="text-cyan-400" /> },
                { label: 'Verification', value: 'Multi-LLM', icon: <CheckCircle2 size={14} className="text-emerald-400" /> },
                { label: 'Gas Fees', value: 'Real GEN', icon: <Zap size={14} className="text-yellow-400" /> },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center gap-1 text-white text-sm font-semibold">
                    {stat.icon}
                    {stat.value}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="flex items-center justify-center gap-3">
              <a
                href={GENLAYER_TESTNET.faucet}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                Get Testnet GEN
                <ArrowRight size={14} />
              </a>
              <a
                href={GENLAYER_TESTNET.explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                Explorer
                <ExternalLink size={12} />
              </a>
              <a
                href="https://docs.genlayer.com/developers/intelligent-contracts/introduction"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                Docs
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-40 bg-gray-950/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeSection === section.id
                    ? 'text-emerald-400 border-emerald-400'
                    : 'text-gray-400 border-transparent hover:text-gray-300'
                }`}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: <Shield size={24} className="text-emerald-400" />,
                  title: 'Trustless Verification',
                  desc: 'Reviews are verified by multiple independent AI validators. No central authority decides what is true.',
                  gradient: 'from-emerald-500/10 to-emerald-500/5',
                  border: 'border-emerald-500/20',
                },
                {
                  icon: <Globe size={24} className="text-cyan-400" />,
                  title: 'Real Web Data',
                  desc: 'Validators fetch evidence directly from the web using gl.get_webpage() — no oracles or APIs needed.',
                  gradient: 'from-cyan-500/10 to-cyan-500/5',
                  border: 'border-cyan-500/20',
                },
                {
                  icon: <Brain size={24} className="text-purple-400" />,
                  title: 'LLM Consensus',
                  desc: 'Each validator uses its own LLM to analyze and rate reviews. Optimistic Democracy ensures honest consensus.',
                  gradient: 'from-purple-500/10 to-purple-500/5',
                  border: 'border-purple-500/20',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className={`bg-gradient-to-b ${feature.gradient} border ${feature.border} rounded-2xl p-6 hover:scale-[1.02] transition-transform`}
                >
                  <div className="mb-3">{feature.icon}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Architecture + Network */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ArchitectureDiagram />
              <NetworkInfo />
            </div>

            {/* Use Cases */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Star size={18} className="text-yellow-400" />
                Real-World Use Cases
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'DeFi Protocol Reviews', desc: 'Verify user experiences with DeFi protocols by cross-referencing on-chain data and community feedback' },
                  { title: 'NFT Project Reputation', desc: 'AI-verified reputation scores for NFT collections based on delivery history and community sentiment' },
                  { title: 'DAO Contributor Scoring', desc: 'Build verifiable reputation for DAO contributors based on their deliverables and impact' },
                  { title: 'Service Provider Rating', desc: 'Trustless ratings for web3 service providers with evidence-backed verification' },
                  { title: 'Credential Verification', desc: 'Verify claims about skills, certifications, or achievements via public evidence' },
                  { title: 'Cross-Chain Trust', desc: 'Portable reputation that works across chains via GenLayer bridge capabilities' },
                ].map((uc) => (
                  <div key={uc.title} className="bg-gray-900/50 rounded-xl p-4">
                    <h4 className="text-white text-sm font-medium mb-1 flex items-center gap-2">
                      <Lock size={12} className="text-emerald-400" />
                      {uc.title}
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{uc.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'contract' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ContractView />
            </div>
            <div className="space-y-6">
              <NetworkInfo />
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-5">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <Zap size={14} className="text-yellow-400" />
                  Contract Methods
                </h3>
                <div className="space-y-2">
                  {[
                    { name: 'register_entity', type: 'write', desc: 'Register an entity for tracking' },
                    { name: 'submit_verified_review', type: 'write ⚡', desc: 'AI-verified review submission' },
                    { name: 'check_entity_reputation', type: 'write ⚡', desc: 'Real-time reputation check' },
                    { name: 'get_entity', type: 'view', desc: 'Get entity details' },
                    { name: 'get_entity_reviews', type: 'view', desc: 'Get all reviews' },
                    { name: 'get_reputation_score', type: 'view', desc: 'Get aggregated score' },
                    { name: 'get_all_entities', type: 'view', desc: 'List all entities' },
                  ].map((m) => (
                    <div key={m.name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-900/50">
                      <div>
                        <div className="text-white text-xs font-mono">{m.name}</div>
                        <div className="text-gray-500 text-[10px]">{m.desc}</div>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          m.type.includes('write')
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {m.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'interact' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContractInteraction />
            <div className="space-y-6">
              <ArchitectureDiagram />
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-5">
                <h3 className="text-white font-semibold text-sm mb-3">📋 Quick Start Guide</h3>
                <ol className="space-y-3 text-gray-300 text-xs">
                  <li className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">1</span>
                    <span>Create a wallet or import a private key with GEN tokens</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">2</span>
                    <span>Get free GEN from the <a href={GENLAYER_TESTNET.faucet} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">testnet faucet</a></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">3</span>
                    <span>Deploy the contract via <a href="https://studio.genlayer.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">GenLayer Studio</a></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">4</span>
                    <span>Set the deployed contract address in the "Setup" tab</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">5</span>
                    <span>Register entities & submit AI-verified reviews!</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'transact' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TransactionPanel />
            <div className="space-y-6">
              <NetworkInfo />
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-5">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <Zap size={14} className="text-yellow-400" />
                  Transaction Info
                </h3>
                <div className="space-y-3 text-gray-300 text-xs">
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <div className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Network</div>
                    <div className="text-white font-medium">{GENLAYER_TESTNET.name}</div>
                    <div className="text-gray-500">Chain ID: {GENLAYER_TESTNET.chainId}</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <div className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Gas Token</div>
                    <div className="text-white font-medium">{GENLAYER_TESTNET.symbol}</div>
                    <div className="text-gray-500">All transactions require GEN for gas</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <div className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">RPC Endpoint</div>
                    <code className="text-emerald-400 text-[10px] font-mono break-all">{GENLAYER_TESTNET.rpcUrl}</code>
                  </div>
                  <p className="text-gray-500 text-[10px] leading-relaxed">
                    These are real transactions on the GenLayer Testnet. Gas fees are paid in GEN tokens.
                    Get free testnet tokens from the faucet to start transacting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}
