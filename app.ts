import "dotenv/config";
import express from "express";
import {
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from "discord-interactions";
import { Client, GatewayIntentBits } from "discord.js";
import { checkStatsForUser } from "./utils/league.js";
import { lolPlayers } from "./constants/leaguePlayers.js";
import { checkAllTFTStats } from "./utils/tftRankedGenerator.js";
import { SetAppStatus } from "./utils/discordUtils.js";

type DiscordInteractionRequest = {
  type?: number;
  data?: {
    name?: string;
  };
  member?: {
    nick?: string;
    user?: {
      global_name?: string;
    };
  };
};
// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
const publicKey = process.env.PUBLIC_KEY ?? "";

const gatewayClient = new Client({
  intents: [GatewayIntentBits.Guilds],
});

gatewayClient.once("clientReady", async () => {
  try {
    await SetAppStatus(gatewayClient, "online", "Practicing improv");
    console.log(
      `Set bot status to online as ${gatewayClient.user?.tag ?? "unknown"}`,
    );
  } catch (error) {
    console.error("Failed to set bot status", error);
  }
});

if (!process.env.DISCORD_TOKEN) {
  console.warn(
    "DISCORD_TOKEN is not set; Gateway status updates are disabled.",
  );
} else {
  void gatewayClient.login(process.env.DISCORD_TOKEN).catch((error) => {
    console.error("Failed to connect Discord Gateway", error);
  });
}

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post(
  "/interactions",
  verifyKeyMiddleware(publicKey),
  async function (req: any, res: any) {
    // Interaction id, type and data
    const body = (req.body ?? {}) as DiscordInteractionRequest;
    const { type, data } = body;

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
      const name = data?.name;
      const username =
        body.member?.nick || body.member?.user?.global_name || "there";

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

const checkStatsForAllUsers = (): void => {
  lolPlayers.forEach((person) => {
    void checkStatsForUser(person);
  });
};

checkStatsForAllUsers();

const statsInterval = setInterval(() => {
  checkStatsForAllUsers();
}, MESSAGE_INTERVAL);

const server = app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

let isShuttingDown = false;

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;

  console.log(`Received ${signal}, shutting down...`);
  clearInterval(statsInterval);

  try {
    if (gatewayClient.isReady()) {
      await SetAppStatus(gatewayClient, "invisible");
      console.log("Set bot status to invisible before shutdown.");
    }
  } catch (error) {
    console.error("Failed to set shutdown status", error);
  }

  try {
    gatewayClient.destroy();
  } catch (error) {
    console.error("Failed to close Discord Gateway client", error);
  }

  server.close(() => {
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(1);
  }, 5000).unref();
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
