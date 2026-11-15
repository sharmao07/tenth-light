'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from './AudioController';

interface FormationShooterProps {
  isPaused: boolean;
  onVictory: () => void;
  onHit: () => void;
}

interface Saucer {
  id: number;
  x: number;
  y: number;
  alive: boolean;
  hitFlash?: number; // 0..1 timer for white hit-flash
}

interface Bullet {
  x: number;
  y: number;
  isEnemy: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export function FormationShooter({ isPaused, onVictory, onHit }: FormationShooterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wave, setWave] = useState(1);
  const [saucersLeft, setSaucersLeft] = useState(0);

  const gameState = useRef({
    playerX: 200,
    playerY: 340,
    bullets: [] as Bullet[],
    saucers: [] as Saucer[],
    particles: [] as Particle[],
    trauma: 0,
    playerHitFlash: 0,
    muzzleFlash: 0,
    saucerDir: 1, // 1 = right, -1 = left
    saucerStepTimer: 0,
    saucerStepInterval: 0.6,
    saucerSpeedX: 8,
    saucerDropY: 14,
    lastShotTime: 0,
    isInvulnerable: false,
    invulnerableTimer: 0,
    wave: 1,
    keys: {
      left: false,
      right: false,
      shoot: false,
    },
  });

  const initWave = useCallback((w: number) => {
    gameState.current.wave = w;
    setWave(w);
    const rows = w === 1 ? 2 : 3;
    const cols = w === 1 ? 5 : w === 2 ? 5 : 6;
    const saucers: Saucer[] = [];
    let id = 0;
    const startX = 40;
    const spacingX = 48;
    const startY = 40;
    const spacingY = 32;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        saucers.push({
          id: id++,
          x: startX + c * spacingX,
          y: startY + r * spacingY,
          alive: true,
        });
      }
    }

    gameState.current.saucers = saucers;
    gameState.current.bullets = [];
    gameState.current.saucerDir = 1;
    gameState.current.saucerStepInterval = Math.max(0.25, 0.65 - w * 0.12);
    setSaucersLeft(saucers.length);
  }, []);

  // Initialize Wave 1
  useEffect(() => {
    initWave(1);
  }, [initWave]);

  // Window key capture phase
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;
      const k = gameState.current.keys;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        k.left = true;
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        k.right = true;
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        k.shoot = true;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const k = gameState.current.keys;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') k.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') k.right = false;
      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') k.shoot = false;
    };

    window.addEventListener('keydown', onKeyDown, { capture: true });
    window.addEventListener('keyup', onKeyUp, { capture: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true });
      window.removeEventListener('keyup', onKeyUp, { capture: true });
    };
  }, [isPaused]);

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (isPaused) {
        // Render paused indicator on canvas
        ctx.fillStyle = 'rgba(16, 14, 12, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#e39b12';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
        return;
      }

      const st = gameState.current;

      // 1. Player movement
      const moveSpeed = 190;
      if (st.keys.left) st.playerX = Math.max(20, st.playerX - moveSpeed * dt);
      if (st.keys.right) st.playerX = Math.min(canvas.width - 20, st.playerX + moveSpeed * dt);

      // 2. Player shooting
      if (st.keys.shoot && now - st.lastShotTime > 240) {
        st.lastShotTime = now;
        st.bullets.push({ x: st.playerX, y: st.playerY - 14, isEnemy: false });
        st.muzzleFlash = 0.05;
        st.trauma = Math.min(1.0, st.trauma + 0.08); // micro trauma on cannon kick
        sound.playLaserShot();
      }

      // 3. Invulnerability timer
      if (st.isInvulnerable) {
        st.invulnerableTimer -= dt;
        if (st.invulnerableTimer <= 0) st.isInvulnerable = false;
      }

      // Update muzzle flash
      if (st.muzzleFlash > 0) {
        st.muzzleFlash = Math.max(0, st.muzzleFlash - dt);
      }

      // 4. Update particles (hit-sparks from combat)
      st.particles.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
      });
      st.particles = st.particles.filter((p) => p.life > 0);

      // 5. Update bullets
      const bulletSpeed = 320;
      const enemyBulletSpeed = 160;
      st.bullets.forEach((b) => {
        b.y += b.isEnemy ? enemyBulletSpeed * dt : -bulletSpeed * dt;
      });
      st.bullets = st.bullets.filter((b) => b.y > 0 && b.y < canvas.height);

      // 6. Saucers march
      st.saucerStepTimer += dt;
      const aliveSaucers = st.saucers.filter((s) => s.alive);

      if (aliveSaucers.length === 0) {
        // Wave cleared
        if (st.wave < 3) {
          sound.playSuccess();
          initWave(st.wave + 1);
        } else {
          sound.playSuccess();
          onVictory();
        }
        return;
      }

      // Saucers step
      if (st.saucerStepTimer >= st.saucerStepInterval) {
        st.saucerStepTimer = 0;
        let shouldDrop = false;

        for (const s of aliveSaucers) {
          if ((st.saucerDir === 1 && s.x >= canvas.width - 35) || (st.saucerDir === -1 && s.x <= 20)) {
            shouldDrop = true;
            break;
          }
        }

        if (shouldDrop) {
          st.saucerDir = -st.saucerDir;
          for (const s of aliveSaucers) {
            s.y += st.saucerDropY;
          }
        } else {
          for (const s of aliveSaucers) {
            s.x += st.saucerDir * st.saucerSpeedX;
          }
        }

        // Enemy occasional shot (Wave 2 & 3)
        if (st.wave >= 2 && Math.random() < (st.wave === 2 ? 0.35 : 0.55)) {
          const shooter = aliveSaucers[Math.floor(Math.random() * aliveSaucers.length)];
          if (shooter) {
            st.bullets.push({ x: shooter.x, y: shooter.y + 10, isEnemy: true });
          }
        }
      }

      // 7. Collision: Player Bullets vs Saucers
      for (const b of st.bullets) {
        if (b.isEnemy) continue;
        for (const s of aliveSaucers) {
          if (Math.abs(b.x - s.x) < 16 && Math.abs(b.y - s.y) < 12) {
            s.alive = false;
            b.y = -999; // destroy bullet
            st.trauma = Math.min(1.0, st.trauma + 0.32); // medium trauma on saucer kill
            sound.playExplosion();

            // Spawn 7 radiating hit sparks (game-feel principle)
            for (let i = 0; i < 7; i++) {
              const angle = Math.random() * Math.PI * 2;
              const spd = 60 + Math.random() * 90;
              st.particles.push({
                x: s.x,
                y: s.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                life: 0.26,
                maxLife: 0.26,
                color: Math.random() > 0.4 ? '#e39b12' : '#efe6d6',
              });
            }

            setSaucersLeft(st.saucers.filter((sc) => sc.alive).length - 1);
            break;
          }
        }
      }

      // 8. Collision: Enemy shots or Saucers vs Player
      if (!st.isInvulnerable) {
        let playerHit = false;

        // Enemy bullets
        for (const b of st.bullets) {
          if (b.isEnemy && Math.abs(b.x - st.playerX) < 16 && Math.abs(b.y - st.playerY) < 14) {
            b.y = 9999;
            playerHit = true;
            break;
          }
        }

        // Saucer ramming
        if (!playerHit) {
          for (const s of aliveSaucers) {
            if (s.y >= st.playerY - 14) {
              playerHit = true;
              break;
            }
          }
        }

        if (playerHit) {
          sound.playMiss();
          st.trauma = 0.85; // heavy trauma on hull hit (shake = 0.85^2 = 0.72)
          st.playerHitFlash = 0.16; // red hit border
          st.isInvulnerable = true;
          st.invulnerableTimer = 1.6;
          onHit();
        }
      }

      // 9. Render with Trauma Camera Shake (quadratic falloff: trauma^2 * offset)
      let shakeX = 0;
      let shakeY = 0;
      if (st.trauma > 0) {
        const shakeMag = st.trauma * st.trauma;
        shakeX = (Math.random() * 2 - 1) * 8 * shakeMag;
        shakeY = (Math.random() * 2 - 1) * 6 * shakeMag;
        st.trauma = Math.max(0, st.trauma - dt * 3.5);
      }

      ctx.save();
      ctx.translate(shakeX, shakeY);

      ctx.fillStyle = '#100e0c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Star dots
      ctx.fillStyle = '#3a342c';
      for (let i = 0; i < 20; i++) {
        const sx = (i * 47) % canvas.width;
        const sy = (i * 83 + (now * 0.04)) % canvas.height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw Saucers (Original pixel saucers)
      for (const s of aliveSaucers) {
        // Saucer dome
        ctx.fillStyle = '#e39b12';
        ctx.beginPath();
        ctx.arc(s.x, s.y - 3, 7, Math.PI, 0);
        ctx.fill();

        // Saucer disc
        ctx.fillStyle = '#efe6d6';
        ctx.beginPath();
        ctx.ellipse(s.x, s.y + 1, 14, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dark cockpit slits
        ctx.fillStyle = '#1a1714';
        ctx.fillRect(s.x - 3, s.y - 4, 6, 2);
        ctx.fillStyle = '#c4452d';
        ctx.fillRect(s.x - 1, s.y - 4, 2, 2);
      }

      // Draw Bullets
      for (const b of st.bullets) {
        if (b.isEnemy) {
          ctx.fillStyle = '#c4452d';
          ctx.beginPath();
          ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#5bc0be';
          ctx.fillRect(b.x - 1.5, b.y - 6, 3, 9);
        }
      }

      // Draw Player Ship (Original geometry)
      const blink = st.isInvulnerable && Math.floor(now * 0.015) % 2 === 0;
      if (!blink) {
        // Thruster flame
        ctx.fillStyle = '#e39b12';
        ctx.beginPath();
        ctx.moveTo(st.playerX - 6, st.playerY + 8);
        ctx.lineTo(st.playerX + 6, st.playerY + 8);
        ctx.lineTo(st.playerX, st.playerY + 16 + Math.sin(now * 0.03) * 3);
        ctx.closePath();
        ctx.fill();

        // Wings
        ctx.fillStyle = '#544c42';
        ctx.beginPath();
        ctx.moveTo(st.playerX, st.playerY - 14);
        ctx.lineTo(st.playerX - 16, st.playerY + 8);
        ctx.lineTo(st.playerX + 16, st.playerY + 8);
        ctx.closePath();
        ctx.fill();

        // Capsule core
        ctx.fillStyle = '#efe6d6';
        ctx.beginPath();
        ctx.moveTo(st.playerX, st.playerY - 12);
        ctx.lineTo(st.playerX - 8, st.playerY + 6);
        ctx.lineTo(st.playerX + 8, st.playerY + 6);
        ctx.closePath();
        ctx.fill();

        // Visor
        ctx.fillStyle = '#e39b12';
        ctx.fillRect(st.playerX - 3, st.playerY - 5, 6, 3);

        // Muzzle Flash on Cannon Nose (game-feel principle)
        if (st.muzzleFlash > 0) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(st.playerX, st.playerY - 18, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#e39b12';
          ctx.beginPath();
          ctx.arc(st.playerX, st.playerY - 18, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Hit-Spark Particles (game-feel principle)
      for (const p of st.particles) {
        ctx.fillStyle = p.color;
        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
        ctx.globalAlpha = 1.0;
      }

      ctx.restore();

      // Red Screen Hit Flash (The Holy Trinity of Game Feel)
      if (st.playerHitFlash > 0) {
        st.playerHitFlash = Math.max(0, st.playerHitFlash - dt);
        ctx.strokeStyle = `rgba(196, 69, 45, ${Math.min(0.9, st.playerHitFlash * 6)})`;
        ctx.lineWidth = 8;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, initWave, onVictory, onHit]);

  return (
    <div className="flex flex-col items-center justify-center p-3 select-none">
      <div className="flex justify-between items-center w-full max-w-[440px] mb-2.5 px-1.5">
        <span className="font-mono text-sm uppercase tracking-wider text-[#e39b12] font-bold">
          Jupiter Depot Defense • Wave {wave}/3
        </span>
        <span className="font-mono text-xs md:text-sm text-[#efe6d6]/80 font-bold">
          Saucers Remaining: {saucersLeft}
        </span>
      </div>

      <div className="relative border-2 border-[#e39b12] rounded-lg bg-[#100e0c] shadow-2xl">
        <canvas
          ref={canvasRef}
          width={420}
          height={380}
          className="block"
        />

        {/* Controls Overlay Footer */}
        <div className="flex justify-between items-center bg-[#1a1714] px-4 py-2 border-t border-[#efe6d6]/20 text-xs md:text-sm font-mono text-[#efe6d6]/90">
          <div>
            Move: <kbd className="px-1.5 py-0.5 bg-[#100e0c] border border-[#efe6d6]/30 rounded">A</kbd>/<kbd className="px-1.5 py-0.5 bg-[#100e0c] border border-[#efe6d6]/30 rounded">D</kbd> or <kbd className="px-1.5 py-0.5 bg-[#100e0c] border border-[#efe6d6]/30 rounded">←</kbd>/<kbd className="px-1.5 py-0.5 bg-[#100e0c] border border-[#efe6d6]/30 rounded">→</kbd>
          </div>
          <div>
            Fire: <kbd className="px-1.5 py-0.5 bg-[#100e0c] border border-[#efe6d6]/30 rounded">Space</kbd> / <kbd className="px-1.5 py-0.5 bg-[#100e0c] border border-[#efe6d6]/30 rounded">W</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
