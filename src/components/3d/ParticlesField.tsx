import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { QualitySetting } from '../../types';

interface ParticlesFieldProps {
  quality: QualitySetting;
  accentColor?: string;
}

export const ParticlesField: React.FC<ParticlesFieldProps> = ({ quality, accentColor = '#38bdf8' }) => {
  const count = useMemo(() => {
    switch (quality) {
      case 'LOW': return 250;
      case 'MEDIUM': return 600;
      case 'HIGH': return 1200;
      case 'ULTRA': return 2200;
      default: return 800;
    }
  }, [quality]);

  const pointsRef = useRef<THREE.Points>(null);
  const dataPointsRef = useRef<THREE.Points>(null);

  // Ambient dust positions
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 30 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120 - 30;

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = Math.random() * 0.015 + 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return { positions: pos, velocities: vel };
  }, [count]);

  // Data motes (sparkling cubes/points)
  const dataPositions = useMemo(() => {
    const dCount = Math.floor(count * 0.4);
    const pos = new Float32Array(dCount * 3);
    for (let i = 0; i < dCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 40;
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const geo = pointsRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] += velocities[i * 3 + 1];
        arr[i * 3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.005;

        // Reset if float too high
        if (arr[i * 3 + 1] > 28) {
          arr[i * 3 + 1] = -1;
        }
      }
      posAttr.needsUpdate = true;
    }

    if (dataPointsRef.current) {
      dataPointsRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      {/* Soft Ambient Dust */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          color="#94a3b8"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Cyber Glowing Data Motes */}
      <points ref={dataPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={Math.floor(count * 0.4)}
            array={dataPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          color={accentColor}
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
