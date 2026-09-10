export type GPSPositionData = {
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  latitude: number;
  longitude: number;
  speed: number;
};

export type GPSHistoryData = {
  timestamp: number;
  coords: GPSPositionData;
};

export function toGPSHistoryData(geo: GeolocationPosition): GPSHistoryData {
  const {
    latitude,
    longitude,
    altitude,
    accuracy,
    altitudeAccuracy,
    heading,
    speed,
  } = geo.coords;

  return {
    timestamp: geo.timestamp,
    coords: {
      latitude,
      longitude,
      altitude,
      accuracy,
      heading,
      altitudeAccuracy,
      speed,
    },
  };
}
