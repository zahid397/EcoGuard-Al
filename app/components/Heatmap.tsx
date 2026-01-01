"use client";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface HeatPoint {
  lat: number;
  lng: number;
  severity: number;
  label: string;
}

// Demo data simulating community reports
const demoPoints: HeatPoint[] = [
  { lat: 23.8103, lng: 90.4125, severity: 8, label: "Dhaka River Waste" },
  { lat: 22.3569, lng: 91.7832, severity: 6, label: "Chattogram Industrial Area" },
  { lat: 24.3636, lng: 88.6241, severity: 4, label: "Rajshahi Agricultural Runoff" },
  { lat: 24.8949, lng: 91.8687, severity: 7, label: "Sylhet Quarry Dust" },
];

export default function Heatmap() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-6 z-0 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Community Environmental Hotspots
        </h3>
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">LIVE DATA</span>
      </div>

      <MapContainer
        center={[23.8103, 90.4125]} // Default Center Dhaka
        zoom={6}
        scrollWheelZoom={false}
        className="h-80 w-full rounded-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {demoPoints.map((point, idx) => (
          <CircleMarker
            key={idx}
            center={[point.lat, point.lng]}
            radius={point.severity * 2} // Size based on severity
            pathOptions={{
              color: point.severity >= 8 ? "#ef4444" : point.severity >= 5 ? "#f97316" : "#22c55e",
              fillColor: point.severity >= 8 ? "#ef4444" : point.severity >= 5 ? "#f97316" : "#22c55e",
              fillOpacity: 0.6
            }}
          >
            <Popup>
              <strong>{point.label}</strong>
              <br />
              Severity: {point.severity}/10
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
        ℹ️ Heatmap aggregates anonymized reports from EcoGuard community.
      </p>
    </div>
  );
}
