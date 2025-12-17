import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">About ExoDetect</h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          ExoDetect is a multi-mission exoplanet classification dashboard that
          connects a React frontend to a Django-based ML API. It is inspired by
          NASA&apos;s Kepler and TESS missions and demonstrates how to combine
          prediction, explainability, and exploratory analysis in one interface.
        </p>
      </section>

      {/* Exoplanets + missions */}
      <section className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>What are Exoplanets?</CardTitle>
            <CardDescription>
              Worlds orbiting stars beyond our Solar System.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>
              Exoplanets are detected by observing tiny dips in a star&apos;s
              brightness as planets pass in front of it. These are known as
              transit events. Missions like Kepler and TESS have captured
              hundreds of thousands of light curves to search for these signals.
            </p>
            <p>
              Each candidate detection must be classified as a{" "}
              <span className="font-semibold">confirmed exoplanet</span>,{" "}
              <span className="font-semibold">planet candidate</span>, or{" "}
              <span className="font-semibold">false positive</span>. Machine
              learning helps automate and prioritize this process.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kepler &amp; TESS Missions</CardTitle>
            <CardDescription>NASA&apos;s transit survey telescopes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>
              <span className="font-semibold">Kepler</span> (2009–2018) surveyed
              a single region of the sky, producing high-precision light curves
              that led to thousands of exoplanet discoveries.
            </p>
            <p>
              <span className="font-semibold">TESS</span> (2018–present) scans
              nearly the entire sky, focusing on bright, nearby stars. ExoDetect
              is designed to support feature sets derived from both missions.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ML models */}
      <section className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Machine Learning Models</CardTitle>
            <CardDescription>Ensemble of tree-based classifiers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>
              The backend is structured to load one or more trained ML models
              (for example):
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <span className="font-semibold">Random Forest</span> – robust,
                interpretable tree ensemble.
              </li>
              <li>
                <span className="font-semibold">XGBoost</span> – gradient-boosted
                trees with strong tabular performance.
              </li>
              <li>
                <span className="font-semibold">LightGBM</span> – efficient
                gradient boosting for large feature sets.
              </li>
            </ul>
            <p>
              In a full deployment, each model is trained offline on curated
              Kepler/TESS datasets. At runtime, the Django API loads the trained
              models (e.g., from <code>.pkl</code> files) and uses them to score
              incoming observations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How Predictions Are Generated</CardTitle>
            <CardDescription>Inference pipeline overview.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <ol className="list-decimal list-inside space-y-1">
              <li>Frontend uploads a CSV file with candidate observations.</li>
              <li>
                Django reads the file, applies preprocessing to match the
                training feature schema (e.g., scaling, encoding, feature
                selection).
              </li>
              <li>
                Each candidate row is passed through one or more ML models to
                produce class probabilities (e.g., exoplanet vs. false positive).
              </li>
              <li>
                Results are optionally combined in an{" "}
                <span className="font-semibold">ensemble</span> (e.g.,
                averaging probabilities or majority vote across models).
              </li>
              <li>
                The API returns prediction labels and confidence scores to the
                frontend, which displays them in the Predictions, EDA, and
                Explainability views.
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>

      {/* Explainability */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Explainability &amp; Feature Importance</CardTitle>
            <CardDescription>
              Understanding why the model predicts an exoplanet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>
              ExoDetect is designed to integrate{" "}
              <span className="font-semibold">
                feature importance and SHAP-style explainability
              </span>{" "}
              into the API. For tree-based models, global feature importance can
              be derived from split gains or permutation importance, while
              SHAP values quantify how each feature pushes an individual
              prediction toward &quot;exoplanet&quot; or &quot;false
              positive&quot;.
            </p>
            <p>
              The <strong>Explainability</strong> page visualizes these
              quantities, helping you understand which orbital and stellar
              parameters drive the classifications (for example, orbital period,
              transit depth, planet radius, and stellar temperature). :contentReference[oaicite:2]
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}