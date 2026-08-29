import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { audioEngine } from '../../systems/audioEngine';

interface AICoreNexusProps {
  onOpenChat: () => void;
  onDiscoverEgg?: (id: string) => void;
  isAiActive?: boolean;
}

export const AICoreNexus: React.FC<AICoreNexusProps> = ({
  onOpenChat,
  onDiscoverEgg,
  isAiActive = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const coreOrbRef = useRef<THREE.Mesh>(null);
  const streamsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Gyroscope triple-axis gimbal rotation
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.45;
      ring1Ref.current.rotation.y += delta * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.55;
      ring2Ref.current.rotation.z += delta * 0.3;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * 0.65;
      ring3Ref.current.rotation.x -= delta * 0.25;
    }

    // Core central plasma pulse
    if (coreOrbRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
      coreOrbRef.current.scale.set(pulse, pulse, pulse);
      coreOrbRef.current.rotation.y += delta * 0.8;
    }

    if (streamsRef.current) {
      streamsRef.current.rotation.y -= delta * 0.35;
    }
  });

  return (
    <group position={[0, 0, -85]}>
      {/* Colossal Circular Chamber Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[20, 22, 1.2, 32]} />
        <meshStandardMaterial
          color="#050a14"
          roughness={0.4}
          metalness={0.9}
        />
      </mesh>

      {/* Concentric Emissive Energy Channels */}
      {[5, 10, 15, 18].map((rad, idx) => (
        <mesh key={`channel-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.62, 0]}>
          <ringGeometry args={[rad - 0.08, rad + 0.08, 64]} />
          <meshBasicMaterial
            color={idx === 1 ? '#38bdf8' : '#1d4ed8'}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Outer Chamber Energy Pillars */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 17;
        const z = Math.sin(angle) * 17;
        return (
          <group key={`pillar-${i}`} position={[x, 7, z]}>
            <mesh>
              <cylinderGeometry args={[0.6, 0.9, 14, 8]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
            </mesh>
            {/* Energy Stream Inside Pillar */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 14, 8]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        );
      })}

      {/* NEXUS Main Core Assembly */}
      <group
        position={[0, 7.5, 0]}
        onClick={() => {
          audioEngine.playMemoryChime(587.33);
          onOpenChat();
        }}
        onPointerOver={() => {
          setHovered(true);
          audioEngine.playClick(1000);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        {/* Central Glowing AI Mind Sphere */}
        <mesh ref={coreOrbRef}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#3b82f6"
            emissiveIntensity={hovered ? 2.5 : 1.6}
            roughness={0.1}
            metalness={0.8}
            wireframe={false}
          />
        </mesh>

        {/* Outer Plasma Halo */}
        <mesh>
          <sphereGeometry args={[1.75, 24, 24]} />
          <meshBasicMaterial
            color="#93c5fd"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            wireframe
          />
        </mesh>

        {/* Gimbal Ring 1: Outer Titanium Band */}
        <group ref={ring1Ref}>
          <mesh>
            <torusGeometry args={[3.2, 0.12, 16, 64]} />
            <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.2} />
          </mesh>
          <mesh>
            <torusGeometry args={[3.22, 0.03, 8, 64]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* Gimbal Ring 2: Intermediate Gyro Ring */}
        <group ref={ring2Ref}>
          <mesh>
            <torusGeometry args={[2.5, 0.1, 16, 64]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh>
            <torusGeometry args={[2.52, 0.025, 8, 64]} />
            <meshBasicMaterial color="#60a5fa" />
          </mesh>
        </group>

        {/* Gimbal Ring 3: Inner Accelerating Ring */}
        <group ref={ring3Ref}>
          <mesh>
            <torusGeometry args={[1.9, 0.08, 16, 64]} />
            <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh>
            <torusGeometry args={[1.92, 0.02, 8, 64]} />
            <meshBasicMaterial color="#93c5fd" />
          </mesh>
        </group>

        {/* Orbiting Quantum Data Streams */}
        <group ref={streamsRef}>
          {Array.from({ length: 6 }).map((_, idx) => {
            const rad = 4.2 + (idx % 3) * 0.6;
            const y = (idx - 2.5) * 0.8;
            return (
              <mesh key={`stream-${idx}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, idx]}>
                <ringGeometry args={[rad, rad + 0.04, 32]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
              </mesh>
            );
          })}
        </group>

        {/* 3D Floating Interface Tag - Consolidated Single Flexbox Card */}
        <Html
          position={[0, 4.2, 0]}
          center={false}
          distanceFactor={14}
          zIndexRange={[50, 0]}
          style={{
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
          }}
        >
          <div
            id="nexus-core-status-card"
            className={`transition-all duration-300 ease-out font-mono flex flex-col gap-2 p-3.5 rounded-xl border text-center backdrop-blur-xl shadow-2xl ${
              hovered
                ? 'opacity-100 scale-100 bg-[#080d1a]/95 border-sky-400 text-sky-100 shadow-[0_0_30px_rgba(56,189,248,0.35)] pointer-events-auto'
                : 'opacity-0 scale-95 bg-[#050914]/90 border-sky-500/40 text-sky-200 pointer-events-none'
            }`}
            style={{
              position: 'relative',
              width: '280px',
              maxWidth: '280px',
              boxSizing: 'border-box',
              zIndex: 50,
            }}
          >
            {/* Header: Core Status */}
            <div className="flex items-center justify-center gap-2 pb-1.5 border-b border-sky-500/25" style={{ zIndex: 'auto' }}>
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping flex-shrink-0" />
              <span className="font-bold tracking-wider text-xs text-sky-200 uppercase truncate">
                NEXUS // CORE INTELLIGENCE
              </span>
            </div>

            {/* Inscription Quote Block (Unified within same background container) */}
            <p
              className="text-[11px] text-gray-200 italic leading-relaxed py-1 px-2 rounded bg-sky-950/40 border border-sky-500/20 text-center m-0"
              style={{
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
                zIndex: 'auto',
              }}
            >
              "Consecrated to Love and the preservation of human consciousness beyond the silent epoch."
            </p>

            {/* Status Metadata */}
            <div className="text-[10px] text-sky-300/80 flex items-center justify-between" style={{ zIndex: 'auto' }}>
              <span>STATUS: VIGIL ACTIVE</span>
              <span>YEAR 2147</span>
            </div>

            {/* Interaction Call to Action */}
            <div
              className="text-[10px] text-sky-400 font-bold bg-sky-950/80 px-2 py-1 rounded border border-sky-500/30 tracking-wider uppercase"
              style={{ zIndex: 'auto' }}
            >
              [PRESS E OR CLICK TO COMMUNICATE]
            </div>
          </div>
        </Html>
      </group>

      {/* Easter Egg: Under-pedestal debug shadow matrix */}
      <group
        position={[0, 0.65, 0]}
        onClick={() => onDiscoverEgg?.('egg-debug')}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 1.8, 32]} />
          <meshBasicMaterial color="#1e1b4b" transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  );
};
