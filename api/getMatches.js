
import 'dotenv/config';
import axios from 'axios';


let getMatches = async (puuid) => {

    const basePath = process.env.BASE_PATH;
    const matchesEndpoint = process.env.MATCHES_ENDPOINT;

    if (!basePath || !matchesEndpoint) {
        console.log('Server configuration error');
        return;
    }

    let matchesURL = process.env.BASE_PATH + matchesEndpoint;
    matchesURL = matchesURL.replace('{puuid}', puuid);
    matchesURL = matchesURL.concat('?count=1', `&api_key=${process.env.LEAGUE_API_KEY}`);

    const response = await axios.get(matchesURL);

    if (response.status !== 200) {
        console.log('Error fetching matches:', response.statusText);
        return null;
    }

    const matchId = response.data[0];

    return matchId;

}



export default getMatches;