import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { subscribeMedia } from "../utils/mediaQuery";

// Animate only page changes, never language/theme updates or section navigation.
export default function PageMotion() {
  const { pathname } = useLocation();
  useEffect(() => {
    const main = document.querySelector('main');
    if (!window.matchMedia || !main?.animate) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animation;
    if (!preference.matches) {
      try { animation = main.animate(
        [{ opacity: 0.85, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 180, easing: 'ease-out' },
      ); } catch { /* Motion is optional; keep navigation and content available. */ }
    }
    const stop = () => { if (preference.matches) animation?.cancel(); };
    const unsubscribe = subscribeMedia(preference, stop);
    return () => {
      animation?.cancel();
      unsubscribe();
    };
  }, [pathname]);
  return null;
}
