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

const DashboardLayout: React.FC = () => {
  const [donutData, setDonutData] = useState([]);
  const [barchartData, setBarchartData] = useState([]);
  const [tableData, setTableData] = useState([]);
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
          setTableData(res.tableData);
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
              data={tableData}
              filterByType={selectedCardObj?.title}
            />
          </Box>
        </>
      </Paper>
    </Container>
  );
};

export default DashboardLayout;
