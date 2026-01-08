import { NetworkGraph } from '@/components/network/NetworkGraph';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockNetworkNodes, mockNetworkConnections } from '@/data/mockData';
import { AlertTriangle } from 'lucide-react';

export const NetworkAnalysis = () => {
  const suspiciousNodes = mockNetworkNodes.filter(n => n.suspicious);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Network Analysis</h1>
        <p className="text-text-secondary mt-1">Visualize network topology and connections</p>
      </div>

      {/* Network Graph */}
      <NetworkGraph 
        nodes={mockNetworkNodes} 
        connections={mockNetworkConnections} 
      />

      {/* Suspicious Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Suspicious Nodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suspiciousNodes.map((node) => (
                <div key={node.id} className="p-4 bg-bg-tertiary rounded-lg border border-red-500/20">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-text-primary">{node.label}</h4>
                      <p className="text-sm text-text-secondary">{node.type}</p>
                    </div>
                    <Badge variant="danger">SUSPICIOUS</Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    {node.metadata.country && (
                      <p className="text-text-secondary">Country: {node.metadata.country}</p>
                    )}
                    {node.metadata.reputation !== undefined && (
                      <p className="text-text-secondary">Reputation: {node.metadata.reputation}/100</p>
                    )}
                    {node.metadata.firstSeen && (
                      <p className="text-text-secondary">First Seen: {new Date(node.metadata.firstSeen).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connection Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Total Connections</span>
                <span className="text-2xl font-bold text-text-primary">{mockNetworkConnections.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Suspicious Connections</span>
                <span className="text-2xl font-bold text-red-500">
                  {mockNetworkConnections.filter(c => c.suspicious).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Total Data Transfer</span>
                <span className="text-2xl font-bold text-text-primary">1.4 GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Unique IPs</span>
                <span className="text-2xl font-bold text-text-primary">{mockNetworkNodes.filter(n => n.type === 'ip').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};