// src/components/dashboard/WorldMap.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Case } from '@/types';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';

interface WorldMapProps {
  cases: Case[];
}

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export const WorldMap = ({ cases }: WorldMapProps) => {
  const [hoveredCase, setHoveredCase] = useState<Case | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const casesWithLocation = cases.filter(c => {
    const hasLocation = c.location?.lat && c.location?.lng;
    const hasDirectLocation = c.locationLat && c.locationLng;
    return hasLocation || hasDirectLocation;
  });

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

  const getMarkerSize = (severity: string) => {
    const sizes: Record<string, number> = {
      critical: 12,
      high: 10,
      medium: 8,
      low: 6,
    };
    return sizes[severity] || 6;
  };

  const handleMarkerMouseEnter = (c: Case, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setHoveredCase(c);
  };

  const handleMarkerMouseLeave = () => {
    setHoveredCase(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Incident Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[500px] bg-bg-tertiary rounded-lg overflow-hidden border border-border-primary">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 147,
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <ZoomableGroup
              zoom={1}
              center={[0, 20]}
              minZoom={1}
              maxZoom={8}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="rgb(var(--color-bg-secondary))"
                      stroke="rgb(var(--color-border-primary))"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: 'none',
                        },
                        hover: {
                          fill: 'rgb(var(--color-bg-hover))',
                          outline: 'none',
                        },
                        pressed: {
                          outline: 'none',
                        },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Markers */}
              {casesWithLocation.map((c) => {
                const lat = c.location?.lat || c.locationLat || 0;
                const lng = c.location?.lng || c.locationLng || 0;
                const severity = c.severity.toString().toLowerCase();
                const color = severityColors[severity] || '#3b82f6';
                const size = getMarkerSize(severity);

                return (
                  <Marker
                    key={c.id}
                    coordinates={[lng, lat]}
                    onMouseEnter={(e) => handleMarkerMouseEnter(c, e as any)}
                    onMouseLeave={handleMarkerMouseLeave}
                    style={{
                      default: { outline: 'none', cursor: 'pointer' },
                      hover: { outline: 'none', cursor: 'pointer' },
                      pressed: { outline: 'none', cursor: 'pointer' },
                    } as any}
                  >
                    {/* Pulse ring */}
                    <circle
                      r={size + 8}
                      fill={color}
                      opacity={0.3}
                      className="animate-ping"
                      style={{
                        animationDuration: severity === 'critical' ? '1s' : '2s',
                      }}
                    />
                    
                    {/* Glow ring */}
                    <circle
                      r={size + 4}
                      fill="none"
                      stroke={color}
                      strokeWidth={1}
                      opacity={0.5}
                    />
                    
                    {/* Main marker */}
                    <circle
                      r={size}
                      fill={color}
                      stroke="rgb(var(--color-bg-primary))"
                      strokeWidth={2}
                    />
                    
                    {/* Critical indicator */}
                    {severity === 'critical' && (
                      <circle
                        r={3}
                        fill="#ef4444"
                        cy={-size - 3}
                        className="animate-pulse"
                      />
                    )}
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip */}
          {hoveredCase && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed pointer-events-none z-50"
              style={{
                left: tooltipPos.x,
                top: tooltipPos.y,
                x: '-50%',
                y: '-100%',
              } as any}
            >
              <div className="bg-bg-secondary border border-border-primary rounded-lg p-3 shadow-light-xl dark:shadow-dark-xl max-w-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: severityColors[hoveredCase.severity.toString().toLowerCase()] 
                    }}
                  />
                  <p className="text-sm font-semibold text-text-primary">
                    {hoveredCase.title}
                  </p>
                </div>
                <p className="text-xs text-text-tertiary">
                  {getLocationName(hoveredCase)}
                </p>
                <div className="flex gap-3 mt-2 text-xs text-text-muted">
                  <span>
                    {hoveredCase.evidenceCount || 
                     hoveredCase.stats?.evidenceCount || 0} evidence
                  </span>
                  <span>
                    {hoveredCase.suspiciousActivities || 
                     hoveredCase.stats?.suspiciousActivities || 0} alerts
                  </span>
                </div>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    hoveredCase.severity.toString().toLowerCase() === 'critical' 
                      ? 'bg-red-500/20 text-red-400' :
                    hoveredCase.severity.toString().toLowerCase() === 'high' 
                      ? 'bg-orange-500/20 text-orange-400' :
                    hoveredCase.severity.toString().toLowerCase() === 'medium' 
                      ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {hoveredCase.severity.toString().toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-bg-secondary/90 backdrop-blur-sm border border-border-primary rounded-lg p-3 text-xs">
            <div className="font-semibold text-text-primary mb-2">
              Severity Levels
            </div>
            <div className="space-y-1">
              {Object.entries(severityColors).map(([severity, color]) => (
                <div key={severity} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full border-2"
                    style={{ 
                      backgroundColor: color,
                      borderColor: 'rgb(var(--color-bg-primary))',
                    }}
                  />
                  <span className="text-text-secondary capitalize">
                    {severity}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-border-primary text-text-muted">
              Total Incidents: {casesWithLocation.length}
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute top-4 left-4 bg-bg-secondary/80 backdrop-blur-sm border border-border-primary rounded-lg px-3 py-2 text-xs text-text-muted">
            🖱️ Scroll to zoom • Drag to pan
          </div>

          {/* No data message */}
          {casesWithLocation.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-text-muted text-sm">
                  No cases with location data
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};