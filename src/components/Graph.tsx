import { ReactNode, useMemo } from "react";
import styles from "./Graph.module.scss";

const SIZE: Point = { x: 300, y: 150 };

type Point = { x: number; y: number };

function normalize(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

interface GraphProps {
  range: Readonly<[Point, Point]>;
  points: Readonly<Point[]>;
}

export const Graph = ({ range: [min, max], points }: GraphProps) => {
  const normalized = points.map((point) => {
    const x = normalize(point.x, min.x, max.x);
    const y = normalize(-point.y, -max.y, -min.y);
    return { x, y } as const;
  });

  const polylinePoints = normalized
    .map((p) => {
      return [p.x * SIZE.x, p.y * SIZE.y].join(",");
    })
    .join(" ");

  return (
    <div className={styles.graphCard}>
      <svg>
        <polyline points={polylinePoints} stroke="#00c8ff" fill="none" />
      </svg>
    </div>
  );
};
