import { TFT_RANKS_ENDPOINT } from "../constants/endpoints.js";
import "dotenv/config";
import axios from "axios";

const getTftRanks = async (puuid) => {
  const basePath = process.env.TFT_BASE_PATH;
  const tftEndpoint = TFT_RANKS_ENDPOINT;

  if (!basePath || !tftEndpoint) {
    console.log("Server configuration error");
    return;
  }

  let getTftRanks = basePath + tftEndpoint;
  getTftRanks = getTftRanks.replace("{puuid}", puuid);
  getTftRanks = getTftRanks.concat(`?api_key=${process.env.TFT_API_KEY}`);

  const response = await axios.get(getTftRanks);

  if (response.status !== 200) {
    console.log("Error fetching matches:", response.statusText);
    return null;
  }

  const tftData = response.data.find(
    (queue) => queue.queueType === "RANKED_TFT",
  );

  return tftData;
};

export default getTftRanks;
