import DocStack from "@components/Stack";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link } from "react-router-dom";
import useTeamsData from "./useTeamsData";
import usePlayersData from "@features/Player/usePlayersData";

const TeamsList = () => {
  const { teams, isLoading, isError, error, removeTeam } = useTeamsData();

  const { players } = usePlayersData();

  if (isLoading) return <DocStack>Loading teams...</DocStack>;
  if (isError) return <DocStack>Error fetching teams: {(error as Error).message}</DocStack>;

  return (
    <DocStack gap={1} py={1}>
      <TableContainer style={{ border: "1px solid lightgray", borderRadius: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Captain</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams?.map((team) => {
              const captain = players?.find((player) => player._id === team.captainId)?.name;
              return (
                <TableRow key={team.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{captain}</TableCell>
                  <TableCell>
                    {/* <Button disabled>Edit</Button> */}
                    <Button onClick={() => removeTeam(team._id)}>Remove</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" component={Link} to="/team/new">
        Add Team
      </Button>
    </DocStack>
  );
};
export default TeamsList;
