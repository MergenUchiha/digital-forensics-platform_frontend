import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Case } from '@/types';
import { motion } from 'framer-motion';

interface WorldMapProps {
  cases: Case[];
}

export const WorldMap = ({ cases }: WorldMapProps) => {
  // Фильтруем только дела с локацией
  const casesWithLocation = cases.filter(c => {
    // Проверяем оба варианта структуры данных
    const hasLocation = c.location?.lat && c.location?.lng;
    const hasDirectLocation = c.locationLat && c.locationLng;
    return hasLocation || hasDirectLocation;
  });

  const getPosition = (c: Case) => {
    // Получаем координаты из любого доступного источника
    const lat = c.location?.lat || c.locationLat || 0;
    const lng = c.location?.lng || c.locationLng || 0;
    
    // Convert lat/lng to x/y coordinates (simplified projection)
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  const getLocationName = (c: Case) => {
    if (c.location) {
      return `${c.location.city}, ${c.location.country}`;
    }
    if (c.locationCity && c.locationCountry) {
      return `${c.locationCity}, ${c.locationCountry}`;
    }
    return 'Unknown location';
  };

  const severityColors: Record<string, string> = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#3b82f6',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Incident Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-96 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-800">
          {/* World map SVG background */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 1000 500" className="w-full h-full">
              {/* Simplified world continents */}
              <path d="M 150,150 L 200,120 L 280,140 L 320,180 L 280,220 L 200,200 Z" fill="#374151" /> {/* Europe */}
              <path d="M 350,200 L 420,180 L 480,200 L 520,240 L 480,280 L 400,260 Z" fill="#374151" /> {/* Asia */}
              <path d="M 120,280 L 180,260 L 240,300 L 200,360 L 140,340 Z" fill="#374151" /> {/* Africa */}
              <path d="M 50,200 L 100,180 L 140,220 L 100,280 L 60,260 Z" fill="#374151" /> {/* N America */}
              <path d="M 80,320 L 120,300 L 140,350 L 100,380 Z" fill="#374151" /> {/* S America */}
              <path d="M 700,350 L 780,340 L 820,380 L 760,400 Z" fill="#374151" /> {/* Australia */}
            </svg>
          </div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06b6d4" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Incident markers */}
          {casesWithLocation.length > 0 ? (
            casesWithLocation.map((c) => {
              const pos = getPosition(c);
              const locationName = getLocationName(c);
              const evidenceCount = c.evidenceCount || c.stats?.evidenceCount || 0;
              const suspiciousActivities = c.suspiciousActivities || c.stats?.suspiciousActivities || 0;

              return (
                <motion.div
                  key={c.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
                  className="absolute group cursor-pointer"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: severityColors[c.severity] }}
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  {/* Main dot */}
                  <div
                    className="w-3 h-3 rounded-full relative z-10"
                    style={{ backgroundColor: severityColors[c.severity] }}
                  />

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 whitespace-nowrap shadow-xl">
                      <p className="text-sm font-semibold text-gray-100">{c.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{locationName}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {evidenceCount} evidence · {suspiciousActivities} alerts
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500 text-sm">No cases with location data</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};