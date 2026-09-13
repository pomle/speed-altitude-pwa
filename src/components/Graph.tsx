import { ReactNode, useMemo } from "react";
import styles from "./Graph.module.scss";

const SIZE: Point = { x: 300, y: 150 };

type Point = { x: number; y: number };

interface GraphProps {
  range: Readonly<[Point, Point]>;
  points: Readonly<Point[]>;
}

export const Graph = ({ range, points, labels }: GraphProps) => {
  const normalized = useMemo(() => {
    const [min, max] = range;

    return points.map((point) => {
      const x = (point.x - min.x) / (max.x - min.x);
      const y = (point.y - min.y) / (max.y - min.y);
      return [x * SIZE.x, y * SIZE.y] as const;
    });
  }, [range, points]);

  const polylinePoints = useMemo(() => {
    return normalized.map((p) => p.join(",")).join(" ");
  }, [normalized]);

  return (
    <div className={styles.graphCard}>
      <svg>
        <polyline points={polylinePoints} stroke="#00c8ff" fill="none" />
      </svg>
    </div>
  );
};
