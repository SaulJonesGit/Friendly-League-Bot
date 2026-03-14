import { MATCHES_ENDPOINT } from "../constants/endpoints.js";
import "dotenv/config";
import axios from "axios";
import { GetMatchesResponse } from "../types/leagueTypes.js";

const getMatches = async (
  puuid: string,
): Promise<string | null | undefined> => {
  const basePath = process.env.BASE_PATH;
  const matchesEndpoint = MATCHES_ENDPOINT;

  if (!basePath || !matchesEndpoint) {
    console.log("Server configuration error");
    return;
  }

  let matchesURL = basePath + matchesEndpoint;
  matchesURL = matchesURL.replace("{puuid}", puuid);
  matchesURL = matchesURL.concat(
    "?count=1",
    `&api_key=${process.env.LEAGUE_API_KEY}`,
  );

  const response = await axios.get<GetMatchesResponse>(matchesURL);

  if (response.status !== 200) {
    console.log("Error fetching matches:", response.statusText);
    return null;
  }

  const matchId = response.data[0];

  return matchId;
};

export default getMatches;
