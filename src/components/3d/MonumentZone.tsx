import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { MonumentData } from '../../types';

interface MonumentZoneProps {
  monument: MonumentData | null;
}

export const MonumentZone: React.FC<MonumentZoneProps> = ({ monument }) => {
  const [hovered, setHovered] = useState(false);
  const ringsRef = useRef<THREE.Group>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 400;
  const { positions, angles } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const ang = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      ang[i] = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 5;
      pos[i * 3] = Math.cos(ang[i]) * radius;
      pos[i * 3 + 1] = Math.random() * 18;
      pos[i * 3 + 2] = Math.sin(ang[i]) * radius;
    }
    return { positions: pos, angles: ang };
  }, []);

  useFrame((state, delta) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y += delta * 0.4;
      ringsRef.current.rotation.z += delta * 0.2;
    }

    if (crystalRef.current) {
      crystalRef.current.rotation.y += delta * 0.6;
      crystalRef.current.position.y = 12 + Math.sin(state.clock.elapsedTime * 1.5) * 0.4;
    }

    if (particlesRef.current) {
      const geo = particlesRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        angles[i] += delta * 0.8;
        const r = 2.5 + Math.sin(state.clock.elapsedTime + i) * 1.2;
        arr[i * 3] = Math.cos(angles[i]) * r;
        arr[i * 3 + 1] += delta * 2.2;
        arr[i * 3 + 2] = Math.sin(angles[i]) * r;

        if (arr[i * 3 + 1] > 20) {
          arr[i * 3 + 1] = 0;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  if (!monument) return null;

  return (
    <group position={[0, 0, -85]}>
      {/* Radiant Golden Light Spire reaching into the sky */}
      <mesh position={[0, 16, 0]}>
        <cylinderGeometry args={[0.2, 2.5, 32, 32, 1, true]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating Monument Crystal with interactive hover trigger */}
      <group
        position={[0, 12, 0]}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <mesh ref={crystalRef}>
          <octahedronGeometry args={[1.8, 0]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={hovered ? 3.5 : 2.5}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* Swirling Golden Sparks */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          color="#fef08a"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Celestial Rings around Monument */}
      <group ref={ringsRef} position={[0, 12, 0]}>
        <mesh>
          <torusGeometry args={[3.8, 0.04, 16, 64]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.7} />
        </mesh>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[4.6, 0.03, 16, 64]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* 3D Floating Monument Epitaph Card in Space */}
      <Html
        position={[0, 16.5, 0]}
        center={false}
        distanceFactor={15}
        zIndexRange={[50, 0]}
        style={{
          transform: 'translate(-50%, -100%)',
          pointerEvents: 'none',
        }}
      >
        <div
          id="monument-epitaph-card"
          className={`font-mono flex flex-col gap-2 px-5 py-4 rounded-xl border border-amber-400/80 bg-black/95 text-center backdrop-blur-xl shadow-[0_0_50px_rgba(245,158,11,0.5)] transition-all duration-300 ease-out ${
            hovered
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
          style={{
            position: 'relative',
            width: '280px',
            maxWidth: '280px',
            boxSizing: 'border-box',
            zIndex: 50,
          }}
        >
          <div className="text-[10px] tracking-widest text-amber-400/90 font-bold uppercase" style={{ zIndex: 'auto' }}>
            ETERNAL MONUMENT // CONSECRATED
          </div>
          <div className="font-editorial text-2xl font-bold text-amber-200 tracking-wider glow-amber uppercase" style={{ zIndex: 'auto' }}>
            {monument.word}
          </div>
          <p
            className="text-xs text-gray-200 italic leading-relaxed py-1 px-2 rounded bg-amber-950/30 border border-amber-500/20 m-0"
            style={{
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
              zIndex: 'auto',
            }}
          >
            "{monument.inscription}"
          </p>
          <div className="text-[10px] text-amber-300/80 border-t border-amber-500/30 pt-1.5 flex justify-between" style={{ zIndex: 'auto' }}>
            <span>YEAR: 2147</span>
            <span>ARCHIVED IN QUARTZ</span>
          </div>
        </div>
      </Html>
    </group>
  );
};
