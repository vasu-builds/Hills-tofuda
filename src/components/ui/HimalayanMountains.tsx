'use client'

import { useRef, useEffect } from 'react'

interface MountainsProps {
  scrollY?: number
}

export default function HimalayanMountains({ scrollY = 0 }: MountainsProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Layer 3 — Far mountains (darkest, moves slowest) */}
      <div
        className="mountain-layer"
        style={{ transform: `translateY(${scrollY * 0.05}px)` }}
      >
        <svg
          viewBox="0 0 1440 500"
          preserveAspectRatio="xMidYMax meet"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="mtGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0F2E1A" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0F2E1A" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <path
            d="M0,500 L0,280 L60,240 L120,200 L180,170 L240,190 L300,145 L380,120 L440,150 L500,110 L560,90 L630,115 L700,80 L760,100 L820,70 L880,95 L940,65 L1000,90 L1060,110 L1120,80 L1180,105 L1240,85 L1300,120 L1360,100 L1440,130 L1440,500 Z"
            fill="url(#mtGrad3)"
          />
        </svg>
      </div>

      {/* Layer 2 — Mid mountains */}
      <div
        className="mountain-layer"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        <svg
          viewBox="0 0 1440 500"
          preserveAspectRatio="xMidYMax meet"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="mtGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1A4D2E" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1A4D2E" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d="M0,500 L0,350 L80,300 L160,260 L220,290 L290,240 L360,200 L430,230 L500,195 L570,220 L640,180 L710,210 L790,170 L860,195 L930,160 L1000,185 L1070,200 L1140,175 L1210,195 L1280,210 L1360,185 L1440,200 L1440,500 Z"
            fill="url(#mtGrad2)"
          />
          {/* Snow caps */}
          <path
            d="M360,200 L375,215 L350,215 Z M640,180 L658,198 L622,198 Z M930,160 L950,180 L910,180 Z"
            fill="rgba(255,255,255,0.3)"
          />
        </svg>
      </div>

      {/* Layer 1 — Foreground hills (lightest, moves fastest) */}
      <div
        className="mountain-layer"
        style={{ transform: `translateY(${scrollY * 0.18}px)` }}
      >
        <svg
          viewBox="0 0 1440 500"
          preserveAspectRatio="xMidYMax meet"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="mtGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2D7A45" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2D7A45" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          <path
            d="M0,500 L0,420 L120,380 L240,340 L320,370 L400,335 L480,360 L560,320 L640,350 L720,310 L800,340 L880,305 L960,330 L1040,295 L1120,320 L1200,335 L1280,310 L1360,330 L1440,315 L1440,500 Z"
            fill="url(#mtGrad1)"
          />
        </svg>
      </div>

      {/* Pine trees silhouette at bottom */}
      <div className="mountain-layer" style={{ transform: `translateY(${scrollY * 0.22}px)` }}>
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="xMidYMax meet"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          aria-hidden
        >
          <g fill="rgba(26,77,46,0.08)">
            {/* Pine tree silhouettes */}
            {[0, 80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880, 960, 1040, 1120, 1200, 1280, 1360].map((x, i) => (
              <g key={i} transform={`translate(${x + (i % 3) * 20}, 0)`}>
                <polygon points={`0,200 15,140 8,145 20,80 12,88 22,40 32,88 24,80 36,145 29,140 44,200`} />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
