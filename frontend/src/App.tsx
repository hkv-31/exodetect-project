import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Landing from "@/pages/Landing";
import Upload from "@/pages/Upload";
import Predictions from "@/pages/Predictions";
import Explainability from "@/pages/Explainability";
import EDA from "@/pages/EDA";
import About from "@/pages/About";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-bold text-sky-400">
            Exodetect
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link to="/upload">Upload</Link>
            <Link to="/predictions">Predictions</Link>
            <Link to="/explainability">Explainability</Link>
            <Link to="/eda">EDA</Link>
            <Link to="/about">About</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/explainability" element={<Explainability />} />
          <Route path="/eda" element={<EDA />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/80 text-center py-3 text-xs text-slate-500">
        Exodetect — Exoplanet Classification Dashboard
      </footer>
    </div>
  );
}
