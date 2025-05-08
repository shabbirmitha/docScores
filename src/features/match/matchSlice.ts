import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "features/Player/playerSlice";
import { Team } from "features/Team/teamSlice";
import { matchData } from "./DUMMY_DATA";
import _ from "lodash";

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

  export interface Over {
    balls: CurrentBall[];
    bowlerId: Player["id"];
    ballsLeft: number;
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
    teams: Team["id"][];
    currentInnings: number;
    toss: Toss | null;
    status: MatchState;
    innings: Inning[];
  }
}

interface MatchState {
  matches: MatchView.Match[];
}

const initialState: MatchState = {
  matches: [],
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    createMatch: (
      state,
      action: PayloadAction<{ id: MatchView.Match["id"]; teams: MatchView.Match["teams"] }>
    ) => {
      const newMatch: MatchView.Match = {
        id: action.payload.id,
        teams: action.payload.teams,
        currentInnings: 0,
        toss: null,
        status: MatchView.MatchState.NOT_STARTED,
        innings: [],
      };
      state.matches.push(newMatch);
    },
    startMatch: (
      state,
      action: PayloadAction<{ matchId: MatchView.Match["id"]; toss: MatchView.Toss; teams: Team[] }>
    ) => {
      const match = state.matches.find((m) => m.id === action.payload.matchId);
      if (!match) return;

      const teamA = match.teams[0];
      const teamB = match.teams[1];
      const tossWinner = action.payload.toss.winner === teamA ? teamA : teamB;
      const tossLoser = action.payload.toss.winner === teamA ? teamB : teamA;

      const battingTeamId =
        action.payload.toss.electedTo === MatchView.tossChoice.BAT ? tossWinner : tossLoser;

      const battingTeam = {
        teamId: battingTeamId,
        players: action.payload.teams
          .find((team) => team.id === battingTeamId)!
          .playerIds.map((playerId) => ({
            playerId,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            strikeRate: 0,
            out: false,
            outReason: null,
            fielderId: null,
            bowledById: null,
          })),
      };

      const bowlingTeamId =
        action.payload.toss.electedTo === MatchView.tossChoice.BAT ? tossLoser : tossWinner;

      const bowlingTeam = {
        teamId: bowlingTeamId,
        players: action.payload.teams
          .find((team) => team.id === bowlingTeamId)!
          .playerIds.map((playerId) => ({
            playerId,
            ballBowled: 0,
            runsConceded: 0,
            wickets: 0,
            economy: 0,
          })),
      };

      const Inning: MatchView.Inning = {
        battingTeam: battingTeam,
        bowlingTeam: bowlingTeam,
        overs: [{ balls: [], bowlerId: "", ballsLeft: 6 }],
        runs: 0,
        wickets: 0,
        extras: {
          wides: 0,
          noBalls: 0,
          byes: 0,
          legByes: 0,
        },
        currentRunRate: 0,

        strikerId: "",
        nonStrikerId: "",
      };

      if (match) {
        match.toss = action.payload.toss;
        match.status = MatchView.MatchState.IN_PROGRESS;
        match.currentInnings = 0;
        match.innings.push(Inning);
      }
    },
    addBall: (
      state,
      action: PayloadAction<{
        matchId: MatchView.Match["id"];
        ball: MatchView.CurrentBall;
        outOnEnd: "strikerId" | "nonStrikerId";
      }>
    ) => {
      const { matchId, ball, outOnEnd } = action.payload;
      const match = state.matches.find((m) => m.id === matchId);
      if (!match) return;

      const innings = match.innings[match.currentInnings];
      if (!innings) return;

      // Append ball to overs
      const lastOver = innings.overs[innings.overs.length - 1];

      const bowler = innings.bowlingTeam.players.find((p) => p.playerId === lastOver.bowlerId);
      if (!bowler) return;

      if (outOnEnd && ball.isWicket) {
        markPlayerOut(innings, outOnEnd, ball.wicketType, ball.fielderId, lastOver.bowlerId);
      }
      lastOver.balls.push(ball);
      lastOver.ballsLeft -= 1;

      // Update match score
      innings.runs += ball.runs;
      if (ball.isWicket) innings.wickets += 1;

      // Update extras
      if (ball.isExtra && ball.extraType) {
        if ([MatchView.ExtraType.WIDES, MatchView.ExtraType.NO_BALLS].includes(ball.extraType)) {
          lastOver.ballsLeft += 1;
          bowler.ballBowled -= 1;
        }

        switch (ball.extraType) {
          case MatchView.ExtraType.WIDES:
            innings.extras.wides += ball.extraRuns;
            break;
          case MatchView.ExtraType.NO_BALLS:
            innings.extras.noBalls += ball.extraRuns;
            break;
          case MatchView.ExtraType.BYES:
            innings.extras.byes += ball.extraRuns;
            break;
          case MatchView.ExtraType.LEG_BYES:
            innings.extras.legByes += ball.extraRuns;
            break;
        }
      }

      // Track Bowler

      bowler.runsConceded += ball.runs;
      if (ball.isWicket) {
        bowler.wickets += 1;
      }
      bowler.ballBowled += 1;

      bowler.economy = Number((bowler.runsConceded / (bowler.ballBowled / 6)).toFixed(2));

      // batmans
      const batsman = innings.battingTeam.players.find((p) => p.playerId === innings.strikerId);
      if (batsman) {
        const runs = ball.runs - ball.extraRuns;
        batsman.runs += runs;
        batsman.balls += ball.isExtra ? 0 : 1;

        if (ball.runs === 4) {
          batsman.fours += 1;
        }
        if (ball.runs === 6) {
          batsman.sixes += 1;
        }
        batsman.strikeRate = Number(((batsman.runs / batsman.balls) * 100).toFixed(2));
      }

      //  Track Striker and Non-Striker
      const runsRan = ball.isExtra ? ball.runs - ball.extraRuns : ball.runs;
      if (runsRan % 2 === 1) {
        [innings.strikerId, innings.nonStrikerId] = [innings.nonStrikerId, innings.strikerId];
      }

      // Recalculate run rate
      const totalBalls = innings.overs.reduce((sum, over) => sum + (6 - over.ballsLeft), 0);
      innings.currentRunRate = +(innings.runs / (totalBalls / 6)).toFixed(2);

      if (lastOver.ballsLeft === 0) {
        const newOver: MatchView.Over = {
          balls: [],
          bowlerId: "",
          ballsLeft: 6,
        };
        innings.overs.push(newOver);
        [innings.strikerId, innings.nonStrikerId] = [innings.nonStrikerId, innings.strikerId];
      }
    },
    newPlayersInAction: (
      state,
      action: PayloadAction<{
        matchId: MatchView.Match["id"];
        bowlerId?: Player["id"];
        strikerId?: Player["id"];
        nonStrikerId?: Player["id"];
      }>
    ) => {
      const match = state.matches.find((m) => m.id === action.payload.matchId);
      if (!match) return;
      const innings = match.innings[match.currentInnings];
      if (!innings) return;

      const lastOver = innings.overs[innings.overs.length - 1];

      lastOver.bowlerId = action.payload.bowlerId ? action.payload.bowlerId : lastOver.bowlerId;

      innings.strikerId = action.payload.strikerId ? action.payload.strikerId : innings.strikerId;
      innings.nonStrikerId = action.payload.nonStrikerId
        ? action.payload.nonStrikerId
        : innings.nonStrikerId;
    },
    playerOut: (
      state,
      action: PayloadAction<{
        matchId: MatchView.Match["id"];
        end: "strikerId" | "nonStrikerId";
        outReason: MatchView.WicketType | null;
        fielderId?: Player["id"] | null;
        bowledById?: Player["id"] | null;
      }>
    ) => {
      const { matchId, end, outReason, fielderId, bowledById } = action.payload;
      const match = state.matches.find((m) => m.id === matchId);
      if (!match) return;
      const innings = match.innings[match.currentInnings];
      if (!innings) return;

      markPlayerOut(innings, end, outReason, fielderId, bowledById);
    },
    removeMatch: (state, action: PayloadAction<string>) => {
      const matchIdToRemove = action.payload;
      state.matches = state.matches.filter((match) => match.id !== matchIdToRemove);
    },
    devPatch: (state, action: PayloadAction<{ path: string; value: any }>) => {
      _.set(state, action.payload.path, action.payload.value);
    },
  },
});

export const { createMatch, startMatch, addBall, newPlayersInAction, playerOut, removeMatch } =
  matchSlice.actions;
export default matchSlice.reducer;

const markPlayerOut = (
  innings: MatchView.Inning,
  end: "strikerId" | "nonStrikerId",
  outReason: MatchView.WicketType | null,
  fielderId?: Player["id"] | null,
  bowledById?: Player["id"] | null
) => {
  const playerId = innings[end];
  const player = innings.battingTeam.players.find((p) => p.playerId === playerId);
  if (player) {
    player.out = true;
    player.outReason = outReason;
    player.fielderId = fielderId || null;
    player.bowledById = bowledById || null;
  }
  innings[end] = undefined;
};
