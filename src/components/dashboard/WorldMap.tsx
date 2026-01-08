import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Case } from '@/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface WorldMapProps {
  cases: Case[];
}

export const WorldMap = ({ cases }: WorldMapProps) => {
  const [hoveredCase, setHoveredCase] = useState<Case | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const casesWithLocation = cases.filter(c => {
    const hasLocation = c.location?.lat && c.location?.lng;
    const hasDirectLocation = c.locationLat && c.locationLng;
    return hasLocation || hasDirectLocation;
  });

  // Преобразование координат в позицию на SVG карте
  const getPosition = (c: Case) => {
    const lat = c.location?.lat || c.locationLat || 0;
    const lng = c.location?.lng || c.locationLng || 0;
    
    // Проекция Mercator для SVG viewBox 0 0 1000 500
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
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

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Incident Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="relative w-full h-[500px] bg-bg-tertiary rounded-lg overflow-hidden border border-border-primary"
          onMouseMove={handleMouseMove}
        >
          {/* SVG World Map */}
          <svg 
            viewBox="0 0 1000 500" 
            className="w-full h-full"
            style={{ backgroundColor: 'transparent' }}
          >
            <defs>
              {/* Gradient for water */}
              <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'rgb(var(--color-bg-tertiary))', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'rgb(var(--color-bg-primary))', stopOpacity: 1 }} />
              </linearGradient>
              
              {/* Pattern for grid */}
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path 
                  d="M 50 0 L 0 0 0 50" 
                  fill="none" 
                  stroke="rgb(var(--color-border-primary))" 
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>

            {/* Background */}
            <rect width="1000" height="500" fill="url(#waterGradient)" />
            <rect width="1000" height="500" fill="url(#grid)" />

            {/* Simplified World Map - Major Continents */}
            <g className="continents" fill="rgb(var(--color-bg-secondary))" stroke="rgb(var(--color-border-secondary))" strokeWidth="1">
              {/* North America */}
              <path d="M 150,100 L 200,80 L 250,90 L 280,110 L 260,150 L 240,180 L 220,200 L 180,220 L 150,200 L 130,170 L 120,140 Z" />
              
              {/* South America */}
              <path d="M 280,250 L 300,240 L 320,260 L 330,300 L 320,350 L 300,380 L 280,360 L 270,320 L 265,280 Z" />
              
              {/* Europe */}
              <path d="M 480,100 L 520,95 L 550,110 L 540,140 L 510,150 L 490,145 L 470,130 Z" />
              
              {/* Africa */}
              <path d="M 500,180 L 540,170 L 570,190 L 580,230 L 575,280 L 560,320 L 530,340 L 510,320 L 495,280 L 490,230 Z" />
              
              {/* Asia */}
              <path d="M 600,80 L 700,70 L 800,90 L 850,110 L 870,140 L 850,170 L 800,180 L 750,190 L 700,170 L 650,150 L 620,120 Z" />
              
              {/* Australia */}
              <path d="M 800,320 L 850,310 L 900,330 L 910,360 L 890,380 L 850,385 L 810,370 L 795,345 Z" />
              
              {/* Antarctica (bottom) */}
              <path d="M 200,450 L 800,450 L 850,470 L 150,470 Z" opacity="0.6" />
            </g>

            {/* Latitude lines */}
            <g className="latitude-lines" stroke="rgb(var(--color-border-primary))" strokeWidth="0.5" opacity="0.3">
              <line x1="0" y1="125" x2="1000" y2="125" strokeDasharray="5,5" />
              <line x1="0" y1="250" x2="1000" y2="250" strokeDasharray="5,5" />
              <line x1="0" y1="375" x2="1000" y2="375" strokeDasharray="5,5" />
            </g>

            {/* Longitude lines */}
            <g className="longitude-lines" stroke="rgb(var(--color-border-primary))" strokeWidth="0.5" opacity="0.3">
              <line x1="250" y1="0" x2="250" y2="500" strokeDasharray="5,5" />
              <line x1="500" y1="0" x2="500" y2="500" strokeDasharray="5,5" />
              <line x1="750" y1="0" x2="750" y2="500" strokeDasharray="5,5" />
            </g>

            {/* Case Markers */}
            {casesWithLocation.map((c, index) => {
              const pos = getPosition(c);
              const color = severityColors[c.severity] || '#3b82f6';
              const evidenceCount = c.evidenceCount || c.stats?.evidenceCount || 0;
              const suspiciousActivities = c.suspiciousActivities || c.stats?.suspiciousActivities || 0;

              return (
                <g 
                  key={c.id}
                  onMouseEnter={() => setHoveredCase(c)}
                  onMouseLeave={() => setHoveredCase(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Pulse animation ring */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="20"
                    fill={color}
                    opacity="0.3"
                  >
                    <animate
                      attributeName="r"
                      values="15;30;15"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.6;0;0.6"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Main marker dot */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="8"
                    fill={color}
                    stroke="rgb(var(--color-bg-secondary))"
                    strokeWidth="2"
                  >
                    <animate
                      attributeName="r"
                      values="8;10;8"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Glow effect */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="12"
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    opacity="0.5"
                  />

                  {/* Severity indicator (small circle on top) */}
                  {c.severity === 'critical' && (
                    <circle
                      cx={pos.x}
                      cy={pos.y - 12}
                      r="3"
                      fill="#ef4444"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0.3;1"
                        dur="0.8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Labels for major regions */}
            <g className="region-labels" fill="rgb(var(--color-text-tertiary))" fontSize="12" opacity="0.5">
              <text x="200" y="160" textAnchor="middle">North America</text>
              <text x="300" y="310" textAnchor="middle">South America</text>
              <text x="520" y="120" textAnchor="middle">Europe</text>
              <text x="540" y="260" textAnchor="middle">Africa</text>
              <text x="750" y="130" textAnchor="middle">Asia</text>
              <text x="860" y="350" textAnchor="middle">Australia</text>
            </g>
          </svg>

          {/* Tooltip */}
          {hoveredCase && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute pointer-events-none z-50"
              style={{
                left: mousePos.x + 20,
                top: mousePos.y - 60,
              }}
            >
              <div className="bg-bg-secondary border border-border-primary rounded-lg p-3 shadow-light-xl dark:shadow-dark-xl max-w-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: severityColors[hoveredCase.severity] }}
                  />
                  <p className="text-sm font-semibold text-text-primary">{hoveredCase.title}</p>
                </div>
                <p className="text-xs text-text-tertiary">{getLocationName(hoveredCase)}</p>
                <div className="flex gap-3 mt-2 text-xs text-text-muted">
                  <span>{hoveredCase.evidenceCount || hoveredCase.stats?.evidenceCount || 0} evidence</span>
                  <span>{hoveredCase.suspiciousActivities || hoveredCase.stats?.suspiciousActivities || 0} alerts</span>
                </div>
                <div className="mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    hoveredCase.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                    hoveredCase.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    hoveredCase.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {hoveredCase.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-bg-secondary/90 backdrop-blur-sm border border-border-primary rounded-lg p-3 text-xs">
            <div className="font-semibold text-text-primary mb-2">Severity Levels</div>
            <div className="space-y-1">
              {Object.entries(severityColors).map(([severity, color]) => (
                <div key={severity} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-text-secondary capitalize">{severity}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-border-primary text-text-muted">
              Total Incidents: {casesWithLocation.length}
            </div>
          </div>

          {/* No data message */}
          {casesWithLocation.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-text-muted text-sm">No cases with location data</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};