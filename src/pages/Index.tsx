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

const KNOTS = { label: "kts", multiplier: 1.944, max: 100 };
const KPH = { label: "km/h", multiplier: 3.6, max: 240 };
const MPH = { label: "mph", multiplier: 2.237, max: 160 };

const SPEED_UNITS = [KPH, MPH, KNOTS];

const Index = () => {
  const { geo } = useGeolocation();

  const [coords, setCoords] = useState<CoordProxy>(DEFAULT);

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
        setCoords({ ...tween.value });
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
      tween.to(geo.coords);
    }
  }, [tween, geo?.coords]);

  const [unit, setUnit] = useState(SPEED_UNITS[0]);

  const cycleUnit = useCallback(() => {
    setUnit((unit) => {
      const index = SPEED_UNITS.indexOf(unit) + 1;
      return SPEED_UNITS[index % SPEED_UNITS.length];
    });
  }, []);

  const speed = coords.speed * unit.multiplier;
  const maxSpeed = unit.max;

  return (
    <div className={styles.Index}>
      <header>
        <InfoCard
          icon={<VertIcon />}
          label="Latitude"
          value={formatValue(coords.latitude, 6)}
          unit="°"
        />

        <InfoCard
          icon={<HoriIcon />}
          label="Longitude"
          value={formatValue(coords.longitude, 6)}
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
          value={formatValue(coords.altitude, 1)}
          unit="m"
        />

        <InfoCard
          icon={
            <UpIcon style={{ transform: `rotateZ(${coords?.heading ?? 0})` }} />
          }
          label="Heading"
          value={formatValue(coords.heading, 0)}
          unit="°"
        />

        <InfoCard
          label="Positional Accuracy"
          value={formatValue(coords.accuracy, 1)}
          unit="m"
        />

        <InfoCard
          label="Altitudinal Accuracy"
          value={formatValue(coords.altitudeAccuracy, 1)}
          unit="m"
        />
      </footer>
    </div>
  );
};

export default Index;
