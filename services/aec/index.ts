import axios from "axios";
import { parse } from "node-html-parser";
import { LocalityResult } from "./types";

const aecLocalityUrl =
  "https://electorate.aec.gov.au/LocalitySearchResults.aspx";

/**
 * Searches the AEC for electorates matching the given Suburb, Locality or Postcode.
 */
export async function findElectorate(query: string) {
  const sanitizedQuery = query
    .toLowerCase()
    .replace(/\s/g, "+")
    .replace("'", "");

  const isPostcode = !!Number(sanitizedQuery);

  if (isPostcode && sanitizedQuery.length !== 4) {
    return [];
  }

  const response = await axios.get(
    `${aecLocalityUrl}?filter=${sanitizedQuery}&filterby=${
      isPostcode ? "Postcode" : "LocalityorSuburb"
    }`
  );

  const root = parse(response.data);

  const table = root.querySelector(
    "#ContentPlaceHolderBody_gridViewLocalities"
  );

  const hasResults = table.querySelector(".headingLink");
  if (!hasResults) {
    return [];
  }

  const rows = table.querySelectorAll(
    "> tr:not(.headingLink):not(.pagingLink)"
  );

  const results: LocalityResult[] = rows.map((row) => ({
    name: row.querySelector("td:nth-child(2)")?.text,
    postcode: row.querySelector("td:nth-child(3)")?.text,
    electorate: row.querySelector("td:nth-child(4)")?.text,
  }));

  return results;
}
