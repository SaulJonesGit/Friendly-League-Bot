import { TFT_RANKS_ENDPOINT } from "../constants/endpoints.js";
import "dotenv/config";
import axios from "axios";
import { GetTftRanksResponse } from "../types/tftTypes.js";

const getTftRanks = async (
  puuid: string,
): Promise<GetTftRanksResponse | null> => {
  const basePath = process.env.TFT_BASE_PATH;
  const tftEndpoint = TFT_RANKS_ENDPOINT;

  if (!basePath || !tftEndpoint) {
    console.log("Server configuration error");
    return null;
  }

  let tftRanksUrl = basePath + tftEndpoint;
  tftRanksUrl = tftRanksUrl.replace("{puuid}", puuid);
  tftRanksUrl = tftRanksUrl.concat(`?api_key=${process.env.TFT_API_KEY}`);

  const response = await axios.get<any[]>(tftRanksUrl);

  if (response.status !== 200) {
    console.log("Error fetching matches:", response.statusText);
    return null;
  }

  const tftData = response.data.find(
    (queue) => queue.queueType === "RANKED_TFT",
  );

  return tftData || null;
};

export default getTftRanks;
