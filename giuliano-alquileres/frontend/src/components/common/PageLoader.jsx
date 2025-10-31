// src/components/common/PageLoader.jsx
// Beautiful animated loader with Giuliano branding for Suspense fallback

import { useEffect, useState } from 'react';

const PageLoader = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slight delay before showing loader to avoid flash for fast loads
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`page-loader ${isVisible ? 'page-loader-visible' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
    >
      <div className="page-loader-content">
        {/* Animated Giuliano Logo/Icon */}
        <div className="page-loader-logo">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="page-loader-svg"
          >
            {/* House icon with Giuliano branding */}
            <path
              d="M40 10L10 35V70H30V50H50V70H70V35L40 10Z"
              fill="var(--color-rausch)"
              className="page-loader-house"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="var(--color-rausch)"
              strokeWidth="2"
              fill="none"
              className="page-loader-circle"
            />
          </svg>
        </div>

        {/* Loading text */}
        <div className="page-loader-text">
          <span className="page-loader-brand">Giuliano Alquileres</span>
          <span className="page-loader-dots">
            <span className="page-loader-dot">.</span>
            <span className="page-loader-dot">.</span>
            <span className="page-loader-dot">.</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="page-loader-progress">
          <div className="page-loader-progress-bar"></div>
        </div>

        {/* Screen reader text */}
        <span className="sr-only">Loading content, please wait...</span>
      </div>
    </div>
  );
};

export default PageLoader;
