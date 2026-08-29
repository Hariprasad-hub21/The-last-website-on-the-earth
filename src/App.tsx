import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StageId, StageInfo, MemoryArtifact, EasterEgg, MonumentData, AppSettings } from './types';
import { STAGES, STAGE_ORDER } from './data/stages';
import { MEMORY_ARTIFACTS } from './data/memories';
import { EASTER_EGGS } from './data/easterEggs';
import { SceneManager } from './components/3d/SceneManager';
import { HUD } from './components/ui/HUD';
import { BootSequence } from './components/ui/BootSequence';
import { MemoryReaderModal } from './components/ui/MemoryReaderModal';
import { NexusChatModal } from './components/ui/NexusChatModal';
import { FinalQuestionModal } from './components/ui/FinalQuestionModal';
import { EndingScreen } from './components/ui/EndingScreen';
import { MemorialGallery } from './components/ui/MemorialGallery';
import { SettingsModal } from './components/ui/SettingsModal';
import { ProjectInfoModal } from './components/ui/ProjectInfoModal';
import { PresentationModeOverlay } from './components/ui/PresentationModeOverlay';
import { MobileControlsOverlay } from './components/ui/MobileControlsOverlay';
import { EasterEggModal } from './components/ui/EasterEggModal';
import { Interactive3DRotateModal } from './components/ui/Interactive3DRotateModal';
import { useKeyboardControls, MovementKeys } from './hooks/useKeyboardControls';
import { audioEngine } from './systems/audioEngine';

export const App: React.FC = () => {
  // Core App & Stage States
  const [bootCompleted, setBootCompleted] = useState(false);
  const [currentStageId, setCurrentStageId] = useState<StageId>('VAULT');
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 2.5, 14]);

  // Interactive Modals
  const [selectedMemory, setSelectedMemory] = useState<MemoryArtifact | null>(null);
  const [is3DRotateModalOpen, setIs3DRotateModalOpen] = useState(false);
  const [selectedRotateItemId, setSelectedRotateItemId] = useState<string | undefined>(undefined);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [isEndingOpen, setIsEndingOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);
  const [activeEasterEgg, setActiveEasterEgg] = useState<EasterEgg | null>(null);

  // Discoveries and Tributes
  const [discoveredMemoryIds, setDiscoveredMemoryIds] = useState<Set<string>>(new Set());
  const [unlockedEggIds, setUnlockedEggIds] = useState<Set<string>>(new Set());
  const [signalState, setSignalState] = useState<'WAITING' | 'DISCOVERED' | 'ANSWERED'>('WAITING');
  const [monument, setMonument] = useState<MonumentData | null>(null);

  // Showcase Modes
  const [isGuidedTour, setIsGuidedTour] = useState(false);
  const [guidedTourIndex, setGuidedTourIndex] = useState(0);
  const [presentationMode, setPresentationMode] = useState(false);
  const [presentationShot, setPresentationShot] = useState<number | null>(null);

  // Settings
  const [settings, setSettings] = useState<AppSettings>({
    soundEnabled: true,
    musicVolume: 0.7,
    sfxVolume: 0.8,
    quality: 'HIGH',
    reducedMotion: false,
    bloomEnabled: true,
    cinematicLetterbox: false,
    guidedTourSpeed: 7000,
  });

  // Mobile virtual movement state override
  const [mobileMovement, setMobileMovement] = useState<MovementKeys>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
    space: false,
    interact: false,
  });

  // Global Audio Atmosphere sync
  useEffect(() => {
    if (bootCompleted) {
      audioEngine.setStageAtmosphere(currentStageId);
    }
  }, [currentStageId, bootCompleted]);

  // Check saved monuments on mount & auto-detect mobile quality
  useEffect(() => {
    try {
      const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        setSettings((s) => ({ ...s, quality: 'MEDIUM' }));
      }
      const stored = JSON.parse(localStorage.getItem('last_website_monuments') || '[]');
      if (Array.isArray(stored) && stored.length > 0) {
        setMonument(stored[0]);
      }
    } catch (e) {}
  }, []);

  // Keyboard interaction callback
  const handleKeyboardInteract = useCallback(() => {
    if (currentStageId === 'ARCHIVE') {
      const firstUnread = MEMORY_ARTIFACTS.find((m) => !discoveredMemoryIds.has(m.id)) || MEMORY_ARTIFACTS[0];
      setSelectedMemory(firstUnread);
      setDiscoveredMemoryIds((prev) => new Set([...prev, firstUnread.id]));
    } else if (currentStageId === 'SIGNAL') {
      handleSignalInteract();
    } else if (currentStageId === 'CORE') {
      setIsChatOpen(true);
    } else if (currentStageId === 'QUESTION') {
      setIsQuestionOpen(true);
    }
  }, [currentStageId, discoveredMemoryIds]);

  const handleTogglePresentation = useCallback(() => {
    setPresentationMode((prev) => {
      const next = !prev;
      if (next) setPresentationShot(1);
      else setPresentationShot(null);
      return next;
    });
  }, []);

  const handleToggleRotateView = useCallback(() => {
    setIs3DRotateModalOpen((prev) => !prev);
  }, []);

  const keyboardMovement = useKeyboardControls(
    handleKeyboardInteract,
    handleTogglePresentation,
    handleToggleRotateView
  );

  // Combined movement
  const movement = useMemo(() => {
    return {
      forward: keyboardMovement.forward || mobileMovement.forward,
      backward: keyboardMovement.backward || mobileMovement.backward,
      left: keyboardMovement.left || mobileMovement.left,
      right: keyboardMovement.right || mobileMovement.right,
      shift: keyboardMovement.shift || mobileMovement.shift,
      space: keyboardMovement.space || mobileMovement.space,
      interact: keyboardMovement.interact || mobileMovement.interact,
    };
  }, [keyboardMovement, mobileMovement]);

  // Guided tour automated stage progression
  useEffect(() => {
    if (!isGuidedTour) return;

    const interval = setInterval(() => {
      setGuidedTourIndex((prev) => {
        const next = (prev + 1) % STAGE_ORDER.length;
        const nextStageId = STAGE_ORDER[next];
        setCurrentStageId(nextStageId);
        audioEngine.playWarpTransition();

        // If looped full circle to CORE, offer final question
        if (next === STAGE_ORDER.length - 1) {
          setTimeout(() => {
            setIsGuidedTour(false);
            setIsQuestionOpen(true);
          }, 6000);
        }

        return next;
      });
    }, settings.guidedTourSpeed);

    return () => clearInterval(interval);
  }, [isGuidedTour, settings.guidedTourSpeed]);

  const handleStageSelect = (stageId: StageId) => {
    if (isGuidedTour) setIsGuidedTour(false);
    setCurrentStageId(stageId);
    audioEngine.playWarpTransition();
  };

  const handleSelectMemory = (memory: MemoryArtifact) => {
    setSelectedMemory(memory);
    setDiscoveredMemoryIds((prev) => new Set([...prev, memory.id]));
  };

  const handleSignalInteract = () => {
    setSignalState('DISCOVERED');
    audioEngine.playSignalPulse();
    setTimeout(() => {
      setCurrentStageId('CORE');
      audioEngine.playWarpTransition();
    }, 1400);
  };

  const handleDiscoverEgg = (eggId: string) => {
    const egg = EASTER_EGGS.find((e) => e.id === eggId);
    if (egg && !unlockedEggIds.has(eggId)) {
      setUnlockedEggIds((prev) => new Set([...prev, eggId]));
      setActiveEasterEgg(egg);
      audioEngine.playMemoryChime(783.99);
    }
  };

  const handleMonumentCreated = (newMonument: MonumentData) => {
    setMonument(newMonument);
    setCurrentStageId('MONUMENT');
    audioEngine.playWarpTransition();

    // After 8 seconds of awe, transition to the ending scene
    setTimeout(() => {
      setIsEndingOpen(true);
    }, 9000);
  };

  // Dynamic context interaction prompt based on current stage
  const interactionPrompt = useMemo(() => {
    if (isGuidedTour || presentationMode) return null;
    if (currentStageId === 'ARCHIVE') return 'ACCESS DATA CAPSULES';
    if (currentStageId === 'SIGNAL' && signalState === 'WAITING') return 'ESTABLISH QUANTUM LINK';
    if (currentStageId === 'CORE') return 'COMMUNICATE WITH NEXUS';
    if (currentStageId === 'QUESTION') return 'CARVE FINAL MONUMENT';
    return null;
  }, [currentStageId, signalState, isGuidedTour, presentationMode]);

  const currentStageInfo = STAGES[currentStageId] || STAGES.VAULT;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Cinematic Boot Sequence on First Load */}
      {!bootCompleted && (
        <BootSequence
          onComplete={() => setBootCompleted(true)}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() => {
            const next = !settings.soundEnabled;
            setSettings((s) => ({ ...s, soundEnabled: next }));
            audioEngine.setMuted(!next);
          }}
        />
      )}

      {/* Main 3D WebGL Canvas Scene */}
      <SceneManager
        currentStage={currentStageInfo}
        movement={movement}
        isGuidedTour={isGuidedTour}
        presentationShot={presentationShot}
        quality={settings.quality}
        reducedMotion={settings.reducedMotion}
        monument={monument}
        signalState={signalState}
        onSelectMemory={handleSelectMemory}
        onSelectRelic={(relic) => {
          setSelectedMemory({
            id: relic.id,
            code: 'RELIC_DREAM',
            title: relic.title,
            date: 'TIMELESS // OLD WEB CACHE',
            category: 'EMOTION',
            position: relic.position,
            glyph: 'DREAM',
            color: relic.color,
            audioToneFreq: 659.25,
            quote: `"${relic.meaning}"`,
            description: 'A crystallized subconscious fragment of human creativity.',
            fullStory: relic.meaning,
          });
        }}
        onSignalInteract={handleSignalInteract}
        onOpenChat={() => setIsChatOpen(true)}
        onDiscoverEgg={handleDiscoverEgg}
        onPlayerMoved={setPlayerPos}
      />

      {/* Guided Tour Stage Narration Banner */}
      {isGuidedTour && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center font-ui animate-fadeIn max-w-lg px-4 select-none">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4F1EA]/95 border border-[#8B7E66]/40 text-[#1C1C1C] text-xs font-semibold shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#8B7E66] animate-pulse" />
            <span className="tracking-wider uppercase">CURATED TOUR // {currentStageInfo.title}</span>
          </div>
          <p className="mt-2 text-xs text-[#2C2822] bg-[#F4F1EA]/90 p-3 rounded-xl border border-[#8B7E66]/30 shadow-md backdrop-blur-md italic font-sans leading-relaxed">
            "{currentStageInfo.lore}"
          </p>
        </div>
      )}

      {/* Futuristic HUD Interface */}
      {bootCompleted && !presentationMode && (
        <HUD
          currentStage={currentStageInfo}
          onSelectStage={handleStageSelect}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() => {
            const next = !settings.soundEnabled;
            setSettings((s) => ({ ...s, soundEnabled: next }));
            audioEngine.setMuted(!next);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProjectInfo={() => setIsProjectInfoOpen(true)}
          onOpen3DRotateView={() => {
            setSelectedRotateItemId(undefined);
            setIs3DRotateModalOpen(true);
          }}
          onTogglePresentation={handleTogglePresentation}
          isGuidedTour={isGuidedTour}
          onToggleGuidedTour={() => setIsGuidedTour((prev) => !prev)}
          discoveredCount={discoveredMemoryIds.size}
          totalMemories={MEMORY_ARTIFACTS.length}
          easterEggsCount={unlockedEggIds.size}
          interactionPrompt={interactionPrompt}
          onTriggerInteraction={handleKeyboardInteract}
          onOpenFinalQuestion={() => setIsQuestionOpen(true)}
        />
      )}

      {/* Presentation / Clean Screenshot Mode Overlay */}
      {presentationMode && (
        <PresentationModeOverlay
          activeShot={presentationShot}
          onSelectShot={(shot) => setPresentationShot(shot)}
          onExit={() => {
            setPresentationMode(false);
            setPresentationShot(null);
          }}
        />
      )}

      {/* Mobile Virtual Controls */}
      {bootCompleted && !presentationMode && (
        <MobileControlsOverlay
          onMovementChange={setMobileMovement}
          onInteract={handleKeyboardInteract}
        />
      )}

      {/* Interactive Modals */}
      {selectedMemory && (
        <MemoryReaderModal
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onOpen3DRotateModal={(id) => {
            setSelectedRotateItemId(id);
            setIs3DRotateModalOpen(true);
          }}
        />
      )}

      {/* Standalone Interactive 3D Rotate View Modal */}
      {is3DRotateModalOpen && (
        <Interactive3DRotateModal
          initialItemId={selectedRotateItemId}
          currentMonument={monument}
          onClose={() => {
            setIs3DRotateModalOpen(false);
            setSelectedRotateItemId(undefined);
          }}
        />
      )}

      {isChatOpen && (
        <NexusChatModal onClose={() => setIsChatOpen(false)} />
      )}

      {isQuestionOpen && (
        <FinalQuestionModal
          onClose={() => setIsQuestionOpen(false)}
          onMonumentCreated={handleMonumentCreated}
        />
      )}

      {isEndingOpen && (
        <EndingScreen
          monument={monument}
          onReplay={() => {
            setIsEndingOpen(false);
            setCurrentStageId('VAULT');
            audioEngine.playWarpTransition();
          }}
          onOpenQuestion={() => {
            setIsEndingOpen(false);
            setIsQuestionOpen(true);
          }}
          onOpenGallery={() => {
            setIsEndingOpen(false);
            setIsGalleryOpen(true);
          }}
          onOpen3DRotateView={(id) => {
            setSelectedRotateItemId(id);
            setIs3DRotateModalOpen(true);
          }}
        />
      )}

      {isGalleryOpen && (
        <MemorialGallery
          onClose={() => setIsGalleryOpen(false)}
          currentMonument={monument}
          onOpen3DRotateView={(id) => {
            setSelectedRotateItemId(id);
            setIs3DRotateModalOpen(true);
          }}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(newS) => setSettings((s) => ({ ...s, ...newS }))}
          onClose={() => setIsSettingsOpen(false)}
          onTriggerDemo={() => {
            setIsGuidedTour(true);
            setGuidedTourIndex(0);
            setCurrentStageId('VAULT');
          }}
        />
      )}

      {isProjectInfoOpen && (
        <ProjectInfoModal onClose={() => setIsProjectInfoOpen(false)} />
      )}

      {activeEasterEgg && (
        <EasterEggModal
          egg={activeEasterEgg}
          onClose={() => setActiveEasterEgg(null)}
        />
      )}
    </div>
  );
};
