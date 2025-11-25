export enum RecommendationStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  rationale: string;
  implementationInstructions: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  effort: 'Low' | 'Medium' | 'High';
  status: RecommendationStatus;
  implementedOn?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
}