import { getPolicySupport } from "../../../services/theyVoteForYou";

export default async function handler(req, res) {
  try {
    const results = await getPolicySupport(Number(req.query.id));
    res.status(200).json(results);
  } catch (e) {
    console.warn(e);
  }
}
