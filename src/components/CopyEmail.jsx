import { useState } from 'react';
import { Copy } from 'lucide-react';
import { projectCopy } from '../data/projectCopy';

export default function CopyEmail({ language }) {
  const [status, setStatus] = useState('');
  const copy = projectCopy[language];
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('rumi6864@gmail.com');
      setStatus('copied');
    } catch {
      // Clipboard access can be denied; keep the visible address and mailto usable.
      setStatus('failed');
    }
  }
  return <div className="ml-copy-email"><button type="button" onClick={copyEmail} aria-label={copy.copy} title={copy.copy}><Copy size={18} aria-hidden="true" /></button><span role="status">{status ? copy[status] : ''}</span></div>;
}
