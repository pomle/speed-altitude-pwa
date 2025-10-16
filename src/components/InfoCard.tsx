import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface InfoCardProps {
  label: string | ReactNode;
  value: string | number;
  icon?: ReactNode;
  unit?: string;
}

export const InfoCard = ({ label, value, icon, unit }: InfoCardProps) => {
  return (
    <Card className="bg-card border-border p-4 flex items-center gap-3">
      {icon && (
        <div className="text-primary flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-info-label uppercase tracking-wider mb-1">
          {label}
        </div>
        <div className="text-xl font-bold text-foreground tabular-nums truncate">
          {value}
          {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
        </div>
      </div>
    </Card>
  );
};
