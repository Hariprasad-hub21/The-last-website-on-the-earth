import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { StageInfo, MemoryArtifact, QualitySetting, MonumentData } from '../../types';
import { MovementKeys } from '../../hooks/useKeyboardControls';
import { ServerVault } from './ServerVault';
import { ArchiveVault } from './ArchiveVault';
import { LostCity } from './LostCity';
import { DreamArchive } from './DreamArchive';
import { SignalBeacon } from './SignalBeacon';
import { AICoreNexus } from './AICoreNexus';
import { MonumentZone } from './MonumentZone';
import { ParticlesField } from './ParticlesField';
import { CinematicCameraController } from './CinematicCameraController';

interface SceneManagerProps {
  currentStage: StageInfo;
  movement: MovementKeys;
  isGuidedTour: boolean;
  presentationShot: number | null;
  quality: QualitySetting;
  reducedMotion: boolean;
  monument: MonumentData | null;
  signalState: 'WAITING' | 'DISCOVERED' | 'ANSWERED';
  onSelectMemory: (memory: MemoryArtifact) => void;
  onSelectRelic: (relic: any) => void;
  onSignalInteract: () => void;
  onOpenChat: () => void;
  onDiscoverEgg: (id: string) => void;
  onPlayerMoved?: (pos: [number, number, number]) => void;
}

export const SceneManager: React.FC<SceneManagerProps> = ({
  currentStage,
  movement,
  isGuidedTour,
  presentationShot,
  quality,
  reducedMotion,
  monument,
  signalState,
  onSelectMemory,
  onSelectRelic,
  onSignalInteract,
  onOpenChat,
  onDiscoverEgg,
  onPlayerMoved,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#020408]">
      <Canvas
        camera={{ position: [0, 4, 30], fov: 60, near: 0.1, far: 500 }}
        gl={{
          antialias: quality !== 'LOW',
          powerPreference: 'high-performance',
          alpha: false,
        }}
        dpr={quality === 'LOW' ? 1 : quality === 'MEDIUM' ? 1.25 : [1, 2]}
      >
        {/* Dynamic Atmospheric Fog based on Stage */}
        <color attach="background" args={[currentStage.fogColor]} />
        <fog
          attach="fog"
          args={[currentStage.fogColor, currentStage.fogNear, currentStage.fogFar]}
        />

        {/* Cinematic Ambient & Key Lighting */}
        <ambientLight intensity={quality === 'LOW' ? 0.8 : 0.45} color={currentStage.ambientColor} />
        
        {/* Primary Vault Key Light */}
        <pointLight
          position={[0, 12, 5]}
          intensity={1.2}
          color="#38bdf8"
          distance={45}
          decay={2}
        />

        {/* Archive Spotlight */}
        <pointLight
          position={[-16, 10, -8]}
          intensity={1.5}
          color="#06b6d4"
          distance={35}
          decay={2}
        />

        {/* Lost City Distant Horizon Sunlight/Moonlight */}
        <directionalLight
          position={[0, 40, -120]}
          intensity={0.8}
          color="#f59e0b"
        />

        {/* Dream Zone Surreal Pink/Purple Glow */}
        <pointLight
          position={[20, 12, -28]}
          intensity={1.6}
          color="#ec4899"
          distance={40}
          decay={2}
        />

        {/* NEXUS AI Core Radiant Spotlights */}
        <pointLight
          position={[0, 10, -85]}
          intensity={2.8}
          color={monument ? '#fbbf24' : '#60a5fa'}
          distance={50}
          decay={2}
        />

        <Suspense fallback={null}>
          {/* Camera Motion & Controls */}
          <CinematicCameraController
            currentStage={currentStage}
            movement={movement}
            isGuidedTour={isGuidedTour}
            presentationShot={presentationShot}
            reducedMotion={reducedMotion}
            onPlayerMoved={onPlayerMoved}
          />

          {/* 3D World Sectors */}
          <ServerVault onDiscoverEgg={onDiscoverEgg} />
          
          <ArchiveVault
            onSelectMemory={onSelectMemory}
            onDiscoverEgg={onDiscoverEgg}
          />

          <LostCity onDiscoverEgg={onDiscoverEgg} />

          <DreamArchive
            onSelectRelic={onSelectRelic}
            onDiscoverEgg={onDiscoverEgg}
          />

          <SignalBeacon
            onSignalInteract={onSignalInteract}
            signalState={signalState}
          />

          <AICoreNexus
            onOpenChat={onOpenChat}
            onDiscoverEgg={onDiscoverEgg}
          />

          <MonumentZone monument={monument} />

          {/* Atmospheric Particle Atmosphere */}
          <ParticlesField quality={quality} accentColor={currentStage.accentColor} />
        </Suspense>
      </Canvas>
    </div>
  );
};
