/**
 * AeroVista Scenic Seat Recommendation Engine
 */

export function recommendSeatSide(trajectoryData, preference = 'sunset') {
  const waypoints = trajectoryData.waypoints;
  
  let leftScoreAccum = 0;
  let rightScoreAccum = 0;
  let maxPossibleScore = 0;

  const highlights = [];
  const timelineEvents = [];

  // Track key solar events
  let sunsetWaypoints = [];
  let sunriseWaypoints = [];
  let goldenHourWaypoints = [];

  waypoints.forEach((wp, idx) => {
    maxPossibleScore += 10;
    
    const elev = wp.sunElevation;
    const side = wp.sunSide; // 'LEFT', 'RIGHT', 'AHEAD', 'BEHIND'
    const isGolden = wp.isGoldenHour;

    if (isGolden) goldenHourWaypoints.push(wp);
    if (isGolden && elev > 0 && elev < 6) {
      if (idx < waypoints.length / 2) sunriseWaypoints.push(wp);
      else sunsetWaypoints.push(wp);
    }

    let leftPts = 0;
    let rightPts = 0;

    switch (preference) {
      case 'sunset':
        // High reward for side facing sun during golden hour / sunset
        if (isGolden || (elev >= 0 && elev <= 15)) {
          if (side === 'LEFT') leftPts += 10;
          if (side === 'RIGHT') rightPts += 10;
        } else if (elev > 15) {
          // Daylight sun
          if (side === 'LEFT') leftPts += 4;
          if (side === 'RIGHT') rightPts += 4;
        } else {
          // Night
          leftPts += 2;
          rightPts += 2;
        }
        break;

      case 'sunrise':
        if (isGolden || (elev >= -4 && elev <= 12)) {
          if (side === 'LEFT') leftPts += 10;
          if (side === 'RIGHT') rightPts += 10;
        } else if (elev > 12) {
          if (side === 'LEFT') leftPts += 5;
          if (side === 'RIGHT') rightPts += 5;
        } else {
          leftPts += 1;
          rightPts += 1;
        }
        break;

      case 'daylight':
        // Reward sunlit side during day
        if (elev > 0) {
          if (side === 'LEFT') leftPts += 8;
          if (side === 'RIGHT') rightPts += 8;
        } else if (isGolden) {
          if (side === 'LEFT') leftPts += 10;
          if (side === 'RIGHT') rightPts += 10;
        } else {
          leftPts += 1;
          rightPts += 1;
        }
        break;

      case 'shade':
        // Reverse: reward side OPPOSITE to the sun to avoid direct glare
        if (elev > 0) {
          if (side === 'LEFT') rightPts += 10; // Right side is in shade if sun is on Left
          if (side === 'RIGHT') leftPts += 10;
        } else {
          leftPts += 5;
          rightPts += 5;
        }
        break;

      default:
        leftPts += 5;
        rightPts += 5;
    }

    leftScoreAccum += leftPts;
    rightScoreAccum += rightPts;
  });

  // Calculate normalized percentages (0-100%)
  let leftScore = Math.min(98, Math.max(15, Math.round((leftScoreAccum / maxPossibleScore) * 100)));
  let rightScore = Math.min(98, Math.max(15, Math.round((rightScoreAccum / maxPossibleScore) * 100)));

  // If scores are very close, adjust contrast for UI clarity
  if (Math.abs(leftScore - rightScore) < 5) {
    if (leftScore >= rightScore) leftScore += 5;
    else rightScore += 5;
  }

  let recommendedSide = 'LEFT';
  if (rightScore > leftScore + 5) {
    recommendedSide = 'RIGHT';
  } else if (Math.abs(leftScore - rightScore) <= 5) {
    recommendedSide = 'EITHER';
  }

  // Generate Rationale Text & Highlights
  const originCode = trajectoryData.origin.iata;
  const destCode = trajectoryData.dest.iata;
  const prefName = preference.toUpperCase();

  let title = '';
  let summary = '';

  if (recommendedSide === 'LEFT') {
    title = `Choose LEFT Window (Seats A/B/C)`;
    summary = `The sun & primary scenic view will align on your LEFT (Port) side during the ${trajectoryData.durationHours}hr flight from ${originCode} to ${destCode}.`;
    highlights.push(`Sun position favors Left window for ${leftScore}% of flight duration.`);
  } else if (recommendedSide === 'RIGHT') {
    title = `Choose RIGHT Window (Seats E/F/K)`;
    summary = `The primary view & solar trajectory will align on your RIGHT (Starboard) side as you fly from ${originCode} to ${destCode}.`;
    highlights.push(`Sun position favors Right window for ${rightScore}% of flight duration.`);
  } else {
    title = `Either Side (Left or Right Window)`;
    summary = `Both sides of the aircraft will offer balanced lighting and atmospheric views along the route from ${originCode} to ${destCode}.`;
    highlights.push(`Balanced lighting on both Port and Starboard sides.`);
  }

  if (goldenHourWaypoints.length > 0) {
    const firstGH = goldenHourWaypoints[0];
    highlights.push(`Golden hour starts at ${firstGH.timeString} over Lat ${firstGH.lat.toFixed(1)}°, Lng ${firstGH.lng.toFixed(1)}°.`);
  }

  if (trajectoryData.origin.scenic && trajectoryData.origin.scenic.length > 0) {
    highlights.push(`Nearby departure landmarks: ${trajectoryData.origin.scenic.join(', ')}.`);
  }

  // Build Flight Timeline Cards
  // Takeoff
  timelineEvents.push({
    time: waypoints[0].timeString,
    icon: '🛫',
    title: `Departure from ${originCode}`,
    desc: `Takeoff heading ${Math.round(waypoints[0].heading)}°. Initial sun position: Elevation ${waypoints[0].sunElevation.toFixed(1)}° (${waypoints[0].sunSide} side).`
  });

  // Mid-flight / Golden Hour event
  if (goldenHourWaypoints.length > 0) {
    const midGH = goldenHourWaypoints[Math.floor(goldenHourWaypoints.length / 2)];
    timelineEvents.push({
      time: midGH.timeString,
      icon: preference === 'sunrise' ? '🌄' : '🌅',
      title: `${preference === 'sunrise' ? 'Sunrise' : 'Sunset'} Golden Hour Window`,
      desc: `Sun at elevation ${midGH.sunElevation.toFixed(1)}° on ${midGH.sunSide} window. Prime photography time over Lat ${midGH.lat.toFixed(1)}°!`
    });
  } else {
    const midWp = waypoints[Math.floor(waypoints.length / 2)];
    timelineEvents.push({
      time: midWp.timeString,
      icon: '✈️',
      title: `Cruising Altitude Peak View`,
      desc: `Sun elevation ${midWp.sunElevation.toFixed(1)}° on ${midWp.sunSide} window. Flight distance ${Math.round(midWp.distanceKm)} km.`
    });
  }

  // Landing
  const lastWp = waypoints[waypoints.length - 1];
  timelineEvents.push({
    time: lastWp.timeString,
    icon: '🛬',
    title: `Arrival at ${destCode}`,
    desc: `Final descent into ${destCode}. Final sun position: Elevation ${lastWp.sunElevation.toFixed(1)}°.`
  });

  return {
    recommendedSide,
    leftScore,
    rightScore,
    title,
    summary,
    highlights,
    timelineEvents
  };
}
