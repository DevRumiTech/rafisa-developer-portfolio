import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Mail, ArrowRight } from 'lucide-react';
import CopyEmail from './CopyEmail';
import { useTranslation } from 'react-i18next';

export default function SocialLinks({ email = false }) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage === 'fr' ? 'fr' : 'en';
  const fr = language === 'fr';
  const links = [
    { name: 'GitHub', key: 'github', href: 'https://github.com/DevRumiTech', Icon: FaGithub, description: fr ? 'Consulter mes projets et leur code source.' : 'View my projects and source code.' },
    { name: 'LinkedIn', key: 'linkedin', href: 'https://www.linkedin.com/in/michael-leigh-0b73221ab/', Icon: FaLinkedin, description: fr ? 'Consulter mon profil professionnel.' : 'View my professional profile.' },
  ];
  if (!email) return <div className="ml-social-links">{links.map(({name, key, href, Icon}) => <a key={key} className={`ml-social-${key}`} href={href} target="_blank" rel="noopener noreferrer"><Icon aria-hidden="true" /><span>{name}<span className="sr-only"> ({t('portfolio.newTab')})</span></span></a>)}</div>;
  return <div className="ml-contact-cards">
    <div className="ml-contact-card ml-contact-email">
      <a className="ml-contact-card-link" href="mailto:rumi6864@gmail.com"><span className="ml-contact-icon"><Mail aria-hidden="true" /></span><span className="ml-contact-card-copy"><strong>{fr ? 'E-mail' : 'Email'}</strong><span className="ml-email-address">rumi6864@gmail.com</span><span className="ml-contact-description">{fr ? 'Demandes de recrutement' : 'Recruitment enquiries'}</span></span></a>
      <CopyEmail language={language} />
    </div>
    {links.map(({name, key, href, Icon, description}) => <a key={key} className={`ml-contact-card ml-contact-${key}`} href={href} target="_blank" rel="noopener noreferrer"><span className="ml-contact-icon"><Icon aria-hidden="true" /></span><span className="ml-contact-card-copy"><strong>{name}<span className="sr-only"> ({t('portfolio.newTab')})</span></strong><span className="ml-contact-description">{description}</span></span><ArrowRight className="ml-arrow" aria-hidden="true" /></a>)}
  </div>;
}
