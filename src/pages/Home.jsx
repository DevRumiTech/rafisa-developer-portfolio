import { useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hand, Guitar, Gamepad2, GraduationCap, FileText, ArrowRight, ArrowLeft, Download, Laptop, MapPin } from 'lucide-react';
import { professional } from '../data/professional';
import { homeCopy } from '../data/homeCopy';
import { selectProjects } from '../data/projectSelection';
import TemporaryProjectCard, { ProjectPlaceholderVisual } from '../components/TemporaryProjectCard';
import ProjectCard from '../components/ProjectCard';
import { projectCopy } from '../data/projectCopy';
import { cvDocuments } from '../data/cv';
import useAppearance from '../hooks/useAppearance';
import WelcomeIntro from '../components/WelcomeIntro';
import SiteHeader from '../components/SiteHeader';
import TechnologyLogo from '../components/TechnologyLogo';
import EducationLogo from '../components/EducationLogo';
import CvDownload from '../components/CvDownload';
import SiteFooter from '../components/SiteFooter';
import SocialLinks from '../components/SocialLinks';
import '../styles/portfolio.css';
import '../styles/home.css';

let enteredThisSession = false;
const welcomeKey = 'portfolio-entered';

export default function Home() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage === 'fr' ? 'fr' : 'en';
  const c = homeCopy[language];
  const pc = projectCopy[language];
  const { featured } = selectProjects();
  const details = professional[language];
  const { theme, setTheme } = useAppearance();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [welcome, setWelcome] = useState(() => {
    if (hash || enteredThisSession) return false;
    try { return window.sessionStorage.getItem(welcomeKey) !== 'true'; } catch { return true; }
  });
  const showIntro = hash === '#intro' || (welcome && !hash);
  const entered = useRef(false);
  useLayoutEffect(() => {
    if (!showIntro && entered.current) {
      entered.current = false;
      const main = document.getElementById('top');
      main?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        try { main?.animate?.([{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 400, easing: 'ease-out' }); } catch { /* Optional motion must not prevent entry. */ }
      }
    }
  }, [showIntro]);
  const enterPortfolio = () => {
    enteredThisSession = true;
    entered.current = true;
    try { window.sessionStorage.setItem(welcomeKey, 'true'); } catch { /* Keep the in-memory session fallback. */ }
    setWelcome(false);
    if (hash === '#intro') navigate('/#top');
  };
  const fr = language === 'fr';
  let section;
  try { section = decodeURIComponent(hash.slice(1)); } catch { section = ''; }
  const view = ['about', 'skills', 'education', 'experience', 'hobbies', 'contact', 'cv'].includes(section) ? section : 'home';
  const tech = ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'Python', 'Git'];
  const cv = cvDocuments[language];
  const qualification = fr ? 'Expérience et qualifications' : 'Experience & Qualifications';
  const experienceSection = (
<section className="ml-showcase-experience ml-qualification-section" id="experience" aria-labelledby="experience-title">
        <span className="ml-showcase-kicker">03 / {c.experience}</span><h2 aria-level={view === 'experience' ? 1 : 2} id="experience-title" data-animate>{c.experience}</h2>
        <div className="ml-jobs">{['rafisa', 'gaea'].map(employer => <article className="ml-showcase-job" data-animate key={employer}>
          <div className="ml-qualification-logo"><img src={`/logos/${employer === 'gaea' ? 'gaea21' : employer}.png`} alt="" width="78" height="58" loading="lazy" decoding="async" /></div>
          <div><span className="ml-showcase-kicker">{t(`portfolio.${employer === 'rafisa' ? 'current' : 'previous'}`)}</span><h3>{employer === 'rafisa' ? 'Rafisa' : t('portfolio.gaeaName')}</h3><p>{t(`portfolio.${employer}Role`)}</p><p>{t(`portfolio.${employer}Location`)}</p><p className="employment-dates">{t(`portfolio.${employer}Dates`)}</p></div>
        </article>)}</div>
      </section>
  );
  const hobbiesSection = (
<section className="ml-showcase-hobbies" id="hobbies" aria-labelledby="hobbies-title">
        <span className="ml-showcase-kicker">05 / {c.hobbies}</span><h2 aria-level={view === 'hobbies' ? 1 : 2} id="hobbies-title" data-animate>{c.hobbies}</h2>
        <ul>{[[Hand, c.karate], [Guitar, c.guitar], [Gamepad2, c.games]].map(([Icon, label]) => <li key={label}><span className="ml-showcase-hobby-icon" aria-hidden="true"><Icon /></span>{label}</li>)}</ul>
      </section>
  );
  if (showIntro) return <WelcomeIntro language={language} copy={c} theme={theme} setTheme={setTheme} onEnter={enterPortfolio} />;
  return <div className={`portfolio theme-${theme} ml-showcase ml-showcase-${theme} ml-redesign`}>
    <a className="skip-link" href="#top" onClick={event => { event.preventDefault(); document.getElementById('top')?.focus(); }}>{t('portfolio.skip')}</a>
    <SiteHeader />
    <main id="top" tabIndex={-1} className={view === 'home' ? 'ml-dashboard' : 'ml-detail-view'}>
      {view === 'home' ? <>
        <section className="ml-dashboard-hero" aria-labelledby="home-title">
          <div className="ml-dashboard-intro">
            <h1 id="home-title">Michael Leigh</h1>
            <p className="ml-role">{c.role}</p>
            <p className="ml-dashboard-description">{c.introduction}</p>
            <Link className="ml-inline-link" to="/#about">{fr ? 'À propos de moi' : 'About me'} <ArrowRight className="ml-arrow" aria-hidden="true" /></Link>
          </div>
        </section>
        <section className="ml-dashboard-tech" aria-labelledby="dashboard-tech-title">
          <div className="ml-dashboard-section-head"><h2 id="dashboard-tech-title">Technologies</h2><Link className="ml-inline-link" to="/#skills">{fr ? 'Toutes les compétences' : 'View all skills'} <ArrowRight className="ml-arrow" aria-hidden="true" /></Link></div>
          <ul>{tech.map(item => <li key={item}><TechnologyLogo name={item} /><span>{item === 'Express' ? 'Express.js' : item}</span></li>)}</ul>
        </section>
        <section id="work" className="ml-dashboard-projects" aria-labelledby="work-title">
          <div className="ml-dashboard-section-head"><h2 id="work-title">{fr ? 'Mes projets' : 'My Projects'}</h2><Link className="ml-inline-link" to="/projects">{fr ? 'Autres projets' : 'View all projects'} <ArrowRight className="ml-arrow" aria-hidden="true" /></Link></div>
          <div className="ml-showcase-project-grid">
            {Array.from({ length: 3 }, (_, index) => featured[index]
              ? <ProjectCard key={featured[index].slug} project={featured[index]} language={language} />
              : <TemporaryProjectCard key={`placeholder-${index}`} number={index + 1} language={language} />)}
            <article className="ml-showcase-card">
              <Link className="ml-more-projects ml-card-content" to="/projects">
                <ProjectPlaceholderVisual more />
                <div className="ml-showcase-project-meta"><h3>{pc.more}</h3><p>{pc.browse}</p></div>
                <span className="ml-more-arrow"><ArrowRight className="ml-arrow" aria-hidden="true" /></span>
              </Link>
            </article>
          </div>
        </section>
        <section className="ml-dashboard-shortcuts" aria-label={qualification + ' / CV'}>
          <article className="ml-shortcut"><GraduationCap size={34} aria-hidden="true" /><div><h2>{qualification}</h2><p>{fr ? 'Expérience professionnelle, formation et certifications.' : 'Professional experience, education and certifications.'}</p><Link className="ml-outline-button" to="/#education">{fr ? 'Voir les qualifications' : 'View Qualifications'} <ArrowRight className="ml-arrow" aria-hidden="true" /></Link></div></article>
          <article className="ml-shortcut"><FileText size={32} aria-hidden="true" /><div><h2>{fr ? 'Curriculum vitae' : 'Curriculum Vitae'}</h2><p>{fr ? 'Télécharger mon CV au format PDF.' : 'Download my CV as a PDF.'}</p>{cv ? <a className="ml-cv-button" href={cv.href} download={cv.filename} type="application/pdf" hrefLang={language}>{c.cv} <Download className="ml-arrow" aria-hidden="true" /></a> : <p>{c.noCv}</p>}</div></article>
        </section>
      </> : <>
        <div className="ml-detail-top"><Link className="ml-inline-link" to="/#top"><ArrowLeft className="ml-arrow" aria-hidden="true" /> {t('portfolio.home')}</Link></div>
        {view === 'about' && <>
          <section id="about" className="ml-detail-about" aria-labelledby="about-title">
            <h2 aria-level="1" id="about-title">{fr ? 'À propos de moi' : 'About Me'}</h2>
            <p>{fr ? 'Je suis développeur full-stack, basé dans le canton de Vaud en Suisse. Je m’intéresse autant aux interfaces web qu’aux API et aux bases de données.' : 'I am a full-stack developer based in Vaud, Switzerland. I enjoy working across web interfaces, APIs and databases.'}</p>
            <p>{c.background}</p>
            <p>{fr ? 'J’aime transformer des idées en applications fonctionnelles et comprendre comment les différentes parties d’un système logiciel fonctionnent ensemble.' : 'I enjoy turning ideas into working applications and understanding how different parts of a software system work together.'}</p>
            <div className="ml-detail-links"><Link className="ml-about-button ml-about-skills" to="/#skills"><Laptop size={20} aria-hidden="true" />{details.skillsTitle}<ArrowRight className="ml-arrow" aria-hidden="true" /></Link><Link className="ml-about-button ml-about-qualifications" to="/#education"><GraduationCap size={20} aria-hidden="true" />{qualification}<ArrowRight className="ml-arrow" aria-hidden="true" /></Link></div>
          </section>
          <section className="ml-about-soft"><h2>{details.softSkillsTitle}</h2><ul>{details.softSkills.map(skill => <li key={skill}>{skill}</li>)}</ul></section>
          {hobbiesSection}
        </>}
        {view === 'skills' && <>
      <section className="ml-showcase-details" id="skills" aria-labelledby="skills-title">
        <span className="ml-showcase-kicker">01 / {t('nav.skills')}</span>
        <h2 aria-level="1" id="skills-title" data-animate>{details.skillsTitle}</h2>
        <div className="ml-showcase-skills">
          {details.skills.map(group => <div className="ml-showcase-skill-group" data-animate key={group.category}>
            <h3>{group.category}</h3><ul>{group.items.map(item => <li key={item}><TechnologyLogo name={item} /><span>{item}</span></li>)}</ul>
          </div>)}
        </div>
      </section>

        </>}
        {view === 'education' && <>
      <h1 className="ml-qualification-title">{qualification}</h1>
      {experienceSection}
      <section className="ml-showcase-education ml-qualification-section" id="education" aria-labelledby="education-title">
        <span className="ml-showcase-kicker">04 / {t('nav.education')}</span><h2 id="education-title" data-animate>{details.educationTitle}</h2>
        <div className="ml-education-grid">{details.education.map(item => <article className="ml-showcase-education-row" data-animate key={item.title}>
          <div className="ml-education-card-top"><div className="ml-qualification-logo"><EducationLogo title={item.title} institution={item.institution} /></div><span className="ml-showcase-education-period">{item.period}</span></div><div><h3>{item.title}</h3><p>{item.institution}</p><p>{item.location}</p></div>
        </article>)}</div>
      </section>

        </>}
        {view === 'experience' && <>
      {experienceSection}

        </>}
        {view === 'hobbies' && <>
      {hobbiesSection}

        </>}
        {view === 'contact' && <>
      <section className="ml-showcase-contact" id="contact" aria-labelledby="contact-title">
        <span className="ml-showcase-kicker">06 / {c.contact}</span><h2 aria-level="1" id="contact-title" data-animate>{c.contact}</h2><h3 className="ml-contact-subtitle">{fr ? 'Prenons contact' : "Let’s connect"}</h3><p className="ml-page-intro">{fr ? 'Pour toute demande de recrutement ou pour discuter de postes en développement full-stack, vous pouvez me contacter par les moyens ci-dessous.' : 'For recruitment enquiries or to discuss full-stack development roles, please contact me through the channels below.'}</p>
        <SocialLinks email />
        <p className="ml-contact-location"><MapPin size={19} aria-hidden="true" />{fr ? 'Vaud, Suisse' : 'Vaud, Switzerland'}</p>
      </section>

        </>}
        {view === 'cv' && <section className="ml-showcase-contact" aria-labelledby="cv-title"><h2 aria-level="1" id="cv-title">{t('portfolio.cvTitle')}</h2><p className="ml-page-intro">{fr ? 'Téléchargez mon CV pour en savoir plus sur mon expérience professionnelle, ma formation et mes compétences techniques.' : 'Download my CV for further information about my professional experience, education and technical skills.'}</p><div className="ml-contact-links ml-cv-section"><CvDownload documents={cvDocuments} language={language} copy={c} /></div></section>}
      </>}
    </main>
    <SiteFooter />
  </div>;
}
