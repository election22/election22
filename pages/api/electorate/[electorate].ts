import { getElectorateDetails } from "../../../services/tallyRoom";
import { ElectorateDetails } from "../../../types/electorate";

export default async function handler(req, res): Promise<ElectorateDetails> {
  const electorateName = req.query.electorate;
  const electorateDetails = await getElectorateDetails(electorateName);
  return res.status(200).json(electorateDetails);
}
