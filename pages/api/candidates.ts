import axios from "axios";
import { parse } from "node-html-parser";
const tallyroomUrl = `https://www.tallyroom.com.au/aus2022`;

export interface CandidateResult {
  name: string;
  party: string;
}

export default async function handler(req, res) {
  const electorate = req.query.electorate
    .toLowerCase()
    .replace(/\s/g, "+")
    .replace("'", "");
  if (!electorate) {
    res.status(200).json({ error: "electorate is required" });
    return;
  }
  try {
    const response = await axios.get(`${tallyroomUrl}/${electorate}2022`);

    const root = parse(response.data);

    const candidatesTable = root.querySelector("#candidates");
    const candidatesList =
      candidatesTable.parentNode.parentNode.nextElementSibling;
    if (!candidatesList) {
      throw Error(`No candidates list found for ${electorate}`);
    }
    const candidateItems = candidatesList.querySelectorAll("li");
    const candidates: CandidateResult[] = candidateItems.map((item) => {
      const value = item.text.trim().replace(")", "").split("(");
      return {
        name: value[0].trim(),
        party: normalisePartyName(value[1].trim()),
      };
    });
    res.status(200).json(candidates);
  } catch (e) {
    console.warn(e);
  }
}

function normalisePartyName(name: string) {
  switch (name) {
    case "Liberal":
    case "Nationals":
      return "Liberal National";
    default:
      return name;
  }
}
