import { useEffect } from 'react';

/**
 * Dev-only design grid. The visible controller pill and audit HUD have been
 * removed for production UX. The grid can still be toggled with the "G" key
 * for internal design reviews.
 */
export default function GridOverlay() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        !!activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable);
      if (isInput) return;
      if ((e.key === 'g' || e.key === 'G') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        document.body.classList.toggle('grid-on');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
}
