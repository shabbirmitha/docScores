export enum PLAYER_ROLE {
  BATSMAN = "batsman",
  BOWLER = "bowler",
  ALL_ROUNDER = "all-rounder",
  WICKET_KEEPER = "wicket-keeper",
}

export interface Player {
  id: string;
  _id: string;
  name: string;
  role: PLAYER_ROLE;
}
