'use server';
/**
 * @fileOverview An AI tool for administrators to generate detailed and technically accurate product descriptions.
 *
 * - adminProductDescriptionGenerator - A function that handles the product description generation process.
 * - AdminProductDescriptionGeneratorInput - The input type for the adminProductDescriptionGenerator function.
 * - AdminProductDescriptionGeneratorOutput - The return type for the adminProductDescriptionGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminProductDescriptionGeneratorInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z
    .string()
    .describe('The category of the product (e.g., Mochi, ESP Devices, Arduino Projects).'),
  technicalSpecs: z
    .string()
    .describe(
      'A detailed list of technical specifications, features, and capabilities of the product.'
    ),
  additionalInfo: z
    .string()
    .optional()
    .describe('Any additional information or context about the product.'),
});
export type AdminProductDescriptionGeneratorInput = z.infer<
  typeof AdminProductDescriptionGeneratorInputSchema
>;

const AdminProductDescriptionGeneratorOutputSchema = z.object({
  productDescription: z
    .string()
    .describe(
      'A detailed and technically accurate product description, including potential use cases and feature highlights.'
    ),
});
export type AdminProductDescriptionGeneratorOutput = z.infer<
  typeof AdminProductDescriptionGeneratorOutputSchema
>;

export async function adminProductDescriptionGenerator(
  input: AdminProductDescriptionGeneratorInput
): Promise<AdminProductDescriptionGeneratorOutput> {
  return adminProductDescriptionGeneratorFlow(input);
}

const generateProductDescriptionPrompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: AdminProductDescriptionGeneratorInputSchema},
  output: {schema: AdminProductDescriptionGeneratorOutputSchema},
  prompt: `You are an expert copywriter specializing in creating detailed, technically accurate, and engaging product descriptions for an electronics and embedded systems e-commerce store called "MicroChub". Your descriptions should highlight key features and suggest potential use cases.

Generate a comprehensive product description based on the following information:

Product Name: {{{productName}}}
Category: {{{category}}}

Technical Specifications:
{{{technicalSpecs}}}

{{#if additionalInfo}}
Additional Information: {{{additionalInfo}}}
{{/if}}

Focus on a technical, engineering-focused, but still fun and maker-friendly tone. Include clear feature highlights and relevant use cases. The description should be suitable for a product page targeting engineering students, embedded systems developers, makers, and DIY enthusiasts.`,
});

const adminProductDescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'adminProductDescriptionGeneratorFlow',
    inputSchema: AdminProductDescriptionGeneratorInputSchema,
    outputSchema: AdminProductDescriptionGeneratorOutputSchema,
  },
  async input => {
    const {output} = await generateProductDescriptionPrompt(input);
    return output!;
  }
);
