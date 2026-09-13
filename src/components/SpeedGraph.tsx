import { GPSHistoryData } from "../lib/geo";
import { memo, useMemo } from "react";
import { Graph } from "./Graph";
import { GraphCard } from "./GraphCard";
import { pointsToRange, smoothen } from "../lib/graph";
import { DisplayUnit, Units } from "../lib/unit";

const RANGE_MAP: Record<keyof typeof Units, number> = {
  kts: 5,
  kph: 10,
  mps: 2.5,
  mph: 10,
};

function hasSpeed(data: GPSHistoryData) {
  return Number.isFinite(data.coords.speed);
}

interface SpeedGraphProps {
  data: GPSHistoryData[];
  unit: DisplayUnit;
}

export const SpeedGraph = memo(({ data, unit }: SpeedGraphProps) => {
  const points = useMemo(() => {
    const speed = data.filter(hasSpeed).map((data) => {
      return {
        x: data.timestamp,
        y: data.coords.speed,
      };
    });
    return smoothen(speed, 2);
  }, [data]);

  const range = pointsToRange(points, RANGE_MAP[unit.id]);

  const labels = {
    y: range.map((step) => [step.y, step.y.toFixed(1)] as const),
  };

  return (
    <GraphCard>
      <div>
        <label>Speed History</label>
      </div>
      <Graph range={range} points={points} labels={labels} />
    </GraphCard>
  );
});
