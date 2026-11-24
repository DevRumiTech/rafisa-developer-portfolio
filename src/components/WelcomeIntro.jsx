import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import AppearanceControls from './AppearanceControls';

const introCopy = {
  en: { description: 'From ideas to applications.', detail: 'Discover what I build and how I work.', inside: 'Inside my portfolio', items: ['Development projects', 'Technical skills', 'Experience & Qualifications'], loading: 'Opening portfolio…' },
  fr: { description: 'Des idées aux applications.', detail: 'Découvrez mes réalisations et ma façon de travailler.', inside: 'Dans mon portfolio', items: ['Projets de développement', 'Compétences techniques', 'Expérience et qualifications'], loading: 'Ouverture du portfolio…' },
};
const colors = ['#3776AB', '#F05032', '#F4C430'];

export default function WelcomeIntro({ language, copy, theme, setTheme, onEnter }) {
  const [year] = useState(() => new Date().getFullYear());
  const content = introCopy[language];
  const [phase, setPhase] = useState('ready');
  const timers = useRef([]);
  const busy = useRef(false);
  useEffect(() => () => timers.current.forEach(id => window.clearTimeout(id)), []);

  function startEntry() {
    if (busy.current) return;
    busy.current = true;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      onEnter();
      return;
    }
    setPhase('orbit');
    timers.current.push(window.setTimeout(() => setPhase('transition'), 2400));
    timers.current.push(window.setTimeout(onEnter, 3200));
  }

  return <div className={`portfolio theme-${theme} ml-showcase ml-showcase-${theme} ml-welcome ml-intro-phase-${phase}`}>
    <div className="ml-welcome-top"><span className="wordmark">ML</span><div className="header-tools"><LanguageToggle /><AppearanceControls theme={theme} setTheme={setTheme} /></div></div>
    <main id="intro" tabIndex={-1} className="ml-welcome-content">
      <div className="ml-intro-grid" aria-hidden={phase === 'transition' ? true : undefined} inert={phase === 'transition' ? true : undefined}>
        <div className="ml-intro-text">
          <p className="ml-welcome-label ml-intro-reveal">{copy.welcome}</p>
          <h1 className="ml-intro-reveal ml-intro-delay-1">Michael Leigh</h1>
          <p className="ml-role ml-intro-reveal ml-intro-delay-2">{copy.role}</p>
          <p className="ml-welcome-intro ml-intro-reveal ml-intro-delay-3">{content.description}<br />{content.detail}</p>
          <button type="button" className="ml-enter ml-intro-reveal ml-intro-delay-4" onClick={startEntry} aria-disabled={phase !== 'ready'}>{copy.enter}<ArrowRight className="ml-arrow" aria-hidden="true" /></button>
        </div>
        <div className="ml-intro-frame ml-intro-reveal ml-intro-delay-4">
          <svg className="ml-intro-orbit" aria-hidden="true" fill="none">
            {colors.map((color, index) => <rect key={color} pathLength="100" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray="24 76" style={{ '--orbit-offset': `${-index * 100 / 3}px`, '--orbit-end': `${-index * 100 / 3 - 100}px` }} />)}
          </svg>
          <div className="ml-intro-card">
            <h2>{content.inside}</h2>
            <ol>{content.items.map((item, index) => <li key={item}><span className={`ml-intro-number ml-intro-number-${index + 1}`} aria-hidden="true">0{index + 1}</span><span>{item}</span></li>)}</ol>
          </div>
        </div>
      </div>
      {phase === 'transition' && <div className="ml-intro-loading" aria-hidden="true"><span className="wordmark">ML</span><p>{content.loading}</p><div className="ml-intro-progress"><span /><span /><span /></div></div>}
      <span className="ml-intro-status" role="status">{phase !== 'ready' ? content.loading : ''}</span>
    </main>
    <div className="ml-intro-footer"><p className="ml-welcome-location">{copy.location}</p><span>© {year} Michael Leigh</span></div>
  </div>;
}
