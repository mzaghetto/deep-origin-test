import React from 'react';
import styles from '../styles/Home.module.css';

export default function Logo() {
  return (
    <svg
      className={styles.logo}
      viewBox="0 0 200 180"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="40" y="40" width="120" height="80" rx="8" fill="#1E88E5" />
      <rect x="48" y="48" width="104" height="64" rx="4" fill="#FFFFFF" />
      <circle cx="56" cy="56" r="4" fill="#1E88E5" />
      <circle cx="68" cy="56" r="4" fill="#1E88E5" />
      <circle cx="80" cy="56" r="4" fill="#1E88E5" />
      <path
        d="M90 90 L110 70 A10 10 0 0 1 125 85 L105 105 A10 10 0 0 1 90 90"
        fill="none"
        stroke="#00ACC1"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M110 110 L90 130 A10 10 0 0 1 75 115 L95 95 A10 10 0 0 1 110 110"
        fill="none"
        stroke="#00ACC1"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <line x1="75" y1="75" x2="125" y2="125" stroke="#000000" strokeWidth="6" />
    </svg>
  );
}