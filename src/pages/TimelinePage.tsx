import { useState } from 'react';
import { Timeline } from '@/components/timeline/Timeline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { mockTimelineEvents } from '@/data/mockData';
import { Filter, Download } from 'lucide-react';

export const TimelinePage = () => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredEvents = mockTimelineEvents.filter(e => 
    severityFilter === 'all' || e.severity === severityFilter
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Timeline Analysis</h1>
          <p className="text-gray-400 mt-1">Chronological view of security events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search events..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={severityFilter === 'all' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSeverityFilter('all')}
              >
                All
              </Button>
              <Button
                variant={severityFilter === 'critical' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSeverityFilter('critical')}
              >
                Critical
              </Button>
              <Button
                variant={severityFilter === 'warning' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSeverityFilter('warning')}
              >
                Warning
              </Button>
              <Button
                variant={severityFilter === 'info' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSeverityFilter('info')}
              >
                Info
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Timeline events={filteredEvents} />
    </div>
  );
};