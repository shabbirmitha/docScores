import DocStack from "@components/Stack";
import { Autocomplete, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { MatchView } from "./matchTypes";
import useTeamsData from "@features/Team/useTeamsData";
import useMatchesData from "./useMatchesData";

const TossSelection = () => {
  const matchId = new URLSearchParams(window.location.search).get("matchId");
  const { teams } = useTeamsData();
  const { match, tossSelection } = useMatchesData(matchId!);

  const teamAId = match?.teams[0] || null;
  const teamBId = match?.teams[1] || null;

  const teamA = teams?.find((t) => t._id === teamAId);
  const teamB = teams?.find((t) => t._id === teamBId);

  const [tossWinner, setTossWinner] = useState<string | null>(null);
  const [tossChoice, setTossChoice] = useState<MatchView.tossChoice | null>(null);

  const handleMatchStart = () => {
    if (matchId === null || tossWinner === null || tossChoice === null) return;
    tossSelection({ matchId, winner: tossWinner, electedTo: tossChoice });
  };

  return (
    <DocStack py={1} gap={1}>
      <DocStack flexDirection={"row"} alignItems={"center"}>
        <Typography style={{ flex: 1 }}>Toss</Typography>
        <Autocomplete
          style={{ flex: 1 }}
          value={tossWinner}
          onChange={(_, v) => v && setTossWinner(v)}
          getOptionLabel={(o) => (o === teamA?._id ? teamA?.name : teamB?.name) || ""}
          size="small"
          options={[teamA?._id, teamB?._id]}
          renderInput={(param) => <TextField {...param} />}
        />
      </DocStack>
      <DocStack flexDirection={"row"} alignItems={"center"}>
        <Typography style={{ flex: 1 }}>
          {teamA?._id === tossWinner ? teamA.name : teamB?.name} chooses to
        </Typography>
        <Autocomplete
          style={{ flex: 1 }}
          value={tossChoice}
          disabled={!tossWinner}
          onChange={(_, v) => v && setTossChoice(v)}
          size="small"
          options={Object.values(MatchView.tossChoice)}
          renderInput={(param) => <TextField {...param} />}
        />
      </DocStack>
      <DocStack flexDirection={"row"} alignItems={"center"}>
        <Button
          variant="contained"
          disabled={!(tossWinner && tossChoice)}
          onClick={handleMatchStart}
        >
          Start Match
        </Button>
      </DocStack>
    </DocStack>
  );
};
export default TossSelection;
