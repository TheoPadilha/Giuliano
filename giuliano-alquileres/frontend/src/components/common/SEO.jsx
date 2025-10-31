// src/components/common/SEO.jsx
// Comprehensive SEO component with meta tags, Open Graph, Twitter Cards, and JSON-LD

import { useEffect } from 'react';
import PropTypes from 'prop-types';

const SEO = ({
  title = 'Giuliano Alquileres - Vacation Rentals in Argentina',
  description = 'Discover beautiful vacation rentals and apartments in Argentina. Book your perfect stay with Giuliano Alquileres.',
  keywords = 'vacation rentals, apartments, Argentina, accommodation, holiday homes, alquileres',
  image = '/og-image.jpg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Giuliano Alquileres',
  structuredData,
  noIndex = false,
  canonicalUrl,
}) => {
  // Get current URL if not provided
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const canonical = canonicalUrl || currentUrl;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name, content, attribute = 'name') => {
      if (!content) return;

      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // Open Graph meta tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:url', currentUrl, 'property');
    updateMetaTag('og:image', fullImageUrl, 'property');
    updateMetaTag('og:site_name', 'Giuliano Alquileres', 'property');
    updateMetaTag('og:locale', 'es_AR', 'property');
    updateMetaTag('og:locale:alternate', 'en_US', 'property');
    updateMetaTag('og:locale:alternate', 'pt_BR', 'property');

    if (publishedTime) {
      updateMetaTag('article:published_time', publishedTime, 'property');
    }
    if (modifiedTime) {
      updateMetaTag('article:modified_time', modifiedTime, 'property');
    }

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', fullImageUrl);
    updateMetaTag('twitter:site', '@giulianoalquileres');
    updateMetaTag('twitter:creator', '@giulianoalquileres');

    // Robots meta tag
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }

    // Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', canonical);
    } else {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      linkCanonical.setAttribute('href', canonical);
      document.head.appendChild(linkCanonical);
    }

    // JSON-LD Structured Data
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]#structured-data');
      if (scriptTag) {
        scriptTag.textContent = JSON.stringify(structuredData);
      } else {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        scriptTag.setAttribute('id', 'structured-data');
        scriptTag.textContent = JSON.stringify(structuredData);
        document.head.appendChild(scriptTag);
      }
    }
  }, [
    title,
    description,
    keywords,
    image,
    fullImageUrl,
    currentUrl,
    type,
    publishedTime,
    modifiedTime,
    author,
    structuredData,
    noIndex,
    canonical,
  ]);

  return null; // This component doesn't render anything visible
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  publishedTime: PropTypes.string,
  modifiedTime: PropTypes.string,
  author: PropTypes.string,
  structuredData: PropTypes.object,
  noIndex: PropTypes.bool,
  canonicalUrl: PropTypes.string,
};

// Helper function to generate structured data for properties
export const generatePropertyStructuredData = (property) => {
  if (!property) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    name: property.title,
    description: property.description,
    image: property.photos?.map((photo) => photo.url) || [],
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.street,
      addressLocality: property.city,
      addressRegion: property.state,
      addressCountry: property.country || 'AR',
    },
    geo: property.latitude && property.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: property.latitude,
      longitude: property.longitude,
    } : undefined,
    priceRange: property.pricePerNight ? `$${property.pricePerNight}` : undefined,
    aggregateRating: property.rating ? {
      '@type': 'AggregateRating',
      ratingValue: property.rating,
      reviewCount: property.reviewCount || 0,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    amenityFeature: property.amenities?.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
    })) || [],
    numberOfRooms: property.bedrooms,
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: property.maxGuests,
    },
    petsAllowed: property.petsAllowed || false,
  };
};

// Helper function to generate structured data for the organization
export const generateOrganizationStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Giuliano Alquileres',
  url: 'https://giulianoalquileres.com',
  logo: 'https://giulianoalquileres.com/logo.png',
  description: 'Premium vacation rentals and apartments in Argentina',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+54-xxx-xxx-xxxx',
    contactType: 'Customer Service',
    availableLanguage: ['Spanish', 'English', 'Portuguese'],
  },
  sameAs: [
    'https://www.facebook.com/giulianoalquileres',
    'https://www.instagram.com/giulianoalquileres',
    'https://twitter.com/giulianoalquileres',
  ],
});

// Helper function to generate structured data for search results
export const generateWebSiteStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Giuliano Alquileres',
  url: 'https://giulianoalquileres.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://giulianoalquileres.com/properties?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
});

// Helper function to generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export default SEO;
