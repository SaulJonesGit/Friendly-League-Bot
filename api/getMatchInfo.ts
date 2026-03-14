import { MATCH_INFO_ENDPOINT } from "../constants/endpoints.js";
import "dotenv/config";
import axios from "axios";
import { GetMatchInfoResponse } from "../types/leagueTypes.js";

const getMatchInfo = async (matchID: string, puuid: string): Promise<any> => {
  const matchInfoEndpoint = MATCH_INFO_ENDPOINT;

  if (!matchInfoEndpoint) {
    console.log("Server configuration error");
    return;
  }

  const basePath = process.env.BASE_PATH;

  if (!basePath) {
    console.log("Server configuration error");
    return;
  }

  let matchDataEndpoint = basePath + matchInfoEndpoint;
  matchDataEndpoint = matchDataEndpoint.replace("{matchId}", matchID);

  const matchInfoResponse = await axios.get<GetMatchInfoResponse>(
    matchDataEndpoint + `?api_key=${process.env.LEAGUE_API_KEY}`,
  );

  if (matchInfoResponse.status !== 200) {
    console.log("Error fetching matches:", matchInfoResponse.statusText);
    return null;
  }

  const personData = matchInfoResponse.data.info.participants.find(
    (participant) => {
      return participant.puuid === puuid;
    },
  );

  return personData;
};

export default getMatchInfo;
