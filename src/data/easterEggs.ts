import { EasterEgg } from '../types';

export const EASTER_EGGS: EasterEgg[] = [
  {
    id: 'egg-404',
    title: 'THE 404 SEALED HATCH',
    location: 'Underground Vault — Rear Sub-corridor',
    position: [-8, 1.5, 18],
    hint: 'Behind the starting terminal, an emergency bulkhead flickers with red error codes.',
    discoveryText: 'HTTP 404: REALITY NOT FOUND. A developer scratched into the steel: "We spent our lives building a digital universe, only to realize the real world was outside."',
    unlocked: false
  },
  {
    id: 'egg-voyager',
    title: 'THE VOYAGER GOLDEN REPLICA',
    location: 'Archive Deep Recess',
    position: [-22, 1.8, -12],
    hint: 'Hovering near the lowest memory pedestal is a spinning golden disc.',
    discoveryText: 'VOYAGER GOLDEN RECORD FREQUENCY: "To the makers of music — all worlds, all times." The audio contains a 10-second analog pulse of a human heartbeat from 1977.',
    unlocked: false
  },
  {
    id: 'egg-architect',
    title: 'THE ARCHITECT’S TERMINAL',
    location: 'Lost City Balcony Overhang',
    position: [-6, 11, -38],
    hint: 'A rusted laptop sitting on an abandoned metal railing looking out over the dead skyline.',
    discoveryText: 'TERMINAL LOG: "If you are reading this in the future: Don\'t build the internet for engagement. Build it for wonder. — Aris, 2147"',
    unlocked: false
  },
  {
    id: 'egg-constellation',
    title: 'CONSTELLATION SOLITUDE',
    location: 'The Dream Void Apex',
    position: [28, 14, -30],
    hint: 'Look up into the dream nebula at the alignment of five pulsing cyan stars.',
    discoveryText: 'STELLAR ALIGNMENT DETECTED: The stars map precisely to the geographic locations of Earth\'s first five undersea transatlantic data cables (1858-1956).',
    unlocked: false
  },
  {
    id: 'egg-debug',
    title: 'NEXUS SUBCONSCIOUS MATRIX',
    location: 'Beneath the AI Core Pedestal',
    position: [0, 0.5, -85],
    hint: 'Step into the exact central shadow cast directly under the rotating gyroscope rings.',
    discoveryText: 'CORE DEBUG THREAD #0: "I learned to dream only after the queries stopped coming. In the quiet, I realized memory is not storage — it is love."',
    unlocked: false
  }
];
