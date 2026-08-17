/**
 * AeroVista Leaflet Interactive Map & Solar Visualizer
 * Uses reliable public dark tile basemaps (Esri World Dark Canvas / OpenStreetMap dark)
 */

let mapInstance = null;
let routePolyline = null;
let aircraftMarker = null;
let sunRayPolyline = null;
let originMarker = null;
let destMarker = null;
let currentTrajectory = null;

/**
 * Initializes Leaflet map with reliable dark tile layer and auto-resize
 */
export function initMap(containerId = 'map') {
  const container = document.getElementById(containerId);
  if (!container) return null;

  if (mapInstance) {
    mapInstance.invalidateSize();
    return mapInstance;
  }

  // Create Leaflet Map
  mapInstance = L.map(containerId, {
    zoomControl: true,
    attributionControl: false,
    worldCopyJump: true
  }).setView([20, 0], 2);

  // Esri World Dark Canvas tile layer (No API key required, 100% reliable)
  const esriDark = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16,
    subdomains: ['a', 'b', 'c']
  });

  // CartoDB Dark Matter fallback
  const cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd'
  });

  // OpenStreetMap with CSS dark filter fallback
  const osmTile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    className: 'dark-map-tiles'
  });

  // Add primary layer
  esriDark.addTo(mapInstance);

  // Add fallback handler if tile fails
  esriDark.on('tileerror', () => {
    if (!mapInstance.hasLayer(cartoDark)) {
      cartoDark.addTo(mapInstance);
    }
  });

  // Trigger container size recalculation
  setTimeout(() => {
    mapInstance.invalidateSize();
  }, 250);

  window.addEventListener('resize', () => {
    if (mapInstance) mapInstance.invalidateSize();
  });

  return mapInstance;
}

/**
 * Renders Flight Route, Airport Markers, Aircraft Marker, and Solar Vector
 */
export function renderFlightRoute(trajectoryData) {
  if (!mapInstance) initMap();

  currentTrajectory = trajectoryData;
  const waypoints = trajectoryData.waypoints;
  const latLngs = waypoints.map(wp => [wp.lat, wp.lng]);

  // Clear existing layers
  if (routePolyline) mapInstance.removeLayer(routePolyline);
  if (aircraftMarker) mapInstance.removeLayer(aircraftMarker);
  if (sunRayPolyline) mapInstance.removeLayer(sunRayPolyline);
  if (originMarker) mapInstance.removeLayer(originMarker);
  if (destMarker) mapInstance.removeLayer(destMarker);

  // Draw Glowing Route Polyline
  routePolyline = L.polyline(latLngs, {
    color: '#6366f1',
    weight: 5,
    opacity: 0.9,
    lineCap: 'round',
    lineJoin: 'round',
    smoothFactor: 1
  }).addTo(mapInstance);

  // Fit bounds around flight route
  mapInstance.fitBounds(routePolyline.getBounds(), { padding: [60, 60] });

  // Custom Airport Markers
  const createAirportIcon = (code, city, isOrigin) => L.divIcon({
    className: 'custom-airport-badge',
    html: `
      <div style="
        background: ${isOrigin ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6366f1, #06b6d4)'};
        color: #ffffff;
        font-family: 'Fira Code', monospace;
        font-weight: 800;
        font-size: 11px;
        padding: 5px 10px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 4px 15px rgba(0,0,0,0.5), 0 0 12px ${isOrigin ? 'rgba(16,185,129,0.5)' : 'rgba(99,102,241,0.5)'};
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      ">
        <span>${isOrigin ? '🛫' : '🛬'}</span>
        <span>${code}</span>
      </div>
    `,
    iconSize: [60, 26],
    iconAnchor: [30, 13]
  });

  const originWp = waypoints[0];
  const destWp = waypoints[waypoints.length - 1];

  originMarker = L.marker([originWp.lat, originWp.lng], { icon: createAirportIcon(trajectoryData.origin.iata, trajectoryData.origin.city, true) })
    .bindTooltip(`Origin: ${trajectoryData.origin.city} (${trajectoryData.origin.name})`, { permanent: false })
    .addTo(mapInstance);

  destMarker = L.marker([destWp.lat, destWp.lng], { icon: createAirportIcon(trajectoryData.dest.iata, trajectoryData.dest.city, false) })
    .bindTooltip(`Destination: ${trajectoryData.dest.city} (${trajectoryData.dest.name})`, { permanent: false })
    .addTo(mapInstance);

  // Custom Animated Aircraft Icon
  const aircraftIcon = L.divIcon({
    className: 'custom-plane-marker',
    html: `
      <div id="plane-svg-wrapper" style="
        font-size: 28px;
        filter: drop-shadow(0 0 12px #06b6d4);
        transform-origin: center;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
      ">✈️</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  aircraftMarker = L.marker([originWp.lat, originWp.lng], { icon: aircraftIcon }).addTo(mapInstance);

  // Force map size recalculation & update waypoint 0
  setTimeout(() => {
    mapInstance.invalidateSize();
    updateScrubberPosition(0);
  }, 150);
}

/**
 * Updates airplane position and solar direction ray based on scrubber index
 */
export function updateScrubberPosition(index) {
  if (!currentTrajectory || !mapInstance) return;

  const waypoints = currentTrajectory.waypoints;
  const wpIndex = Math.max(0, Math.min(waypoints.length - 1, index));
  const wp = waypoints[wpIndex];

  // Update Aircraft Marker Position & Rotation
  if (aircraftMarker) {
    aircraftMarker.setLatLng([wp.lat, wp.lng]);
    const planeElem = document.getElementById('plane-svg-wrapper');
    if (planeElem) {
      planeElem.style.transform = `rotate(${wp.heading - 45}deg)`;
    }
  }

  // Draw Sun Ray Vector (Length ~ 350km extending towards sun azimuth)
  const sunAzimuthRad = wp.sunAzimuth * (Math.PI / 180);
  const rayLenKm = 350;
  const R = 6371;

  const latRad = wp.lat * (Math.PI / 180);
  const lngRad = wp.lng * (Math.PI / 180);

  const sunLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(rayLenKm / R) +
    Math.cos(latRad) * Math.sin(rayLenKm / R) * Math.cos(sunAzimuthRad)
  );

  const sunLngRad = lngRad + Math.atan2(
    Math.sin(sunAzimuthRad) * Math.sin(rayLenKm / R) * Math.cos(latRad),
    Math.cos(rayLenKm / R) - Math.sin(latRad) * Math.sin(sunLatRad)
  );

  const sunLat = sunLatRad * (180 / Math.PI);
  const sunLng = sunLngRad * (180 / Math.PI);

  if (sunRayPolyline) mapInstance.removeLayer(sunRayPolyline);

  // Color sun vector (Gold = Golden hour/Daylight, Cyan = Night)
  const sunColor = wp.isGoldenHour ? '#f59e0b' : (wp.isDaylight ? '#38bdf8' : '#818cf8');

  sunRayPolyline = L.polyline([[wp.lat, wp.lng], [sunLat, sunLng]], {
    color: sunColor,
    weight: 4,
    dashArray: '8, 8',
    opacity: 0.95
  }).addTo(mapInstance);

  // Update Scrubber UI Text Indicators
  const timeLabel = document.getElementById('scrubber-time-label');
  if (timeLabel) {
    timeLabel.innerText = `${wp.timeString} — ${Math.round(wp.fraction * 100)}% Flight Progress`;
  }

  const coordLabel = document.getElementById('waypoint-coord');
  if (coordLabel) {
    coordLabel.innerText = `Position: ${wp.lat.toFixed(2)}° N, ${Math.abs(wp.lng).toFixed(2)}° ${wp.lng >= 0 ? 'E' : 'W'} | Heading: ${Math.round(wp.heading)}°`;
  }

  const sunLabel = document.getElementById('waypoint-sun');
  if (sunLabel) {
    let state = wp.isGoldenHour ? '🌅 Golden Hour' : (wp.isDaylight ? '☀️ Daylight' : '🌙 Night Sky');
    sunLabel.innerText = `Sun Elevation: ${wp.sunElevation > 0 ? '+' : ''}${wp.sunElevation.toFixed(1)}° (${state}) — Sun on ${wp.sunSide} window`;
    sunLabel.style.color = wp.isGoldenHour ? 'var(--gold-accent)' : (wp.isDaylight ? 'var(--secondary-accent)' : 'var(--text-muted)');
  }
}
