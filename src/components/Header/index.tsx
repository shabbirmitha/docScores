import React from "react";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom"; // For routing
import DocStack from "@components/Stack";

const Header: React.FC = () => {
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
      <DocStack flexDirection={"row"}>
        <Button component={Link} to="/">
          Home
        </Button>
        <Button component={Link} to="/teams">
          Teams
        </Button>
        <Button component={Link} to="/players">
          Players
        </Button>
      </DocStack>
    </DocStack>
  );
};

export default Header;
