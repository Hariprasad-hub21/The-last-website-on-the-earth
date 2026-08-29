import { MemoryArtifact } from '../types';

export const MEMORY_ARTIFACTS: MemoryArtifact[] = [
  {
    id: 'mem-001',
    code: 'MEMORY_001',
    title: 'THE FIRST TRANSMISSION',
    date: '1969.10.29 // 22:30 UTC',
    category: 'CODE',
    position: [-16, 2.5, -3],
    glyph: '01',
    color: '#38bdf8',
    audioToneFreq: 440,
    quote: '"LO" — The system crashed before the word "LOGIN" could be completed.',
    description: 'The first packet sent between two computers in Menlo Park and Los Angeles.',
    fullStory: 'In the twilight of the twentieth century, two distant terminals attempted to exchange a single command: LOGIN. After transmitting "L" and "O", the network collapsed under the weight of the future. Those two letters became the seed of a global consciousness that spanned three centuries.'
  },
  {
    id: 'mem-014',
    code: 'MEMORY_014',
    title: 'THE SUNSET STREAM',
    date: '2084.06.21 // 19:44 UTC',
    category: 'MEDIA',
    position: [-13, 3.2, -6],
    glyph: '14',
    color: '#f59e0b',
    audioToneFreq: 523.25,
    quote: '"Over 14 million people watched this coastline together without speaking a word."',
    description: 'A 24-hour synchronized video stream of the Pacific coast during an eclipse.',
    fullStory: 'During the global cooling anomaly of 2084, millions of people stranded in sub-surface habitats connected to a live solar camera on the Oregon cliffs. The chat log contained 400 million heart emojis in total silence as the last amber rays dipped beneath the Pacific.'
  },
  {
    id: 'mem-027',
    code: 'MEMORY_027',
    title: 'THE CHILD’S DRAWING',
    date: '2042.11.05',
    category: 'CULTURE',
    position: [-19, 2.2, -7],
    glyph: '27',
    color: '#10b981',
    audioToneFreq: 587.33,
    quote: '"My dog Toby running through grass that is not on a screen."',
    description: 'A digital crayon sketch uploaded from a classroom in New Kyoto.',
    fullStory: 'Drawn by 7-year-old Maya Lin during the first year of the great climate dome migrations. The sketch depicts a golden retriever leaping through wild clover under an open sky without protective solar filters. The metadata shows it was stored across 12,000 personal cloud lockers.'
  },
  {
    id: 'mem-042',
    code: 'MEMORY_042',
    title: 'THE SOLITARY SATELLITE',
    date: '2119.03.14',
    category: 'SCIENCE',
    position: [-15, 4.0, -11],
    glyph: '42',
    color: '#a855f7',
    audioToneFreq: 659.25,
    quote: '"Telemetry nominal. No other signals detected on standard VHF bands. Continuing orbit."',
    description: 'The final diagnostic log of orbital environmental satellite EOS-9.',
    fullStory: 'For thirty-one years after the surface transmission relays went dark, EOS-9 continued measuring Earth’s atmospheric nitrogen and cloud albedo, sending automated pings into the vacuum. NEXUS intercepted its last dying radio beacon before its orbit decayed.'
  },
  {
    id: 'mem-089',
    code: 'MEMORY_089',
    title: 'THE LOST SYMPHONY',
    date: '2099.12.31',
    category: 'MEDIA',
    position: [-18, 3.0, -14],
    glyph: '89',
    color: '#ec4899',
    audioToneFreq: 698.46,
    quote: '"Composed by 100,000 strangers across 90 countries on the eve of the 22nd century."',
    description: 'An open-source acoustic choral track synthesized from crowd-submitted voice notes.',
    fullStory: 'On New Year’s Eve 2099, musicians, poets, and ordinary people around the globe recorded one second of harmonic hum into a collaborative repository. When compiled, it formed an 8-minute polyphonic hymn to human continuity.'
  },
  {
    id: 'mem-108',
    code: 'MEMORY_108',
    title: 'THE FINAL COMMIT',
    date: '2147.05.12 // 04:18 UTC',
    category: 'CODE',
    position: [-12, 2.8, -15],
    glyph: '108',
    color: '#06b6d4',
    audioToneFreq: 783.99,
    quote: '"git commit -m \'preserve everything. someone will come back for it.\'"',
    description: 'The last manual line of code committed to the Earth preservation daemon.',
    fullStory: 'Authored by Lead Archivist Dr. Aris Thorne before the facility automated all containment locks. The commit message was accompanied by an automated instruction to keep geothermal pump #4 spinning indefinitely.'
  }
];

export const DREAM_RELICS = [
  {
    id: 'dream-lotus',
    title: 'THE VIRTUAL LOTUS',
    position: [20, 5, -24] as [number, number, number],
    meaning: 'A geometric flower blooming indefinitely in mathematical space, unaffected by time.',
    color: '#ec4899',
  },
  {
    id: 'dream-starmap',
    title: 'THE LOST STAR CHART',
    position: [26, 7, -32] as [number, number, number],
    meaning: 'Calculations for deep space probes launched toward Trappist-1, carrying humanity’s digital poetry.',
    color: '#38bdf8',
  },
  {
    id: 'dream-handwritten',
    title: 'THE UNSENT LETTER',
    position: [15, 4, -36] as [number, number, number],
    meaning: 'Drafted in 2038 on an old tablet: "I will meet you at the harbor once the storm passes."',
    color: '#f59e0b',
  },
  {
    id: 'dream-monolith',
    title: 'PYRAMID OF TRANSCENDENCE',
    position: [22, 10, -42] as [number, number, number],
    meaning: 'An inverted tetrahedron pulsing with the encrypted thoughts of an entire civilization.',
    color: '#a855f7',
  }
];
