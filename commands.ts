import 'dotenv/config';
import { InstallGlobalCommands } from './utils/discordUtils.js';

type DiscordCommand = {
  name: string;
  description: string;
  type: number;
  integration_types: number[];
  contexts: number[];
};

// Simple test command
const FLIRT_COMMAND: DiscordCommand = {
  name: 'flirt',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Simple test command
const COIN_FLIP_COMMAND: DiscordCommand = {
  name: 'coin-flip',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const TFT_STATS_COMMAND: DiscordCommand = {
  name: 'tft-stats',
  description: 'Check TFT stats for all users',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Command containing options


const ALL_COMMANDS: DiscordCommand[] = [FLIRT_COMMAND, COIN_FLIP_COMMAND, TFT_STATS_COMMAND];

void InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
