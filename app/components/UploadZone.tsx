"use client";
import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";

interface UploadZoneProps {
  onAnalyze: (file: File) => void;
  isAnalyzing: boolean;
}

export default function UploadZone({ onAnalyze, isAnalyzing }: UploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onAnalyze(file);
    }
  };

  return (
    <div 
      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer bg-white shadow-sm"
      onClick={() => !isAnalyzing && inputRef.current?.click()}
    >
      <input type="file" ref={inputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
      
      {isAnalyzing ? (
        <div className="flex flex-col items-center gap-3 py-6">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-gray-600 font-medium">Gemini 3 is analyzing ecosystem data...</p>
        </div>
      ) : preview ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden group">
           <img src={preview} alt="Preview" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
             <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-full">Analyze Another</span>
           </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-10">
          <div className="bg-blue-100 p-4 rounded-full">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-700">Upload Environment Photo</h3>
            <p className="text-gray-500 text-sm">Detect pollution & risks instantly</p>
          </div>
        </div>
      )}
    </div>
  );
}
