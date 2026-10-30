/**
 * High-Precision Procedural Samrat Yantra Architectural Model.
 * Matches the exact geometry of Brihat Samrat Yantra, Jantar Mantar, Jaipur.
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useKalaStore } from '../store/useKalaStore';

export function SamratYantra() {
  const latitude = useKalaStore((state) => state.latitude);

  // Convert latitude to radians
  const latRad = useMemo(() => THREE.MathUtils.degToRad(latitude), [latitude]);
  const cosLat = useMemo(() => Math.cos(latRad), [latRad]);
  const sinLat = useMemo(() => Math.sin(latRad), [latRad]);
  const tanLat = useMemo(() => Math.tan(latRad), [latRad]);

  // Dimensions of the monument in meters
  const baseLength = 36.0; // Length along North-South axis
  const height = baseLength * tanLat; // South apex height
  const gnomonThickness = 2.4; // Thickness of central masonry wall
  const halfThick = gnomonThickness / 2;
  const quadrantRadius = 14.0; // Radius of marble quadrant arc
  const quadrantWidth = 2.4; // Width of marble face along axial direction

  // Center C = (0, Cy, Cz) on hypotenuse for the equinoctial quadrant circle
  const yNoon = 0.35; // Height at solar noon touching ground level
  const Cy = yNoon + quadrantRadius * cosLat;
  const s = Cy / sinLat;
  const Cz = -baseLength / 2 + s * cosLat;

  // Unit vector along gnomon hypotenuse axis (from North base to South apex)
  const u = useMemo(() => new THREE.Vector3(0, sinLat, cosLat).normalize(), [sinLat, cosLat]);

  // Materials with PBR Indian heritage properties
  const materials = useMemo(() => {
    // Red-brown Jaipur sandstone
    const sandstone = new THREE.MeshStandardMaterial({
      color: '#B55A40',
      roughness: 0.82,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    // Darker foundation stone for plinths, coping, and steps
    const foundationStone = new THREE.MeshStandardMaterial({
      color: '#7D3522',
      roughness: 0.88,
      metalness: 0.05
    });

    // Polished white Makrana marble for the graduated quadrant arcs
    const marble = new THREE.MeshStandardMaterial({
      color: '#FAF8F5',
      roughness: 0.28,
      metalness: 0.02,
      side: THREE.DoubleSide
    });

    // Antique royal brass for finials, Kalasha, and scale trim
    const brass = new THREE.MeshStandardMaterial({
      color: '#C5A059',
      roughness: 0.22,
      metalness: 0.88
    });

    return { sandstone, foundationStone, marble, brass };
  }, []);

  // 1. Direct BufferGeometry for Gnomon Triangular Prism (Zero rotation bugs)
  const gnomonGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const northZ = -baseLength / 2;
    const southZ = baseLength / 2;

    // 6 vertices of the right triangular prism:
    // East side (X = +halfThick):
    // 0: North ground (halfThick, 0, northZ)
    // 1: South ground (halfThick, 0, southZ)
    // 2: South apex   (halfThick, height, southZ)
    // West side (X = -halfThick):
    // 3: North ground (-halfThick, 0, northZ)
    // 4: South ground (-halfThick, 0, southZ)
    // 5: South apex   (-halfThick, height, southZ)

    const positions = [
      // East triangular wall (Facing +X)
      halfThick, 0, northZ,
      halfThick, 0, southZ,
      halfThick, height, southZ,

      // West triangular wall (Facing -X)
      -halfThick, 0, southZ,
      -halfThick, 0, northZ,
      -halfThick, height, southZ,

      // South vertical rectangular wall (Facing +Z)
      halfThick, 0, southZ,
      -halfThick, 0, southZ,
      -halfThick, height, southZ,
      halfThick, 0, southZ,
      -halfThick, height, southZ,
      halfThick, height, southZ,

      // Bottom ground rectangular base (Facing -Y)
      halfThick, 0, northZ,
      -halfThick, 0, northZ,
      -halfThick, 0, southZ,
      halfThick, 0, northZ,
      -halfThick, 0, southZ,
      halfThick, 0, southZ,

      // Sloping hypotenuse ramp (Facing Up/North-East-West)
      halfThick, 0, northZ,
      halfThick, height, southZ,
      -halfThick, height, southZ,
      halfThick, 0, northZ,
      -halfThick, height, southZ,
      -halfThick, 0, northZ
    ];

    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.computeVertexNormals();
    return geom;
  }, [baseLength, height, halfThick]);

  // 2. Central Ramp Staircase Steps
  const stepsCount = 48;
  const staircaseSteps = useMemo(() => {
    const steps = [];
    const stepLength = baseLength / stepsCount;
    for (let i = 0; i < stepsCount; i++) {
      const z = -baseLength / 2 + (i + 0.5) * stepLength;
      const progress = (i + 1) / stepsCount;
      const y = progress * height;
      steps.push({ z, y, key: i });
    }
    return steps;
  }, [baseLength, height, stepsCount]);

  // 3. Procedural Marble Quadrant Ribbon Geometry
  const createQuadrantGeometry = (isWest) => {
    const segments = 48;
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    const xSign = isWest ? -1 : 1; // West = -X, East = +X

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * (Math.PI / 2); // 0 to 90 degrees (Noon to 6h)
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      // Arc center line
      const arcX = xSign * (halfThick + quadrantRadius * sinT);
      const arcY = Cy - quadrantRadius * cosT * cosLat;
      const arcZ = Cz + quadrantRadius * cosT * sinLat;

      // Inner and outer edges of the ribbon along hypotenuse axis u
      const p1x = arcX - (quadrantWidth / 2) * u.x;
      const p1y = arcY - (quadrantWidth / 2) * u.y;
      const p1z = arcZ - (quadrantWidth / 2) * u.z;

      const p2x = arcX + (quadrantWidth / 2) * u.x;
      const p2y = arcY + (quadrantWidth / 2) * u.y;
      const p2z = arcZ + (quadrantWidth / 2) * u.z;

      // Normal pointing outward from the cylinder axis
      const nx = xSign * sinT;
      const ny = -cosT * cosLat;
      const nz = cosT * sinLat;

      positions.push(p1x, p1y, p1z, p2x, p2y, p2z);
      normals.push(nx, ny, nz, nx, ny, nz);
      uvs.push(0, i / segments, 1, i / segments);

      if (i < segments) {
        const a = i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        indices.push(a, b, c, b, d, c);
        // Double-sided
        indices.push(a, c, b, b, c, d);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    return geom;
  };

  const westQuadrantGeom = useMemo(() => createQuadrantGeometry(true), [latitude, Cy, Cz, u, halfThick]);
  const eastQuadrantGeom = useMemo(() => createQuadrantGeometry(false), [latitude, Cy, Cz, u, halfThick]);

  // 4. Solid Sandstone Masonry Supporting Wall underneath each Quadrant
  const createSupportWallGeometry = (isWest) => {
    const segments = 40;
    const positions = [];
    const indices = [];
    const xSign = isWest ? -1 : 1;

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * (Math.PI / 2);
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      const topX = xSign * (halfThick + quadrantRadius * sinT);
      const topY = Cy - quadrantRadius * cosT * cosLat;
      const topZ = Cz + quadrantRadius * cosT * sinLat;

      // Extends down to the stone plinth (Y = 0)
      const botX = topX;
      const botY = 0;
      const botZ = topZ;

      positions.push(topX, topY, topZ, botX, botY, botZ);

      if (i < segments) {
        const a = i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        indices.push(a, b, c, b, d, c);
        indices.push(a, c, b, b, c, d);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  };

  const westSupportGeom = useMemo(() => createSupportWallGeometry(true), [latitude, Cy, Cz, halfThick]);
  const eastSupportGeom = useMemo(() => createSupportWallGeometry(false), [latitude, Cy, Cz, halfThick]);

  // 5. Arched Doorways (Mehraabs) piercing the supporting walls
  const archesCount = 5;
  const supportArches = useMemo(() => {
    const list = [];
    for (let i = 1; i <= archesCount; i++) {
      const t = i / (archesCount + 1);
      const theta = t * (Math.PI / 2);
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      const x = halfThick + quadrantRadius * sinT;
      const y = Cy - quadrantRadius * cosT * cosLat;
      const z = Cz + quadrantRadius * cosT * sinLat;

      const archRadius = Math.max(0.6, y * 0.32);
      const archHeight = y * 0.65;
      list.push({ x, y: archHeight / 2, z, archRadius, archHeight, key: i });
    }
    return list;
  }, [quadrantRadius, Cy, Cz, cosLat, sinLat, halfThick]);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Triangular Sandstone Gnomon Wall */}
      <mesh
        geometry={gnomonGeom}
        material={materials.sandstone}
        castShadow
        receiveShadow
      />

      {/* 2. Gnomon Hypotenuse Staircase Steps */}
      <group>
        {staircaseSteps.map((step) => (
          <mesh
            key={step.key}
            position={[0, step.y - 0.12, step.z]}
            material={materials.foundationStone}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[gnomonThickness * 0.72, 0.22, baseLength / stepsCount * 0.92]} />
          </mesh>
        ))}
      </group>

      {/* 3. Top Octagonal Chhatri Pavilion at South Apex */}
      <group position={[0, height, baseLength / 2]}>
        {/* Plinth Base */}
        <mesh position={[0, 0.35, 0]} material={materials.sandstone} castShadow receiveShadow>
          <cylinderGeometry args={[2.2, 2.5, 0.7, 8]} />
        </mesh>

        {/* 8 Carved Stone Pillars */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
          const angle = (idx * Math.PI) / 4;
          const px = Math.cos(angle) * 1.7;
          const pz = Math.sin(angle) * 1.7;
          return (
            <mesh key={idx} position={[px, 1.8, pz]} material={materials.sandstone} castShadow>
              <cylinderGeometry args={[0.12, 0.15, 2.2, 8]} />
            </mesh>
          );
        })}

        {/* Projecting Eaves (Chhajja) */}
        <mesh position={[0, 3.0, 0]} material={materials.sandstone} castShadow>
          <cylinderGeometry args={[2.6, 2.0, 0.3, 8]} />
        </mesh>

        {/* Dome Canopy */}
        <mesh position={[0, 3.8, 0]} material={materials.sandstone} castShadow>
          <sphereGeometry args={[1.9, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>

        {/* Brass Kalasha Finial */}
        <mesh position={[0, 4.9, 0]} material={materials.brass} castShadow>
          <cylinderGeometry args={[0.08, 0.22, 0.9, 8]} />
        </mesh>
        <mesh position={[0, 5.45, 0]} material={materials.brass} castShadow>
          <sphereGeometry args={[0.24, 16, 16]} />
        </mesh>
      </group>

      {/* 4. Western Quadrant (Afternoon reading wing: 12 PM to 6 PM) */}
      <group>
        {/* Curved White Marble Reading Arc */}
        <mesh
          geometry={westQuadrantGeom}
          material={materials.marble}
          castShadow
          receiveShadow
        />
        {/* Supporting Sandstone Masonry Wall down to ground */}
        <mesh
          geometry={westSupportGeom}
          material={materials.sandstone}
          castShadow
          receiveShadow
        />
        {/* Arched Openings in Supporting Wall */}
        {supportArches.map((arch) => (
          <group key={`w-${arch.key}`} position={[-arch.x, arch.y, arch.z]}>
            <mesh material={materials.foundationStone} castShadow receiveShadow>
              <cylinderGeometry args={[arch.archRadius, arch.archRadius, quadrantWidth * 1.05, 16]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. Eastern Quadrant (Morning reading wing: 6 AM to 12 PM) */}
      <group>
        {/* Curved White Marble Reading Arc */}
        <mesh
          geometry={eastQuadrantGeom}
          material={materials.marble}
          castShadow
          receiveShadow
        />
        {/* Supporting Sandstone Masonry Wall down to ground */}
        <mesh
          geometry={eastSupportGeom}
          material={materials.sandstone}
          castShadow
          receiveShadow
        />
        {/* Arched Openings in Supporting Wall */}
        {supportArches.map((arch) => (
          <group key={`e-${arch.key}`} position={[arch.x, arch.y, arch.z]}>
            <mesh material={materials.foundationStone} castShadow receiveShadow>
              <cylinderGeometry args={[arch.archRadius, arch.archRadius, quadrantWidth * 1.05, 16]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 6. Courtyard Foundation Plinth (Raised Stone Platform) */}
      <mesh position={[0, -0.2, 0]} material={materials.foundationStone} receiveShadow>
        <boxGeometry args={[44, 0.4, 48]} />
      </mesh>

      {/* Main Ground Sandstone Pavement */}
      <mesh position={[0, -0.45, 0]} material={materials.sandstone} receiveShadow>
        <boxGeometry args={[70, 0.2, 70]} />
      </mesh>

      {/* Inlaid White Marble Meridian Line (True North-South Line) */}
      <mesh position={[0, 0.01, 0]} material={materials.marble} receiveShadow>
        <planeGeometry args={[0.3, 44]} />
      </mesh>
    </group>
  );
}
