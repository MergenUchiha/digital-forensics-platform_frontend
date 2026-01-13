import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { FileText, Download, Eye, Plus, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/utils/format';
import { casesService } from '@/services/cases.service';
import { evidenceService } from '@/services/evidence.service';
import { timelineService } from '@/services/timeline.service';
import { exportCaseToPDF } from '@/utils/pdfExport';
import { Case } from '@/types';
import { cn } from '@/utils/cn';

interface Report {
  id: string;
  title: string;
  caseId: string;
  caseName: string;
  generatedAt: string;
  format: string;
  size: string;
}

export const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const casesData = await casesService.getAll();
      setCases(casesData);
      
      const savedReports = localStorage.getItem('forensics_reports');
      if (savedReports) {
        const parsedReports = JSON.parse(savedReports);
        // Filter out reports for non-existent cases
        const validReports = parsedReports.filter((report: Report) =>
          casesData.some(c => c.id === report.caseId)
        );
        setReports(validReports);
        
        // Update localStorage if we removed invalid reports
        if (validReports.length !== parsedReports.length) {
          localStorage.setItem('forensics_reports', JSON.stringify(validReports));
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: 'Failed to load cases data',
      });
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCaseId) {
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: 'Please select a case',
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Verify case exists before generating report
      const caseData = await casesService.getById(selectedCaseId);
      const [evidence, events] = await Promise.all([
        evidenceService.getAll(selectedCaseId),
        timelineService.getAll(selectedCaseId),
      ]);

      exportCaseToPDF(caseData, evidence, events);

      const newReport: Report = {
        id: `report-${Date.now()}`,
        title: `${caseData.title} - Investigation Report`,
        caseId: caseData.id,
        caseName: caseData.title,
        generatedAt: new Date().toISOString(),
        format: 'PDF',
        size: '2.4 MB',
      };

      const updatedReports = [...reports, newReport];
      setReports(updatedReports);
      localStorage.setItem('forensics_reports', JSON.stringify(updatedReports));

      setIsGenerateModalOpen(false);
      setSelectedCaseId('');

      (window as any).showNotification?.({
        type: 'success',
        title: 'Report Generated',
        message: 'Report has been successfully generated and downloaded',
      });
    } catch (error: any) {
      console.error('Failed to generate report:', error);
      
      let errorMessage = 'Failed to generate report';
      if (error.message?.includes('not found')) {
        errorMessage = 'The selected case no longer exists. Please select a different case.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewReport = (report: Report) => {
    // Verify case still exists
    const caseExists = cases.some(c => c.id === report.caseId);
    
    if (!caseExists) {
      (window as any).showNotification?.({
        type: 'warning',
        title: 'Case Not Found',
        message: 'The case for this report no longer exists.',
      });
      return;
    }
    
    setSelectedReport(report);
    setIsPreviewModalOpen(true);
  };

  const handleDownloadReport = async (report: Report) => {
    try {
      // Verify case exists
      const caseData = await casesService.getById(report.caseId);
      const [evidence, events] = await Promise.all([
        evidenceService.getAll(report.caseId),
        timelineService.getAll(report.caseId),
      ]);

      exportCaseToPDF(caseData, evidence, events);

      (window as any).showNotification?.({
        type: 'success',
        title: 'Report Downloaded',
        message: 'Report has been downloaded successfully',
      });
    } catch (error: any) {
      console.error('Failed to download report:', error);
      
      let errorMessage = 'Failed to download report';
      if (error.message?.includes('not found')) {
        errorMessage = 'The case for this report no longer exists. The report will be removed.';
        
        // Remove invalid report
        const updatedReports = reports.filter(r => r.id !== report.id);
        setReports(updatedReports);
        localStorage.setItem('forensics_reports', JSON.stringify(updatedReports));
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
    }
  };

  const handleDeleteReport = (reportId: string) => {
    const updatedReports = reports.filter(r => r.id !== reportId);
    setReports(updatedReports);
    localStorage.setItem('forensics_reports', JSON.stringify(updatedReports));
    
    (window as any).showNotification?.({
      type: 'info',
      title: 'Report Removed',
      message: 'Report has been removed from the list',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Reports</h1>
          <p className="text-text-secondary mt-1">Generate and manage investigation reports</p>
        </div>
        <Button 
          className="gap-2" 
          onClick={() => setIsGenerateModalOpen(true)}
          disabled={cases.length === 0}
        >
          <Plus className="w-4 h-4" />
          Generate Report
        </Button>
      </div>

      {/* No cases warning */}
      {cases.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center gap-3 text-status-warning">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <p className="font-medium">No Cases Available</p>
                <p className="text-sm text-text-secondary">
                  Create a case first before generating reports
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length > 0 ? (
          reports.map((report) => {
            const caseExists = cases.some(c => c.id === report.caseId);
            
            return (
              <Card key={report.id}>
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-text-primary truncate">
                          {report.title}
                        </h3>
                        {!caseExists && (
                          <Badge variant="danger">Case Deleted</Badge>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary mb-2">
                        Case: {report.caseName}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span>Generated {formatDate(report.generatedAt)}</span>
                        <Badge variant="info">{report.format}</Badge>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {caseExists ? (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewReport(report)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleDownloadReport(report)}
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary mb-4">No reports generated yet</p>
              {cases.length > 0 && (
                <Button onClick={() => setIsGenerateModalOpen(true)}>
                  Generate Your First Report
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Report Templates */}
      {cases.length > 0 && (
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Report Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Executive Summary', 'Technical Analysis', 'Legal Compliance'].map((template) => (
                <div
                  key={template}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all",
                    "bg-bg-tertiary border-border-primary",
                    "hover:border-cyber-500/50 hover:bg-bg-hover"
                  )}
                  onClick={() => setIsGenerateModalOpen(true)}
                >
                  <FileText className="w-8 h-8 text-cyber-500 mb-2" />
                  <h4 className="font-medium text-text-primary">{template}</h4>
                  <p className="text-sm text-text-secondary mt-1">
                    Standard template for {template.toLowerCase()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Report Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Report"
        size="md"
      >
        <form onSubmit={handleGenerateReport} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Select Case *
            </label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyber-500"
              required
            >
              <option value="">Select a case...</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Report Format
            </label>
            <select
              className="w-full px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyber-500"
            >
              <option value="pdf">PDF Document</option>
            </select>
          </div>

          <div className="p-4 bg-status-info/10 border border-status-info/30 rounded-lg">
            <p className="text-sm text-status-info">
              The report will include case details, evidence list, timeline events, and analysis summary.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              variant="primary" 
              className="flex-1"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsGenerateModalOpen(false)}
              className="flex-1"
              disabled={isGenerating}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Report Preview"
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{selectedReport.title}</h3>
              <p className="text-sm text-text-secondary mt-1">Case: {selectedReport.caseName}</p>
            </div>

            <div className="p-4 bg-bg-tertiary border border-border-primary rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-muted">Generated</p>
                  <p className="text-text-primary">{formatDate(selectedReport.generatedAt)}</p>
                </div>
                <div>
                  <p className="text-text-muted">Format</p>
                  <p className="text-text-primary">{selectedReport.format}</p>
                </div>
                <div>
                  <p className="text-text-muted">Size</p>
                  <p className="text-text-primary">{selectedReport.size}</p>
                </div>
                <div>
                  <p className="text-text-muted">Status</p>
                  <Badge variant="success">Ready</Badge>
                </div>
              </div>
            </div>

            <div className="p-4 bg-status-info/10 border border-status-info/30 rounded-lg">
              <p className="text-sm text-status-info">
                This report contains comprehensive case information including evidence, timeline events, and analysis.
                Click Download to get the full PDF report.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="primary" 
                className="flex-1 gap-2"
                onClick={() => {
                  handleDownloadReport(selectedReport);
                  setIsPreviewModalOpen(false);
                }}
              >
                <Download className="w-4 h-4" />
                Download Report
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsPreviewModalOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};