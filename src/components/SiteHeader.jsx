import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppearanceControls from "./AppearanceControls";
import useAppearance from "../hooks/useAppearance";
import LanguageToggle from "./LanguageToggle";
import { subscribeMedia } from "../utils/mediaQuery";
import useCompactNavigation from "../hooks/useCompactNavigation";

export default function SiteHeader() {
  const { pathname, hash } = useLocation();
  const compact = useCompactNavigation();
  return <HeaderContent key={`${pathname}:${hash}`} pathname={pathname} hash={hash} compact={compact} />;
}

function HeaderContent({ pathname, hash, compact }) {
  const { t, i18n } = useTranslation();
  const fr = i18n.resolvedLanguage === "fr";
  const { theme, setTheme } = useAppearance();
  const [open, setOpen] = useState(false);
  const button = useRef(null);
  const navigation = useRef(null);
  useEffect(() => {
    if (!window.matchMedia) return;
    return subscribeMedia(window.matchMedia('(max-width: 600px)'), () => setOpen(false));
  }, []);
  useLayoutEffect(() => {
    // Keep a keyboard user out of controls that just became hidden at a breakpoint.
    if (compact && !open && navigation.current?.contains(document.activeElement)) button.current?.focus();
    if (!compact && document.activeElement === button.current) navigation.current?.querySelector('a')?.focus();
  }, [compact, open]);

  return (
    <header className="site-header shared-header" onKeyDown={(event) => {
      if (event.key === 'Escape' && compact && open) {
        setOpen(false);
        button.current?.focus();
      }
    }}>
      <Link className="wordmark" to="/#intro" aria-label={fr ? "ML Michael Leigh, revenir à l’introduction" : "ML Michael Leigh, return to introduction"}>ML</Link>
      <button className="menu-toggle" ref={button} type="button" hidden={!compact}
        aria-controls="primary-navigation" aria-expanded={open}
        onClick={() => setOpen(!open)}>{t(open ? 'portfolio.closeMenu' : 'portfolio.openMenu')}</button>
      <nav ref={navigation} id="primary-navigation" aria-label={t('portfolio.navigation')} hidden={compact && !open}>
        {[["top", t("portfolio.home")], ["about", fr ? "À propos de moi" : "About Me"], ["work", t("nav.work")], ["education", fr ? "Expérience et qualifications" : "Experience & Qualifications"], ["cv", "CV"], ["contact", t("nav.contact")]].map(([section, label]) => (
          <Link key={section} aria-current={(pathname === "/" && (hash === `#${section}` || (!hash && section === "top"))) || (pathname.startsWith("/projects") && section === "work") ? "location" : undefined} to={`/#${section}`} onClick={() => setOpen(false)}>{section === "top" && fr ? "Accueil" : label}</Link>
        ))}
      </nav>
      <div className="header-tools">
        <Link className="ml-return-intro" to="/#intro" title={fr ? "Quitter le portfolio" : "Leave portfolio"}>{fr ? "Retour à l’introduction" : "Back to Intro"}</Link>
        <LanguageToggle />
        <AppearanceControls theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
}
