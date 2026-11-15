'use client';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ShipDesign } from '@/lib/gameTypes';

interface Ship3DViewProps {
  design: ShipDesign;
  cruiseMode?: boolean;
  interactive?: boolean;
  className?: string;
  showCoM?: boolean;
  showCoT?: boolean;
  showCoL?: boolean;
}

export function Ship3DView({
  design,
  cruiseMode = false,
  interactive = true,
  className = '',
  showCoM = false,
  showCoT = false,
  showCoL = false,
}: Ship3DViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c10);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    if (cruiseMode) {
      camera.position.set(4, 2.5, 7);
    } else {
      camera.position.set(3.5, 2, 6.5);
    }
    camera.lookAt(0, 0.8, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Single light source: stark, directional solar illumination (matte shadows & highlights)
    const sunLight = new THREE.DirectionalLight(0xf5f3ee, 2.4);
    sunLight.position.set(7, 9, 6);
    scene.add(sunLight);

    // Ship Group
    const shipGroup = new THREE.Group();
    scene.add(shipGroup);

    // Matte materials using Tenth Light palette:
    // Void #0a0c10, Paper #e9e6dc, Signal #f0562b, Matte Dark #1f232b
    const darkMetal = new THREE.MeshStandardMaterial({
      color: 0x1f232b,
      roughness: 0.92,
      metalness: 0.05,
    });
    const whiteHull = new THREE.MeshStandardMaterial({
      color: 0xe9e6dc,
      roughness: 0.95,
      metalness: 0.0,
    });
    const amberAccent = new THREE.MeshStandardMaterial({
      color: 0xf0562b,
      roughness: 0.88,
      metalness: 0.0,
    });
    const solarMaterial = new THREE.MeshStandardMaterial({
      color: 0x141a24,
      roughness: 0.9,
      metalness: 0.0,
    });
    const engineExhaustMat = new THREE.MeshBasicMaterial({
      color: 0xf0562b,
      transparent: true,
      opacity: 0.85,
    });

    // 1. Engine
    const engineBellGeom = new THREE.ConeGeometry(0.5, 0.7, 16, 1, true);
    const engineBell = new THREE.Mesh(engineBellGeom, darkMetal);
    engineBell.position.y = 0.35;
    shipGroup.add(engineBell);

    const chamberGeom = new THREE.CylinderGeometry(0.28, 0.32, 0.4, 16);
    const chamber = new THREE.Mesh(chamberGeom, darkMetal);
    chamber.position.y = 0.75;
    shipGroup.add(chamber);

    // Engine plume if cruising
    let plumeMesh: THREE.Mesh | null = null;
    if (cruiseMode) {
      const plumeGeom = new THREE.ConeGeometry(0.35, 1.2, 12);
      plumeGeom.rotateX(Math.PI);
      plumeMesh = new THREE.Mesh(plumeGeom, engineExhaustMat);
      plumeMesh.position.y = -0.55;
      shipGroup.add(plumeMesh);
    }

    // 2. Propellant Tanks
    const tankCount = Math.max(1, Math.min(4, design.parts['propellant_tank'] || 1));
    let currentY = 1.0;
    const tankHeight = 0.6;
    const tankRadius = 0.55;

    for (let i = 0; i < tankCount; i++) {
      const tankGeom = new THREE.CylinderGeometry(tankRadius, tankRadius, tankHeight - 0.05, 16);
      const tankMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x242832 : 0xd8d4c7,
        roughness: 0.94,
        metalness: 0.0,
      });
      const tankMesh = new THREE.Mesh(tankGeom, tankMat);
      tankMesh.position.y = currentY + tankHeight / 2;
      shipGroup.add(tankMesh);

      // Ring ribs
      const ribGeom = new THREE.TorusGeometry(tankRadius + 0.02, 0.03, 8, 16);
      ribGeom.rotateX(Math.PI / 2);
      const rib = new THREE.Mesh(ribGeom, darkMetal);
      rib.position.y = currentY + tankHeight / 2;
      shipGroup.add(rib);

      currentY += tankHeight;
    }

    // 3. Command Module (Capsule)
    const capsuleHeight = 0.9;
    const capsuleGeom = new THREE.CylinderGeometry(0.3, 0.62, capsuleHeight, 16);
    const capsuleMesh = new THREE.Mesh(capsuleGeom, whiteHull);
    capsuleMesh.position.y = currentY + capsuleHeight / 2;
    shipGroup.add(capsuleMesh);

    // Visor / cockpit window
    const windowGeom = new THREE.BoxGeometry(0.2, 0.12, 0.2);
    const windowMat = new THREE.MeshBasicMaterial({ color: 0xf0562b });
    const win = new THREE.Mesh(windowGeom, windowMat);
    win.position.set(0, currentY + capsuleHeight * 0.6, 0.42);
    shipGroup.add(win);

    currentY += capsuleHeight;

    // 4. High-Gain Antenna on top
    const dishMastGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8);
    const dishMast = new THREE.Mesh(dishMastGeom, darkMetal);
    dishMast.position.y = currentY + 0.2;
    shipGroup.add(dishMast);

    const dishGeom = new THREE.SphereGeometry(0.45, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const dish = new THREE.Mesh(dishGeom, whiteHull);
    dish.rotation.x = -Math.PI / 3;
    dish.position.set(0, currentY + 0.4, 0);
    shipGroup.add(dish);

    // 5. Radial Attachments
    const parts = design.parts || {};
    const radialY = currentY - capsuleHeight * 0.5;

    // Solar Arrays (if equipped)
    const solarCount = parts['solar_array'] || 0;
    if (solarCount > 0) {
      for (let s = 0; s < 2; s++) {
        const sign = s === 0 ? 1 : -1;
        const armGeom = new THREE.BoxGeometry(0.4, 0.04, 0.04);
        const arm = new THREE.Mesh(armGeom, darkMetal);
        arm.position.set(sign * 0.8, radialY, 0);
        shipGroup.add(arm);

        const panelGeom = new THREE.BoxGeometry(1.4, 0.02, 0.5);
        const panel = new THREE.Mesh(panelGeom, solarMaterial);
        panel.position.set(sign * 1.6, radialY, 0);
        shipGroup.add(panel);
      }
    }

    // RTG (if equipped)
    if ((parts['rtg'] || 0) > 0) {
      const rtgGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.45, 12);
      const rtg = new THREE.Mesh(rtgGeom, darkMetal);
      rtg.position.set(0, radialY, -0.65);
      shipGroup.add(rtg);

      // Red hazard band
      const bandGeom = new THREE.TorusGeometry(0.19, 0.02, 8, 12);
      bandGeom.rotateX(Math.PI / 2);
      const band = new THREE.Mesh(bandGeom, new THREE.MeshBasicMaterial({ color: 0xf0562b }));
      band.position.set(0, radialY, -0.65);
      shipGroup.add(band);

      // RTG Radiator Cooling Fins (Cassini/Voyager style)
      for (let f = 0; f < 4; f++) {
        const finAngle = (f * Math.PI) / 2;
        const finGeom = new THREE.BoxGeometry(0.02, 0.4, 0.12);
        const fin = new THREE.Mesh(finGeom, darkMetal);
        fin.position.set(
          Math.sin(finAngle) * 0.22,
          radialY,
          -0.65 + Math.cos(finAngle) * 0.22
        );
        fin.rotation.y = finAngle;
        shipGroup.add(fin);
      }
    }

    // Mass Spectrometer (if equipped)
    if ((parts['spectrometer'] || 0) > 0) {
      // Quadrupole body & ionization chamber
      const specGeom = new THREE.CylinderGeometry(0.1, 0.14, 0.35, 10);
      const spec = new THREE.Mesh(specGeom, amberAccent);
      spec.position.set(0.55, radialY - 0.2, 0.35);
      spec.rotation.z = -Math.PI / 6;
      shipGroup.add(spec);

      // Spectrometer sampling horn
      const hornGeom = new THREE.ConeGeometry(0.08, 0.15, 8, 1, true);
      const horn = new THREE.Mesh(hornGeom, darkMetal);
      horn.position.set(0.68, radialY - 0.36, 0.42);
      horn.rotation.z = -Math.PI / 6;
      shipGroup.add(horn);
    }

    // Sample Drill (if equipped)
    if ((parts['sample_drill'] || 0) > 0) {
      // Drill casing
      const drillGeom = new THREE.CylinderGeometry(0.05, 0.09, 0.45, 8);
      const drill = new THREE.Mesh(drillGeom, darkMetal);
      drill.position.set(-0.55, radialY - 0.2, 0.35);
      drill.rotation.z = Math.PI / 6;
      shipGroup.add(drill);

      // Core auger bit tip
      const bitGeom = new THREE.CylinderGeometry(0.02, 0.05, 0.22, 6);
      const bit = new THREE.Mesh(bitGeom, new THREE.MeshStandardMaterial({ color: 0x8a919b, metalness: 0.9, roughness: 0.2 }));
      bit.position.set(-0.68, radialY - 0.42, 0.42);
      bit.rotation.z = Math.PI / 6;
      shipGroup.add(bit);
    }

    // Imager (if equipped)
    if ((parts['imager'] || 0) > 0) {
      // Optical barrel
      const imagerGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 8);
      imagerGeom.rotateX(Math.PI / 2);
      const imager = new THREE.Mesh(imagerGeom, darkMetal);
      imager.position.set(0, radialY + 0.25, 0.55);
      shipGroup.add(imager);

      // Aperture lens glint (antireflective coated glass)
      const lensGeom = new THREE.CircleGeometry(0.07, 12);
      const lensMat = new THREE.MeshBasicMaterial({ color: 0xe9e6dc });
      const lens = new THREE.Mesh(lensGeom, lensMat);
      lens.position.set(0, radialY + 0.25, 0.68);
      shipGroup.add(lens);
    }

    // Center ship vertically
    shipGroup.position.y = -currentY / 2;

    // KSP Indicators (Center of Mass, Center of Thrust, Center of Lift)
    if (showCoM) {
      // Yellow/Black checkered Center of Mass sphere
      const comGroup = new THREE.Group();
      const comGeom = new THREE.SphereGeometry(0.16, 16, 16);
      const comMat = new THREE.MeshBasicMaterial({ color: 0xf0562b, wireframe: true });
      const comSphere = new THREE.Mesh(comGeom, comMat);
      comGroup.add(comSphere);

      const comCoreGeom = new THREE.SphereGeometry(0.08, 8, 8);
      const comCore = new THREE.Mesh(comCoreGeom, new THREE.MeshBasicMaterial({ color: 0x0a0c10 }));
      comGroup.add(comCore);

      // Estimated center of mass: weighted towards heavy tanks and engine
      comGroup.position.set(0, currentY * 0.42, 0);
      shipGroup.add(comGroup);
    }

    if (showCoT) {
      // Magenta/Cyan Center of Thrust vector arrow pointing directly up from engine bell
      const cotArrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.1, 0),
        0.9,
        0xd90429,
        0.25,
        0.18
      );
      shipGroup.add(cotArrow);
    }

    if (showCoL) {
      // Cyan Center of Lift / Aerodynamic ring around capsule
      const colGeom = new THREE.TorusGeometry(0.48, 0.02, 8, 24);
      colGeom.rotateX(Math.PI / 2);
      const colMesh = new THREE.Mesh(colGeom, new THREE.MeshBasicMaterial({ color: 0xe9e6dc }));
      colMesh.position.set(0, currentY - 0.45, 0);
      shipGroup.add(colMesh);
    }

    // VAB Floor Grid and Launch Clamps when in Hangar
    if (!cruiseMode) {
      const grid = new THREE.GridHelper(12, 24, 0xf0562b, 0x2e2820);
      grid.position.y = -currentY / 2;
      scene.add(grid);

      // KSP Launch Gantry Clamps with matte finish
      const clampMat = new THREE.MeshStandardMaterial({ color: 0x301814, roughness: 0.95, metalness: 0.0 });
      for (let c = 0; c < 2; c++) {
        const sign = c === 0 ? 1 : -1;
        const colGeom = new THREE.BoxGeometry(0.12, 1.8, 0.12);
        const col = new THREE.Mesh(colGeom, darkMetal);
        col.position.set(sign * 1.3, -currentY / 2 + 0.9, 0);
        scene.add(col);

        const armGeom = new THREE.BoxGeometry(0.65, 0.08, 0.08);
        const arm = new THREE.Mesh(armGeom, clampMat);
        arm.position.set(sign * 0.9, -currentY / 2 + 0.45, 0);
        arm.rotation.z = sign * -0.2;
        scene.add(arm);
      }
    }

    // Starfield for cruise mode
    let stars: THREE.Points | null = null;
    let starPositions: Float32Array | null = null;
    if (cruiseMode) {
      const starCount = 300;
      const starGeom = new THREE.BufferGeometry();
      starPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 30;
        starPositions[i + 1] = (Math.random() - 0.5) * 20;
        starPositions[i + 2] = (Math.random() - 0.5) * 40;
      }
      starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const starMat = new THREE.PointsMaterial({ color: 0xe9e6dc, size: 0.12, transparent: true, opacity: 0.8 });
      stars = new THREE.Points(starGeom, starMat);
      scene.add(stars);
    }

    // Mouse orbit interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = cruiseMode ? -0.4 : 0.6;
    let targetRotationX = 0.1;

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;
      targetRotationX = Math.max(-0.6, Math.min(0.6, targetRotationX));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    if (interactive) {
      container.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    // Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const isReducedMotion =
        typeof document !== 'undefined' &&
        (document.documentElement.getAttribute('data-reduced-motion') === 'true' ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches);

      if (!isReducedMotion) {
        // Calm camera drift: meditative, slow cosmic orbit around the vessel
        const driftTime = elapsed * 0.08;
        const baseRadius = cruiseMode ? 7.2 : 6.4;
        const driftCamX = Math.sin(driftTime) * (baseRadius * 0.35) + 3.2;
        const driftCamY = (cruiseMode ? 2.2 : 1.8) + Math.sin(driftTime * 0.7) * 0.25;
        const driftCamZ = Math.cos(driftTime) * (baseRadius * 0.35) + 5.6;

        if (!isDragging) {
          camera.position.set(driftCamX, driftCamY, driftCamZ);
          camera.lookAt(0, 0.35, 0);

          // Very gentle attitude stabilization drift on ship
          targetRotationY = Math.sin(driftTime * 0.5) * 0.12 + (cruiseMode ? -0.2 : 0.4);
          targetRotationX = Math.cos(driftTime * 0.4) * 0.04;
        }
      } else if (!isDragging) {
        camera.position.set(cruiseMode ? 4 : 3.5, cruiseMode ? 2.5 : 2, cruiseMode ? 7 : 6.5);
        camera.lookAt(0, 0.35, 0);
      }

      shipGroup.rotation.y += (targetRotationY - shipGroup.rotation.y) * 0.05;
      shipGroup.rotation.x += (targetRotationX - shipGroup.rotation.x) * 0.05;

      if (plumeMesh) {
        plumeMesh.scale.y = isReducedMotion ? 1 : 1 + Math.sin(elapsed * 25) * 0.15;
      }

      if (stars && starPositions && !isReducedMotion) {
        const positions = stars.geometry.attributes.position.array as Float32Array;
        for (let i = 2; i < positions.length; i += 3) {
          positions[i] += delta * 15;
          if (positions[i] > 15) {
            positions[i] = -25;
          }
        }
        stars.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 400;
      const newH = container.clientHeight || 300;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        container.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [design, cruiseMode, interactive, showCoL, showCoM, showCoT]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Click and drag to orbit view"
    />
  );
}
