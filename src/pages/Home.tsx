import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Container, Paper } from "@mui/material";
import { cards } from "../constants/dashboardCards";
import { useDashboardContext } from "../context/DashboardContext";

const Home: React.FC = () => {
  const { setSelectedCard } = useDashboardContext();
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h5"
          align="left"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: "text.primary",
            mb: 3,
          }}
        >
          Choose a type
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
            gap: 2,
          }}
        >
          {cards.map((card) => (
            <Card key={card.title}>
              <CardActionArea
                onClick={() => setSelectedCard(card.query_key)}
                // data-active={selectedCard === index ? "" : undefined}
                sx={{
                  height: "100%",
                  "&[data-active]": {
                    backgroundColor: "action.selected",
                    "&:hover": {
                      backgroundColor: "action.selectedHover",
                    },
                  },
                }}
              >
                <CardContent sx={{ height: "100%" }}>
                  <Typography variant="h5" component="div">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};
export default Home;
