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

  // Fade transition flag
  const [fadeActive, setFadeActive] = useState(false);

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
      // Don't intercept when user is typing in text fields
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

  const triggerSceneFade = (callback: () => void) => {
    setFadeActive(true);
    setTimeout(() => {
      callback();
      setFadeActive(false);
    }, 240);
  };

  // Checkpoint restore when lives drop to 0
  const handleSpendLife = () => {
    const nextLives = gameState.lives - 1;
    if (nextLives <= 0) {
      sound.playMiss();
      // Restore checkpoint and refill lives to 3
      triggerSceneFade(() => {
        updateGameState({
          lives: 3,
          currentStop: gameState.checkpointStop,
          phase: gameState.checkpointStop === 0 ? 'hangar' : 'gate',
        });
        // Reset gate dialogue
        if (gameState.checkpointStop > 0) {
          const scripts = STOP_DIALOGUES[gameState.checkpointStop];
          if (scripts) {
            setActiveDialogueLines(scripts.before);
            setDialogueIndex(0);
            setDialoguePhase('before');
          }
        }
      });
    } else {
      updateGameState({ lives: nextLives });
    }
  };

  // Scrub flight to hangar (for delta-v shortage or Uranus freeze)
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
    });
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
    });
  };

  // Resume Corridor
  const handleResumeGame = () => {
    sound.playUiClick();
    sound.startAmbientHum();
    triggerSceneFade(() => {
      // If was in title, resume to saved phase
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
    });
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
    });
  };

  // Hangar -> Launch into transit toward Stop 1 Moon
  const handleLaunchFromHangar = () => {
    const metrics = calculateShipMetrics(gameState.shipDesign);
    if (!metrics.isLaunchLegal) return;

    triggerSceneFade(() => {
      // Launch spends first 900 m/s (Earth to Moon)
      const remainingDv = metrics.totalDeltaV - 900;
      updateGameState({
        phase: 'transit',
        currentStop: 1, // Heading to Moon
        checkpointStop: 0,
        currentDeltaV: remainingDv,
        lives: 3,
      });
      setCurrentDodgeIndex(0);
      setTotalDodgesOnLeg(FLIGHT_LEGS[0].dodges); // 1 dodge
    });
  };

  // Successful dodge in transit
  const handleDodgeSuccess = () => {
    const nextDodge = currentDodgeIndex + 1;
    if (nextDodge < totalDodgesOnLeg) {
      setCurrentDodgeIndex(nextDodge);
    } else {
      // All dodges complete on this leg -> Arrive at stop gate
      triggerSceneFade(() => {
        const stopIdx = gameState.currentStop;
        updateGameState({
          phase: 'gate',
          checkpointStop: stopIdx, // Entering a stop saves checkpoint
        });
        const scripts = STOP_DIALOGUES[stopIdx];
        if (scripts) {
          setActiveDialogueLines(scripts.before);
          setDialogueIndex(0);
          setDialoguePhase('before');
        }
      });
    }
  };

  // Gate dialogue before puzzle completed -> Show clearance directive modal
  const handleGateBeforeComplete = () => {
    setDialoguePhase(null); // Close dialogue to show interactive puzzle / fight
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
      // Harbor cleared -> direct coast home, no delta-v, no dodge
      triggerSceneFade(() => {
        updateGameState({
          phase: 'ending',
        });
      });
      return;
    }

    const nextStop = currentStop + 1;
    const nextLeg = FLIGHT_LEGS.find((l) => l.fromStop === currentStop && l.toStop === nextStop);
    const legCost = nextLeg ? nextLeg.costDeltaV : 1000;
    const dodges = nextLeg ? nextLeg.dodges : 1;

    // Stop 4 Jupiter Refuel check
    let newDeltaV = gameState.currentDeltaV;
    if (currentStop === 4) {
      // Bolt refuels tanks to capacity
      const metrics = calculateShipMetrics(gameState.shipDesign);
      newDeltaV = metrics.totalDeltaV; // refueled!
    }

    // Check if delta-v is short for next burn
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
    });
  };

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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0c10] text-[#e9e6dc] flex items-center justify-center ">
        Loading Tenth Light telemetry...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] text-[#e9e6dc] flex flex-col justify-between overflow-hidden selection:bg-[#f0562b] selection:text-[#0a0c10] relative">
      {/* Scene Fade Transition Overlay */}
      <div
        className={`fixed inset-0 bg-[#0a0c10] z-50 pointer-events-none transition-opacity duration-700 ${
          fadeActive ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Persistent Header on all screens except Title */}
      {gameState.phase !== 'title' && (
        <PersistentHeader
          lives={gameState.lives}
          currentStopIndex={gameState.currentStop}
          currentStopName={stopNames[gameState.currentStop]}
          onPause={() => setIsPaused(true)}
          onMenu={() => {
            sound.playUiClick();
            updateGameState({ phase: 'title' });
          }}
          onOpenLogbook={() => setIsLogbookOpen(true)}
          showClearanceButton={gameState.phase === 'gate' && !dialoguePhase}
          onOpenClearance={() => setIsGateClearanceOpen(true)}
          isMuted={gameState.isMuted}
          onToggleMute={handleToggleMute}
          showSentence={true}
        />
      )}

      {/* Pause Modal */}
      <PauseModal
        isOpen={isPaused}
        onResume={() => setIsPaused(false)}
        onReturnToMenu={() => {
          setIsPaused(false);
          updateGameState({ phase: 'title' });
        }}
      />

      {/* Specialist’s Mission Logbook Modal */}
      <MissionLogbookModal
        isOpen={isLogbookOpen}
        onClose={() => setIsLogbookOpen(false)}
        maxUnlockedStop={gameState.currentStop}
        callsign={gameState.callsign}
      />

      {/* Gate Clearance Directive Modal (How to clear this level) */}
      <GateClearanceModal
        stopIndex={gameState.currentStop}
        isOpen={isGateClearanceOpen}
        onClose={() => setIsGateClearanceOpen(false)}
      />

      {/* Pinned Telemetry Pill (pinui style) during flight */}
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
          <div className="w-full h-full flex flex-col justify-between relative">
            {/* 3D Ship in Hangar Stage */}
            <div className="w-full h-[calc(100vh-230px)] relative">
              <Ship3DView design={gameState.shipDesign} interactive={true} />

              {/* Sky Planet Card for TOI-700 e & d */}
              {dialogueIndex >= 3 && (
                <div className="absolute top-4 right-4 z-20 w-80 bg-[#12151b]/95 border border-[#f0562b] p-6 rounded text-xs shadow-2xl backdrop-blur-none animate-fadeIn">
                  <div className="font-serif text-base text-[#f0562b] border-b border-[#e9e6dc]/20 pb-1.5 mb-2">
                    NASA Exoplanet Archive
                  </div>
                  <div className="text-xs text-[#e9e6dc]/70 mb-3 leading-relaxed">
                    Snapshot 15 Nov 2026. Equilibrium temp is not weather.
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed">
                    <div className="text-[#e9e6dc] font-bold text-sm">
                      ✓ Target: TOI-700 e (Harbor)
                    </div>
                    <div className="text-[#e9e6dc]/90 pl-3">
                      0.919 R⊕ • 0.718 M⊕ • 27.81d • 272.9 K • 101.5 ly
                    </div>

                    <div className="text-[#e9e6dc]/50 font-bold text-sm pt-1.5">
                      ✕ Twin You Do Not Fly: TOI-700 d
                    </div>
                    <div className="text-[#e9e6dc]/60 pl-3">
                      1.145 R⊕ • 1.580 M⊕ • 37.42d • 268.8 K
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Fixed 120-130px Dialogue Bar with Previous, Auto, Next */}
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
          <div className="w-full h-[calc(100vh-160px)] relative">
            {/* Cruising Ship in Starfield */}
            <Ship3DView design={gameState.shipDesign} cruiseMode={true} interactive={true} />

            {/* In-Transit Telemetry HUD */}
            <div className="absolute top-4 left-4 bg-[#12151b]/90 border border-[#e9e6dc]/30 p-5 rounded text-sm z-20 shadow-lg">
              <div className="text-[#f0562b] font-bold text-base">
                Burning to Stop {gameState.currentStop}: {stopNames[gameState.currentStop]}
              </div>
              <div className="text-[#e9e6dc]/90 mt-1">
                Remaining Delta-v: <span className="font-bold text-[#f0562b]">{gameState.currentDeltaV} m/s</span>
              </div>
            </div>

            {/* Dodge Ring (if dodges remain on this leg) */}
            <DodgeRing
              isPaused={isPaused}
              dodgeIndex={currentDodgeIndex}
              totalDodges={totalDodgesOnLeg}
              onSuccess={handleDodgeSuccess}
              onMiss={handleSpendLife}
            />
          </div>
        )}

        {/* ================= 5. STOP GATE SCREENS ================= */}
        {gameState.phase === 'gate' && (
          <div className="w-full h-[calc(100vh-160px)] relative flex flex-col justify-between">
            {/* Top Area: 3D Ship + Planet Cards in the sky */}
            <div className="w-full h-full relative flex items-center justify-center p-3">
              {/* If dialogue is NOT active, show interactive puzzle or mini-game */}
              {!dialoguePhase && (
                <div className="z-20 w-full">
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
              )}

              {/* Background 3D ship remains visible in the sky above the bottom bar */}
              <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <Ship3DView design={gameState.shipDesign} interactive={false} />
              </div>
            </div>

            {/* Bottom Fixed 120-130px Dialogue Bar with Previous, Auto, Next */}
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
              });
            }}
          />
        )}
      </main>
    </div>
  );
}
