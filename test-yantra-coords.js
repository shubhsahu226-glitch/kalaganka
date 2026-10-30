// Test mathematical coordinates of Samrat Yantra
const latDeg = 26.9124;
const latRad = latDeg * Math.PI / 180;
const cosLat = Math.cos(latRad);
const sinLat = Math.sin(latRad);
const tanLat = Math.tan(latRad);

const baseLength = 28.0;
const height = baseLength * tanLat;
const R = 14.0;

// Center of quadrant circle
const Cy = R * cosLat;
const s = Cy / sinLat;
const Cz = -baseLength / 2 + s * cosLat;

console.log('Latitude:', latDeg);
console.log('Gnomon Height at South Apex:', height.toFixed(2), 'm');
console.log('Quadrant Center Cy:', Cy.toFixed(2), 'm, Cz:', Cz.toFixed(2), 'm');

for (let hour = 0; hour <= 6; hour++) {
  const theta = (hour / 6) * (Math.PI / 2);
  const Y = Cy - R * Math.cos(theta) * cosLat;
  const X = R * Math.sin(theta);
  const Z = Cz + R * Math.cos(theta) * sinLat;
  console.log(`Hour ${hour} (theta=${(theta*180/Math.PI).toFixed(1)}°): X=${X.toFixed(2)}m, Y=${Y.toFixed(2)}m, Z=${Z.toFixed(2)}m`);
}

