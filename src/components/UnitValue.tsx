import { ReactNode } from "react";
import styles from "./UnitValue.module.scss";

interface UnitValueProps {
  value: ReactNode;
  unit?: ReactNode;
}

export const UnitValue = ({ value, unit }: UnitValueProps) => {
  return (
    <>
      <span className={styles.value}>{value}</span>&nbsp;
      <span className={styles.unit}>{unit}</span>
    </>
  );
};
