import { Speedometer } from "../components/Speedometer";
import { InfoCard } from "../components/InfoCard";
import { useGeolocation } from "../hooks/useGeolocation";
import VertIcon from "../icons/vert.svg?react";
import HoriIcon from "../icons/hori.svg?react";
import MountIcon from "../icons/mount.svg?react";
import styles from "./Index.module.scss";

const formatValue = (value: number | null, decimals = 1) => {
  return typeof value === "number" ? value.toFixed(decimals) : "—";
};

const Index = () => {
  const { position, error } = useGeolocation();

  const coords = position?.coords;

  const kph = coords?.speed ? coords.speed * 3.6 : 0;

  return (
    <div className={styles.Index}>
      <header>
        <InfoCard
          icon={<VertIcon />}
          label="Latitude"
          value={formatValue(coords?.latitude, 6)}
          unit="°"
        />

        <InfoCard
          icon={<HoriIcon />}
          label="Longitude"
          value={formatValue(coords?.longitude, 6)}
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
          value={formatValue(coords?.altitude, 1)}
          unit="m"
        />

        <InfoCard
          label="Heading"
          value={formatValue(coords?.heading, 0)}
          unit="°"
        />

        <InfoCard
          label="Positional Accuracy"
          value={formatValue(coords?.accuracy, 1)}
          unit="m"
        />

        <InfoCard
          label="Altitudinal Accuracy"
          value={formatValue(coords?.altitudeAccuracy, 1)}
          unit="m"
        />
      </footer>
    </div>
  );
};

export default Index;
