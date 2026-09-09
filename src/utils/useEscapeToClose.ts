import { useEffect } from 'react';

/**
 * Cierra un modal al apretar Escape. Es un comportamiento de teclado de
 * escritorio/web: `window` no existe en el runtime nativo de Expo Go, así que
 * ahí este hook simplemente no hace nada (no hay Escape en un celular).
 */
export function useEscapeToClose(isOpen: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
}
