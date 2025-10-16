import { useEffect, useState } from "react";

interface SpeedometerProps {
  speed: number;
  maxSpeed?: number;
}

export const Speedometer = ({ speed, maxSpeed = 200 }: SpeedometerProps) => {
  const fraction = Math.min(speed / maxSpeed, 1);
  const rotation = fraction * 270 - 135;
  const percentage = fraction * 100;

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

          {/* Speed glow */}
          <radialGradient id="speedGlow">
            <stop offset="0%" stopColor="hsl(193 100% 50%)" />
            <stop offset="100%" stopColor="hsla(193, 100%, 50%, 0)" />
          </radialGradient>

          {/* Needle gradient */}
          <linearGradient id="needleGradient">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#fff" />
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
          fill="url(#speedGlow)"
          opacity={Math.min(fraction, 0.4)}
        />

        {/* Background arc */}
        <path
          d="M 38 162 A 88 88 0 1 1 162 162"
          fill="none"
          stroke="hsl(var(--gauge-track))"
          strokeWidth="8"
          strokeLinecap="round"
          className="transition-all duration-500"
        />

        {/* Speed arc with gradient */}
        <path
          d="M 38 162 A 88 88 0 1 1 162 162"
          fill="none"
          stroke="url(#speedGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="416"
          strokeDashoffset={415 - 415 * fraction}
          className="transition-all duration-500"
          filter="url(#glow)"
        />

        {/* Speed markers */}
        {Array.from({ length: 11 }).map((_, i) => {
          const angle = 135 + i * 27;
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
          transform={`rotate(${rotation})`}
          className="transition-transform duration-500 ease-out"
          style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="46"
            stroke="#fffb"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Needle tip */}
          <circle
            cx="100"
            cy="46"
            r="1.5"
            fill="hsl(var(--primary))"
            filter="url(#glow)"
          />
        </g>

        {/* Center hub */}
        <circle
          cx="100"
          cy="100"
          r="8"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
        />

        {/* Speed display */}
        <text
          x="100"
          y="140"
          textAnchor="middle"
          className="fill-foreground font-bold tabular-nums"
          style={{ fontSize: "28px" }}
        >
          {Math.round(speed)}
        </text>
        <text
          x="100"
          y="152"
          textAnchor="middle"
          className="fill-info-label uppercase tracking-wider"
          style={{ fontSize: "6px" }}
        >
          km/h
        </text>
      </svg>
    </div>
  );
};
