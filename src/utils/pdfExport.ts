import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Case, EvidenceItem, TimelineEvent } from '@/types';
import { formatDate } from './format';

export const exportCaseToPDF = (
  caseData: Case,
  evidence: EvidenceItem[],
  events: TimelineEvent[]
) => {
  const doc = new jsPDF();
  
  // Colors
  const primaryColor: [number, number, number] = [0, 217, 255]; // Cyber blue
  const darkGray: [number, number, number] = [55, 65, 81];
  
  let yPosition = 20;

  // Header
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.text('FORENSICS REPORT', 20, yPosition);
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${formatDate(new Date().toISOString())}`, 20, yPosition);
  
  // Case Information
  yPosition += 15;
  doc.setFontSize(16);
  doc.setTextColor(...darkGray);
  doc.text('Case Information', 20, yPosition);
  
  yPosition += 8;
  doc.setFontSize(10);
  doc.setTextColor(0);
  
  const caseInfo = [
    ['Case ID', caseData.id],
    ['Title', caseData.title],
    ['Status', caseData.status.toString().toUpperCase()],
    ['Severity', caseData.severity.toString().toUpperCase()],
    ['Created', formatDate(caseData.createdAt)],
    ['Last Updated', formatDate(caseData.updatedAt)],
    ['Assigned To', caseData.assignedTo?.name || 'Unassigned'],
  ];

  // Handle location - check both formats
  if (caseData.location) {
    caseInfo.push(['Location', `${caseData.location.city}, ${caseData.location.country}`]);
  } else if (caseData.locationCity && caseData.locationCountry) {
    caseInfo.push(['Location', `${caseData.locationCity}, ${caseData.locationCountry}`]);
  }

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: caseInfo,
    theme: 'grid',
    styles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Description
  doc.setFontSize(14);
  doc.setTextColor(...darkGray);
  doc.text('Description', 20, yPosition);
  
  yPosition += 8;
  doc.setFontSize(10);
  doc.setTextColor(0);
  const splitDescription = doc.splitTextToSize(caseData.description, 170);
  doc.text(splitDescription, 20, yPosition);
  yPosition += splitDescription.length * 5 + 10;

  // Tags
  if (caseData.tags && caseData.tags.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(...darkGray);
    doc.text('Tags', 20, yPosition);
    yPosition += 6;
    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.text(caseData.tags.map(t => `#${t}`).join(', '), 20, yPosition);
    yPosition += 10;
  }

  // Check if new page is needed
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Evidence Section
  doc.setFontSize(16);
  doc.setTextColor(...darkGray);
  doc.text('Evidence Collected', 20, yPosition);
  yPosition += 8;

  if (evidence.length > 0) {
    const evidenceData = evidence.map(e => {
      // Safely get hash - check multiple possible locations
      let hash = 'N/A';
      if (e.sha256Hash) {
        hash = e.sha256Hash;
      } else if (e.hash && e.hash.sha256) {
        hash = e.hash.sha256;
      }
      
      // Truncate hash for display
      const displayHash = hash !== 'N/A' ? hash.substring(0, 16) + '...' : 'N/A';
      
      return [
        e.name || 'Unnamed',
        e.type?.toString() || 'Unknown',
        formatDate(e.uploadedAt || new Date().toISOString()),
        displayHash,
      ];
    });

    autoTable(doc, {
      startY: yPosition,
      head: [['Name', 'Type', 'Date', 'SHA-256']],
      body: evidenceData,
      theme: 'striped',
      styles: { fontSize: 8 },
      headStyles: { fillColor: primaryColor },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('No evidence collected', 20, yPosition);
    yPosition += 15;
  }

  // Check if new page is needed
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }

  // Timeline Section
  doc.setFontSize(16);
  doc.setTextColor(...darkGray);
  doc.text('Timeline of Events', 20, yPosition);
  yPosition += 8;

  if (events.length > 0) {
    const timelineData = events.slice(0, 10).map(e => [
      formatDate(e.timestamp),
      e.severity?.toString().toUpperCase() || 'INFO',
      e.title || 'Untitled Event',
      e.source || 'Unknown',
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Time', 'Severity', 'Event', 'Source']],
      body: timelineData,
      theme: 'striped',
      styles: { fontSize: 7 },
      headStyles: { fillColor: primaryColor },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 20 },
        2: { cellWidth: 80 },
        3: { cellWidth: 40 },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('No events recorded', 20, yPosition);
    yPosition += 10;
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      'CONFIDENTIAL - Digital Forensics Report',
      20,
      doc.internal.pageSize.height - 10
    );
  }

  // Save
  const fileName = `forensics-report-${caseData.id}-${Date.now()}.pdf`;
  doc.save(fileName);

  // Показываем уведомление
  (window as any).showNotification?.({
    type: 'success',
    title: 'Report Exported',
    message: `PDF report has been downloaded: ${fileName}`,
  });
};