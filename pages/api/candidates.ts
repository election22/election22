import axios from "axios";
import { parse, HTMLElement } from "node-html-parser";
import { send } from "process";
const tallyroomUrl = `https://www.tallyroom.com.au/aus2022`;

export interface CandidateResult {
  name: string;
  party: string;
  url?: string;
}

export interface CandidatesResponse {
  candidates: CandidateResult[];
  electorateUrl: string;
}

export default async function handler(req, res) {
  const electorate = normaliseElectorateName(req.query.electorate);

  if (!electorate) {
    return res.status(200).json({ error: "electorate is required" });
  }
  const electorateUrl = `${tallyroomUrl}/${electorate}2022`;

  try {
    const response = await axios.get(electorateUrl);

    const root = parse(response.data);

    const candidatesHeading = root.querySelector("#candidates");
    const candidatesFirstP = candidatesHeading.closest("p");
    if (!(candidatesFirstP instanceof HTMLElement)) {
      throw new Error(`Candidates first p is not an element`);
    }

    const candidatesSibling = candidatesFirstP.nextElementSibling;
    let candidateItems;

    if (candidatesSibling.tagName === "UL") {
      candidateItems = candidatesSibling.querySelectorAll("li");
    }
    if (candidatesSibling.tagName === "LI") {
      // we're dealing with li's outside of an ul - eg Flinders
      candidateItems = getNextSiblingsOfType(candidatesFirstP, "li");
    }

    console.log(candidateItems.length);
    const candidates: CandidateResult[] = candidateItems.map((item) => {
      const value = item.text.trim().replace(")", "").split("(");
      const candidateName = value[0].trim();
      const partyName = value[1].trim();

      return {
        name: value[0].trim(),
        party:
          partyName === "Independent"
            ? `${partyName} - ${candidateName}`
            : normalisePartyName(partyName),
        url: getUrlFromCandidateItem(item),
      };
    });
    res.status(200).json({
      candidates,
      electorateUrl,
    });
  } catch (e) {
    console.warn(e);
    res.status(401).send();
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

function getNextSiblingsOfType(element: HTMLElement, type: string) {
  let elements = getNextSiblingOfType(element, type, []);
  return elements;
}

function getNextSiblingOfType(
  element: HTMLElement,
  type: string,
  array: HTMLElement[]
) {
  const sibling = element.nextElementSibling;
  if (!!sibling && sibling.tagName === type.toUpperCase()) {
    array.push(sibling);
    getNextSiblingOfType(sibling, type, array);
  }
  return array;
}

function getUrlFromCandidateItem(item: HTMLElement) {
  const link = item.querySelector("a");
  if (link) {
    return link.getAttribute("href");
  }
  return undefined;
}

function normaliseElectorateName(name: string) {
  if (name.toUpperCase() === "EDEN-MONARO") {
    return "edenmonaro";
  } else {
    return name.toLowerCase().replace(/\s/g, "+").replace("'", "");
  }
}
