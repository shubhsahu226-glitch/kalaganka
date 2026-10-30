/**
 * 3D Scene Anatomical Labels & Celestial Pole Pointer.
 * Displays dashed axis line pointing toward the North Celestial Pole (Polaris),
 * and educational 3D billboard tags on key parts of the Samrat Yantra.
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text, Billboard } from '@react-three/drei';
import { useKalaStore } from '../store/useKalaStore';

export function SceneLabels() {
  const showCelestialPole = useKalaStore((state) => state.viewOptions.showCelestialPole);
  const showHourLabels = useKalaStore((state) => state.viewOptions.showHourLabels);
  const latitude = useKalaStore((state) => state.latitude);

  const latRad = useMemo(() => THREE.MathUtils.degToRad(latitude), [latitude]);
  const cosLat = useMemo(() => Math.cos(latRad), [latRad]);
  const sinLat = useMemo(() => Math.sin(latRad), [latRad]);

  const baseLength = 36.0;
  const height = baseLength * Math.tan(latRad);

  // Celestial Pole vector extending from the South Apex towards Polaris in the Northern sky
  const poleGeometry = useMemo(() => {
    const start = new THREE.Vector3(0, height, baseLength / 2);
    // Extends 25m upwards along latitude inclination
    const end = new THREE.Vector3(0, height + 25 * sinLat, baseLength / 2 + 25 * cosLat);
    return new THREE.BufferGeometry().setFromPoints([start, end]);
  }, [height, baseLength, sinLat, cosLat]);

  return (
    <group>
      {/* 1. Celestial Pole Pointer (Dashed Gold Ray towards Polaris) */}
      {showCelestialPole && (
        <group>
          <line
            ref={(line) => line && line.computeLineDistances()}
            geometry={poleGeometry}
          >
            <lineDashedMaterial
              color="#DFC17E"
              dashSize={1.2}
              gapSize={0.6}
              linewidth={2}
              transparent
              opacity={0.85}
            />
          </line>
          <Billboard
            position={[0, height + 14 * sinLat, baseLength / 2 + 14 * cosLat + 1]}
            follow={true}
          >
            <Text
              fontSize={0.9}
              color="#DFC17E"
              anchorX="center"
              anchorY="bottom"
              outlineWidth={0.05}
              outlineColor="#2A2421"
            >
              ध्रुव तारा · Celestial Pole ({latitude.toFixed(1)}°)
            </Text>
          </Billboard>
        </group>
      )}

      {/* 2. Anatomical 3D Labels (Always Facing Camera via Billboard) */}
      {showHourLabels && (
        <group>
          {/* Gnomon Label */}
          <Billboard position={[0, height * 0.55 + 1.2, 0]} follow={true}>
            <Text
              fontSize={0.9}
              color="#FAF8F5"
              outlineWidth={0.06}
              outlineColor="#2A2421"
              anchorX="center"
            >
              शंकु · Gnomon
            </Text>
          </Billboard>

          {/* West Quadrant Label */}
          <Billboard position={[-11, 5.5, 12]} follow={true}>
            <Text
              fontSize={0.8}
              color="#FAF8F5"
              outlineWidth={0.06}
              outlineColor="#2A2421"
              anchorX="center"
            >
              पश्चिम फलक · West Quadrant (PM)
            </Text>
          </Billboard>

          {/* East Quadrant Label */}
          <Billboard position={[11, 5.5, 12]} follow={true}>
            <Text
              fontSize={0.8}
              color="#FAF8F5"
              outlineWidth={0.06}
              outlineColor="#2A2421"
              anchorX="center"
            >
              पूर्व फलक · East Quadrant (AM)
            </Text>
          </Billboard>
        </group>
      )}
    </group>
  );
}
