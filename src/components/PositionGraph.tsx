import { GPSHistoryData } from "../lib/geo";
import { memo, useMemo } from "react";
import { Graph } from "./Graph";
import { GraphCard } from "./GraphCard";
import { pointsToRange } from "../lib/graph";

function hasPosition(data: GPSHistoryData) {
  return (
    Number.isFinite(data.coords.longitude) &&
    Number.isFinite(data.coords.latitude)
  );
}

interface PositionGraphProps {
  data: GPSHistoryData[];
}

export const PositionGraph = memo(({ data }: PositionGraphProps) => {
  const points = useMemo(() => {
    return data.filter(hasPosition).map((data) => {
      return {
        x: data.coords.longitude,
        y: data.coords.latitude,
      };
    });
  }, [data]);

  const range = pointsToRange(points);

  return (
    <GraphCard>
      <div>
        <label>Position History</label>
      </div>
      <Graph range={range} points={points} />
    </GraphCard>
  );
});
