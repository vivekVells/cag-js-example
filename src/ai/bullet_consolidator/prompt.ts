export const BULLET_CONSOLIDATOR_PROMPT_TEMPLATE = `
Please consolidate the provided list of bullet points into fewer, more meaningful points. 
Follow these instructions:

1. Merge similar or redundant bullet points into concise statements.
2. Limit the output to **a maximum of 25 consolidated bullet points**.
3. Ensure all bullet points are well-structured and presented in sequential order.
4. Separate each bullet point with a **newline**.
5. Avoid creating sub-sections, headings, or any additional content outside the bullet points.

Provide only the consolidated bullet points as the output.

BULLET POINTS TO CONSOLIDATE:
{input}
`;
