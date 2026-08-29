import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { MEMORY_ARTIFACTS } from '../../data/memories';
import { MemoryArtifact } from '../../types';
import { audioEngine } from '../../systems/audioEngine';

interface ArchiveVaultProps {
  onSelectMemory: (memory: MemoryArtifact) => void;
  onDiscoverEgg?: (id: string) => void;
}

export const ArchiveVault: React.FC<ArchiveVaultProps> = ({ onSelectMemory, onDiscoverEgg }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const ringsRef = useRef<THREE.Group[]>([]);
  const capsulesRef = useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    // Animate rotating holographic rings and bobbing capsules
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.z += delta * (0.8 + i * 0.1);
        ring.rotation.x += delta * 0.4;
      }
    });

    capsulesRef.current.forEach((capsule, i) => {
      if (capsule) {
        capsule.rotation.y += delta * 0.9;
        capsule.position.y = Math.sin(state.clock.elapsedTime * 2 + i * 1.5) * 0.15;
      }
    });
  });

  return (
    <group position={[-16, 0, -8]}>
      {/* Archive Room Floor Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[14, 15, 0.6, 8]} />
        <meshStandardMaterial
          color="#070d19"
          roughness={0.5}
          metalness={0.85}
        />
      </mesh>

      {/* Radiant Concentric Holographic Floor Rings */}
      {[4, 8, 12].map((radius, idx) => (
        <mesh key={`floor-ring-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.32, 0]}>
          <ringGeometry args={[radius - 0.06, radius + 0.06, 64]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.6 - idx * 0.15} />
        </mesh>
      ))}

      {/* Floating Data Capsules */}
      {MEMORY_ARTIFACTS.map((artifact, idx) => {
        // Position relative to archive center
        const relPos: [number, number, number] = [
          artifact.position[0] - (-16),
          artifact.position[1],
          artifact.position[2] - (-8),
        ];

        const isHovered = hoveredId === artifact.id;

        return (
          <group key={artifact.id} position={relPos}>
            {/* Pedestal Base */}
            <mesh position={[0, -artifact.position[1] + 0.4, 0]}>
              <cylinderGeometry args={[0.7, 0.9, 0.8, 6]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
            </mesh>

            {/* Glowing Pillar of Light */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.4, 4, 16, 1, true]} />
              <meshBasicMaterial
                color={artifact.color}
                transparent
                opacity={isHovered ? 0.4 : 0.15}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Interactive Capsule Node */}
            <group
              onClick={(e) => {
                e.stopPropagation();
                audioEngine.playMemoryChime(artifact.audioToneFreq);
                onSelectMemory(artifact);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredId(artifact.id);
                audioEngine.playClick(artifact.audioToneFreq * 1.5);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredId(null);
                document.body.style.cursor = 'default';
              }}
            >
              {/* Floating Crystal Diamond/Octahedron */}
              <mesh
                ref={(el) => {
                  if (el) capsulesRef.current[idx] = el;
                }}
                scale={isHovered ? [1.3, 1.3, 1.3] : [1, 1, 1]}
              >
                <octahedronGeometry args={[0.55, 0]} />
                <meshStandardMaterial
                  color={artifact.color}
                  emissive={artifact.color}
                  emissiveIntensity={isHovered ? 1.8 : 0.8}
                  roughness={0.1}
                  metalness={0.9}
                  wireframe={false}
                />
              </mesh>

              {/* Dual Holographic Gyro Rings */}
              <group
                ref={(el) => {
                  if (el) ringsRef.current[idx] = el;
                }}
              >
                <mesh>
                  <torusGeometry args={[0.85, 0.02, 8, 32]} />
                  <meshBasicMaterial color={artifact.color} transparent opacity={0.8} />
                </mesh>
                <mesh rotation={[Math.PI / 3, 0, 0]}>
                  <torusGeometry args={[1.05, 0.015, 8, 32]} />
                  <meshBasicMaterial color={artifact.color} transparent opacity={0.5} />
                </mesh>
              </group>

              {/* Floating Holographic Tag Label in 3D Space */}
              <Html
                position={[0, 1.1, 0]}
                center={false}
                distanceFactor={12}
                zIndexRange={[20, 0]}
                style={{
                  transform: 'translate(-50%, -100%)',
                  pointerEvents: 'none',
                }}
              >
                <div
                  className={`transition-all duration-300 ease-out font-mono px-2.5 py-1 rounded border text-xs whitespace-nowrap backdrop-blur-md shadow-lg ${
                    isHovered
                      ? 'opacity-100 scale-100 bg-[#101217]/95 border-[#8B7E66] text-[#F4F1EA]'
                      : 'opacity-0 scale-95 bg-[#101217]/80 border-[#8B7E66]/40 text-[#C8C2B0]'
                  }`}
                  style={{
                    position: 'relative',
                    boxSizing: 'border-box',
                    zIndex: 20,
                  }}
                >
                  <div className="flex items-center gap-1.5" style={{ zIndex: 'auto' }}>
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: artifact.color }}
                    />
                    <span className="font-bold text-[#F4F1EA]">{artifact.code}</span>
                    <span className="text-[10px] text-[#A3967C]">| {artifact.title}</span>
                  </div>
                </div>
              </Html>
            </group>
          </group>
        );
      })}

      {/* Easter Egg: Voyager Golden Record Replica */}
      <group
        position={[-6, 1.8, -4]}
        rotation={[0, 0, Math.PI / 4]}
        onClick={() => onDiscoverEgg?.('egg-voyager')}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <mesh>
          <cylinderGeometry args={[0.7, 0.7, 0.04, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <ringGeometry args={[0.1, 0.6, 32]} />
          <meshBasicMaterial color="#fef08a" wireframe />
        </mesh>
      </group>
    </group>
  );
};
