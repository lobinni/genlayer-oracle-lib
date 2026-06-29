import { GENLAYER_TESTNET } from '../config/genlayer';
import { ExternalLink, BookOpen, MessageCircle } from 'lucide-react';

export default function Footer() {
  const links = [
    { label: 'GenLayer Docs', url: 'https://docs.genlayer.com', icon: <BookOpen size={12} /> },
    { label: 'Explorer', url: GENLAYER_TESTNET.explorer, icon: <ExternalLink size={12} /> },
    { label: 'Faucet', url: GENLAYER_TESTNET.faucet, icon: <ExternalLink size={12} /> },
    { label: 'GenLayer Studio', url: 'https://studio.genlayer.com', icon: <ExternalLink size={12} /> },
    { label: 'GitHub', url: 'https://github.com/genlayerlabs', icon: <ExternalLink size={12} /> },
    { label: 'Community', url: 'https://discord.gg/genlayer', icon: <MessageCircle size={12} /> },
  ];

  return (
    <footer className="bg-gray-900/80 border-t border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">GL</span>
              </div>
              <span className="text-white font-semibold text-sm">Reputation Oracle</span>
            </div>
            <p className="text-gray-500 text-xs max-w-md leading-relaxed">
              A decentralized AI-powered review verification system built on GenLayer's Intelligent Contracts. 
              Uses real GenLayer consensus with gas fees on the testnet.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-emerald-400 transition-colors"
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-gray-600 text-[10px]">
          <span>Built with GenLayer Intelligent Contracts · Chain ID: {GENLAYER_TESTNET.chainId}</span>
          <span>Powered by Optimistic Democracy Consensus</span>
        </div>
      </div>
    </footer>
  );
}
