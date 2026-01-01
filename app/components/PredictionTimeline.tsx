"use client";
import { motion } from "framer-motion";

interface PredictionTimelineProps {
  prediction: string;
  severity: number;
}

export default function PredictionTimeline({
  prediction,
  severity,
}: PredictionTimelineProps) {
  const stages = [
    { label: "Now", color: "bg-green-500" },
    { label: "3 Months", color: "bg-yellow-500" },
    { label: "6 Months", color: "bg-orange-500" },
    { label: "1 Year", color: "bg-red-500" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Predictive Impact Timeline
      </h3>

      <div className="flex items-center justify-between mb-6 relative">
        {/* Connection Line */}
        <div className="absolute top-2 left-0 w-full h-0.5 bg-gray-200 -z-10" />
        
        {stages.map((stage, idx) => (
          <div key={idx} className="flex flex-col items-center bg-white px-2">
            <div className={`w-4 h-4 rounded-full ${stage.color} ring-4 ring-white`} />
            <span className="text-xs text-gray-500 mt-2 font-medium">
              {stage.label}
            </span>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 bg-blue-50 border border-blue-100 rounded-lg"
      >
        <p className="text-gray-700 leading-relaxed font-medium">
          🤖 AI Simulation: "{prediction}"
        </p>

        <p className="mt-3 text-sm text-gray-500">
          Risk Severity Index: <span className={`font-bold ${severity >= 7 ? 'text-red-600' : 'text-orange-500'}`}>{severity}/10</span> (Trend Analysis)
        </p>
      </motion.div>
    </div>
  );
}
