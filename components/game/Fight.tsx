"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group, Mesh, MeshStandardMaterial, Scene, SphereGeometry } from "three";
import type { PartId } from "@/lib/game/types";
import { blip } from "./audio";
import { ShipMesh } from "./ShipMesh";

type Ufo = { mesh: Group; gx: number; gy: number; alive: boolean };
type Bolt = { mesh: Mesh; x: number; y: number; alive: boolean };
type Sim = {
  ufos: Ufo[];
  shots: Bolt[];
  originX: number;
  originY: number;
  dir: number;
  playerX: number;
  wave: number;
  cool: number;
  hurt: number;
  won: boolean;
};

export function Fight({
  parts,
  lives,
  paused,
  onHit,
  onWin,
}: {
  parts: PartId[];
  lives: number;
  paused: boolean;
  onHit: () => void;
  onWin: () => void;
}) {
  return (
    <div className="fight">
      <Canvas orthographic camera={{ position: [0, 0, 20], zoom: 52, near: 0.1, far: 80 }}>
        <color attach="background" args={["#14120e"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 8, 6]} intensity={1.3} />
        <Battle parts={parts} paused={paused} onHit={onHit} onWin={onWin} />
      </Canvas>
      <div className="fight-hud">
        <p>Wave fight. Slide with A D or the arrows. Space shoots up. Hull lives: {lives}.</p>
        <div className="pad">
          <PadButton code="ArrowLeft" label="Left" />
          <PadButton code="Space" label="Shoot" />
          <PadButton code="ArrowRight" label="Right" />
        </div>
      </div>
    </div>
  );
}

function PadButton({ code, label }: { code: string; label: string }) {
  return (
    <button
      type="button"
      onPointerDown={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: code === "Space" ? " " : code }))}
      onPointerUp={() => window.dispatchEvent(new KeyboardEvent("keyup", { key: code === "Space" ? " " : code }))}
    >
      {label}
    </button>
  );
}

function Battle({
  parts,
  paused,
  onHit,
  onWin,
}: {
  parts: PartId[];
  paused: boolean;
  onHit: () => void;
  onWin: () => void;
}) {
  const keys = useRef({ left: false, right: false, fire: false });
  const player = useRef<Group>(null);
  const callbacks = useRef({ onHit, onWin });
  const sim = useRef<Sim | null>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    callbacks.current = { onHit, onWin };
  }, [onHit, onWin]);

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) keys.current = { left: false, right: false, fire: false };
  }, [paused]);

  useEffect(() => {
    function down(event: KeyboardEvent) {
      if (pausedRef.current) return;
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") keys.current.left = true;
      if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") keys.current.right = true;
      if (event.key === " " || event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
        event.preventDefault();
        keys.current.fire = true;
      }
    }
    function up(event: KeyboardEvent) {
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") keys.current.left = false;
      if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") keys.current.right = false;
      if (event.key === " " || event.key === "ArrowUp" || event.key === "w" || event.key === "W") keys.current.fire = false;
    }
    window.addEventListener("keydown", down, true);
    window.addEventListener("keyup", up, true);
    return () => {
      window.removeEventListener("keydown", down, true);
      window.removeEventListener("keyup", up, true);
    };
  }, []);

  useFrame((state, delta) => {
    if (pausedRef.current) return;
    const dt = Math.min(delta, 0.05);
    sim.current ??= boot(state.scene);
    const world = sim.current;
    if (keys.current.left) world.playerX -= dt * 6.5;
    if (keys.current.right) world.playerX += dt * 6.5;
    world.playerX = Math.max(-7.2, Math.min(7.2, world.playerX));
    if (player.current) player.current.position.x = world.playerX;
    world.cool -= dt;
    world.hurt -= dt;
    if (keys.current.fire && world.cool <= 0) {
      world.cool = 0.22;
      const mesh = shotMesh();
      mesh.position.set(world.playerX, -4.4, 0);
      state.scene.add(mesh);
      world.shots.push({ mesh, x: world.playerX, y: -4.4, alive: true });
      blip("shoot");
    }
    world.originX += world.dir * dt * (1.35 + world.wave * 0.45);
    let turn = false;
    for (const ufo of world.ufos) {
      if (!ufo.alive) continue;
      const x = world.originX + ufo.gx;
      if (x > 7.4 || x < -7.4) turn = true;
    }
    if (turn) {
      world.dir *= -1;
      world.originX += world.dir * 0.2;
      world.originY -= 0.32;
    }
    let removed = false;
    for (const ufo of world.ufos) {
      if (!ufo.alive) continue;
      const x = world.originX + ufo.gx;
      const y = world.originY + ufo.gy;
      ufo.mesh.position.set(x, y, 0);
      ufo.mesh.rotation.z = Math.sin(state.clock.elapsedTime * 3 + ufo.gx) * 0.08;
      if (y < -4.15 && world.hurt <= 0) {
        ufo.alive = false;
        world.hurt = 0.8;
        removed = true;
        callbacks.current.onHit();
      }
      for (const shot of world.shots) {
        if (!shot.alive || !ufo.alive) continue;
        const dx = shot.x - x;
        const dy = shot.y - y;
        if (dx * dx + dy * dy < 0.55) {
          shot.alive = false;
          ufo.alive = false;
          removed = true;
        }
      }
    }
    for (const shot of world.shots) {
      if (!shot.alive) continue;
      shot.y += dt * 11;
      shot.mesh.position.set(shot.x, shot.y, 0);
      if (shot.y > 7) shot.alive = false;
    }
    if (world.shots.some((shot) => !shot.alive) || removed) {
      for (const shot of world.shots) {
        if (!shot.alive) state.scene.remove(shot.mesh);
      }
      world.shots = world.shots.filter((shot) => shot.alive);
      world.ufos = world.ufos.filter((ufo) => {
        if (ufo.alive) return true;
        state.scene.remove(ufo.mesh);
        return false;
      });
    }
    if (world.ufos.length === 0) {
      if (world.wave >= 3) {
        if (!world.won) {
          world.won = true;
          callbacks.current.onWin();
        }
      } else {
        world.wave += 1;
        world.originX = 0;
        world.originY = 0.4 + world.wave * 0.15;
        world.ufos = bootWave(state.scene, world.wave);
      }
    }
  });

  useEffect(() => {
    return () => {
      const world = sim.current;
      if (!world) return;
      for (const ufo of world.ufos) ufo.mesh.removeFromParent();
      for (const shot of world.shots) shot.mesh.removeFromParent();
      sim.current = null;
    };
  }, []);

  return (
    <>
      <group ref={player} position={[0, -5.2, 0]} scale={0.38}>
        <ShipMesh parts={parts} />
      </group>
    </>
  );
}

function boot(scene: Scene): Sim {
  return {
    ufos: bootWave(scene, 1),
    shots: [],
    originX: 0,
    originY: 0.6,
    dir: 1,
    playerX: 0,
    wave: 1,
    cool: 0,
    hurt: 0,
    won: false,
  };
}

function bootWave(scene: Scene, wave: number): Ufo[] {
  const cols = 6;
  const rows = 3;
  const flock: Ufo[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const mesh = ufo(row);
      const craft: Ufo = {
        mesh,
        gx: (col - (cols - 1) / 2) * 1.45,
        gy: 3.1 - row * 1.15 - wave * 0.05,
        alive: true,
      };
      mesh.position.set(craft.gx, craft.gy, 0);
      scene.add(mesh);
      flock.push(craft);
    }
  }
  return flock;
}

function ufo(row: number) {
  const mesh = new Group();
  const colors = ["#c4452d", "#e39b12", "#efe6d6"];
  const body = new Mesh(
    new SphereGeometry(0.42, 16, 10),
    new MeshStandardMaterial({ color: colors[row] ?? "#c4452d" }),
  );
  body.scale.set(1.45, 0.38, 1);
  const dome = new Mesh(new SphereGeometry(0.2, 12, 8), new MeshStandardMaterial({ color: "#9fd7e8" }));
  dome.position.y = 0.22;
  const wingL = new Mesh(new SphereGeometry(0.16, 8, 6), new MeshStandardMaterial({ color: "#1a1714" }));
  wingL.position.set(-0.48, -0.02, 0);
  wingL.scale.set(1.2, 0.45, 0.4);
  const wingR = wingL.clone();
  wingR.position.x = 0.48;
  mesh.add(body, dome, wingL, wingR);
  return mesh;
}

function shotMesh() {
  const mesh = new Mesh(new SphereGeometry(0.1, 8, 8), new MeshStandardMaterial({ color: "#e39b12" }));
  mesh.scale.set(0.7, 1.8, 0.7);
  return mesh;
}
