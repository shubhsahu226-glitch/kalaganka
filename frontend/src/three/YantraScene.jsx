/**
 * Main 3D Canvas Scene for the Samrat Yantra Simulator.
 * Configured with React Three Fiber, Drei OrbitControls, ACES Filmic Tone Mapping,
 * and cinematic camera positioning.
 */

import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { SamratYantra } from './SamratYantra';
import { SunLight } from './SunLight';
import { SunPath } from './SunPath';
import { Compass } from './Compass';
import { SceneLabels } from './SceneLabels';
import { useKalaStore } from '../store/useKalaStore';
import { CAMERA_PRESETS } from '../lib/constants';

function CameraManager() {
  const { camera } = useThree();
  const controlsRef = useRef();
  const cameraPresetKey = useKalaStore((state) => state.viewOptions.cameraPreset);

  useEffect(() => {
    const targetPreset = CAMERA_PRESETS[cameraPresetKey] || CAMERA_PRESETS.VISITOR;
    // Animate camera position smoothly
    camera.position.set(...targetPreset.position);
    if (controlsRef.current) {
      controlsRef.current.target.set(...targetPreset.target);
      controlsRef.current.update();
    }
  }, [cameraPresetKey, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.04} // Prevent camera going below ground
      minDistance={6}
      maxDistance={90}
    />
  );
}

export function YantraScene() {
  const solarData = useKalaStore((state) => state.solarData);
  const isNight = (solarData?.sun?.altitude_deg ?? 1) <= 0;

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#EAE2D7] to-[#F5EFEB]">
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isNight ? 0.6 : 1.05
        }}
      >
        <PerspectiveCamera makeDefault position={[38, 22, -18]} fov={48} />
        <CameraManager />

        {/* Ambient Sky / Ground Fog for Architectural Depth */}
        <fog attach="fog" args={[isNight ? '#101626' : '#EAE2D7', 35, 120]} />

        {/* Dynamic Celestial Sunlight and Shadow Engine */}
        <SunLight />

        {/* Samrat Yantra Architectural Digital Twin */}
        <SamratYantra />

        {/* 3D Celestial Guides & Inlays */}
        <SunPath />
        <Compass />
        <SceneLabels />
      </Canvas>
    </div>
  );
}

