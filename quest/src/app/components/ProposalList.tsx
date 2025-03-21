'use client';

import { Proposal } from '../types';

export default function ProposalList({ proposals }: { proposals: Proposal[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-white">Submitted Proposals</h2>
      <div className="space-y-6">
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="glass-effect rounded-xl p-6 transition-all hover:transform hover:scale-[1.02] hover:shadow-2xl"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-medium text-white">{proposal.title}</h3>
                <p className="text-sm text-gray-300 mt-2">
                  Proposed by {proposal.proposer} on{' '}
                  {new Date(proposal.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  proposal.status === 'approved'
                    ? 'bg-green-400/10 text-green-400'
                    : proposal.status === 'rejected'
                    ? 'bg-red-400/10 text-red-400'
                    : proposal.status === 'submitted'
                    ? 'bg-blue-400/10 text-blue-400'
                    : 'bg-gray-400/10 text-gray-400'
                }`}
              >
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </span>
            </div>
            <p className="mt-4 text-gray-300 leading-relaxed">{proposal.description}</p>
            {proposal.votes && (
              <div className="mt-6 flex space-x-6">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <span className="text-sm text-gray-300">
                    {proposal.votes.for} For
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="text-sm text-gray-300">
                    {proposal.votes.against} Against
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
        {proposals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No proposals submitted yet</p>
          </div>
        )}
      </div>
    </div>
  );
} 