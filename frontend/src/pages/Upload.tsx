// src/pages/Upload.tsx
import React, { useState } from "react";
import { runPrediction } from "@/api";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file first");
      return;
    }

    console.log("=== UPLOAD STARTING ===");
    console.log("File:", file.name);
    
    setLoading(true);
    setError(null);

    try {
      const results = await runPrediction(file);
      console.log(" Upload successful:", results);
      
      setSuccess(true);
      
      // Navigate to predictions after delay
      setTimeout(() => {
        navigate("/predictions");
      }, 1000);
      
    } catch (err: any) {
      console.error(" Upload failed:", err);
      setError(err.message || "Upload failed. Check if Django server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Upload Dataset</h1>
          <p className="text-slate-300">
            Upload a CSV file containing exoplanet candidate data for analysis.
          </p>
        </header>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-6">
          {/* File upload area */}
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-gray-900/50 hover:bg-gray-800/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV files only</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Selected file info */}
            {file && (
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-900/30 rounded">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CSV format info */}
          <div className="bg-gray-900/30 p-4 rounded-lg border border-gray-800">
            <h3 className="font-medium mb-2">Required CSV Format</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• At least 3 numeric columns (period, depth, radius)</li>
              <li>• Column names don't matter - will auto-detect</li>
              <li>• First row can be headers</li>
              <li>• Sample file: <code className="bg-gray-800 px-2 py-1 rounded">test_exoplanets.csv</code></li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
                !file || loading
                  ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Run Prediction"
              )}
            </button>
            
            <button
              onClick={() => navigate("/predictions")}
              className="py-3 px-6 rounded-lg font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition"
            >
              View Previous Predictions
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-red-900/50 rounded mr-3">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-red-300">Upload Failed</p>
                  <p className="text-sm text-red-400 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-900/30 border border-green-800 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-900/50 rounded mr-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-green-300">Success!</p>
                  <p className="text-sm text-green-400 mt-1">
                    File uploaded and predictions generated. Redirecting...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}