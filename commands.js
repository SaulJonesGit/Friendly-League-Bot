import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Simple test command
const FLIRT_COMMAND = {
  name: 'flirt',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Simple test command
const COIN_FLIP_COMMAND = {
  name: 'coin-flip',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Command containing options


const ALL_COMMANDS = [FLIRT_COMMAND, COIN_FLIP_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
