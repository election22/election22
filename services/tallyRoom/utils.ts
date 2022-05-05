import { HTMLElement } from "node-html-parser";
const tallyroomUrl = `https://www.tallyroom.com.au/aus2022`;

export function getElectorateUrl(electorateName: string) {
  const electorate = normaliseElectorateName(electorateName);
  return `${tallyroomUrl}/${electorate}2022`;
}

export function normalisePartyName(name: string) {
  switch (name) {
    case "Liberal":
    case "Nationals":
      return "Liberal National";
    default:
      return name;
  }
}

export function normaliseElectorateName(name: string) {
  if (name.toUpperCase() === "EDEN-MONARO") {
    return "edenmonaro";
  } else {
    return name.toLowerCase().replace(/\s/g, "+").replace("'", "");
  }
}

export function getNextSiblingsOfType(element: HTMLElement, type: string) {
  let elements = getNextSiblingOfType(element, type, []);
  return elements;
}

function getNextSiblingOfType(
  element: HTMLElement,
  type: string,
  array: HTMLElement[]
) {
  const sibling = element.nextElementSibling as HTMLElement;
  if (!!sibling && sibling.tagName === type.toUpperCase()) {
    array.push(sibling);
    getNextSiblingOfType(sibling, type, array);
  }
  return array;
}

export function getUrlFromCandidateItem(item: HTMLElement) {
  const link = item.querySelector("a");
  if (link) {
    return link.getAttribute("href");
  }
  return undefined;
}
