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
      {/* Outer ring with gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-dashboard-gauge to-dashboard-bg p-4">
        {/* Main gauge background */}
        <div className="w-full h-full rounded-full bg-dashboard-bg flex items-center justify-center relative overflow-hidden">
          {/* Speed glow effect */}
          <div 
            className="absolute inset-0 rounded-full opacity-20 blur-3xl transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle, hsl(var(--speed-glow)) 0%, transparent 70%)`,
              opacity: Math.min(percentage / 100, 0.4),
            }}
          />
          
          {/* Gauge track */}
          <svg className="absolute inset-4" viewBox="0 0 200 200">
            {/* Background arc */}
            <path
              d="M 30 170 A 85 85 0 1 1 170 170"
              fill="none"
              stroke="hsl(var(--gauge-track))"
              strokeWidth="12"
              strokeLinecap="round"
            />
            
            {/* Speed arc with gradient */}
            <defs>
              <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(193 100% 70%)" />
              </linearGradient>
            </defs>
            <path
              d="M 30 170 A 85 85 0 1 1 170 170"
              fill="none"
              stroke="url(#speedGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="401"
              strokeDashoffset={401 - (401 * percentage) / 100}
              className="transition-all duration-500 drop-shadow-[0_0_8px_hsl(var(--primary))]"
            />
            
            {/* Speed markers */}
            {Array.from({ length: 11 }).map((_, i) => {
              const angle = -135 + (i * 27);
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
          </svg>

          {/* Needle */}
          <div
            className="absolute w-1 h-24 origin-bottom transition-transform duration-500 ease-out"
            style={{
              background: "linear-gradient(to top, hsl(var(--primary)), hsl(var(--foreground)))",
              transform: `rotate(${rotation}deg)`,
              bottom: "50%",
              left: "calc(50% - 2px)",
              boxShadow: "0 0 12px hsl(var(--primary))",
            }}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
          </div>

          {/* Center hub */}
          <div className="absolute w-6 h-6 rounded-full bg-secondary border-2 border-primary shadow-lg z-10" />

          {/* Speed display */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center">
            <div className="text-6xl font-bold text-foreground tabular-nums tracking-tight">
              {Math.round(displaySpeed)}
            </div>
            <div className="text-sm text-info-label uppercase tracking-wider mt-1">km/h</div>
          </div>
        </div>
      </div>
    </div>
  );
};
