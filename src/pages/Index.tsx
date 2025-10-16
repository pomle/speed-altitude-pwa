import { Speedometer } from "@/components/Speedometer";
import { InfoCard } from "@/components/InfoCard";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Navigation, Mountain, MoveVertical, MoveHorizontal, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const {
    latitude,
    longitude,
    altitude,
    speed,
    accuracy,
    altitudeAccuracy,
    error,
    loading,
  } = useGeolocation();

  const formatCoordinate = (value: number | null, decimals = 6) => {
    return value !== null ? value.toFixed(decimals) : "—";
  };

  const formatValue = (value: number | null, decimals = 1) => {
    return value !== null ? value.toFixed(decimals) : "—";
  };

  return (
    <div className="min-h-screen bg-dashboard-bg flex flex-col p-4 md:p-6 gap-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center text-info-label">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-2" />
          <p>Acquiring GPS signal...</p>
        </div>
      )}

      {/* Position & Altitude Info */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <InfoCard
              label={<><span className="md:hidden">LAT</span><span className="hidden md:inline">Latitude</span></>}
              value={formatCoordinate(latitude)}
              icon={<MoveVertical className="w-5 h-5" />}
              unit="°"
            />
            <InfoCard
              label={<><span className="md:hidden">LON</span><span className="hidden md:inline">Longitude</span></>}
              value={formatCoordinate(longitude)}
              icon={<MoveHorizontal className="w-5 h-5" />}
              unit="°"
            />
            <InfoCard
              label={<><span className="md:hidden">ALT</span><span className="hidden md:inline">Altitude</span></>}
              value={formatValue(altitude)}
              icon={<Mountain className="w-5 h-5" />}
              unit="m"
            />
          </div>

          {/* Speedometer */}
          <div className="flex-1 flex items-center justify-center py-8">
            <Speedometer speed={speed || 0} maxSpeed={200} />
          </div>

          {/* Accuracy Info */}
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <InfoCard
              label="Position Accuracy"
              value={formatValue(accuracy)}
              icon={<TrendingUp className="w-5 h-5" />}
              unit="m"
            />
            <InfoCard
              label="Altitude Accuracy"
              value={formatValue(altitudeAccuracy)}
              icon={<TrendingUp className="w-5 h-5" />}
              unit="m"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
