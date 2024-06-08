import * as d3 from 'd3';

export interface Node extends d3.SimulationNodeDatum {
    id: string;
    group: string;
    x: number;
    y: number;
  }
  
  export interface Link extends d3.SimulationLinkDatum<Node> {
    source: Node;
    target: Node;
    value: number;
  }
  
  export type Data = {
    nodes: Node[];
    links: Link[];
  };

export const RADIUS = 10;

export const drawNetwork = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  nodes: Node[],
  links: Link[]
) => {
  context.clearRect(0, 0, width, height);

  // Draw the links first
  context.strokeStyle = '#aaa';
  links.forEach((link) => {
    context.beginPath();
    context.moveTo(link.source.x, link.source.y);
    context.lineTo(link.target.x, link.target.y);
    context.stroke();
  });

  // Draw the nodes
  context.fillStyle = '#cb1dd1';
  nodes.forEach((node) => {
    if (!node.x || !node.y) {
      return;
    }

    context.beginPath();
    context.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
    context.fill();
  });
};
