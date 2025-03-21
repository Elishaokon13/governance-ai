'use client';

import { useState } from 'react';
import { generateProposal } from '../lib/claude';
import { ProposalFormData } from '../types';

export default function ProposalForm({ onSubmit }: { onSubmit: (data: ProposalFormData) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProposalFormData>({
    title: '',
    description: '',
    context: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.context) {
        const generated = await generateProposal(formData.context);
        setFormData((prev) => ({
          ...prev,
          title: generated.title,
          description: generated.description,
        }));
      }
      onSubmit(formData);
    } catch (error) {
      console.error('Error generating proposal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Context Field */}
      <div className="transition-all duration-300 hover:scale-[1.01]">
        <label htmlFor="context" className="block text-sm font-medium text-gray-200 mb-2">
          Context (Optional - AI will help generate a proposal)
        </label>
        <textarea
          id="context"
          name="context"
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          value={formData.context}
          onChange={(e) => setFormData((prev) => ({ ...prev, context: e.target.value }))}
          placeholder="Enter context for AI-generated proposal..."
          aria-describedby="context-help"
        />
      </div>

      {/* Title Field */}
      <div className="transition-all duration-300 hover:scale-[1.01]">
        <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          required
          placeholder="Enter proposal title..."
        />
      </div>

      {/* Description Field */}
      <div className="transition-all duration-300 hover:scale-[1.01]">
        <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          required
          placeholder="Enter proposal description..."
        />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02]"
          aria-label={isLoading ? 'Generating proposal...' : 'Submit proposal'}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Submit Proposal'
          )}
        </button>
      </div>
    </form>
  );
}