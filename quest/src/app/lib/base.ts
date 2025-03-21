import { SmartContract, useContract, useContractWrite } from "@thirdweb-dev/react";

export const GOVERNANCE_CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";

export const useGovernanceContract = () => {
  return useContract(GOVERNANCE_CONTRACT_ADDRESS);
};

export const useSubmitProposal = () => {
  const { contract } = useGovernanceContract();
  return useContractWrite(contract, "submitProposal");
};

export const useVoteOnProposal = () => {
  const { contract } = useGovernanceContract();
  return useContractWrite(contract, "vote");
}; 