import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../Player/playerSlice";
import { Teams } from "./DUMMY_DATA";

export interface Team {
  id: string;
  name: string;
  playerIds: Player["id"][];
  captainId: Player["id"];
}

interface TeamState {
  teams: Team[];
}

const initialState: TeamState = {
  teams: [],
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    addTeam: (state, action: PayloadAction<Omit<Team, "id">>) => {
      const newTeam: Team = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        playerIds: action.payload.playerIds,
        captainId: action.payload.captainId,
      };
      state.teams.push(newTeam);
    },
    removeTeam: (state, action: PayloadAction<Team["id"]>) => {
      state.teams = state.teams.filter((team) => team.id !== action.payload);
    },
    addPlayerToTeam: (
      state,
      action: PayloadAction<{ teamId: Team["id"]; playerId: Player["id"] }>
    ) => {
      const team = state.teams.find((t) => t.id === action.payload.teamId);
      if (team && !team.playerIds.includes(action.payload.playerId)) {
        team.playerIds.push(action.payload.playerId);
      }
    },
    removePlayerFromTeam: (
      state,
      action: PayloadAction<{ teamId: Team["id"]; playerId: Player["id"] }>
    ) => {
      const team = state.teams.find((t) => t.id === action.payload.teamId);
      if (team) {
        team.playerIds = team.playerIds.filter((id) => id !== action.payload.playerId);
      }
    },
  },
});

export const { addTeam, removeTeam, addPlayerToTeam, removePlayerFromTeam } = teamSlice.actions;
export default teamSlice.reducer;
