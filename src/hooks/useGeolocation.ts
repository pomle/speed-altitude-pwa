import { useState, useEffect } from "react";

interface GeolocationData {
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  speed: number | null;
  accuracy: number | null;
  altitudeAccuracy: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [data, setData] = useState<GeolocationData>({
    latitude: null,
    longitude: null,
    altitude: null,
    speed: null,
    accuracy: null,
    altitudeAccuracy: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setData((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false,
      }));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { coords } = position;
        setData({
          latitude: coords.latitude,
          longitude: coords.longitude,
          altitude: coords.altitude,
          speed: coords.speed ? coords.speed * 3.6 : 0, // Convert m/s to km/h
          accuracy: coords.accuracy,
          altitudeAccuracy: coords.altitudeAccuracy,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setData((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return data;
};
