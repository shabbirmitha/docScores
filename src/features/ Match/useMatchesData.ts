import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMatch,
  getMatch,
  getMatches,
  createMatch,
  startMatch,
  updateStrikers as updateStrikersApi,
  addOversToInning as addOversToInningApi,
  addBall as addBallApi,
} from "./api";

const useMatchesData = (id?: string) => {
  const queryClient = useQueryClient();
  const {
    data: matches,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["matches"],
    queryFn: getMatches,
    staleTime: 15 * 60 * 1000,
  });
  const { data: match } = useQuery({
    queryKey: ["match", id],
    queryFn: () => getMatch(id || ""),
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });

  const addMatch = async (data: { teams: string[]; type: string }) => {
    const response = await createMatch(data);
    if (response.status === 200)
      queryClient.setQueryData(["matches"], [...(matches || []), response.data]);
  };

  const tossSelection = async (data: { winner: string; electedTo: string; matchId: string }) => {
    const response = await startMatch(data);
    if (response.status === 200)
      queryClient.invalidateQueries({
        queryKey: ["match", data.matchId],
      });
    return response.data;
  };

  const removeMatch = async (id: string) => {
    const response = await deleteMatch(id);
    if (response.status === 200)
      queryClient.setQueryData(
        ["matches"],
        matches?.filter((m) => m._id !== id)
      );
  };
  const updateStrikers = async ({
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
    const response = await updateStrikersApi({ matchId, inningId, strikers });
    if (response.status === 200) {
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
    }
  };

  const addOversToInning = async ({
    matchId,
    inningId,
    bowlerId,
  }: {
    matchId: string;
    inningId: string;
    bowlerId: string;
  }) => {
    const response = await addOversToInningApi({ matchId, inningId, bowlerId });
    if (response.status === 200) {
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
    }
  };
  const addBall = async ({
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
    const response = await addBallApi({ matchId, inningId, overId, data });
    if (response.status === 200) {
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
    }
  };

  return {
    matches,
    match,
    isError,
    isLoading,
    error,
    removeMatch,
    addMatch,
    tossSelection,
    updateStrikers,
    addOversToInning,
    addBall,
  };
};
export default useMatchesData;
