import { MATCHES_ENDPOINT, TFT_RANKS_ENDPOINT } from '../constants/endpoints.js';
import 'dotenv/config';
import axios from 'axios';


const getTftRanks = async (puuid: string): Promise<any> => {

    const basePath = process.env.TFT_BASE_PATH;
    const tftEndpoint = TFT_RANKS_ENDPOINT;

    if (!basePath || !tftEndpoint) {
        console.log('Server configuration error');
        return;
    }

    let tftRanksUrl = basePath + tftEndpoint;
    tftRanksUrl = tftRanksUrl.replace('{puuid}', puuid);
    tftRanksUrl = tftRanksUrl.concat(`?api_key=${process.env.LEAGUE_API_KEY}`);

    const response = await axios.get<any[]>(tftRanksUrl);

    if (response.status !== 200) {
        console.log('Error fetching matches:', response.statusText);
        return null;
    }

    const tftData = response.data.find((queue: any) => queue.queueType === 'RANKED_TFT');

    return tftData;

}

export default getTftRanks;