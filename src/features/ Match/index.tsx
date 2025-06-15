import DocStack from "@components/Stack";
import { MatchView as MatchViewType } from "./matchTypes";
import TossSelection from "./TossSelection";
import MatchPlay from "./matchPlay";
import useMatchesData from "./useMatchesData";

const MatchView = () => {
  const matchId = new URLSearchParams(window.location.search).get("matchId");
  const { match } = useMatchesData(matchId!);

  return (
    <DocStack py={1} gap={1}>
      {match?.status === MatchViewType.MatchState.NOT_STARTED && <TossSelection />}
      {(match?.status === MatchViewType.MatchState.IN_PROGRESS ||
        match?.status === MatchViewType.MatchState.COMPLETED) && <MatchPlay />}
    </DocStack>
  );
};
export default MatchView;
