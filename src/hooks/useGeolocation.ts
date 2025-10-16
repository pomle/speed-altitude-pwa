import { useState, useEffect } from "react";

export const useGeolocation = () => {
  const [position, setPosition] = useState<GeolocationPosition>();
  const [error, setError] = useState<Error | GeolocationPositionError>();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error("Geolocation is not supported by your browser"));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(setPosition, setError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { position, error };
};
