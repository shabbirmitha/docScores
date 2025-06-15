import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createTeam, deleteTeam, getTeams } from "./api";
import { Team } from "./teamTypes";
// import { PLAYER_ROLE } from "./playerSlice";

const useTeamsData = () => {
  const queryClient = useQueryClient();
  const {
    data: teams,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
    staleTime: 15 * 60 * 1000,
  });

  const addTeam = async (teamData: Partial<Team>) => {
    const data = await createTeam({ team: teamData });
    queryClient.setQueryData(["teams"], [...(teams ?? []), data]);
  };

  const removeTeam = async (id: string) => {
    await deleteTeam(id);
    queryClient.setQueryData(
      ["teams"],
      teams?.filter((t) => t._id !== id)
    );
  };

  return {
    teams,
    isLoading,
    isError,
    error,
    addTeam,
    removeTeam,
  };
};

export default useTeamsData;
