import { getTftRanks } from "../api/index.js";
import { tftPlayers } from "../constants/tftPlayers.js";
import { puuids } from "../constants/puuids/tftPuuid.js";

type TftRankData = {
  tier: string;
  rank: string;
  leaguePoints: number;
};

type TftLeaderboardEntry = {
  person: string;
  tier: string;
  rank: string;
  leaguePoints: number;
};

const rankOrder: string[] = [
  "CHALLENGER",
  "MASTER",
  "DIAMOND",
  "EMERALD",
  "PLATINUM",
  "GOLD",
  "SILVER",
  "BRONZE",
  "IRON",
];
const compareRanks = (
  a: TftLeaderboardEntry,
  b: TftLeaderboardEntry,
): number => {
  const tierDifference = rankOrder.indexOf(a.tier) - rankOrder.indexOf(b.tier);
  if (tierDifference !== 0) {
    return tierDifference;
  }
  const romanToInt = (roman: string): number => {
    const romanMap = { I: 1, II: 2, III: 3, IV: 4, V: 5 };
    return romanMap[roman.toUpperCase() as keyof typeof romanMap] || 0;
  };

  const rankDifference = romanToInt(a.rank) - romanToInt(b.rank);
  if (rankDifference !== 0) {
    return rankDifference;
  }
  return b.leaguePoints - a.leaguePoints;
};

export const checkAllTFTStats = async () => {
  const leaderboard: TftLeaderboardEntry[] = [];

  for (const person of tftPlayers) {
    const stats = await checkStatsForUser(person);
    if (stats) {
      leaderboard.push(stats);
    }
  }

  leaderboard.sort((a, b) => compareRanks(a, b));

  console.log("Leaderboard:");
  leaderboard.forEach((entry, index) => {
    console.log(
      `${index + 1}. ${entry.person}: ${entry.tier} ${entry.rank} ${entry.leaguePoints}`,
    );
  });

  let headerRow = `Today's TFT Rankings:\n`;

  let leaderboardMessage = leaderboard
    .map(
      (row, index) =>
        `${index + 1}. ${row.person} - ${row.tier} ${row.rank} (${row.leaguePoints} LP)`,
    )
    .join("\n");

  return headerRow + leaderboardMessage;
};

export const checkStatsForUser = async (
  person: string,
): Promise<TftLeaderboardEntry | undefined> => {
  const puuid = puuids.find((entry) => entry.name === person)?.puuid;

  if (!puuid) {
    console.error(`Person not found: ${person}`);
    return;
  }

  const tftData = (await getTftRanks(puuid)) as TftRankData | null | undefined;

  if (!tftData) {
    console.error(`No TFT data found for ${person}`);
    return;
  }

  console.log(
    `${person}'s TFT rank is: ${tftData.tier} ${tftData.rank} ${tftData.leaguePoints}`,
  );

  return {
    person,
    tier: tftData.tier,
    rank: tftData.rank,
    leaguePoints: tftData.leaguePoints,
  };
};
