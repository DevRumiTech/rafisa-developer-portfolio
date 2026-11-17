import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';

// DOM interaction coverage, not a substitute for browser layout/paint tests.
test('portfolio regression suite', async (suite) => {
  const html = await readFile('index.html', 'utf8');
  // Enable HTML scripting semantics so noscript stays inert; module scripts are not executed by jsdom.
  const dom = new JSDOM(html, { url: 'http://localhost/', pretendToBeVisual: true, runScripts: 'dangerously' });
  Object.assign(globalThis, {
    window: dom.window, document: dom.window.document,
    HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true,
    localStorage: { getItem() { throw Error('storage blocked'); }, setItem() { throw Error('storage blocked'); } },
  });
  let scrolled;
  dom.window.HTMLElement.prototype.scrollIntoView = function () { scrolled = this.id; };
  dom.window.scrollTo = () => { scrolled = 'window-top'; };
  const media = new Map();
  window.matchMedia = (query) => {
    if (!media.has(query)) {
      const listeners = new Set();
      media.set(query, { matches: false, media: query,
        addEventListener: (_, listener) => listeners.add(listener),
        removeEventListener: (_, listener) => listeners.delete(listener),
        update(value) { this.matches = value; listeners.forEach(listener => listener({ matches: value })); },
      });
    }
    return media.get(query);
  };
  const animations = [];
  dom.window.HTMLElement.prototype.animate = function (frames, options) {
    const animation = { target: this, frames, options, cancelled: false, cancel() { this.cancelled = true; } };
    animations.push(animation);
    return animation;
  };
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  const { createElement, act, StrictMode } = await import('react');
  const { createRoot } = await import('react-dom/client');
  const root = createRoot(document.getElementById('root'));
  const { default: i18n } = await server.ssrLoadModule('/src/i18n.js');
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const { caseStudies } = await server.ssrLoadModule('/src/data/projects.js');
  const { homeCopy } = await server.ssrLoadModule('/src/data/homeCopy.js');
  const { professional } = await server.ssrLoadModule('/src/data/professional.js');
  const { cvDocuments } = await server.ssrLoadModule('/src/data/cv.js');
  const click = async (element) => {
    assert.ok(element, 'click target exists');
    await act(async () => element.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })));
  };
  const navigate = async (path) => act(async () => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new dom.window.PopStateEvent('popstate'));
  });
  const language = (code) => click(document.querySelector(`button[lang="${code}"]`));
  const theme = async (value) => act(async () => {
    const select = document.querySelector('select');
    select.value = value;
    select.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  });
  const meta = (name, attr = 'name') => document.querySelector(`meta[${attr}="${name}"]`)?.content;
  try {
    await act(async () => root.render(createElement(StrictMode, null, createElement(App))));
    await suite.test('blocked storage startup and initial keyboard entry', () => {
      assert.equal(i18n.language, 'en');
      assert.equal(document.activeElement, document.body);
      assert.equal(document.querySelector('a').className, 'skip-link');
    });
    await suite.test('translation key parity', () => {
      const keys = (o, prefix = '') => Object.entries(o).flatMap(([k, v]) => typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]).sort();
      assert.deepEqual(keys(i18n.getResourceBundle('en', 'translation')), keys(i18n.getResourceBundle('fr', 'translation')));
    });
    await suite.test('16 route/language/theme combinations with live effects', async () => {
      for (const selectedTheme of ['dark', 'light']) {
        await theme(selectedTheme);
        for (const path of ['/', ...caseStudies.map(p => `/projects/${p.slug}`), '/projects/missing', '/missing']) {
          await navigate(path);
          for (const code of ['fr', 'en']) {
            await language(code);
            assert.equal(document.documentElement.lang, code);
            assert.equal(document.querySelector(`button[lang="${code}"]`).getAttribute('aria-pressed'), 'true');
            assert.ok(document.querySelector(`.portfolio.theme-${selectedTheme}`), `${path} retains ${selectedTheme}`);
            assert.equal(document.documentElement.style.colorScheme, selectedTheme);
            assert.equal(document.querySelectorAll('h1').length, 1);
            assert.equal(document.querySelector('meta[name="theme-color"]').content, selectedTheme === 'dark' ? '#192630' : '#f7f9fb');
            const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
            assert.equal(new Set(ids).size, ids.length, 'IDs must be unique');
            for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
              for (const element of document.querySelectorAll(`[${attr}]`)) {
                for (const id of element.getAttribute(attr).split(/\s+/)) assert.ok(document.getElementById(id), `Missing ${attr} target ${id}`);
              }
            }
            for (const field of document.querySelectorAll('input, select, textarea')) assert.ok(field.labels.length || field.getAttribute('aria-label'));
            for (const button of document.querySelectorAll('button')) assert.ok(button.textContent.trim() || button.getAttribute('aria-label'));
            for (const nav of document.querySelectorAll('nav')) assert.ok(nav.getAttribute('aria-label') || nav.getAttribute('aria-labelledby'));
            for (const image of document.querySelectorAll('img')) assert.ok(image.hasAttribute('alt'));
            assert.equal(document.querySelectorAll('[tabindex]').length, [...document.querySelectorAll('[tabindex]')].filter(item => Number(item.getAttribute('tabindex')) <= 0).length);

            assert.equal(document.querySelector('select').value, selectedTheme);
            assert.equal(document.querySelector('.appearance-field span').textContent, code === 'fr' ? 'Apparence' : 'Appearance');
            const project = caseStudies.find(p => path === `/projects/${p.slug}`);
            assert.equal(meta('robots'), path.endsWith('missing') ? 'noindex, follow' : 'index, follow');
            assert.equal(meta('og:title', 'property'), document.title);
            assert.equal(meta('twitter:title'), document.title);
            assert.equal(meta('og:description', 'property'), meta('description'));
            assert.equal(meta('twitter:description'), meta('description'));
            assert.equal(meta('og:locale', 'property'), code === 'fr' ? 'fr_CH' : 'en_GB');
            assert.equal(document.querySelectorAll('meta[name="description"]').length, 1);
            if (project) {
              assert.equal(document.title, `${project.name} | Michael Leigh`);
              assert.equal(meta('description'), project.summary[code]);
              assert.ok(document.querySelector('.detail-heading').textContent.includes(code === 'fr' ? 'ÉTUDE DE PROJET' : 'PROJECT CASE STUDY'));
              assert.equal(document.querySelectorAll('.detail-features li').length, project.features[code].length);
              for (const feature of project.features[code]) assert.ok(document.querySelector('.detail-features').textContent.includes(feature));
              assert.equal(document.querySelectorAll('.detail-actions a').length, Number(Boolean(project.demo)) + Number(Boolean(project.github)));
              assert.equal(Boolean(document.querySelector('.detail-notice')), !project.demo);
              const facts = [...document.querySelectorAll('.project-facts dd')].map(item => item.textContent);
              assert.equal(facts[0], i18n.t(`portfolio.projects.${project.number}.category`));
              assert.equal(facts[1], i18n.t(project.demo ? 'portfolio.available' : 'portfolio.unavailable'));
              assert.equal(facts[2], i18n.t(project.github ? 'portfolio.available' : 'portfolio.unavailable'));
            }
          }
        }
      }
    });
    await suite.test('project links, adjacent navigation and first/last boundaries', async () => {
      await navigate('/');
      const rows = [...document.querySelectorAll('.ml-project-link')];
      assert.deepEqual(rows.map(a => a.getAttribute('href')), caseStudies.map(p => `/projects/${p.slug}`));
      await click(rows[0]);
      for (let index = 0; index < caseStudies.length; index++) {
        const previous = document.querySelector('.project-pagination [rel="prev"]');
        const next = document.querySelector('.project-pagination [rel="next"]');
        assert.equal(previous?.getAttribute('href'), index ? `/projects/${caseStudies[index - 1].slug}` : undefined);
        assert.equal(next?.getAttribute('href'), index < caseStudies.length - 1 ? `/projects/${caseStudies[index + 1].slug}` : undefined);
        if (next) await click(next);
      }
      await click(document.querySelector('.project-back'));
      assert.equal(window.location.hash, '#work');
      assert.equal(document.activeElement.id, 'work');
      assert.equal(scrolled, 'work');
    });
    await suite.test('repeated section activation, skip link, encoded and invalid fragments', async () => {
      const link = document.querySelector('nav a[href="/#work"]');
      link.focus();
      await click(link);
      assert.equal(document.activeElement.id, 'work');
      await click(document.querySelector('.skip-link'));
      assert.equal(document.activeElement.id, 'top');
      await navigate('/#%61bout');
      assert.equal(document.activeElement.id, 'about');
      await navigate('/#%invalid');
      assert.equal(document.activeElement.id, 'top');
      await navigate('/#does-not-exist');
      assert.equal(document.activeElement.id, 'top');
      const french = document.querySelector('button[lang="fr"]');
      french.focus();
      await click(french);
      assert.equal(document.activeElement, french, 'translation must not steal focus');
    });
    await suite.test('logo loading, local assets and safe external links', async () => {
      await navigate('/');
      for (const img of document.querySelectorAll('img')) {
        const src = img.getAttribute('src');
        const portrait = src === '/images/portfolio-headshot-transparent.webp';

        assert.equal(img.getAttribute('loading'), portrait ? 'eager' : 'lazy');
        assert.equal(img.getAttribute('decoding'), 'async');
        assert.ok(Number(img.getAttribute('width')) > 0 && Number(img.getAttribute('height')) > 0);

        const bytes = await readFile(`public${src}`);
        if (src.endsWith('.webp')) {
          assert.ok(bytes.length > 20);
          assert.equal(bytes.subarray(0, 4).toString(), 'RIFF');
          assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
        } else {
          assert.ok(src.endsWith('.png'), `Unexpected image format: ${src}`);
          assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
          assert.ok(bytes.readUInt32BE(16) > 0 && bytes.readUInt32BE(20) > 0);
        }
      }
      for (const path of ['/', ...caseStudies.map(p => `/projects/${p.slug}`)]) {
        await navigate(path);
        for (const a of document.querySelectorAll('a[target="_blank"]')) {
          assert.equal(new URL(a.href).protocol, 'https:');
          assert.ok(a.rel.includes('noopener') && a.rel.includes('noreferrer'));
          assert.ok(a.querySelector('.sr-only'));
        }
      }
      const icon = document.querySelector('link[rel="icon"]').getAttribute('href');
      await access(`public${icon}`);
      const svg = new JSDOM(await readFile(`public${icon}`, 'utf8'), { contentType: 'image/svg+xml' });
      assert.equal(svg.window.document.documentElement.tagName, 'svg');
      assert.equal(svg.window.document.querySelector('title').textContent, 'Michael Leigh');
      svg.window.close();
    });
    await suite.test('compact navigation disclosure, Escape, route close and breakpoint changes', async () => {
      await navigate('/');
      await act(async () => window.matchMedia('(max-width: 600px)').update(true));
      for (const code of ['en', 'fr']) {
        await language(code);
        let button = document.querySelector('.menu-toggle');
        const nav = document.getElementById(button.getAttribute('aria-controls'));
        assert.equal(button.hidden, false);
        assert.equal(nav.hidden, true);
        await click(button);
        assert.equal(button.getAttribute('aria-expanded'), 'true');
        assert.equal(nav.hidden, false);
        assert.equal(button.textContent, code === 'fr' ? 'Fermer le menu' : 'Close menu');
        nav.querySelector('a').focus();
        await act(async () => nav.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
        assert.equal(nav.hidden, true);
        assert.equal(document.activeElement, button);
        await click(button);
        await click(nav.querySelector('a'));
        button = document.querySelector('.menu-toggle');
        assert.equal(button.getAttribute('aria-expanded'), 'false');
        assert.equal(document.activeElement.id, 'about');
      }
      await click(document.querySelector('.menu-toggle'));
      await act(async () => window.matchMedia('(max-width: 600px)').update(false));
      assert.equal(document.querySelector('.menu-toggle').hidden, true);
      assert.equal(document.getElementById('primary-navigation').hidden, false);
      await act(async () => window.matchMedia('(max-width: 600px)').update(true));
      assert.equal(document.getElementById('primary-navigation').hidden, true);
      await act(async () => window.matchMedia('(max-width: 600px)').update(false));
    });
    await suite.test('route motion excludes preference/hash updates and respects live reduced motion', async () => {
      await navigate('/projects/wordle');
      const animation = animations.at(-1);
      assert.equal(animation.target, document.querySelector('main'));
      assert.equal(animation.options.duration, 180);
      const count = animations.length;
      await language('en');
      await theme('dark');
      await click(document.querySelector('.skip-link'));
      assert.equal(animations.length, count);
      await act(async () => window.matchMedia('(prefers-reduced-motion: reduce)').update(true));
      assert.equal(animation.cancelled, true);
      await navigate('/');
      assert.equal(animations.length, count);
      await act(async () => window.matchMedia('(prefers-reduced-motion: reduce)').update(false));
      await navigate('/projects/wordle');
      assert.equal(animations.length, count + 1);
      const animate = dom.window.HTMLElement.prototype.animate;
      delete dom.window.HTMLElement.prototype.animate;
      await navigate('/');
      assert.equal(animations.length, count + 1, 'unsupported animation API leaves content available');
      dom.window.HTMLElement.prototype.animate = animate;
    });
    await suite.test('contact is bilingual and opens email without claiming delivery', async () => {
      await navigate('/');
      for (const code of ['en', 'fr']) {
        await language(code);
        const contact = document.getElementById('contact');
        assert.equal(contact.querySelector('h2').textContent, homeCopy[code].contact);
        assert.equal(contact.querySelector(':scope > p').textContent, homeCopy[code].contactTagline);
        assert.equal(contact.querySelector('a').getAttribute('href'), 'mailto:rumi6864@gmail.com');
        assert.ok(contact.querySelector('a[href="https://github.com/DevRumiTech"]'));
        assert.equal(contact.querySelector('form'), null);
        assert.equal(contact.querySelector('[role="status"]'), null);
      }
    });
    await suite.test('project contact link targets the real contact section', async () => {
      await navigate('/projects/wordle');
      await language('fr');
      assert.ok(document.querySelector('.project-contact').textContent.includes('Discuter de ce projet'));
      await click(document.querySelector('.project-contact a'));
      assert.equal(window.location.hash, '#contact');
      assert.equal(document.activeElement.id, 'contact');
    });
    await suite.test('Wordle keeps its actual technologies, features and owner-specified source', async () => {
      assert.deepEqual(caseStudies.map(p => p.slug), ['wordle']);
      const project = caseStudies[0];
      assert.deepEqual(project.stack, ['React', 'Node.js', 'Express', 'MySQL']);
      assert.equal(project.github, 'https://github.com/DevRumiTech/wordle-project');
      assert.equal(project.demo, 'https://wordle-demo-murex.vercel.app');
      await navigate('/projects/wordle');
      assert.ok(document.querySelector('.project-screenshots'));
      assert.equal(document.querySelector('.project-pagination'), null);
      assert.equal(document.querySelectorAll('.detail-actions a')[0].href, new URL(project.demo).href);
      assert.equal(document.querySelectorAll('.detail-actions a')[1].href, project.github);
      for (const code of ['en', 'fr']) {
        await language(code);
        assert.deepEqual([...document.querySelectorAll('.detail-features li')].map(li => li.textContent), project.features[code]);
      }
    });
    await suite.test('sole homepage has the approved section order and one project', async () => {
      await navigate('/');
      assert.ok(document.querySelector('.wordmark').getAttribute('aria-label').includes(document.querySelector('.wordmark').textContent));
      assert.deepEqual([...document.querySelectorAll('main > section')].map(s => s.id),
        ['about', 'skills', 'work', 'experience', 'education', 'hobbies', 'contact']);
      assert.equal(document.querySelectorAll('.ml-showcase').length, 1);
      assert.equal(document.querySelector('.hero'), null, 'old homepage removed');
      assert.equal(document.querySelectorAll('.ml-project-link').length, 1);
      assert.equal(document.querySelector('.ml-project-link').getAttribute('href'), '/projects/wordle');
      assert.equal(document.querySelector('.ml-project-source').href, 'https://github.com/DevRumiTech/wordle-project');
      assert.equal(document.querySelector('.ml-project-demo').href, new URL(caseStudies[0].demo).href);
      assert.equal(document.querySelector('img[src*="portrait"]'), null);
      assert.equal(document.querySelector('.ml-showcase-ambient, .ml-showcase-quote-strip'), null);
      assert.equal(document.querySelector('a[href*="design-preview"]'), null);
    });
    await suite.test('project section links focus existing targets without restarting motion', async () => {
      for (const project of caseStudies) {
        await navigate(`/projects/${project.slug}`);
        const count = animations.length;
        const links = [...document.querySelectorAll('.detail-contents a')];
        assert.equal(links.length, project.screenshots?.length ? 3 : 2);
        for (const link of links) {
          await click(link);
          assert.equal(document.activeElement.id, link.hash.slice(1));
          assert.equal(animations.length, count);
        }
      }
    });
    await suite.test('retired project URLs show localized missing-project pages', async () => {
      for (const slug of ['alpine-clientflow', 'verilot', 'rumipay', 'sql-ops-dashboard']) {
        await navigate(`/projects/${slug}`);
        for (const code of ['en', 'fr']) {
          await language(code);
          assert.equal(document.querySelector('h1').textContent, `404 — ${i18n.t('portfolio.missingProject')}`);
          assert.equal(meta('robots'), 'noindex, follow');
          assert.equal(document.querySelector('.detail-actions'), null);
        }
      }
    });
    await suite.test('CV contact state is honest in both languages', async () => {
      await navigate('/');
      for (const code of ['en', 'fr']) {
        await language(code);
        const cv = document.getElementById('cv');
        for (const [pdfLanguage, file] of Object.entries(cvDocuments)) {
          const link = cv.querySelector(`a[hreflang="${pdfLanguage}"]`);
          if (file) {
            assert.equal(link.getAttribute('href'), file.href);
            assert.equal(link.download, file.filename);
          } else assert.equal(link, null);
        }

      }
    });
    await suite.test('regional language values keep interface, controls and metadata aligned', async () => {
      await navigate('/projects/wordle');
      await act(async () => i18n.changeLanguage('fr-CH'));
      assert.equal(document.documentElement.lang, 'fr');
      assert.equal(document.querySelector('button[lang="fr"]').getAttribute('aria-pressed'), 'true');
      assert.equal(document.querySelector('.appearance-field span').textContent, 'Apparence');
      assert.equal(meta('og:locale', 'property'), 'fr_CH');
      await language('en');
    });
    await suite.test('legacy query URLs do not hide Wordle or duplicate the homepage', async () => {
      await navigate('/?q=serialises&source=local#work');
      assert.equal(document.querySelectorAll('.ml-project-link').length, 1);
      assert.equal(document.activeElement.id, 'work');
      await click(document.querySelector('.ml-project-link'));
      await act(async () => {
        await new Promise(resolve => {
          window.addEventListener('popstate', resolve, { once: true });
          window.history.back();
        });
      });
      assert.equal(new URLSearchParams(window.location.search).get('source'), 'local');
      assert.equal(document.activeElement.id, 'work');
      assert.ok(document.querySelector('.ml-showcase'));
    });
    await suite.test('active-section semantics follow real navigation destinations', async () => {
      await navigate('/#about');
      assert.equal(document.querySelector('#primary-navigation [aria-current]').hash, '#about');
      await navigate('/projects/wordle#features');
      assert.equal(document.querySelector('#primary-navigation [aria-current]'), null);
      assert.equal(document.querySelector('.detail-contents [aria-current]').hash, '#features');
    });
    await suite.test('animation failure cannot blank a route', async () => {
      const animate = dom.window.HTMLElement.prototype.animate;
      try {
        dom.window.HTMLElement.prototype.animate = () => { throw Error('Animation unavailable'); };
        await navigate('/projects/wordle');
        assert.equal(document.querySelector('h1').textContent, 'Wordle');
      } finally { dom.window.HTMLElement.prototype.animate = animate; }
    });
    await suite.test('render failure produces bilingual recovery without exposing internals', async () => {
      const { AppRecovery, RecoveryScreen } = await server.ssrLoadModule('/src/components/AppRecovery.jsx');
      const { AppearanceProvider } = await server.ssrLoadModule('/src/components/AppearanceProvider.jsx');
      const container = document.createElement('div');
      document.body.append(container);
      const caught = [];
      const temporaryRoot = createRoot(container, { onCaughtError: error => caught.push(error.message) });
      const Broken = () => { throw Error('Internal diagnostic'); };
      try {
        await act(async () => temporaryRoot.render(createElement(AppearanceProvider, null,
          createElement(AppRecovery, null, createElement(Broken)))));
        assert.deepEqual(caught, ['Internal diagnostic']);
        assert.ok(container.querySelector('[role="alert"]'));
        assert.ok(!container.textContent.includes('Internal diagnostic'));
        assert.equal(container.querySelector('main').getAttribute('role'), null);
        assert.equal(document.activeElement, container.querySelector('h1'));
        assert.equal(container.querySelector('main').getAttribute('aria-labelledby'), container.querySelector('h1').id);
        for (const code of ['en', 'fr']) {
          await language(code);
          assert.equal(container.querySelector('h1').textContent, i18n.t('portfolio.recoveryTitle'));
        }
        let reloaded = false;
        await act(async () => temporaryRoot.render(createElement(AppearanceProvider, null,
          createElement(RecoveryScreen, { onReload: () => { reloaded = true; } }))));
        await click(container.querySelector('button'));
        assert.equal(reloaded, true);
      } finally {
        await act(async () => temporaryRoot.unmount());
        container.remove();
      }
    });
    await suite.test('both Wordle return links focus the selected-project section', async () => {
      for (const selector of ['.project-back', '.bottom-back']) {
        await navigate('/projects/wordle');
        await click(document.querySelector(selector));
        assert.equal(window.location.pathname, '/');
        assert.equal(document.activeElement.id, 'work');
        assert.equal(document.querySelectorAll('.ml-project-link').length, 1);
      }
    });
    await suite.test('header resizing retains visible focus and exposes education navigation', async () => {
      await navigate('/');
      const english = document.querySelector('button[lang="en"]');
      english.focus();
      await act(async () => window.matchMedia('(max-width: 600px)').update(true));
      assert.equal(document.activeElement, english);
      await click(document.querySelector('.menu-toggle'));
      const cv = document.querySelector('#primary-navigation a[href="/#education"]');
      cv.focus();
      await act(async () => window.matchMedia('(max-width: 600px)').update(false));
      assert.equal(document.activeElement, cv);
      await act(async () => window.matchMedia('(max-width: 600px)').update(true));
      assert.equal(document.activeElement, document.querySelector('.menu-toggle'));
      await act(async () => window.matchMedia('(max-width: 600px)').update(false));
      assert.equal(document.activeElement, document.querySelector('#primary-navigation a'));
      await click(document.querySelector('#primary-navigation a[href="/#education"]'));
      assert.equal(document.activeElement.id, 'education');
    });
    await suite.test('retired preview route does not expose a second homepage', async () => {
      await navigate('/design-preview');
      assert.equal(document.querySelector('.ml-showcase'), null);
      assert.equal(meta('robots'), 'noindex, follow');
      await click(document.querySelector('main a'));
      assert.equal(window.location.pathname, '/');
      assert.ok(document.querySelector('.ml-showcase'));
    });
    await suite.test('complete typewriter sentence is accessible and reduced motion updates live', async () => {
      await navigate('/');
      for (const code of ['en', 'fr']) {
        await language(code);
        assert.equal(document.querySelector('.ml-final-typed .sr-only').textContent, homeCopy[code].introduction);
        await click(document.querySelector('.finish-typing'));
        assert.equal(document.querySelector('.typed-text').textContent, homeCopy[code].introduction);
        assert.equal(document.querySelector('.finish-typing').getAttribute('aria-disabled'), 'true');
      }
      await language('en');
      await act(async () => window.matchMedia('(prefers-reduced-motion: reduce)').update(true));
      assert.equal(document.querySelector('.typed-text').textContent, homeCopy.en.introduction);
      assert.equal(document.querySelector('.typed-caret'), null);
      await act(async () => window.matchMedia('(prefers-reduced-motion: reduce)').update(false));
    });
    await suite.test('professional facts and skills remain complete in both languages', async () => {
      await navigate('/');
      for (const code of ['en', 'fr']) {
        await language(code);
        for (const group of professional[code].skills) {
          for (const skill of group.items) assert.ok(document.querySelector('#skills').textContent.includes(skill));
        }
        for (const item of professional[code].education) {
          for (const value of Object.values(item)) assert.ok(document.querySelector('#education').textContent.includes(value));
        }
        assert.equal(document.querySelectorAll('.ml-showcase-skill-group li svg').length, professional[code].skills.reduce((n,g) => n+g.items.length,0));
        const experience = document.querySelector('#experience').textContent;
        for (const key of ['rafisaRole','gaeaRole','rafisaLocation','gaeaLocation','rafisaDates','gaeaDates']) assert.ok(experience.includes(i18n.t(`portfolio.${key}`)));
        assert.ok(experience.includes(code === 'en' ? '19 October 2026 – 14 January 2027' : '19 octobre 2026 – 14 janvier 2027'));
        assert.equal(document.querySelectorAll('#hobbies li').length, 3);
      }
    });
    await suite.test('entrance observer handles live reduced motion, focus and setup failures', async () => {
      const { default: useEntranceMotion } = await server.ssrLoadModule('/src/hooks/useEntranceMotion.js');
      const { useRef } = await import('react');
      const container = document.createElement('div');
      document.body.append(container);
      const temporaryRoot = createRoot(container);
      const originalRect = dom.window.HTMLElement.prototype.getBoundingClientRect;
      let disconnected = 0;
      globalThis.IntersectionObserver = class {
        observe() {} unobserve() {} disconnect() { disconnected++; }
      };
      const Example = () => {
        const ref = useRef(null); useEntranceMotion(ref);
        return createElement('div', { ref }, createElement('div', { 'data-animate': true }, createElement('button', null, 'Visible action')));
      };
      try {
        dom.window.HTMLElement.prototype.getBoundingClientRect = () => ({ top: 2000 });
        await act(async () => temporaryRoot.render(createElement(Example)));
        assert.ok(container.querySelector('.ml-animate-ready'));
        container.querySelector('button').focus();
        assert.equal(container.querySelector('.ml-animate-ready'), null, 'focused content is immediately visible');
        await act(async () => temporaryRoot.render(createElement(Example, { key: 'fresh' })));
        assert.ok(container.querySelector('.ml-animate-ready'));
        await act(async () => window.matchMedia('(prefers-reduced-motion: reduce)').update(true));
        assert.equal(container.querySelector('.ml-animate-ready'), null);
        assert.ok(disconnected > 0);
        await act(async () => window.matchMedia('(prefers-reduced-motion: reduce)').update(false));
        globalThis.IntersectionObserver = class { constructor() { throw Error('Unsupported observer'); } };
        await act(async () => temporaryRoot.render(createElement(Example, { key: 'failure' })));
        assert.equal(container.querySelector('.ml-animate-ready'), null);
        assert.equal(container.querySelector('button').textContent, 'Visible action');
      } finally {
        await act(async () => temporaryRoot.unmount());
        container.remove(); delete globalThis.IntersectionObserver;
        dom.window.HTMLElement.prototype.getBoundingClientRect = originalRect;
      }
    });
    await suite.test('Wordle implementation notes are bilingual and link pinned evidence', async () => {
      await navigate('/projects/wordle');
      for (const code of ['en', 'fr']) {
        await language(code);
        const notes = document.querySelector('.project-implementation');
        assert.equal(notes.querySelectorAll('dt').length, 3);
        for (const item of caseStudies[0].implementation) assert.ok(notes.textContent.includes(item.description[code]));
        assert.equal(notes.querySelector('a').href, caseStudies[0].evidence);
      }
    });
    await suite.test('genuine screenshot views keep bilingual captions and recover image failures', async () => {
      await navigate('/'); await navigate('/projects/wordle');
      for (const code of ['en', 'fr']) {
        await language(code);
        for (const [index, screenshot] of caseStudies[0].screenshots.entries()) {
          const controls = [...document.querySelectorAll('.screenshot-options button')];
          assert.equal(new Set(controls.map(button => button.textContent)).size, controls.length);
          assert.equal(controls[index].textContent, screenshot.label[code]);
          await click(controls[index]);
          assert.equal(document.querySelectorAll('.screenshot-options button[aria-pressed="true"]').length, 1);
          assert.equal(controls[index].getAttribute('aria-pressed'), 'true');
          const img = document.querySelector('.project-screenshots img');
          assert.equal(img.getAttribute('src'), screenshot.src);
          assert.equal(img.alt, screenshot.alt[code]);
          assert.ok(document.querySelector('figcaption').textContent.includes(screenshot.note[code]));
          assert.equal(document.querySelector('.project-screenshots .text-link').getAttribute('href'), screenshot.src);
          await act(async () => img.dispatchEvent(new window.Event('error')));
          assert.ok(document.querySelector('.screenshot-error [role="status"]'));
          await click(document.querySelector('.screenshot-error button'));
          assert.ok(document.querySelector('.project-screenshots img'));
          assert.equal(document.activeElement, document.querySelectorAll('.screenshot-options button')[index]);
        }
      }
    });
    await suite.test('empty future screenshot arrays do not render broken galleries or links', async () => {
      const original = caseStudies[0].screenshots;
      caseStudies[0].screenshots = [];
      try {
        await navigate('/'); await navigate('/projects/wordle');
        assert.equal(document.querySelector('h1').textContent, 'Wordle');
        assert.equal(document.querySelector('.project-screenshots'), null);
        assert.equal(document.querySelector('.detail-contents a[href="#screenshots"]'), null);
      } finally { caseStudies[0].screenshots = original; }
    });
    await suite.test('typed layout reserves the final sentence without double announcement', async () => {
      await navigate('/');
      for (const code of ['en', 'fr']) {
        await language(code);
        assert.equal(document.querySelector('.typed-reserve').textContent, homeCopy[code].introduction);
        assert.equal(document.querySelector('.typed-visual').getAttribute('aria-hidden'), 'true');
        assert.equal(document.querySelectorAll('.ml-final-typed .sr-only').length, 1);
      }
    });
    await suite.test('CV downloads expose each available language independently without inventing missing files', async () => {
      const { default: CvDownload } = await server.ssrLoadModule('/src/components/CvDownload.jsx');
      const container = document.createElement('div');
      const temporaryRoot = createRoot(container);
      // Link metadata only: no PDF bytes, files or public manifest entries are fabricated.
      const documents = { en: { href: '/cv/test-en.pdf', filename: 'test-en.pdf', bytes: 2048 }, fr: null };
      try {
        await act(async () => temporaryRoot.render(createElement(CvDownload, { documents, language: 'en', copy: homeCopy.en })));
        assert.equal(container.querySelector('a').getAttribute('href'), '/cv/test-en.pdf');
        assert.equal(container.querySelector('a').download, 'test-en.pdf');
        assert.equal(container.querySelector('a').hreflang, 'en');
        assert.ok(container.textContent.includes('PDF · 2 KB'));
        await act(async () => temporaryRoot.render(createElement(CvDownload, { documents, language: 'fr', copy: homeCopy.fr })));
        assert.equal(container.querySelector('a').hreflang, 'en');
        assert.ok(container.textContent.includes('English'));
        assert.equal(container.querySelector('a[hreflang="fr"]'), null);
        assert.ok(container.textContent.includes('PDF · 2 Ko'));
        documents.fr = { href: '/cv/test-fr.pdf', filename: 'test-fr.pdf', bytes: 1024 };
        await act(async () => temporaryRoot.render(createElement(CvDownload, { documents, language: 'fr', copy: homeCopy.fr })));
        assert.equal(container.querySelectorAll('a').length, 2);
        assert.equal(container.querySelector('a[hreflang="fr"]').download, 'test-fr.pdf');
        assert.equal(container.querySelector('a[hreflang="en"]').download, 'test-en.pdf');
        assert.ok(container.textContent.includes(homeCopy.fr.cv));
        await act(async () => temporaryRoot.render(createElement(CvDownload, { documents: { en: null, fr: null }, language: 'fr', copy: homeCopy.fr })));
        assert.equal(container.querySelector('a'), null);
        assert.equal(container.textContent, homeCopy.fr.noCv);
      } finally { await act(async () => temporaryRoot.unmount()); }
    });
    await suite.test('case and encoded project URLs retain correct metadata and content', async () => {
      for (const path of ['/PROJECTS/WORDLE', '/projects/%77ordle']) {
        await navigate(path);
        assert.equal(document.querySelector('h1').textContent, 'Wordle');
        assert.equal(document.title, 'Wordle | Michael Leigh');
        assert.equal(meta('robots'), 'index, follow');
      }
    });
    await suite.test('every homepage section link resolves and moves focus in both languages', async () => {
      for (const code of ['en', 'fr']) {
        await navigate('/'); await language(code);
        const destinations = [...document.querySelectorAll('#primary-navigation a, .ml-showcase-footer a')].map(a => a.getAttribute('href'));
        for (const href of destinations) {
          await click(document.querySelector(`a[href="${href}"]`));
          assert.equal(document.activeElement.id, href.split('#')[1]);
          assert.equal(document.documentElement.lang, code);
        }
      }
    });
    await suite.test('saved theme restoration and preference writes', async () => {
      const preferences = new Map([['portfolio-theme', 'dark']]);
      globalThis.localStorage = {
        getItem: key => preferences.get(key) ?? null,
        setItem: (key, value) => preferences.set(key, value),
      };
      await act(async () => root.render(createElement(StrictMode, null, createElement(App, { key: 'restored-session' }))));
      assert.equal(document.querySelector('select').value, 'dark');
      await theme('light');
      assert.equal(preferences.get('portfolio-theme'), 'light');
      await language('en');
      assert.equal(preferences.get('portfolio-language'), 'en');
      assert.equal(document.documentElement.dataset.theme, 'light');
    });
    await suite.test('static social tags exist before JavaScript executes', () => {
      for (const tag of ['og:type', 'og:site_name', 'og:title', 'og:description', 'og:locale', 'twitter:card', 'twitter:title', 'twitter:description']) {
        assert.ok(html.includes(`"${tag}"`), tag);
      }
    });
  } finally {
    await act(async () => root.unmount());
    await server.close();
    dom.window.close();
  }
});
