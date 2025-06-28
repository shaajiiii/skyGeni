import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";

interface SeriesEntry {
  value: number;
  color: string;
}

interface BarDatum {
  quarter: string;
  values: Record<string, SeriesEntry>;
}

interface StackedBarChartProps {
  data: BarDatum[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data,
  width = 800,
  height = 500,
  margin = { top: 60, right: 40, bottom: 80, left: 80 },
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const keys = Object.keys(data[0].values);

    const flatData = data.map((d) => {
      const obj: Record<string, any> = { quarter: d.quarter };
      keys.forEach((key) => {
        obj[key] = d.values[key]?.value || 0;
      });
      return obj;
    });

    const stackGenerator = d3.stack<Record<string, any>>().keys(keys);
    const stackedData = stackGenerator(flatData);

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.quarter))
      .range([0, chartWidth])
      .padding(0.3);

    const maxY =
      d3.max(flatData, (d) => keys.reduce((sum, k) => sum + d[k], 0)) || 0;

    const yScale = d3
      .scaleLinear()
      .domain([0, maxY * 1.1])
      .range([chartHeight, 0]);

    const colorMap: Record<string, string> = {};
    keys.forEach((key) => {
      colorMap[key] = data[0].values[key]?.color || "#ccc";
    });

    const barGroups = chartGroup
      .selectAll("g.bar-group")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("fill", (d) => colorMap[d.key] || "#ccc");

    const bars = barGroups
      .selectAll("rect")
      .data((d) => d.filter((segment) => segment[1] - segment[0] > 0)) // Skip 0-value segments
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.data.quarter)!)
      .attr("y", (d) => yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
      .attr("stroke", "#fff")
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
        .data(stackData.filter((d) => d[1] - d[0] > 0)) // Skip 0-value bars
        .enter()
        .append("text")
        .attr(
          "x",
          (d) => (xScale(d.data.quarter) || 0) + xScale.bandwidth() / 2
        )
        .attr("y", (d) => {
          const barHeight = yScale(d[0]) - yScale(d[1]);
          return yScale(d[1]) + barHeight / 2 + 5;
        })
        .attr("text-anchor", "middle")
        .style("fill", "#fff")
        .style("font-size", "11px")
        .each(function (d) {
          const value = d[1] - d[0];
          const total = keys.reduce((sum, k) => sum + d.data[k], 0);
          const percentage = Math.round((value / total) * 100);
          const barHeight = yScale(d[0]) - yScale(d[1]);

          if (barHeight < 15) return; // ✅ Don't show text if bar is too short

          d3.select(this)
            .append("tspan")
            .attr("x", (xScale(d.data.quarter) || 0) + xScale.bandwidth() / 2)
            .attr("dy", 0)
            .style("font-size", `${barHeight < 40 ? 8 : 12}px`)
            .text(`$${value}K`);

          if (barHeight >= 40) {
            d3.select(this)
              .append("tspan")
              .attr("x", (xScale(d.data.quarter) || 0) + xScale.bandwidth() / 2)
              .attr("dy", "1.2em")
              .text(`(${percentage}%)`);
          }
        });
    });

    flatData.forEach((d) => {
      const total = keys.reduce((sum, k) => sum + d[k], 0);
      chartGroup
        .append("text")
        .attr("x", (xScale(d.quarter) || 0) + xScale.bandwidth() / 2)
        .attr("y", yScale(total) - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text(`$${total}K`);
    });

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => `$${d as number}K`)
      .ticks(6);

    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#666");

    chartGroup
      .append("g")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#666");

    chartGroup
      .selectAll("line.grid-line")
      .data(yScale.ticks(6))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", chartWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .lower()
      .style("stroke", "#e0e0e0")
      .style("stroke-dasharray", "2,2")
      .style("opacity", 0.7);

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
    <Box
      sx={{
        overflowX: "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <svg ref={svgRef} width={width} height={height} />
    </Box>
  );
};

export default StackedBarChart;
