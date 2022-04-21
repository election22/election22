import axios from "axios";
import { parse } from "node-html-parser";

export interface LocalityResult {
  name: string;
  postcode: string;
  electorate: string;
}

const aecLocalityUrl =
  "https://electorate.aec.gov.au/LocalitySearchResults.aspx";

export default async function handler(req, res) {
  console.log("querying...");
  const query = req.query.locality
    .toLowerCase()
    .replace(/\s/g, "+")
    .replace("'", "");

  console.log(query);
  try {
    const response = await axios.get(
      `${aecLocalityUrl}?filter=${query}&filterby=LocalityorSuburb`
    );

    const root = parse(response.data);

    const table = root.querySelector(
      "#ContentPlaceHolderBody_gridViewLocalities"
    );
    const rows = table.querySelectorAll("tr:not(.headingLink)");
    const results: LocalityResult[] = rows.map((row) => ({
      name: row.querySelector("td:nth-child(2)")?.text,
      postcode: row.querySelector("td:nth-child(3)")?.text,
      electorate: row.querySelector("td:nth-child(4)")?.text,
    }));
    console.log(results);

    res.status(200).json(results);
  } catch (e) {
    console.warn(e);
  }
}
