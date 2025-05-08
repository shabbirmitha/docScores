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
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState, useAppDispatch } from "../../store/index";
import { removeTeam } from "./teamSlice";

const TeamsList = () => {
  const teams = useSelector((state: RootState) => state.team.teams);
  const players = useSelector((state: RootState) => state.player.players);

  const dispatch = useAppDispatch();

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
            {teams.map((team) => {
              const captain = players.find((player) => player.id === team.captainId)?.name;
              return (
                <TableRow key={team.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{captain}</TableCell>
                  <TableCell>
                    <Button disabled>Edit</Button>
                    <Button onClick={() => dispatch(removeTeam(team.id))}>Remove</Button>
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
