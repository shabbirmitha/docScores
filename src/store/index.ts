import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import playerReducer from "../features/Player/playerSlice";
import teamReducer from "../features/Team/teamSlice";
import matchReducer from "../features/match/matchSlice";
import { loadState, saveState } from "@utils/localStorage";

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    player: playerReducer,
    team: teamReducer,
    match: matchReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState({
    match: store.getState().match,
    player: store.getState().player,
    team: store.getState().team,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
