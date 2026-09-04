// Core Types for Digital Forensics Platform

// These match what the API stores and returns. They were declared in lower
// case while every payload came back upper case, which is why the components
// are dotted with defensive `.toString().toLowerCase()` calls.
export type CaseStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'ARCHIVED';
export type CaseSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type EvidenceType =
  | 'LOG'
  | 'NETWORK_CAPTURE'
  | 'DISK_IMAGE'
  | 'MEMORY_DUMP'
  | 'FILE'
  | 'API_RESPONSE'
  | 'PHOTO';
export type IoTDeviceType = 'CAMERA' | 'SMART_SPEAKER' | 'SENSOR' | 'SMART_LOCK' | 'ROUTER' | 'DVR' | 'SMART_TV' | 'WEARABLE' | 'OTHER';
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'ANALYST';
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
  locationCity?: string;
  locationCountry?: string;
  locationLat?: number;
  locationLng?: number;
  evidenceCount?: number;
  eventsCount?: number;
  suspiciousActivities?: number;
  stats?: {
    evidenceCount: number;
    eventsCount: number;
    suspiciousActivities: number;
  };
}

export interface EvidenceItem  {
  id: string;
  caseId: string;
  name: string;
  type: EvidenceType;
  description?: string;
  hash: {
    md5: string;
    sha256: string;
  };
  md5Hash?: string;
  sha256Hash?: string;
  size: number;
  filePath?: string;
  fileSize?: number;
  uploadedBy: User;
  uploadedAt: string;
  createdAt?: string;
  metadata: Record<string, unknown>;
  iotDeviceType?: IoTDeviceType;
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
  metadata: Record<string, unknown>;
  relatedEntities?: {
    ipAddresses?: string[];
    usernames?: string[];
    files?: string[];
    devices?: string[];
  };
  ipAddresses?: string[];
  usernames?: string[];
  files?: string[];
  devices?: string[];
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

/** What `GET /analytics/dashboard` returns, all counted from the database. */
export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  criticalCases: number;
  evidenceCollected: number;
  eventsAnalyzed: number;
  suspiciousEvents: number;
  lastUpdate: string;
}

export interface SeverityCount {
  severity: string;
  count: number;
}

export interface SourceCount {
  source: string;
  count: number;
  percentage: string;
}

export interface TimeSeriesPoint {
  time: string;
  timestamp: string;
  events: number;
  critical: number;
  suspicious: number;
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
  charts?: Array<Record<string, unknown>>;
  evidence?: EvidenceItem[];
}
// ─── Request payloads ─────────────────────────────────────────────────────────

export interface CreateCasePayload {
  title: string;
  description: string;
  severity: CaseSeverity;
  status?: CaseStatus;
  tags?: string[];
  location?: {
    city: string;
    country: string;
    lat?: number;
    lng?: number;
  };
  assignedToId?: string;
}

export type UpdateCasePayload = Partial<
  Omit<CreateCasePayload, 'location'>
> & { assignedToId?: string | null };

export interface CreateEvidencePayload {
  name: string;
  type: string;
  description?: string;
  caseId: string;
  iotDeviceType?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateTimelineEventPayload {
  timestamp: string;
  type: string;
  source: string;
  severity: CaseSeverity;
  title: string;
  description: string;
  caseId: string;
  metadata?: Record<string, unknown>;
  ipAddresses?: string[];
  usernames?: string[];
  files?: string[];
  devices?: string[];
}
