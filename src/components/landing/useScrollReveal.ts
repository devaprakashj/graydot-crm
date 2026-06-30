import { useEffect } from 'react';

/**
 * Shared hook — attaches an IntersectionObserver to elements matching `selector`
 * and adds the `gd-revealed` class when they enter the viewport.
 */
export function useScrollReveal(selector: string, threshold = 0.12) {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (!elements.length) return;

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('gd-revealed');
          }
        });
      },
      { threshold }
    );

    elements.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [selector, threshold]);
}
