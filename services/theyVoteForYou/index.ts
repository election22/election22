import groupBy from "lodash.groupby";
import axios from "axios";
import { PersonComparison, PolicyDetails } from "./types";

export interface PolicySupportResult {
  party: string;
  support: number;
}

type PolicyObject = Record<string, PersonComparison[]>;

export async function getPolicySupport(policyId: number) {
  const apiKey = process.env.TVFY_API_KEY;
  const url = `https://theyvoteforyou.org.au/api/v1/policies/${policyId}.json?key=${encodeURIComponent(
    apiKey
  )}`;

  const response = await axios.get<PolicyDetails>(url);
  const results = getSupportFromPolicy(response.data);

  return results;
}

function formatPartyName(name: string) {
  return name.replace("Party", "").replace("Australian", "").trim();
}

function getSupportFromPolicy(policy: PolicyDetails): PolicySupportResult[] {
  // convert to object, grouped by party name
  const obj = groupBy(
    policy.people_comparisons,
    "person.latest_member.party"
  ) as PolicyObject;

  console.log("start parties:", Object.keys(obj));

  // join Liberal and Nationals
  mergeByPartyNames(
    obj,
    ["Liberal Party", "National Party", "Liberal National Party"],
    "Liberal National Party"
  );

  // join One Nation
  mergeByPartyNames(obj, ["Pauline Hanson's One Nation Party"], "One Nation");

  // remove independents
  // TODO: display them if they're running in the electorate
  delete obj["Independent"];

  console.log("end parties:", Object.keys(obj));

  // convert to array with averages
  const parties = Object.keys(obj);

  // return averages of support
  const results = parties.map((party) => {
    const sum = obj[party].reduce((a, b) => {
      return a + Number(b.agreement);
    }, 0);
    const avg = sum / obj[party].length || 0;

    return {
      party: formatPartyName(party),
      support: Math.floor(avg),
    };
  });

  return results;
}

/**
 * merge `fromNames` values into `toName` key
 */
function mergeByPartyNames(
  policyObj: PolicyObject,
  fromNames: string[],
  toName: string
) {
  // merge `fromNames` values into `toName` key
  policyObj[toName] = [].concat(
    fromNames
      .map((name) => {
        return policyObj[name] || [];
      })
      .flat()
  );
  // cleanup unused `fromNames`
  fromNames
    .filter((i) => i !== toName)
    .forEach((name) => {
      delete policyObj[name];
    });
}
