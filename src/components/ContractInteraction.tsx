import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { GENLAYER_TESTNET } from '../config/genlayer';
import {
  readContract,
  writeContract,
  writeContractFinalized,
  formatTxHash,
  getExplorerTxUrl,
  saveContractAddress,
  loadContractAddress,
} from '../services/genlayerSDK';
import {
  ExternalLink,
  Loader2,
  CheckCircle2,
  XCircle,
  Building2,
  Star,
  Search,
  ShieldCheck,
  Settings,
  Plus,
  AlertTriangle,
  Wallet,
  FileCode2,
  Zap,
} from 'lucide-react';

type Tab = 'deploy' | 'register' | 'review' | 'query';

export default function ContractInteraction() {
  const { isConnected, privateKey, balance } = useWallet();
  const [activeTab, setActiveTab] = useState<Tab>('deploy');
  const [contractAddr, setContractAddr] = useState(loadContractAddress() || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: string; error?: string; data?: string; txHash?: string } | null>(null);

  // Register Entity form
  const [entityName, setEntityName] = useState('');
  const [entityCategory, setEntityCategory] = useState('defi');
  const [entityWebsite, setEntityWebsite] = useState('');

  // Submit Review form
  const [reviewEntityId, setReviewEntityId] = useState('1');
  const [reviewText, setReviewText] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [rating, setRating] = useState('75');

  // Query form
  const [queryEntityId, setQueryEntityId] = useState('1');
  const [queryType, setQueryType] = useState<'entity' | 'reviews' | 'score' | 'all' | 'count'>('all');

  const insufficientBalance = parseFloat(balance) <= 0;

  const handleSaveContract = () => {
    if (contractAddr) {
      saveContractAddress(contractAddr);
      setResult({ success: 'Contract address saved! You can now interact with the contract.' });
    }
  };

  // Read from contract (view methods)
  const handleReadContract = async (functionName: string, args: any[] = []) => {
    if (!contractAddr) {
      setResult({ error: 'Please set the contract address first' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await readContract(contractAddr, functionName, args);
      
      if (res.success) {
        let displayData = res.data;
        
        // Try to parse JSON if it's a string
        if (typeof res.data === 'string') {
          try {
            displayData = JSON.stringify(JSON.parse(res.data), null, 2);
          } catch {
            displayData = res.data;
          }
        } else {
          displayData = JSON.stringify(res.data, null, 2);
        }
        
        setResult({
          success: `Successfully called ${functionName}`,
          data: displayData,
        });
      } else {
        setResult({ error: res.error || 'Failed to read from contract' });
      }
    } catch (err: any) {
      setResult({ error: err.message || 'Failed to read from contract' });
    } finally {
      setIsLoading(false);
    }
  };

  // Write to contract (state-changing methods)
  const handleWriteContract = async (functionName: string, args: any[] = [], waitForFinalized: boolean = false) => {
    if (!contractAddr) {
      setResult({ error: 'Please set the contract address first' });
      return;
    }

    if (!privateKey) {
      setResult({ error: 'Please connect your wallet first' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const writeFn = waitForFinalized ? writeContractFinalized : writeContract;
      const res = await writeFn(privateKey, contractAddr, functionName, args);
      
      if (res.success) {
        setResult({
          success: `Transaction successful! Method: ${functionName}`,
          data: res.data ? JSON.stringify(res.data, null, 2) : undefined,
          txHash: res.txHash,
        });
      } else {
        setResult({ error: res.error || 'Transaction failed' });
      }
    } catch (err: any) {
      setResult({ error: err.message || 'Transaction failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'deploy' as Tab, label: 'Setup', icon: <Settings size={14} /> },
    { id: 'register' as Tab, label: 'Register', icon: <Plus size={14} /> },
    { id: 'review' as Tab, label: 'Review', icon: <Star size={14} /> },
    { id: 'query' as Tab, label: 'Query', icon: <Search size={14} /> },
  ];

  if (!isConnected) {
    return (
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 text-center">
        <Wallet size={32} className="text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400 text-sm mb-2">Create or import a wallet to interact with contracts</p>
        <p className="text-gray-500 text-xs">
          Uses genlayer-js SDK for real Intelligent Contract calls
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700/50">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <ShieldCheck size={16} className="text-purple-400" />
          Intelligent Contract Interaction
        </h3>
        <p className="text-gray-400 text-xs mt-0.5">
          Real contract calls via genlayer-js SDK
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(null); }}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-4">
        {/* Setup Tab */}
        {activeTab === 'deploy' && (
          <>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h4 className="text-purple-300 text-sm font-medium mb-2 flex items-center gap-2">
                <FileCode2 size={14} />
                Deploy via GenLayer Studio
              </h4>
              <ol className="text-gray-300 text-xs space-y-2 list-decimal list-inside">
                <li>Go to <a href="https://studio.genlayer.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">studio.genlayer.com</a></li>
                <li>Paste the contract code from the "Contract" tab</li>
                <li>Deploy to GenLayer Testnet</li>
                <li>Copy the deployed contract address below</li>
                <li>Get GEN from <a href={GENLAYER_TESTNET.faucet} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">faucet</a> for gas</li>
              </ol>
            </div>

            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Contract Address</label>
              <input
                type="text"
                placeholder="0x... (deployed contract address)"
                value={contractAddr}
                onChange={(e) => setContractAddr(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white text-sm font-mono placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <button
              onClick={handleSaveContract}
              disabled={!contractAddr}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm disabled:opacity-40 hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Save Contract Address
            </button>

            {/* SDK Info */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <h4 className="text-emerald-300 text-sm font-medium mb-2 flex items-center gap-2">
                <Zap size={14} />
                genlayer-js SDK Integration
              </h4>
              <p className="text-gray-300 text-xs">
                This dApp uses the official <code className="text-cyan-400 bg-cyan-500/10 px-1 rounded">genlayer-js</code> SDK 
                to interact with GenLayer Intelligent Contracts. All transactions are real and require GEN tokens for gas.
              </p>
            </div>

            {/* Network Info */}
            <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
              <h4 className="text-white text-sm font-medium">GenLayer Testnet</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Chain ID:</span>
                  <span className="text-white ml-2">{GENLAYER_TESTNET.chainId}</span>
                </div>
                <div>
                  <span className="text-gray-500">Symbol:</span>
                  <span className="text-white ml-2">{GENLAYER_TESTNET.symbol}</span>
                </div>
              </div>
              <div className="text-xs">
                <span className="text-gray-500">RPC:</span>
                <code className="text-emerald-400 ml-2 text-[10px]">{GENLAYER_TESTNET.rpcUrl}</code>
              </div>
            </div>
          </>
        )}

        {/* Register Entity Tab */}
        {activeTab === 'register' && (
          <>
            {insufficientBalance && (
              <div className="px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-amber-400 text-xs">
                <AlertTriangle size={14} />
                Need GEN tokens for gas fees - <a href={GENLAYER_TESTNET.faucet} target="_blank" rel="noopener noreferrer" className="underline">Get from faucet</a>
              </div>
            )}

            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Entity Name</label>
              <input
                type="text"
                placeholder="e.g., Uniswap, OpenAI, etc."
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Category</label>
              <select
                value={entityCategory}
                onChange={(e) => setEntityCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="defi">DeFi Protocol</option>
                <option value="nft">NFT Project</option>
                <option value="service">Web3 Service</option>
                <option value="product">Product</option>
                <option value="dao">DAO</option>
                <option value="infrastructure">Infrastructure</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Website URL</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={entityWebsite}
                onChange={(e) => setEntityWebsite(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <button
              onClick={() => handleWriteContract('register_entity', [entityName, entityCategory, entityWebsite])}
              disabled={isLoading || !entityName || !entityWebsite || insufficientBalance || !contractAddr}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm disabled:opacity-40 hover:from-emerald-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Loader2 size={14} className="animate-spin" /> Processing...</>
              ) : (
                <><Building2 size={14} /> Register Entity</>
              )}
            </button>
          </>
        )}

        {/* Submit Review Tab */}
        {activeTab === 'review' && (
          <>
            {insufficientBalance && (
              <div className="px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-amber-400 text-xs">
                <AlertTriangle size={14} />
                Need GEN for gas - AI consensus uses more gas
              </div>
            )}

            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
              <p className="text-cyan-300 text-xs">
                ⚡ This triggers <strong>AI-powered consensus</strong>. Validators will independently 
                fetch the evidence URL and verify the review using LLMs. May take 1-3 minutes.
              </p>
            </div>

            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Entity ID</label>
              <input
                type="number"
                value={reviewEntityId}
                onChange={(e) => setReviewEntityId(e.target.value)}
                min="1"
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Review Text</label>
              <textarea
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Evidence URL</label>
              <input
                type="url"
                placeholder="https://... (URL with proof/evidence)"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">
                Rating: {rating}/100
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-gray-500 text-[10px]">
                <span>Poor</span>
                <span>Average</span>
                <span>Excellent</span>
              </div>
            </div>

            <button
              onClick={() => handleWriteContract(
                'submit_verified_review', 
                [parseInt(reviewEntityId), reviewText, evidenceUrl, parseInt(rating)],
                true // Wait for finalized (AI consensus)
              )}
              disabled={isLoading || !reviewText || !evidenceUrl || insufficientBalance || !contractAddr}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm disabled:opacity-40 hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Loader2 size={14} className="animate-spin" /> AI Verification (1-3 min)...</>
              ) : (
                <><Star size={14} /> Submit Verified Review</>
              )}
            </button>
          </>
        )}

        {/* Query Tab */}
        {activeTab === 'query' && (
          <>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Query Type</label>
              <select
                value={queryType}
                onChange={(e) => setQueryType(e.target.value as any)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="all">Get All Entities</option>
                <option value="count">Get Entity Count</option>
                <option value="entity">Get Entity Details</option>
                <option value="reviews">Get Entity Reviews</option>
                <option value="score">Get Reputation Score</option>
              </select>
            </div>

            {(queryType === 'entity' || queryType === 'reviews' || queryType === 'score') && (
              <div>
                <label className="text-gray-400 text-xs font-medium block mb-1.5">Entity ID</label>
                <input
                  type="number"
                  value={queryEntityId}
                  onChange={(e) => setQueryEntityId(e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            )}

            <button
              onClick={() => {
                const methodMap: Record<string, { method: string; args: any[] }> = {
                  all: { method: 'get_all_entities', args: [] },
                  count: { method: 'get_entity_count', args: [] },
                  entity: { method: 'get_entity', args: [parseInt(queryEntityId)] },
                  reviews: { method: 'get_entity_reviews', args: [parseInt(queryEntityId)] },
                  score: { method: 'get_reputation_score', args: [parseInt(queryEntityId)] },
                };
                const { method, args } = methodMap[queryType];
                handleReadContract(method, args);
              }}
              disabled={isLoading || !contractAddr}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold text-sm disabled:opacity-40 hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Loader2 size={14} className="animate-spin" /> Querying...</>
              ) : (
                <><Search size={14} /> Query Contract (Free)</>
              )}
            </button>
            
            <p className="text-gray-500 text-[10px] text-center">
              View methods are free — no gas required
            </p>
          </>
        )}

        {/* Result Display */}
        {result && (
          <div
            className={`px-4 py-3 rounded-lg border ${
              result.error
                ? 'bg-red-500/10 border-red-500/20'
                : 'bg-emerald-500/10 border-emerald-500/20'
            }`}
          >
            {result.error ? (
              <div className="flex items-start gap-2 text-red-400 text-sm">
                <XCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span className="break-all">{result.error}</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-1">
                  <CheckCircle2 size={14} />
                  {result.success}
                </div>
                {result.txHash && (
                  <a
                    href={getExplorerTxUrl(result.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-300 text-xs font-mono flex items-center gap-1 hover:underline mb-2"
                  >
                    TX: {formatTxHash(result.txHash)} <ExternalLink size={10} />
                  </a>
                )}
                {result.data && (
                  <div className="mt-2 bg-gray-900/50 rounded-lg p-3 overflow-x-auto max-h-60">
                    <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap break-all">
                      {result.data}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
