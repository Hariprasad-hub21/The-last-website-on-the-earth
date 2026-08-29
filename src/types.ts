export type StageId = 
  | 'BOOT'
  | 'VAULT'       // Underground facility
  | 'ARCHIVE'     // Data capsule library
  | 'CITY'        // Lost City overlook
  | 'DREAMS'      // Surreal old-web dreamscape
  | 'SIGNAL'      // The mysterious transmission
  | 'CORE'        // NEXUS AI Core
  | 'QUESTION'    // The Final Question
  | 'MONUMENT'    // The Created Monument
  | 'ENDING';     // The Fadeout & Legacy

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export interface StageInfo {
  id: StageId;
  title: string;
  subtitle: string;
  year: string;
  lore: string;
  cameraPose: CameraPose;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  ambientColor: string;
  accentColor: string;
}

export interface MemoryArtifact {
  id: string;
  code: string;
  title: string;
  date: string;
  category: 'MESSAGE' | 'MEDIA' | 'SCIENCE' | 'CULTURE' | 'EMOTION' | 'CODE';
  position: [number, number, number];
  description: string;
  fullStory: string;
  glyph: string;
  color: string;
  audioToneFreq: number;
  quote: string;
}

export interface EasterEgg {
  id: string;
  title: string;
  location: string;
  position: [number, number, number];
  hint: string;
  discoveryText: string;
  unlocked: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'nexus';
  text: string;
  timestamp: string;
}

export interface MonumentData {
  word: string;
  meaning?: string;
  author?: string;
  timestamp: string;
  title: string;
  inscription: string;
  nexusBenediction: string;
}

export type QualitySetting = 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA';

export interface AppSettings {
  soundEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  quality: QualitySetting;
  reducedMotion: boolean;
  bloomEnabled: boolean;
  cinematicLetterbox: boolean;
  guidedTourSpeed: number;
}
