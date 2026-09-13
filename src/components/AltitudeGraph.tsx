import { GPSHistoryData } from "../lib/geo";
import { memo, useMemo } from "react";
import { Graph } from "./Graph";
import { GraphCard } from "./GraphCard";
import { pointsToRange } from "../lib/graph";

interface AltitudeGraphProps {
  data: GPSHistoryData[];
}

export const AltitudeGraph = memo(({ data }: AltitudeGraphProps) => {
  const points = useMemo(() => {
    return data
      .filter((data) => {
        return Number.isFinite(data.coords.altitude);
      })
      .map((data) => {
        return {
          x: data.timestamp,
          y: -data.coords.altitude,
        };
      });
  }, [data]);

  const range = useMemo(() => {
    return pointsToRange(points);
  }, [points]);

  return (
    <GraphCard>
      <div>
        <label>Altitude History</label>
      </div>
      <Graph range={range} points={points} />
    </GraphCard>
  );
});
