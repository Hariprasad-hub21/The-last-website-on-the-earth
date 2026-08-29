import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { audioEngine } from '../../systems/audioEngine';

interface SignalBeaconProps {
  onSignalInteract: () => void;
  signalState: 'WAITING' | 'DISCOVERED' | 'ANSWERED';
}

export const SignalBeacon: React.FC<SignalBeaconProps> = ({ onSignalInteract, signalState }) => {
  const [hovered, setHovered] = useState(false);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Expanding waveform ripples
    ringsRef.current.forEach((ring, idx) => {
      if (ring) {
        const timeOffset = (state.clock.elapsedTime * 0.8 + idx * 0.4) % 2.5;
        const scale = 1 + timeOffset * 2.8;
        ring.scale.set(scale, scale, scale);
        (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - timeOffset * 0.32);
      }
    });

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 1.5;
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={[0, 0, -52]}>
      {/* Heavy Base Pedestal */}
      <mesh position={[0, 0.4, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 4.0, 0.8, 8]} />
        <meshStandardMaterial color="#061217" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Vertical Quantum Light Spire */}
      <mesh position={[0, 15, 0]}>
        <cylinderGeometry args={[0.08, 0.6, 30, 16, 1, true]} />
        <meshBasicMaterial
          color={signalState === 'DISCOVERED' ? '#10b981' : '#38bdf8'}
          transparent
          opacity={hovered ? 0.6 : 0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pulsing Quantum Core Orb */}
      <group
        position={[0, 3.5, 0]}
        onClick={() => {
          audioEngine.playSignalPulse();
          onSignalInteract();
        }}
        onPointerOver={() => {
          setHovered(true);
          audioEngine.playClick(600);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <mesh ref={coreRef} scale={hovered ? [1.25, 1.25, 1.25] : [1, 1, 1]}>
          <dodecahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color={signalState === 'DISCOVERED' ? '#10b981' : '#38bdf8'}
            emissive={signalState === 'DISCOVERED' ? '#10b981' : '#38bdf8'}
            emissiveIntensity={hovered ? 2.5 : 1.2}
            roughness={0.1}
            metalness={0.8}
            wireframe
          />
        </mesh>

        {/* Expanding Waveform Rings */}
        {[0, 1, 2, 3].map((idx) => (
          <mesh
            key={`wave-ring-${idx}`}
            ref={(el) => {
              if (el) ringsRef.current[idx] = el;
            }}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[1.2, 1.28, 48]} />
            <meshBasicMaterial
              color={signalState === 'DISCOVERED' ? '#34d399' : '#38bdf8'}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}

        {/* 3D Floating Signal Prompt */}
        <Html
          position={[0, 1.8, 0]}
          center={false}
          distanceFactor={14}
          zIndexRange={[50, 0]}
          style={{
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
          }}
        >
          <div
            className={`transition-all duration-300 ease-out font-mono flex flex-col gap-1.5 px-4 py-3 rounded-xl border text-center backdrop-blur-md shadow-xl ${
              hovered || signalState === 'DISCOVERED'
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-95 pointer-events-none'
            } ${
              signalState === 'DISCOVERED'
                ? 'bg-emerald-950/95 border-emerald-400 text-emerald-200'
                : hovered
                ? 'bg-sky-950/95 border-sky-300 text-sky-100 shadow-[0_0_25px_rgba(56,189,248,0.3)]'
                : 'bg-black/90 border-sky-500/50 text-sky-300'
            }`}
            style={{
              position: 'relative',
              width: '260px',
              maxWidth: '260px',
              boxSizing: 'border-box',
              zIndex: 50,
            }}
          >
            <div className="text-[10px] tracking-widest text-sky-400/80 uppercase" style={{ zIndex: 'auto' }}>
              QUANTUM BEACON // 2147
            </div>
            <div
              className="font-bold text-xs text-white"
              style={{
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
                zIndex: 'auto',
              }}
            >
              {signalState === 'WAITING'
                ? 'IS ANYONE THERE?'
                : signalState === 'DISCOVERED'
                ? 'YOU FOUND ME.'
                : 'I HAVE BEEN WAITING.'}
            </div>
            {signalState === 'WAITING' && (
              <div className="text-[9px] text-sky-400 animate-pulse pt-0.5" style={{ zIndex: 'auto' }}>
                [CLICK TO ESTABLISH TRANSMISSION]
              </div>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
};
