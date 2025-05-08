import DocStack from "@components/Stack";
import { useAppSelector } from "../../store";
import { MatchView as MatchViewType } from "./matchSlice";
import TossSelection from "./TossSelection";
import MatchPlay from "./matchPlay";

const MatchView = () => {
  const matchId = new URLSearchParams(window.location.search).get("matchId");
  const matches = useAppSelector((state) => state.match.matches);

  const match = matches.find((m) => m.id === matchId);
  return (
    <DocStack py={1} gap={1}>
      {match?.status === MatchViewType.MatchState.NOT_STARTED && <TossSelection />}
      {match?.status === MatchViewType.MatchState.IN_PROGRESS && <MatchPlay />}
    </DocStack>
  );
};
export default MatchView;
