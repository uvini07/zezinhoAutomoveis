import { useEffect } from 'react';
import { SITE } from '@/config/site';

function setMeta(selector, attr, key, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Atualiza title, description, canonical e Open Graph por página.
 * As tags estáticas do index.html continuam como fallback para robôs sem JS.
 */
export function useDocumentMeta({ title, description, path } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE.name}` : SITE.title;
    const desc = description ?? SITE.description;
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'name', 'description', desc);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    if (path !== undefined) setCanonical(`${SITE.url}${path}`);
  }, [title, description, path]);
}
