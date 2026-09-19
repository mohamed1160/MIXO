import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../providers/LanguageContext';
import { PAGE_SEO, SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../config/seo';

/**
 * Custom hook to dynamically manage SEO <head> tags per page.
 *
 * @param {Object} options
 * @param {string} [options.title]       - Override title (used for dynamic pages like Product)
 * @param {string} [options.description] - Override description
 * @param {string} [options.ogImage]     - Override OG image URL
 * @param {string} [options.ogType]      - Override OG type (default: 'website')
 * @param {boolean} [options.noindex]    - Force noindex for this page
 * @param {string} [options.canonical]   - Override canonical URL
 */
export function useSEO(options = {}) {
  const location = useLocation();
  const { lang } = useLanguage();
  const createdTagsRef = useRef([]);

  useEffect(() => {
    // Determine the base route path (strip trailing slash, normalize)
    let routePath = location.pathname;
    // Match against known route patterns
    const routeKey = findRouteKey(routePath);
    const pageSeo = PAGE_SEO[routeKey] || {};

    const isNoindex = options.noindex ?? pageSeo.noindex ?? false;
    const langSeo = pageSeo[lang] || pageSeo['en'] || {};

    const title = options.title || langSeo.title || `${SITE_NAME} — 3D Printing & Custom Design`;
    const description = options.description || langSeo.description || 'Premium 3D printing and custom design studio in Egypt.';
    const canonical = options.canonical || `${SITE_URL}${routePath === '/' ? '' : routePath}`;
    const ogImage = options.ogImage || `${SITE_URL}${DEFAULT_OG_IMAGE}`;
    const ogType = options.ogType || 'website';
    const ogLocale = lang === 'ar' ? 'ar_EG' : 'en_US';

    // ─── Clean up previously created tags ───
    createdTagsRef.current.forEach((el) => {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    createdTagsRef.current = [];

    // ─── Set document title ───
    document.title = title;

    // ─── Helper: set or create a meta tag ───
    const setMeta = (attr, attrValue, content) => {
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (el) {
        el.setAttribute('content', content);
      } else {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        el.setAttribute('content', content);
        document.head.appendChild(el);
        createdTagsRef.current.push(el);
      }
    };

    // ─── Helper: set or create a link tag ───
    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (el && rel === 'canonical') {
        el.setAttribute('href', href);
      } else if (!el || rel !== 'canonical') {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        el.setAttribute('href', href);
        document.head.appendChild(el);
        createdTagsRef.current.push(el);
      }
    };

    // ─── Core Meta ───
    setMeta('name', 'description', description);
    setMeta('name', 'robots', isNoindex ? 'noindex, nofollow' : 'index, follow');

    // ─── Canonical ───
    setLink('canonical', canonical);

    // ─── Open Graph ───
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:locale', ogLocale);

    // ─── Twitter Card ───
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    // ─── Cleanup on unmount ───
    return () => {
      createdTagsRef.current.forEach((el) => {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      });
      createdTagsRef.current = [];
    };
  }, [location.pathname, lang, options.title, options.description, options.ogImage, options.ogType, options.noindex, options.canonical]);
}

/**
 * Match a pathname to the best-fitting route key in PAGE_SEO.
 * Handles dynamic routes like /product/:id, /shop/:category, etc.
 */
function findRouteKey(pathname) {
  // Exact match
  if (PAGE_SEO[pathname]) return pathname;

  // Normalize trailing slash
  const normalized = pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname;
  if (PAGE_SEO[normalized]) return normalized;

  // Dynamic route patterns
  if (normalized.startsWith('/product/')) return '/product';
  if (normalized.startsWith('/shop/')) return '/shop';
  if (normalized.startsWith('/collections/')) return '/collections';
  if (normalized.startsWith('/journal/')) return '/journal';
  if (normalized.startsWith('/account')) return '/account';
  if (normalized.startsWith('/admin')) return '/admin';

  // Fallback
  return normalized;
}

export default useSEO;
