import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-[calc(100vh-96px)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
        {/* Hero */}
        <section className="grid md:grid-cols-[3fr,2fr] gap-10 items-center">
          <div className="space-y-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-sky-400 uppercase">
              Exoplanet Discovery Platform
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                ExoDetect
              </span>{" "}
              Multi-Mission Exoplanet Classification System
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl">
              Advanced machine learning powered by Kepler and TESS mission data.
              Upload light-curve features, generate exoplanet predictions, and
              explore model explainability in a single interactive dashboard.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/upload">
                <Button size="lg">Start Prediction</Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn about the science
                </Button>
              </Link>
            </div>

            {/* Mission badges */}
            <div className="flex flex-wrap gap-3 pt-4 text-xs text-slate-300">
              <span className="inline-flex items-center rounded-full border border-sky-500/60 bg-sky-500/10 px-3 py-1">
                Kepler Mission · 2009–2018
              </span>
              <span className="inline-flex items-center rounded-full border border-purple-500/60 bg-purple-500/10 px-3 py-1">
                TESS Mission · 2018–Present
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1">
                5000+ Confirmed Exoplanets
              </span>
            </div>
          </div>

          {/* Simple hero illustration using background image */}
          <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
            <img
              src="/hero-space-NiXTXiPw.jpg"
              alt="Exoplanet visualization"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent" />
            <div className="absolute bottom-4 left-4 space-y-1 text-xs">
              <p className="text-slate-200 font-semibold">
                Kepler &amp; TESS Light Curves
              </p>
              <p className="text-slate-400">
                Aggregated features from NASA missions, analyzed in real time.
              </p>
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 space-y-2">
              <h2 className="font-semibold text-slate-100 mb-1">
                Real-time Predictions
              </h2>
              <p className="text-sm text-slate-400">
                Upload CSV exports from Kepler or TESS and obtain
                classification scores for candidate exoplanets using ensemble
                ML models.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 space-y-2">
              <h2 className="font-semibold text-slate-100 mb-1">
                Explainable AI
              </h2>
              <p className="text-sm text-slate-400">
                Explore feature importance, SHAP-style insights, and confidence
                distributions to understand why the model predicts an exoplanet
                or a false positive.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 space-y-2">
              <h2 className="font-semibold text-slate-100 mb-1">
                EDA & Model Comparison
              </h2>
              <p className="text-sm text-slate-400">
                View class distributions, orbital period ranges, and mission-wise
                stats, alongside metrics for different models in the ensemble.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
