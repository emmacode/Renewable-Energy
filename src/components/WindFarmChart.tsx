// src/components/WindFarmChart.tsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface WindFarmData {
  Timestamp: string;
  WindSpeed: number;
  PowerOutput: number;
}

interface WindFarmChartProps {
  data: WindFarmData[];
}

export const WindFarmChart: React.FC<WindFarmChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Chart dimensions and margins
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 40, bottom: 30, left: 50 };

    // Calculate inner dimensions of the chart area
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Scales for x and y axes
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.Timestamp)) as [Date, Date])
      .range([0, innerWidth]);

    const yPowerScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.PowerOutput) || 0])
      .range([innerHeight, 0]);

    const yWindSpeedScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.WindSpeed) || 0])
      .range([innerHeight, 0]);

    // Line functions for power output and wind speed
    const powerLine = d3
      .line<WindFarmData>()
      .x((d) => xScale(new Date(d.Timestamp))!)
      .y((d) => yPowerScale(d.PowerOutput));

    const windSpeedLine = d3
      .line<WindFarmData>()
      .x((d) => xScale(new Date(d.Timestamp))!)
      .y((d) => yWindSpeedScale(d.WindSpeed));

    // Create the SVG element
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create a group for the chart components
    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Clear the existing chart before rendering a new one
    chartGroup.selectAll("*").remove();

    // Append power output line to the chart
    chartGroup
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", powerLine)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke-width", 3); // Increase line width on hover
        const [x, y] = d3.pointer(event);
        const xValue = xScale.invert(x); // Get the date value from the x-coordinate
        const bisectDate = d3.bisector(
          (d: WindFarmData) => new Date(d.Timestamp)
        ).left;
        const dataIndex = bisectDate(data, xValue, 1); // Find the index of the nearest data point
        const tooltipData = data[dataIndex]; // Get the corresponding data object
        chartGroup
          .append("text")
          .attr("class", "tooltip")
          .attr("x", x + 10)
          .attr("y", y - 10)
          .text(
            `Wind Speed: ${tooltipData.WindSpeed} m/s\nPower Output: ${tooltipData.PowerOutput} kW`
          );
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke-width", 1.5); // Reset line width on mouseout
        chartGroup.select(".tooltip").remove(); // Remove the tooltip
      });

    // Append wind speed line to the chart
    chartGroup
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 1.5)
      .attr("d", windSpeedLine)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke-width", 3); // Increase line width on hover
        const [x, y] = d3.pointer(event);
        const xValue = xScale.invert(x); // Get the date value from the x-coordinate
        const bisectDate = d3.bisector(
          (d: WindFarmData) => new Date(d.Timestamp)
        ).left;
        const dataIndex = bisectDate(data, xValue, 1); // Find the index of the nearest data point
        const tooltipData = data[dataIndex]; // Get the corresponding data object
        chartGroup
          .append("text")
          .attr("class", "tooltip")
          .attr("x", x + 10)
          .attr("y", y - 10)
          .text(
            `Wind Speed: ${tooltipData.WindSpeed} m/s\nPower Output: ${tooltipData.PowerOutput} kW`
          );
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke-width", 1.5); // Reset line width on mouseout
        chartGroup.select(".tooltip").remove(); // Remove the tooltip
      });

    // Create x-axis
    const xAxis = d3.axisBottom(xScale);
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis);

    // Create y-axis for power output
    const yAxisPower = d3.axisLeft(yPowerScale);
    chartGroup.append("g").call(yAxisPower);

    // Create y-axis for wind speed
    const yAxisWindSpeed = d3.axisRight(yWindSpeedScale);
    chartGroup
      .append("g")
      .attr("transform", `translate(${innerWidth}, 0)`)
      .call(yAxisWindSpeed);
  }, [data]);

  return <svg ref={svgRef}></svg>;
};
