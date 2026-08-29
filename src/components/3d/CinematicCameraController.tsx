import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { StageId, StageInfo } from '../../types';
import { MovementKeys } from '../../hooks/useKeyboardControls';

interface CameraControllerProps {
  currentStage: StageInfo;
  movement: MovementKeys;
  isGuidedTour: boolean;
  presentationShot: number | null;
  reducedMotion: boolean;
  onPlayerMoved?: (pos: [number, number, number]) => void;
}

export const CinematicCameraController: React.FC<CameraControllerProps> = ({
  currentStage,
  movement,
  isGuidedTour,
  presentationShot,
  reducedMotion,
  onPlayerMoved,
}) => {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(...currentStage.cameraPose.position));
  const currentLookAt = useRef(new THREE.Vector3(...currentStage.cameraPose.target));
  const manualOffset = useRef(new THREE.Vector3(0, 0, 0));

  // Reset manual offset when stage changes
  useEffect(() => {
    manualOffset.current.set(0, 0, 0);
  }, [currentStage.id]);

  useFrame((state, delta) => {
    // Determine target position based on presentation presets or stage camera pose
    let targetPos = new THREE.Vector3(...currentStage.cameraPose.position);
    let targetLook = new THREE.Vector3(...currentStage.cameraPose.target);

    if (presentationShot !== null) {
      switch (presentationShot) {
        case 1: // Shot 1: The Vault
          targetPos.set(0, 3, 16);
          targetLook.set(0, 2, 0);
          break;
        case 2: // Shot 2: Archive Relics
          targetPos.set(-16, 5, 4);
          targetLook.set(-16, 2, -10);
          break;
        case 3: // Shot 3: Lost City Skyline
          targetPos.set(0, 14, -30);
          targetLook.set(0, 22, -120);
          break;
        case 4: // Shot 4: Dream Void
          targetPos.set(20, 8, -12);
          targetLook.set(20, 6, -38);
          break;
        case 5: // Shot 5: NEXUS AI Core
          targetPos.set(0, 7, -64);
          targetLook.set(0, 7.5, -85);
          break;
      }
    } else if (!isGuidedTour) {
      // Apply WASD exploration offset with damping
      const speed = (movement.shift ? 14 : 7) * delta;
      if (movement.forward) manualOffset.current.z -= speed;
      if (movement.backward) manualOffset.current.z += speed;
      if (movement.left) manualOffset.current.x -= speed;
      if (movement.right) manualOffset.current.x += speed;

      // Restrict movement boundary to prevent falling out of world
      manualOffset.current.x = THREE.MathUtils.clamp(manualOffset.current.x, -25, 25);
      manualOffset.current.z = THREE.MathUtils.clamp(manualOffset.current.z, -30, 20);

      targetPos.add(manualOffset.current);
      targetLook.add(manualOffset.current);
    }

    // Smooth lerp damping
    const lerpFactor = reducedMotion ? 0.9 : Math.min(1, delta * 2.8);
    currentPos.current.lerp(targetPos, lerpFactor);
    currentLookAt.current.lerp(targetLook, lerpFactor);

    // Subtle gentle cinematic breathing / float
    if (!reducedMotion && presentationShot === null) {
      const floatY = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
      camera.position.set(
        currentPos.current.x,
        currentPos.current.y + floatY,
        currentPos.current.z
      );
    } else {
      camera.position.copy(currentPos.current);
    }

    camera.lookAt(currentLookAt.current);

    onPlayerMoved?.([camera.position.x, camera.position.y, camera.position.z]);
  });

  return null;
};
