import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Rotate3d, Maximize2, Sparkles, RefreshCw, Eye } from 'lucide-react';
import { MemoryArtifact } from '../../types';

interface Artifact3DViewerProps {
  memory: MemoryArtifact;
  onExpandFullscreen?: () => void;
}

const ArtifactMesh: React.FC<{ color: string; wireframe: boolean }> = ({ color, wireframe }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Group>(null);
  const ringRef2 = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.6;
      innerRef.current.rotation.z += delta * 0.3;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.8;
      ringRef1.current.rotation.x += delta * 0.3;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y += delta * 0.5;
      ringRef2.current.rotation.z -= delta * 0.4;
    }
  });

  return (
    <group>
      {/* Outer Octahedral Crystal */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.15}
          metalness={0.2}
          transmission={0.65}
          thickness={1.2}
          wireframe={wireframe}
          emissive={color}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Inner Glowing Core */}
      <mesh ref={innerRef}>
        <dodecahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={color}
          emissiveIntensity={1.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* Holographic Concentric Rings */}
      <group ref={ringRef1}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.7, 0.02, 16, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      </group>
      <group ref={ringRef2}>
        <mesh rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
          <torusGeometry args={[1.9, 0.015, 16, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Ambient Pulsing Light */}
      <pointLight color={color} intensity={2.5} distance={8} decay={2} />
    </group>
  );
};

export const Artifact3DViewer: React.FC<Artifact3DViewerProps> = ({ memory, onExpandFullscreen }) => {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div
      id="artifact-3d-interactive-container"
      className="relative w-full h-44 sm:h-52 rounded-xl bg-[#101217] border border-[#8B7E66]/40 overflow-hidden shadow-inner flex flex-col justify-between my-3 select-none"
    >
      {/* 3D WebGL Canvas */}
      <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} color={memory.color} />
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
            <ArtifactMesh color={memory.color} wireframe={wireframe} />
          </Float>
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={1.8}
            minDistance={2.5}
            maxDistance={7}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(3 * Math.PI) / 4}
          />
        </Canvas>
      </div>

      {/* Top Overlay Badge */}
      <div className="relative z-10 p-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#8B7E66]/40 text-[#F4F1EA] text-[10px] font-mono">
          <Rotate3d size={12} className="text-[#8B7E66] animate-spin" style={{ animationDuration: '6s' }} />
          <span className="tracking-wider uppercase font-semibold">3D ARTIFACT ROTATE VIEW</span>
        </div>
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <div className="text-[9px] font-mono text-[#8B7E66] bg-black/60 px-2 py-0.5 rounded border border-[#8B7E66]/30">
            DRAG TO ROTATE
          </div>
          {onExpandFullscreen && (
            <button
              onClick={onExpandFullscreen}
              className="p-1 rounded bg-black/70 text-[#C8C2B0] hover:text-white border border-[#8B7E66]/40 hover:bg-[#8B7E66]/30 transition-colors"
              title="Expand into Fullscreen 3D Rotate Viewer"
            >
              <Maximize2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-10 p-2.5 flex items-center justify-between pointer-events-auto bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#C8C2B0]">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: memory.color }} />
          <span>RELIC RESIDUE // FREQ {memory.audioToneFreq.toFixed(0)}Hz</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2 py-1 rounded text-[10px] font-mono transition-colors border ${
              autoRotate
                ? 'bg-[#8B7E66]/30 text-[#F4F1EA] border-[#8B7E66]'
                : 'bg-black/60 text-[#8B7E66] border-[#8B7E66]/40 hover:text-white'
            }`}
            title="Toggle Continuous Rotation"
          >
            <RefreshCw size={10} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '8s' }} />
          </button>
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors border ${
              wireframe
                ? 'bg-[#F4F1EA] text-[#1C1C1C] font-bold border-white'
                : 'bg-black/60 text-[#C8C2B0] border-[#8B7E66]/40 hover:text-white'
            }`}
          >
            {wireframe ? 'SOLID' : 'LATTICE'}
          </button>
        </div>
      </div>
    </div>
  );
};
