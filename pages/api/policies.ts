import axios from "axios";

export interface PolicyResult {
  id: number;
  name: string;
  description: string;
  provisional: boolean;
  last_edited_at: string;
}

export default async function handler(req, res) {
  const apiKey = process.env.TVFY_API_KEY;
  const url = `https://theyvoteforyou.org.au/api/v1/policies.json?key=${encodeURIComponent(
    apiKey
  )}`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (e) {
    console.warn(e);
  }
}
