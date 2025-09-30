import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BlockIcon from "@mui/icons-material/Block";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <BlockIcon sx={{ fontSize: 100, color: "error.main", mb: 2 }} />
        <Typography component="h1" variant="h4" gutterBottom>
          D!H!5*44L@I26
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          8D!H!5*44L@I26+I25I
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard")}
          sx={{ mt: 2 }}
        >
          %1+I2+%1
        </Button>
      </Box>
    </Container>
  );
}