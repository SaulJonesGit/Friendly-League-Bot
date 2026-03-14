import { GET_PUUID_ENDPOINT } from "../constants/endpoints.js";
import { lolPlayers } from "../constants/leaguePlayers.js";
import { tftPlayers } from "../constants/tftPlayers.js";
import axios from "axios";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runGenerateIDs(): Promise<void> {
  await Promise.all([
    generateIDs(
      process.env.LEAGUE_API_KEY,
      lolPlayers,
      "../constants/puuids/leaguePuuid.ts",
    ),
    generateIDs(
      process.env.TFT_API_KEY,
      tftPlayers,
      "../constants/puuids/tftPuuid.ts",
    ),
  ]);
}

async function generateIDs(
  apiKey: string | undefined,
  usernames: string[],
  puuidFilePath: string,
): Promise<void> {
  if (!apiKey) {
    throw new Error("Missing Riot API key for PUUID generation.");
  }

  const puuidArray: Array<{ name: string; puuid: string }> = [];

  for (const username of usernames) {
    const [name, tag] = username.split("#");

    if (!name || !tag) {
      console.warn(`Skipping invalid Riot ID: ${username}`);
      continue;
    }

    let urlWithParams =
      (process.env.BASE_PATH ?? "") +
      GET_PUUID_ENDPOINT.replace("{gameName}", name).replace("{tagLine}", tag);

    urlWithParams = urlWithParams.concat(`?api_key=${apiKey}`);

    const response = await axios.get<any>(urlWithParams);

    if (response.status !== 200 || !response.data.puuid) {
      console.log(
        `Error fetching puuid for ${name}#${tag}:`,
        response.statusText,
      );
      return;
    }

    puuidArray.push({
      name: `${name}#${tag}`,
      puuid: response.data.puuid as string,
    });
  }

  if (puuidArray.length === 0) {
    console.error("No puuids");
    return;
  }

  const puuidFile = path.resolve(__dirname, puuidFilePath);
  const fileContent = [
    "export type PlayerPuuid = {",
    "  name: string;",
    "  puuid: string;",
    "};",
    "",
    `export const puuids: PlayerPuuid[] = ${JSON.stringify(puuidArray, null, 2)};`,
    "",
  ].join("\n");

  fs.writeFileSync(puuidFile, fileContent, "utf8");
  console.log(`Saved ${puuidArray.length} puuids to ${puuidFile}`);
}
