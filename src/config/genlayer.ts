// GenLayer Testnet Configuration
// These can be overridden via environment variables
export const GENLAYER_TESTNET = {
  chainId: 4221,
  name: 'GenLayer Testnet',
  rpcUrl: import.meta.env.VITE_GENLAYER_RPC_URL || 'https://rpc.testnet-chain.genlayer.com',
  symbol: 'GEN',
  explorer: import.meta.env.VITE_EXPLORER_URL || 'https://explorer.testnet-chain.genlayer.com',
  faucet: 'https://testnet-faucet.genlayer.foundation/',
  decimals: 18,
};

// The Intelligent Contract Python source code
// This is a Decentralized Reputation Oracle contract
export const INTELLIGENT_CONTRACT_CODE = `# { "Depends": "py-genlayer:test" }
from genlayer import *

class ReputationOracle(gl.Contract):
    """
    Decentralized Reputation Oracle - AI-Powered Review Verification
    
    This Intelligent Contract enables trustless, on-chain reputation scoring
    by using GenLayer's consensus mechanism to verify reviews against real
    web data. Validators independently fetch and analyze evidence URLs,
    then use LLM-powered equivalence principles to reach consensus on
    review authenticity and quality scores.
    
    Use cases:
    - Verifying product/service reviews against actual evidence
    - Building decentralized reputation systems
    - Trustless review aggregation for DeFi protocols
    - On-chain credential verification
    """
    
    # State variables
    owner: Address
    entity_count: u256
    
    # Entity registry: entity_id -> entity data
    entities: TreeMap[u256, DynArray[u8]]
    
    # Reviews: entity_id -> list of review data  
    reviews: TreeMap[u256, DynArray[u8]]
    
    # Reputation scores: entity_id -> aggregated score
    scores: TreeMap[u256, u256]
    
    # Review count per entity
    review_counts: TreeMap[u256, u256]
    
    # Verified review hashes to prevent duplicates
    verified_hashes: TreeMap[str, bool]
    
    def __init__(self):
        """Initialize the Reputation Oracle contract."""
        self.owner = gl.message.sender_account
        self.entity_count = u256(0)
    
    @gl.public.write
    def register_entity(self, name: str, category: str, website: str):
        """
        Register a new entity (business/service/product) for reputation tracking.
        
        Args:
            name: Entity name
            category: Category (e.g., 'defi', 'nft', 'service', 'product')
            website: Official website URL
        """
        self.entity_count = u256(self.entity_count + u256(1))
        entity_id = self.entity_count
        
        import json
        entity_data = json.dumps({
            "id": int(entity_id),
            "name": name,
            "category": category,
            "website": website,
            "registrant": str(gl.message.sender_account),
            "status": "active"
        })
        
        self.entities[entity_id] = DynArray[u8](entity_data.encode())
        self.scores[entity_id] = u256(0)
        self.review_counts[entity_id] = u256(0)
    
    @gl.public.write
    def submit_verified_review(
        self,
        entity_id: u256,
        review_text: str,
        evidence_url: str,
        rating: u256
    ):
        """
        Submit a review with evidence URL. Validators will independently
        fetch the evidence URL and use AI to verify the review's authenticity
        and assign a credibility score.
        
        Args:
            entity_id: The entity being reviewed
            review_text: The review content
            evidence_url: URL with supporting evidence (e.g., transaction proof, screenshot)
            rating: Rating from 1-100
        """
        import json
        
        if int(rating) < 1 or int(rating) > 100:
            raise Exception("Rating must be between 1 and 100")
        
        # Get entity data
        entity_bytes = self.entities[entity_id]
        if len(entity_bytes) == 0:
            raise Exception("Entity not found")
        
        entity_data = json.loads(bytes(entity_bytes).decode())
        entity_name = entity_data["name"]
        entity_category = entity_data["category"]
        
        review_hash = str(hash(review_text + evidence_url + str(gl.message.sender_account)))
        
        if review_hash in self.verified_hashes and self.verified_hashes[review_hash]:
            raise Exception("Duplicate review detected")
        
        # Non-deterministic verification using AI consensus
        r_text = review_text
        e_url = evidence_url
        r_rating = int(rating)
        e_name = entity_name
        e_category = entity_category
        
        def verify_review():
            # Fetch evidence from the provided URL
            evidence_content = gl.get_webpage(e_url, mode="text")
            
            prompt = f"""You are a review verification expert. Analyze this review and its evidence.

ENTITY: {e_name} (Category: {e_category})
REVIEW TEXT: {r_text}
REVIEWER RATING: {r_rating}/100
EVIDENCE URL CONTENT: {evidence_content[:3000]}

Tasks:
1. Verify if the evidence supports the review claims
2. Check for signs of fake/spam reviews
3. Assess the quality and helpfulness of the review
4. Assign a CREDIBILITY SCORE from 0-100

Respond in this EXACT format:
CREDIBILITY: [score 0-100]
VERDICT: [VERIFIED or SUSPICIOUS or REJECTED]
ANALYSIS: [2-3 sentence explanation]"""
            
            result = gl.exec_prompt(prompt)
            return result
        
        # Use comparative equivalence principle for consensus
        verification_result = gl.eq_principle_prompt_comparative(
            verify_review,
            "Two verifications are equivalent if they assign the same VERDICT "
            "(VERIFIED, SUSPICIOUS, or REJECTED) and their CREDIBILITY scores "
            "are within 15 points of each other."
        )
        
        # Parse the verification result
        credibility = 50  # default
        verdict = "SUSPICIOUS"
        
        lines = verification_result.split("\\n")
        for line in lines:
            if "CREDIBILITY:" in line:
                try:
                    score_str = line.split("CREDIBILITY:")[1].strip()
                    credibility = int(''.join(filter(str.isdigit, score_str[:5])))
                    credibility = max(0, min(100, credibility))
                except:
                    pass
            if "VERDICT:" in line:
                v = line.split("VERDICT:")[1].strip().upper()
                if "VERIFIED" in v:
                    verdict = "VERIFIED"
                elif "REJECTED" in v:
                    verdict = "REJECTED"
                else:
                    verdict = "SUSPICIOUS"
        
        # Store the verified review
        review_data = json.dumps({
            "entity_id": int(entity_id),
            "reviewer": str(gl.message.sender_account),
            "review_text": r_text,
            "evidence_url": e_url,
            "rating": r_rating,
            "credibility_score": credibility,
            "verdict": verdict,
            "ai_analysis": verification_result,
            "review_hash": review_hash
        })
        
        # Append review
        existing = self.reviews.get(entity_id, DynArray[u8](b"[]"))
        existing_list = json.loads(bytes(existing).decode())
        existing_list.append(json.loads(review_data))
        self.reviews[entity_id] = DynArray[u8](json.dumps(existing_list).encode())
        
        # Update aggregated score (weighted by credibility)
        current_score = int(self.scores[entity_id])
        current_count = int(self.review_counts[entity_id])
        
        weighted_rating = (r_rating * credibility) // 100
        new_total = current_score + weighted_rating
        new_count = current_count + 1
        
        self.scores[entity_id] = u256(new_total)
        self.review_counts[entity_id] = u256(new_count)
        self.verified_hashes[review_hash] = True
    
    @gl.public.write
    def check_entity_reputation(self, entity_id: u256, check_url: str):
        """
        Perform a real-time reputation check by fetching latest data
        about an entity from the web and updating its reputation score.
        
        Args:
            entity_id: Entity to check
            check_url: URL to check for latest reputation data
        """
        import json
        
        entity_bytes = self.entities[entity_id]
        if len(entity_bytes) == 0:
            raise Exception("Entity not found")
        
        entity_data = json.loads(bytes(entity_bytes).decode())
        e_name = entity_data["name"]
        e_category = entity_data["category"]
        e_website = entity_data["website"]
        c_url = check_url
        
        def fetch_reputation():
            web_content = gl.get_webpage(c_url, mode="text")
            
            prompt = f"""Analyze the reputation of this entity based on the provided web content.

ENTITY: {e_name}
CATEGORY: {e_category}  
OFFICIAL WEBSITE: {e_website}
WEB CONTENT FROM {c_url}: {web_content[:4000]}

Based on the content, provide:
1. An overall REPUTATION SCORE from 0-100
2. Key POSITIVE indicators found
3. Key NEGATIVE indicators or red flags
4. A brief SUMMARY

Format your response EXACTLY as:
SCORE: [0-100]
POSITIVES: [comma-separated list]
NEGATIVES: [comma-separated list]
SUMMARY: [2-3 sentences]"""
            
            result = gl.exec_prompt(prompt)
            return result
        
        reputation_result = gl.eq_principle_prompt_comparative(
            fetch_reputation,
            "Two reputation assessments are equivalent if their SCORE values "
            "are within 20 points of each other and they identify similar "
            "positive and negative indicators."
        )
        
        # Parse score from result
        score = 50
        lines = reputation_result.split("\\n")
        for line in lines:
            if "SCORE:" in line:
                try:
                    score_str = line.split("SCORE:")[1].strip()
                    score = int(''.join(filter(str.isdigit, score_str[:5])))
                    score = max(0, min(100, score))
                except:
                    pass
        
        # Update entity data with latest check
        entity_data["last_check_score"] = score
        entity_data["last_check_result"] = reputation_result
        self.entities[entity_id] = DynArray[u8](json.dumps(entity_data).encode())
    
    @gl.public.view
    def get_entity(self, entity_id: u256) -> str:
        """Get entity details by ID."""
        import json
        entity_bytes = self.entities[entity_id]
        if len(entity_bytes) == 0:
            return json.dumps({"error": "Entity not found"})
        return bytes(entity_bytes).decode()
    
    @gl.public.view
    def get_entity_reviews(self, entity_id: u256) -> str:
        """Get all reviews for an entity."""
        import json
        reviews_bytes = self.reviews.get(entity_id, DynArray[u8](b"[]"))
        return bytes(reviews_bytes).decode()
    
    @gl.public.view
    def get_reputation_score(self, entity_id: u256) -> str:
        """Get the aggregated reputation score for an entity."""
        import json
        total_score = int(self.scores[entity_id])
        count = int(self.review_counts[entity_id])
        
        avg_score = total_score // count if count > 0 else 0
        
        return json.dumps({
            "entity_id": int(entity_id),
            "total_weighted_score": total_score,
            "review_count": count,
            "average_score": avg_score
        })
    
    @gl.public.view
    def get_entity_count(self) -> u256:
        """Get total number of registered entities."""
        return self.entity_count
    
    @gl.public.view
    def get_all_entities(self) -> str:
        """Get all registered entities."""
        import json
        entities = []
        for i in range(1, int(self.entity_count) + 1):
            entity_bytes = self.entities[u256(i)]
            if len(entity_bytes) > 0:
                entity = json.loads(bytes(entity_bytes).decode())
                # Add score info
                total_score = int(self.scores[u256(i)])
                count = int(self.review_counts[u256(i)])
                entity["average_score"] = total_score // count if count > 0 else 0
                entity["review_count"] = count
                entities.append(entity)
        return json.dumps(entities)
`;

// Contract address - this would be set after deployment
export const CONTRACT_ADDRESS = '0x' + '0'.repeat(40); // Placeholder

export const EXPLORER_TX_URL = (hash: string) =>
  `${GENLAYER_TESTNET.explorer}/tx/${hash}`;

export const EXPLORER_ADDRESS_URL = (address: string) =>
  `${GENLAYER_TESTNET.explorer}/address/${address}`;
