export interface PolicyDetails {
  id: number;
  /** A short name for the policy */
  name: string;
  /** More detail on what the policy means */
  description: string;
  /** A provisional policy isn't yet "complete" and isn't visible by default in comparisons with people */
  provisional: boolean;
  /** Time that the policy was last edited (in ISO 8601 format) */
  last_edited_at: string;
  /** An array of divisions connected to this policy. Each division also has an associated vote which can be strong which makes the vote more important */
  policy_divisions: {
    division: PolicyDivision;
    /** if "strong", this vote was more important (?) */
    strong: boolean;
    vote: "aye" | "no";
  }[];
  people_comparisons: PersonComparison[];
}

export interface PolicyDivision {
  id: number;
  aye_votes: number;
  no_votes: number;
  /** time of day - eg "1:06 PM" */
  clock_time: string;
  date: string;
  edited: boolean;
  house: string;
  name: string;
  possible_turnout: number;
  number: string;
  rebellions: number;
}

export interface PersonComparison {
  /** their calculated agreement score in range from 0 to 100 */
  agreement: number;
  /** whether they ever vote on a division from this policy */
  voted: boolean;
  /** the overall summary of the agreement corresponding to the wording used on the site */
  category:
    | "for3"
    | "for2"
    | "for1"
    | "mixture"
    | "against1"
    | "against2"
    | "against3"
    | "not_enough";
  person: {
    id: number;
    latest_member: {
      electorate: string;
      house: string;
      id: number;
      name: {
        first: string;
        last: string;
      };
      party: string;
    };
  };
}
