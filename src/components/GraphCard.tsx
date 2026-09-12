import { ReactNode, useMemo } from "react";
import styles from "./GraphCard.module.scss";

interface GraphCardProps {
  children: ReactNode;
}

export const GraphCard = ({ children }: GraphCardProps) => {
  return <div className={styles.graphCard}>{children}</div>;
};
