import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LostCityProps {
  onDiscoverEgg?: (id: string) => void;
}

export const LostCity: React.FC<LostCityProps> = ({ onDiscoverEgg }) => {
  const dronesRef = useRef<THREE.Group[]>([]);
  const billboardsRef = useRef<THREE.Mesh[]>([]);

  // Procedural futuristic skyscrapers
  const buildings = useMemo(() => {
    const b = [];
    // Background skyline grid
    for (let x = -80; x <= 80; x += 12) {
      for (let z = -120; z >= -220; z -= 18) {
        // Skip central corridor slightly for clear sightline
        if (Math.abs(x) < 10 && z > -150) continue;

        const height = 30 + Math.random() * 85;
        const width = 6 + Math.random() * 8;
        const depth = 6 + Math.random() * 8;
        const hasSpire = Math.random() > 0.6;
        const isAmber = Math.random() > 0.7;
        b.push({
          x: x + (Math.random() - 0.5) * 4,
          z: z + (Math.random() - 0.5) * 4,
          width,
          height,
          depth,
          hasSpire,
          accentColor: isAmber ? '#f59e0b' : '#38bdf8',
        });
      }
    }
    return b;
  }, []);

  // Flying surveillance drones
  const drones = useMemo(() => {
    return [
      { radius: 35, speed: 0.35, y: 18, offset: 0 },
      { radius: 55, speed: -0.25, y: 28, offset: Math.PI / 2 },
      { radius: 45, speed: 0.4, y: 22, offset: Math.PI },
      { radius: 70, speed: -0.2, y: 38, offset: Math.PI * 1.5 },
    ];
  }, []);

  useFrame((state, delta) => {
    // Animate drones orbiting the dead city
    dronesRef.current.forEach((drone, idx) => {
      if (drone) {
        const d = drones[idx];
        const angle = state.clock.elapsedTime * d.speed + d.offset;
        drone.position.x = Math.sin(angle) * d.radius;
        drone.position.z = -130 + Math.cos(angle) * (d.radius * 0.7);
        drone.position.y = d.y + Math.sin(state.clock.elapsedTime * 1.5 + idx) * 1.5;
        drone.rotation.y = angle + Math.PI / 2;
      }
    });

    // Pulse billboard glow
    billboardsRef.current.forEach((mesh, i) => {
      if (mesh) {
        (mesh.material as THREE.MeshBasicMaterial).opacity =
          0.4 + Math.sin(state.clock.elapsedTime * 3 + i * 2) * 0.25;
      }
    });
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Observation Balcony Platform / Breach Edge */}
      <group position={[0, 10, -32]}>
        {/* Balcony Deck */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[26, 0.8, 10]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Safety Railing */}
        <mesh position={[0, 1.0, -4.8]}>
          <boxGeometry args={[26, 0.1, 0.2]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.5, -4.8]}>
          <boxGeometry args={[26, 0.9, 0.05]} />
          <meshStandardMaterial
            color="#0284c7"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Easter Egg: The Architect's Terminal */}
        <group
          position={[-6, 1.2, -4.6]}
          onClick={() => onDiscoverEgg?.('egg-architect')}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
          }}
        >
          {/* Laptop Base */}
          <mesh>
            <boxGeometry args={[0.5, 0.04, 0.4]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          {/* Screen */}
          <mesh position={[0, 0.2, -0.18]} rotation={[-Math.PI / 6, 0, 0]}>
            <boxGeometry args={[0.5, 0.35, 0.02]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      </group>

      {/* Gigantic Distant City Horizon */}
      <group position={[0, 0, 0]}>
        {buildings.map((b, idx) => (
          <group key={`building-${idx}`} position={[b.x, b.height / 2 - 10, b.z]}>
            {/* Skyscraper Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[b.width, b.height, b.depth]} />
              <meshStandardMaterial
                color="#060913"
                metalness={0.9}
                roughness={0.4}
              />
            </mesh>

            {/* Glowing Rooftop Beacon */}
            <mesh position={[0, b.height / 2 + 0.5, 0]}>
              <boxGeometry args={[b.width * 0.8, 0.3, b.depth * 0.8]} />
              <meshBasicMaterial color={b.accentColor} transparent opacity={0.6} />
            </mesh>

            {/* Spire */}
            {b.hasSpire && (
              <mesh position={[0, b.height / 2 + 6, 0]}>
                <cylinderGeometry args={[0.05, 0.4, 12, 4]} />
                <meshBasicMaterial color={b.accentColor} />
              </mesh>
            )}

            {/* Emissive Vertical Window Strips */}
            <mesh position={[0, 0, b.depth / 2 + 0.05]}>
              <planeGeometry args={[b.width * 0.6, b.height * 0.85]} />
              <meshBasicMaterial
                color={b.accentColor}
                transparent
                opacity={0.15}
                wireframe
              />
            </mesh>
          </group>
        ))}

        {/* Skyway Connecting Bridges with Traffic Beams */}
        {[-40, 0, 40].map((x, idx) => (
          <group key={`bridge-${idx}`} position={[x, 32 + idx * 8, -145]}>
            <mesh>
              <boxGeometry args={[28, 2.5, 3]} />
              <meshStandardMaterial color="#0b1120" metalness={0.9} roughness={0.3} />
            </mesh>
            {/* Emissive traffic light beam on bridge */}
            <mesh position={[0, 1.4, 0]}>
              <boxGeometry args={[27.6, 0.1, 0.4]} />
              <meshBasicMaterial color={idx % 2 === 0 ? '#38bdf8' : '#f59e0b'} transparent opacity={0.8} />
            </mesh>
          </group>
        ))}

        {/* Floating Holographic Billboards */}
        {[-35, 35].map((x, idx) => (
          <mesh
            key={`billboard-${idx}`}
            position={[x, 42, -115]}
            ref={(el) => {
              if (el) billboardsRef.current[idx] = el;
            }}
          >
            <planeGeometry args={[20, 10]} />
            <meshBasicMaterial
              color={idx === 0 ? '#38bdf8' : '#f59e0b'}
              transparent
              opacity={0.5}
              wireframe
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* Flying Surveillance Drones */}
        {drones.map((_, idx) => (
          <group
            key={`drone-${idx}`}
            ref={(el) => {
              if (el) dronesRef.current[idx] = el;
            }}
          >
            {/* Drone Hull */}
            <mesh>
              <boxGeometry args={[1.6, 0.4, 1.2]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} />
            </mesh>
            {/* Searchlight Cone */}
            <mesh position={[0, -4, 0]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.2, 3.5, 8, 16, 1, true]} />
              <meshBasicMaterial
                color="#38bdf8"
                transparent
                opacity={0.25}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
