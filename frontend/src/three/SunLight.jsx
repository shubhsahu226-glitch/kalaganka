/**
 * Directional Sun Light & Shadow Engine.
 * Converts topocentric solar altitude and azimuth into 3D Cartesian coordinates
 * and casts physically authentic Three.js geometry shadows onto the Samrat Yantra.
 */

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useKalaStore } from '../store/useKalaStore';

export function SunLight() {
  const solarData = useKalaStore((state) => state.solarData);
  const lightRef = useRef();

  // Extract solar angles or default to midday sun
  const altitude = solarData?.sun?.altitude_deg ?? 45.0;
  const azimuth = solarData?.sun?.azimuth_deg ?? 180.0;
  const isAboveHorizon = solarData?.sun?.is_above_horizon ?? (altitude > 0);

  // Convert Spherical (Altitude, Azimuth) to Three.js Cartesian (X, Y, Z)
  // Conventions:
  // - Altitude: angle above horizon (0 to 90 deg)
  // - Azimuth: clockwise from North (0=North [-Z], 90=East [+X], 180=South [+Z], 270=West [-X])
  const sunPosition = useMemo(() => {
    const dist = 75.0; // Distance of light source
    const altRad = THREE.MathUtils.degToRad(Math.max(-5.0, altitude));
    const azRad = THREE.MathUtils.degToRad(azimuth);

    const y = dist * Math.sin(altRad);
    const rHoriz = dist * Math.cos(altRad);
    const x = rHoriz * Math.sin(azRad);
    const z = -rHoriz * Math.cos(azRad);

    return new THREE.Vector3(x, y, z);
  }, [altitude, azimuth]);

  // Dynamic light color and intensity based on solar altitude
  const { color, intensity, ambientIntensity } = useMemo(() => {
    if (!isAboveHorizon || altitude <= 0) {
      // Night state: No direct sunlight, cool blue nocturnal ambient light
      return {
        color: '#1A243B',
        intensity: 0.0,
        ambientIntensity: 0.25
      };
    } else if (altitude < 12.0) {
      // Golden Hour / Dawn / Dusk: Warm amber-red low-angle illumination
      const ratio = altitude / 12.0;
      return {
        color: '#FF9E5E',
        intensity: 1.2 * ratio + 0.4,
        ambientIntensity: 0.4
      };
    } else {
      // Full Daylight: Crisp warm golden sunlight
      return {
        color: '#FFF8EB',
        intensity: 2.2,
        ambientIntensity: 0.65
      };
    }
  }, [altitude, isAboveHorizon]);

  return (
    <group>
      {/* 1. Hemisphere Ambient Light (Warm ground bounce & soft sky dome) */}
      <hemisphereLight
        args={['#FFF5EA', '#8E7B6C', ambientIntensity]}
      />

      {/* 2. Primary Directional Sunlight with High-Resolution Shadow Map */}
      {isAboveHorizon && (
        <directionalLight
          ref={lightRef}
          position={sunPosition}
          color={color}
          intensity={intensity}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={2}
          shadow-camera-far={180}
          shadow-camera-left={-28}
          shadow-camera-right={28}
          shadow-camera-top={28}
          shadow-camera-bottom={-28}
          shadow-bias={-0.0003}
          shadow-normalBias={0.02}
        />
      )}

      {/* 3. Visual 3D Sun Sphere in the Sky */}
      {isAboveHorizon && (
        <group position={sunPosition}>
          {/* Glowing Sun Core */}
          <mesh>
            <sphereGeometry args={[2.2, 32, 32]} />
            <meshBasicMaterial color="#FFDF78" />
          </mesh>
          {/* Subtle Outer Corona */}
          <mesh>
            <sphereGeometry args={[3.2, 16, 16]} />
            <meshBasicMaterial
              color="#FFB347"
              transparent
              opacity={0.3}
              side={THREE.BackSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

