'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  GameSaveState,
  ShipDesign,
  FLIGHT_LEGS,
  DialogueLine,
} from '@/lib/gameTypes';
import { loadSave, saveState, calculateShipMetrics, DEFAULT_SAVE_STATE } from '@/lib/gameStore';
import { EXOPLANET_SNAPSHOT } from '@/lib/nasaSnapshots';
import { getBriefingLines, STOP_DIALOGUES } from '@/lib/storyScripts';
import { sound } from '@/components/AudioController';
import { Ship3DView } from '@/components/Ship3DView';
import { PersistentHeader } from '@/components/PersistentHeader';
import { PauseModal } from '@/components/PauseModal';
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

export default function TenthLightGame() {
  const [gameState, setGameState] = useState<GameSaveState>(DEFAULT_SAVE_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [activeDialogueLines, setActiveDialogueLines] = useState<DialogueLine[]>([]);
  const [dialoguePhase, setDialoguePhase] = useState<'before' | 'success' | null>(null);

  // Transit dodge state
  const [currentDodgeIndex, setCurrentDodgeIndex] = useState(0);
  const [totalDodgesOnLeg, setTotalDodgesOnLeg] = useState(1);

  // Fade transition flag
  const [fadeActive, setFadeActive] = useState(false);

  // Load save on mount
  useEffect(() => {
    const saved = loadSave();
    setGameState(saved);
    sound.setMuted(saved.isMuted);
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (isLoaded) {
      saveState(gameState);
    }
  }, [gameState, isLoaded]);

  // Escape key global listener for pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState.phase !== 'title') {
          setIsPaused((p) => !p);
          sound.playUiClick();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.phase]);

  const triggerSceneFade = (callback: () => void) => {
    setFadeActive(true);
    setTimeout(() => {
      callback();
      setFadeActive(false);
    }, 240);
  };

  const updateGameState = useCallback((updates: Partial<GameSaveState>) => {
    setGameState((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const handleToggleMute = () => {
    const nextMuted = !gameState.isMuted;
    sound.setMuted(nextMuted);
    updateGameState({ isMuted: nextMuted });
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

  // Gate dialogue before puzzle completed
  const handleGateBeforeComplete = () => {
    setDialoguePhase(null); // Close dialogue to show interactive puzzle / fight
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
    8: 'Pluto (Heart ❤️)',
    9: 'Heliopause (Whisper)',
    10: 'Harbor (TOI-700 e)',
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#100e0c] text-[#efe6d6] flex items-center justify-center font-mono">
        Loading Tenth Light telemetry...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#100e0c] text-[#efe6d6] flex flex-col justify-between overflow-hidden selection:bg-[#e39b12] selection:text-[#100e0c] relative">
      {/* Scene Fade Transition Overlay */}
      <div
        className={`fixed inset-0 bg-[#100e0c] z-50 pointer-events-none transition-opacity duration-200 ${
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

      {/* Main Screen Views */}
      <main className="flex-1 w-full relative flex flex-col items-center justify-center min-h-0">
        {/* ================= 1. TITLE SCREEN ================= */}
        {gameState.phase === 'title' && (
          <div className="w-full max-w-4xl mx-auto p-6 md:p-8 text-center space-y-6 md:space-y-8 select-none my-auto">
            {/* The persistent honesty statement */}
            <div className="p-4 md:p-5 bg-[#1a1714] border border-[#efe6d6]/20 rounded-lg text-sm md:text-base font-sans text-[#efe6d6]/90 leading-relaxed shadow-lg">
              “Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive.
              The voyage past the heliopause is a mission simulation that uses the archive’s numbers.
              The aliens, the depot fight, and the droid are the story.”
            </div>

            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-[#efe6d6]">
                TENTH LIGHT
              </h1>
              <p className="font-serif text-xl md:text-2xl text-[#e39b12] italic">
                “Design the ship. Stay in the seat. Send the droid.”
              </p>
              <div className="text-sm font-mono text-[#efe6d6]/70">
                NASA Space Apps 2026: Space Mission Design Game
              </div>
            </div>

            {/* Callsign Input */}
            <div className="max-w-sm mx-auto bg-[#1a1714] border border-[#efe6d6]/20 p-5 rounded-lg space-y-3 text-left font-mono shadow-md">
              <label className="text-sm uppercase tracking-wider text-[#e39b12] font-bold block">
                Specialist Callsign (Max 16 chars):
              </label>
              <input
                type="text"
                maxLength={16}
                value={gameState.callsign}
                onChange={(e) => updateGameState({ callsign: e.target.value.trim() || 'Wren' })}
                className="w-full px-3.5 py-2 bg-[#100e0c] border border-[#efe6d6]/30 text-[#efe6d6] rounded font-mono text-base focus:border-[#e39b12] focus:outline-none"
                placeholder="Wren"
              />
              <div className="text-xs text-[#efe6d6]/70 leading-relaxed">
                The specialist never leaves the ship and appears only in dialogue.
              </div>
            </div>

            {/* Menu Actions */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
              <button
                onClick={handleStartBriefing}
                className="px-8 py-3.5 bg-[#e39b12] hover:bg-[#c9820a] text-[#100e0c] font-mono font-bold text-sm md:text-base uppercase tracking-wider rounded transition-colors shadow-lg"
              >
                Begin Mission (Earth Briefing)
              </button>

              {gameState.currentStop > 0 && (
                <button
                  onClick={handleResumeGame}
                  className="px-6 py-3.5 bg-[#1a1714] hover:bg-[#efe6d6]/10 border border-[#e39b12] text-[#e39b12] font-mono text-sm md:text-base uppercase tracking-wider rounded transition-colors"
                >
                  Resume Corridor (Stop {gameState.currentStop})
                </button>
              )}

              <Link
                href="/data"
                className="px-6 py-3.5 bg-[#1a1714] hover:bg-[#efe6d6]/10 border border-[#efe6d6]/30 text-[#efe6d6] font-mono text-xs md:text-sm uppercase tracking-wider rounded transition-colors"
              >
                Scientific Data (/data)
              </Link>
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
                <div className="absolute top-4 right-4 z-20 w-80 bg-[#1a1714]/95 border-2 border-[#e39b12] p-4 rounded text-xs font-mono shadow-2xl backdrop-blur-none animate-fadeIn">
                  <div className="font-serif font-bold text-base text-[#e39b12] border-b border-[#efe6d6]/20 pb-1 mb-2">
                    NASA Exoplanet Archive
                  </div>
                  <div className="text-xs text-[#efe6d6]/70 mb-3 leading-relaxed">
                    Snapshot 15 Nov 2026. Equilibrium temp is not weather.
                  </div>

                  <div className="space-y-2 text-xs leading-relaxed">
                    <div className="text-[#5bc0be] font-bold text-sm">
                      ✓ Target: TOI-700 e (Harbor)
                    </div>
                    <div className="text-[#efe6d6]/90 pl-2">
                      0.919 R⊕ • 0.718 M⊕ • 27.81d • 272.9 K • 101.5 ly
                    </div>

                    <div className="text-[#efe6d6]/50 font-bold text-sm pt-1">
                      ✕ Twin You Do Not Fly: TOI-700 d
                    </div>
                    <div className="text-[#efe6d6]/60 pl-2">
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
            <div className="absolute top-4 left-4 bg-[#1a1714]/90 border border-[#efe6d6]/30 p-3 rounded text-sm font-mono z-20 shadow-lg">
              <div className="text-[#e39b12] font-bold text-base">
                Burning to Stop {gameState.currentStop}: {stopNames[gameState.currentStop]}
              </div>
              <div className="text-[#efe6d6]/90 mt-1">
                Remaining Delta-v: <span className="font-bold text-[#e39b12]">{gameState.currentDeltaV} m/s</span>
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
            <div className="w-full h-full relative flex items-center justify-center p-2">
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
