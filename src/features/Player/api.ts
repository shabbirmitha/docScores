// src/services/player.ts
import { api } from "@api/index";
import { Player, PLAYER_ROLE } from "./playerTypes";

export const getPlayers = async () => {
  const response = await api.get<Player[]>("/player"); // assuming GET /players returns all players
  return response.data;
};
export const getPlayer = async (id: string) => {
  const response = await api.get<Player>("/player/" + id); // assuming GET /players returns all players
  return response.data;
};
export const createPlayer = async ({ player }: { player: { name: string; role: PLAYER_ROLE } }) => {
  const response = await api.post<Player>("/player/create", { player: player });
  return response.data;
};
export const deletePlayer = async (id: string) => {
  const response = await api.delete("/player/" + id);
  return response.data;
};
