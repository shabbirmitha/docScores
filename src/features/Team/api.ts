import { api } from "@api/index";
import { Team } from "./teamTypes";

export const getTeams = async () => {
  const response = await api.get<Team[]>("/team"); // assuming GET /players returns all players
  return response.data;
};
export const getTeam = async (id: string) => {
  const response = await api.get<Team>("/team/" + id); // assuming GET /players returns all players
  return response.data;
};
export const createTeam = async ({ team }: { team: Partial<Team> }) => {
  const response = await api.post("/team/create", { team: team });
  return response.data;
};
export const deleteTeam = async (id: string) => {
  const response = await api.delete("/team/" + id);
  return response.data;
};
