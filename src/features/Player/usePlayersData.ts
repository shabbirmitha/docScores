import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createPlayer, deletePlayer, getPlayers } from "./api";
import { PLAYER_ROLE } from "./playerTypes";

const usePlayersData = () => {
  const queryClient = useQueryClient();
  const {
    data: players,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
    staleTime: 15 * 60 * 1000,
  });

  const addPlayer = async (playerData: { name: string; role: PLAYER_ROLE }) => {
    const data = await createPlayer({ player: playerData });
    queryClient.setQueryData(["players"], [...(players ?? []), data]);
  };

  const removePlayer = async (id: string) => {
    await deletePlayer(id);
    queryClient.setQueryData(
      ["players"],
      players?.filter((p) => p._id !== id)
    );
  };

  return {
    players,
    isLoading,
    isError,
    error,
    addPlayer,
    removePlayer,
  };
};

export default usePlayersData;
