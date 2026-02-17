export enum BusinessStage {
  IDEA = 'Idea & Validation',
  MVP = 'MVP Development',
  GROWTH = 'Growth & Acquisition',
  SCALING = 'Scaling & Conversion'
}

export enum TaskPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum TaskType {
  VALIDATION = 'Validation',
  ACQUISITION = 'Acquisition',
  CONVERSION = 'Conversion',
  ADMIN = 'Admin/Legal',
  PRODUCT = 'Product'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: TaskPriority;
  type: TaskType;
  theme?: string; // e.g., "Validation Sprint"
  dueDate?: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  type: 'tax' | 'payment' | 'contract' | 'other';
  isCompleted: boolean;
}

export interface BusinessProfile {
  industry: string;
  targetAudience: string;
  productType: string;
  budget: string;
  launchDate: string;
  businessType: 'New Startup' | 'Existing Business';
  targetRegion: 'Local' | 'National' | 'Global';
  websiteUrl?: string;
  goldenNuggets?: string[]; // For Grandma's recipes/heritage
}

export interface StrategicAnalysis {
  elevatorPitch: string;
  unfairAdvantage: string;
  currentFocus: string;
  complianceRisks: string[];
  websiteScore?: { score: number; critique: string };
  
  // Module 2 Data
  sanityCheck?: string;
  marketIntelligence: {
    type: 'SEO' | 'LOCAL';
    summary: string;
    metrics: Array<{ label: string; value: string; trend: 'up' | 'down' | 'neutral' }>;
    topCompetitors: string[];
    strategicPivot?: { suggestedLocation: string; reasoning: string };
    viabilityScore?: number;
    marketGap?: string;
    inferredCompetitorCount?: number;
  };

  // Module 3 Data
  suggestedNames?: string[];
  legalStructure?: 'Aktiebolag' | 'Enskild Firma';
  legalReasoning?: string;
  setupChecklist?: Array<{ task: string; url: string }>;
  
  financialFeasibility: {
    estimatedStartupCost: number;
    monthlyBreakEvenRevenue: number;
    isAchievable: boolean;
    reasoning: string;
    financialAdvice?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}