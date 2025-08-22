import { useState, useEffect } from 'react';

interface GeolocationState {
  hasLocation: boolean;
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    hasLocation: false,
    latitude: null,
    longitude: null,
    error: null,
    isLoading: true
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        isLoading: false
      }));
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        hasLocation: true,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        isLoading: false
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = 'Unable to retrieve location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    });
  }, []);

  return state;
}