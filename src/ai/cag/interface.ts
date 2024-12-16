/* eslint-disable @typescript-eslint/no-explicit-any */
// CAG Interface

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { prepare_prompt } from "..";

type CAGConfig = {
  chunkSize: number;
  chunkOverlap: number;
  iteration_limit?: number;
  iteration_output_token_limit?: number;
};

class CAG {
  _ai: any;
  _role: any;
  splitter: RecursiveCharacterTextSplitter;
  prompt_template: string;
  config: CAGConfig;

  constructor(config: CAGConfig, prompt_template: string) {
    this._ai = null;
    this._role = null;
    this.splitter = this.setupSplitter(config);
    this.prompt_template = prompt_template;
    this.config = config;
    this.validateConfig(config);
  }

  validateConfig = (config: CAGConfig) => {
    if (config.chunkSize < 1) {
      throw new Error("chunkSize must be greater than 0");
    }
    if (config.chunkOverlap < 0) {
      throw new Error("chunkOverlap must be greater than or equal to 0");
    }
    if (config.iteration_limit) {
      if (config.iteration_limit < 2) {
        throw new Error("iteration_limit must be greater than 1");
      }
      if (config.iteration_limit > 100) {
        throw new Error("iteration_limit must be less than or equal to 100");
      }
    }
    if (
      config.iteration_output_token_limit &&
      config.iteration_output_token_limit < 1
    ) {
      throw new Error("iteration_output_token_limit must be greater than 0");
    }
  };

  setupSplitter = (config: CAGConfig) => {
    return new RecursiveCharacterTextSplitter({
      chunkSize: config.chunkSize,
      chunkOverlap: config.chunkOverlap,
    });
  };

  initialize = async (aiType = "languageModel", config = {}) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await window.ai[aiType].create(config);
  };

  generate_sequential = async (longInput: string): Promise<string> => {
    const chunks = await this.splitter.splitText(longInput);
    console.log("Chunks: ", chunks);
    console.log("Number of chunks: ", chunks.length);
    const output: string[] = [];
    for (const chunk of chunks) {
      this._ai = await this.initialize();
      console.log("Running chunk number: ", chunk);
      const prompt = prepare_prompt(this.prompt_template, chunk);
      const response = await this._ai.prompt(prompt);
      console.log("Response for chunk", response);
      output.push(response);
      await this._ai.destroy();
    }
    console.log("Output: ", output);
    return output.join("<br>");
  };

  generate_recursive = async (
    longInput: string,
    iterationCount = 0
  ): Promise<string> => {
    if (
      !this.config.iteration_limit &&
      !this.config.iteration_output_token_limit
    ) {
      throw new Error(
        "Either iteration_limit or iteration_output_token_limit must be set."
      );
    }
    if (
      this.config.iteration_limit &&
      iterationCount >= this.config.iteration_limit
    ) {
      console.log("Iteration limit reached.");
      return longInput;
    }

    const chunks = await this.splitter.splitText(longInput);
    console.log(
      `Iteration ${iterationCount + 1}: Number of chunks`,
      chunks.length
    );

    const output: string[] = [];
    for (const chunk of chunks) {
      this._ai = await this.initialize();
      const prompt = prepare_prompt(this.prompt_template, chunk);
      const response = await this._ai.prompt(prompt);
      console.log(`Response for chunk: ${response}`);
      output.push(response);
      await this._ai.destroy();
    }

    const combinedOutput = output.join(" ");
    console.log(
      `Combined Output (Iteration ${iterationCount + 1}):`,
      combinedOutput
    );

    // Check if output token limit is reached
    if (
      this.config.iteration_output_token_limit &&
      combinedOutput.length <= this.config.iteration_output_token_limit
    ) {
      console.log("Output token limit satisfied.");
      return combinedOutput;
    }

    // Recursive call with new input
    return this.generate_recursive(combinedOutput, iterationCount + 1);
  };
}

export default CAG;
