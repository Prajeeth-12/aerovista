/**
 * AeroVista 2D Aircraft Cabin Seat Map & Window View Canvas Simulator
 */

let currentRecommendation = null;
let currentTrajectory = null;

/**
 * Renders 2D Cabin Layout with rated window seats
 */
export function renderSeatMap(containerId, recommendationResult, trajectoryData, onSeatSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  currentRecommendation = recommendationResult;
  currentTrajectory = trajectoryData;

  container.innerHTML = '';

  const totalRows = 16;
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];

  const isLeftBest = recommendationResult.recommendedSide === 'LEFT';
  const isRightBest = recommendationResult.recommendedSide === 'RIGHT';

  for (let r = 1; r <= totalRows; r++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'cabin-row';

    // Left Window Seat (A)
    const seatA = createSeatElement(r, 'A', true, false, recommendationResult.leftScore, isLeftBest);
    rowDiv.appendChild(seatA);

    // Left Middle (B) & Aisle (C)
    rowDiv.appendChild(createSeatElement(r, 'B', false, false, recommendationResult.leftScore - 10, isLeftBest));
    rowDiv.appendChild(createSeatElement(r, 'C', false, true, recommendationResult.leftScore - 20, isLeftBest));

    // Row Number Label
    const rowNum = document.createElement('div');
    rowNum.className = 'row-num';
    rowNum.innerText = r;
    rowDiv.appendChild(rowNum);

    // Right Aisle (D) & Middle (E)
    rowDiv.appendChild(createSeatElement(r, 'D', false, false, recommendationResult.rightScore - 20, isRightBest));
    rowDiv.appendChild(createSeatElement(r, 'E', false, false, recommendationResult.rightScore - 10, isRightBest));

    // Right Window Seat (F)
    const seatF = createSeatElement(r, 'F', true, false, recommendationResult.rightScore, isRightBest);
    rowDiv.appendChild(seatF);

    container.appendChild(rowDiv);
  }

  // Attach click listener for window simulator
  container.querySelectorAll('.seat-col').forEach(seatElem => {
    seatElem.addEventListener('click', () => {
      container.querySelectorAll('.seat-col').forEach(s => s.classList.remove('selected'));
      seatElem.classList.add('selected');

      const row = seatElem.dataset.row;
      const col = seatElem.dataset.col;
      const score = seatElem.dataset.score;
      const side = seatElem.dataset.side;

      if (onSeatSelect) {
        onSeatSelect({ row, col, score, side });
      }
      openWindowViewModal(row, col, score, side);
    });
  });
}

function createSeatElement(row, col, isWindow, isAisleGap, score, isRecommendedSide) {
  const seat = document.createElement('div');
  seat.className = `seat-col ${isAisleGap ? 'aisle-gap' : ''}`;
  if (col === 'A') seat.classList.add('window-left');
  if (col === 'F') seat.classList.add('window-right');

  const side = (col === 'A' || col === 'B' || col === 'C') ? 'LEFT' : 'RIGHT';

  if (isWindow) {
    if (score >= 85) seat.classList.add('best-scenic');
    else if (score >= 65) seat.classList.add('good-scenic');
    else if (score < 40 && isRecommendedSide === false) seat.classList.add('glare-sun');
  }

  seat.dataset.row = row;
  seat.dataset.col = col;
  seat.dataset.score = score;
  seat.dataset.side = side;
  seat.innerText = `${row}${col}`;

  return seat;
}

/**
 * Draws Simulated Airplane Window Horizon View on Canvas
 */
export function openWindowViewModal(row, col, score, side) {
  const modal = document.getElementById('window-modal');
  if (!modal) return;

  modal.classList.add('active');

  const titleElem = document.getElementById('modal-seat-title');
  if (titleElem) titleElem.innerText = `Window View Preview — Seat ${row}${col} (${side === 'LEFT' ? 'Left Port Window' : 'Right Starboard Window'})`;

  const sideVerdict = document.getElementById('modal-side-verdict');
  if (sideVerdict) {
    sideVerdict.innerText = `${side} WINDOW (${side === currentRecommendation.recommendedSide ? 'TOP RECOMMENDED' : 'SECONDARY VIEW'})`;
    sideVerdict.style.color = side === currentRecommendation.recommendedSide ? 'var(--emerald-accent)' : 'var(--secondary-accent)';
  }

  const ratingScore = document.getElementById('modal-rating-score');
  if (ratingScore) ratingScore.innerText = `${score} / 100`;

  // Draw Canvas Horizon View
  const canvas = document.getElementById('window-canvas');
  if (canvas && currentTrajectory) {
    drawWindowHorizonCanvas(canvas, side, currentTrajectory);
  }
}

function drawWindowHorizonCanvas(canvas, side, trajectoryData) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Get mid-flight waypoint sun data
  const midWp = trajectoryData.waypoints[Math.floor(trajectoryData.waypoints.length / 2)];
  const elev = midWp.sunElevation;
  const isSunOnThisSide = midWp.sunSide === side;

  // Sky Gradient based on sun elevation
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.75);
  
  if (elev > 15) {
    // Bright Daylight
    skyGrad.addColorStop(0, '#1e3a8a');
    skyGrad.addColorStop(0.6, '#3b82f6');
    skyGrad.addColorStop(1, '#93c5fd');
  } else if (elev >= -4 && elev <= 15) {
    // Golden Hour Sunset / Sunrise
    skyGrad.addColorStop(0, '#4c1d95');
    skyGrad.addColorStop(0.4, '#c026d3');
    skyGrad.addColorStop(0.7, '#f97316');
    skyGrad.addColorStop(1, '#fde047');
  } else {
    // Night / Deep Twilight
    skyGrad.addColorStop(0, '#030712');
    skyGrad.addColorStop(0.7, '#0f172a');
    skyGrad.addColorStop(1, '#1e1b4b');
  }

  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Draw Stars if night
  if (elev < 0) {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 40; i++) {
      const sx = (Math.sin(i * 99) * 0.5 + 0.5) * w;
      const sy = (Math.cos(i * 33) * 0.5 + 0.5) * (h * 0.6);
      ctx.beginPath();
      ctx.arc(sx, sy, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw Sun Disk if sun is on this side and above horizon
  if (isSunOnThisSide && elev > -5) {
    const sunY = h * 0.7 - (elev / 60) * (h * 0.5);
    const sunX = w * 0.5;

    // Sun Glow
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 60);
    sunGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
    sunGlow.addColorStop(0.3, elev < 10 ? 'rgba(245, 158, 11, 0.9)' : 'rgba(254, 240, 138, 0.9)');
    sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');

    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 60, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw Horizon Cloud Layer / Alpine Peaks
  ctx.fillStyle = elev > 0 ? '#1e293b' : '#090d16';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, h * 0.72);
  
  // Mountain silhouettes
  for (let x = 0; x <= w; x += 40) {
    const peakH = h * 0.72 - Math.sin(x * 0.02) * 20 - Math.cos(x * 0.05) * 15;
    ctx.lineTo(x, peakH);
  }
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Draw Airplane Wing Silhouette (Left or Right)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.beginPath();
  if (side === 'LEFT') {
    ctx.moveTo(0, h);
    ctx.lineTo(w * 0.35, h * 0.65);
    ctx.lineTo(w * 0.5, h);
  } else {
    ctx.moveTo(w, h);
    ctx.lineTo(w * 0.65, h * 0.65);
    ctx.lineTo(w * 0.5, h);
  }
  ctx.closePath();
  ctx.fill();

  // Update modal sun elevation label
  const sunElevElem = document.getElementById('modal-sun-elevation');
  if (sunElevElem) {
    sunElevElem.innerText = `${elev > 0 ? '+' : ''}${elev.toFixed(1)}° (${midWp.isGoldenHour ? 'Golden Hour' : (midWp.isDaylight ? 'Daylight' : 'Night')})`;
  }
}
