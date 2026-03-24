// =============================================================================
// TYPES
// =============================================================================

export interface EndpointParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  in: 'path' | 'query' | 'body';
}

export interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  scopes: string[];
  isWrite: boolean;
  params?: EndpointParam[];
  requestExample?: string;
  responseExample?: string;
}

export interface ResourceGroup {
  id: string;
  label: string;
  description: string;
  endpoints: Endpoint[];
}

// =============================================================================
// BASE URL
// =============================================================================

export const API_BASE_URL = 'https://api.trustpager.com/v1';
