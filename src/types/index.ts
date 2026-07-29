export interface LinkRecord {
  id: number;
  code: string;
  url: string;
  created_at: string;
}

export interface ShortenRequest {
  url: string;
}

export interface ShortenResponse {
  code: string;
  short_url: string;
  url: string;
}

export interface ShortenErrorResponse {
  error: string;
}

export interface ShortenResult extends ShortenResponse {
  existing?: boolean;
}
