import { Speedometer } from "../components/Speedometer";
import { InfoCard } from "../components/InfoCard";
import { useGeolocation } from "../hooks/useGeolocation";
import VertIcon from "../icons/vert.svg?react";
import HoriIcon from "../icons/hori.svg?react";
import MountIcon from "../icons/mount.svg?react";
import UpIcon from "../icons/up-arrow.svg?react";
import styles from "./Index.module.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import { spring } from "@pomle/tween";
import { createTimer } from "../lib/timer";

const formatValue = (value: number | null, decimals = 1) => {
  return typeof value === "number" ? value.toFixed(decimals) : "—";
};

type CoordProxy = {
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  latitude: number;
  longitude: number;
  speed: number;
};

const DEFAULT: CoordProxy = {
  accuracy: 0,
  altitude: 0,
  altitudeAccuracy: 0,
  heading: 0,
  latitude: 0,
  longitude: 0,
  speed: 0,
};

const SPEED_UNITS = [
  { label: "km/h", multiplier: 3.6, max: 240 },
  { label: "mph", multiplier: 2.237, max: 160 },
  { label: "kts", multiplier: 1.944, max: 100 },
];

const Index = () => {
  const { position, error } = useGeolocation();

  const coords = position?.coords;

  const [coordProxy, setCoordProxy] = useState<CoordProxy>(DEFAULT);

  const [tween] = useState(() => {
    return spring(DEFAULT, { mass: 400, friction: 30, stiffness: 50 });
  });

  useEffect(() => {
    const timer = createTimer((dt) => {
      if (tween.update(dt)) {
        setCoordProxy({ ...tween.value });
      }
    });

    timer.start();

    return () => {
      timer.stop();
    };
  }, [tween]);

  useEffect(() => {
    if (coords) {
      tween.to(coords);
    }
  }, [tween, coords]);

  const [unit, setUnit] = useState(SPEED_UNITS[0]);

  const cycleUnit = useCallback(() => {
    setUnit((unit) => {
      const index = SPEED_UNITS.indexOf(unit) + 1;
      return SPEED_UNITS[index % SPEED_UNITS.length];
    });
  }, []);

  const speed = coordProxy ? coordProxy.speed * unit.multiplier : 0;
  const maxSpeed = unit.max;

  return (
    <div className={styles.Index}>
      <header>
        <InfoCard
          icon={<VertIcon />}
          label="Latitude"
          value={formatValue(coordProxy?.latitude, 6)}
          unit="°"
        />

        <InfoCard
          icon={<HoriIcon />}
          label="Longitude"
          value={formatValue(coordProxy?.longitude, 6)}
          unit="°"
        />
      </header>

      <main>
        <div className={styles.speedometer} onClick={cycleUnit}>
          <Speedometer speed={speed} maxSpeed={maxSpeed} label={unit.label} />
        </div>
      </main>

      <footer>
        <InfoCard
          icon={<MountIcon />}
          label="Altitude"
          value={formatValue(coordProxy?.altitude, 1)}
          unit="m"
        />

        <InfoCard
          icon={
            <UpIcon
              style={{ transform: `rotateZ(${coordProxy?.heading ?? 0})` }}
            />
          }
          label="Heading"
          value={formatValue(coordProxy?.heading, 0)}
          unit="°"
        />

        <InfoCard
          label="Positional Accuracy"
          value={formatValue(coordProxy?.accuracy, 1)}
          unit="m"
        />

        <InfoCard
          label="Altitudinal Accuracy"
          value={formatValue(coordProxy?.altitudeAccuracy, 1)}
          unit="m"
        />
      </footer>
    </div>
  );
};

export default Index;
