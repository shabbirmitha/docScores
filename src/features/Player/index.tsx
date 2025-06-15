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
import usePlayersData from "./usePlayersData";

const PlayerList = () => {
  const { players, isLoading, isError, error, removePlayer } = usePlayersData();

  if (isLoading) return <DocStack>Loading players...</DocStack>;
  if (isError) return <DocStack>Error fetching players: {(error as Error).message}</DocStack>;

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
            {players?.map((player) => (
              <TableRow key={player._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.role}</TableCell>
                <TableCell>
                  {/* <Button disabled>Edit</Button> */}
                  <Button onClick={() => removePlayer(player._id)}>Remove</Button>
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
