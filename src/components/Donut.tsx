import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, Paper } from "@mui/material";

interface DataItem {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data?: DataItem[];
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
  data = [
    // { label: "__", value: 500, color: "#4A90E2" },
    // { label: "__", value: 500, color: "#F5A623" },
    { label: "heading", value: 500, color: "#4A90E2" },
    { label: "asdfdsfsadf", value: 1000, color: "#F5A623" },
  ],
  width = 400,
  height = 400,
  innerRadius = 80,
  outerRadius = 140,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const centerX = width / 2;
    const centerY = height / 2;

    // Create the pie generator
    const pie = d3
      .pie<DataItem>()
      .value((d) => d.value)
      .sort(null);

    // Create the arc generator
    const arc = d3
      .arc<d3.PieArcDatum<DataItem>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    // Create the arc generator for labels (positioned outside)
    const labelArc = d3
      .arc<d3.PieArcDatum<DataItem>>()
      .innerRadius(outerRadius + 40)
      .outerRadius(outerRadius + 40);

    // Create arc generator for line endpoints (mid-point between chart and labels)
    const lineArc = d3
      .arc<d3.PieArcDatum<DataItem>>()
      .innerRadius(outerRadius)
      .outerRadius(outerRadius);

    // Create a group for the chart
    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    // Generate pie data
    const pieData = pie(data);

    // Create the donut segments
    const segments = chartGroup
      .selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2);

    // Add hover effects
    segments
      .on("mouseover", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", "scale(1.05)");
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", "scale(1)");
      });

    // Add connector lines from chart to labels
    chartGroup
      .selectAll("polyline.connector")
      .data(pieData)
      .enter()
      .append("polyline")
      .attr("class", "connector")
      .attr("points", (d) => {
        const outerPoint = arc.centroid(d);
        const linePoint = lineArc.centroid(d);
        const labelPoint = labelArc.centroid(d);
        return `${outerPoint[0]},${outerPoint[1]} ${linePoint[0]},${linePoint[1]} ${labelPoint[0]},${labelPoint[1]}`;
      })
      .style("fill", "none")
      .style("stroke", "#999")
      .style("stroke-width", 1)
      .style("opacity", 0.7);

    // Add labels
    chartGroup
      .selectAll("text.label")
      .data(pieData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("transform", (d) => {
        const centroid = labelArc.centroid(d);
        return `translate(${centroid[0]}, ${centroid[1]})`;
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-family", "Arial, sans-serif")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .style("fill", "#666")
      .text((d) => d.data.label);

    // Add center text
    let total = 0;
    const isDefaultLabel = data.some((item) => item.label === "__");
    if (!isDefaultLabel) {
      total = data.reduce((sum, item) => sum + item.value, 0);
    }

    const centerGroup = chartGroup.append("g");

    centerGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", -8)
      .style("font-family", "Arial, sans-serif")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .style("fill", "#333")
      .text("Total");

    centerGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", 12)
      .style("font-family", "Arial, sans-serif")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text(`$${(total / 1000).toFixed(0)}K`);
  }, [data, width, height, innerRadius, outerRadius]);

  return (
    <Box>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" }}
      />
    </Box>
  );
};

export default DonutChart;
