import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hand, Guitar, Gamepad2 } from 'lucide-react';
import { professional } from '../data/professional';
import { homeCopy } from '../data/homeCopy';
import { selectProjects } from '../data/projectSelection';
import TemporaryProjectCard, { ProjectPlaceholderVisual } from '../components/TemporaryProjectCard';
import ProjectCard from '../components/ProjectCard';
import CopyEmail from '../components/CopyEmail';
import { projectCopy } from '../data/projectCopy';
import { cvDocuments } from '../data/cv';
import useAppearance from '../hooks/useAppearance';
import useEntranceMotion from '../hooks/useEntranceMotion';
import SiteHeader from '../components/SiteHeader';
import TechnologyLogo from '../components/TechnologyLogo';
import EducationLogo from '../components/EducationLogo';
import CvDownload from '../components/CvDownload';
import TypedSentence from '../components/TypedSentence';
import '../styles/portfolio.css';
import '../styles/home.css';

export default function Home() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage === 'fr' ? 'fr' : 'en';
  const c = homeCopy[language];
  const pc = projectCopy[language];
  const { featured } = selectProjects();
  const [year] = useState(() => new Date().getFullYear());
  const details = professional[language];
  const { theme } = useAppearance();
  const page = useRef(null);
  useEntranceMotion(page);
  return <div ref={page} className={`portfolio theme-${theme} ml-showcase ml-showcase-${theme}`}>
    <Link className="skip-link" to="#top">{t('portfolio.skip')}</Link>
    <SiteHeader />
    <main id="top" tabIndex={-1}>
      <section id="about" className="ml-showcase-hero" aria-labelledby="home-title">
        <div className="ml-showcase-hero-head"><span>MICHAEL LEIGH / PORTFOLIO</span><span>VAUD, CH / {year}</span></div>
        <div className="ml-showcase-heading-layout">
          <h1 id="home-title"><span className="ml-head-first">Michael</span><span className="ml-head-color">Leigh.</span><span className="ml-head-third">{c.role}</span></h1>
          <figure className="ml-showcase-portrait">
            <img
              src="/images/portfolio-headshot-transparent.webp"
              alt="Michael Leigh"
              width="960"
              height="960"
              loading="eager"
              decoding="async"
            />
          </figure>
        </div>
        <div className="ml-showcase-hero-bottom">
          <div className="ml-introduction">
            <TypedSentence key={language} sentence={c.introduction} finishLabel={c.finishTyping} />
            <p className="ml-background">{c.background}</p>
            <p className="ml-showcase-location">{c.location}</p>
          </div>
        </div>
      </section>
      <section className="ml-showcase-details" id="skills" aria-labelledby="skills-title">
        <span className="ml-showcase-kicker">01 / {t('nav.skills')}</span>
        <h2 id="skills-title" data-animate>{details.skillsTitle}</h2>
        <div className="ml-showcase-skills">
          {details.skills.map(group => <div className="ml-showcase-skill-group" data-animate key={group.category}>
            <h3>{group.category}</h3><ul>{group.items.map(item => <li key={item}><TechnologyLogo name={item} /><span>{item}</span></li>)}</ul>
          </div>)}
        </div>
        <div className="ml-showcase-soft-skills"><h3>{details.softSkillsTitle}</h3><p>{details.softSkills.join(' · ')}</p></div>
      </section>
      <section className="ml-showcase-work" id="work" aria-labelledby="work-title">
        <span className="ml-showcase-kicker">02 / {t('nav.work')}</span><h2 id="work-title" data-animate>{c.projects}</h2>
        <div className="ml-showcase-project-grid">
          {/* Only completed catalog entries get routes. Empty slots are temporary UI,
              automatically replaced in catalog order; the fourth card always opens the archive. */}
          {Array.from({ length: 3 }, (_, index) => featured[index]
            ? <ProjectCard key={featured[index].slug} project={featured[index]} language={language} />
            : <TemporaryProjectCard key={`placeholder-${index}`} number={index + 1} language={language} />)}
          <article className="ml-showcase-card" data-animate>
            <Link className="ml-more-projects ml-card-content" to="/projects">
              <ProjectPlaceholderVisual more />
              <div className="ml-showcase-project-meta"><h3>{pc.more}</h3><p>{pc.browse}</p></div>
            </Link>
          </article>
        </div>
      </section>
      <section className="ml-showcase-experience" id="experience" aria-labelledby="experience-title">
        <span className="ml-showcase-kicker">03 / {c.experience}</span><h2 id="experience-title" data-animate>{c.experience}</h2>
        <div className="ml-jobs">{['rafisa', 'gaea'].map(employer => <article className="ml-showcase-job" data-animate key={employer}>
          <img src={`/logos/${employer === 'gaea' ? 'gaea21' : employer}.png`} alt="" width="78" height="58" loading="lazy" decoding="async" />
          <div><span className="ml-showcase-kicker">{t(`portfolio.${employer === 'rafisa' ? 'current' : 'previous'}`)}</span><h3>{employer === 'rafisa' ? 'Rafisa' : t('portfolio.gaeaName')}</h3><p>{t(`portfolio.${employer}Role`)}</p><p>{t(`portfolio.${employer}Location`)}</p><p className="employment-dates">{t(`portfolio.${employer}Dates`)}</p></div>
        </article>)}</div>
      </section>
      <section className="ml-showcase-education" id="education" aria-labelledby="education-title">
        <span className="ml-showcase-kicker">04 / {t('nav.education')}</span><h2 id="education-title" data-animate>{details.educationTitle}</h2>
        {details.education.map(item => <article className="ml-showcase-education-row" data-animate key={item.title}>
          <span className="ml-showcase-education-period">{item.period}</span><EducationLogo title={item.title} institution={item.institution} /><div><h3>{item.title}</h3><p>{item.institution}</p><p>{item.location}</p></div>
        </article>)}
      </section>
      <section className="ml-showcase-hobbies" id="hobbies" aria-labelledby="hobbies-title">
        <span className="ml-showcase-kicker">05 / {c.hobbies}</span><h2 id="hobbies-title" data-animate>{c.hobbies}</h2>
        <ul>{[[Hand, c.karate], [Guitar, c.guitar], [Gamepad2, c.games]].map(([Icon, label]) => <li key={label}><span className="ml-showcase-hobby-icon" aria-hidden="true"><Icon /></span>{label}</li>)}</ul>
      </section>
      <section className="ml-showcase-contact" id="contact" aria-labelledby="contact-title">
        <span className="ml-showcase-kicker">06 / {c.contact}</span><h2 id="contact-title" data-animate>{c.contact}</h2><p>{c.contactTagline}</p>
        <div className="ml-contact-links">
          <a href="mailto:rumi6864@gmail.com">{c.email}<span>: rumi6864@gmail.com</span></a>
          <a href="https://github.com/DevRumiTech" target="_blank" rel="noopener noreferrer">GitHub<span className="sr-only"> ({t('portfolio.newTab')})</span></a>
          <a href="https://www.linkedin.com/in/michael-leigh-0b73221ab/" target="_blank" rel="noopener noreferrer">LinkedIn<span className="sr-only"> ({t('portfolio.newTab')})</span></a>
          <CvDownload documents={cvDocuments} language={language} copy={c} />
        </div>
        <CopyEmail language={language} />
      </section>
    </main>
    <footer className="ml-showcase-footer"><span>© {year} MICHAEL LEIGH</span><Link to="#top">{t('portfolio.back')} ↑</Link></footer>
  </div>;
}
