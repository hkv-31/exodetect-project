import React, { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import type { PredictionResults, Prediction } from "@/api";
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

function getPredictionResults(): PredictionResults | null {
  const stored = sessionStorage.getItem("predictionResults");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as PredictionResults;
  } catch {
    return null;
  }
}

type CountMap = Record<string, number>;

function bucketPeriod(p: number): string {
  if (p < 5) return "0–5 days";
  if (p < 10) return "5–10 days";
  if (p < 20) return "10–20 days";
  if (p < 50) return "20–50 days";
  return "50+ days";
}

export default function EDA() {
  const data = getPredictionResults();
  const predictions = data?.predictions ?? [];

  const {
    byClass,
    byPeriodBucket,
    byMission,
    total,
    meanPeriod,
    meanDepth,
    detectionRate
  } = useMemo(() => {
    const byClass: CountMap = {};
    const byPeriodBucket: CountMap = {};
    const byMission: CountMap = {};
    let total = 0;
    let periodSum = 0;
    let depthSum = 0;
    let confirmedCount = 0;

    predictions.forEach((p: Prediction) => {
      total += 1;
      periodSum += p.period ?? 0;
      depthSum += p.depth ?? 0;

      if (p.prediction === "CONFIRMED") confirmedCount += 1;

      const cls = p.prediction || "UNKNOWN";
      byClass[cls] = (byClass[cls] || 0) + 1;

      const bucket = bucketPeriod(p.period ?? 0);
      byPeriodBucket[bucket] = (byPeriodBucket[bucket] || 0) + 1;

      const mission = p.mission || "Unknown";
      byMission[mission] = (byMission[mission] || 0) + 1;
    });

    const meanPeriod = total ? periodSum / total : 0;
    const meanDepth = total ? depthSum / total : 0;
    const detectionRate = total ? confirmedCount / total : 0;

    return {
      byClass,
      byPeriodBucket,
      byMission,
      total,
      meanPeriod,
      meanDepth,
      detectionRate
    };
  }, [predictions]);

  if (!predictions.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <h1 className="text-2xl font-bold">Exploratory Data Analysis (EDA)</h1>
        <p className="text-slate-300 text-sm">
          No predictions are available yet. Upload a CSV file and run prediction
          to see EDA insights.
        </p>
        <Link to="/upload" className="text-sky-400 underline text-sm">
          Go to Upload →
        </Link>
      </div>
    );
  }

  const classData = Object.entries(byClass).map(([label, count]) => ({
    label,
    count
  }));

  const periodData = Object.entries(byPeriodBucket).map(([bucket, count]) => ({
    bucket,
    count
  }));

  const missionData = Object.entries(byMission).map(([mission, count]) => ({
    mission,
    count
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">
          Exploratory Data Analysis (EDA)
        </h1>
        <p className="text-slate-300 text-sm">
          Comprehensive statistical analysis of your current prediction batch,
          including class distribution, orbital period ranges, and mission-wise
          counts. :contentReference[oaicite:4]
        </p>
      </header>

      {/* Top stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Observations</CardTitle>
            <CardDescription>Current prediction batch size.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mean Period</CardTitle>
            <CardDescription>Average orbital period.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {meanPeriod.toFixed(1)}{" "}
              <span className="text-xs text-slate-400">days</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mean Depth</CardTitle>
            <CardDescription>Average transit depth.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {meanDepth.toExponential(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detection Rate</CardTitle>
            <CardDescription>Confirmed exoplanets / total.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {Math.round(detectionRate * 100)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Class Distribution</CardTitle>
            <CardDescription>
              Confirmed exoplanets vs candidates vs false positives.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="label" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#1f2937"
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Bar dataKey="count" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orbital Period Distribution</CardTitle>
            <CardDescription>Predictions per period range.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={periodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="bucket" stroke="#9ca3af" />
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

      <Card>
        <CardHeader>
          <CardTitle>Mission-wise Distribution</CardTitle>
          <CardDescription>How many predictions come from each mission.</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={missionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="mission" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#020617", borderColor: "#1f2937" }}
                labelStyle={{ color: "#e5e7eb" }}
              />
              <Legend />
              <Bar dataKey="count" fill="#22c55e" name="Predictions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
