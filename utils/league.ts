import "dotenv/config";
import { DiscordRequest } from "./discordUtils.js";
import { isNegative } from "../helpers/isNegative.js";
import { getMatches, getMatchInfo } from "../api/index.js";
import { puuids } from "../constants/puuids/leaguePuuid.js";

const BOT_TOKEN = process.env.DISCORD_TOKEN;

const savedMatchIds: Record<string, string> = {};

function sendMessage(content: string): void {
  void DiscordRequest(`/channels/479579787589845001/messages`, {
    method: "POST",
    body: {
      content,
    },
    token: BOT_TOKEN,
  });
}

// Function to check stats for a specific user
export const checkStatsForUser = async (person: string): Promise<void> => {
  const puuid = puuids.find((entry) => entry.name === person)?.puuid;

  if (!puuid) {
    console.error(`Person not found: ${person}`);
    return;
  }

  const matchId = await getMatches(puuid);

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

  const personData = await getMatchInfo(matchId, puuid);

  if (personData) {
    const isNegativeVar = isNegative(personData, person);
    const wonGame = personData.win ? "won" : "lost";

    if (isNegativeVar) {
      sendMessage(
        `${person} just went negative and ${wonGame} a game! :astonished: `,
      );
    }
  } else {
    console.log(`No data found for ${person}`);
  }
};
