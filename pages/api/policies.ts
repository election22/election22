import axios from "axios";

export interface PolicyResult {
  id: number;
  name: string;
  description: string;
  provisional: boolean;
  last_edited_at: string;
}

export default async function handler(req, res) {
  const apiKey = process.env.TVFY_API_KEY;
  const url = `https://theyvoteforyou.org.au/api/v1/policies.json?key=${encodeURIComponent(
    apiKey
  )}`;

  try {
    const response = await axios.get(url);
    res.status(200).json(sortPoliciesById(filterJunkPolicies(response.data)));
  } catch (e) {
    console.warn(e);
  }
}

function sortPoliciesById(policies: PolicyResult[]) {
  return policies.sort((a, b) => b.id - a.id);
}

function filterJunkPolicies(policies: PolicyResult[]) {
  return policies.filter((p) => {
    switch (true) {
      case p.name.includes("test policies being allowed"):
      case p.name === "draft draft":
      case p.name === "draft":
      case p.name === "TEST":
      case p.name === "test2": {
        console.log(`removed ${p.name}`);
        return false;
      }
      default:
        return true;
    }
  });
}
