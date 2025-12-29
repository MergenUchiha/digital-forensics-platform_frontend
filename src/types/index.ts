// Core Types for Digital Forensics Platform

export type CaseStatus = 'open' | 'in_progress' | 'closed' | 'archived';
export type CaseSeverity = 'critical' | 'high' | 'medium' | 'low';
export type EvidenceType = 'log' | 'network_capture' | 'disk_image' | 'memory_dump' | 'file' | 'api_response';
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst' | 'viewer';
  avatar?: string;
  createdAt: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  severity: CaseSeverity;
  assignedTo?: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  location?: {
    lat: number;
    lng: number;
    country: string;
    city: string;
  };
  stats: {
    evidenceCount: number;
    eventsCount: number;
    suspiciousActivities: number;
  };
}

export interface Evidence {
  id: string;
  caseId: string;
  name: string;
  type: EvidenceType;
  description?: string;
  hash: {
    md5: string;
    sha256: string;
  };
  size: number;
  uploadedBy: User;
  uploadedAt: string;
  metadata: Record<string, any>;
  chainOfCustody: ChainOfCustodyEntry[];
}

export interface ChainOfCustodyEntry {
  id: string;
  action: 'collected' | 'analyzed' | 'transferred' | 'exported' | 'modified';
  performedBy: User;
  timestamp: string;
  notes?: string;
  signature?: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  timestamp: string;
  type: 'authentication' | 'network' | 'file_access' | 'system' | 'api_call' | 'alert';
  source: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  metadata: Record<string, any>;
  relatedEntities?: {
    ipAddresses?: string[];
    usernames?: string[];
    files?: string[];
    devices?: string[];
  };
}

export interface NetworkNode {
  id: string;
  type: 'ip' | 'user' | 'device' | 'service';
  label: string;
  suspicious: boolean;
  metadata: {
    country?: string;
    asn?: string;
    reputation?: number;
    firstSeen?: string;
    lastSeen?: string;
  };
}

export interface NetworkConnection {
  source: string;
  target: string;
  type: 'tcp' | 'udp' | 'http' | 'https' | 'ssh' | 'rdp';
  suspicious: boolean;
  packets: number;
  bytes: number;
  timestamp: string;
}

export interface AnalysisResult {
  id: string;
  caseId: string;
  type: 'timeline' | 'network' | 'malware' | 'behavioral';
  status: AnalysisStatus;
  startedAt: string;
  completedAt?: string;
  results: {
    summary: string;
    findings: Finding[];
    recommendations: string[];
    confidence: number;
  };
}

export interface Finding {
  id: string;
  severity: CaseSeverity;
  title: string;
  description: string;
  evidence: string[];
  indicators: string[];
  mitre?: {
    technique: string;
    tactic: string;
  };
}

export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  criticalCases: number;
  evidenceCollected: number;
  eventsAnalyzed: number;
  casesThisMonth: number;
  avgResolutionTime: number;
  topThreats: Array<{
    name: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  recentActivity: Array<{
    id: string;
    type: 'case_created' | 'evidence_uploaded' | 'analysis_completed';
    title: string;
    timestamp: string;
    user: User;
  }>;
}

export interface Report {
  id: string;
  caseId: string;
  title: string;
  generatedAt: string;
  generatedBy: User;
  format: 'pdf' | 'html' | 'json';
  sections: ReportSection[];
  signature?: string;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  charts?: any[];
  evidence?: Evidence[];
}