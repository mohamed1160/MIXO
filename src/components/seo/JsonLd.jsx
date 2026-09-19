import { useEffect, useRef } from 'react';

/**
 * Injects JSON-LD structured data into <head>.
 * Cleans up on unmount or when data changes.
 *
 * @param {Object} props
 * @param {Object|Object[]} props.data - Schema.org JSON-LD object(s)
 */
export default function JsonLd({ data }) {
  const scriptRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    // Remove previous script if exists
    if (scriptRef.current && scriptRef.current.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current);
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, [data]);

  return null;
}

/**
 * Build WebSite + Organization schema (used on every page via layout).
 */
export function buildWebSiteSchema(siteUrl, siteName) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/shop?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/favicon.png`,
      description: 'Premium 3D printing and custom design studio in Egypt.',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'support@mixo3d.com',
        availableLanguage: ['English', 'Arabic'],
      },
      sameAs: [
        'https://instagram.com',
        'https://facebook.com',
        'https://tiktok.com',
      ],
    },
  ];
}

/**
 * Build Product + Offer schema for a product page.
 */
export function buildProductSchema(product, siteUrl) {
  if (!product) return null;

  const name = product.title || product.name || 'Product';
  const price = Number(product.price) || 0;
  const image = product.image || product.images?.[0] || '';
  const description = product.description || `${name} — Premium 3D printed product by MIXO 3D.`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: image.startsWith('http') ? image : `${siteUrl}${image}`,
    brand: {
      '@type': 'Brand',
      name: 'MIXO 3D',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/product/${product.id}`,
      priceCurrency: 'EGP',
      price: price.toFixed(2),
      availability: product.inStock !== false
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'MIXO 3D',
      },
    },
    category: product.category || 'Figures & Collectibles',
    material: product.material || 'PLA Plus',
  };

  return schema;
}

/**
 * Build BreadcrumbList schema for product pages.
 */
export function buildBreadcrumbSchema(items, siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${siteUrl}${item.url}` : undefined,
    })),
  };
}

/**
 * Build FAQPage schema from an array of Q&A items.
 */
export function buildFAQSchema(faqItems) {
  if (!faqItems || faqItems.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}
