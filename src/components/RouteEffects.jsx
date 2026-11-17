import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getPageMetadata } from "../utils/pageMetadata";

// Keep navigation, document metadata and keyboard focus aligned with the route.
export default function RouteEffects() {
  const { pathname, hash, key, search } = useLocation();
  const previous = useRef({ pathname, hash, key, search });
  const { i18n } = useTranslation();
  const { title, description, robots, locale } = getPageMetadata(pathname, i18n.resolvedLanguage);

  useEffect(() => {
    document.title = title;
    const tags = [
      ["name", "description", description],
      ["name", "robots", robots],
      ["property", "og:title", title],
      ["property", "og:description", description],
      ["property", "og:locale", locale],
      ["name", "twitter:title", title],
      ["name", "twitter:description", description],
    ];
    for (const [attribute, name, content] of tags) {
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.append(meta);
      }
      meta.content = content;
    }
  }, [title, description, robots, locale]);

  useEffect(() => {
    const old = previous.current;
    const navigated = old.key !== key || old.pathname !== pathname;
    previous.current = { pathname, hash, key, search };
    // Updating a search field must not move focus away from that field.
    if (old.pathname === pathname && old.hash === hash && old.search !== search) return;
    // Leave the first Tab at the skip link on initial visits without a fragment.
    if (!navigated && !hash) return;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { id = ""; }
    const target = document.getElementById(id || "top") || document.getElementById("top");
    if (target) {
      // Sections need programmatic focus so Tab continues at the destination.
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (hash) target.scrollIntoView();
      else window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, hash, key, search]);

  return null;
}
