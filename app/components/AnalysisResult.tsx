import { AlertTriangle, CheckCircle, Activity } from "lucide-react";

export default function AnalysisResult({ data }: { data: any }) {
  const getSeverityColor = (score: number) => {
    if (score >= 8) return "bg-red-500";
    if (score >= 5) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-700">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{data.hazard_type}</h2>
            <p className="text-gray-500 mt-1">AI Detected Hazard</p>
          </div>
          <div className={`${getSeverityColor(data.severity_score)} text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2`}>
            <Activity className="w-5 h-5" />
            Severity: {data.severity_score}/10
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">Gemini Reasoning:</h4>
          <p className="text-gray-600 leading-relaxed">{data.reasoning}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
          <h3 className="flex items-center gap-2 text-xl font-bold text-red-700 mb-4">
            <AlertTriangle className="w-6 h-6" /> Risks
          </h3>
          <ul className="space-y-3">
            {data.impacts.map((item: string, idx: number) => (
              <li key={idx} className="flex gap-2 text-red-800 text-sm">
                • {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
          <h3 className="flex items-center gap-2 text-xl font-bold text-green-700 mb-4">
            <CheckCircle className="w-6 h-6" /> Recommendations
          </h3>
          <ul className="space-y-3">
            {data.recommendations.map((item: string, idx: number) => (
              <li key={idx} className="flex gap-2 text-green-800 text-sm">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
