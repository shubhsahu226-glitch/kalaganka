/**
 * 3D Courtyard Compass Rose.
 * Inlaid cardinal directional markers on the sandstone pavement:
 * North (N · उत्तर), East (E · पूर्व), South (S · दक्षिण), West (W · पश्चिम).
 */

import React from 'react';
import { Text } from '@react-three/drei';
import { useKalaStore } from '../store/useKalaStore';

export function Compass() {
  const showCompass = useKalaStore((state) => state.viewOptions.showCompass);

  if (!showCompass) return null;

  const fontColor = '#8A3E2A';
  const distance = 20.0;

  return (
    <group position={[0, 0.05, 0]}>
      {/* North Marker (Negative Z) */}
      <group position={[0, 0, -distance]}>
        <Text
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={1.4}
          color={fontColor}
          anchorX="center"
          anchorY="middle"
        >
          N · उत्तर
        </Text>
      </group>

      {/* South Marker (Positive Z) */}
      <group position={[0, 0, distance]}>
        <Text
          rotation={[-Math.PI / 2, 0, Math.PI]}
          fontSize={1.4}
          color={fontColor}
          anchorX="center"
          anchorY="middle"
        >
          S · दक्षिण
        </Text>
      </group>

      {/* East Marker (Positive X) */}
      <group position={[distance, 0, 0]}>
        <Text
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          fontSize={1.4}
          color={fontColor}
          anchorX="center"
          anchorY="middle"
        >
          E · पूर्व
        </Text>
      </group>

      {/* West Marker (Negative X) */}
      <group position={[-distance, 0, 0]}>
        <Text
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          fontSize={1.4}
          color={fontColor}
          anchorX="center"
          anchorY="middle"
        >
          W · पश्चिम
        </Text>
      </group>
    </group>
  );
}

