import { createFileRoute } from "@tanstack/react-router";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/statistics")({
  component: RouteComponent,
});

function RouteComponent() {
  const svgRef = useRef<SVGSVGElement>(null);

  const data = [
    {
      id: 1,
      fromUserId: 1,
      toUserId: 3,
      amount: 5,
      timestamp: "2025-01-20T17:46:49.3569951",
    },
    {
      id: 2,
      fromUserId: 2,
      toUserId: 3,
      amount: 5,
      timestamp: "2025-01-20T17:46:52.8687134",
    },
    {
      id: 3,
      fromUserId: 4,
      toUserId: 3,
      amount: 5,
      timestamp: "2025-01-20T17:46:55.8825608",
    },
  ];

  useEffect(() => {
    if (svgRef.current) {
      drawNetwork(svgRef.current, data);
    }
  }, [data]);

  return (
    <div className="h-screen flex items-center justify-center">
      <svg ref={svgRef} width="800" height="600" />
    </div>
  );
}

function drawNetwork(svgElement: SVGSVGElement, transactions: typeof data) {
  const nodes = Array.from(
    new Set(transactions.flatMap((t) => [t.fromUserId, t.toUserId]))
  ).map((id) => ({ id }));

  const links = transactions.map((t) => ({
    source: t.fromUserId,
    target: t.toUserId,
    amount: t.amount,
  }));

  const svg = d3.select(svgElement);
  svg.selectAll("*").remove();

  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d: any) => d.id).distance(200)
    )
    .force("charge", d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => Math.sqrt(d.amount));

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 10)
    .attr("fill", "steelblue")
    .call(
      d3
        .drag<SVGCircleElement, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

  const labels = svg
    .append("g")
    .selectAll("text")
    .data(links)
    .join("text")
    .attr("font-size", 12)
    .attr("fill", "black")
    .text((d) => `Amount: ${d.amount}`);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => (d.source as any).x)
      .attr("y1", (d) => (d.source as any).y)
      .attr("x2", (d) => (d.target as any).x)
      .attr("y2", (d) => (d.target as any).y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    labels
      .attr("x", (d) => ((d.source as any).x + (d.target as any).x) / 2)
      .attr("y", (d) => ((d.source as any).y + (d.target as any).y) / 2);
  });
}
