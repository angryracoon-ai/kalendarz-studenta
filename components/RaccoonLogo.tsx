
import React from 'react';

export const RaccoonLogo: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Raccoon Face */}
    <circle cx="50" cy="55" r="35" fill="#94a3b8" />
    <path d="M25 45C25 45 30 35 50 35C70 35 75 45 75 45" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
    
    {/* Mask */}
    <rect x="25" y="48" width="50" height="15" rx="7.5" fill="#334155" />
    
    {/* Eyes */}
    <circle cx="38" cy="55" r="4" fill="white" />
    <circle cx="38" cy="55" r="2" fill="black" />
    <circle cx="62" cy="55" r="4" fill="white" />
    <circle cx="62" cy="55" r="2" fill="black" />
    
    {/* Nose */}
    <path d="M47 65L53 65L50 68L47 65Z" fill="#1e293b" />
    
    {/* Graduation Cap */}
    <rect x="25" y="15" width="50" height="6" fill="#1e293b" transform="rotate(-5 50 18)" />
    <path d="M50 8L80 20L50 32L20 20L50 8Z" fill="#1e293b" />
    <path d="M80 20L80 35" stroke="#facc15" strokeWidth="2" />
    <circle cx="80" cy="37" r="3" fill="#facc15" />
  </svg>
);
