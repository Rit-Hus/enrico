export interface BusinessNameSuggestions {
  names: Array<{
    name: string;
    reasoning: string;
  }>;
}

export interface BusinessNameRequest {
  businessDescription: string;
  marketResearchSummary: string;
}

export interface BusinessNameResponse {
  success: true;
  data: BusinessNameSuggestions;
}

export interface BusinessNameError {
  success: false;
  error: string;
}
