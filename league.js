import 'dotenv/config';
import express from 'express';
import { DiscordRequest } from './utils.js';
import { isNegative } from './helpers/isNegative.js';
import { getMatches, getMatchInfo } from './api/index.js';
import { mapPersonToPuuid } from './constants/puuids.js';

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.DISCORD_TOKEN;

let savedMatchIds = {};

function sendMessage(content) {
    DiscordRequest(`/channels/479579787589845001/messages`, {
        method: 'POST',
        body: {
            content,
        },
        token: BOT_TOKEN,
    });
}

// Function to check stats for a specific user
export const checkStatsForUser = async (person) => {
    const puuid = mapPersonToPuuid[person.toUpperCase()];

    if (!puuid) {
        console.error(`Person not found: ${person}`);
        return;
    }

    // Get the latest match ID for the user
    let matchId = await getMatches(puuid);

    if (!matchId) {
        console.error(`No match found for ${person}`);
        return;
    }

    // Set a default value if none exists
    if (savedMatchIds[person] === undefined) {
        savedMatchIds[person] = matchId;
        console.log(`Default set for ${person}`);
        return;
    }

    if (savedMatchIds[person] === matchId) {
        console.log(`No new match for ${person}`);
        return;
    }

    savedMatchIds[person] = matchId;

    let personData = await getMatchInfo(matchId, puuid);

    if (personData) {

        let isNegativeVar = isNegative(personData, person);
        let wonGame = personData.win ? 'won' : 'lost';

        if (isNegativeVar) {
            sendMessage(`${person} just went negative and ${wonGame} a game! :astonished: `);
        }

    } else {
        console.log(`No data found for ${person}`);
    }
};
