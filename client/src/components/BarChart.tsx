import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, Paper, Typography, Stack, Container } from "@mui/material";

interface QuarterData {
  quarter: string;
  existingCustomer: number;
  newCustomer: number;
}

interface StackedBarChartProps {
  data?: QuarterData[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data = [
    { quarter: "2023-Q3", existingCustomer: 1322, newCustomer: 983 },
    { quarter: "2023-Q4", existingCustomer: 1125, newCustomer: 387 },
    { quarter: "2024-Q1", existingCustomer: 1360, newCustomer: 313 },
    { quarter: "2024-Q2", existingCustomer: 648, newCustomer: 219 },
    { quarter: "2024-Q3", existingCustomer: 3000, newCustomer: 219 },
    { quarter: "2024-Q4", existingCustomer: 700, newCustomer: 100 },
  ],
  width = 800,
  height = 500,
  margin = { top: 60, right: 40, bottom: 80, left: 80 },
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const keys = ["existingCustomer", "newCustomer"];
    const stackGenerator = d3.stack<QuarterData>().keys(keys);
    const stackedData = stackGenerator(data);

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.quarter))
      .range([0, chartWidth])
      .padding(0.3);

    const maxTotal =
      d3.max(data, (d) => d.existingCustomer + d.newCustomer) || 0;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxTotal * 1.1])
      .range([chartHeight, 0]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(keys)
      .range(["#4A90E2", "#F5A623"]);

    const barGroups = chartGroup
      .selectAll("g.bar-group")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr("fill", (d) => colorScale(d.key) as string);

    const bars = barGroups
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.data.quarter) || 0)
      .attr("y", (d) => yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1);

    bars
      .on("mouseover", function () {
        d3.select(this).transition().duration(200).attr("opacity", 0.8);
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("opacity", 1);
      });

    barGroups.each(function (stackData) {
      const group = d3.select(this);
      group
        .selectAll("text.value-label")
        .data(stackData)
        .enter()
        .append("text")
        .attr("class", "value-label")
        .attr(
          "x",
          (d) => (xScale(d.data.quarter) || 0) + xScale.bandwidth() / 2
        )
        .attr("y", (d) => {
          const barHeight = yScale(d[0]) - yScale(d[1]);
          const centerY = yScale(d[1]) + barHeight / 2;
          return centerY + 5;
        })
        .attr("text-anchor", "middle")
        .style("font-family", "Arial, sans-serif")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("fill", "#ffffff")

        .each(function (d) {
          const value = d[1] - d[0];
          const barHeight = yScale(d[0]) - yScale(d[1]);
          const percentage = Math.round(
            (value / (d.data.existingCustomer + d.data.newCustomer)) * 100
          );
          d3.select(this)
            .append("tspan")
            .attr("x", (xScale(d.data.quarter) || 0) + xScale.bandwidth() / 2)
            .attr("dy", 0)
            .style("font-size", `${barHeight < 40 ? 8 : 12}px`)
            .text(`$${value}K`);
          if (barHeight < 40) return; // Don't draw label if too small
          d3.select(this)
            .append("tspan")
            .attr("x", (xScale(d.data.quarter) || 0) + xScale.bandwidth() / 2)
            .attr("dy", "1.2em")
            .text(`(${percentage}%)`);
        });
    });

    data.forEach((d) => {
      const total = d.existingCustomer + d.newCustomer;
      chartGroup
        .append("text")
        .attr("x", (xScale(d.quarter) || 0) + xScale.bandwidth() / 2)
        .attr("y", yScale(total) - 10)
        .attr("text-anchor", "middle")
        .style("font-family", "Arial, sans-serif")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text(`$${total}K`);
    });

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => `$${(d as number) / 1000}K`)
      .ticks(6);

    chartGroup
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#666");

    chartGroup
      .selectAll("line.grid-line")
      .data(yScale.ticks(6))
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", 0)
      .attr("x2", chartWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .lower()
      .style("stroke", "#e0e0e0")
      .style("stroke-dasharray", "2,2")
      .style("opacity", 0.7);

    chartGroup
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#666");

    chartGroup.selectAll(".domain, .tick line").style("stroke", "#ddd");

    chartGroup
      .append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 50)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("fill", "#666")
      .text("Closed Fiscal Quarter");
  }, [data, width, height, margin]);

  return (
    <>
      <Box
        sx={{
          overflowX: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <svg ref={svgRef} width={width} height={height} />
      </Box>

      <Stack
        direction="row"
        spacing={6}
        justifyContent="center"
        alignItems="center"
        mb={4}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 20,
              height: 15,
              bgcolor: "#4A90E2",
              borderRadius: 1,
            }}
          />
          <Typography variant="body1" color="text.secondary">
            Existing Customer
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 20,
              height: 15,
              bgcolor: "#F5A623",
              borderRadius: 1,
            }}
          />
          <Typography variant="body1" color="text.secondary">
            New Customer
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};

export default StackedBarChart;
