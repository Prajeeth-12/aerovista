const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

export function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * DEG2RAD;
  const dLng = (lng2 - lng1) * DEG2RAD;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * DEG2RAD) * Math.cos(lat2 * DEG2RAD) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function estimateFlightDuration(distanceKm) {
  const cruiseSpeedKmh = 885;
  const taxiAndClimbMinutes = 25;
  const descentMinutes = 20;
  const cruiseHours = distanceKm / cruiseSpeedKmh;
  return (cruiseHours * 60 + taxiAndClimbMinutes + descentMinutes) / 60;
}

export function generateGreatCircle(lat1, lng1, lat2, lng2, points = 100) {
  const waypoints = [];
  for (let i = 0; i <= points; i++) {
    const fraction = i / points;
    waypoints.push(intermediatePoint(lat1, lng1, lat2, lng2, fraction));
  }
  return waypoints;
}

function intermediatePoint(lat1, lng1, lat2, lng2, fraction) {
  const d = calcDistance(lat1, lng1, lat2, lng2) / 6371;

  if (d < 0.000001) {
    return { lat: lat1, lng: lng1, heading: 0 };
  }

  const a = Math.sin((1 - fraction) * d) / Math.sin(d);
  const b = Math.sin(fraction * d) / Math.sin(d);

  const x =
    a * Math.cos(lat1 * DEG2RAD) * Math.cos(lng1 * DEG2RAD) +
    b * Math.cos(lat2 * DEG2RAD) * Math.cos(lng2 * DEG2RAD);
  const y =
    a * Math.cos(lat1 * DEG2RAD) * Math.sin(lng1 * DEG2RAD) +
    b * Math.cos(lat2 * DEG2RAD) * Math.sin(lng2 * DEG2RAD);
  const z =
    a * Math.sin(lat1 * DEG2RAD) + b * Math.sin(lat2 * DEG2RAD);

  const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * RAD2DEG;
  const lng = Math.atan2(y, x) * RAD2DEG;

  const nextFraction = Math.min(fraction + 0.01, 1);
  const nextD = calcDistance(lat1, lng1, lat2, lng2) / 6371;
  const na = Math.sin((1 - nextFraction) * nextD) / Math.sin(nextD);
  const nb = Math.sin(nextFraction * nextD) / Math.sin(nextD);
  const nx = na * Math.cos(lat1 * DEG2RAD) * Math.cos(lng1 * DEG2RAD) + nb * Math.cos(lat2 * DEG2RAD) * Math.cos(lng2 * DEG2RAD);
  const ny = na * Math.cos(lat1 * DEG2RAD) * Math.sin(lng1 * DEG2RAD) + nb * Math.cos(lat2 * DEG2RAD) * Math.sin(lng2 * DEG2RAD);
  const nz = na * Math.sin(lat1 * DEG2RAD) + nb * Math.sin(lat2 * DEG2RAD);
  const nextLat = Math.atan2(nz, Math.sqrt(nx * nx + ny * ny)) * RAD2DEG;
  const nextLng = Math.atan2(ny, nx) * RAD2DEG;

  const heading = calculateHeading(lat, lng, nextLat, nextLng);

  return { lat, lng, heading };
}

function calculateHeading(lat1, lng1, lat2, lng2) {
  const dLng = (lng2 - lng1) * DEG2RAD;
  const y = Math.sin(dLng) * Math.cos(lat2 * DEG2RAD);
  const x = Math.cos(lat1 * DEG2RAD) * Math.sin(lat2 * DEG2RAD) -
            Math.sin(lat1 * DEG2RAD) * Math.cos(lat2 * DEG2RAD) * Math.cos(dLng);
  return (Math.atan2(y, x) * RAD2DEG + 360) % 360;
}

export function estimateSunPosition(lat, lng, date) {
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const diff = date - start;
  const dayOfYear = Math.floor(diff / 86400000) + 1;

  // NOAA solar declination
  const B = (360 / 365) * (dayOfYear - 81) * DEG2RAD;
  const declination = 23.45 * Math.sin(B);

  // Equation of time (minutes)
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

  // True solar time
  const solarNoonOffset = lng / 15;
  const trueSolarTime = hour + solarNoonOffset + EoT / 60;
  const hourAngle = (trueSolarTime - 12) * 15;

  // Solar elevation
  const latRad = lat * DEG2RAD;
  const decRad = declination * DEG2RAD;
  const haRad = hourAngle * DEG2RAD;

  const sinElevation =
    Math.sin(latRad) * Math.sin(decRad) +
    Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
  const elevation = Math.asin(Math.max(-1, Math.min(1, sinElevation))) * RAD2DEG;

  // Solar azimuth (measured from north, clockwise)
  const cosAzimuth =
    (Math.sin(decRad) - Math.sin(latRad) * sinElevation) /
    (Math.cos(latRad) * Math.cos(Math.asin(sinElevation)));
  let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAzimuth))) * RAD2DEG;

  if (hourAngle > 0) {
    azimuth = 360 - azimuth;
  }

  const isDay = elevation > -0.833;
  const isSunrise = elevation > -6 && elevation < 6 && hourAngle < 0;
  const isSunset = elevation > -6 && elevation < 6 && hourAngle > 0;
  const isGoldenHour = elevation > 0 && elevation < 10;

  return {
    elevation,
    azimuth,
    isDay,
    isSunrise,
    isSunset,
    isGoldenHour,
    hourAngle,
    declination,
  };
}
