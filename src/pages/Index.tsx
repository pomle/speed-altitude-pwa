import { Speedometer } from "../components/Speedometer";
import { InfoCard } from "../components/InfoCard";
import { useGeolocation } from "../hooks/useGeolocation";
import VertIcon from "../icons/vert.svg?react";
import HoriIcon from "../icons/hori.svg?react";
import MountIcon from "../icons/mount.svg?react";
import UpIcon from "../icons/up-arrow.svg?react";
import styles from "./Index.module.scss";
import { useCallback, useEffect, useState } from "react";
import { spring } from "@pomle/tween";
import { createTimer } from "../lib/timer";
import { GPSPositionData, toGPSHistoryData } from "@/lib/geo";
import { DisplayUnit } from "@/lib/unit";

function formatValue(value: number | null, decimals = 1) {
  return typeof value === "number" ? value.toFixed(decimals) : "—";
}

const DEFAULT: GPSPositionData = {
  accuracy: 0,
  altitude: 0,
  altitudeAccuracy: 0,
  heading: 0,
  latitude: 0,
  longitude: 0,
  speed: 0,
};

const Units: Record<string, DisplayUnit> = {
  KNOTS: { label: "kts", multiplier: 1.944, max: 80, ticks: 16 },
  KPH: { label: "km/h", multiplier: 3.6, max: 240, ticks: 48 },
  MPH: { label: "mph", multiplier: 2.237, max: 160, ticks: 24 },
  MPS: { label: "m/s", multiplier: 1, max: 100, ticks: 20 },
} as const;

const UnitCycleOrder: DisplayUnit[] = [
  Units.KPH,
  Units.MPH,
  Units.KNOTS,
  Units.MPS,
] as const;

const Index = () => {
  const { geo } = useGeolocation();

  const [display, setDisplay] = useState<GPSPositionData>(DEFAULT);

  const [unit, setUnit] = useState(UnitCycleOrder[0]);

  const cycleUnit = useCallback(() => {
    setUnit((unit) => {
      const index = UnitCycleOrder.indexOf(unit) + 1;
      return UnitCycleOrder[index % UnitCycleOrder.length];
    });
  }, []);

  const [tween] = useState(() => {
    return spring(DEFAULT, {
      mass: 100,
      friction: 20,
      stiffness: 100,
      precision: 0.000001,
    });
  });

  useEffect(() => {
    const timer = createTimer((dt) => {
      if (tween.update(dt)) {
        setDisplay({ ...tween.value });
      }
    });

    timer.start();

    return () => {
      timer.stop();
    };
  }, [tween]);

  useEffect(() => {
    if (geo?.coords) {
      console.debug("Received GPS Data", geo.coords);
      tween.to(toGPSHistoryData(geo).coords);
    }
  }, [tween, unit, geo?.coords]);

  return (
    <div className={styles.Index}>
      <header>
        <InfoCard
          icon={<VertIcon />}
          label="Latitude"
          value={formatValue(display.latitude, 6)}
          unit="°"
        />

        <InfoCard
          icon={<HoriIcon />}
          label="Longitude"
          value={formatValue(display.longitude, 6)}
          unit="°"
        />
      </header>

      <main>
        <div className={styles.speedometer} onClick={cycleUnit}>
          <Speedometer
            speed={display.speed * unit.multiplier}
            maxSpeed={unit.max}
            label={unit.label}
            ticks={unit.ticks}
          />
        </div>
      </main>

      <footer>
        <InfoCard
          icon={<MountIcon />}
          label="Altitude"
          value={formatValue(display.altitude, 1)}
          unit="m"
        />

        <InfoCard
          icon={
            <div style={{ transform: `rotate(${display?.heading ?? 0}deg)` }}>
              <UpIcon />
            </div>
          }
          label="Heading"
          value={formatValue(display.heading, 0)}
          unit="°"
        />

        <InfoCard
          label="Positional Accuracy"
          value={formatValue(display.accuracy, 1)}
          unit="m"
        />

        <InfoCard
          label="Altitudinal Accuracy"
          value={formatValue(display.altitudeAccuracy, 1)}
          unit="m"
        />
      </footer>
    </div>
  );
};

export default Index;
