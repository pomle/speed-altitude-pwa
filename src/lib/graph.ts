export type Point = { x: number; y: number };

export function pointsToRange(points: Point[]) {
  let xMin = Infinity;
  let yMin = Infinity;
  let xMax = -Infinity;
  let yMax = -Infinity;

  for (const point of points) {
    if (point.x < xMin) {
      xMin = point.x;
    }
    if (point.x > xMax) {
      xMax = point.x;
    }
    if (point.y < yMin) {
      yMin = point.y;
    }
    if (point.y > yMax) {
      yMax = point.y;
    }
  }

  return [
    { x: xMin, y: yMin },
    { x: xMax, y: yMax },
  ] as const;
}
