/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Copy, ClipboardCheck } from "lucide-react";
import ParagraphSummarizer from "./ai/paragraph_summarizer/stage";
import { jsonForSmallDataset } from "./dataset/input-data";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [inputCopied, setInputCopied] = useState(false);
  const [outputCopied, setOutputCopied] = useState(false);

  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInputText(e.target.value);
  };

  const compressContents = async (originalContent: string) => {
    const paragraphSummarizer = new ParagraphSummarizer();
    const compressedContent = await paragraphSummarizer.summarizeToParagraph(
      originalContent
    );

    // Return an object with originalContent and compressedContent
    return { originalContent, compressedContent };
  };

  const handleProcess = async () => {
    setOutputText("");
    const processedResults: {
      originalContent: string;
      compressedContent: string;
      processingTimeMs: number;
      originalSize: number;
      compressedSize: number;
      compressionRatio: number;
    }[] = [];

    for (const item of jsonForSmallDataset) {
      // Start timing
      const startTime = performance.now();

      // Wait for compression to complete
      const result = await compressContents(item.originalContent);

      // End timing
      const endTime = performance.now();
      const processingTimeMs = endTime - startTime;

      // Calculate sizes (in bytes)
      const originalSize = new TextEncoder().encode(
        item.originalContent
      ).length;
      const compressedSize = new TextEncoder().encode(
        result.compressedContent
      ).length;

      // Calculate compression ratio
      const compressionRatio = compressedSize / originalSize;

      // Add the result with all metrics
      processedResults.push({
        ...result,
        processingTimeMs,
        originalSize,
        compressedSize,
        compressionRatio,
      });

      console.log("Compressed:", result.compressedContent);
      console.log("Processing time:", processingTimeMs.toFixed(2), "ms");
      console.log("Original size:", originalSize, "bytes");
      console.log("Compressed size:", compressedSize, "bytes");
      console.log("Compression ratio:", compressionRatio.toFixed(3));
      setOutputText(JSON.stringify(processedResults));
      console.log("---");
    }

    const totalProcessingTime = processedResults.reduce(
      (sum, item) => sum + item.processingTimeMs,
      0
    );
    const averageCompressionRatio =
      processedResults.reduce((sum, item) => sum + item.compressionRatio, 0) /
      processedResults.length;

    console.log("Total processing time:", totalProcessingTime.toFixed(2), "ms");
    console.log(
      "Average compression ratio:",
      averageCompressionRatio.toFixed(3)
    );

    return {
      results: processedResults,
      totalProcessingTimeMs: totalProcessingTime,
      averageCompressionRatio,
    };
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (type === "input") {
          setInputCopied(true);
          setTimeout(() => setInputCopied(false), 2000);
        } else {
          setOutputCopied(true);
          setTimeout(() => setOutputCopied(false), 2000);
        }
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-900">
          CAG JS Implementation Example
        </h1>

        <div className="mb-6 relative">
          <label
            htmlFor="input-text"
            className="block mb-3 text-gray-700 font-semibold text-lg"
          >
            Input Text
          </label>
          <div className="relative">
            <textarea
              id="input-text"
              className="w-full p-4 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none text-base h-48"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter your text here..."
            />
            <button
              onClick={() => copyToClipboard(inputText, "input")}
              className="absolute top-3 right-3 text-blue-600 hover:text-blue-800 transition-colors"
              title="Copy Input"
            >
              {inputCopied ? (
                <ClipboardCheck className="w-6 h-6 text-green-500" />
              ) : (
                <Copy className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-center my-6">
          <button
            onClick={handleProcess}
            disabled={!inputText}
            className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-lg"
          >
            <span>Process</span>
          </button>
        </div>

        <div className="relative">
          <label
            htmlFor="output-text"
            className="block mb-3 text-gray-700 font-semibold text-lg"
          >
            Output Text
          </label>
          <div className="relative">
            <textarea
              id="output-text"
              className="w-full p-4 border-2 border-blue-200 rounded-lg bg-gray-100 cursor-not-allowed resize-none text-base h-48"
              value={outputText}
              readOnly
              placeholder="Processed output will appear here..."
            />
            <button
              onClick={() => copyToClipboard(outputText, "output")}
              className="absolute top-3 right-3 text-blue-600 hover:text-blue-800 transition-colors"
              disabled={!outputText}
              title="Copy Output"
            >
              {outputCopied ? (
                <ClipboardCheck className="w-6 h-6 text-green-500" />
              ) : (
                <Copy className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
