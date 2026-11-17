import { useEffect } from 'react';
import { subscribeMedia } from '../utils/mediaQuery';

export default function useEntranceMotion(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const items = [...root.querySelectorAll('[data-animate]')];
    let observer;
    const reveal = () => {
      observer?.disconnect();
      items.forEach(item => item.classList.remove('ml-animate-ready'));
    };
    const setup = () => {
      reveal();
      if (media.matches) return;
      try {
        observer = new IntersectionObserver(entries => {
          for (const entry of entries) if (entry.isIntersecting) {
            entry.target.classList.remove('ml-animate-ready');
            observer.unobserve(entry.target);
          }
        }, { threshold: 0.08 });
        for (const item of items) if (item.getBoundingClientRect().top >= window.innerHeight) {
          observer.observe(item);
          item.classList.add('ml-animate-ready');
        }
      } catch { reveal(); }
    };
    const focus = event => event.target.closest('[data-animate]')?.classList.remove('ml-animate-ready');
    setup();
    root.addEventListener('focusin', focus);
    const unsubscribe = subscribeMedia(media, setup);
    return () => { reveal(); unsubscribe(); root.removeEventListener('focusin', focus); };
  }, [ref]);
}
