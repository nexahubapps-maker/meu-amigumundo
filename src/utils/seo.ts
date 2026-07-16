"use client";

export interface SEOMetadata {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export const updateSEOMetadata = (metadata: SEOMetadata) => {
  document.title = metadata.title;
  
  const updateMetaTag = (name: string, content: string, isProperty = false) => {
    const attribute = isProperty ? "property" : "name";
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };

  updateMetaTag("description", metadata.description);
  updateMetaTag("og:title", metadata.title, true);
  updateMetaTag("og:description", metadata.description, true);
  if (metadata.image) {
    updateMetaTag("og:image", metadata.image, true);
  }
  if (metadata.url) {
    updateMetaTag("og:url", metadata.url, true);
  }
};