import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { runExplainability } from "@/api";
import type { PredictionResults, Prediction } from "@/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

type FeatureImportance = { feature: string; importance: number };
type ShapValues = Record<string, number>;

function getPredictionResults(): PredictionResults | null {
  const stored = sessionStorage.getItem("predictionResults");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as PredictionResults;
  } catch {
    return null;
  }
}

export default function Explainability() {
  const [loading, setLoading] = useState(false);
  const [featureImportance, setFeatureImportance] = useState<
    FeatureImportance[] | null
  >(null);
  const [shapValues, setShapValues] = useState<ShapValues | null>(null);
  const { toast } = useToast();

  const predictionResults = getPredictionResults();
  const predictions: Prediction[] = predictionResults?.predictions ?? [];

  const confidenceDist = useMemo(() => {
    const bins = {
      "Very High (>95%)": 0,
      "High (90–95%)": 0,
      "Medium (80–90%)": 0,
      "Low (<80%)": 0
    };

    predictions.forEach((p) => {
      const c = (p.confidence ?? 0) * 100;
      if (c >= 95) bins["Very High (>95%)"] += 1;
      else if (c >= 90) bins["High (90–95%)"] += 1;
      else if (c >= 80) bins["Medium (80–90%)"] += 1;
      else bins["Low (<80%)"] += 1;
    });

    return Object.entries(bins).map(([category, count]) => ({
      category,
      count
    }));
  }, [predictions]);

  const handleLoad = async () => {
    setLoading(true);
    try {
      toast({
        title: "Loading explainability",
        description: "Computing feature importance and SHAP-style insights..."
      });
      const merged = await runExplainability();
      const explain = merged.explainability || {};
      setFeatureImportance(explain.feature_importance || null);
      setShapValues(explain.shap_values || null);

      toast({
        title: "Explainability loaded",
        description: "Feature importance and SHAP values updated."
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Explainability failed",
        description: err?.message || "An error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fi = featureImportance || [
    { feature: "period", importance: 0.28 },
    { feature: "depth", importance: 0.24 },
    { feature: "duration", importance: 0.18 },
    { feature: "teff", importance: 0.12 },
    { feature: "stellar_radius", importance: 0.10 },
    { feature: "insolation", importance: 0.08 }
  ];

  const shap = shapValues || {
    period: 0.18,
    depth: 0.14,
    duration: 0.09,
    teff: -0.06,
    stellar_radius: 0.05,
    insolation: -0.04
  };

  const fiChartData = fi.map((f) => ({
    feature: f.feature,
    importance: f.importance
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Model Explainability</h1>
          <p className="text-slate-300 text-sm">
            Understand how orbital and stellar features influence exoplanet
            classification decisions through global feature importance and
            SHAP-style analysis. :contentReference
          </p>
        </div>
        <Button onClick={handleLoad} disabled={loading}>
          {loading ? "Loading..." : "Load Explainability"}
        </Button>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Feature importance chart */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Importance</CardTitle>
            <CardDescription>
              Most influential factors in exoplanet classification decisions.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fiChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis
                  type="number"
                  stroke="#9ca3af"
                  domain={[0, "dataMax"]}
                />
                <YAxis
                  dataKey="feature"
                  type="category"
                  stroke="#9ca3af"
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#1f2937"
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Bar dataKey="importance" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Confidence distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Confidence Score Distribution</CardTitle>
            <CardDescription>
              How many predictions fall into each confidence band.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceDist}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="category" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#1f2937"
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Bar dataKey="count" fill="#a855f7" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* SHAP summary text */}
      <Card>
        <CardHeader>
          <CardTitle>SHAP Summary (Sample)</CardTitle>
          <CardDescription>
            Directional impact of features for a representative prediction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-300">
          {Object.entries(shap).map(([feature, value]) => (
            <div
              key={feature}
              className="flex items-center justify-between text-xs"
            >
              <span>{feature}</span>
              <span
                className={
                  value >= 0
                    ? "text-emerald-400 font-semibold"
                    : "text-rose-400 font-semibold"
                }
              >
                {value >= 0 ? "+" : ""}
                {value.toFixed(2)}
              </span>
            </div>
          ))}
          <p className="pt-2 text-xs text-slate-400">
            Positive values push the prediction toward &quot;exoplanet&quot;,
            while negative values push toward &quot;false positive&quot;,
            mirroring SHAP explanations used in many ML workflows.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
