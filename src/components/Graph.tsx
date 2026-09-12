import { ReactNode, useMemo } from "react";
import styles from "./Graph.module.scss";

const SIZE: Point = { x: 300, y: 150 };

type Point = { x: number; y: number };

interface GraphProps {
  range: Readonly<[Point, Point]>;
  points: Point[];
}

export const Graph = ({ range, points }: GraphProps) => {
  const pointsAttr = useMemo(() => {
    const [min, max] = range;

    return points
      .map((point) => {
        const x = (point.x - min.x) / (max.x - min.x);
        const y = (point.y - min.y) / (max.y - min.y);

        return [x * SIZE.x, y * SIZE.y].join(",");
      })
      .join(" ");
  }, [range, points]);

  console.log("Attr", pointsAttr);

  return (
    <div className={styles.graphCard}>
      <svg>
        <polyline points={pointsAttr} stroke="#00c8ff" />
      </svg>
    </div>
  );
};
