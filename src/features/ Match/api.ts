import { api } from "@api/index";
import { MatchView } from "./matchTypes";

export const getMatches = async () => {
  const response = await api.get<MatchView.Match[]>("/match");
  return response.data;
};
export const getMatch = async (id: string) => {
  const response = await api.get<MatchView.Match>("/match/" + id);
  return response.data;
};
export const createMatch = async ({ teams, type }: { teams: string[]; type: string }) => {
  return await api.post("/match/create", { match: { teams, type } });
};
export const updateMatch = async ({
  data,
  matchId,
}: {
  data: Partial<MatchView.Match>;
  matchId: string;
}) => {
  return await api.post("/match/" + matchId, { match: data });
};
export const startMatch = async ({
  winner,
  electedTo,
  matchId,
}: {
  winner: string;
  electedTo: string;
  matchId: string;
}) => {
  return await api.post("/match/start/" + matchId, { toss: { winner, electedTo } });
};
export const deleteMatch = async (id: string) => {
  return await api.delete("/match/" + id);
};

export const updateStrikers = async ({
  matchId,
  inningId,
  strikers,
}: {
  matchId: string;
  inningId: string;
  strikers: {
    strikerId?: string;
    nonStrikerId?: string;
  };
}) => {
  return api.patch(`/match/${matchId}/innings/${inningId}/strikers`, { strikers });
};

export const addOversToInning = async ({
  matchId,
  inningId,
  bowlerId,
}: {
  matchId: string;
  inningId: string;
  bowlerId: string;
}) => {
  return api.patch(`/match/${matchId}/innings/${inningId}/overs`, { bowlerId });
};

export const addBall = async ({
  matchId,
  inningId,
  overId,
  data,
}: {
  matchId: string;
  inningId: string;
  overId: string;
  data: {
    runs: number;
    isWicket: boolean;
    isExtra: boolean;
    wicketType: string | null;
    fielderId: string | null;
    extraType: string | null;
    extraRuns?: number;
    outOnEnd?: string;
  };
}) => {
  return api.post(`/match/${matchId}/innings/${inningId}/overs/${overId}/ball`, { ...data });
};
