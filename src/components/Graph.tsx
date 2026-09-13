import { ReactNode, useMemo } from "react";
import styles from "./Graph.module.scss";

const SIZE: Point = { x: 300, y: 120 };

type Label = [number, string];

type Point = { x: number; y: number };

function normalize(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

interface GraphProps {
  range: Readonly<[Point, Point]>;
  points: Readonly<Point[]>;
  labels?: {
    y: Readonly<Label>[];
  };
}

export const Graph = ({ range: [min, max], points, labels }: GraphProps) => {
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
    <div className={styles.graph}>
      <div className={styles.labels}>
        {labels?.y
          .filter(([value]) => {
            return Number.isFinite(value);
          })
          .map(([value, text]) => {
            return (
              <div
                key={value}
                className={styles.label}
                style={{ top: `${normalize(-value, -max.y, -min.y) * 100}%` }}
              >
                {text}
              </div>
            );
          })}
      </div>
      <svg width={SIZE.x} height={SIZE.y}>
        <polyline points={polylinePoints} stroke="#00c8ff" fill="none" />
      </svg>
    </div>
  );
};
