// src/api.ts - COMPLETE UPDATED VERSION

// MUST be local Django, NOT Cloud Run
const BASE = "http://127.0.0.1:8000/api";

export type Prediction = {
  id: number;
  period: number;
  depth: number;
  radius: number;
  prediction: string;
  confidence: number;
  model: string;
  mission?: string;
  model_type?: string;
  true_label?: string;
};

export type PredictionResults = {
  success: boolean;
  predictions: Prediction[];
  total_count: number;
  message?: string;
  statistics?: any;
  model_used?: string;
  model_type?: string;
  column_mapping?: Record<string, string>;
  csv_columns?: string[];
  accuracy_info?: {
    accuracy: number;
    correct: number;
    total: number;
  };
};

export type ModelInfo = {
  name: string;
  mission: string;
  accuracy: number;
  f1_score: number;
  precision: number;
  recall: number;
  loaded: boolean;
  error?: string;
  type?: string;
};

// Error response interface
interface ErrorResponse {
  message: string;
  your_columns?: string[];
  available_models?: string[];
  missing_columns?: string[];
  suggestions?: Record<string, string[]>;
  error?: string;
}

// Run prediction with file upload
export async function runPrediction(file: File, modelName?: string): Promise<PredictionResults> {
  console.log(" Uploading:", file.name, modelName ? `with model: ${modelName}` : "");
  
  const form = new FormData();
  form.append("file", file);
  
  // Add model name if provided
  if (modelName && modelName.trim()) {
    form.append("model", modelName);
  }
  
  try {
    console.log("🌐 POST to:", `${BASE}/predict/`);
    
    const response = await fetch(`${BASE}/predict/`, {
      method: "POST",
      body: form
    });
    
    console.log("📡 Status:", response.status, response.statusText);
    
    if (!response.ok) {
      let errorMessage = `Upload failed: ${response.status}`;
      try {
        const errorData: ErrorResponse = await response.json();
        errorMessage = errorData.message || errorMessage;
        
        // Add helpful context
        if (response.status === 400) {
          if (errorData.missing_columns) {
            errorMessage += `\nMissing columns: ${errorData.missing_columns.join(', ')}`;
          }
          if (errorData.your_columns) {
            errorMessage += `\nYour CSV columns: ${errorData.your_columns.join(', ')}`;
          }
          if (errorData.available_models) {
            errorMessage += `\nAvailable models: ${errorData.available_models.join(', ')}`;
          }
          if (errorData.suggestions) {
            errorMessage += `\nSuggestions:`;
            Object.entries(errorData.suggestions).forEach(([missing, suggestions]) => {
              if (suggestions.length > 0) {
                errorMessage += `\n  For "${missing}", try: ${suggestions.join(', ')}`;
              }
            });
          }
        }
      } catch (e) {
        // If response is not JSON
        errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log(" Response received");
    
    // Store in sessionStorage
    const results: PredictionResults = {
      success: data.success !== false,
      predictions: data.predictions || [],
      total_count: data.total_count || 0,
      message: data.message,
      statistics: data.statistics,
      model_used: data.model_used,
      model_type: data.model_type,
      column_mapping: data.column_mapping,
      csv_columns: data.csv_columns,
      accuracy_info: data.accuracy_info
    };
    
    sessionStorage.setItem("predictionResults", JSON.stringify(results));
    console.log(" Stored:", results.predictions.length, "predictions");
    
    return results;
    
  } catch (error) {
    console.error(" Error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to upload: ${error.message}`);
    } else {
      throw new Error("Failed to upload. Check if Django is running.");
    }
  }
}

// Fetch available models
export async function fetchModels(): Promise<{success: boolean, models: ModelInfo[], total_models?: number}> {
  try {
    console.log("🌐 Fetching models from:", `${BASE}/models/`);
    const response = await fetch(`${BASE}/models/`);
    
    if (!response.ok) {
      throw new Error(`Failed to load models: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(" Models loaded:", data.models?.length || 0);
    
    return {
      success: data.success !== false,
      models: data.models || [],
      total_models: data.total_models
    };
  } catch (error) {
    console.error("Error loading models:", error);
    return getFallbackModels();
  }
}

// Helper function for fallback models
function getFallbackModels(): {success: boolean, models: ModelInfo[], total_models?: number} {
  console.warn(" Using fallback models data");
  return {
    success: false,
    models: [
      {
        name: "Random Forest",
        mission: "Kepler/TESS",
        accuracy: 0.89,
        f1_score: 0.86,
        precision: 0.85,
        recall: 0.82,
        loaded: true,
        type: "RandomForestClassifier"
      },
      {
        name: "XGBoost",
        mission: "Kepler/TESS",
        accuracy: 0.94,
        f1_score: 0.91,
        precision: 0.93,
        recall: 0.89,
        loaded: true,
        type: "XGBClassifier"
      }
    ],
    total_models: 2
  };
}

// Run explainability
export async function runExplainability(): Promise<{success: boolean, explainability?: any, message?: string}> {
  try {
    console.log("🌐 Fetching explainability data");
    const response = await fetch(`${BASE}/explain/`);
    
    if (!response.ok) {
      throw new Error(`Explainability failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error in explainability:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get stored results from sessionStorage
export function getStoredResults(): PredictionResults | null {
  const stored = sessionStorage.getItem("predictionResults");
  if (stored) {
    try {
      return JSON.parse(stored) as PredictionResults;
    } catch (error) {
      console.error("Error parsing stored results:", error);
      return null;
    }
  }
  return null;
}

// Clear stored results
export function clearStoredResults(): void {
  sessionStorage.removeItem("predictionResults");
  console.log("🗑️ Cleared stored results");
}

// Check if API is reachable
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE}/models/`, {
      method: 'HEAD',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    const isHealthy = response.ok;
    console.log("🏥 API Health check:", isHealthy ? " Healthy" : " Unhealthy");
    return isHealthy;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
}

// Download results as CSV
export function downloadResultsAsCSV(results: PredictionResults): void {
  if (!results.predictions || results.predictions.length === 0) {
    console.error("No predictions to download");
    return;
  }
  
  const headers = ["ID", "Period", "Depth", "Radius", "Prediction", "Confidence", "Model", "True Label"];
  const csvRows = [
    headers.join(","),
    ...results.predictions.map(p => [
      p.id,
      p.period,
      p.depth,
      p.radius,
      p.prediction,
      p.confidence,
      p.model,
      p.true_label || ""
    ].join(","))
  ];
  
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `exoplanet_predictions_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log(" Downloaded results as CSV");
}

// Export types
export type { ErrorResponse };