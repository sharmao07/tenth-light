'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  GameSaveState,
  FLIGHT_LEGS,
  DialogueLine,
} from '@/lib/gameTypes';
import { loadSave, saveState, calculateShipMetrics, DEFAULT_SAVE_STATE } from '@/lib/gameStore';
import { getBriefingLines, STOP_DIALOGUES } from '@/lib/storyScripts';
import { NASA_IMAGE_PLATES } from '@/lib/nasaSnapshots';
import { sound } from '@/components/AudioController';
import { Ship3DView } from '@/components/Ship3DView';
import { PersistentHeader } from '@/components/PersistentHeader';
import { PauseModal } from '@/components/PauseModal';
import { MissionLogbookModal } from '@/components/MissionLogbookModal';
import { PinnedTelemetryPill } from '@/components/PinnedTelemetryPill';
import { DialogueBar } from '@/components/DialogueBar';
import { HangarView } from '@/components/HangarView';
import { DodgeRing } from '@/components/DodgeRing';
import { FormationShooter } from '@/components/FormationShooter';
import { SleeveMaze } from '@/components/SleeveMaze';
import { MoonHorizons } from '@/components/puzzles/MoonHorizons';
import { MarsSouvenir } from '@/components/puzzles/MarsSouvenir';
import { CeresSelection } from '@/components/puzzles/CeresSelection';
import { EnceladusPlume } from '@/components/puzzles/EnceladusPlume';
import { UranusBreakers } from '@/components/puzzles/UranusBreakers';
import { NeptuneLag } from '@/components/puzzles/NeptuneLag';
import { PlutoHeart } from '@/components/puzzles/PlutoHeart';
import { HeliopauseOrder } from '@/components/puzzles/HeliopauseOrder';
import { EndingView } from '@/components/EndingView';
import { GateClearanceModal } from '@/components/GateClearanceModal';

const STOP_DOSSIER_INFO: Record<number, { sector: string; distance: string; historicalMission: string }> = {
  0: { sector: 'Inner Terrestrial', distance: '1.00 AU (Origin)', historicalMission: 'Apollo & Artemis' },
  1: { sector: 'Lunar Vicinity', distance: '384,400 km', historicalMission: 'Apollo 11 & Surveyor' },
  2: { sector: 'Martian Orbit', distance: '1.52 AU', historicalMission: 'Mars Global Surveyor & Perseverance' },
  3: { sector: 'Asteroid Belt', distance: '2.77 AU', historicalMission: 'Dawn Spacecraft' },
  4: { sector: 'Jovian System', distance: '5.20 AU', historicalMission: 'Pioneer 10 & Cassini' },
  5: { sector: 'Saturnian Cryosphere', distance: '9.58 AU', historicalMission: 'Cassini-Huygens' },
  6: { sector: 'Ice Giant Void', distance: '19.2 AU', historicalMission: 'Voyager 2 (1986)' },
  7: { sector: 'Outer Solar Fringe', distance: '30.1 AU', historicalMission: 'Voyager 2 (1989)' },
  8: { sector: 'Kuiper Belt', distance: '39.5 AU', historicalMission: 'New Horizons (2015)' },
  9: { sector: 'Heliopause Frontier', distance: '122 AU', historicalMission: 'Voyager 1 (2012)' },
  10: { sector: 'TOI-700 Planetary System', distance: '101.5 Light-Years (31.13 pc)', historicalMission: 'TESS Exoplanet Archive' },
};

export default function TenthLightGame() {
  const [gameState, setGameState] = useState<GameSaveState>(DEFAULT_SAVE_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLogbookOpen, setIsLogbookOpen] = useState(false);
  const [isGateClearanceOpen, setIsGateClearanceOpen] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [activeDialogueLines, setActiveDialogueLines] = useState<DialogueLine[]>([]);
  const [dialoguePhase, setDialoguePhase] = useState<'before' | 'success' | null>(null);

  // Transit dodge state
  const [currentDodgeIndex, setCurrentDodgeIndex] = useState(0);
  const [totalDodgesOnLeg, setTotalDodgesOnLeg] = useState(1);

  // Slow page transition state
  const [transitionState, setTransitionState] = useState<{
    visible: boolean;
    fadingOut: boolean;
    stopIdx: number;
    stopName: string;
    sector: string;
  }>({
    visible: false,
    fadingOut: false,
    stopIdx: 0,
    stopName: '',
    sector: '',
  });

  // Update game state
  const updateGameState = useCallback((updates: Partial<GameSaveState>) => {
    setGameState((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const handleToggleMute = useCallback(() => {
    setGameState((prev) => {
      const nextMuted = !prev.isMuted;
      sound.setMuted(nextMuted);
      return {
        ...prev,
        isMuted: nextMuted,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  // Load save on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = loadSave();
      setGameState(saved);
      sound.setMuted(saved.isMuted);
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (isLoaded) {
      saveState(gameState);
    }
  }, [gameState, isLoaded]);

  // Global PC game keyboard shortcuts (Escape: Pause, L: Logbook, M: Mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.key === 'Escape') {
        if (isLogbookOpen) {
          setIsLogbookOpen(false);
          sound.playUiClick();
        } else if (gameState.phase !== 'title') {
          setIsPaused((p) => !p);
          sound.playUiClick();
        }
      } else if (e.code === 'KeyL') {
        setIsLogbookOpen((prev) => !prev);
        sound.playUiClick();
      } else if (e.code === 'KeyM') {
        handleToggleMute();
      } else if (e.code === 'KeyH' && gameState.phase === 'gate' && !dialoguePhase) {
        setIsGateClearanceOpen((prev) => !prev);
        sound.playUiClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.phase, isLogbookOpen, handleToggleMute, dialoguePhase]);

  const stopNames: Record<number, string> = {
    0: 'Earth',
    1: 'Moon (Lumen)',
    2: 'Mars (Redline)',
    3: 'Ceres (Pebble)',
    4: 'Jupiter Depot (Bolt)',
    5: 'Enceladus (Spray)',
    6: 'Uranus (Tilt)',
    7: 'Neptune (Lag)',
    8: 'Pluto (Heart ♥)',
    9: 'Heliopause (Whisper)',
    10: 'Harbor (TOI-700 e)',
  };

  const triggerSceneFade = (callback: () => void, targetStop?: number) => {
    const nextStop = targetStop !== undefined ? targetStop : gameState.currentStop;
    const dossier = STOP_DOSSIER_INFO[nextStop] || STOP_DOSSIER_INFO[0];
    const name = stopNames[nextStop] || 'Deep Space';

    setTransitionState({
      visible: true,
      fadingOut: false,
      stopIdx: nextStop,
      stopName: name,
      sector: `${dossier.sector} · ${dossier.distance}`,
    });

    setTimeout(() => {
      callback();
      setTransitionState((prev) => ({ ...prev, fadingOut: true }));
      setTimeout(() => {
        setTransitionState((prev) => ({ ...prev, visible: false, fadingOut: false }));
      }, 500);
    }, 600);
  };

  // Checkpoint restore when lives drop to 0
  const handleSpendLife = () => {
    const nextLives = gameState.lives - 1;
    if (nextLives <= 0) {
      sound.playMiss();
      triggerSceneFade(() => {
        updateGameState({
          lives: 3,
          currentStop: gameState.checkpointStop,
          phase: gameState.checkpointStop === 0 ? 'hangar' : 'gate',
        });
        if (gameState.checkpointStop > 0) {
          const scripts = STOP_DIALOGUES[gameState.checkpointStop];
          if (scripts) {
            setActiveDialogueLines(scripts.before);
            setDialogueIndex(0);
            setDialoguePhase('before');
          }
        }
      }, gameState.checkpointStop);
    } else {
      updateGameState({ lives: nextLives });
    }
  };

  // Scrub flight to hangar
  const handleScrubToHangar = () => {
    sound.playMiss();
    triggerSceneFade(() => {
      updateGameState({
        currentStop: 0,
        checkpointStop: 0,
        phase: 'hangar',
        lives: 3,
        currentDeltaV: 7200,
        uranusBreakersPassed: false,
        collectedWater: false,
        collectedSoil: false,
      });
    }, 0);
  };

  // Title -> Briefing
  const handleStartBriefing = () => {
    sound.playUiClick();
    sound.startAmbientHum();
    const lines = getBriefingLines(gameState.callsign);
    setActiveDialogueLines(lines);
    setDialogueIndex(0);
    triggerSceneFade(() => {
      updateGameState({
        phase: 'briefing',
      });
    }, 0);
  };

  // Resume Corridor
  const handleResumeGame = () => {
    sound.playUiClick();
    sound.startAmbientHum();
    triggerSceneFade(() => {
      if (gameState.phase === 'title') {
        const resumePhase = gameState.currentStop === 0 ? 'hangar' : 'gate';
        updateGameState({ phase: resumePhase });
        if (resumePhase === 'gate') {
          const scripts = STOP_DIALOGUES[gameState.currentStop];
          if (scripts) {
            setActiveDialogueLines(scripts.before);
            setDialogueIndex(0);
            setDialoguePhase('before');
          }
        }
      }
    }, gameState.currentStop);
  };

  // Briefing finished -> Hangar
  const handleBriefingComplete = () => {
    sound.playUiClick();
    triggerSceneFade(() => {
      updateGameState({
        phase: 'hangar',
        checkpointStop: 0,
        currentStop: 0,
      });
    }, 0);
  };

  // Hangar -> Launch into transit toward Stop 1 Moon
  const handleLaunchFromHangar = () => {
    const metrics = calculateShipMetrics(gameState.shipDesign);
    if (!metrics.isLaunchLegal) return;

    triggerSceneFade(() => {
      const remainingDv = metrics.totalDeltaV - 900;
      updateGameState({
        phase: 'transit',
        currentStop: 1,
        checkpointStop: 0,
        currentDeltaV: remainingDv,
        lives: 3,
      });
      setCurrentDodgeIndex(0);
      setTotalDodgesOnLeg(FLIGHT_LEGS[0].dodges);
    }, 1);
  };

  // Successful dodge in transit
  const handleDodgeSuccess = () => {
    const nextDodge = currentDodgeIndex + 1;
    if (nextDodge < totalDodgesOnLeg) {
      setCurrentDodgeIndex(nextDodge);
    } else {
      triggerSceneFade(() => {
        const stopIdx = gameState.currentStop;
        updateGameState({
          phase: 'gate',
          checkpointStop: stopIdx,
        });
        const scripts = STOP_DIALOGUES[stopIdx];
        if (scripts) {
          setActiveDialogueLines(scripts.before);
          setDialogueIndex(0);
          setDialoguePhase('before');
        }
      }, gameState.currentStop);
    }
  };

  // Gate dialogue before puzzle completed -> Show clearance directive modal
  const handleGateBeforeComplete = () => {
    setDialoguePhase(null);
    setIsGateClearanceOpen(true);
  };

  // Puzzle success -> show keeper success dialogue
  const handlePuzzleSuccess = () => {
    const stopIdx = gameState.currentStop;
    const scripts = STOP_DIALOGUES[stopIdx];
    if (scripts && scripts.success) {
      setActiveDialogueLines(scripts.success);
      setDialogueIndex(0);
      setDialoguePhase('success');
    } else {
      handleGateSuccessComplete();
    }
  };

  // Gate success dialogue complete -> advance to next leg transit
  const handleGateSuccessComplete = () => {
    const currentStop = gameState.currentStop;

    if (currentStop === 10) {
      triggerSceneFade(() => {
        updateGameState({
          phase: 'ending',
        });
      }, 10);
      return;
    }

    const nextStop = currentStop + 1;
    const nextLeg = FLIGHT_LEGS.find((l) => l.fromStop === currentStop && l.toStop === nextStop);
    const legCost = nextLeg ? nextLeg.costDeltaV : 1000;
    const dodges = nextLeg ? nextLeg.dodges : 1;

    let newDeltaV = gameState.currentDeltaV;
    if (currentStop === 4) {
      const metrics = calculateShipMetrics(gameState.shipDesign);
      newDeltaV = metrics.totalDeltaV;
    }

    if (newDeltaV < legCost) {
      sound.playMiss();
      alert(`Delta-v depleted! Required ${legCost} m/s, but only ${newDeltaV} m/s remaining. Mission scrubbed to hangar.`);
      handleScrubToHangar();
      return;
    }

    newDeltaV -= legCost;

    triggerSceneFade(() => {
      updateGameState({
        currentStop: nextStop,
        phase: 'transit',
        currentDeltaV: newDeltaV,
      });
      setCurrentDodgeIndex(0);
      setTotalDodgesOnLeg(dodges);
    }, nextStop);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0c10] text-[#e9e6dc] flex items-center justify-center font-mono text-xs">
        Loading Tenth Light telemetry...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] text-[#e9e6dc] flex flex-col justify-between overflow-x-hidden selection:bg-[#f0562b] selection:text-[#0a0c10] relative">
      {/* Slow Page Transition Overlay with Stop Name */}
      {transitionState.visible && (
        <div
          className={`fixed inset-0 z-[100] bg-[#0a0c10] flex flex-col justify-center items-center px-8 text-center transition-opacity duration-500 select-none ${
            transitionState.fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="max-w-xl space-y-6 animate-fadeIn">
            <span className="font-mono text-xs uppercase tracking-widest text-[#f0562b] font-bold">
              TRANSIT PROTOCOL // ORBITAL INSERTION
            </span>
            <h2 className="font-serif font-extralight text-5xl md:text-7xl text-[#e9e6dc] tracking-tight">
              Stop {transitionState.stopIdx} <span className="font-extrabold text-[#e9e6dc] block md:inline">&middot; {transitionState.stopName.split(' ')[0]}</span>
            </h2>
            <div className="h-[1px] w-24 bg-[#f0562b] mx-auto" />
            <p className="font-mono text-xs text-[#e9e6dc]/60 uppercase tracking-widest">
              {transitionState.sector}
            </p>
          </div>
        </div>
      )}

      {/* Persistent Header on all screens except Title */}
      {gameState.phase !== 'title' && (
        <PersistentHeader
          lives={gameState.lives}
          currentStopName={stopNames[gameState.currentStop]}
          currentStopIndex={gameState.currentStop}
          onPause={() => setIsPaused(true)}
          onMenu={() => {
            sound.playUiClick();
            triggerSceneFade(() => updateGameState({ phase: 'title' }), 0);
          }}
          onOpenLogbook={() => setIsLogbookOpen(true)}
          onOpenClearance={() => setIsGateClearanceOpen(true)}
          showClearanceButton={gameState.phase === 'gate' && !dialoguePhase}
          isMuted={gameState.isMuted}
          onToggleMute={handleToggleMute}
          showSentence={true}
        />
      )}

      {/* Modals */}
      <PauseModal
        isOpen={isPaused}
        onResume={() => setIsPaused(false)}
        onReturnToMenu={() => {
          setIsPaused(false);
          triggerSceneFade(() => updateGameState({ phase: 'title' }), 0);
        }}
      />

      <MissionLogbookModal
        isOpen={isLogbookOpen}
        onClose={() => setIsLogbookOpen(false)}
        maxUnlockedStop={Math.max(gameState.currentStop, gameState.checkpointStop)}
        callsign={gameState.callsign}
      />

      <GateClearanceModal
        isOpen={isGateClearanceOpen}
        stopIndex={gameState.currentStop}
        onClose={() => setIsGateClearanceOpen(false)}
      />

      {/* Pinned Telemetry Pill during flight */}
      {(gameState.phase === 'transit' || gameState.phase === 'gate') && (
        <PinnedTelemetryPill
          currentStopIndex={gameState.currentStop}
          currentDeltaV={gameState.currentDeltaV}
          lives={gameState.lives}
          onOpenLogbook={() => setIsLogbookOpen(true)}
          isMuted={gameState.isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Main Screen Views */}
      <main className="flex-1 w-full relative flex flex-col justify-center min-h-0">
        {/* ================= 1. TITLE SCREEN ================= */}
        {gameState.phase === 'title' && (
          <div className="w-full max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24 select-none grid gap-16 lg:gap-24 lg:grid-cols-[1.5fr_1fr] items-end animate-fadeIn">
            <div className="space-y-12">
              <p className="label">NASA Space Apps 2026 &middot; Space Mission Design Game</p>
              <h1 className="display-xl">
                <span className="block font-extralight">Tenth</span>
                <span className="block font-extrabold -mt-[0.08em]">Light</span>
              </h1>
              <p className="font-serif italic text-2xl md:text-3xl text-[#e9e6dc]/80 max-w-xl leading-snug">
                Design the ship. Stay in the seat. Send the droid.
              </p>
              <blockquote className="max-w-xl border-l border-[#f0562b] pl-6 text-[15px] leading-[1.8] text-[#e9e6dc]/65">
                “Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive.
                The voyage past the heliopause is a mission simulation that uses the archive’s numbers.
                The aliens, the depot fight, and the droid are the story.”
              </blockquote>
            </div>

            <div className="space-y-12 pb-2">
              <div className="space-y-3">
                <label htmlFor="callsign" className="label">Specialist callsign</label>
                <input
                  id="callsign"
                  type="text"
                  maxLength={16}
                  value={gameState.callsign}
                  onChange={(e) => updateGameState({ callsign: e.target.value.trim() || 'Wren' })}
                  className="field"
                  placeholder="Wren"
                />
                <p className="text-sm text-[#e9e6dc]/50 leading-relaxed">
                  The specialist never leaves the ship and appears only in dialogue.
                </p>
              </div>

              <div className="space-y-8">
                <button
                  onClick={handleStartBriefing}
                  onMouseEnter={() => sound.playHoverBlip()}
                  className="btn"
                >
                  Begin mission
                  <span aria-hidden>&rarr;</span>
                </button>

                <ul className="index-list">
                  {gameState.currentStop > 0 && (
                    <li>
                      <button onClick={handleResumeGame} onMouseEnter={() => sound.playHoverBlip()}>
                        <span>Resume corridor</span><em>Stop {gameState.currentStop}</em>
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        sound.playUiClick();
                        setIsLogbookOpen(true);
                      }}
                      onMouseEnter={() => sound.playHoverBlip()}
                    >
                      <span>Mission logbook</span><em>11 acts</em>
                    </button>
                  </li>
                  <li>
                    <Link href="/presentation" onMouseEnter={() => sound.playHoverBlip()}>
                      <span>Demo deck</span><em>7 slides</em>
                    </Link>
                  </li>
                  <li>
                    <Link href="/data" onMouseEnter={() => sound.playHoverBlip()}>
                      <span>Scientific data</span><em>NASA sources</em>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. BRIEFING SCREEN ================= */}
        {gameState.phase === 'briefing' && (
          <div className="w-full max-w-7xl mx-auto px-8 md:px-16 py-8 md:py-12 select-none animate-fadeIn flex flex-col justify-between min-h-[calc(100vh-160px)]">
            <div>
              {/* Dossier Header */}
              <div className="flex items-baseline justify-between border-b border-[#e9e6dc]/15 pb-4 mb-8">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#f0562b] font-bold">
                    DOSSIER // EXPEDITION ORDER 00
                  </span>
                  <span className="text-[#e9e6dc]/40 text-xs font-mono">/</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#e9e6dc]/70">
                    DEPARTURE CLEARANCE PROTOCOL
                  </span>
                </div>
                <div className="font-mono text-xs text-[#e9e6dc]/40">
                  REF: NASA-EXOPLANET-ARCHIVE-2026
                </div>
              </div>

              {/* Monumental Headline */}
              <div className="mb-8">
                <p className="label">Mission Directive &middot; Ground Station Uplink</p>
                <h1 className="font-serif font-extralight text-5xl sm:text-6xl md:text-7xl tracking-tight text-[#e9e6dc] mt-2">
                  Flight Directive: <span className="font-extrabold text-[#e9e6dc]">TOI-700 e</span>
                </h1>
                <p className="font-serif italic text-lg text-[#e9e6dc]/70 mt-2 max-w-xl">
                  Specialist {gameState.callsign} &middot; Sealed cabin flight &middot; Astromech Droid Nori deployed for surface sampling
                </p>
              </div>

              {/* Ruled Asymmetrical Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
                {/* Left Column: Large Uncropped NASA Photo of Earth + Exoplanet Archive Stats */}
                <div className="lg:col-span-6 space-y-6">
                  <figure className="w-full border border-[#e9e6dc]/15 bg-[#0a0c10] p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={NASA_IMAGE_PLATES[10].url}
                      alt={NASA_IMAGE_PLATES[10].caption}
                      className="w-full max-h-[360px] object-contain bg-[#0a0c10]"
                    />
                    <figcaption className="mt-3 font-mono text-xs text-[#e9e6dc]/70 leading-relaxed border-t border-[#e9e6dc]/10 pt-2">
                      <span className="text-[#f0562b] font-bold">PLATE 00 &middot;</span> {NASA_IMAGE_PLATES[10].caption}
                      <span className="block mt-0.5 text-[#e9e6dc]/40 font-mono text-[11px]">
                        Credit: {NASA_IMAGE_PLATES[10].credit}
                      </span>
                    </figcaption>
                  </figure>

                  {/* Exoplanet Archive Dossier Ledger */}
                  <div className="border border-[#e9e6dc]/15 p-5 bg-[#0a0c10] font-mono text-xs space-y-3">
                    <div className="text-[#f0562b] font-bold uppercase tracking-wider border-b border-[#e9e6dc]/10 pb-2">
                      NASA Exoplanet Archive Composite Parameters
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#e9e6dc]/10">
                      <span className="text-[#e9e6dc] font-bold">✓ Target: TOI-700 e (Harbor)</span>
                      <span className="text-[#f0562b]">Optimistic Habitable Zone</span>
                    </div>
                    <div className="text-[#e9e6dc]/70 pl-2 space-y-0.5 text-[11px]">
                      <div>Radius: 0.919 R⊕ &middot; Mass: 0.718 M⊕ &middot; Orbital Period: 27.81 days</div>
                      <div>Insolation: 1.27 &middot; Equilibrium Temp: 272.9 K &middot; Distance: 101.5 ly (31.13 pc)</div>
                      <div className="text-[#e9e6dc]/50 italic">Discovered 2023 by transit photometry.</div>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#e9e6dc]/10 pt-2">
                      <span className="text-[#e9e6dc]/50 font-bold">✕ Twin You Do Not Fly: TOI-700 d</span>
                      <span className="text-[#e9e6dc]/40">Outer Conservative Zone</span>
                    </div>
                    <div className="text-[#e9e6dc]/50 pl-2 text-[11px]">
                      1.145 R⊕ &middot; 1.580 M⊕ &middot; 37.42 days &middot; 268.8 K &middot; Discovered 2020.
                    </div>
                  </div>
                </div>

                {/* Right Column: 3D Vessel View + Pre-Flight Directives */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="border border-[#e9e6dc]/15 h-[360px] relative bg-[#0a0c10]">
                    <div className="absolute top-3 left-3 z-10 label text-[11px]">
                      Integration Gantry &middot; Tenth Light Cabin
                    </div>
                    <Ship3DView design={gameState.shipDesign} interactive={true} />
                  </div>

                  <div className="border border-[#e9e6dc]/15 p-5 bg-[#0a0c10] space-y-4">
                    <h2 className="label text-[#f0562b]">Specialist Flight Orders</h2>
                    <p className="font-serif text-sm text-[#e9e6dc]/80 leading-relaxed">
                      “Scientists demand empirical soil and water samples from Harbor. The hatch never opens
                      for human footsteps. At TOI-700 e, Droid Nori walks the sample sleeve across the cryogenic
                      regolith. Earth’s reception when you coast home depends entirely on what your sensors certify.”
                    </p>
                    <button
                      onClick={handleBriefingComplete}
                      onMouseEnter={() => sound.playHoverBlip()}
                      className="btn w-full text-center"
                    >
                      Enter VAB Assembly Bay (Stage 0) &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Fixed Dialogue Bar */}
            <DialogueBar
              lines={activeDialogueLines}
              currentIndex={dialogueIndex}
              onAdvance={() => setDialogueIndex((i) => i + 1)}
              onPrevious={() => setDialogueIndex((i) => Math.max(0, i - 1))}
              onComplete={handleBriefingComplete}
            />
          </div>
        )}

        {/* ================= 3. HANGAR SCREEN ================= */}
        {gameState.phase === 'hangar' && (
          <HangarView
            design={gameState.shipDesign}
            onUpdateDesign={(d) => updateGameState({ shipDesign: d })}
            onLaunch={handleLaunchFromHangar}
          />
        )}

        {/* ================= 4. TRANSIT SCREEN ================= */}
        {gameState.phase === 'transit' && (
          <div className="w-full max-w-7xl mx-auto px-8 md:px-16 py-8 md:py-12 select-none animate-fadeIn flex flex-col justify-between min-h-[calc(100vh-160px)]">
            {/* Top Dossier Ledger Bar */}
            <div className="flex items-baseline justify-between border-b border-[#e9e6dc]/15 pb-4 mb-8">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#f0562b] font-bold">
                  DOSSIER // TRANSIT LEG 0{gameState.currentStop}
                </span>
                <span className="text-[#e9e6dc]/40 text-xs font-mono">/</span>
                <span className="font-mono text-xs uppercase tracking-wider text-[#e9e6dc]/70">
                  INTERPLANETARY CORRIDOR &middot; {stopNames[gameState.currentStop]}
                </span>
              </div>
              <div className="font-mono text-xs text-[#e9e6dc]/70">
                REMAINING DELTA-V: <span className="text-[#f0562b] font-bold">{gameState.currentDeltaV} m/s</span>
              </div>
            </div>

            {/* Monumental Headline */}
            <div className="mb-6">
              <p className="label">Interplanetary Burn &middot; Hazard Avoidance</p>
              <h1 className="font-serif font-extralight text-4xl sm:text-5xl md:text-6xl tracking-tight text-[#e9e6dc] mt-1">
                Cruising to <span className="font-extrabold text-[#e9e6dc]">{stopNames[gameState.currentStop].split(' ')[0]}</span>
              </h1>
            </div>

            {/* Ruled 2-Column Transit Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
              {/* Left Column: Approaching Target Real NASA Image Plate */}
              <div className="lg:col-span-5 space-y-4">
                {NASA_IMAGE_PLATES[gameState.currentStop] && (
                  <figure className="w-full border border-[#e9e6dc]/15 bg-[#0a0c10] p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={NASA_IMAGE_PLATES[gameState.currentStop].url}
                      alt={NASA_IMAGE_PLATES[gameState.currentStop].caption}
                      className="w-full max-h-[380px] object-contain bg-[#0a0c10]"
                    />
                    <figcaption className="mt-3 font-mono text-xs text-[#e9e6dc]/70 leading-relaxed border-t border-[#e9e6dc]/10 pt-2">
                      <span className="text-[#f0562b] font-bold">APPROACH TARGET &middot;</span> {NASA_IMAGE_PLATES[gameState.currentStop].caption}
                      <span className="block mt-0.5 text-[#e9e6dc]/40 font-mono text-[11px]">
                        Credit: {NASA_IMAGE_PLATES[gameState.currentStop].credit}
                      </span>
                    </figcaption>
                  </figure>
                )}
              </div>

              {/* Right Column: 3D Cruising View & Dodge Ring */}
              <div className="lg:col-span-7 space-y-4">
                <div className="border border-[#e9e6dc]/15 h-[420px] relative bg-[#0a0c10]">
                  <Ship3DView design={gameState.shipDesign} cruiseMode={true} interactive={true} />
                  <DodgeRing
                    isPaused={isPaused}
                    dodgeIndex={currentDodgeIndex}
                    totalDodges={totalDodgesOnLeg}
                    onSuccess={handleDodgeSuccess}
                    onMiss={handleSpendLife}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. STOP GATE SCREENS ================= */}
        {gameState.phase === 'gate' && (
          <div className="w-full max-w-7xl mx-auto px-8 md:px-16 py-8 md:py-12 select-none animate-fadeIn flex flex-col justify-between min-h-[calc(100vh-160px)]">
            <div>
              {/* Top Dossier Ledger Bar */}
              <div className="flex flex-wrap items-baseline justify-between border-b border-[#e9e6dc]/15 pb-4 mb-8 gap-4">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#f0562b] font-bold">
                    DOSSIER // STOP 0{gameState.currentStop}
                  </span>
                  <span className="text-[#e9e6dc]/40 text-xs font-mono">/</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#e9e6dc]/70">
                    {STOP_DOSSIER_INFO[gameState.currentStop]?.sector || 'Planetary Waypoint'} &middot; {STOP_DOSSIER_INFO[gameState.currentStop]?.distance}
                  </span>
                </div>
                <div className="font-mono text-xs text-[#e9e6dc]/40">
                  HERITAGE: {STOP_DOSSIER_INFO[gameState.currentStop]?.historicalMission}
                </div>
              </div>

              {/* Monumental Type-Led Headline */}
              <div className="mb-8 border-b border-[#e9e6dc]/15 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="label">Planetary Gate Challenge &middot; Clearance Required</p>
                  <h1 className="font-serif font-extralight text-4xl sm:text-5xl md:text-7xl tracking-tight text-[#e9e6dc] mt-1">
                    {stopNames[gameState.currentStop].split(' ')[0]} <span className="font-extrabold text-[#e9e6dc]">Station</span>
                  </h1>
                </div>

                <div className="font-mono text-xs text-[#e9e6dc]/60">
                  Hull: <span className="text-[#f0562b] font-bold">{gameState.lives}/3</span> &middot; Delta-V: <span className="text-[#e9e6dc] font-bold">{gameState.currentDeltaV} m/s</span>
                </div>
              </div>

              {/* Ruled 2-Column Dossier Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
                {/* Left Column: Large Uncropped Real NASA Image */}
                <div className="lg:col-span-5 space-y-4">
                  {NASA_IMAGE_PLATES[gameState.currentStop] && (
                    <figure className="w-full border border-[#e9e6dc]/15 bg-[#0a0c10] p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={NASA_IMAGE_PLATES[gameState.currentStop].url}
                        alt={NASA_IMAGE_PLATES[gameState.currentStop].caption}
                        className="w-full max-h-[460px] object-contain bg-[#0a0c10]"
                      />
                      <figcaption className="mt-3 font-mono text-xs text-[#e9e6dc]/70 leading-relaxed border-t border-[#e9e6dc]/10 pt-2">
                        <span className="text-[#f0562b] font-bold">PLATE 0{gameState.currentStop} &middot;</span> {NASA_IMAGE_PLATES[gameState.currentStop].caption}
                        <span className="block mt-0.5 text-[#e9e6dc]/40 font-mono text-[11px]">
                          Credit: {NASA_IMAGE_PLATES[gameState.currentStop].credit}
                        </span>
                      </figcaption>
                    </figure>
                  )}
                </div>

                {/* Right Column: Interactive Puzzle Console */}
                <div className="lg:col-span-7">
                  {!dialoguePhase ? (
                    <div className="w-full border border-[#e9e6dc]/15 p-6 bg-[#0a0c10]">
                      {gameState.currentStop === 1 && <MoonHorizons onSuccess={handlePuzzleSuccess} />}
                      {gameState.currentStop === 2 && <MarsSouvenir onSuccess={handlePuzzleSuccess} />}
                      {gameState.currentStop === 3 && <CeresSelection onSuccess={handlePuzzleSuccess} />}
                      {gameState.currentStop === 4 && (
                        <FormationShooter
                          isPaused={isPaused}
                          onVictory={handlePuzzleSuccess}
                          onHit={handleSpendLife}
                        />
                      )}
                      {gameState.currentStop === 5 && <EnceladusPlume onSuccess={handlePuzzleSuccess} />}
                      {gameState.currentStop === 6 && (
                        <UranusBreakers
                          design={gameState.shipDesign}
                          onSuccess={() => {
                            updateGameState({ uranusBreakersPassed: true });
                            handlePuzzleSuccess();
                          }}
                          onScrubToHangar={handleScrubToHangar}
                        />
                      )}
                      {gameState.currentStop === 7 && (
                        <NeptuneLag isPaused={isPaused} onSuccess={handlePuzzleSuccess} />
                      )}
                      {gameState.currentStop === 8 && <PlutoHeart onSuccess={handlePuzzleSuccess} />}
                      {gameState.currentStop === 9 && <HeliopauseOrder onSuccess={handlePuzzleSuccess} />}
                      {gameState.currentStop === 10 && (
                        <SleeveMaze
                          isPaused={isPaused}
                          lives={gameState.lives}
                          onVictory={(w, s) => {
                            updateGameState({ collectedWater: w, collectedSoil: s });
                            handlePuzzleSuccess();
                          }}
                          onHit={handleSpendLife}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-full border border-[#e9e6dc]/15 p-6 bg-[#0a0c10] space-y-4">
                      <span className="label text-[#f0562b]">Incoming Gate Transmission</span>
                      <p className="font-serif italic text-base text-[#e9e6dc]/90 leading-relaxed">
                        Communications feed established with the planetary gate entity. Review mission dialogue below.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Fixed Dialogue Bar */}
            {dialoguePhase && (
              <DialogueBar
                lines={activeDialogueLines}
                currentIndex={dialogueIndex}
                onAdvance={() => setDialogueIndex((i) => i + 1)}
                onPrevious={() => setDialogueIndex((i) => Math.max(0, i - 1))}
                onComplete={() => {
                  if (dialoguePhase === 'before') {
                    handleGateBeforeComplete();
                  } else {
                    handleGateSuccessComplete();
                  }
                }}
              />
            )}
          </div>
        )}

        {/* ================= 6. ENDING SCREEN ================= */}
        {gameState.phase === 'ending' && (
          <EndingView
            design={gameState.shipDesign}
            collectedWater={gameState.collectedWater}
            collectedSoil={gameState.collectedSoil}
            uranusPassed={gameState.uranusBreakersPassed}
            callsign={gameState.callsign}
            onRestart={() => {
              triggerSceneFade(() => {
                updateGameState({
                  currentStop: 0,
                  checkpointStop: 0,
                  phase: 'hangar',
                  lives: 3,
                  currentDeltaV: 7200,
                  uranusBreakersPassed: false,
                  collectedWater: false,
                  collectedSoil: false,
                });
              }, 0);
            }}
          />
        )}
      </main>
    </div>
  );
}
