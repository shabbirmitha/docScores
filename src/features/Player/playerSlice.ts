import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum PLAYER_ROLE {
  BATSMAN = "batsman",
  BOWLER = "bowler",
  ALL_ROUNDER = "all-rounder",
  WICKET_KEEPER = "wicket-keeper",
}

export interface Player {
  id: string;
  name: string;
  role: PLAYER_ROLE;
}

interface PlayerState {
  players: Player[];
}

const initialState: PlayerState = {
  players: [],
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<Omit<Player, "id">>) => {
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        ...action.payload,
      };
      state.players.push(newPlayer);
    },
    removePlayer: (state, action: PayloadAction<Player["id"]>) => {
      state.players = state.players.filter((player) => player.id !== action.payload);
    },
  },
});

export const { addPlayer, removePlayer } = playerSlice.actions;
export default playerSlice.reducer;
