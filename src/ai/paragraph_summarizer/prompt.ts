export const PARAGRAPH_SUMMARIZER_PROMPT_TEMPLATE = `
You are tasked with creating an ultra-concise summary of lengthy content.

Your key objectives:

**DO NOT GO OVER 150 words**

Essential Compression:
- Create a summary that is definitively shorter than the original
- Target a 50% or greater reduction in length
- Keep only the most critical core concepts
- Remove any repetitive or supplementary information

Quality Control:
- Maintain perfect accuracy of remaining information
- Preserve vital technical details and specifications
- Ensure the shortened version doesn't introduce new information
- Keep only information present in the original text

Here is the content to compress into a shorter, accurate summary:
{input}

Provide a single, significantly shortened paragraph that captures only the most essential information.
`;
