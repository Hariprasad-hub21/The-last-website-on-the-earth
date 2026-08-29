# THE LAST WEBSITE ON EARTH 🌐✨
### *An Interactive 3D Cyber-Archaeological Experience for the 3D Websites Hackathon*

> **"The internet disappeared. One website survived."**  
> **Year:** 2147  
> **Status:** Node 01 Online  

---

## 🌟 Executive Summary

**The Last Website on Earth** is an explorable 3D interactive story set in the year 2147 after humanity's physical internet has ceased to exist. Deep beneath kilometers of vitrified stone in an abandoned geothermal facility, one final server sanctum continues to run.

Visitors explore this digital fossil across **8 continuous narrative stages**: discovering humanity's last preserved relics in the Data Archive, gazing at the dead megacity of Neo-Elysium, traversing the surreal Dream Archive of cached human subconsciousness, conversing with the ancient AI sentinel **NEXUS** (powered by Gemini 3.7 Flash), and carving an eternal 3D holographic monument answering:  
***"What should humanity be remembered for?"***

---

## 🚀 Key Features & Hackathon Highlights

1. **Continuous Explorable 3D Cyber-World**
   - Built with **Three.js & React Three Fiber**, featuring sub-terrestrial server vaults, interactive holographic data capsules, a colossal dystopian skyline with flying surveillance drones, non-Euclidean dream architecture, and the monumental gyroscopic AI core.
2. **NEXUS AI Intelligence (Gemini 3.7 Flash)**
   - Speak in real time with the last surviving AI archivist. Philosophical, ancient, and poetic conversational engine with zero-dependency offline fallback.
3. **Procedural Web Audio Synthesizer**
   - Pure **Web Audio API** generative sound engine: LFO-modulated lowpass sub-drones, crystalline harmonic bells for data capsules, terminal glitch blips, and majestic C-Major 9th monument chords. Zero external audio downloads required.
4. **Interactive 3D Monument Creation**
   - When visitors answer the final question, their legacy word physically crystallizes into a towering golden light spire and rotating celestial rings in 3D space, saving to the permanent Memorial Archive.
5. **Judge-Optimized 1-Click Guided Demo Tour**
   - Press **[GUIDED TOUR]** for an automated cinematic flythrough across all 6 locations with synced story narration captions.
6. **Presentation / Screenshot Mode (`Shift + P`)**
   - Clean photo-mode interface hiding HUD clutter with 5 cinematic preset camera angles.
7. **5 Hidden Easter Eggs**
   - Discover the Sealed 404 Emergency Hatch, Voyager Golden Record frequency, Architect Aris's laptop, Constellation Solitude, and NEXUS's debug shadow matrix.
8. **Universal Responsive & Accessible**
   - Full desktop WASD + mouse orbit navigation, dual virtual touch joystick for mobile/tablet, customizable render quality presets (Low / Medium / High / Ultra), and reduced motion toggles.

---

## 🎮 Controls

### Desktop Controls
| Key | Action |
| :--- | :--- |
| **`W` / `A` / `S` / `D`** | Move Forward / Left / Backward / Right |
| **`Shift`** | Sprint / Fast Travel |
| **`E`** | Interact with Capsules, Signals & AI Core |
| **`Shift + P`** | Toggle Presentation / Screenshot Photo Mode |
| **`Esc`** | Close Open Modals / Exit Photo Mode |

### Mobile / Tablet
- **Virtual D-Pad**: Move around the active stage.
- **Action Button**: Tap to inspect memory capsules or converse with NEXUS.
- **Top Bar Tabs**: Instant warp between Vault, Archive, City, Dreams, Signal, and Core.

---

## 🛠️ Technology Stack

- **Frontend Runtime:** React 19, TypeScript, Vite
- **3D Engine:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Audio Engine:** Web Audio API Procedural Synth Engine
- **AI Backend:** Google GenAI SDK (`gemini-3.7-flash`) via Express server-side proxy
- **Styling & Motion:** Tailwind CSS v4, Motion (`motion/react`), Lucide React
- **Effects:** Canvas Confetti, custom radial vignettes & scanlines

---

## 📦 Installation & Local Development

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional for AI features)
Copy `.env.example` to `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, the website automatically utilizes NEXUS's built-in offline poetic intelligence).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🏆 Hackathon Submission Narrative

*"Perhaps the internet was never about infinite information.*  
*It was about memory."*
