import React, { useState } from "react";
import { Copy, ClipboardCheck } from "lucide-react";

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

  const handleProcess = () => {
    // TODO: Add your processing logic here
    // For now, we'll just convert input to uppercase as a placeholder
    setOutputText(inputText.toUpperCase());
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
