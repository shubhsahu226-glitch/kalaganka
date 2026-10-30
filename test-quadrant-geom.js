const THREE = require('./frontend/node_modules/three');

function generateQuadrantMesh(latitude, isWest, radius = 14.0, width = 2.4) {
  const latRad = latitude * Math.PI / 180;
  const cosLat = Math.cos(latRad);
  const sinLat = Math.sin(latRad);
  const tanLat = Math.tan(latRad);

  const baseLength = 36.0;
  const yNoon = 0.4;
  const Cy = yNoon + radius * cosLat;
  const s = Cy / sinLat;
  const Cz = -baseLength / 2 + s * cosLat;

  // Axis vector u
  const ux = 0, uy = sinLat, uz = cosLat;
  // Plane vectors
  const ex = isWest ? -1 : 1; // X direction (West = -1, East = +1)
  const epx = 0, epy = cosLat, epz = -sinLat;

  const segments = 48;
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  // Generate a ribbon of width along u
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * (Math.PI / 2);
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    // Center of this cross section
    const arcX = ex * radius * sinT;
    const arcY = Cy - radius * cosT * epy;
    const arcZ = Cz - radius * cosT * epz;

    // Inner edge (closer to gnomon along -u)
    const p1x = arcX - (width / 2) * ux;
    const p1y = arcY - (width / 2) * uy;
    const p1z = arcZ - (width / 2) * uz;

    // Outer edge (further from gnomon along +u)
    const p2x = arcX + (width / 2) * ux;
    const p2y = arcY + (width / 2) * uy;
    const p2z = arcZ + (width / 2) * uz;

    // Normal points toward the axis u (inward toward center line)
    // For cylinder, normal is (P - C)/radius
    const nx = -ex * sinT;
    const ny = cosT * epy;
    const nz = cosT * epz;

    positions.push(p1x, p1y, p1z, p2x, p2y, p2z);
    normals.push(nx, ny, nz, nx, ny, nz);
    uvs.push(0, i / segments, 1, i / segments);

    if (i < segments) {
      const a = i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, c, b, d, c);
      // Double sided
      indices.push(a, c, b, b, c, d);
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  return geom;
}

const geom = generateQuadrantMesh(26.9124, true);
console.log('Quadrant mesh vertices count:', geom.attributes.position.count);
console.log('Quadrant mesh indices count:', geom.index.count);

