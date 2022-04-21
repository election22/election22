import axios from "axios";
import React, { PropsWithChildren, useContext, useEffect } from "react";
import { CandidateResult } from "../pages/api/candidates";
import { PolicyResult } from "../pages/api/policies";
import { PropsWithChildrenOnly } from "../types";

interface UserContextState {
  electorate?: string;
  policies: PolicyResult[];
  setElectorate: (electorate: string) => void;
  candidates: CandidateResult[];
  setCandidates: (parties: CandidateResult[]) => void;
}

const UserContext = React.createContext<UserContextState | null>(null);

export const UserContextProvider: React.FC<PropsWithChildrenOnly> = ({
  children,
}) => {
  const [electorate, setElectorate] = React.useState<string>("");
  const [policies, setPolicies] = React.useState<PolicyResult[]>([]);
  const [candidates, setCandidates] = React.useState<CandidateResult[]>([]);

  useEffect(() => {
    if (policies.length === 0) {
      getPolicies().then((result) => {
        console.log(result);
        setPolicies(result);
      });
    }
  }, [policies.length]);

  return (
    <UserContext.Provider
      value={{
        electorate,
        setElectorate,
        policies,
        candidates,
        setCandidates,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

async function getPolicies() {
  const res = await axios.get<PolicyResult[]>(`/api/policies`);
  const { data } = res;
  return data;
}
