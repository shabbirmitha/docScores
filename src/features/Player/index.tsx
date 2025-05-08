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
import { removePlayer } from "./playerSlice";

const PlayerList = () => {
  const players = useSelector((state: RootState) => state.player.players);

  const dispatch = useAppDispatch();

  return (
    <DocStack gap={1} py={1}>
      <TableContainer style={{ border: "1px solid lightgray", borderRadius: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.role}</TableCell>
                <TableCell>
                  <Button disabled>Edit</Button>
                  <Button onClick={() => dispatch(removePlayer(player.id))}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        style={{ position: "sticky", bottom: 0 }}
        component={Link}
        to="/player/new"
      >
        Add Player
      </Button>
    </DocStack>
  );
};
export default PlayerList;
