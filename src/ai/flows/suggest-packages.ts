'use server';

/**
 * @fileOverview AI agent that suggests packages based on meal selections.
 *
 * - suggestPackages - A function that suggests packages based on meal selections.
 * - SuggestPackagesInput - The input type for the suggestPackages function.
 * - SuggestPackagesOutput - The return type for the suggestPackages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPackagesInputSchema = z.object({
  mealSelections: z
    .string()
    .describe('A comma-separated list of meal selections.'),
});
export type SuggestPackagesInput = z.infer<typeof SuggestPackagesInputSchema>;

const SuggestPackagesOutputSchema = z.object({
  suggestedPackages: z
    .string()
    .describe('A comma-separated list of suggested packages.'),
});
export type SuggestPackagesOutput = z.infer<typeof SuggestPackagesOutputSchema>;

export async function suggestPackages(input: SuggestPackagesInput): Promise<SuggestPackagesOutput> {
  return suggestPackagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPackagesPrompt',
  input: {schema: SuggestPackagesInputSchema},
  output: {schema: SuggestPackagesOutputSchema},
  prompt: `You are a catering expert. Based on the following meal selections, suggest popular packages.

Meal Selections: {{{mealSelections}}}

Suggested Packages (comma-separated):`,
});

const suggestPackagesFlow = ai.defineFlow(
  {
    name: 'suggestPackagesFlow',
    inputSchema: SuggestPackagesInputSchema,
    outputSchema: SuggestPackagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
