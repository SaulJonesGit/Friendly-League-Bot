import "dotenv/config";
import express from "express";
import {
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from "discord-interactions";
import { checkStatsForUser } from "./utils/league.js";
import { lolPlayers } from "./constants/leaguePlayers.js";
import { checkAllTFTStats } from "./utils/tftRankedGenerator.js";
// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// To keep track of our active games
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  async function (req, res) {
    // Interaction id, type and data
    const { id, type, data } = req.body;

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name } = data;
      const username =
        req.body.member?.nick || req.body.member?.user?.global_name;

      // "test" command
      if (name === "flirt") {
        // Send a message into the channel where command was triggered from
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: InteractionResponseFlags.IS_COMPONENTS_V2,
            components: [
              {
                type: MessageComponentTypes.TEXT_DISPLAY,
                // Fetches a random emoji to send from a helper function
                content: `what's that ${username}? You find me attractive? :blush:`,
              },
            ],
          },
        });
      }

      if (name === "coin-flip") {
        const outcome = Math.random() < 0.5 ? "heads" : "tails";
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `You flipped a coin and got **${outcome}**! :coin:`,
          },
        });
      }

      if (name === "tft-stats") {
        let leaderboard = await checkAllTFTStats();

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: leaderboard,
          },
        });
      }

      console.error(`unknown command: ${name}`);
      return res.status(400).json({ error: "unknown command" });
    }

    console.error("unknown interaction type", type);
    return res.status(400).json({ error: "unknown interaction type" });
  },
);

const MESSAGE_INTERVAL = 1 * 60 * 1000;

const checkStatsForAllUsers = () => {
  lolPlayers.forEach((person) => {
    checkStatsForUser(person);
  });
};

checkStatsForAllUsers();

setInterval(() => {
  checkStatsForAllUsers();
}, MESSAGE_INTERVAL);

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
