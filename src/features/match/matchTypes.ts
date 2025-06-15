import { Player } from "@features/Player/playerTypes";
import { Team } from "features/Team/teamSlice";

export namespace MatchView {
  export enum WicketType {
    BOWLED = "bowled",
    LBW = "lbw",
    CAUGHT = "caught",
    RUN_OUT = "run_out",
    STUMPED = "stumped",
    HIT_WICKET = "hit_wicket",
    RETIRED_HURT = "retired_hurt",
    RETIRED_OUT = "retired_out",
    OBSTRUCTING_FIELD = "obstructing_field",
  }
  export enum MatchState {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
  }

  export enum tossChoice {
    BAT = "bat",
    BOWL = "bowl",
  }
  export enum ExtraType {
    WIDES = "wides",
    NO_BALLS = "no_balls",
    BYES = "byes",
    LEG_BYES = "leg_byes",
  }

  export enum OVERS {
    TEN = 10,
    TWENTY = 20,
    FIFTY = 50,
    UNLIMITED = 1 / 0,
  }

  export enum MatchType {
    T10 = "t10",
    T20 = "t20",
    ONE_DAY = "one-day",
    TEST = "test",
  }

  export interface Over {
    balls: CurrentBall[];
    bowlerId: Player["id"];
    ballsLeft: number;
    _id: string;
  }

  export interface BattingPlayer {
    playerId: Player["id"];
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    out: boolean;
    outReason: WicketType | null;
    fielderId: Player["id"] | null;
    bowledById: Player["id"] | null;
  }
  export interface BowlingPlayer {
    playerId: Player["id"];
    ballBowled: number;
    runsConceded: number;
    wickets: number;
    economy: number;
  }

  export interface BattingTeam {
    teamId: Team["id"];
    players: BattingPlayer[];
  }
  export interface BowlingTeam {
    teamId: Team["id"];
    players: BowlingPlayer[];
  }
  export interface Inning {
    _id: string;
    battingTeam: BattingTeam;
    bowlingTeam: BowlingTeam;
    overs: Over[];
    runs: number;
    wickets: number;
    extras: {
      wides: number;
      noBalls: number;
      byes: number;
      legByes: number;
    };
    currentRunRate: number;
    requiredRunRate?: number;
    target?: number;
    ballsLeft?: number;
    requiredRuns?: number;

    strikerId?: Player["id"];
    nonStrikerId?: Player["id"];
  }

  export interface CurrentBall {
    runs: number;
    isWicket: boolean;
    wicketType: WicketType | null;
    fielderId: Player["id"] | null;
    isExtra: boolean;
    extraType: ExtraType | null;
    extraRuns: number;
  }

  export interface Toss {
    winner: Team["id"];
    electedTo: tossChoice;
  }

  export interface Match {
    id: string;
    _id: string;
    teams: Team["id"][];
    currentInnings: number;
    toss: Toss | null;
    status: MatchState;
    innings: Inning[];
    type: MatchType;
    maxOvers: OVERS;
    winner: Team["id"] | null;
  }
}

export const MatchToOversMap = {
  [MatchView.MatchType.T10]: MatchView.OVERS.TEN,
  [MatchView.MatchType.T20]: MatchView.OVERS.TWENTY,
  [MatchView.MatchType.ONE_DAY]: MatchView.OVERS.FIFTY,
  [MatchView.MatchType.TEST]: MatchView.OVERS.UNLIMITED,
};
