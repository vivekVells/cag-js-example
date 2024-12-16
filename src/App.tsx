import React, { useState } from "react";
import { Copy, ClipboardCheck } from "lucide-react";
import ParagraphSummarizer from "./ai/paragraph_summarizer/stage";

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
    }[] = [];

    const jsonlContent = `{"title": "Getting Started with Python", "originalContent": "Python is an interpreted, high-level programming language known for its simplicity and readability. It emphasizes clean code through proper indentation and straightforward syntax. The language supports multiple programming paradigms including procedural, object-oriented, and functional programming."}
    {"title": "JavaScript Basics", "originalContent": "JavaScript is a dynamic programming language that's primarily used for web development. It enables interactive web pages and is an essential part of web applications. The language supports both frontend and backend development through various frameworks and runtime environments."}
    {"title": "Introduction to Git", "originalContent": "Git is a distributed version control system that tracks changes in source code during software development. It allows multiple developers to work together on the same project while maintaining a complete history of modifications and the ability to work on different features simultaneously."}`;

    const lines = jsonlContent.trim().split("\n");

    // Process lines sequentially
    for (const line of lines) {
      const data = JSON.parse(line);
      console.log("Title:", data.title);
      console.log("Content:", data.originalContent);

      // Wait for compression to complete before moving to next line
      const result = await compressContents(data.originalContent);
      processedResults.push(result);
      console.log("Compressed:", result.compressedContent);
      console.log("---");
    }

    // Update state with results after all processing is complete
    // setResult(processedResults);
    setOutputText(JSON.stringify(processedResults));
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
