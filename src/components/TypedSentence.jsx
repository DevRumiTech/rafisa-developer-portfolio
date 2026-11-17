import { useEffect, useState } from 'react';
import { subscribeMedia } from '../utils/mediaQuery';

// Animate once. Assistive technology receives the complete sentence immediately.
export default function TypedSentence({ sentence, finishLabel }) {
  const [count, setCount] = useState(0);
  const [finished, setFinished] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  const [reduced, setReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  useEffect(() => {
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!preference) return;
    return subscribeMedia(preference, () => {
      setReduced(preference.matches);
      if (preference.matches) setFinished(true);
    });
  }, []);
  const complete = reduced || finished || count >= sentence.length;
  useEffect(() => {
    if (complete) return;
    const timer = window.setTimeout(() => setCount(value => value + 1), 25);
    return () => window.clearTimeout(timer);
  }, [complete, count]);
  return <div className="typed-intro">
    <p className="ml-final-typed">
      <span className="sr-only">{sentence}</span>
      <span className="typed-visual" aria-hidden="true"><span className="typed-reserve">{sentence}</span><span className="typed-text">{complete ? sentence : sentence.slice(0, count)}{!complete && <span className="typed-caret">▏</span>}</span></span>
    </p>
    <button type="button" className="finish-typing" aria-disabled={complete} tabIndex={complete ? -1 : 0} onClick={() => setFinished(true)}>{finishLabel}</button>
  </div>;
}
