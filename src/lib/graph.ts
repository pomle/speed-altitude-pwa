export type Point = { x: number; y: number };

export function pointsToRange(points: Point[], round: number = 0) {
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

  if (round) {
    xMin = Math.floor(xMin / round) * round;
    yMin = Math.floor(yMin / round) * round;
    xMax = Math.ceil(xMax / round) * round;
    yMax = Math.ceil(yMax / round) * round;
  }

  return [
    {
      x: xMin,
      y: yMin,
    },
    {
      x: xMax,
      y: yMax,
    },
  ] as const;
}

export function smoothen(polygon: Point[], peek = 2) {
  const smooth: Point[] = [];

  if (polygon.length === 0) {
    return smooth;
  }

  for (let i = peek; i < polygon.length - peek; i++) {
    const samples: { x: number; y: number }[] = [];
    for (let j = i - peek; j <= i + peek; j++) {
      const sample = polygon[j];
      samples.push({
        x: sample.x,
        y: sample.y,
      });
    }

    const sum = samples.reduce(
      (sum, value) => {
        sum.x += value.x;
        sum.y += value.y;
        return sum;
      },
      { x: 0, y: 0 },
    );

    smooth.push({
      x: sum.x / samples.length,
      y: sum.y / samples.length,
    });
  }

  return smooth;
}
