import { useEffect, useState } from 'react';
import axios from 'axios';
import { NetworkDiagram } from './network-diagram';

interface Event {
  author: string;
  title: string;
  metadata: string;
  book_id: string; // Ensure each event has a book_id for querying the graph
}



interface GraphComponentProps {
  event: Event;
  onClose: () => void;
}

interface GraphData {
  nodes: Array<{ id: string; label: string }>;
  edges: Array<{ from: string; to: string; weight: number }>;
}

export const GraphComponent: React.FC<GraphComponentProps> = ({ event, onClose }) => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await axios.get(`/api/graph?book_id=${event.book_id}`);
        setGraphData(response.data);
      } catch (error) {
        console.error("Failed to fetch graph data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [event.book_id]);

  return (
    <div className="absolute inset-0 bg-zinc-900 bg-opacity-90 flex flex-col">
      <button onClick={onClose} className="self-end m-4 text-zinc-400">
        <i className="fas fa-times"></i> {/* FontAwesome Close Icon */}
      </button>
      <div className="flex flex-1">
        <div className="w-2/3">
          {loading ? (
            <div className="text-zinc-200">Loading graph...</div>
          ) : (
            <div id="graph" className="h-full">
              {graphData && (
                <NetworkDiagram
                  width={800}
                  height={600}
                  data={{
                    nodes: graphData.nodes.map(node => ({ id: node.id, group: node.label, x: 0, y: 0 })),
                    links: graphData.edges.map(edge => ({ source: edge.from, target: edge.to, value: edge.weight }))
                  }}
                  collideRadius={15}
                  manyBodyStrength={-30}
                  forceYStrength={0.1}
                />
              )}
            </div>
          )}
        </div>
        <div className="w-1/3 p-4">
          <h2 className="text-xl font-bold text-zinc-200">{event.title}</h2>
          <p className="text-zinc-400">{event.author}</p>
          <p className="text-zinc-500">{event.metadata}</p>
        </div>
      </div>
    </div>
  );
};
