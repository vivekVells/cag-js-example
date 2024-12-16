import CAG from "../cag/interface";
import { PARAGRAPH_SUMMARIZER_PROMPT_TEMPLATE } from "./prompt";

export const ROLE = "bullet_consolidator";

class ParagraphSummarizer {
  private cag: CAG;

  constructor() {
    this.cag = new CAG(
      {
        chunkSize: 3000,
        chunkOverlap: 500,
        iteration_limit: 20,
        iteration_output_token_limit: 10000,
      },
      PARAGRAPH_SUMMARIZER_PROMPT_TEMPLATE
    );
  }

  public async summarizeToParagraph(text: string): Promise<string> {
    const response = this.cag.generate_recursive(text);
    return response;
  }
}

export default ParagraphSummarizer;
