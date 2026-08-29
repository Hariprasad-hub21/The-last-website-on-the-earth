import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { DREAM_RELICS } from '../../data/memories';
import { audioEngine } from '../../systems/audioEngine';

interface DreamArchiveProps {
  onSelectRelic?: (relic: any) => void;
  onDiscoverEgg?: (id: string) => void;
}

export const DreamArchive: React.FC<DreamArchiveProps> = ({ onSelectRelic, onDiscoverEgg }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const pyramidsRef = useRef<THREE.Mesh[]>([]);
  const ringsRef = useRef<THREE.Group[]>([]);
  const relicsRef = useRef<THREE.Group[]>([]);

  useFrame((state, delta) => {
    // Inverted pyramids slow rotation and levitation
    pyramidsRef.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.rotation.y += delta * (0.2 + i * 0.05);
        mesh.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.1;
        mesh.position.y = 8 + Math.sin(state.clock.elapsedTime * 0.8 + i) * 0.6;
      }
    });

    // Gyroscope wireframe rings
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.x += delta * 0.3;
        ring.rotation.y += delta * 0.25;
        ring.rotation.z += delta * 0.15;
      }
    });

    // Floating dream relics
    relicsRef.current.forEach((relic, i) => {
      if (relic) {
        relic.rotation.y += delta * 0.8;
        relic.position.y = DREAM_RELICS[i].position[1] + Math.sin(state.clock.elapsedTime * 1.8 + i) * 0.25;
      }
    });
  });

  return (
    <group position={[20, 0, -28]}>
      {/* Floating Surreal Void Islands */}
      {[0, 1, 2].map((idx) => {
        const xOffset = (idx - 1) * 8;
        const zOffset = (idx % 2 === 0 ? 1 : -1) * 4;
        return (
          <mesh
            key={`island-${idx}`}
            position={[xOffset, 0, zOffset]}
            rotation={[-Math.PI / 2, 0, idx * 0.5]}
            receiveShadow
          >
            <cylinderGeometry args={[5 - idx * 0.8, 6 - idx * 0.8, 0.8, 6]} />
            <meshStandardMaterial
              color="#110924"
              roughness={0.4}
              metalness={0.8}
            />
          </mesh>
        );
      })}

      {/* Inverted Monolithic Pyramids */}
      {[-1, 0, 1].map((posMultiplier, i) => (
        <mesh
          key={`pyramid-${i}`}
          ref={(el) => {
            if (el) pyramidsRef.current[i] = el;
          }}
          position={[posMultiplier * 10, 8, -6 + i * 4]}
          rotation={[Math.PI, 0, 0]}
        >
          <coneGeometry args={[2.4, 5, 4]} />
          <meshStandardMaterial
            color="#2e1065"
            roughness={0.2}
            metalness={0.9}
            wireframe={i === 1}
          />
        </mesh>
      ))}

      {/* Impossible Gyro Rings in the Sky */}
      <group
        position={[0, 12, -4]}
        ref={(el) => {
          if (el) ringsRef.current[0] = el;
        }}
      >
        <mesh>
          <torusGeometry args={[6, 0.04, 16, 64]} />
          <meshBasicMaterial color="#ec4899" transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[4.5, 0.04, 16, 64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
        </mesh>
        <mesh rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[3, 0.04, 16, 64]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Floating Dream Relics */}
      {DREAM_RELICS.map((relic, idx) => {
        const relPos: [number, number, number] = [
          relic.position[0] - 20,
          relic.position[1],
          relic.position[2] - (-28),
        ];
        const isHovered = hoveredId === relic.id;

        return (
          <group
            key={relic.id}
            position={relPos}
            ref={(el) => {
              if (el) relicsRef.current[idx] = el;
            }}
            onClick={() => {
              audioEngine.playMemoryChime(659.25);
              onSelectRelic?.(relic);
            }}
            onPointerOver={() => {
              setHoveredId(relic.id);
              audioEngine.playClick(900);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHoveredId(null);
              document.body.style.cursor = 'default';
            }}
          >
            {/* Relic Shape */}
            {idx === 0 ? (
              // Lotus Shape / Icosahedron
              <mesh scale={isHovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}>
                <icosahedronGeometry args={[0.7, 0]} />
                <meshStandardMaterial
                  color="#ec4899"
                  emissive="#ec4899"
                  emissiveIntensity={isHovered ? 1.5 : 0.6}
                  wireframe
                />
              </mesh>
            ) : idx === 1 ? (
              // Star Chart Sphere
              <mesh scale={isHovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}>
                <sphereGeometry args={[0.6, 16, 16]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  emissive="#38bdf8"
                  emissiveIntensity={isHovered ? 1.5 : 0.6}
                  wireframe
                />
              </mesh>
            ) : (
              // Inverted Tetrahedron
              <mesh scale={isHovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}>
                <tetrahedronGeometry args={[0.7, 0]} />
                <meshStandardMaterial
                  color="#a855f7"
                  emissive="#a855f7"
                  emissiveIntensity={isHovered ? 1.5 : 0.6}
                />
              </mesh>
            )}

            {/* Glowing Aura Beam */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.3, 3, 12, 1, true]} />
              <meshBasicMaterial
                color={relic.color}
                transparent
                opacity={isHovered ? 0.35 : 0.12}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Relic 3D Label */}
            <Html
              position={[0, 1.0, 0]}
              center={false}
              distanceFactor={12}
              zIndexRange={[20, 0]}
              style={{
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'none',
              }}
            >
              <div
                className={`transition-all duration-300 ease-out font-mono-cyber px-2.5 py-1 rounded border text-xs whitespace-nowrap backdrop-blur-md shadow-lg ${
                  isHovered
                    ? 'opacity-100 scale-100 bg-purple-950/90 border-pink-400 text-pink-200'
                    : 'opacity-0 scale-95 bg-black/70 border-purple-500/40 text-purple-300/80'
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
                    style={{ backgroundColor: relic.color }}
                  />
                  <span>{relic.title}</span>
                </div>
              </div>
            </Html>
          </group>
        );
      })}

      {/* Easter Egg: Constellation Solitude */}
      <group
        position={[8, 14, -2]}
        onClick={() => onDiscoverEgg?.('egg-constellation')}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        {/* 5 Linked Cyan Stars */}
        {[
          [-1.5, 0.8, 0],
          [-0.8, -0.4, 0],
          [0, 1.2, 0],
          [0.9, -0.2, 0],
          [1.6, 0.6, 0],
        ].map((starPos, i) => (
          <mesh key={`star-${i}`} position={starPos as [number, number, number]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        ))}
      </group>
    </group>
  );
};
