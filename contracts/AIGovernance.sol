// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title AIGovernance
 * @dev A governance contract that combines AI analysis with on-chain voting
 */
contract AIGovernance is Ownable {
    using Counters for Counters.Counter;

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        string aiAnalysis;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event ProposalAnalyzed(uint256 indexed proposalId, string aiAnalysis);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);

    // State variables
    Counters.Counter private _proposalIds;
    mapping(uint256 => Proposal) public proposals;
    IERC20 public votingToken;
    uint256 public constant VOTING_PERIOD = 3 days;
    uint256 public constant MINIMUM_TOKENS_REQUIRED = 100 * 10**18; // 100 tokens

    constructor(address _votingToken) Ownable(msg.sender) {
        votingToken = IERC20(_votingToken);
    }

    /**
     * @dev Creates a new proposal
     * @param description The proposal description (can be IPFS hash)
     */
    function createProposal(string memory description) external returns (uint256) {
        require(votingToken.balanceOf(msg.sender) >= MINIMUM_TOKENS_REQUIRED, "Insufficient voting tokens");
        
        _proposalIds.increment();
        uint256 proposalId = _proposalIds.current();
        
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.description = description;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + VOTING_PERIOD;
        
        emit ProposalCreated(proposalId, msg.sender, description);
        return proposalId;
    }

    /**
     * @dev Adds AI analysis to a proposal (only callable by owner/authorized AI oracle)
     */
    function addAIAnalysis(uint256 proposalId, string memory analysis) external onlyOwner {
        require(proposals[proposalId].id != 0, "Proposal doesn't exist");
        proposals[proposalId].aiAnalysis = analysis;
        emit ProposalAnalyzed(proposalId, analysis);
    }

    /**
     * @dev Cast a vote on a proposal
     */
    function castVote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal doesn't exist");
        require(block.timestamp <= proposal.endTime, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");

        uint256 voterWeight = votingToken.balanceOf(msg.sender);
        require(voterWeight > 0, "No voting power");

        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.forVotes += voterWeight;
        } else {
            proposal.againstVotes += voterWeight;
        }

        emit VoteCast(proposalId, msg.sender, support, voterWeight);
    }

    /**
     * @dev Execute a proposal after voting period ends
     */
    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal doesn't exist");
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Already executed");

        proposal.executed = true;
        
        // Here we would implement the actual execution logic
        // For now, we just emit an event
        emit ProposalExecuted(proposalId);
    }

    /**
     * @dev View function to get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        string memory description,
        string memory aiAnalysis,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 startTime,
        uint256 endTime,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.proposer,
            proposal.description,
            proposal.aiAnalysis,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.startTime,
            proposal.endTime,
            proposal.executed
        );
    }

    /**
     * @dev View function to get the total number of proposals
     */
    function proposalCount() external view returns (uint256) {
        return _proposalIds.current();
    }
} 