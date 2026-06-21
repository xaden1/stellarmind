import React from 'react';
import { brand } from '../brand.config';

/**
 * BrandLogo — Reusable logo + wordmark component.
 *
 * Props:
 *   size       — 'sm' | 'md' | 'lg' (default 'md')
 *   showName   — show the app name text (default true)
 *   showTagline — show the tagline below the name (default false)
 *   className  — extra CSS classes on the root element
 *   linkTo     — optional href, wraps everything in an <a> tag
 */
export default function BrandLogo({
  size = 'md',
  showName = true,
  showTagline = false,
  className = '',
  linkTo,
}) {
  const sizeMap = {
    sm: { chip: 32, fontSize: 17, tagSize: 10, gap: 10 },
    md: { chip: 40, fontSize: 22, tagSize: 12, gap: 12 },
    lg: { chip: 56, fontSize: 30, tagSize: 14, gap: 16 },
  };

  const s = sizeMap[size] || sizeMap.md;

  const inner = (
    <span
      className={`flex items-center ${className}`}
      style={{ gap: s.gap, textDecoration: 'none' }}
    >
      {/* Logo chip — glass chip with gradient SVG mark */}
      <span
        style={{
          width: s.chip,
          height: s.chip,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(124,92,252,0.3), rgba(6,182,212,0.3))',
          border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 16px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        }}
        className="brand-logo-chip"
      >
        {/* Inline SVG mark — star + neural node, always white */}
        <svg
          width={Math.round(s.chip * 0.58)}
          height={Math.round(s.chip * 0.58)}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Outer star points */}
          <path
            d="M12 2L13.8 8.2H20.2L15 11.8L16.8 18L12 14.4L7.2 18L9 11.8L3.8 8.2H10.2L12 2Z"
            fill="url(#star-grad)"
            opacity="0.95"
          />
          {/* Neural node center dot */}
          <circle cx="12" cy="12" r="2" fill="white" opacity="0.9" />
          {/* Connection lines — neural feel */}
          <line x1="12" y1="10" x2="12" y2="5" stroke="white" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
          <line x1="14" y1="13" x2="18" y2="15" stroke="white" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
          <line x1="10" y1="13" x2="6" y2="15" stroke="white" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
          <defs>
            <linearGradient id="star-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="100%" stopColor="#67E8F9" />
            </linearGradient>
          </defs>
        </svg>
      </span>

      {/* Text group */}
      {(showName || showTagline) && (
        <span className="flex flex-col">
          {showName && (
            <span
              className="text-grad font-display font-bold leading-none"
              style={{ fontSize: s.fontSize }}
            >
              {brand.name}
            </span>
          )}
          {showTagline && (
            <span
              className="font-body text-t3"
              style={{ fontSize: s.tagSize, marginTop: 3, letterSpacing: '0.02em' }}
            >
              {brand.tagline}
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (linkTo) {
    return (
      <a href={linkTo} style={{ textDecoration: 'none' }}>
        {inner}
      </a>
    );
  }

  return inner;
}
