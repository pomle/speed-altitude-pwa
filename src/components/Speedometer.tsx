import { useEffect, useState } from "react";

interface SpeedometerProps {
  speed: number;
  maxSpeed?: number;
}

export const Speedometer = ({ speed, maxSpeed = 200 }: SpeedometerProps) => {
  const [displaySpeed, setDisplaySpeed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplaySpeed((prev) => {
        const diff = speed - prev;
        if (Math.abs(diff) < 0.1) return speed;
        return prev + diff * 0.1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [speed]);

  const percentage = Math.min((displaySpeed / maxSpeed) * 100, 100);
  const rotation = (percentage / 100) * 270 - 135;

  return (
    <div className="relative w-full max-w-md aspect-square mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          {/* Gradient for outer ring */}
          <radialGradient id="outerRing">
            <stop offset="0%" stopColor="hsl(var(--dashboard-gauge))" />
            <stop offset="100%" stopColor="hsl(var(--dashboard-bg))" />
          </radialGradient>

          {/* Speed gradient */}
          <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(193 100% 70%)" />
          </linearGradient>

          {/* Needle gradient */}
          <linearGradient id="needleGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring */}
        <circle cx="100" cy="100" r="98" fill="url(#outerRing)" />

        {/* Main gauge background */}
        <circle cx="100" cy="100" r="90" fill="hsl(var(--dashboard-bg))" />

        {/* Speed glow effect */}
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="hsl(var(--speed-glow))"
          opacity={Math.min(percentage / 200, 0.2)}
          filter="url(#glow)"
        />

        {/* Background arc */}
        <path
          d="M 30 170 A 85 85 0 1 1 170 170"
          fill="none"
          stroke="hsl(var(--gauge-track))"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Speed arc with gradient */}
        <path
          d="M 30 170 A 85 85 0 1 1 170 170"
          fill="none"
          stroke="url(#speedGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="401"
          strokeDashoffset={401 - (401 * percentage) / 100}
          className="transition-all duration-500"
          filter="url(#glow)"
        />

        {/* Speed markers */}
        {Array.from({ length: 11 }).map((_, i) => {
          const angle = -135 + i * 27;
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + Math.cos(rad) * 75;
          const y1 = 100 + Math.sin(rad) * 75;
          const x2 = 100 + Math.cos(rad) * (i % 2 === 0 ? 68 : 71);
          const y2 = 100 + Math.sin(rad) * (i % 2 === 0 ? 68 : 71);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={i % 2 === 0 ? "2" : "1"}
              strokeLinecap="round"
              opacity={i % 2 === 0 ? "0.6" : "0.3"}
            />
          );
        })}

        {/* Needle */}
        <g
          transform={`rotate(${rotation} 100 100)`}
          className="transition-transform duration-500 ease-out"
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="52"
            stroke="url(#needleGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow)"
          />
          {/* Needle tip */}
          <circle
            cx="100"
            cy="52"
            r="3"
            fill="hsl(var(--primary))"
            filter="url(#glow)"
          />
        </g>

        {/* Center hub */}
        <circle
          cx="100"
          cy="100"
          r="6"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />

        {/* Speed display */}
        <text
          x="100"
          y="140"
          textAnchor="middle"
          className="fill-foreground font-bold tabular-nums"
          style={{ fontSize: "36px" }}
        >
          {Math.round(displaySpeed)}
        </text>
        <text
          x="100"
          y="152"
          textAnchor="middle"
          className="fill-info-label uppercase tracking-wider"
          style={{ fontSize: "8px" }}
        >
          km/h
        </text>
      </svg>
    </div>
  );
};
