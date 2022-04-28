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
    res
      .status(200)
      .json(
        sortPoliciesById(filterJunkPolicies(response.data)).map((i) =>
          formatPolicy(i)
        )
      );
  } catch (e) {
    console.warn(e);
    res.status(500).send();
  }
}

function sortPoliciesById(policies: PolicyResult[]) {
  return policies.sort((a, b) => b.id - a.id);
}

function filterJunkPolicies(policies: PolicyResult[]) {
  return policies.filter((p) => {
    // remove provisional policies as they are WIP and not ready for comparison
    if (p.provisional) {
      return false;
    }

    // remove known junk policies
    switch (true) {
      case p.name.includes("test policies being allowed"):
      case p.name === "draft draft":
      case p.name === "draft":
      case p.name === "TEST":
      case p.name === "test2": {
        return false;
      }
      default:
        return true;
    }
  });
}

function formatPolicy(policy: PolicyResult) {
  return {
    ...policy,
    name: capitalizeFirstLetter(policy.name),
    description: capitalizeFirstLetter(addTrailingPeriod(policy.description)),
  };
}

function addTrailingPeriod(string) {
  return string.endsWith(".") ? string : `${string}.`;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
