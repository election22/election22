export interface CandidateResult {
  name: string;
  party: string;
  url?: string;
  isCurrent?: true;
}

export interface ElectorateDetails {
  candidates: CandidateResult[];
  electorateUrl: string;
  currentMP: string | null;
}
