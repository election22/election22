import { findElectorate } from "../../services/aec";

export default async function handler(req, res) {
  const results = await findElectorate(req.query.locality);
  res.status(200).json(results);
}
