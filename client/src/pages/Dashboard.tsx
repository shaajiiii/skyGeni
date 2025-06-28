import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import StackedBarChart from "../components/BarChart";
import DonutChart from "../components/Donut";
import RevenueBreakdownTable from "../components/RevenueTable";
import { useContainerWidth } from "../hooks/useContainerWidth";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardContext } from "../context/DashboardContext";
import { cards } from "../constants/dashboardCards";
import { fetchDashboardData } from "../api/dashboard";
import Legends from "../components/Legends";

// const sampleData = [
//   {
//     quarter: "2023-Q3",
//     existingCustomer: { count: 46, acv: 1322310, percent: 57 },
//     newCustomer: { count: 14, acv: 983031, percent: 43 },
//     total: { count: 60, acv: 2305341, percent: 100 },
//   },
//   {
//     quarter: "2023-Q4",
//     existingCustomer: { count: 45, acv: 1124857, percent: 74 },
//     newCustomer: { count: 10, acv: 387300, percent: 26 },
//     total: { count: 55, acv: 1512157, percent: 100 },
//   },
//   {
//     quarter: "2024-Q1",
//     existingCustomer: { count: 51, acv: 1360047, percent: 81 },
//     newCustomer: { count: 6, acv: 313189, percent: 19 },
//     total: { count: 57, acv: 1673236, percent: 100 },
//   },
//   {
//     quarter: "2024-Q2",
//     existingCustomer: { count: 23, acv: 647821, percent: 74 },
//     newCustomer: { count: 6, acv: 224643, percent: 26 },
//     total: { count: 29, acv: 872465, percent: 100 },
//   },
//   {
//     quarter: "Total",
//     existingCustomer: { count: 165, acv: 4455036, percent: 70 },
//     newCustomer: { count: 36, acv: 1908164, percent: 30 },
//     total: { count: 201, acv: 6363200, percent: 100 },
//   },
// ];

const sampleData = [
  {
    quarter: "2023-Q3",
    groups: {
      "Asia Pac": { count: 5, acv: 238547.19, percent: 10 },
      Enterprise: { count: 2, acv: 165000, percent: 7 },
      Europe: { count: 38, acv: 778384.35, percent: 33 },
      Total: { count: 45, acv: 1181931.54, percent: 100 },
    },
  },
  {
    quarter: "2023-Q4",
    groups: {
      "Asia Pac": { count: 13, acv: 349600, percent: 25 },
      Enterprise: { count: 3, acv: 192000, percent: 14 },
      Europe: { count: 31, acv: 736276.98, percent: 52 },
      Total: { count: 47, acv: 1277876.98, percent: 100 },
    },
  },
];

const DashboardLayout: React.FC = () => {
  const [donutData, setDonutData] = useState([]);
  const [barchartData, setBarchartData] = useState([]);
  const [legends, setLegends] = useState({});
  const { ref: barRef, width: barWidth } = useContainerWidth();
  const { ref: donutRef, width: donutWidth } = useContainerWidth();
  // console.log(barWidth, donutWidth);
  const { selectedCard, setSelectedCard } = useDashboardContext();
  const selectedCardObj = cards.find((card) => card.query_key === selectedCard);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedCard) {
      // No query type selected — go back home
      navigate("/", { replace: true }); // replace prevents back loop
    }

    fetchDashboardData(selectedCard)
      .then((res) => {
        if (res?.donutData) {
          setDonutData(res.donutData);
          setLegends(res.legends);
          setBarchartData(res.barData);
        }
        // console.log(res);
        // console.log(res.donutData);
      })
      .catch((err) => console.error("Failed to fetch:", err));
    // .finally(() => {});
  }, [selectedCard, navigate]);

  if (!selectedCard) return null; // prevent rendering briefly during redirect

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
            setTimeout(() => {
              // delaying state change to prevent a brief render
              setSelectedCard(null);
            }, 500);
          }}
        />
        <>
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
          {/* <pre> {JSON.stringify(donutData, null, 2)}</pre> */}
          <Box
            display="flex"
            flexDirection={{ xs: "column", lg: "row" }}
            justifyContent="space-between"
            gap={3}
            mt={3}
          >
            <Box ref={barRef} flex={2}>
              <StackedBarChart width={barWidth} data={barchartData} />
            </Box>

            <Box ref={donutRef} flex={1}>
              <DonutChart width={donutWidth} data={donutData} />
            </Box>
          </Box>
          <Box mt={1}>
            <Legends legends={legends} />
          </Box>

          <Box mt={4}>
            <RevenueBreakdownTable
              data={sampleData}
              filterByType={selectedCardObj?.title}
            />
          </Box>
        </>
      </Paper>
    </Container>
  );
};

export default DashboardLayout;
