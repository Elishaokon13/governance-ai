    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.19;

    import "@openzeppelin/contracts/access/Ownable.sol";
    import "./AIGovernance.sol";

    /**
    * @title AIMCPOracle
    * @dev Oracle contract that integrates with Base MCP for AI-powered proposal analysis
    */
    contract AIMCPOracle is Ownable {
        AIGovernance public governanceContract;
        
        // Events
        event AIAnalysisRequested(uint256 indexed proposalId, string description);
        event AIAnalysisReceived(uint256 indexed proposalId, string analysis);
        
        // Mapping to track pending analyses
        mapping(uint256 => bool) public pendingAnalyses;
        
        constructor(address _governanceContract) Ownable(msg.sender) {
            governanceContract = AIGovernance(_governanceContract);
        }
        
        /**
        * @dev Request AI analysis for a proposal through Base MCP
        */
        function requestAnalysis(uint256 proposalId) external {
            require(!pendingAnalyses[proposalId], "Analysis already requested");
            
            // Get proposal details from governance contract
            (
                ,
                string memory description,
                ,
                ,
                ,
                ,
                ,
            
            ) = governanceContract.getProposal(proposalId);
            
            pendingAnalyses[proposalId] = true;
            
            // Emit event for Base MCP to pick up
            emit AIAnalysisRequested(proposalId, description);
        }
        
        /**
        * @dev Callback function for Base MCP to provide AI analysis
        * Only callable by authorized MCP relayers
        */
        function submitAnalysis(uint256 proposalId, string calldata analysis) external onlyOwner {
            require(pendingAnalyses[proposalId], "No analysis requested");
            
            // Submit analysis to governance contract
            governanceContract.addAIAnalysis(proposalId, analysis);
            
            // Clear pending status
            pendingAnalyses[proposalId] = false;
            
            emit AIAnalysisReceived(proposalId, analysis);
        }
        
        /**
        * @dev Update governance contract address
        */
        function setGovernanceContract(address _newGovernance) external onlyOwner {
            governanceContract = AIGovernance(_newGovernance);
        }
    } 