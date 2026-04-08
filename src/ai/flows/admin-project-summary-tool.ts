'use server';
/**
 * @fileOverview An AI agent for administrators to summarize custom service project descriptions.
 *
 * - adminProjectSummaryTool - A function that handles the summarization of project descriptions.
 * - AdminProjectSummaryToolInput - The input type for the adminProjectSummaryTool function.
 * - AdminProjectSummaryToolOutput - The return type for the adminProjectSummaryTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminProjectSummaryToolInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('Detailed description of the custom service project.'),
  fileDataUri:
    z.string().optional().describe(
      "An optional file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. This file might contain additional project details, schematics, or mockups."
    ),
});
export type AdminProjectSummaryToolInput = z.infer<
  typeof AdminProjectSummaryToolInputSchema
>;

const AdminProjectSummaryToolOutputSchema = z.object({
  summary: z.string().describe('A concise overall summary of the project.'),
  keyRequirements:
    z.array(z.string()).describe('A list of core functionalities and mandatory features of the project.'),
  technicalSpecifications:
    z.array(z.string()).describe(
      'A list of technical details such as voltage, MCU, communication protocols, components, and other relevant hardware/software specs.'
    ),
  potentialChallenges:
    z.array(z.string()).describe(
      'A list of foreseen difficulties, risks, or complexities in implementing the project, such as component availability, integration issues, or unusual requirements.'
    ),
});
export type AdminProjectSummaryToolOutput = z.infer<
  typeof AdminProjectSummaryToolOutputSchema
>;

export async function adminProjectSummaryTool(
  input: AdminProjectSummaryToolInput
): Promise<AdminProjectSummaryToolOutput> {
  return adminProjectSummaryToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminProjectSummaryToolPrompt',
  input: {schema: AdminProjectSummaryToolInputSchema},
  output: {schema: AdminProjectSummaryToolOutputSchema},
  prompt: `You are an expert project manager and electronics engineer specializing in custom hardware and embedded systems. Your task is to analyze a user-submitted project description and an optional attached file to identify key requirements, technical specifications, and potential challenges.\n\nAnalyze the following project details carefully:\n\nProject Description:\n{{{projectDescription}}}\n\n{{#if fileDataUri}}\nAdditional File: {{media url=fileDataUri}}\n{{/if}}\n\nBased on the provided information, extract the following:\n1.  **Key Requirements**: What are the core functionalities and mandatory features?\n2.  **Technical Specifications**: What are the critical technical details (e.g., voltage, MCU, communication protocols, specific components, software platforms)?\n3.  **Potential Challenges**: What difficulties, risks, or complexities might arise during implementation? Consider component availability, integration issues, unique requirements, or budget/time constraints.\n\nFinally, provide a concise overall summary of the project.`,
});

const adminProjectSummaryToolFlow = ai.defineFlow(
  {
    name: 'adminProjectSummaryToolFlow',
    inputSchema: AdminProjectSummaryToolInputSchema,
    outputSchema: AdminProjectSummaryToolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate project summary.');
    }
    return output;
  }
);
