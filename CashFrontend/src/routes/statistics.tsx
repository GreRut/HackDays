import { createFileRoute, Link } from "@tanstack/react-router";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import "../App.css";
import { paymentFetch } from "../utils/fetchPayments";

export const Route = createFileRoute("/statistics")({
  component: RouteComponent,
    loader: async () => {
      const response = await paymentFetch();
      return response.data;
    },
});

function RouteComponent() {
  const svgRef = useRef<SVGSVGElement>(null);
  const transactions = Route.useLoaderData();
  console.log(transactions);
  const formattedTransactions = transactions.map(({ fromUserId, toUserId, amount }) => ({
    fromUserId,
    toUserId,
    amount,
  }));

  useEffect(() => {
    if (svgRef.current) {
      drawNetwork(svgRef.current, formattedTransactions);
    }
  }, [formattedTransactions]);

  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col items-center"
      style={{
        backgroundImage: "url(./Abstract3DBackground.jpg)",
        backgroundSize: "cover",
      }}
    >
      <div className="p-5 flex justify-center">
        <Link
          to="/"
          className="btn hover:bg-terc hover:border-terc rounded-lg border-sec
                     no-underline w-96 h-[10rem] bg-sec text-prim
                     text-4xl font-bold flex items-center justify-center"
        >
          Group
        </Link>
      </div>

      <div className="flex justify-center pt-3 w-full">
        <div
          className="card bg-base-100 shadow-xl"
          style={{
            width: "90",
            height: "65vh",
          }}
        >
          <h3 className="text-center text-2xl font-bold">Transaction Graph</h3>
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 750 1000"
            preserveAspectRatio="xMidYMid meet"
          />
        </div>
      </div>
    </div>
  );
}

function drawNetwork(svgElement: SVGSVGElement, transactions: any[]) {
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

  const width = 750; 
  const height = 1000; 
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d: any) => d.id)
        .distance(300)
    )
    .force("charge", d3.forceManyBody().strength(-800)) 
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
    .attr("r", 15)
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
    .attr("font-size", 14)
    .attr("fill", "white")
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
