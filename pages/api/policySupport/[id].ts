import axios from "axios";
import groupBy from "lodash.groupby";

export interface PolicySupportResult {
  party: string;
  support: number;
}

export default async function handler(req, res) {
  const apiKey = process.env.TVFY_API_KEY;
  const policyId = req.query.id;
  const url = `https://theyvoteforyou.org.au/api/v1/policies/${policyId}.json?key=${encodeURIComponent(
    apiKey
  )}`;

  try {
    const response = await axios.get(url);
    const groupedByParty = groupBy(
      response.data.people_comparisons,
      "person.latest_member.party"
    );

    delete groupedByParty["Independent"];
    const parties = Object.keys(groupedByParty);

    const results: PolicySupportResult[] = parties.map((party) => {
      const sum = groupedByParty[party].reduce((a, b) => {
        return a + Number(b.agreement);
      }, 0);
      const avg = sum / groupedByParty[party].length || 0;

      return {
        party: formatPartyName(party),
        support: Math.floor(avg),
      };
    });

    res.status(200).json(results);
  } catch (e) {
    console.warn(e);
  }
}

function formatPartyName(name: string) {
  return name.replace("Party", "").replace("Australian", "").trim();
}
