/**
 * AeroVista Global Airports Database & Scenic Route Presets
 */

export const AIRPORTS = [
  { iata: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', lat: 47.4582, lng: 8.5554, tz: 2, scenic: ['Swiss Alps', 'Lake Zurich', 'Rhine Valley'] },
  { iata: 'FCO', name: 'Rome Fiumicino Airport', city: 'Rome', country: 'Italy', lat: 41.8003, lng: 12.2389, tz: 2, scenic: ['Tyrrhenian Coast', 'Tuscan Hills', 'Colosseum'] },
  { iata: 'SFO', name: 'San Francisco Intl', city: 'San Francisco', country: 'USA', lat: 37.6213, lng: -122.3790, tz: -7, scenic: ['Golden Gate Bridge', 'Pacific Coastline', 'Redwood Forests'] },
  { iata: 'SEA', name: 'Seattle-Tacoma Intl', city: 'Seattle', country: 'USA', lat: 47.4502, lng: -122.3088, tz: -7, scenic: ['Mount Rainier', 'Puget Sound', 'Cascade Range'] },
  { iata: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', lat: 35.5494, lng: 139.7798, tz: 9, scenic: ['Mount Fuji', 'Tokyo Bay', 'Boso Peninsula'] },
  { iata: 'CTS', name: 'New Chitose Airport', city: 'Sapporo', country: 'Japan', lat: 42.7752, lng: 141.6923, tz: 9, scenic: ['Hokkaido Mountains', 'Ishikari Bay', 'Volcanic Ranges'] },
  { iata: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'UK', lat: 51.4700, lng: -0.4543, tz: 1, scenic: ['River Thames', 'English Channel', 'Cotswolds'] },
  { iata: 'JFK', name: 'John F. Kennedy Intl', city: 'New York', country: 'USA', lat: 40.6413, lng: -73.7781, tz: -4, scenic: ['Manhattan Skyline', 'Long Island Sound', 'Atlantic Ocean'] },
  { iata: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', lat: 25.2532, lng: 55.3657, tz: 4, scenic: ['Burj Khalifa', 'The Palm Jumeirah', 'Arabian Desert'] },
  { iata: 'MLE', name: 'Velana International', city: 'Male', country: 'Maldives', lat: 4.1918, lng: 73.5291, tz: 5, scenic: ['Coral Atolls', 'Turquoise Lagoons', 'Indian Ocean'] },
  { iata: 'SCL', name: 'Arturo Merino Benitez', city: 'Santiago', country: 'Chile', lat: -33.3930, lng: -70.7858, tz: -4, scenic: ['Andes Peaks', 'Maipo Valley', 'Pacific Horizon'] },
  { iata: 'EZE', name: 'Ministro Pistarini', city: 'Buenos Aires', country: 'Argentina', lat: -34.8222, lng: -58.5358, tz: -3, scenic: ['Rio de la Plata', 'Pampas Plains', 'Atlantic Delta'] },
  { iata: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles', country: 'USA', lat: 33.9416, lng: -118.4085, tz: -7, scenic: ['Santa Monica Bay', 'Hollywood Hills', 'Mojave Desert'] },
  { iata: 'ORD', name: 'Chicago O\'Hare Intl', city: 'Chicago', country: 'USA', lat: 41.9742, lng: -87.9073, tz: -5, scenic: ['Lake Michigan', 'Chicago Skyline', 'Midwest Plains'] },
  { iata: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris', country: 'France', lat: 49.0097, lng: 2.5479, tz: 2, scenic: ['Eiffel Tower', 'Seine River', 'Normandy Coast'] },
  { iata: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', lat: -33.9461, lng: 151.1772, tz: 10, scenic: ['Sydney Harbour Opera House', 'Bondi Coast', 'Blue Mountains'] },
  { iata: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', lat: 46.2370, lng: 6.1092, tz: 2, scenic: ['Mont Blanc', 'Lake Geneva', 'Jura Mountains'] },
  { iata: 'VIE', name: 'Vienna International', city: 'Vienna', country: 'Austria', lat: 48.1103, lng: 16.5697, tz: 2, scenic: ['Danube River', 'Austrian Alps', 'Vienna Basin'] },
  { iata: 'BCN', name: 'Barcelona El Prat', city: 'Barcelona', country: 'Spain', lat: 41.2974, lng: 2.0785, tz: 2, scenic: ['Mediterranean Coast', 'Montserrat', 'Sagrada Familia'] },
  { iata: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', lat: 48.3537, lng: 11.7861, tz: 2, scenic: ['Bavarian Alps', 'Neuschwanstein Region', 'Isar Valley'] }
];

export const PRESET_ROUTES = [
  {
    id: 'zrh-fco-sunset',
    title: 'Zurich ➔ Rome (Alps Sunset)',
    origin: 'ZRH',
    dest: 'FCO',
    date: '2026-08-17',
    time: '17:30',
    duration: 2.0,
    pref: 'sunset',
    description: 'Golden hour sunset over the Swiss & Italian Alps facing West.'
  },
  {
    id: 'sfo-sea-coast',
    title: 'San Francisco ➔ Seattle (Pacific & Cascades)',
    origin: 'SFO',
    dest: 'SEA',
    date: '2026-08-17',
    time: '18:15',
    duration: 2.2,
    pref: 'sunset',
    description: 'Scenic sunset along Pacific ocean coastline and Mt. Rainier.'
  },
  {
    id: 'hnd-cts-fuji',
    title: 'Tokyo ➔ Sapporo (Mt. Fuji Morning)',
    origin: 'HND',
    dest: 'CTS',
    date: '2026-08-18',
    time: '06:45',
    duration: 1.5,
    pref: 'sunrise',
    description: 'Morning sunrise lighting up Mt. Fuji peak on the left window.'
  },
  {
    id: 'lhr-jfk-atlantic',
    title: 'London ➔ New York (North Atlantic Daylight)',
    origin: 'LHR',
    dest: 'JFK',
    date: '2026-08-17',
    time: '11:00',
    duration: 7.5,
    pref: 'daylight',
    description: 'Transatlantic daytime flight following polar arc with glacier views.'
  },
  {
    id: 'dxb-mle-atolls',
    title: 'Dubai ➔ Male (Maldives Atolls)',
    origin: 'DXB',
    dest: 'MLE',
    date: '2026-08-18',
    time: '04:00',
    duration: 4.0,
    pref: 'sunrise',
    description: 'Sunrise over Indian Ocean with vibrant turquoise coral atolls.'
  },
  {
    id: 'scl-eze-andes',
    title: 'Santiago ➔ Buenos Aires (Andes Pass)',
    origin: 'SCL',
    dest: 'EZE',
    date: '2026-08-17',
    time: '16:00',
    duration: 2.0,
    pref: 'sunset',
    description: 'Breathtaking Andes mountain pass crossing right after takeoff.'
  }
];

export function getAirportByIata(code) {
  if (!code) return null;
  const clean = code.trim().toUpperCase();
  return AIRPORTS.find(a => a.iata === clean) || null;
}

export function searchAirports(query) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase().trim();
  return AIRPORTS.filter(a => 
    a.iata.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q) ||
    a.country.toLowerCase().includes(q)
  );
}
