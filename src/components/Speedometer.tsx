import { memo, useEffect, useMemo, useState } from "react";
import styles from "./Speedometer.module.scss";
import { createTimer } from "../lib/timer";
import { spring } from "@pomle/tween";

const Markers = memo(() => {
  const arc = 270;
  const lines = 25;
  const offset = arc / (lines - 1);

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
}

export const Speedometer = ({
  label,
  speed,
  maxSpeed = 200,
}: SpeedometerProps) => {
  const [speedProxy, setSpeedProxy] = useState(speed);

  const tween = useMemo(() => {
    return spring({ speed: 0 }, { mass: 400, friction: 30, stiffness: 50 });
  }, []);

  useEffect(() => {
    const timer = createTimer((dt) => {
      if (tween.update(dt)) {
        setSpeedProxy(tween.value.speed);
      }
    });

    timer.start();

    return () => {
      timer.stop();
    };
  }, [tween]);

  useEffect(() => {
    tween.to({ speed });
  }, [tween, speed, maxSpeed]);

  const fraction = Math.min(speedProxy / maxSpeed, 1);
  const rotation = fraction * 270 - 135;

  return (
    <svg viewBox="0 0 200 200">
      <defs>
        <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#00c8ff"></stop>
          <stop offset="100%" stop-color="hsl(193 100% 70%)"></stop>
        </linearGradient>
        <radialGradient id="speedGlow">
          <stop offset="0%" stop-color="hsl(193 100% 50%)"></stop>
          <stop offset="100%" stop-color="hsla(193, 100%, 50%, 0)"></stop>
        </radialGradient>
        <linearGradient id="needleGradient">
          <stop offset="0%" stop-color="#fff"></stop>
          <stop offset="100%" stop-color="#fff"></stop>
        </linearGradient>
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
        opacity="0"
        className={styles.glow}
      ></circle>
      <path
        d="M 38 162 A 88 88 0 1 1 162 162"
        fill="none"
        stroke="hsl(220 26% 18%)"
        stroke-width="8"
        stroke-linecap="round"
      ></path>
      <path
        d="M 38 162 A 88 88 0 1 1 162 162"
        fill="none"
        stroke="url(#speedGradient)"
        stroke-width="4"
        stroke-linecap="round"
        stroke-dasharray="416"
        stroke-dashoffset={415 - 415 * fraction}
        className={styles.speedBar}
        filter="url(#glow)"
      ></path>
      <g stroke="hsl(215 20.2% 65.1%)">
        <Markers />
      </g>
      <g className={styles.needle} transform={`rotate(${rotation})`}>
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="46"
          stroke="#fffb"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <circle
          cx="100"
          cy="46"
          r="1.5"
          fill="#00c8ff"
          filter="url(#glow)"
        ></circle>
      </g>
      <circle
        cx="100"
        cy="100"
        r="8"
        fill="#1a212d"
        stroke="#00c8ff"
        stroke-width="1"
      ></circle>
      <text
        x="100"
        y="140"
        text-anchor="middle"
        fill="#f8fafc"
        style={{ fontSize: "28px" }}
      >
        {speed}
      </text>
      <text
        x="100"
        y="152"
        text-anchor="middle"
        className={styles.label}
        fill="#94a3b8"
        style={{ fontSize: "6px" }}
      >
        {label}
      </text>
    </svg>
  );
};
