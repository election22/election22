import { LocalityResult } from "./types";
import localities from "./localities.json";

/**
 * Searches the AEC dataset for electorates matching the given Suburb, Locality or Postcode.
 */
export async function findElectorate(query: string) {
  const isPostcode = !!Number(query);

  if (isPostcode) {
    // require full postcode before doing search
    if (query.length !== 4) {
      return [];
    }
    return findByPostcode(query.toString());
  }

  const sanitizedQuery = query.toUpperCase().replace(/[^A-Z]/g, "");
  return findByName(sanitizedQuery);
}

function findByName(name: string): LocalityResult[] {
  const results = localities.filter((i) => i.index.startsWith(name));
  return results;
}

function findByPostcode(postcode: string): LocalityResult[] {
  return localities.filter((i) => i.postcode === postcode);
}
