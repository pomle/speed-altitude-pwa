import { ReactNode } from "react";
import styles from "./InfoCard.module.scss";

interface InfoCardProps {
  label: string | ReactNode;
  value: string | number;
  icon?: ReactNode;
  unit?: string;
}

export const InfoCard = ({ label, value, icon, unit }: InfoCardProps) => {
  return (
    <div className={styles.card}>
      {icon}
      <div className={styles.data}>
        <label>{label}</label>
        <div>
          <span className={styles.value}>—</span>{" "}
          <span className={styles.unit}>{unit}</span>
        </div>
      </div>
    </div>
  );
};
