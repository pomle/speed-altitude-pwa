import { GPSHistoryData } from "../lib/geo";
import { memo, useMemo } from "react";
import { Graph } from "./Graph";
import { GraphCard } from "./GraphCard";
import { pointsToRange } from "../lib/graph";

function hasAlt(data: GPSHistoryData) {
  return Number.isFinite(data.coords.altitude);
}

interface AltitudeGraphProps {
  data: GPSHistoryData[];
}

export const AltitudeGraph = memo(({ data }: AltitudeGraphProps) => {
  const points = useMemo(() => {
    return data.filter(hasAlt).map((data) => {
      return {
        x: data.timestamp,
        y: data.coords.altitude,
      };
    });
  }, [data]);

  const range = pointsToRange(points, 10);

  const labels = {
    y: range.map((step) => [step.y, step.y.toFixed(1)] as const),
  };

  return (
    <GraphCard>
      <div>
        <label>Altitude History</label>
      </div>
      <Graph range={range} points={points} labels={labels} />
    </GraphCard>
  );
});
