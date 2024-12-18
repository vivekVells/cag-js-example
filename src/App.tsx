/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Copy, ClipboardCheck } from "lucide-react";
import ParagraphSummarizer from "./ai/paragraph_summarizer/stage";
import { jsonForSmallDataset } from "./dataset/inputs/small_articles";
import { jsonForMediumDataset } from "./dataset/inputs/medium_articles";
import { jsonForLargeDataset } from "./dataset/inputs/large_articles";
import { jsonForExtraLargeDataset } from "./dataset/inputs/extra_large_articles";
import { jsonForHumongousDataset } from "./dataset/inputs/humongous_articles";

// Define types for datasets
type DatasetKey = "small" | "medium" | "large" | "extraLarge" | "humongous";
type Dataset = {
  title: string;
  originalContent: string;
};

const datasetOptions = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
  { label: "Extra Large", value: "extraLarge" },
  { label: "Humongous", value: "humongous" },
];

const datasets: Record<DatasetKey, Dataset[]> = {
  small: jsonForSmallDataset,
  medium: jsonForMediumDataset,
  large: jsonForLargeDataset,
  extraLarge: jsonForExtraLargeDataset,
  humongous: jsonForHumongousDataset,
};

function App() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetKey>("small");
  const [outputText, setOutputText] = useState<string>("");
  const [inputtedText, setInputtedText] = useState<string>("");
  const [outputCopied, setOutputCopied] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [originalDataSize, setOriginalDataSize] = useState<number>(0);
  const [compressedDataSize, setCompressedDataSize] = useState<number>(0);

  // Load dataset content when selectedDataset changes
  useEffect(() => {
    const evaluateDataSet = datasets[selectedDataset];
    const originalContents = evaluateDataSet.map(
      (item) => JSON.stringify(item, null, 2) // Show the entire item in raw JSON format
    );
    setInputtedText(originalContents.join("\n\n"));

    // Calculate total data size for original content
    const totalSize = originalContents.reduce(
      (acc, item) => acc + new TextEncoder().encode(item).length,
      0
    );
    setOriginalDataSize(totalSize);
  }, [selectedDataset]);

  const compressContents = async (originalContent: string) => {
    const paragraphSummarizer = new ParagraphSummarizer();
    const compressedContent = await paragraphSummarizer.summarizeToParagraph(
      originalContent
    );
    return { originalContent, compressedContent };
  };

  const handleProcess = async () => {
    setOutputText("");
    setIsProcessing(true);
    const processedResults: any[] = [];
    let totalCompressedSize = 0;

    const evaluateDataSet = datasets[selectedDataset];

    for (const item of evaluateDataSet) {
      const startTime = performance.now();
      const result = await compressContents(item.originalContent);
      const endTime = performance.now();
      const processingTimeMs = endTime - startTime;

      const originalSize = new TextEncoder().encode(
        item.originalContent
      ).length;
      const compressedSize = new TextEncoder().encode(
        result.compressedContent
      ).length;

      totalCompressedSize += compressedSize;

      const compressionRatio = compressedSize / originalSize;

      processedResults.push({
        title: item.title,
        ...result,
        processingTimeMs,
        originalSize,
        compressedSize,
        compressionRatio,
      });
    }

    // Show the entire processed result in raw JSON format
    setOutputText(JSON.stringify(processedResults, null, 2));
    setCompressedDataSize(totalCompressedSize);
    setIsProcessing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setOutputCopied(true);
        setTimeout(() => setOutputCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-900">
          CAG JS Implementation Example
        </h1>

        <div className="mb-6">
          <label
            htmlFor="dataset-selector"
            className="block mb-2 text-gray-700 font-semibold text-lg"
          >
            Select Dataset
          </label>
          <select
            id="dataset-selector"
            className="w-full p-3 border-2 border-blue-200 rounded-lg bg-gray-100"
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value as DatasetKey)}
          >
            {datasetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center my-6">
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-lg"
          >
            <span>{isProcessing ? "Processing..." : "Process"}</span>
          </button>
        </div>

        <div className="relative mb-6">
          <label
            htmlFor="inputted-text"
            className="block mb-3 text-gray-700 font-semibold text-lg"
          >
            Original Contents
          </label>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">
              Total Data Size: {originalDataSize} bytes
            </span>
          </div>
          <textarea
            id="inputted-text"
            className="w-full p-4 border-2 border-blue-200 rounded-lg bg-gray-100 resize-none text-base h-48"
            value={inputtedText}
            readOnly
            placeholder="Dataset content will appear here..."
          />
        </div>

        <div className="relative">
          <label
            htmlFor="output-text"
            className="block mb-3 text-gray-700 font-semibold text-lg"
          >
            Compressed Contents
          </label>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">
              Total Data Size: {compressedDataSize} bytes
            </span>
          </div>
          <div className="relative">
            <textarea
              id="output-text"
              className="w-full p-4 border-2 border-blue-200 rounded-lg bg-gray-100 cursor-not-allowed resize-none text-base h-48"
              value={outputText}
              readOnly
              placeholder="Processed output will appear here..."
            />
            <button
              onClick={() => copyToClipboard(outputText)}
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
