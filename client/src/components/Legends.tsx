import React from "react";
import { Stack, Box, Typography } from "@mui/material";

interface LegendsProps {
  legends: Record<string, string>;
  spacing?: number;
}

const Legends: React.FC<LegendsProps> = ({ legends, spacing = 6 }) => {
  return (
    <Stack
      direction="row"
      spacing={spacing}
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
      rowGap={2}
      mb={4}
    >
      {Object.entries(legends).map(([label, color]) => (
        <Stack key={label} direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 20,
              height: 15,
              bgcolor: color,
              borderRadius: 1,
            }}
          />
          <Typography variant="body1" color="text.secondary">
            {label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

export default Legends;
