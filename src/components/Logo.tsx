/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

import emblemPng from '../assets/logo-emblem.png';
import emblemPng2x from '../assets/logo-emblem@2x.png';
import emblemWebp from '../assets/logo-emblem.webp';
import emblemWebp2x from '../assets/logo-emblem@2x.webp';

/**
 * Brand colours sampled from the emblem artwork. Kept here as constants so the
 * upcoming light-palette conversion has a single place to swap them.
 */
const NAVY = '#1F3A5F';
const MINT = '#A9D9D5';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  /**
   * 'emblem' is the full illustrated badge, 'mark' the LL monogram.
   * 'auto' (the default) picks the mark at small sizes, where the detail in the
   * emblem would be illegible, and the emblem at large ones.
   */
  variant?: 'auto' | 'emblem' | 'mark';
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-24 h-24',
  lg: 'w-40 h-40',
  xl: 'w-56 h-56',
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

const subTextSizes = {
  sm: 'text-[9px]',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-base',
};

/** The LL monogram badge, drawn flat so it stays crisp down to 32px. */
function Mark({title}: {title?: string}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
    >
      <circle cx="50" cy="50" r="46" fill={MINT} stroke={NAVY} strokeWidth="4" />
      <circle
        cx="50"
        cy="50"
        r="39"
        fill="none"
        stroke={NAVY}
        strokeWidth="1.25"
        opacity="0.45"
      />
      <text
        x="50"
        y="50"
        fill={NAVY}
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontStyle="italic"
        fontWeight="600"
        fontSize="46"
        letterSpacing="-2"
        textAnchor="middle"
        dominantBaseline="central"
      >
        LL
      </text>
    </svg>
  );
}

/** The full illustrated badge. */
function Emblem({alt}: {alt: string}) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${emblemWebp} 1x, ${emblemWebp2x} 2x`}
      />
      <img
        src={emblemPng}
        srcSet={`${emblemPng} 1x, ${emblemPng2x} 2x`}
        alt={alt}
        width={512}
        height={512}
        className="w-full h-full object-contain"
        loading="eager"
        decoding="async"
      />
    </picture>
  );
}

export default function Logo({
  className = '',
  size = 'md',
  showText = true,
  variant = 'auto',
}: LogoProps) {
  const resolved =
    variant === 'auto' ? (size === 'sm' || size === 'md' ? 'mark' : 'emblem') : variant;

  // When the wordmark is alongside it the artwork is decorative, so it should
  // not be announced twice.
  const label = showText ? '' : 'The Laundry Ladies';

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div
        className={`${sizeClasses[size]} relative flex items-center justify-center ${
          resolved === 'emblem' ? 'animate-float' : ''
        }`}
      >
        {resolved === 'emblem' ? (
          <Emblem alt={label} />
        ) : (
          <Mark title={label || undefined} />
        )}
      </div>

      {showText && (
        <div className="text-center mt-3 font-serif">
          <h1
            className={`${textSizes[size]} font-bold tracking-[0.18em] text-navy-700 uppercase leading-none`}
          >
            The Laundry Ladies
          </h1>
          <p
            className={`${subTextSizes[size]} tracking-[0.35em] text-navy-500 font-light mt-1.5 uppercase`}
          >
            Est. 2026
          </p>
        </div>
      )}
    </div>
  );
}
