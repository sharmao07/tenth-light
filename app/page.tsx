'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  GameSaveState,
  FLIGHT_LEGS,
  DialogueLine,
  STOP_DOSSIER_INFO,
} from '@/lib/gameTypes';
import { loadSave, saveState, calculateShipMetrics, DEFAULT_SAVE_STATE } from '@/lib/gameStore';
import { getBriefingLines, STOP_DIALOGUES } from '@/lib/storyScripts';
import { sound } from '@/components/AudioController';
import { PersistentHeader } from '@/components/PersistentHeader';
import { PauseModal } from '@/components/PauseModal';
import { MissionLogbookModal } from '@/components/MissionLogbookModal';
import { PinnedTelemetryPill } from '@/components/PinnedTelemetryPill';
import { SoundCaptionsHUD } from '@/components/SoundCaptionsHUD';
import { HangarView } from '@/components/HangarView';
import { EndingView } from '@/components/EndingView';
import { GateClearanceModal } from '@/components/GateClearanceModal';

// Phase Components
import { TitlePhase } from '@/components/phases/TitlePhase';
import { BriefingPhase } from '@/components/phases/BriefingPhase';
import { TransitPhase } from '@/components/phases/TransitPhase';
import { GatePhase } from '@/components/phases/GatePhase';

const STOP_NAMES: Record<number, string> = {
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

  const handleToggleReducedMotion = useCallback(() => {
    setGameState((prev) => {
      const next = !prev.reducedMotion;
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-reduced-motion', next ? 'true' : 'false');
      }
      return {
        ...prev,
        reducedMotion: next,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const handleToggleSoundCaptions = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      soundCaptions: prev.soundCaptions === false ? true : false,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // Load save on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = loadSave();
      setGameState(saved);
      if (saved.phase === 'transit') {
        const leg = FLIGHT_LEGS.find((l) => l.toStop === saved.currentStop);
        if (leg) {
          setTotalDodgesOnLeg(leg.dodges);
        }
      }
      sound.setMuted(saved.isMuted);
      if (typeof document !== 'undefined' && saved.reducedMotion) {
        document.documentElement.setAttribute('data-reduced-motion', 'true');
      }
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

  // Global PC game keyboard shortcuts (Escape: Pause, L: Logbook, M: Mute, H: How this works)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.key === 'Escape') {
        if (isLogbookOpen) {
          setIsLogbookOpen(false);
          sound.playUiClick();
        } else if (isGateClearanceOpen) {
          setIsGateClearanceOpen(false);
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
  }, [gameState.phase, isLogbookOpen, isGateClearanceOpen, handleToggleMute, dialoguePhase]);

  const triggerSceneFade = (callback: () => void, targetStop?: number) => {
    const nextStop = targetStop !== undefined ? targetStop : gameState.currentStop;
    const dossier = STOP_DOSSIER_INFO[nextStop] || STOP_DOSSIER_INFO[0];
    const name = STOP_NAMES[nextStop] || 'Deep Space';

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
        setCurrentDodgeIndex(0);
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
      setCurrentDodgeIndex(0);
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

  // Gate dialogue before puzzle completed -> Show "How this works" overlay once per puzzle type
  const handleGateBeforeComplete = () => {
    setDialoguePhase(null);
    const stopIdx = gameState.currentStop;
    // Show "How this works" overlay once at start of each puzzle type
    if (!gameState.seenTutorials?.[stopIdx]) {
      setIsGateClearanceOpen(true);
    }
  };

  const handleCloseGateClearance = () => {
    setIsGateClearanceOpen(false);
    const stopIdx = gameState.currentStop;
    if (!gameState.seenTutorials?.[stopIdx]) {
      updateGameState({
        seenTutorials: {
          ...(gameState.seenTutorials || {}),
          [stopIdx]: true,
        },
      });
    }
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
      <div className="min-h-screen bg-void text-paper flex items-center justify-center font-mono text-xs">
        Loading Tenth Light telemetry...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-void text-paper flex flex-col justify-between overflow-x-hidden selection:bg-signal selection:text-void relative">
      {/* Slow Page Transition Overlay with Stop Name */}
      {transitionState.visible && (
        <div
          role="status"
          aria-live="assertive"
          className={`fixed inset-0 z-[100] bg-void flex flex-col justify-center items-center px-8 text-center transition-opacity duration-500 select-none ${
            transitionState.fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="max-w-xl space-y-6 animate-fadeIn">
            <span className="label text-signal">
              TRANSIT PROTOCOL &middot; ORBITAL INSERTION
            </span>
            <h2 className="font-serif font-extralight text-5xl md:text-7xl text-paper tracking-tight">
              Stop <span className="tabular-nums">{transitionState.stopIdx}</span> <span className="font-extrabold text-paper block md:inline">&middot; {transitionState.stopName.replace(/\s*\([^)]*\)/g, '').trim()}</span>
            </h2>
            <div className="h-[1px] w-24 bg-signal mx-auto" />
            <p className="label text-paper-muted">
              {transitionState.sector}
            </p>
          </div>
        </div>
      )}

      {/* Persistent Header on all screens except Title */}
      {gameState.phase !== 'title' && (
        <PersistentHeader
          lives={gameState.lives}
          currentStopName={STOP_NAMES[gameState.currentStop]}
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

      {/* Modals & Sensory Accessibility */}
      <PauseModal
        isOpen={isPaused}
        onResume={() => setIsPaused(false)}
        onReturnToMenu={() => {
          setIsPaused(false);
          triggerSceneFade(() => updateGameState({ phase: 'title' }), 0);
        }}
        reducedMotion={gameState.reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
        soundCaptions={gameState.soundCaptions !== false}
        onToggleSoundCaptions={handleToggleSoundCaptions}
        gameState={gameState}
        onImportState={(newState) => {
          setGameState(newState);
          sound.setMuted(newState.isMuted);
        }}
      />

      <SoundCaptionsHUD enabled={gameState.soundCaptions !== false} />

      <MissionLogbookModal
        isOpen={isLogbookOpen}
        onClose={() => setIsLogbookOpen(false)}
        maxUnlockedStop={Math.max(gameState.currentStop, gameState.checkpointStop)}
        callsign={gameState.callsign}
      />

      <GateClearanceModal
        isOpen={isGateClearanceOpen}
        stopIndex={gameState.currentStop}
        onClose={handleCloseGateClearance}
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

      {/* Main Screen Phase Views */}
      <main className="flex-1 w-full relative flex flex-col justify-center min-h-0">
        {gameState.phase === 'title' && (
          <TitlePhase
            callsign={gameState.callsign}
            currentStop={gameState.currentStop}
            onUpdateCallsign={(callsign) => updateGameState({ callsign })}
            onStartBriefing={handleStartBriefing}
            onResumeGame={handleResumeGame}
            onOpenLogbook={() => setIsLogbookOpen(true)}
          />
        )}

        {gameState.phase === 'briefing' && (
          <BriefingPhase
            callsign={gameState.callsign}
            shipDesign={gameState.shipDesign}
            activeDialogueLines={activeDialogueLines}
            dialogueIndex={dialogueIndex}
            onAdvanceDialogue={() => setDialogueIndex((i) => i + 1)}
            onPreviousDialogue={() => setDialogueIndex((i) => Math.max(0, i - 1))}
            onBriefingComplete={handleBriefingComplete}
          />
        )}

        {gameState.phase === 'hangar' && (
          <HangarView
            design={gameState.shipDesign}
            lives={gameState.lives}
            onUpdateDesign={(d) => updateGameState({ shipDesign: d })}
            onLaunch={handleLaunchFromHangar}
          />
        )}

        {gameState.phase === 'transit' && (
          <TransitPhase
            currentStop={gameState.currentStop}
            currentDeltaV={gameState.currentDeltaV}
            stopName={STOP_NAMES[gameState.currentStop]}
            shipDesign={gameState.shipDesign}
            isPaused={isPaused}
            currentDodgeIndex={currentDodgeIndex}
            totalDodgesOnLeg={totalDodgesOnLeg}
            onDodgeSuccess={handleDodgeSuccess}
            onDodgeMiss={handleSpendLife}
          />
        )}

        {gameState.phase === 'gate' && (
          <GatePhase
            currentStop={gameState.currentStop}
            stopName={STOP_NAMES[gameState.currentStop]}
            lives={gameState.lives}
            currentDeltaV={gameState.currentDeltaV}
            shipDesign={gameState.shipDesign}
            isPaused={isPaused}
            dialoguePhase={dialoguePhase}
            activeDialogueLines={activeDialogueLines}
            dialogueIndex={dialogueIndex}
            onAdvanceDialogue={() => setDialogueIndex((i) => i + 1)}
            onPreviousDialogue={() => setDialogueIndex((i) => Math.max(0, i - 1))}
            onDialogueComplete={() => {
              if (dialoguePhase === 'before') {
                handleGateBeforeComplete();
              } else {
                handleGateSuccessComplete();
              }
            }}
            onPuzzleSuccess={handlePuzzleSuccess}
            onSpendLife={handleSpendLife}
            onScrubToHangar={handleScrubToHangar}
            onUranusBreakersPassed={() => updateGameState({ uranusBreakersPassed: true })}
            onHarborSampleVictory={(w, s) => updateGameState({ collectedWater: w, collectedSoil: s })}
            onOpenHowThisWorks={() => setIsGateClearanceOpen(true)}
          />
        )}

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
