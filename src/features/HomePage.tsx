import DocStack from "@components/Stack";
import { Autocomplete, Button, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store";
import { useState } from "react";
import { createMatch, removeMatch } from "./match/matchSlice";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const teams = useAppSelector((store) => store.team.teams);
  const matches = useAppSelector((store) => store.match.matches);
  const teamIds = teams.map((t) => t.id);

  const [teamA, setTeamA] = useState<string | null>(null);
  const [teamB, setTeamB] = useState<string | null>(null);

  const handleMatchStart = () => {
    if (teamA !== null && teamB !== null) {
      const matchId = crypto.randomUUID();
      const matchTeams = [teamA, teamB];
      dispatch(createMatch({ id: matchId, teams: matchTeams }));
      navigate("/match?matchId=" + matchId);
    }
  };

  return (
    <DocStack py={1} gap={1}>
      <DocStack flexDirection={"row"} gap={1}>
        <Autocomplete
          fullWidth
          value={teamA}
          onChange={(_, v) => setTeamA(v)}
          options={teamIds.filter((t) => t !== teamB)}
          getOptionLabel={(o) => teams.find((t) => t.id === o)?.name || ""}
          renderInput={(param) => <TextField {...param} />}
        />
        <Autocomplete
          fullWidth
          value={teamB}
          onChange={(_, v) => setTeamB(v)}
          options={teamIds.filter((t) => t !== teamA)}
          getOptionLabel={(o) => teams.find((t) => t.id === o)?.name || ""}
          renderInput={(param) => <TextField {...param} />}
        />
      </DocStack>
      <Button variant="contained" onClick={handleMatchStart}>
        Start a Match
      </Button>

      {matches.length > 0 &&
        matches.map((match, index) => {
          const teamA = teams.find((t) => t.id === match.teams[0]);
          const teamB = teams.find((t) => t.id === match.teams[1]);
          return (
            <DocStack
              bgcolor={"primary.main"}
              flexDirection={"row"}
              justifyContent={"space-between"}
              p={1}
              borderRadius={2}
            >
              <DocStack color={"secondary.main"}>
                <Typography>#{index + 1}</Typography>
                <Typography>
                  {teamA?.name} Vs {teamB?.name}
                </Typography>
              </DocStack>

              <DocStack flexDirection={"row"} gap={1}>
                <Button color="secondary" onClick={() => dispatch(removeMatch(match.id))}>
                  Delete
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => navigate("/match?matchId=" + match.id)}
                >
                  View Match
                </Button>
              </DocStack>
            </DocStack>
          );
        })}
    </DocStack>
  );
};

export default HomePage;
