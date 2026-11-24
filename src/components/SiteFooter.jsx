import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SocialLinks from './SocialLinks';

export default function SiteFooter() {
  const [year] = useState(() => new Date().getFullYear());
  const { t, i18n } = useTranslation();
  return <footer className="ml-site-footer ml-showcase-footer">
    <span>© {year} Michael Leigh</span>
    <div className="ml-footer-links"><Link to="/#about">{i18n.resolvedLanguage === 'fr' ? 'À propos de moi' : 'About Me'}</Link><Link to="/#contact">{t('nav.contact')}</Link><SocialLinks /></div>
  </footer>;
}
