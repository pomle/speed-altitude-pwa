import { ReactNode } from "react";
import styles from "./InfoCard.module.scss";
import { UnitValue } from "./UnitValue";

interface InfoCardProps {
  label: string | ReactNode;
  value: string | number;
  icon?: ReactNode;
  unit?: string;
}

export const InfoCard = ({ label, value, icon, unit }: InfoCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.data}>
        <label>{label}</label>
        <div>
          <UnitValue value={value} unit={unit} />
        </div>
      </div>
    </div>
  );
};
