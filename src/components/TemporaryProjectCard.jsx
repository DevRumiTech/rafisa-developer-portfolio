import { temporaryProject } from '../data/projectSelection';
import { projectCopy } from '../data/projectCopy';

export function ProjectPlaceholderVisual({ more = false }) {
  // TODO: Replace this temporary illustration with the completed project's own screenshot
  // in projects.js. It is decorative sample artwork, never evidence of a completed app.
  return <div className="ml-showcase-visual ml-project-fallback" aria-hidden="true">
    <svg viewBox="0 0 320 200" focusable="false">
      <rect x="35" y="25" width="250" height="150" rx="12" />
      <path d="M35 55h250M55 40h4m10 0h4m10 0h4" />
      {more ? <path d="M160 80v70m-35-35h70" /> : <path d="m125 85-30 30 30 30m70-60 30 30-30 30m-25-65-20 70" />}
    </svg>
  </div>;
}

export default function TemporaryProjectCard({ number, language }) {
  const copy = projectCopy[language];
  return <article className="ml-showcase-card ml-placeholder" data-animate>
    <div className="ml-card-content">
      <ProjectPlaceholderVisual />
      <div className="ml-showcase-project-meta">
        <h3>{copy.project} {number}</h3><span className="ml-coming-soon">{copy.comingSoon}</span>
        <p>{temporaryProject.summary[language]}</p>
        <ul className="ml-project-stack" aria-label={copy.sampleStack}>{temporaryProject.stack.map(item => <li key={item}>{item} · {copy.sample}</li>)}</ul>
      </div>
    </div>
    {/* No anchors: github/demo are intentionally empty until a real catalog entry replaces this card. */}
  </article>;
}
