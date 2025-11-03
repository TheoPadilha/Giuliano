# Quick Reference Guide - Performance, Accessibility & SEO

## SEO Component - Copy & Paste Examples

### Basic Page
```jsx
import SEO from './components/common/SEO';

<SEO
  title="My Page - Giuliano Alquileres"
  description="Page description (150-160 chars)"
  keywords="keyword1, keyword2, keyword3"
/>
```

### Property Detail
```jsx
import SEO, { generatePropertyStructuredData } from './components/common/SEO';

const structuredData = generatePropertyStructuredData(property);

<SEO
  title={`${property.title} - Giuliano Alquileres`}
  description={property.description.substring(0, 160)}
  keywords={`${property.city}, vacation rental, ${property.amenities.join(', ')}`}
  image={property.photos[0]?.url}
  type="product"
  structuredData={structuredData}
/>
```

### Home Page
```jsx
import SEO, { generateOrganizationStructuredData, generateWebSiteStructuredData } from './components/common/SEO';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    generateOrganizationStructuredData(),
    generateWebSiteStructuredData()
  ]
};

<SEO
  title="Giuliano Alquileres - Premium Vacation Rentals"
  description="Find your perfect vacation rental in Argentina"
  structuredData={structuredData}
/>
```

---

## Animation Classes - Quick Reference

### Entry Animations
```jsx
<div className="animate-fade-in">...</div>
<div className="animate-slide-up">...</div>
<div className="animate-slide-down">...</div>
<div className="animate-slide-in-left">...</div>
<div className="animate-slide-in-right">...</div>
<div className="animate-scale-in">...</div>
```

### Hover Effects
```jsx
<div className="hover-scale">Hover me</div>      {/* Scale to 1.05 */}
<div className="hover-lift">Hover me</div>       {/* Lift up with shadow */}
<div className="hover-grow">Hover me</div>       {/* Scale + rotate */}
```

### Staggered Lists
```jsx
<div className="animate-stagger">
  <div>Item 1</div>  {/* Animates first */}
  <div>Item 2</div>  {/* Animates 50ms later */}
  <div>Item 3</div>  {/* Animates 100ms later */}
</div>
```

### Loading States
```jsx
{/* Skeleton loaders */}
<div className="skeleton-title"></div>
<div className="skeleton-text"></div>
<div className="skeleton-button"></div>

{/* Custom skeleton */}
<div className="skeleton" style={{ width: '100%', height: '200px' }}></div>

{/* Shimmer effect */}
<div className="shimmer" style={{ width: '300px', height: '20px' }}></div>

{/* Spinners */}
<div className="spinner-sm"></div>
<div className="spinner-md"></div>
<div className="spinner-lg"></div>
```

---

## Accessibility - Quick Reference

### Skip to Content
```jsx
{/* Already in App.jsx - automatically available */}
<a href="#main-content" className="skip-to-content">
  Skip to content
</a>

<main id="main-content" role="main">
  {/* Your content */}
</main>
```

### Buttons with Icons
```jsx
<button aria-label="Search properties">
  <FaSearch aria-hidden="true" />
</button>

<button aria-label="Close dialog">
  <FaTimes aria-hidden="true" />
  <span className="sr-only">Close</span>
</button>
```

### Forms
```jsx
<div className="form-group">
  <label htmlFor="email" className="label">
    Email Address
    <span className="sr-only">(required)</span>
  </label>
  <input
    id="email"
    type="email"
    className="input"
    aria-required="true"
    aria-describedby="email-error"
  />
  <span id="email-error" className="form-error" role="alert">
    Please enter a valid email
  </span>
</div>
```

### Loading States
```jsx
<div role="status" aria-live="polite">
  <PageLoader />
  <span className="sr-only">Loading content, please wait...</span>
</div>
```

### Images
```jsx
{/* Decorative image */}
<img src="..." alt="" aria-hidden="true" />

{/* Meaningful image */}
<img src="..." alt="Detailed description of the image" />

{/* Property image */}
<img
  src={property.photo}
  alt={`${property.title} - ${property.city}`}
/>
```

---

## Design System Classes

### Buttons
```jsx
<button className="btn-primary">Primary Button</button>
<button className="btn-primary-large">Large Button</button>
<button className="btn-primary-small">Small Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-outline">Outline Button</button>
<button className="btn-ghost">Ghost Button</button>
<button className="btn-success">Success Button</button>
<button className="btn-danger">Danger Button</button>
```

### Cards
```jsx
<div className="card">
  <div className="card-header">Header</div>
  <div className="card-body">Content</div>
  <div className="card-footer">Footer</div>
</div>

<div className="card-hover">Hover effect</div>
<div className="card-featured">Featured with border</div>
```

### Badges
```jsx
<span className="badge-rausch">New</span>
<span className="badge-success">Available</span>
<span className="badge-warning">Limited</span>
<span className="badge-error">Sold Out</span>
<span className="badge-premium">Premium</span>
```

### Alerts
```jsx
<div className="alert-success">Success message</div>
<div className="alert-error">Error message</div>
<div className="alert-warning">Warning message</div>
<div className="alert-info">Info message</div>
```

---

## Common Patterns

### Property Card with Animations
```jsx
<div className="card-hover animate-slide-up">
  <img
    src={property.image}
    alt={`${property.title} - ${property.city}`}
    className="hover-scale"
  />
  <div className="card-body">
    <h3>{property.title}</h3>
    <p>{property.description}</p>
    <button
      className="btn-primary hover-lift"
      aria-label={`View details for ${property.title}`}
    >
      View Details
    </button>
  </div>
</div>
```

### Loading State Pattern
```jsx
function MyComponent() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <span className="sr-only">Loading content...</span>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Actual content */}
    </div>
  );
}
```

### Modal Pattern
```jsx
<div className="modal-overlay" onClick={onClose}>
  <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()}>
    <div className="modal-header">
      <h2>Modal Title</h2>
      <button
        onClick={onClose}
        aria-label="Close modal"
      >
        <FaTimes aria-hidden="true" />
      </button>
    </div>
    <div className="modal-body">
      {/* Content */}
    </div>
    <div className="modal-footer">
      <button className="btn-secondary" onClick={onClose}>
        Cancel
      </button>
      <button className="btn-primary hover-scale">
        Confirm
      </button>
    </div>
  </div>
</div>
```

---

## Performance Tips

### Lazy Loading Routes
```jsx
// Already done in App.jsx - just add new routes like this:
const NewPage = lazy(() => import('./pages/NewPage'));

<Route path="/new-page" element={<NewPage />} />
```

### Image Optimization
```jsx
{/* Add loading="lazy" to images below the fold */}
<img
  src={image.url}
  alt={image.alt}
  loading="lazy"
  width={image.width}
  height={image.height}
/>
```

### Prefetch Important Routes
```jsx
import { Link } from 'react-router-dom';

<Link to="/properties" prefetch="intent">
  View Properties
</Link>
```

---

## Testing Checklist

### Quick Accessibility Test
- [ ] Tab through entire page (no mouse)
- [ ] Check focus indicators are visible
- [ ] Test with screen reader (NVDA/VoiceOver)
- [ ] Enable "Reduce motion" in OS settings

### Quick SEO Test
- [ ] View page source - check `<title>` tag
- [ ] Check Open Graph tags exist
- [ ] Paste URL in Facebook Debugger
- [ ] Validate structured data with Google test

### Quick Performance Test
- [ ] Run Lighthouse in Chrome DevTools
- [ ] Check Network tab bundle sizes
- [ ] Test on slow 3G connection
- [ ] Verify lazy loading works

---

## Common Issues & Solutions

### Issue: Focus outline not visible
```css
/* Make sure you're using focus-visible, not focus */
.button:focus-visible {
  outline: 3px solid var(--color-rausch);
}
```

### Issue: Animation too fast/slow
```css
/* Adjust animation duration */
.my-element {
  animation: slideUp 0.6s ease-out; /* Change 0.6s */
}
```

### Issue: SEO meta tags not updating
```jsx
// Make sure SEO component is at the TOP of your component
function MyPage() {
  return (
    <>
      <SEO title="..." /> {/* Must be first */}
      <div>Content</div>
    </>
  );
}
```

### Issue: Lazy loading not working
```jsx
// Check that you imported lazy and Suspense
import { lazy, Suspense } from 'react';

// Wrap in Suspense
<Suspense fallback={<PageLoader />}>
  <LazyComponent />
</Suspense>
```

---

## Color Variables Reference

```css
/* Primary Colors */
var(--color-rausch)           /* #FF385C - Main brand color */
var(--color-rausch-light)     /* #FF5A5F - Lighter variant */
var(--color-rausch-dark)      /* #E61E4D - Darker variant */

/* Grays */
var(--color-airbnb-black)     /* #222222 - Text */
var(--color-airbnb-grey-700)  /* #717171 - Secondary text */
var(--color-airbnb-grey-400)  /* #b0b0b0 - Borders */
var(--color-airbnb-grey-100)  /* #ebebeb - Backgrounds */

/* Semantic */
var(--color-success)          /* #008A05 - Success states */
var(--color-error)            /* #C13515 - Error states */
var(--color-warning)          /* #E07912 - Warning states */
var(--color-info)             /* #428BFF - Info states */
```

---

## Shadow Variables

```css
var(--shadow-sm)    /* Subtle shadow */
var(--shadow)       /* Default shadow */
var(--shadow-md)    /* Medium shadow */
var(--shadow-lg)    /* Large shadow */
var(--shadow-xl)    /* Extra large shadow */
var(--shadow-2xl)   /* Maximum shadow */
```

---

## Border Radius Variables

```css
var(--radius-sm)    /* 8px */
var(--radius)       /* 12px - Default */
var(--radius-lg)    /* 16px */
var(--radius-xl)    /* 20px */
var(--radius-2xl)   /* 24px */
var(--radius-full)  /* 9999px - Pills/circles */
```

---

## Transition Variables

```css
var(--transition-fast)  /* 150ms ease-in-out */
var(--transition-base)  /* 200ms ease-in-out - Default */
var(--transition-slow)  /* 300ms ease-in-out */
```

---

## Need Help?

- **Performance:** Check `OPTIMIZATION-GUIDE.md`
- **SEO:** Check `src/components/common/SEO.README.md`
- **Summary:** Check `IMPLEMENTATION-SUMMARY.md`
- **Design System:** Check `src/styles/airbnb-design-system.css`
