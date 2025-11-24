
import 'dotenv/config';
import axios from 'axios';


let getMatchInfo = async (matchID, puuid) => {

    // Check if a new match exists
    const matchInfoEndpoint = process.env.MATCH_INFO_ENDPOINT;

    if (!matchInfoEndpoint) {
        console.log('Server configuration error');
        return;
    }

    let matchDataEndpoint = process.env.BASE_PATH + matchInfoEndpoint;
    matchDataEndpoint = matchDataEndpoint.replace('{matchId}', matchID);

    const matchInfoResponse = await axios.get(matchDataEndpoint + `?api_key=${process.env.LEAGUE_API_KEY}`);

    if (matchInfoResponse.status !== 200) {
        console.log('Error fetching matches:', response.statusText);
        return null;
    }

    const personData = matchInfoResponse.data.info.participants.find((participant) => {
        return participant.puuid === puuid;
    });

    return personData;
}



export default getMatchInfo;