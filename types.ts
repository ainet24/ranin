export type Step = 1 | 2 | 3 | 4;

export interface RepairRequest {
  manufacturer: string;
  model: string;
  issue: string;
  softwareIssue?: string;
  issueDescription: string;
  serviceType: 'store_visit' | 'pickup';
  name: string;
  phone: string;
  streetAddress?: string;
}

export interface RepairQuote {
  estimatedTime: string;
  requiredParts: string[];
  notes: string;
}
