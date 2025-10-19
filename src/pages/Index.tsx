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

function formatValue(value: number | null, decimals = 1) {
  return typeof value === "number" ? value.toFixed(decimals) : "—";
};

type GPSData = {
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  latitude: number;
  longitude: number;
  speed: number;
  maxSpeed: number;
};

const DEFAULT: GPSData = {
  accuracy: 0,
  altitude: 0,
  altitudeAccuracy: 0,
  heading: 0,
  latitude: 0,
  longitude: 0,
  speed: 0,
  maxSpeed: 100,
};

const KNOTS = { label: "kts", multiplier: 1.944, max: 80, ticks: 16, };
const KPH = { label: "km/h", multiplier: 3.6, max: 240, ticks: 48, };
const MPH = { label: "mph", multiplier: 2.237, max: 160, ticks: 24, };
const MPS = { label: "m/s", multiplier: 1, max: 100, ticks: 20, };

const SPEED_UNITS = [KPH, MPH, KNOTS, MPS];

const Index = () => {
  const { geo } = useGeolocation();

  const [data, setData] = useState<GPSData>(DEFAULT);

  const [unit, setUnit] = useState(KPH);

  const cycleUnit = useCallback(() => {
    setUnit((unit) => {
      const index = SPEED_UNITS.indexOf(unit) + 1;
      return SPEED_UNITS[index % SPEED_UNITS.length];
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
        setData({ ...tween.value });
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
      const {
        latitude,
        longitude,
        altitude,
        accuracy,
        altitudeAccuracy,
        heading,
        speed,
      } = geo.coords;

      tween.to({
        latitude,
        longitude,
        altitude,
        accuracy,
        heading,
        altitudeAccuracy,
        speed: speed * unit.multiplier,
        maxSpeed: unit.max,
      });
    }
  }, [tween, unit, geo?.coords]);

  return (
    <div className={styles.Index}>
      <header>
        <InfoCard
          icon={<VertIcon />}
          label="Latitude"
          value={formatValue(data.latitude, 6)}
          unit="°"
        />

        <InfoCard
          icon={<HoriIcon />}
          label="Longitude"
          value={formatValue(data.longitude, 6)}
          unit="°"
        />
      </header>

      <main>
        <div className={styles.speedometer} onClick={cycleUnit}>
          <Speedometer
            speed={data.speed}
            maxSpeed={data.maxSpeed}
            label={unit.label}
            ticks={unit.ticks}
          />
        </div>
      </main>

      <footer>
        <InfoCard
          icon={<MountIcon />}
          label="Altitude"
          value={formatValue(data.altitude, 1)}
          unit="m"
        />

        <InfoCard
          icon={
            <div style={{ transform: `rotate(${data?.heading ?? 0}deg)` }}>
              <UpIcon />
            </div>
          }
          label="Heading"
          value={formatValue(data.heading, 0)}
          unit="°"
        />

        <InfoCard
          label="Positional Accuracy"
          value={formatValue(data.accuracy, 1)}
          unit="m"
        />

        <InfoCard
          label="Altitudinal Accuracy"
          value={formatValue(data.altitudeAccuracy, 1)}
          unit="m"
        />
      </footer >
    </div >
  );
};

export default Index;
