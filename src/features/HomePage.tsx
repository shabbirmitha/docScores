import DocStack from "@components/Stack";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useMatchesData from "./ Match/useMatchesData";
import useTeamsData from "./Team/useTeamsData";

const HomePage = () => {
  const navigate = useNavigate();

  const { matches, isError, isLoading, error, removeMatch } = useMatchesData();
  const { teams } = useTeamsData();

  if (isLoading) return <DocStack>Loading matches...</DocStack>;
  if (isError) return <DocStack>Error fetching matches: {(error as Error).message}</DocStack>;

  return (
    <DocStack py={1} gap={1}>
      <Typography variant="h5">Matches</Typography>
      {matches?.map((match, index) => {
        const teamA = teams?.find((t) => t._id === match.teams[0]);
        const teamB = teams?.find((t) => t._id === match.teams[1]);
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
              <Button color="secondary" onClick={() => removeMatch(match._id)}>
                Delete
              </Button>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => navigate("/match?matchId=" + match._id)}
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
