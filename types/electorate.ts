export interface CandidateResult {
  name: string;
  party: string;
  url?: string | undefined;
  isCurrent?: boolean | undefined;
}

export interface ElectorateDetails {
  candidates: CandidateResult[];
  electorateUrl: string;
  currentMP: string | null;
}
