"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group, Mesh, MeshStandardMaterial, Scene, SphereGeometry } from "three";
import type { PartId } from "@/lib/game/types";
import { blip } from "./audio";
import { ShipMesh } from "./ShipMesh";

type Craft = { mesh: Group; x: number; z: number; phase: number; alive: boolean };
type Bolt = { mesh: Mesh; x: number; z: number; alive: boolean };
type Sim = { enemies: Craft[]; shots: Bolt[]; wave: number; cool: number; hurt: number; won: boolean; x: number };

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
      <Canvas camera={{ position: [0, 11, 10], fov: 42 }}>
        <color attach="background" args={["#14120e"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 8, 6]} intensity={1.3} />
        <Battle parts={parts} paused={paused} onHit={onHit} onWin={onWin} />
      </Canvas>
      <div className="fight-hud">
        <p>Ambush. Wave fight. Move and shoot. Hull lives: {lives}.</p>
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
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((state, delta) => {
    if (pausedRef.current) return;
    const dt = Math.min(delta, 0.05);
    sim.current ??= boot(state.scene);
    const world = sim.current;
    if (keys.current.left) world.x -= dt * 7;
    if (keys.current.right) world.x += dt * 7;
    world.x = Math.max(-7, Math.min(7, world.x));
    if (player.current) player.current.position.x = world.x;
    world.cool -= dt;
    world.hurt -= dt;
    if (keys.current.fire && world.cool <= 0) {
      world.cool = 0.28;
      const mesh = shotMesh();
      mesh.position.set(world.x, 0, 4.2);
      state.scene.add(mesh);
      world.shots.push({ mesh, x: world.x, z: 4.2, alive: true });
      blip("shoot");
    }
    for (const shot of world.shots) {
      if (!shot.alive) continue;
      shot.z -= dt * 14;
      shot.mesh.position.set(shot.x, 0, shot.z);
      if (shot.z < -12) shot.alive = false;
    }
    let removed = false;
    for (const enemy of world.enemies) {
      if (!enemy.alive) continue;
      enemy.phase += dt;
      enemy.x += Math.sin(enemy.phase * 1.4) * dt * 1.3;
      enemy.z += dt * (0.85 + world.wave * 0.18);
      enemy.mesh.position.set(enemy.x, 0, enemy.z);
      if (enemy.z > 4.6 && world.hurt <= 0) {
        enemy.alive = false;
        world.hurt = 0.9;
        removed = true;
        callbacks.current.onHit();
      }
      for (const shot of world.shots) {
        if (!shot.alive || !enemy.alive) continue;
        const dx = shot.x - enemy.x;
        const dz = shot.z - enemy.z;
        if (dx * dx + dz * dz < 0.85) {
          shot.alive = false;
          enemy.alive = false;
          removed = true;
        }
      }
    }
    if (!removed) return;
    for (const shot of world.shots) {
      if (!shot.alive) state.scene.remove(shot.mesh);
    }
    world.shots = world.shots.filter((shot) => shot.alive);
    world.enemies = world.enemies.filter((enemy) => {
      if (enemy.alive) return true;
      state.scene.remove(enemy.mesh);
      return false;
    });
    if (world.enemies.length === 0) {
      if (world.wave >= 3) {
        if (!world.won) {
          world.won = true;
          callbacks.current.onWin();
        }
      } else {
        world.wave += 1;
        world.enemies = bootWave(state.scene, world.wave);
      }
    }
  });

  useEffect(() => {
    return () => {
      const world = sim.current;
      if (!world) return;
      for (const enemy of world.enemies) enemy.mesh.removeFromParent();
      for (const shot of world.shots) shot.mesh.removeFromParent();
      sim.current = null;
    };
  }, []);

  return (
    <>
      <group ref={player} position={[0, 0, 5]} scale={0.5}>
        <ShipMesh parts={parts} />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#1c1914" />
      </mesh>
    </>
  );
}

function boot(scene: Scene): Sim {
  return { enemies: bootWave(scene, 1), shots: [], wave: 1, cool: 0, hurt: 0, won: false, x: 0 };
}

function bootWave(scene: Scene, wave: number): Craft[] {
  return Array.from({ length: 4 }, (_, index) => {
    const mesh = ufo();
    const craft = {
      mesh,
      x: -4.5 + index * 3,
      z: -7 - (index % 2),
      phase: index * 0.7 + wave,
      alive: true,
    };
    mesh.position.set(craft.x, 0, craft.z);
    scene.add(mesh);
    return craft;
  });
}

function ufo() {
  const mesh = new Group();
  const body = new Mesh(new SphereGeometry(0.55, 18, 12), new MeshStandardMaterial({ color: "#c4452d" }));
  body.scale.set(1.3, 0.28, 1.3);
  const dome = new Mesh(new SphereGeometry(0.28, 14, 10), new MeshStandardMaterial({ color: "#e6dfd0" }));
  dome.position.y = 0.28;
  mesh.add(body, dome);
  return mesh;
}

function shotMesh() {
  return new Mesh(new SphereGeometry(0.12, 8, 8), new MeshStandardMaterial({ color: "#e39b12" }));
}
