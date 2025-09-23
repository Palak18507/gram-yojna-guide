export interface Scheme {
  id: string;
  name: string;
  fullName: string;
  category: string;
  description: string;
  benefits: string[];
  eligibility: string[];
  targetAudience: string[];
  keywords: string[];
}

export interface Village {
  id: string;
  name: string;
  state: string;
  district: string;
  population: number;
  households: number;
  literacyRate: number;
  forestDependency: number;
  mainOccupation: string[];
  tribalPopulation: number;
  infrastructure: {
    electricity: number;
    water: number;
    roads: number;
    school: boolean;
    healthCenter: boolean;
  };
  challenges: string[];
  recommendedSchemes: string[];
  description: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'suggestion';
  content: string;
  schemes?: Scheme[];
  timestamp: Date;
}