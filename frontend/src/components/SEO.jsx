import { useEffect } from 'react';

export default function SEO({ title, description, url, type = 'website' }) {
  useEffect(() => {
    const baseTitle = 'Apni Dukaan - Halal Meat & Grocery';
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    const defaultDesc = 'Your trusted halal meat and international grocery store in Karachi, Pakistan. Fresh halal meat, international groceries, KEB meals, fragrances & more. Free delivery over Rs. 5000.';
    const desc = description || defaultDesc;

    document.title = fullTitle;

    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (el) { el.setAttribute('content', content); }
      else { el = document.createElement('meta'); el.name = name; el.content = content; document.head.appendChild(el); }
    };

    const setProperty = (prop, content) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (el) { el.setAttribute('content', content); }
      else { el = document.createElement('meta'); el.setAttribute('property', prop); el.content = content; document.head.appendChild(el); }
    };

    setMeta('description', desc);
    setMeta('robots', 'index, follow');
    setProperty('og:title', fullTitle);
    setProperty('og:description', desc);
    setProperty('og:type', type);
    setProperty('og:url', url || window.location.href);
    setProperty('og:site_name', 'Apni Dukaan');
    setProperty('twitter:title', fullTitle);
    setProperty('twitter:description', desc);
  }, [title, description, url, type]);

  return null;
}
