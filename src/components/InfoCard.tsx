import { ReactNode } from "react";
import styles from "./InfoCard.module.scss";
import { UnitValue } from "./UnitValue";

interface InfoCardProps {
  label: string | ReactNode;
  icon?: ReactNode;
  children: ReactNode;
}

export const InfoCard = ({ label, children, icon }: InfoCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.data}>
        <label>{label}</label>
        <div>{children}</div>
      </div>
    </div>
  );
};
