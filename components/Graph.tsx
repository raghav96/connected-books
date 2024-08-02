"use client";

import { useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const Graph = ({ bookId }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!bookId) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 40 },
      width = 400 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // Append the SVG object to the body of the page
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Fetch the data
    axios.get(`/api/graph?book_id=${bookId}`, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnamtyZmxueG9wZWl4d3BzamFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4MDg1MzAsImV4cCI6MjAzMzM4NDUzMH0.d40jU9GnAyyRugrgmKZeS9aTfAi1_tBCeHzOulyfMAM',
        'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnamtyZmxueG9wZWl4d3BzamFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4MDg1MzAsImV4cCI6MjAzMzM4NDUzMH0.d40jU9GnAyyRugrgmKZeS9aTfAi1_tBCeHzOulyfMAM'
      }
    }).then(response => {
      const data = response.data;

      // Initialize the links
      const link = svg
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .style("stroke", "#aaa");

      // Initialize the nodes
      const node = svg
        .selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", 20)
        .style("fill", "#69b3a2");

      // List the force we want to apply on the network
      const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink().id(d => d.id).links(data.links))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

      // This function is run at each iteration of the force algorithm, updating the nodes' position
      function ticked() {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node
          .attr("cx", d => d.x + 6)
          .attr("cy", d => d.y - 6);
      }
    }).catch(error => {
      console.error('Error fetching graph data:', error);
    });
  }, [bookId]); // Re-run the effect when bookId changes

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Graph;
