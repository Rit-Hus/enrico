export interface BusinessTypeAssessment {
  recommendedType: string;
  reasoning: string;
  alternatives: Array<{
    type: string;
    pros: string[];
    cons: string[];
  }>;
  considerations: string[];
}

export interface BusinessTypeRequest {
  businessDescription: string;
  businessName: string;
  marketResearchSummary: string;
}

export interface BusinessTypeResponse {
  success: true;
  data: BusinessTypeAssessment;
}

export interface BusinessTypeError {
  success: false;
  error: string;
}
