export type GetTftRanksResponse = {
  puuid: string;
  leagueId?: string;
  queueType: string;
  ratedTier?: "ORANGE" | "PURPLE" | "BLUE" | "GREEN" | "GRAY";
  ratedRating?: number;
  tier?: string;
  rank?: string;
  leaguePoints?: number;
  wins: number;
  losses: number;
  hotStreak?: boolean;
  veteran?: boolean;
  freshBlood?: boolean;
  inactive?: boolean;
  miniSeries?: MiniSeriesDTO;
}[];

type MiniSeriesDTO = {
  losses: number;
  progress: string;
  target: number;
  wins: number;
};
