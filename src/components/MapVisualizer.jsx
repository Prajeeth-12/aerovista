import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';

const DEG2RAD = Math.PI / 180;

const planeIcon = L.divIcon({
  html: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="color:var(--color-accent)"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function makeMarker(color) {
  return L.divIcon({
    html: `<div style="width:10px;height:10px;background:${color};border-radius:50%;border:2px solid white;box-shadow:0 0 0 1px ${color}, 0 2px 6px rgba(0,0,0,0.2);"></div>`,
    className: '',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

function sunMarker() {
  return L.divIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
      <div style="width:20px;height:20px;background:var(--color-sun);border-radius:50%;box-shadow:0 0 10px var(--color-sun), 0 0 24px color-mix(in srgb, var(--color-sun) 40%, transparent);"></div>
      <span style="font-family:var(--font-mono);font-size:8px;font-weight:600;color:var(--color-sun);background:var(--color-bg-elevated);padding:1px 4px;border-radius:3px;border:1px solid var(--color-border);">SUN</span>
    </div>`,
    className: '',
    iconSize: [20, 34],
    iconAnchor: [10, 10],
  });
}

const defaultCenter = [22, 78];
const defaultZoom = 5;

function MapUpdater({ waypoints }) {
  const map = useMap();
  React.useEffect(() => {
    if (waypoints && waypoints.length > 0) {
      const bounds = L.latLngBounds(waypoints.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 7 });
    }
  }, [waypoints, map]);
  return null;
}

function computeSunPosition(recommendation, waypoints) {
  if (!recommendation?.timeline || !waypoints?.length) return null;
  const midIdx = Math.floor(recommendation.timeline.length / 2);
  const midEntry = recommendation.timeline[midIdx];
  if (!midEntry || !midEntry.sun.isDay) return null;

  const midLat = waypoints[midIdx].lat;
  const midLng = waypoints[midIdx].lng;
  const sunBearing = midEntry.sun.azimuth * DEG2RAD;
  const offsetDeg = 300 / 111;
  const sunLat = midLat + offsetDeg * Math.cos(sunBearing);
  const sunLng = midLng + offsetDeg * Math.sin(sunBearing) / Math.cos(midLat * DEG2RAD);

  return { position: [sunLat, sunLng], planePosition: [midLat, midLng] };
}

export function MapVisualizer({ waypoints, recommendation, isDark }) {
  const path = waypoints ? waypoints.map(wp => [wp.lat, wp.lng]) : [];
  const sunData = useMemo(() => computeSunPosition(recommendation, waypoints), [recommendation, waypoints]);

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative flex-1 rounded-xl overflow-hidden border border-[var(--color-border)]"
    >
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
        key={isDark ? 'dark' : 'light'}
      >
        <TileLayer url={tileUrl} subdomains="abcd" maxZoom={19} />
        {path.length > 0 && (
          <>
            <Polyline
              positions={path}
              pathOptions={{ color: 'var(--color-accent)', weight: 2.5, opacity: 0.9, dashArray: '6, 5' }}
              className="animated-path"
            />
            <Marker position={path[0]} icon={makeMarker('var(--color-accent)')}>
              <Popup><span style={{ fontFamily: 'Inter', fontSize: '12px' }}>Origin</span></Popup>
            </Marker>
            <Marker position={path[path.length - 1]} icon={makeMarker('var(--color-right)')}>
              <Popup><span style={{ fontFamily: 'Inter', fontSize: '12px' }}>Destination</span></Popup>
            </Marker>
            <Marker position={path[Math.floor(path.length / 2)]} icon={planeIcon} />

            {sunData && (
              <>
                <Polyline
                  positions={[sunData.planePosition, sunData.position]}
                  pathOptions={{ color: 'var(--color-sun)', weight: 1.5, opacity: 0.5, dashArray: '4, 6' }}
                />
                <Marker position={sunData.position} icon={sunMarker()} />
              </>
            )}
            <MapUpdater waypoints={waypoints} />
          </>
        )}
      </MapContainer>
    </motion.div>
  );
}
