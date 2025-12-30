import { Case, EvidenceItem, TimelineEvent, DashboardStats, User, NetworkNode, NetworkConnection } from '@/types';

export const mockUser: User = {
  id: '1',
  email: 'analyst@forensics.io',
  name: 'Alex Johnson',
  role: 'analyst',
  createdAt: '2024-01-15T10:00:00Z',
};

export const mockCases: Case[] = [
  {
    id: '1',
    title: 'AWS S3 Bucket Data Breach',
    description: 'Unauthorized access detected to production S3 bucket containing customer PII. Multiple GET requests from unknown IP addresses.',
    status: 'in_progress',
    severity: 'critical',
    assignedTo: mockUser,
    createdBy: mockUser,
    createdAt: '2024-12-20T08:30:00Z',
    updatedAt: '2024-12-26T14:20:00Z',
    tags: ['aws', 'data-breach', 's3', 'pii'],
    location: {
      lat: 37.7749,
      lng: -122.4194,
      country: 'USA',
      city: 'San Francisco',
    },
    stats: {
      evidenceCount: 12,
      eventsCount: 1543,
      suspiciousActivities: 37,
    },
  },
  {
    id: '2',
    title: 'IoT Camera Botnet Activity',
    description: 'Smart security cameras exhibiting unusual network behavior. Suspected Mirai variant infection across 50+ devices.',
    status: 'open',
    severity: 'high',
    createdBy: mockUser,
    createdAt: '2024-12-25T15:45:00Z',
    updatedAt: '2024-12-25T15:45:00Z',
    tags: ['iot', 'botnet', 'mirai', 'cameras'],
    location: {
      lat: 51.5074,
      lng: -0.1278,
      country: 'UK',
      city: 'London',
    },
    stats: {
      evidenceCount: 8,
      eventsCount: 2341,
      suspiciousActivities: 89,
    },
  },
  {
    id: '3',
    title: 'Azure Container Registry Compromise',
    description: 'Malicious Docker image pushed to private ACR. Image contains cryptocurrency miner and reverse shell.',
    status: 'in_progress',
    severity: 'critical',
    assignedTo: mockUser,
    createdBy: mockUser,
    createdAt: '2024-12-24T11:20:00Z',
    updatedAt: '2024-12-26T09:15:00Z',
    tags: ['azure', 'container', 'malware', 'cryptominer'],
    location: {
      lat: 52.5200,
      lng: 13.4050,
      country: 'Germany',
      city: 'Berlin',
    },
    stats: {
      evidenceCount: 15,
      eventsCount: 876,
      suspiciousActivities: 23,
    },
  },
  {
    id: '4',
    title: 'GCP API Key Exposure',
    description: 'GCP service account key found in public GitHub repository. Multiple API calls from various locations detected.',
    status: 'closed',
    severity: 'high',
    assignedTo: mockUser,
    createdBy: mockUser,
    createdAt: '2024-12-15T09:00:00Z',
    updatedAt: '2024-12-22T16:30:00Z',
    tags: ['gcp', 'credential-leak', 'github', 'api'],
    location: {
      lat: 35.6762,
      lng: 139.6503,
      country: 'Japan',
      city: 'Tokyo',
    },
    stats: {
      evidenceCount: 9,
      eventsCount: 542,
      suspiciousActivities: 18,
    },
  },
];

export const mockEvidence: EvidenceItem[] = [
  {
    id: '1',
    caseId: '1',
    name: 'cloudtrail_logs_20241220.json',
    type: 'log',
    description: 'AWS CloudTrail logs showing unauthorized S3 access attempts',
    hash: {
      md5: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    size: 2457600,
    uploadedBy: mockUser,
    uploadedAt: '2024-12-20T09:15:00Z',
    metadata: {
      source: 'AWS CloudTrail',
      region: 'us-west-2',
      timeRange: '2024-12-20 00:00:00 - 08:30:00',
    },
    chainOfCustody: [
      {
        id: '1',
        action: 'collected',
        performedBy: mockUser,
        timestamp: '2024-12-20T09:15:00Z',
        notes: 'Collected from AWS CloudTrail via API',
      },
    ],
  },
  {
    id: '2',
    caseId: '1',
    name: 's3_access_logs.csv',
    type: 'log',
    description: 'S3 bucket access logs for the affected bucket',
    hash: {
      md5: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7',
      sha256: 'f4a8c55d8ed8b5c8e3a4f3c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    size: 1843200,
    uploadedBy: mockUser,
    uploadedAt: '2024-12-20T09:30:00Z',
    metadata: {
      source: 'S3 Server Access Logs',
      bucket: 'prod-customer-data',
    },
    chainOfCustody: [
      {
        id: '2',
        action: 'collected',
        performedBy: mockUser,
        timestamp: '2024-12-20T09:30:00Z',
      },
    ],
  },
];

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    caseId: '1',
    timestamp: '2024-12-20T03:24:15Z',
    type: 'authentication',
    source: 'AWS CloudTrail',
    severity: 'warning',
    title: 'Unusual API Authentication',
    description: 'API authentication from unknown IP address 185.220.101.42',
    metadata: {
      ipAddress: '185.220.101.42',
      userAgent: 'aws-cli/2.13.0',
      country: 'Russia',
    },
    relatedEntities: {
      ipAddresses: ['185.220.101.42'],
      usernames: ['arn:aws:iam::123456789012:user/unknown'],
    },
  },
  {
    id: '2',
    caseId: '1',
    timestamp: '2024-12-20T03:25:03Z',
    type: 'api_call',
    source: 'AWS CloudTrail',
    severity: 'critical',
    title: 'S3 ListBucket Operation',
    description: 'Unauthorized ListBucket operation on prod-customer-data',
    metadata: {
      bucket: 'prod-customer-data',
      operation: 'ListBucket',
      success: true,
    },
    relatedEntities: {
      ipAddresses: ['185.220.101.42'],
    },
  },
  {
    id: '3',
    caseId: '1',
    timestamp: '2024-12-20T03:26:18Z',
    type: 'api_call',
    source: 'AWS CloudTrail',
    severity: 'critical',
    title: 'Multiple S3 GetObject Calls',
    description: '247 GetObject operations performed within 3 minutes',
    metadata: {
      bucket: 'prod-customer-data',
      objectsAccessed: 247,
      dataTransferred: '1.2 GB',
    },
    relatedEntities: {
      ipAddresses: ['185.220.101.42'],
    },
  },
  {
    id: '4',
    caseId: '1',
    timestamp: '2024-12-20T03:42:05Z',
    type: 'alert',
    source: 'AWS GuardDuty',
    severity: 'critical',
    title: 'GuardDuty Alert: Exfiltration',
    description: 'Data exfiltration detected from S3 bucket',
    metadata: {
      alertType: 'Exfiltration:S3/ObjectRead.Unusual',
      confidence: 'High',
    },
    relatedEntities: {
      ipAddresses: ['185.220.101.42'],
    },
  },
];

export const mockNetworkNodes: NetworkNode[] = [
  {
    id: '185.220.101.42',
    type: 'ip',
    label: '185.220.101.42',
    suspicious: true,
    metadata: {
      country: 'Russia',
      asn: 'AS13335',
      reputation: 15,
      firstSeen: '2024-12-20T03:24:15Z',
      lastSeen: '2024-12-20T03:42:05Z',
    },
  },
  {
    id: 'prod-s3-bucket',
    type: 'service',
    label: 'prod-customer-data',
    suspicious: false,
    metadata: {
      firstSeen: '2024-12-20T03:25:03Z',
    },
  },
  {
    id: 'aws-api-gateway',
    type: 'service',
    label: 'AWS API Gateway',
    suspicious: false,
    metadata: {},
  },
  {
    id: '10.0.1.45',
    type: 'ip',
    label: '10.0.1.45',
    suspicious: false,
    metadata: {
      country: 'USA',
      reputation: 95,
    },
  },
];

export const mockNetworkConnections: NetworkConnection[] = [
  {
    source: '185.220.101.42',
    target: 'aws-api-gateway',
    type: 'https',
    suspicious: true,
    packets: 1543,
    bytes: 145600,
    timestamp: '2024-12-20T03:24:15Z',
  },
  {
    source: 'aws-api-gateway',
    target: 'prod-s3-bucket',
    type: 'https',
    suspicious: true,
    packets: 247,
    bytes: 1288490496,
    timestamp: '2024-12-20T03:25:03Z',
  },
  {
    source: '10.0.1.45',
    target: 'prod-s3-bucket',
    type: 'https',
    suspicious: false,
    packets: 45,
    bytes: 234500,
    timestamp: '2024-12-20T02:15:00Z',
  },
];

export const mockDashboardStats: DashboardStats = {
  totalCases: 127,
  activeCases: 23,
  criticalCases: 8,
  evidenceCollected: 1543,
  eventsAnalyzed: 45678,
  casesThisMonth: 34,
  avgResolutionTime: 4.2,
  topThreats: [
    { name: 'Data Exfiltration', count: 15, trend: 'up' },
    { name: 'Credential Theft', count: 12, trend: 'stable' },
    { name: 'Malware Infection', count: 8, trend: 'down' },
    { name: 'DDoS Attack', count: 5, trend: 'up' },
  ],
  recentActivity: [
    {
      id: '1',
      type: 'case_created',
      title: 'New case: AWS S3 Bucket Data Breach',
      timestamp: '2024-12-26T14:20:00Z',
      user: mockUser,
    },
    {
      id: '2',
      type: 'evidence_uploaded',
      title: 'Evidence uploaded to case #1',
      timestamp: '2024-12-26T13:45:00Z',
      user: mockUser,
    },
    {
      id: '3',
      type: 'analysis_completed',
      title: 'Timeline analysis completed for case #3',
      timestamp: '2024-12-26T12:30:00Z',
      user: mockUser,
    },
  ],
};