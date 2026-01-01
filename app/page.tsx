"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import UploadZone from "./components/UploadZone";
import AnalysisResult from "./components/AnalysisResult";
import PredictionTimeline from "./components/PredictionTimeline";

// Heatmap কে ডাইনামিক ইমপোর্ট করতে হবে (SSR false) নাহলে ম্যাপ ক্র্যাশ করবে
const Heatmap = dynamic(() => import("./components/Heatmap"), { 
  ssr: false,
  loading: () => <p className="text-center p-10 text-gray-500">Loading Community Map...</p>
});

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (file: File) => {
    setLoading(true);
    setError("");
    setData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Analysis failed");
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError("Something went wrong. Please try another image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            EcoGuard<span className="text-blue-600">AI</span>
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Gemini 3 Hackathon Entry: <span className="font-semibold text-blue-500">Multimodal Environmental Defense</span>
          </p>
        </div>

        {/* Upload Section */}
        <UploadZone onAnalyze={handleAnalyze} isAnalyzing={loading} />

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* Results Section */}
        {data && (
          <div className="space-y-8">
            <AnalysisResult data={data} />
            
            <PredictionTimeline 
              prediction={data.future_prediction} 
              severity={data.severity_score} 
            />
            
            <Heatmap />
          </div>
        )}
      </div>
    </main>
  );
}
