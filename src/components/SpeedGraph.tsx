import { GPSHistoryData } from "../lib/geo";
import { memo, useMemo } from "react";
import { Graph } from "./Graph";
import { GraphCard } from "./GraphCard";
import { pointsToRange } from "../lib/graph";

interface SpeedGraphProps {
  data: GPSHistoryData[];
}

export const SpeedGraph = memo(({ data }: SpeedGraphProps) => {
  const points = useMemo(() => {
    return data
      .filter((data) => {
        return Number.isFinite(data.coords.speed);
      })
      .map((data) => {
        return {
          x: data.timestamp,
          y: data.coords.speed,
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
