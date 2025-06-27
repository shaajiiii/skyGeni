import React from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import StackedBarChart from "../components/BarChart";
import DonutChart from "../components/Donut";
import RevenueBreakdownTable from "../components/RevenueTable";
import { useContainerWidth } from "../hooks/useContainerWidth";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardContext } from "../context/DashboardContext";
import { cards } from "../constants/dashboardCards";

const sampleData = [
  {
    quarter: "2023-Q3",
    existingCustomer: { count: 46, acv: 1322310, percent: 57 },
    newCustomer: { count: 14, acv: 983031, percent: 43 },
    total: { count: 60, acv: 2305341, percent: 100 },
  },
  {
    quarter: "2023-Q4",
    existingCustomer: { count: 45, acv: 1124857, percent: 74 },
    newCustomer: { count: 10, acv: 387300, percent: 26 },
    total: { count: 55, acv: 1512157, percent: 100 },
  },
  {
    quarter: "2024-Q1",
    existingCustomer: { count: 51, acv: 1360047, percent: 81 },
    newCustomer: { count: 6, acv: 313189, percent: 19 },
    total: { count: 57, acv: 1673236, percent: 100 },
  },
  {
    quarter: "2024-Q2",
    existingCustomer: { count: 23, acv: 647821, percent: 74 },
    newCustomer: { count: 6, acv: 224643, percent: 26 },
    total: { count: 29, acv: 872465, percent: 100 },
  },
  {
    quarter: "Total",
    existingCustomer: { count: 165, acv: 4455036, percent: 70 },
    newCustomer: { count: 36, acv: 1908164, percent: 30 },
    total: { count: 201, acv: 6363200, percent: 100 },
  },
];

const data = [
  { quarter: "2023-Q3", existingCustomer: 1322, newCustomer: 983 },
  { quarter: "2023-Q4", existingCustomer: 1125, newCustomer: 387 },
  { quarter: "2024-Q1", existingCustomer: 1360, newCustomer: 313 },
  { quarter: "2024-Q2", existingCustomer: 648, newCustomer: 219 },
  { quarter: "2024-Q3", existingCustomer: 3000, newCustomer: 219 },
  { quarter: "2024-Q4", existingCustomer: 700, newCustomer: 100 },
];
const DashboardLayout: React.FC = () => {
  const { ref: barRef, width: barWidth } = useContainerWidth();
  const { ref: donutRef, width: donutWidth } = useContainerWidth();
  // console.log(barWidth, donutWidth);
  const { selectedCard, setSelectedCard } = useDashboardContext();
  const selectedCardObj = cards.find((card) => card.query_key === selectedCard);
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 3,
          overflow: "hidden",
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 16px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              "0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <ArrowLeft
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/");
            setSelectedCard(null);
          }}
        />
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: "text.primary",
            mb: 3,
          }}
        >
          Won ACV mix by {selectedCardObj?.title || ""}
        </Typography>

        <Box
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          gap={3}
          mt={3}
        >
          <Box ref={barRef} flex={2}>
            <StackedBarChart width={barWidth} data={data} />
          </Box>

          <Box ref={donutRef} flex={1}>
            <DonutChart width={donutWidth} />
          </Box>
        </Box>

        <Box mt={4}>
          <RevenueBreakdownTable data={sampleData} />
        </Box>
      </Paper>
    </Container>
  );
};

export default DashboardLayout;
