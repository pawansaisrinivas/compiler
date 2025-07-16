'use server';

import { analyzeCodeForErrors, AnalyzeCodeForErrorsInput, AnalyzeCodeForErrorsOutput } from '@/ai/flows/code-error-check';
import { executeCode, ExecuteCodeInput, ExecuteCodeOutput } from '@/ai/flows/execute-code-flow';

export async function runCodeAnalysis(data: AnalyzeCodeForErrorsInput): Promise<AnalyzeCodeForErrorsOutput | { error: string }> {
  try {
    const result = await analyzeCodeForErrors(data);
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to analyze code. Please try again.' };
  }
}

export async function runCodeExecution(data: ExecuteCodeInput): Promise<ExecuteCodeOutput | { error: string }> {
  try {
    // Simulate compilation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result = await executeCode(data);
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to execute code. Please try again.' };
  }
}
