import { Component, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useAppearance from '../hooks/useAppearance';

export function RecoveryScreen({ onReload = () => window.location.reload() }) {
  const { t } = useTranslation();
  const { theme } = useAppearance();
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return (
    <div className={`portfolio theme-${theme}`}>
      <main className="section-shell" aria-labelledby="recovery-heading">
        <h1 id="recovery-heading" ref={heading} tabIndex={-1}>{t('portfolio.recoveryTitle')}</h1>
        <p role="alert">{t('portfolio.recoveryText')}</p>
        <button className="recovery-button" type="button" onClick={onReload}>{t('portfolio.recoveryAction')}</button>
      </main>
    </div>
  );
}

export class AppRecovery extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <RecoveryScreen /> : this.props.children; }
}
