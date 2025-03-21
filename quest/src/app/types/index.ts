export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  proposer: string;
  votes?: {
    for: number;
    against: number;
  };
}

export interface ProposalInput {
  title: string;
  description: string;
}

export interface ProposalFormData {
  title: string;
  description: string;
  context?: string;
} 