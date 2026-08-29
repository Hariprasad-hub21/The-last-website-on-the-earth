import { useState, useEffect } from 'react';

export interface MovementKeys {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  shift: boolean;
  space: boolean;
  interact: boolean;
}

export function useKeyboardControls(
  onInteract?: () => void,
  onTogglePresentation?: () => void,
  onToggleRotateView?: () => void
) {
  const [movement, setMovement] = useState<MovementKeys>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
    space: false,
    interact: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input / textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Shift + P: Presentation Mode
      if (e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        onTogglePresentation?.();
        return;
      }

      // Key R: Toggle Interactive 3D Rotate View
      if (!e.shiftKey && !e.ctrlKey && !e.metaKey && (e.key === 'r' || e.key === 'R')) {
        onToggleRotateView?.();
        return;
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovement((m) => ({ ...m, forward: true }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMovement((m) => ({ ...m, backward: true }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMovement((m) => ({ ...m, left: true }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMovement((m) => ({ ...m, right: true }));
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          setMovement((m) => ({ ...m, shift: true }));
          break;
        case 'Space':
          setMovement((m) => ({ ...m, space: true }));
          break;
        case 'KeyE':
          setMovement((m) => ({ ...m, interact: true }));
          onInteract?.();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovement((m) => ({ ...m, forward: false }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMovement((m) => ({ ...m, backward: false }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMovement((m) => ({ ...m, left: false }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMovement((m) => ({ ...m, right: false }));
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          setMovement((m) => ({ ...m, shift: false }));
          break;
        case 'Space':
          setMovement((m) => ({ ...m, space: false }));
          break;
        case 'KeyE':
          setMovement((m) => ({ ...m, interact: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onInteract, onTogglePresentation, onToggleRotateView]);

  return movement;
}
