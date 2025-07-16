'use server';

/**
 * @fileOverview This file defines a Genkit flow for AI-powered code error checking.
 *
 * It takes code as input, analyzes it for potential errors, and suggests fixes.
 * - analyzeCodeForErrors - The function that initiates the code analysis process.
 * - AnalyzeCodeForErrorsInput - The input type for the analyzeCodeForErrors function.
 * - AnalyzeCodeForErrorsOutput - The output type for the analyzeCodeForErrors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCodeForErrorsInputSchema = z.object({
  code: z.string().describe('The code to be analyzed for errors.'),
  language: z.string().describe('The programming language of the code.'),
});
export type AnalyzeCodeForErrorsInput = z.infer<typeof AnalyzeCodeForErrorsInputSchema>;

const AnalyzeCodeForErrorsOutputSchema = z.object({
  errors: z.array(
    z.object({
      message: z.string().describe('The error message.'),
      location: z.string().describe('The location of the error in the code.'),
      suggestion: z.string().describe('A suggested fix for the error.'),
    })
  ).describe('A list of errors found in the code.'),
});
export type AnalyzeCodeForErrorsOutput = z.infer<typeof AnalyzeCodeForErrorsOutputSchema>;

export async function analyzeCodeForErrors(input: AnalyzeCodeForErrorsInput): Promise<AnalyzeCodeForErrorsOutput> {
  return analyzeCodeForErrorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCodeForErrorsPrompt',
  input: {schema: AnalyzeCodeForErrorsInputSchema},
  output: {schema: AnalyzeCodeForErrorsOutputSchema},
  prompt: `You are an AI code analyzer that identifies errors in code and suggests fixes.

  Analyze the following code, written in {{language}}, for potential errors. Provide specific error messages, their location in the code (if possible), and a suggested fix for each error. Format your repsonse in JSON format.

  Code:
  {{code}}`,
});

const analyzeCodeForErrorsFlow = ai.defineFlow(
  {
    name: 'analyzeCodeForErrorsFlow',
    inputSchema: AnalyzeCodeForErrorsInputSchema,
    outputSchema: AnalyzeCodeForErrorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
