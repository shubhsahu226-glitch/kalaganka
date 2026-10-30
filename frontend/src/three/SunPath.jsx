/**
 * 3D Sun Path Diurnal Arc Visualizer.
 * Renders the circular celestial trajectory of the Sun across the sky dome.
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useKalaStore } from '../store/useKalaStore';

export function SunPath() {
  const showSunPath = useKalaStore((state) => state.viewOptions.showSunPath);
  const latitude = useKalaStore((state) => state.latitude);
  const solarData = useKalaStore((state) => state.solarData);

  const declination = solarData?.sun?.declination_deg ?? -13.7;

  // Compute 3D points along the diurnal circle
  const pathPoints = useMemo(() => {
    if (!showSunPath) return [];

    const points = [];
    const radius = 75.0;
    const latRad = THREE.MathUtils.degToRad(latitude);
    const decRad = THREE.MathUtils.degToRad(declination);

    // Sample 96 points over the 24-hour cycle
    for (let i = 0; i <= 96; i++) {
      const haRad = (i / 96) * Math.PI * 2 - Math.PI; // -180 to +180 deg

      // Standard celestial spherical conversion
      // sin(altitude) = sin(lat)*sin(dec) + cos(lat)*cos(dec)*cos(ha)
      const sinAlt = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
      const altRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));

      // cos(azimuth) = (sin(dec) - sin(lat)*sin(alt)) / (cos(lat)*cos(alt))
      const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * Math.cos(altRad) || 1);
      const sinAz = (-Math.cos(decRad) * Math.sin(haRad)) / (Math.cos(altRad) || 1);
      const azRad = Math.atan2(sinAz, cosAz);

      // Only render portion above the horizon
      if (altRad >= -0.05) {
        const y = radius * Math.sin(altRad);
        const rHoriz = radius * Math.cos(altRad);
        const x = rHoriz * Math.sin(azRad);
        const z = -rHoriz * Math.cos(azRad);
        points.push(new THREE.Vector3(x, y, z));
      }
    }

    return points;
  }, [showSunPath, latitude, declination]);

  const lineGeometry = useMemo(() => {
    if (pathPoints.length < 2) return null;
    return new THREE.BufferGeometry().setFromPoints(pathPoints);
  }, [pathPoints]);

  if (!showSunPath || !lineGeometry) return null;

  return (
    <line
      ref={(line) => line && line.computeLineDistances()}
      geometry={lineGeometry}
    >
      <lineDashedMaterial
        color="#DFC17E"
        dashSize={1.5}
        gapSize={0.8}
        linewidth={2}
        transparent
        opacity={0.7}
      />
    </line>
  );
}

