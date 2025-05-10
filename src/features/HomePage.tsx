import DocStack from "@components/Stack";
import { Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store";
import { removeMatch } from "./match/matchSlice";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const teams = useAppSelector((store) => store.team.teams);
  const matches = useAppSelector((store) => store.match.matches);

  return (
    <DocStack py={1} gap={1}>
      <Typography variant="h5">Matches</Typography>
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
