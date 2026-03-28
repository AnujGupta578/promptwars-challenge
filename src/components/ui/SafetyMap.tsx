'use client';

import React from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '250px',
  borderRadius: '0.75rem',
  marginTop: '1rem',
  border: '1px solid rgba(255, 255, 255, 0.1)'
};

interface SafetyMapProps {
  location: { lat: number; lng: number; label: string };
}

export default function SafetyMap({ location }: SafetyMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    const bounds = new window.google.maps.LatLngBounds(location);
    map.fitBounds(bounds);
  }, [location]);

  const onUnmount = React.useCallback(function callback() {
    // Optional clean up logic
  }, []);

  if (!isLoaded) return <div className="animate-pulse bg-white/5 h-[250px] w-full rounded-xl" />;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={location}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: darkModeStyles,
        disableDefaultUI: true,
      }}
    >
      <MarkerF position={location} label={location.label} />
    </GoogleMap>
  );
}

// Custom Dark Mode styles for Google Maps
const darkModeStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
];
