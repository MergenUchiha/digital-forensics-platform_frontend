import { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { NetworkNode, NetworkConnection } from '@/types';

interface NetworkGraphProps {
  nodes: NetworkNode[];
  connections: NetworkConnection[];
}

export const NetworkGraph = ({ nodes, connections }: NetworkGraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Position nodes in a circle
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;

    const nodePositions: Record<string, { x: number; y: number }> = {};
    
    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      nodePositions[node.id] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });

    // Draw connections
    connections.forEach((conn) => {
      const source = nodePositions[conn.source];
      const target = nodePositions[conn.target];
      
      if (!source || !target) return;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = conn.suspicious ? '#ef4444' : '#374151';
      ctx.lineWidth = conn.suspicious ? 2 : 1;
      ctx.stroke();

      // Draw arrow
      const angle = Math.atan2(target.y - source.y, target.x - source.x);
      const arrowSize = 10;
      ctx.beginPath();
      ctx.moveTo(target.x, target.y);
      ctx.lineTo(
        target.x - arrowSize * Math.cos(angle - Math.PI / 6),
        target.y - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        target.x - arrowSize * Math.cos(angle + Math.PI / 6),
        target.y - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = conn.suspicious ? '#ef4444' : '#374151';
      ctx.fill();
    });

    // Draw nodes
    nodes.forEach((node) => {
      const pos = nodePositions[node.id];
      if (!pos) return;

      // Node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = node.suspicious ? '#ef4444' : '#00d9ff';
      ctx.fill();
      
      // Node border
      ctx.strokeStyle = node.suspicious ? '#dc2626' : '#0093b3';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Glow effect for suspicious nodes
      if (node.suspicious) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.lineWidth = 6;
        ctx.stroke();
      }

      // Node label
      ctx.fillStyle = '#f3f4f6';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, pos.x, pos.y + 35);
    });
  }, [nodes, connections]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Topology</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-96 rounded-lg bg-gray-950"
          />
          
          {/* Legend */}
          <div className="mt-4 flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyber-500 rounded-full" />
              <span className="text-gray-400">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <span className="text-gray-400">Suspicious</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};