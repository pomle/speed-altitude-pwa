import { GPSHistoryData } from "../lib/geo";
import { memo, useMemo } from "react";
import { Graph } from "./Graph";
import { GraphCard } from "./GraphCard";
import { pointsToRange } from "../lib/graph";

function hasSpeed(data: GPSHistoryData) {
  return Number.isFinite(data.coords.speed);
}

interface SpeedGraphProps {
  data: GPSHistoryData[];
}

export const SpeedGraph = memo(({ data }: SpeedGraphProps) => {
  const points = useMemo(() => {
    return data.filter(hasSpeed).map((data) => {
      return {
        x: data.timestamp,
        y: -data.coords.speed,
      };
    });
  }, [data]);

  const range = useMemo(() => {
    return pointsToRange(points);
  }, [points]);

  return (
    <GraphCard>
      <div>
        <label>Speed History</label>
      </div>
      <Graph range={range} points={points} />
    </GraphCard>
  );
});
