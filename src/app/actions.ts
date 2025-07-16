'use server';

import { analyzeCodeForErrors, AnalyzeCodeForErrorsInput, AnalyzeCodeForErrorsOutput } from '@/ai/flows/code-error-check';

export async function runCodeAnalysis(data: AnalyzeCodeForErrorsInput): Promise<AnalyzeCodeForErrorsOutput | { error: string }> {
  try {
    const result = await analyzeCodeForErrors(data);
    // Simulate compilation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to analyze code. Please try again.' };
  }
}
