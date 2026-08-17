import { estimateSunPosition, calcDistance, estimateFlightDuration } from './solar-engine';

export function recommendSeatSide(waypoints, startTime, preference = 'scenic') {
  let leftScore = 0;
  let rightScore = 0;

  const originWp = waypoints[0];
  const destWp = waypoints[waypoints.length - 1];
  const distanceKm = calcDistance(originWp.lat, originWp.lng, destWp.lat, destWp.lng);
  const flightHours = estimateFlightDuration(distanceKm);
  const flightDurationMs = flightHours * 60 * 60 * 1000;
  const timeStepMs = flightDurationMs / waypoints.length;

  const timeline = [];

  waypoints.forEach((wp, index) => {
    const currentTime = new Date(startTime.getTime() + index * timeStepMs);
    const sun = estimateSunPosition(wp.lat, wp.lng, currentTime);

    const relativeAngle = ((sun.azimuth - wp.heading) + 360) % 360;
    const isSunOnLeft = relativeAngle > 180 && relativeAngle < 360;
    const isSunOnRight = relativeAngle > 0 && relativeAngle < 180;

    let leftPoints = 0;
    let rightPoints = 0;

    if (preference === 'sunrise') {
      if (sun.isSunrise) {
        leftPoints = isSunOnLeft ? 15 : 0;
        rightPoints = isSunOnRight ? 15 : 0;
      } else if (sun.isGoldenHour) {
        leftPoints = isSunOnLeft ? 5 : 0;
        rightPoints = isSunOnRight ? 5 : 0;
      }
    } else if (preference === 'sunset') {
      if (sun.isSunset) {
        leftPoints = isSunOnLeft ? 15 : 0;
        rightPoints = isSunOnRight ? 15 : 0;
      } else if (sun.isGoldenHour) {
        leftPoints = isSunOnLeft ? 5 : 0;
        rightPoints = isSunOnRight ? 5 : 0;
      }
    } else if (preference === 'shade') {
      if (sun.isDay) {
        leftPoints = isSunOnLeft ? 0 : 3;
        rightPoints = isSunOnRight ? 0 : 3;
      }
    } else {
      // 'scenic' — balanced: sunrise/sunset heavily weighted, day moderately
      if (sun.isSunrise || sun.isSunset) {
        leftPoints = isSunOnLeft ? 12 : 0;
        rightPoints = isSunOnRight ? 12 : 0;
      } else if (sun.isGoldenHour) {
        leftPoints = isSunOnLeft ? 6 : 0;
        rightPoints = isSunOnRight ? 6 : 0;
      } else if (sun.isDay) {
        leftPoints = isSunOnLeft ? 2 : 0;
        rightPoints = isSunOnRight ? 2 : 0;
      }
    }

    leftScore += leftPoints;
    rightScore += rightPoints;

    timeline.push({
      index,
      lat: wp.lat,
      lng: wp.lng,
      heading: wp.heading,
      time: currentTime,
      sun,
      relativeAngle,
      sunSide: isSunOnLeft ? 'left' : isSunOnRight ? 'right' : 'ahead',
      leftPoints,
      rightPoints,
    });
  });

  const total = leftScore + rightScore;
  const winner = leftScore >= rightScore ? 'left' : 'right';
  const rawConfidence = total > 0 ? Math.abs(leftScore - rightScore) / total : 0;
  const confidence = Math.min(Math.round(rawConfidence * 80 + 20), 99);

  let reasoning;
  if (preference === 'sunrise') {
    reasoning = winner === 'left'
      ? 'Left side captures the sunrise best on this heading.'
      : 'Right side faces the sunrise on this route.';
  } else if (preference === 'sunset') {
    reasoning = winner === 'left'
      ? 'Left side offers premium sunset views throughout the flight.'
      : 'Right side provides the best sunset visibility.';
  } else if (preference === 'shade') {
    reasoning = winner === 'left'
      ? 'Left side stays shaded for most of the flight.'
      : 'Right side avoids direct sunlight longer.';
  } else {
    reasoning = winner === 'left'
      ? 'Left side offers the best overall scenic views including sunrise/sunset.'
      : 'Right side provides optimal sun visibility and scenic moments.';
  }

  return {
    winner,
    leftScore,
    rightScore,
    confidence,
    reasoning,
    flightDurationHours: Math.round(flightHours * 10) / 10,
    distanceKm: Math.round(distanceKm),
    timeline,
    preference,
  };
}
