import { ElectorateDetails } from "../../types/electorate";
import electorates from "./electorates.json";

export async function getElectorateDetails(
  electorateName: string
): Promise<ElectorateDetails> {
  const searchTerm = electorateName.toUpperCase().replace(/[^A-Z]/g, "");
  const electorate = electorates.find((i) => i.index === searchTerm);
  return electorate;
}
