import axios from "axios";
import React, { useContext, useEffect } from "react";
import { PolicyResult } from "../pages/api/policies";
import { PropsWithChildrenOnly } from "../types";
import { ElectorateDetails } from "../types/electorate";

interface UserContextState {
  electorate?: string;
  setElectorate: (electorate: string) => void;
  electorateDetails: ElectorateDetails | undefined;
  setElectorateDetails: (
    electorateDetails: ElectorateDetails | undefined
  ) => void;
  policies: PolicyResult[];
}

const UserContext = React.createContext<UserContextState | null>(null);

export const UserContextProvider: React.FC<PropsWithChildrenOnly> = ({
  children,
}) => {
  const [electorate, setElectorate] = React.useState<string>("");
  const [electorateDetails, setElectorateDetails] = React.useState<
    ElectorateDetails | undefined
  >();
  const [policies, setPolicies] = React.useState<PolicyResult[]>([]);

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
        electorateDetails,
        setElectorateDetails,
        policies,
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
