import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Sparkles as DreiSparkles } from '@react-three/drei';
import * as THREE from 'three';
import {
  Rotate3d,
  X,
  Volume2,
  Maximize2,
  Minimize2,
  RefreshCw,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sliders,
  Info,
  Compass,
  Check
} from 'lucide-react';
import { MemoryArtifact, MonumentData } from '../../types';
import { MEMORY_ARTIFACTS, DREAM_RELICS } from '../../data/memories';
import { audioEngine } from '../../systems/audioEngine';

// Combined item schema for 3D inspection
export interface InspectableItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  color: string;
  audioToneFreq: number;
  quote: string;
  description: string;
  fullStory?: string;
  geometryType: 'octahedron' | 'dodecahedron' | 'icosahedron' | 'torusKnot' | 'pyramid' | 'crystalCluster' | 'monumentShard';
}

// Convert all memories and dream relics into inspectable 3D items
export const ALL_INSPECTABLE_ITEMS: InspectableItem[] = [
  ...MEMORY_ARTIFACTS.map((m, idx) => ({
    id: m.id,
    code: m.code,
    title: m.title,
    subtitle: m.category + ' RELIC',
    category: m.category,
    date: m.date,
    color: m.color,
    audioToneFreq: m.audioToneFreq,
    quote: m.quote,
    description: m.description,
    fullStory: m.fullStory,
    geometryType: (['octahedron', 'dodecahedron', 'icosahedron', 'torusKnot', 'crystalCluster', 'octahedron'][idx % 6]) as InspectableItem['geometryType'],
  })),
  {
    id: 'relic-monument-eternal',
    code: 'CONSECRATED_00',
    title: 'THE CONSECRATED MONUMENT',
    subtitle: 'ETERNAL COGNITIVE BEACON',
    category: 'MONUMENT',
    date: '2147.08.29',
    color: '#fbbf24',
    audioToneFreq: 880,
    quote: '"Consecrated to Love and the preservation of human consciousness beyond the silent epoch."',
    description: 'A monument forged in hyper-dense fused quartz crystal, resonating at golden harmonic ratios.',
    fullStory: 'Carved with thousands of crowd-submitted final words from Earth’s concluding era. The crystal structure refracts ambient solar flux into readable photonic archives.',
    geometryType: 'monumentShard',
  },
  ...DREAM_RELICS.map((d, idx) => ({
    id: d.id,
    code: `DREAM_0${idx + 1}`,
    title: d.title,
    subtitle: 'OLD-WEB DREAM RELIC',
    category: 'DREAM',
    date: '2000–2140',
    color: d.color,
    audioToneFreq: 520 + idx * 75,
    quote: d.meaning,
    description: 'An ethereal mathematical relic drifting across the conceptual internet graveyard.',
    geometryType: (['torusKnot', 'icosahedron', 'dodecahedron', 'pyramid'][idx % 4]) as InspectableItem['geometryType'],
  })),
];

interface Interactive3DRotateModalProps {
  initialItemId?: string;
  onClose: () => void;
  currentMonument?: MonumentData | null;
}

// Custom 3D Mesh Component with Multiple Morphing Geometries
const Sculpted3DArtifact: React.FC<{
  item: InspectableItem;
  renderMode: 'SOLID' | 'LATTICE' | 'QUANTUM' | 'AURORA';
  rotationSpeed: number;
  isFloating: boolean;
}> = ({ item, renderMode, rotationSpeed, isFloating }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringGroupRef1 = useRef<THREE.Group>(null);
  const ringGroupRef2 = useRef<THREE.Group>(null);
  const satelliteRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const speed = delta * rotationSpeed;
    if (meshRef.current) {
      meshRef.current.rotation.y += speed * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= speed * 0.8;
      coreRef.current.rotation.z += speed * 0.4;
    }
    if (ringGroupRef1.current) {
      ringGroupRef1.current.rotation.z += speed * 0.9;
      ringGroupRef1.current.rotation.x += speed * 0.3;
    }
    if (ringGroupRef2.current) {
      ringGroupRef2.current.rotation.y += speed * 0.6;
      ringGroupRef2.current.rotation.z -= speed * 0.5;
    }
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y += speed * 1.2;
    }
  });

  const wireframe = renderMode === 'LATTICE';
  const isQuantum = renderMode === 'QUANTUM';
  const isAurora = renderMode === 'AURORA';

  return (
    <group>
      {/* Central Sculpted Artifact */}
      <mesh ref={meshRef}>
        {item.geometryType === 'octahedron' && <octahedronGeometry args={[1.35, 0]} />}
        {item.geometryType === 'dodecahedron' && <dodecahedronGeometry args={[1.25, 0]} />}
        {item.geometryType === 'icosahedron' && <icosahedronGeometry args={[1.3, 0]} />}
        {item.geometryType === 'torusKnot' && <torusKnotGeometry args={[0.9, 0.28, 100, 16]} />}
        {item.geometryType === 'pyramid' && <coneGeometry args={[1.2, 1.8, 4]} />}
        {item.geometryType === 'monumentShard' && <octahedronGeometry args={[1.5, 0]} />}
        {item.geometryType === 'crystalCluster' && <icosahedronGeometry args={[1.35, 1]} />}

        {isQuantum ? (
          <meshStandardMaterial
            color="#ffffff"
            wireframe
            emissive={item.color}
            emissiveIntensity={2.5}
            roughness={0.1}
          />
        ) : isAurora ? (
          <meshPhysicalMaterial
            color={item.color}
            roughness={0.05}
            metalness={0.9}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            transmission={0.4}
            thickness={1.5}
            emissive={item.color}
            emissiveIntensity={0.8}
          />
        ) : (
          <meshPhysicalMaterial
            color={item.color}
            roughness={0.12}
            metalness={0.25}
            transmission={wireframe ? 0 : 0.68}
            thickness={1.4}
            wireframe={wireframe}
            emissive={item.color}
            emissiveIntensity={wireframe ? 0.9 : 0.35}
          />
        )}
      </mesh>

      {/* Internal Pulsing Energy Core */}
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={item.color}
          emissiveIntensity={isQuantum ? 3.0 : 1.6}
          wireframe={wireframe || isQuantum}
        />
      </mesh>

      {/* Outer Gyroscopic Concentric Orbit Rings */}
      <group ref={ringGroupRef1}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.95, 0.02, 16, 80]} />
          <meshBasicMaterial
            color={item.color}
            transparent
            opacity={wireframe ? 0.9 : 0.65}
          />
        </mesh>
      </group>

      <group ref={ringGroupRef2}>
        <mesh rotation={[-Math.PI / 3, Math.PI / 5, 0]}>
          <torusGeometry args={[2.2, 0.015, 16, 80]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.45}
          />
        </mesh>
      </group>

      {/* Orbiting Satellite Data Nodes */}
      <group ref={satelliteRef}>
        <mesh position={[2.5, 0.3, 0]}>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshBasicMaterial color={item.color} />
        </mesh>
        <mesh position={[-2.5, -0.3, 0]}>
          <octahedronGeometry args={[0.12, 0]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Point Lights for Dynamic Ray Shading */}
      <pointLight color={item.color} intensity={3.5} distance={10} decay={2} />
      <pointLight position={[0, -2, 0]} color="#ffffff" intensity={1.5} distance={6} />
    </group>
  );
};

export const Interactive3DRotateModal: React.FC<Interactive3DRotateModalProps> = ({
  initialItemId,
  onClose,
  currentMonument,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(() => {
    if (initialItemId) {
      const foundIdx = ALL_INSPECTABLE_ITEMS.findIndex((it) => it.id === initialItemId);
      if (foundIdx !== -1) return foundIdx;
    }
    return 0;
  });

  const [renderMode, setRenderMode] = useState<'SOLID' | 'LATTICE' | 'QUANTUM' | 'AURORA'>('SOLID');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.5);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showWireframeGrid, setShowWireframeGrid] = useState<boolean>(true);
  const [showInfoDrawer, setShowInfoDrawer] = useState<boolean>(true);

  const currentItem = useMemo(() => {
    const base = ALL_INSPECTABLE_ITEMS[selectedIndex] || ALL_INSPECTABLE_ITEMS[0];
    if (base.id === 'relic-monument-eternal' && currentMonument) {
      return {
        ...base,
        title: `MONUMENT OF ${currentMonument.word.toUpperCase()}`,
        quote: `"${currentMonument.inscription}"`,
        subtitle: `INSCRIBED BY ${currentMonument.author || 'HUMANITY'} // ${currentMonument.timestamp}`,
      };
    }
    return base;
  }, [selectedIndex, currentMonument]);

  const handleNext = () => {
    audioEngine.playClick(650);
    setSelectedIndex((prev) => (prev + 1) % ALL_INSPECTABLE_ITEMS.length);
  };

  const handlePrev = () => {
    audioEngine.playClick(600);
    setSelectedIndex((prev) => (prev - 1 + ALL_INSPECTABLE_ITEMS.length) % ALL_INSPECTABLE_ITEMS.length);
  };

  const handlePlayChime = () => {
    audioEngine.playMemoryChime(currentItem.audioToneFreq);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setAutoRotate((prev) => !prev);
      }
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      id="interactive-3d-rotate-view-overlay"
      className="fixed inset-0 z-[65] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn select-none font-ui"
    >
      {/* Outer Modal Container */}
      <div
        id="interactive-3d-rotate-modal-card"
        className={`relative w-full ${
          isFullscreen ? 'max-w-none h-full rounded-none' : 'max-w-5xl h-[88vh] max-h-[820px] rounded-2xl'
        } bg-[#0A0D14] border border-[#8B7E66]/40 shadow-[0_30px_90px_rgba(0,0,0,0.95)] text-[#F4F1EA] flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* Top Header Bar */}
        <div className="relative z-30 px-5 py-3.5 border-b border-[#8B7E66]/25 bg-[#0E121B]/95 backdrop-blur-md flex items-center justify-between gap-4">
          {/* Left: Branding & Current Relic Indicator */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#171D2B] border border-[#8B7E66]/40 text-[#8B7E66]">
              <Rotate3d size={18} className="animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#8B7E66] uppercase">
                <span>INTERACTIVE 3D ROTATE VIEW</span>
                <span>•</span>
                <span className="text-[#38bdf8] font-bold">SPATIAL SCANNER 2147</span>
              </div>
              <h2 className="font-editorial text-lg sm:text-xl font-normal text-[#F4F1EA] tracking-wide truncate max-w-sm sm:max-w-md">
                {currentItem.title}
              </h2>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfoDrawer(!showInfoDrawer)}
              className={`p-2 rounded-xl border text-xs font-mono transition-colors flex items-center gap-1.5 ${
                showInfoDrawer
                  ? 'bg-[#8B7E66]/20 border-[#8B7E66] text-[#F4F1EA]'
                  : 'bg-[#141A26] border-[#8B7E66]/30 text-[#8B7E66] hover:text-white'
              }`}
              title="Toggle Telemetry Drawer"
            >
              <Info size={14} />
              <span className="hidden sm:inline">DATA</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-[#141A26] border border-[#8B7E66]/30 text-[#C8C2B0] hover:text-white hover:border-[#8B7E66] transition-colors"
              title="Toggle Fullscreen Canvas"
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            <button
              id="close-3d-rotate-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#171D2B] border border-[#8B7E66]/40 text-[#8B7E66] hover:text-[#F4F1EA] hover:bg-[#252E42] transition-colors"
              aria-label="Exit 3D Rotate Viewer"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Main Interactive Stage */}
        <div className="relative flex-1 flex overflow-hidden">
          {/* Central 3D Canvas Viewport */}
          <div className="relative flex-1 h-full bg-[radial-gradient(ellipse_at_center,#141B2A_0%,#080A10_100%)] overflow-hidden cursor-grab active:cursor-grabbing">
            {/* Background 3D Coordinate Grid Guide */}
            {showWireframeGrid && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8B7E6610_1px,transparent_1px),linear-gradient(to_bottom,#8B7E6610_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none opacity-40" />
            )}

            {/* Three.js R3F Canvas */}
            <Canvas camera={{ position: [0, 0, 4.8], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[6, 8, 6]} intensity={1.5} />
              <directionalLight position={[-6, -6, -6]} intensity={0.8} color={currentItem.color} />
              <directionalLight position={[0, 8, -6]} intensity={0.5} color="#38bdf8" />

              {/* Background Stars / Space Dust */}
              <Stars radius={50} depth={30} count={600} factor={3} saturation={0} fade speed={1} />
              <DreiSparkles count={40} scale={6} size={2.5} speed={0.4} color={currentItem.color} />

              <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
                <Sculpted3DArtifact
                  item={currentItem}
                  renderMode={renderMode}
                  rotationSpeed={rotationSpeed}
                  isFloating
                />
              </Float>

              {/* Interactive Full OrbitControls (Drag, Pinch/Scroll Zoom, Pan) */}
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                autoRotate={autoRotate}
                autoRotateSpeed={rotationSpeed * 1.5}
                minDistance={2.5}
                maxDistance={9.0}
                dampingFactor={0.08}
              />
            </Canvas>

            {/* Floating Overlay: Relic Carousel Navigators */}
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-20">
              <button
                onClick={handlePrev}
                className="pointer-events-auto p-3 rounded-full bg-[#0E121B]/90 border border-[#8B7E66]/40 text-[#F4F1EA] hover:bg-[#8B7E66]/30 hover:scale-110 shadow-2xl transition-all"
                title="Previous Artifact (Left Arrow)"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none z-20">
              <button
                onClick={handleNext}
                className="pointer-events-auto p-3 rounded-full bg-[#0E121B]/90 border border-[#8B7E66]/40 text-[#F4F1EA] hover:bg-[#8B7E66]/30 hover:scale-110 shadow-2xl transition-all"
                title="Next Artifact (Right Arrow)"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Top-Left HUD Badge in 3D Stage */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1.5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0E121B]/90 border border-[#8B7E66]/40 backdrop-blur-md text-[11px] font-mono shadow-xl">
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: currentItem.color }} />
                <span className="font-semibold text-white tracking-wider">{currentItem.code}</span>
                <span className="text-[#8B7E66]">•</span>
                <span className="text-[#A3967C] uppercase">{currentItem.category}</span>
              </div>
              <div className="text-[9px] font-mono text-[#8B7E66] bg-black/60 px-2.5 py-1 rounded-md border border-[#8B7E66]/20 backdrop-blur-sm self-start">
                DRAG TO ORBIT 360° // SCROLL TO ZOOM
              </div>
            </div>

            {/* Bottom Floating Interactive Shader Controls Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex flex-wrap items-center justify-center gap-2 bg-[#0E121B]/95 border border-[#8B7E66]/40 p-2 rounded-2xl backdrop-blur-xl shadow-2xl max-w-[95%]">
              {/* Auto Rotate Switch */}
              <button
                onClick={() => {
                  audioEngine.playClick(750);
                  setAutoRotate(!autoRotate);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  autoRotate
                    ? 'bg-[#8B7E66]/30 border-[#8B7E66] text-[#F4F1EA] font-semibold'
                    : 'bg-[#141A26] border-[#8B7E66]/30 text-[#8B7E66] hover:text-white'
                }`}
                title="Continuous 360° Spin (Spacebar)"
              >
                <RefreshCw size={12} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
                <span>{autoRotate ? 'ROTATING' : 'PAUSED'}</span>
              </button>

              {/* Speed Preset Buttons */}
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-xl bg-[#141A26] border border-[#8B7E66]/25 text-[11px] font-mono">
                <span className="text-[#8B7E66] mr-1 text-[10px]">SPEED:</span>
                {[1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => {
                      audioEngine.playClick(600 + spd * 50);
                      setRotationSpeed(spd);
                    }}
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      rotationSpeed === spd
                        ? 'bg-[#8B7E66] text-[#101217] font-bold'
                        : 'text-[#C8C2B0] hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Render Material Modes */}
              <div className="flex items-center gap-1 bg-[#141A26] border border-[#8B7E66]/30 p-0.5 rounded-xl text-[11px] font-mono">
                {(['SOLID', 'LATTICE', 'QUANTUM', 'AURORA'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      audioEngine.playClick(800);
                      setRenderMode(mode);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      renderMode === mode
                        ? 'bg-[#F4F1EA] text-[#1C1C1C] font-bold shadow-md'
                        : 'text-[#8B7E66] hover:text-[#F4F1EA]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Harmonic Audio Chime Button */}
              <button
                onClick={handlePlayChime}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDE9E1] text-[#1C1C1C] font-bold text-xs hover:bg-white transition-all shadow-md"
                title="Synthesize Relic Resonance Tone"
              >
                <Volume2 size={13} className="text-[#8B7E66]" />
                <span className="hidden sm:inline">TONE</span>
                <span className="font-mono text-[10px] text-[#5C564C]">{currentItem.audioToneFreq.toFixed(0)}Hz</span>
              </button>
            </div>
          </div>

          {/* Right Side Telemetry Drawer Panel */}
          {showInfoDrawer && (
            <div className="w-72 sm:w-80 border-l border-[#8B7E66]/30 bg-[#0E121B]/95 backdrop-blur-md p-5 flex flex-col justify-between overflow-y-auto space-y-4 font-ui">
              <div className="space-y-4">
                {/* Artifact Code & Epoch */}
                <div className="pb-3 border-b border-[#8B7E66]/20">
                  <div className="text-[10px] font-mono text-[#8B7E66] tracking-widest uppercase">
                    ARCHIVAL FOLIO // {currentItem.date}
                  </div>
                  <h3 className="font-editorial text-xl font-semibold text-[#F4F1EA] mt-0.5">
                    {currentItem.title}
                  </h3>
                  <div className="text-xs text-[#38bdf8] font-mono font-medium mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentItem.color }} />
                    <span>{currentItem.subtitle}</span>
                  </div>
                </div>

                {/* Quote Callout */}
                <div className="p-3.5 rounded-xl bg-[#141A26] border-l-2 border-[#8B7E66] text-[#EDE9E1] text-xs font-editorial italic leading-relaxed shadow-sm">
                  {currentItem.quote}
                </div>

                {/* Narrative Details */}
                <div className="space-y-2 text-xs text-[#C8C2B0] leading-relaxed">
                  <p className="font-medium text-[#F4F1EA]">
                    {currentItem.description}
                  </p>
                  {currentItem.fullStory && (
                    <p className="text-[11px] text-[#8B7E66] leading-relaxed font-ui">
                      {currentItem.fullStory}
                    </p>
                  )}
                </div>

                {/* Technical Spatial Specifications */}
                <div className="p-3 rounded-xl bg-[#141A26] border border-[#8B7E66]/20 space-y-2 text-[10px] font-mono text-[#8B7E66]">
                  <div className="flex justify-between pb-1 border-b border-[#8B7E66]/15">
                    <span>GEOMETRY SCULPT:</span>
                    <span className="text-[#F4F1EA] uppercase">{currentItem.geometryType}</span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-[#8B7E66]/15">
                    <span>RESONANCE FREQUENCY:</span>
                    <span className="text-[#38bdf8]">{currentItem.audioToneFreq.toFixed(1)} Hz</span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-[#8B7E66]/15">
                    <span>MATERIAL INDEX:</span>
                    <span className="text-[#F4F1EA]">FUSED QUARTZ (η = 1.458)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DISCOVERY STATUS:</span>
                    <span className="text-[#10b981] font-bold">PERMANENTLY ARCHIVED</span>
                  </div>
                </div>
              </div>

              {/* Artifact Selector Grid Carousel at Bottom of Drawer */}
              <div className="pt-3 border-t border-[#8B7E66]/20 space-y-2">
                <div className="text-[10px] font-mono text-[#8B7E66] tracking-wider uppercase flex justify-between">
                  <span>CATALOGUE ({selectedIndex + 1}/{ALL_INSPECTABLE_ITEMS.length})</span>
                  <span>CLICK TO VIEW</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {ALL_INSPECTABLE_ITEMS.map((item, idx) => {
                    const isCurrent = idx === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          audioEngine.playClick(600 + idx * 30);
                          setSelectedIndex(idx);
                        }}
                        className={`p-2 rounded-lg border text-center font-mono text-[9px] transition-all flex flex-col items-center gap-1 ${
                          isCurrent
                            ? 'bg-[#8B7E66]/40 border-white text-white font-bold shadow-sm'
                            : 'bg-[#141A26] border-[#8B7E66]/20 text-[#8B7E66] hover:border-[#8B7E66] hover:text-white'
                        }`}
                        title={item.title}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="truncate w-full">{item.code.replace('MEMORY_', 'M').replace('DREAM_', 'D').replace('CONSECRATED_', 'C')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
