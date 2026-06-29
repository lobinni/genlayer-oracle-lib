# { "Depends": "py-genlayer:test" }
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                     GENLAYER REPUTATION ORACLE                               ║
║                                                                              ║
║  Decentralized AI-Powered Review Verification System                        ║
║  Built on GenLayer Intelligent Contracts                                    ║
║                                                                              ║
║  Author: GenLayer Builder                                                   ║
║  Network: GenLayer Testnet (Chain ID: 4221)                                 ║
║  License: MIT                                                               ║
╚══════════════════════════════════════════════════════════════════════════════╝

This Intelligent Contract enables trustless, on-chain reputation scoring
by using GenLayer's consensus mechanism to verify reviews against real
web data. Validators independently fetch and analyze evidence URLs,
then use LLM-powered equivalence principles to reach consensus on
review authenticity and quality scores.

KEY FEATURES:
- Real web data fetching via gl.get_webpage() - no oracles needed
- AI-powered review analysis via gl.exec_prompt()
- Multi-validator consensus via eq_principle_prompt_comparative()
- Credibility-weighted reputation scoring
- Duplicate review prevention

USE CASES:
- DeFi protocol reputation tracking
- NFT project verification
- DAO contributor scoring
- Service provider ratings
- Credential verification
"""

from genlayer import *


class ReputationOracle(gl.Contract):
    """
    Decentralized Reputation Oracle - AI-Powered Review Verification
    
    This contract allows:
    1. Registering entities (businesses, services, products) for tracking
    2. Submitting reviews with evidence URLs that are verified by AI
    3. Querying reputation scores aggregated from verified reviews
    4. Real-time reputation checks via web data fetching
    """
    
    # ═══════════════════════════════════════════════════════════════════════════
    # STATE VARIABLES
    # ═══════════════════════════════════════════════════════════════════════════
    
    owner: Address
    entity_count: u256
    
    # Entity registry: entity_id -> entity data (JSON)
    entities: TreeMap[u256, DynArray[u8]]
    
    # Reviews: entity_id -> list of review data (JSON array)
    reviews: TreeMap[u256, DynArray[u8]]
    
    # Reputation scores: entity_id -> aggregated weighted score
    scores: TreeMap[u256, u256]
    
    # Review count per entity
    review_counts: TreeMap[u256, u256]
    
    # Verified review hashes to prevent duplicates
    verified_hashes: TreeMap[str, bool]
    
    # ═══════════════════════════════════════════════════════════════════════════
    # CONSTRUCTOR
    # ═══════════════════════════════════════════════════════════════════════════
    
    def __init__(self):
        """
        Initialize the Reputation Oracle contract.
        Sets the deployer as the contract owner.
        """
        self.owner = gl.message.sender_account
        self.entity_count = u256(0)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # WRITE METHODS
    # ═══════════════════════════════════════════════════════════════════════════
    
    @gl.public.write
    def register_entity(self, name: str, category: str, website: str):
        """
        Register a new entity (business/service/product) for reputation tracking.
        
        Args:
            name: Entity name (e.g., "Uniswap", "OpenAI")
            category: Category type - 'defi', 'nft', 'service', 'product', 'dao', 'infrastructure'
            website: Official website URL for verification
        
        Emits:
            Entity registered with auto-incremented ID
        
        Example:
            register_entity("Uniswap", "defi", "https://uniswap.org")
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
        Submit a review with evidence URL for AI-powered verification.
        
        This method triggers GenLayer's consensus mechanism:
        1. Each validator independently fetches the evidence_url
        2. Validators analyze the review against evidence using LLMs
        3. Consensus is reached via eq_principle_prompt_comparative
        4. Review is stored with credibility score and verdict
        
        Args:
            entity_id: The entity being reviewed (must exist)
            review_text: The review content/feedback
            evidence_url: URL with supporting evidence (screenshots, tx proofs, etc.)
            rating: Rating from 1-100
        
        Returns:
            Verified review stored on-chain with:
            - CREDIBILITY score (0-100)
            - VERDICT: VERIFIED, SUSPICIOUS, or REJECTED
            - AI analysis explanation
        
        Note:
            This is a non-deterministic operation that consumes more gas
            due to the AI consensus process.
        
        Example:
            submit_verified_review(
                1,
                "Great DEX with low fees and fast swaps",
                "https://etherscan.io/tx/0x123...",
                85
            )
        """
        import json
        
        # Validate rating range
        if int(rating) < 1 or int(rating) > 100:
            raise Exception("Rating must be between 1 and 100")
        
        # Get entity data to verify it exists
        entity_bytes = self.entities[entity_id]
        if len(entity_bytes) == 0:
            raise Exception("Entity not found")
        
        entity_data = json.loads(bytes(entity_bytes).decode())
        entity_name = entity_data["name"]
        entity_category = entity_data["category"]
        
        # Create review hash to prevent duplicates
        review_hash = str(hash(review_text + evidence_url + str(gl.message.sender_account)))
        
        if review_hash in self.verified_hashes and self.verified_hashes[review_hash]:
            raise Exception("Duplicate review detected")
        
        # Capture variables for closure
        r_text = review_text
        e_url = evidence_url
        r_rating = int(rating)
        e_name = entity_name
        e_category = entity_category
        
        def verify_review():
            """
            Non-deterministic function that each validator executes independently.
            Fetches evidence URL and analyzes review authenticity using LLM.
            """
            # Fetch evidence from the provided URL
            # Each validator does this independently!
            evidence_content = gl.get_webpage(e_url, mode="text")
            
            # Construct analysis prompt for LLM
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
        # Validators agree if they reach same VERDICT and scores within 15 points
        verification_result = gl.eq_principle_prompt_comparative(
            verify_review,
            "Two verifications are equivalent if they assign the same VERDICT "
            "(VERIFIED, SUSPICIOUS, or REJECTED) and their CREDIBILITY scores "
            "are within 15 points of each other."
        )
        
        # Parse the verification result
        credibility = 50  # default
        verdict = "SUSPICIOUS"
        
        lines = verification_result.split("\n")
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
        
        # Append to existing reviews
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
        about an entity from the web.
        
        This method allows dynamic reputation updates based on current
        web presence and community sentiment.
        
        Args:
            entity_id: Entity to check (must exist)
            check_url: URL to check for latest reputation data
                       (e.g., social media, review sites, news)
        
        Updates:
            - Entity's last_check_score
            - Entity's last_check_result with full analysis
        
        Example:
            check_entity_reputation(1, "https://twitter.com/search?q=uniswap")
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
            """
            Non-deterministic function to analyze entity reputation
            from provided web source.
            """
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
        lines = reputation_result.split("\n")
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
    
    # ═══════════════════════════════════════════════════════════════════════════
    # VIEW METHODS (Read-only, no gas for state changes)
    # ═══════════════════════════════════════════════════════════════════════════
    
    @gl.public.view
    def get_entity(self, entity_id: u256) -> str:
        """
        Get entity details by ID.
        
        Args:
            entity_id: The entity ID to query
        
        Returns:
            JSON string with entity data or error
        
        Example Response:
            {
                "id": 1,
                "name": "Uniswap",
                "category": "defi",
                "website": "https://uniswap.org",
                "registrant": "0x...",
                "status": "active"
            }
        """
        import json
        entity_bytes = self.entities[entity_id]
        if len(entity_bytes) == 0:
            return json.dumps({"error": "Entity not found"})
        return bytes(entity_bytes).decode()
    
    @gl.public.view
    def get_entity_reviews(self, entity_id: u256) -> str:
        """
        Get all verified reviews for an entity.
        
        Args:
            entity_id: The entity ID to query
        
        Returns:
            JSON array of review objects
        
        Example Response:
            [
                {
                    "reviewer": "0x...",
                    "review_text": "Great protocol!",
                    "rating": 85,
                    "credibility_score": 78,
                    "verdict": "VERIFIED",
                    "ai_analysis": "..."
                }
            ]
        """
        import json
        reviews_bytes = self.reviews.get(entity_id, DynArray[u8](b"[]"))
        return bytes(reviews_bytes).decode()
    
    @gl.public.view
    def get_reputation_score(self, entity_id: u256) -> str:
        """
        Get the aggregated reputation score for an entity.
        
        The score is calculated as the average of all review ratings,
        weighted by their credibility scores.
        
        Args:
            entity_id: The entity ID to query
        
        Returns:
            JSON object with score details
        
        Example Response:
            {
                "entity_id": 1,
                "total_weighted_score": 340,
                "review_count": 5,
                "average_score": 68
            }
        """
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
        """
        Get total number of registered entities.
        
        Returns:
            Number of entities registered
        """
        return self.entity_count
    
    @gl.public.view
    def get_all_entities(self) -> str:
        """
        Get all registered entities with their current scores.
        
        Returns:
            JSON array of all entities with reputation data
        
        Example Response:
            [
                {
                    "id": 1,
                    "name": "Uniswap",
                    "category": "defi",
                    "average_score": 85,
                    "review_count": 12
                },
                ...
            ]
        """
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
