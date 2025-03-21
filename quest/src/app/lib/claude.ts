import Anthropic from '@anthropic-ai/sdk';
import { ProposalInput } from '@/app/types';

const claude = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '',
  dangerouslyAllowBrowser: true
});

export async function generateProposal(context: string): Promise<ProposalInput> {
  const prompt = `Given the following context, generate a well-structured governance proposal. 
  The proposal should include a clear title and detailed description.
  Context: ${context}
  
  Format the response as a JSON object with 'title' and 'description' fields.`;

  const message = await claude.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  try {
    const response = message.content[0].type === 'text' ? message.content[0].text : '';
    return JSON.parse(response) as ProposalInput;
  } catch (error) {
    console.error('Error parsing Claude response:', error);
    throw new Error('Failed to generate proposal');
  }
} 