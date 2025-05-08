import DocStack from "@components/Stack";
import { Autocomplete, Button, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store";
import { useState } from "react";
import { MatchView, startMatch } from "./matchSlice";

const TossSelection = () => {
  const dispatch = useAppDispatch();
  const matchId = new URLSearchParams(window.location.search).get("matchId");
  const matches = useAppSelector((state) => state.match.matches);
  const teams = useAppSelector((state) => state.team.teams);

  const match = matches.find((m) => m.id === matchId);
  const teamAId = match?.teams[0] || null;
  const teamBId = match?.teams[1] || null;

  const teamA = teams.find((t) => t.id === teamAId);
  const teamB = teams.find((t) => t.id === teamBId);

  const [tossWinner, setTossWinner] = useState<string | null>(null);
  const [tossChoice, setTossChoice] = useState<MatchView.tossChoice | null>(null);

  const handleMatchStart = () => {
    if (matchId === null || tossWinner === null || tossChoice === null) return;

    dispatch(
      startMatch({
        matchId,
        teams,
        toss: { winner: tossWinner, electedTo: tossChoice },
      })
    );
  };

  return (
    <DocStack py={1} gap={1}>
      <DocStack flexDirection={"row"} alignItems={"center"}>
        <Typography style={{ flex: 1 }}>Toss</Typography>
        <Autocomplete
          style={{ flex: 1 }}
          value={tossWinner}
          onChange={(_, v) => v && setTossWinner(v)}
          getOptionLabel={(o) => (o === teamA?.id ? teamA?.name : teamB?.name) || ""}
          size="small"
          options={[teamA?.id, teamB?.id]}
          renderInput={(param) => <TextField {...param} />}
        />
      </DocStack>
      <DocStack flexDirection={"row"} alignItems={"center"}>
        <Typography style={{ flex: 1 }}>
          {teamA?.id === tossWinner ? teamA.name : teamB?.name} chooses to
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
