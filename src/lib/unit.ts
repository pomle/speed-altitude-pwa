export type Unit = "kts" | "kph" | "mph" | "mps";

export type DisplayUnit = {
  id: Unit;
  label: string;
  multiplier: number;
  max: number;
  ticks: number;
};

export const Units: Record<Unit, DisplayUnit> = {
  kts: { id: "kts", label: "kts", multiplier: 1.944, max: 80, ticks: 16 },
  kph: { id: "kph", label: "km/h", multiplier: 3.6, max: 240, ticks: 48 },
  mph: { id: "mph", label: "mph", multiplier: 2.237, max: 160, ticks: 24 },
  mps: { id: "mps", label: "m/s", multiplier: 1, max: 100, ticks: 20 },
} as const;
