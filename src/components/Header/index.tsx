import React, { useState } from "react";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom"; // For routing
import DocStack from "@components/Stack";
import CreateMatchModal from "@features/match/components/CreateMatchModal";

const Header: React.FC = () => {
  const [openCreateModal, setOpenCreateModel] = useState(false);

  const handleOpen = () => setOpenCreateModel(true);
  const handleClose = () => setOpenCreateModel(false);
  return (
    <DocStack
      style={{
        backgroundColor: "#DFD0B8",
        color: "#222831",
        borderRadius: 5,
        padding: 8,
        alignItems: "center",
        justifyContent: "space-between",
      }}
      flexDirection={"row"}
    >
      <Typography variant="h6">DocScores</Typography>
      <DocStack flexDirection={"row"} gap={1}>
        <Button component={Link} to="/">
          Home
        </Button>
        <Button component={Link} to="/teams">
          Teams
        </Button>
        <Button component={Link} to="/players">
          Players
        </Button>
        <Button variant="contained" onClick={handleOpen}>
          Create Match
        </Button>
      </DocStack>

      <CreateMatchModal open={openCreateModal} onClose={handleClose} />
    </DocStack>
  );
};

export default Header;
