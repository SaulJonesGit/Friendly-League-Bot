const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();


const app = express();
app.use(express.json())
const port = 3000

app.get('/', (req: any, res: any) => {
    res.send('Hello World!')
});

const mapPersonToPuuid: { [key: string]: string } = {
    'TYLA': process.env.TYLA_PUUID as string,
    'CORBEN': process.env.CORBEN_PUUID as string,
};

app.post('/is-person-negative', async (req: any, res: any) => {

    const person = req.body?.person;

    if (!person) {
        return res.status(400).send('Person is required');
    }

    const puuid = mapPersonToPuuid[person.toUpperCase()];

    if (!puuid) {
        return res.status(404).send('Person not found');
    }

    const basePath = process.env.BASE_PATH;
    const matchesEndpoint = process.env.MATCHES_ENDPOINT;

    if (!puuid || !basePath || !matchesEndpoint) {
        return res.status(500).send('Server configuration error');
    }

    // hit the match id endpoint
    let matchesURL = basePath + matchesEndpoint;

    matchesURL = matchesURL.replace('{puuid}', puuid);

    matchesURL = matchesURL.concat('?count=1', `&api_key=${process.env.API_KEY}`);

    const response = await axios.get(matchesURL);

    const matchId: string = response.data[0];

    //check if a new match exists

    //if so, look if he was negative

    const matchInfoEndpoint = process.env.MATCH_INFO_ENDPOINT;

    if (!matchInfoEndpoint) {
        return res.status(500).send('Server configuration error');
    }

    let matchDataEndpoint = basePath + matchInfoEndpoint;

    matchDataEndpoint = matchDataEndpoint.replace('{matchId}', matchId);

    const matchInfoResponse = await axios.get(matchDataEndpoint + `?api_key=${process.env.API_KEY}`);

    let personData = matchInfoResponse.data.info.participants.find((participant: any) => {
        if (participant.puuid === puuid) {
            return true;
        }
    });



    res.send(personData.kills / personData.deaths <= 1 ? true : false);


});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});




