import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://cyberfalcondigital.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

// Sets document title + meta/OG tags per page. No routing dependency beyond
// reading the current path for canonical/OG URLs.
export default function SEO({ title, description, image = DEFAULT_IMAGE, noIndex = false }) {
  const location = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | CyberFalcon Digital` : "CyberFalcon Digital — Your Website. Managed.";
    document.title = fullTitle;

    setMeta("name", "description", description);
    setMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");

    const canonicalUrl = `${SITE_URL}${location.pathname}`;
    setLink("canonical", canonicalUrl);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", image);
    setMeta("property", "og:site_name", "CyberFalcon Digital");

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
  }, [title, description, image, noIndex, location.pathname]);

  return null;
}
