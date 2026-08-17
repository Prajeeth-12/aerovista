/**
 * AeroVista Solar & Great Circle Flight Path Math Engine
 */

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/**
 * Calculates distance (in kilometers) between two coordinates using Haversine formula
 */
export function calculateHaversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * DEG2RAD;
  const dLng = (lng2 - lng1) * DEG2RAD;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * DEG2RAD) * Math.cos(lat2 * DEG2RAD) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates initial heading/bearing from point 1 to point 2 (0 - 360 degrees)
 */
export function calculateBearing(lat1, lng1, lat2, lng2) {
  const phi1 = lat1 * DEG2RAD;
  const phi2 = lat2 * DEG2RAD;
  const dLam = (lng2 - lng1) * DEG2RAD;

  const y = Math.sin(dLam) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLam);
  const theta = Math.atan2(y, x);
  return (theta * RAD2DEG + 360) % 360;
}

/**
 * Interpolates points along a Great Circle arc between origin and destination
 */
export function calculateGreatCirclePath(lat1, lng1, lat2, lng2, numPoints = 50) {
  const points = [];
  const phi1 = lat1 * DEG2RAD;
  const lam1 = lng1 * DEG2RAD;
  const phi2 = lat2 * DEG2RAD;
  const lam2 = lng2 * DEG2RAD;

  // Angular distance
  const d = 2 * Math.asin(Math.sqrt(
    Math.pow(Math.sin((phi1 - phi2) / 2), 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.pow(Math.sin((lam1 - lam2) / 2), 2)
  ));

  if (d === 0) {
    return [{ lat: lat1, lng: lng1, heading: 0, fraction: 0 }];
  }

  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);

    const x = A * Math.cos(phi1) * Math.cos(lam1) + B * Math.cos(phi2) * Math.cos(lam2);
    const y = A * Math.cos(phi1) * Math.sin(lam1) + B * Math.cos(phi2) * Math.sin(lam2);
    const z = A * Math.sin(phi1) + B * Math.sin(phi2);

    const latRad = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lngRad = Math.atan2(y, x);

    const curLat = latRad * RAD2DEG;
    const curLng = lngRad * RAD2DEG;

    points.push({
      lat: curLat,
      lng: curLng,
      fraction: f
    });
  }

  // Calculate bearings between consecutive points
  for (let i = 0; i < points.length; i++) {
    if (i < points.length - 1) {
      points[i].heading = calculateBearing(points[i].lat, points[i].lng, points[i + 1].lat, points[i + 1].lng);
    } else {
      points[i].heading = points[i - 1].heading;
    }
  }

  return points;
}

/**
 * NOAA Solar Position Algorithm
 * Computes Solar Azimuth (0-360°) and Solar Elevation (-90 to +90°) for any Lat/Lng and UTC Date
 */
export function getSunPosition(lat, lng, dateObj) {
  // Convert date to UTC Julian Day / Julian Century
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  const hours = dateObj.getUTCHours() + dateObj.getUTCMinutes() / 60 + dateObj.getUTCSeconds() / 3600;

  // Julian Date calculation
  let A_year = year;
  let B_month = month;
  if (month <= 2) {
    A_year = year - 1;
    B_month = month + 12;
  }
  const A = Math.floor(A_year / 100);
  const B = 2 - A + Math.floor(A / 4);

  const JD = Math.floor(365.25 * (A_year + 4716)) + Math.floor(30.6001 * (B_month + 1)) + day + B - 1524.5 + (hours / 24);
  const T = (JD - 2451545.0) / 36525.0; // Julian Century

  // Geom Mean Long Sun (degrees)
  let L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
  if (L0 < 0) L0 += 360;

  // Geom Mean Anom Sun (degrees)
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);

  // Sun Eq of Ctr
  const C = Math.sin(M * DEG2RAD) * (1.914602 - T * (0.004817 + 0.000014 * T)) +
            Math.sin(2 * M * DEG2RAD) * (0.019993 - 0.000101 * T) +
            Math.sin(3 * M * DEG2RAD) * 0.000289;

  // Sun True Long (deg) & Apparent Long (deg)
  const sunTrueLong = L0 + C;
  const sunAppLong = sunTrueLong - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * T) * DEG2RAD);

  // Mean Obliq Ecliptic (deg) & Obliq Corr (deg)
  const meanObliq = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
  const obliqCorr = meanObliq + 0.00256 * Math.cos((125.04 - 1934.136 * T) * DEG2RAD);

  // Sun Declination (deg)
  const declination = Math.asin(Math.sin(obliqCorr * DEG2RAD) * Math.sin(sunAppLong * DEG2RAD)) * RAD2DEG;

  // Equation of Time (minutes)
  const y = Math.pow(Math.tan((obliqCorr / 2) * DEG2RAD), 2);
  const eqOfTime = 4 * RAD2DEG * (
    y * Math.sin(2 * L0 * DEG2RAD) -
    2 * 0.0167086 * Math.sin(M * DEG2RAD) +
    4 * 0.0167086 * y * Math.sin(M * DEG2RAD) * Math.cos(2 * L0 * DEG2RAD) -
    0.5 * y * y * Math.sin(4 * L0 * DEG2RAD) -
    1.25 * 0.0167086 * 0.0167086 * Math.sin(2 * M * DEG2RAD)
  );

  // True Solar Time (minutes)
  const solarTimeFix = eqOfTime + 4 * lng;
  const trueSolarTime = (hours * 60 + solarTimeFix + 1440) % 1440;

  // Hour Angle (degrees)
  let hourAngle = trueSolarTime / 4 - 180;
  if (hourAngle < -180) hourAngle += 360;

  // Solar Zenith & Elevation Angle (degrees)
  const latRad = lat * DEG2RAD;
  const decRad = declination * DEG2RAD;
  const haRad = hourAngle * DEG2RAD;

  let csz = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
  csz = Math.max(-1, Math.min(1, csz));
  const zenith = Math.acos(csz) * RAD2DEG;
  const elevation = 90 - zenith;

  // Solar Azimuth Angle (degrees from North clockwise)
  let azimuth = 0;
  const azNum = Math.sin(latRad) * Math.cos(zenith * DEG2RAD) - Math.sin(decRad);
  const azDenom = Math.cos(latRad) * Math.sin(zenith * DEG2RAD);
  if (Math.abs(azDenom) > 0.00001) {
    let azRad = Math.acos(Math.max(-1, Math.min(1, azNum / azDenom)));
    if (hourAngle > 0) {
      azimuth = (azRad * RAD2DEG + 180) % 360;
    } else {
      azimuth = (540 - azRad * RAD2DEG) % 360;
    }
  }

  return {
    azimuth,
    elevation,
    declination,
    zenith
  };
}

/**
 * Determines relative position of the sun to the aircraft heading
 * Heading: 0° N, 90° E, 180° S, 270° W
 * Return: { side: 'LEFT' | 'RIGHT' | 'AHEAD' | 'BEHIND', angleFromAircraft: 0-360 }
 */
export function getSunSideRelative(heading, solarAzimuth) {
  const relAngle = (solarAzimuth - heading + 360) % 360;
  
  let side = 'RIGHT';
  if (relAngle > 180) {
    side = 'LEFT'; // Port side
  }
  
  if (relAngle >= 340 || relAngle <= 20) {
    side = 'AHEAD';
  } else if (relAngle >= 160 && relAngle <= 200) {
    side = 'BEHIND';
  }

  return {
    side,
    angleFromAircraft: relAngle
  };
}

/**
 * Comprehensive Flight Solar Trajectory Solver
 */
export function analyzeFlightSolarTrajectory(originAirport, destAirport, departureUtcDate, durationHours, numWaypoints = 40) {
  const pathWaypoints = calculateGreatCirclePath(
    originAirport.lat, originAirport.lng,
    destAirport.lat, destAirport.lng,
    numWaypoints
  );

  const totalDistKm = calculateHaversineDistance(
    originAirport.lat, originAirport.lng,
    destAirport.lat, destAirport.lng
  );

  const durationMs = durationHours * 3600 * 1000;
  const departureMs = departureUtcDate.getTime();

  const waypoints = pathWaypoints.map((wp, idx) => {
    const timestampMs = departureMs + wp.fraction * durationMs;
    const currentUtcDate = new Date(timestampMs);
    
    const sunPos = getSunPosition(wp.lat, wp.lng, currentUtcDate);
    const sunRel = getSunSideRelative(wp.heading, sunPos.azimuth);

    let isGoldenHour = sunPos.elevation >= -4 && sunPos.elevation <= 8;
    let isDaylight = sunPos.elevation > 0;
    let isNight = sunPos.elevation < -6;

    return {
      index: idx,
      fraction: wp.fraction,
      lat: wp.lat,
      lng: wp.lng,
      heading: wp.heading,
      timestamp: currentUtcDate,
      timeString: currentUtcDate.toISOString().substring(11, 16) + ' UTC',
      distanceKm: totalDistKm * wp.fraction,
      sunAzimuth: sunPos.azimuth,
      sunElevation: sunPos.elevation,
      sunSide: sunRel.side,
      sunRelAngle: sunRel.angleFromAircraft,
      isGoldenHour,
      isDaylight,
      isNight
    };
  });

  return {
    origin: originAirport,
    dest: destAirport,
    totalDistanceKm: totalDistKm,
    durationHours,
    departureTime: departureUtcDate,
    waypoints
  };
}
