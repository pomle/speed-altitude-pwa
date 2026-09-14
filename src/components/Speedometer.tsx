import { memo } from "react";
import styles from "./Speedometer.module.scss";

const Markers = memo(({ ticks }: { ticks: number }) => {
  const arc = 270;
  const lines = ticks + 1;
  const offset = arc / ticks;

  return Array.from({ length: lines }).map((_, i) => {
    const angle = 135 + i * offset;
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
        strokeWidth={i % 2 === 0 ? "2" : "1"}
        strokeLinecap="round"
        opacity={i % 2 === 0 ? "0.6" : "0.3"}
      />
    );
  });
});

interface SpeedometerProps {
  speed: number;
  label: string;
  maxSpeed?: number;
  fractionDigits?: number;
  ticks: number;
}

export const Speedometer = ({
  label,
  speed,
  ticks,
  maxSpeed = 200,
  fractionDigits = 0,
}: SpeedometerProps) => {
  const fraction = Math.min(speed / maxSpeed, 1);
  const rotation = fraction * 270 - 135;

  return (
    <svg viewBox="0 0 200 200">
      <defs>
        <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00c8ff"></stop>
          <stop offset="100%" stopColor="hsl(193 100% 70%)"></stop>
        </linearGradient>
        <radialGradient id="speedGlow">
          <stop offset="0%" stopColor="hsl(193 100% 50%)"></stop>
          <stop offset="100%" stopColor="hsla(193, 100%, 50%, 0)"></stop>
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur
            stdDeviation="3"
            result="coloredBlur"
          ></feGaussianBlur>
          <feMerge>
            <feMergeNode in="coloredBlur"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
      </defs>
      <circle
        cx="100"
        cy="100"
        r="70"
        fill="url(#speedGlow)"
        opacity={Math.min(fraction, 0.4)}
        className={styles.glow}
      />
      <path
        d="M 38 162 A 88 88 0 1 1 162 162"
        fill="none"
        stroke="hsl(220 26% 18%)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 38 162 A 88 88 0 1 1 162 162"
        fill="none"
        stroke="url(#speedGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="416"
        strokeDashoffset={415 - 415 * fraction}
        className={styles.speedBar}
        filter="url(#glow)"
      />
      <g stroke="hsl(215 20.2% 65.1%)" className={styles.markers} key={ticks}>
        <Markers ticks={ticks} />
      </g>
      <g className={styles.needle} transform={`rotate(${rotation})`}>
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="46"
          stroke="#fffb"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="100" cy="46" r="1.5" fill="#00c8ff" filter="url(#glow)" />
      </g>
      <circle
        cx="100"
        cy="100"
        r="8"
        fill="#1a212d"
        stroke="#00c8ff"
        strokeWidth="1"
      />
      <text
        x="100"
        y="140"
        textAnchor="middle"
        fill="#f8fafc"
        style={{ fontSize: "28px" }}
      >
        {speed.toFixed(fractionDigits)}
      </text>
      <g key={label} className={styles.label}>
        <text
          x="100"
          y="152"
          textAnchor="middle"
          fill="#94a3b8"
          style={{ fontSize: "6px" }}
        >
          {label}
        </text>
      </g>
    </svg>
  );
};
