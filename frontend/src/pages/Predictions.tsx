// src/pages/Predictions.tsx
import React, { useEffect, useState, useMemo } from "react";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import type { PredictionResults, Prediction, ModelInfo } from "@/api";
import { fetchModels } from "@/api";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Predictions() {
  // Read from sessionStorage
  const [predictionData, setPredictionData] = useState<PredictionResults | null>(null);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log("=== PREDICTIONS PAGE LOADED ===");
    
    // Read predictions from sessionStorage
    const stored = sessionStorage.getItem("predictionResults");
    console.log("sessionStorage content:", stored);
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        console.log(" Parsed prediction data:", data);
        console.log(" Predictions count:", data.predictions?.length || 0);
        setPredictionData(data);
      } catch (error) {
        console.error(" Failed to parse sessionStorage:", error);
      }
    } else {
      console.log("📭 No data in sessionStorage");
    }
    
    // Load models
    fetchModels()
      .then(res => {
        if (res.models) {
          setModels(res.models);
          console.log(" Models loaded:", res.models.length);
        }
      })
      .catch(err => {
        console.error("Failed to load models:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  const predictions = predictionData?.predictions || [];
  
  // Chart data
  const chartData = useMemo(() => {
    return models.map(m => ({
      name: m.name,
      accuracy: Math.round(m.accuracy * 100),
      f1: Math.round((m.f1_score || 0.85) * 100)
    }));
  }, [models]);
  
  // If no predictions
  if (!predictions.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        <h1 className="text-2xl font-bold">Predictions</h1>
        <p className="text-slate-300">
          No predictions found. Please upload a CSV file first.
        </p>
        
        <div className="space-y-3">
          <Link
            to="/upload"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          >
            Go to Upload Page
          </Link>
          
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-sm text-gray-400">Debug Info:</p>
            <p className="text-xs text-gray-500 mt-1">
              sessionStorage has data: {sessionStorage.getItem("predictionResults") ? "Yes" : "No"}
            </p>
            <button
              onClick={() => {
                console.log("Current sessionStorage:", sessionStorage.getItem("predictionResults"));
                window.location.reload();
              }}
              className="mt-2 px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded"
            >
              Refresh & Check Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const fileName = (predictionData as any)?.file_name || "Uploaded dataset";
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Predictions</h1>
          <p className="text-slate-300 mt-1">
            Analysis of <span className="font-semibold">{fileName}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Showing {predictions.length} prediction{predictions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/upload"
            className="px-4 py-2 border border-gray-700 hover:bg-gray-800 rounded-lg transition"
          >
            Upload New CSV
          </Link>
          <Link
            to="/explainability"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
          >
            View Explainability
          </Link>
        </div>
      </header>
      
      {/* Model Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Model Performance</CardTitle>
          <CardDescription>
            Accuracy and F1 scores for each model
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-400">Loading model data...</p>
            </div>
          ) : chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      borderColor: "#374151",
                      borderRadius: "6px"
                    }}
                    formatter={(value) => [`${value}%`, "Score"]}
                  />
                  <Legend />
                  <Bar dataKey="accuracy" fill="#3B82F6" name="Accuracy %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="f1" fill="#8B5CF6" name="F1 Score %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-400">No model data available</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Predictions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Prediction Results</CardTitle>
          <CardDescription>
            Detailed analysis of each candidate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>ID</TH>
                  <TH>Period (days)</TH>
                  <TH>Depth</TH>
                  <TH>Radius</TH>
                  <TH>Prediction</TH>
                  <TH>Confidence</TH>
                  <TH>Model</TH>
                  <TH>Mission</TH>
                </TR>
              </THead>
              <TBody>
                {predictions.map((p) => (
                  <TR key={p.id} className="hover:bg-gray-800/30">
                    <TD className="font-medium">{p.id}</TD>
                    <TD>{p.period.toFixed(3)}</TD>
                    <TD>{p.depth.toFixed(6)}</TD>
                    <TD>{p.radius.toFixed(3)}</TD>
                    <TD>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        p.prediction === "EXOPLANET"
                          ? "bg-green-900/30 text-green-400"
                          : "bg-red-900/30 text-red-400"
                      }`}>
                        {p.prediction}
                      </span>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{Math.round(p.confidence * 100)}%</span>
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.round(p.confidence * 100)}%` }}
                          />
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300">
                        {p.model}
                      </span>
                    </TD>
                    <TD>{p.mission || "—"}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
          
          {/* Summary */}
          <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between text-sm text-gray-400">
            <div>
              Total predictions: {predictions.length}
            </div>
            <div>
              Exoplanets: {predictions.filter(p => p.prediction === "EXOPLANET").length}
              {" • "}
              False positives: {predictions.filter(p => p.prediction === "FALSE POSITIVE").length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}