# SEO Component Usage Guide

## Overview

The SEO component provides comprehensive meta tag management for the Giuliano Alquileres app, including support for Open Graph, Twitter Cards, and JSON-LD structured data.

## Basic Usage

```jsx
import SEO from './components/common/SEO';

function MyPage() {
  return (
    <>
      <SEO
        title="Property Name - Giuliano Alquileres"
        description="Beautiful apartment in Buenos Aires with 2 bedrooms"
        keywords="apartment, Buenos Aires, vacation rental"
        image="/images/property-123.jpg"
      />
      <div>
        {/* Your page content */}
      </div>
    </>
  );
}
```

## Property Detail Page Example

```jsx
import SEO, { generatePropertyStructuredData } from './components/common/SEO';

function PropertyDetails({ property }) {
  const structuredData = generatePropertyStructuredData(property);

  return (
    <>
      <SEO
        title={`${property.title} - Giuliano Alquileres`}
        description={property.description}
        keywords={`${property.city}, ${property.propertyType}, vacation rental, ${property.amenities.join(', ')}`}
        image={property.photos[0]?.url}
        type="product"
        structuredData={structuredData}
      />
      <div>
        {/* Property details */}
      </div>
    </>
  );
}
```

## Home Page Example

```jsx
import SEO, {
  generateOrganizationStructuredData,
  generateWebSiteStructuredData
} from './components/common/SEO';

function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationStructuredData(),
      generateWebSiteStructuredData()
    ]
  };

  return (
    <>
      <SEO
        title="Giuliano Alquileres - Premium Vacation Rentals in Argentina"
        description="Find your perfect vacation rental in Argentina. Browse our curated collection of apartments and homes."
        structuredData={structuredData}
      />
      <div>
        {/* Home page content */}
      </div>
    </>
  );
}
```

## Breadcrumb Example

```jsx
import SEO, { generateBreadcrumbStructuredData } from './components/common/SEO';

function PropertyList({ city }) {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://giulianoalquileres.com' },
    { name: 'Properties', url: 'https://giulianoalquileres.com/properties' },
    { name: city, url: `https://giulianoalquileres.com/properties?city=${city}` }
  ];

  const structuredData = generateBreadcrumbStructuredData(breadcrumbItems);

  return (
    <>
      <SEO
        title={`Properties in ${city} - Giuliano Alquileres`}
        structuredData={structuredData}
      />
      <div>
        {/* Property list */}
      </div>
    </>
  );
}
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | "Giuliano Alquileres - Vacation Rentals in Argentina" | Page title |
| description | string | Default description | Meta description |
| keywords | string | Default keywords | SEO keywords |
| image | string | "/og-image.jpg" | Social media preview image |
| url | string | Current URL | Canonical URL |
| type | string | "website" | Open Graph type (website, article, product) |
| publishedTime | string | - | Article publish date (ISO 8601) |
| modifiedTime | string | - | Article modified date (ISO 8601) |
| author | string | "Giuliano Alquileres" | Content author |
| structuredData | object | - | JSON-LD structured data |
| noIndex | boolean | false | Prevent search engine indexing |
| canonicalUrl | string | Current URL | Canonical URL for duplicate content |

## Structured Data Helpers

### generatePropertyStructuredData(property)

Generates schema.org Accommodation structured data for property listings.

**Required property fields:**
- title
- description
- photos (array)
- street, city, state, country
- latitude, longitude
- pricePerNight
- bedrooms
- maxGuests
- amenities (array)

### generateOrganizationStructuredData()

Generates schema.org Organization data for the business.

### generateWebSiteStructuredData()

Generates schema.org WebSite data with search functionality.

### generateBreadcrumbStructuredData(items)

Generates schema.org BreadcrumbList data.

**items format:**
```javascript
[
  { name: 'Home', url: 'https://example.com' },
  { name: 'Category', url: 'https://example.com/category' }
]
```

## Best Practices

1. **Always include SEO component** on every page
2. **Use unique titles** - Format: "Page Title - Giuliano Alquileres"
3. **Keep descriptions 150-160 characters** for optimal display
4. **Use high-quality images** (1200x630px for Open Graph)
5. **Include structured data** for better search results
6. **Set canonical URLs** for duplicate content
7. **Use noIndex=true** for admin/private pages

## Testing

Test your SEO implementation:

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **Google Rich Results Test**: https://search.google.com/test/rich-results
4. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

## Notes

- The component automatically handles multi-language support (es_AR, en_US, pt_BR)
- All meta tags are dynamically updated when props change
- Images without full URLs are automatically prefixed with the site URL
- The component respects noIndex for preventing search engine indexing
