'use client';

import { useState } from 'react';
import ProposalForm from './components/ProposalForm';
import ProposalList from './components/ProposalList';
import { Proposal, ProposalFormData } from './types';

export default function Home() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleProposalSubmit = (formData: ProposalFormData) => {
    const newProposal: Proposal = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      proposer: 'Anonymous',
      votes: {
        for: 0,
        against: 0,
      },
    };

    setProposals((prev) => [...prev, newProposal]);
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 border-r border-gray-800">
          <div className="p-4">
            <button
              onClick={() => setShowForm(true)}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white hover:from-indigo-500 hover:to-purple-500 transition-all"
            >
              New Proposal
            </button>
          </div>
          <div className="px-4 py-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Recent Proposals
            </h2>
            <div className="mt-2 space-y-1">
              {proposals.map((proposal) => (
                <button
                  key={proposal.id}
                  className="w-full text-left px-2 py-1 text-sm text-gray-300 hover:bg-gray-800 rounded-md truncate"
                >
                  {proposal.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
            <div className="px-6 py-4">
              <h1 className="text-xl font-semibold text-white">Governance Proposals</h1>
            </div>
          </header>

          {/* Chat area */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="animate-fade-in">
                  <ProposalList proposals={[proposal]} />
                </div>
              ))}
              {proposals.length === 0 && !showForm && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No proposals yet. Create one to get started!</p>
                </div>
              )}
            </div>
          </div>

          {/* Input area */}
          <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto p-4">
              {showForm ? (
                <ProposalForm onSubmit={handleProposalSubmit} />
              ) : (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full rounded-xl bg-gray-800 p-4 text-gray-400 hover:bg-gray-750 transition-all text-left"
                >
                  Click to create a new proposal...
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
