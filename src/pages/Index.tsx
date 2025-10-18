import { Speedometer } from "../components/Speedometer";
import { InfoCard } from "../components/InfoCard";
import { useGeolocation } from "../hooks/useGeolocation";
import VertIcon from "../icons/vert.svg?react";
import HoriIcon from "../icons/hori.svg?react";
import MountIcon from "../icons/mount.svg?react";
import styles from "./Index.module.scss";
import { useEffect, useMemo, useState } from "react";
import { spring } from "@pomle/tween";
import { createTimer } from "../lib/timer";

const formatValue = (value: number | null, decimals = 1) => {
  return typeof value === "number" ? value.toFixed(decimals) : "—";
};

type CoordProxy = {
  latitude: number;
  longitude: number;
  speed: number;
  altitude: number;
  heading: number;
  altitudeAccuracy: number;
  accuracy: number;
};

const DEFAULT: CoordProxy = {
  latitude: 0,
  longitude: 0,
  speed: 0,
  altitude: 0,
  altitudeAccuracy: 0,
  heading: 0,
  accuracy: 0,
};

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

  const kph = coordProxy ? coordProxy.speed * 3.6 : 0;

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
        <div className={styles.speedometer}>
          <Speedometer speed={kph} maxSpeed={240} label="km/h" />
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
