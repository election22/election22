import axios from "axios";
import { parse, HTMLElement } from "node-html-parser";
import { CandidateResult, ElectorateDetails } from "../../types/electorate";
import {
  getElectorateUrl,
  getNextSiblingsOfType,
  getUrlFromCandidateItem,
  normalisePartyName,
} from "./utils";

export async function getElectorateDetails(
  electorateName: string
): Promise<ElectorateDetails> {
  const electorateUrl = getElectorateUrl(electorateName);

  const pageHTML = await axios.get(electorateUrl);
  const root = parse(pageHTML.data);

  const candidates = findCandidates(root);
  const currentMP = findCurrentMP(root);
  if (currentMP) {
    const currentMPIndex = candidates.findIndex(
      (candidate) => candidate.name === currentMP
    );
    candidates[currentMPIndex].isCurrent = true;
  }

  return {
    candidates,
    electorateUrl,
    currentMP,
  };
}

function findCandidates(root: HTMLElement) {
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

  return candidates;
}

function findCurrentMP(root: HTMLElement): string | null {
  const pageContent = root.querySelector(".td-page-content");
  if (!pageContent) {
    return null;
  }
  const currentMPParagraph = pageContent.querySelectorAll(
    "p"
  )[1] as HTMLElement;
  if (
    !currentMPParagraph ||
    !currentMPParagraph.rawText.includes("Incumbent MP")
  ) {
    return null;
  }
  const currentMP = currentMPParagraph.text
    .split("Incumbent MP")[1]
    .trim()
    .split(", since")[0]
    .trim();
  return currentMP;
}
