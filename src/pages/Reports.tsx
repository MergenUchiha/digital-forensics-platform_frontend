import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FileText, Download, Eye, Plus } from 'lucide-react';
import { formatDate } from '@/utils/format';

const mockReports = [
  {
    id: '1',
    title: 'AWS S3 Breach Investigation Report',
    caseId: '1',
    caseName: 'AWS S3 Bucket Data Breach',
    generatedAt: '2024-12-26T10:00:00Z',
    format: 'PDF',
    size: '2.4 MB',
  },
  {
    id: '2',
    title: 'IoT Botnet Analysis Summary',
    caseId: '2',
    caseName: 'IoT Camera Botnet Activity',
    generatedAt: '2024-12-25T16:30:00Z',
    format: 'PDF',
    size: '1.8 MB',
  },
];

export const Reports = () => {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Reports</h1>
          <p className="text-gray-400 mt-1">Generate and manage investigation reports</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Generate Report
        </Button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {mockReports.map((report) => (
          <Card key={report.id}>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-1">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Case: {report.caseName}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Generated {formatDate(report.generatedAt)}</span>
                    <Badge variant="info">{report.format}</Badge>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Template */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Report Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Executive Summary', 'Technical Analysis', 'Legal Compliance'].map((template) => (
              <div
                key={template}
                className="p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-cyber-500/50 cursor-pointer transition-all"
              >
                <FileText className="w-8 h-8 text-cyber-400 mb-2" />
                <h4 className="font-medium text-gray-100">{template}</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Standard template for {template.toLowerCase()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};