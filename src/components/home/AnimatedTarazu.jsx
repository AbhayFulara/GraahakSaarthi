import logoImg from '../../assets/logo/graahaksaarthi-logo.png';
import './AnimatedTarazu.css';

/**
 * Animated Indian-style Weighing Scale (Tarazu) representing fairness,
 * consumer empowerment, and justice between CONSUMER (left) and JUSTICE (right).
 */
export function AnimatedTarazu() {
  return (
    <div
      className="gs-tarazu-stage"
      aria-label="Animated weighing scale balancing Consumer and Justice"
    >
      <div className="gs-tarazu-aura">
        <svg
          className="gs-tarazu-svg"
          viewBox="0 0 400 364"
          role="img"
          aria-label="Tarazu balancing scale with Consumer on the left plate, Justice on the right plate, and the GraahakSaarthi logo at the central pivot"
        >
          <defs>
            {/* 3D Cylindrical Navy Gradient (Central Vertical Column) */}
            <linearGradient id="gs-t-navy-cyl" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--tarazu-navy-deep)" />
              <stop offset="28%" stopColor="var(--tarazu-navy-mid)" />
              <stop offset="44%" stopColor="var(--tarazu-navy-specular)" />
              <stop offset="72%" stopColor="var(--tarazu-navy-base)" />
              <stop offset="100%" stopColor="var(--tarazu-navy-deep)" />
            </linearGradient>

            {/* 3D Sculpted Navy Gradient (Horizontal Beam & Base Tiers) */}
            <linearGradient id="gs-t-beam-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--tarazu-navy-specular)" />
              <stop offset="28%" stopColor="var(--tarazu-navy-mid)" />
              <stop offset="72%" stopColor="var(--tarazu-navy-base)" />
              <stop offset="100%" stopColor="var(--tarazu-navy-deep)" />
            </linearGradient>

            {/* 3D Base Horizontal Tier Gradient */}
            <linearGradient id="gs-t-base-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--tarazu-navy-deep)" />
              <stop offset="30%" stopColor="var(--tarazu-navy-mid)" />
              <stop offset="50%" stopColor="var(--tarazu-navy-specular)" />
              <stop offset="70%" stopColor="var(--tarazu-navy-mid)" />
              <stop offset="100%" stopColor="var(--tarazu-navy-deep)" />
            </linearGradient>

            {/* 3D Spherical End-Knob Radial Gradient */}
            <radialGradient id="gs-t-knob-grad" cx="35%" cy="30%" r="68%">
              <stop offset="0%" stopColor="var(--tarazu-navy-highlight)" />
              <stop offset="42%" stopColor="var(--tarazu-navy-mid)" />
              <stop offset="85%" stopColor="var(--tarazu-navy-base)" />
              <stop offset="100%" stopColor="var(--tarazu-navy-deep)" />
            </radialGradient>

            {/* 3D GraahakSaarthi Green Gradient (Rims, Pivot Bezel, Base Tier) */}
            <linearGradient id="gs-t-green-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--tarazu-green-dark)" />
              <stop offset="35%" stopColor="var(--tarazu-green-light)" />
              <stop offset="65%" stopColor="var(--tarazu-green-mid)" />
              <stop offset="100%" stopColor="var(--tarazu-green-dark)" />
            </linearGradient>

            {/* Top Leaf Finial Gradient */}
            <linearGradient id="gs-t-leaf-grad" x1="15%" y1="10%" x2="85%" y2="90%">
              <stop offset="0%" stopColor="var(--tarazu-green-light)" />
              <stop offset="55%" stopColor="var(--tarazu-green-mid)" />
              <stop offset="100%" stopColor="var(--tarazu-green-dark)" />
            </linearGradient>

            {/* 3D Curved Weighing Pan Bowl Gradient */}
            <linearGradient id="gs-t-bowl-grad" x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="var(--tarazu-navy-mid)" />
              <stop offset="45%" stopColor="var(--tarazu-navy-base)" />
              <stop offset="100%" stopColor="var(--tarazu-navy-deep)" />
            </linearGradient>

            {/* Clean White / Light-Neutral Plate Surface Gradient */}
            <linearGradient id="gs-t-plate-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="72%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e8eff7" />
            </linearGradient>

            {/* 3D Suspension Chain / Rod Gradient */}
            <linearGradient id="gs-t-chain-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--tarazu-navy-deep)" />
              <stop offset="50%" stopColor="var(--tarazu-navy-specular)" />
              <stop offset="100%" stopColor="var(--tarazu-navy-deep)" />
            </linearGradient>

            {/* Soft Elliptical Ground Shadow */}
            <radialGradient id="gs-t-shadow-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--tarazu-shadow)" />
              <stop offset="70%" stopColor="var(--tarazu-shadow)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--tarazu-shadow)" stopOpacity="0" />
            </radialGradient>

            {/* Subtle Medallion Depth Shadow */}
            <filter id="gs-t-medallion-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#091323" floodOpacity="0.28" />
            </filter>

            {/* Subtle Pan Drop Shadow */}
            <filter id="gs-t-pan-shadow" x="-15%" y="-15%" width="130%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#091323" floodOpacity="0.16" />
            </filter>

            {/* Circular Clip for Official Logo */}
            <clipPath id="gs-t-logo-clip">
              <circle cx="200" cy="112" r="35" />
            </clipPath>
          </defs>

          {/* 1. STATIONARY MULTI-LAYERED BASE */}
          <g className="gs-tarazu-base">
            {/* Soft Ground Shadow */}
            <ellipse cx="200" cy="348" rx="112" ry="10" fill="url(#gs-t-shadow-grad)" />

            {/* Tier 1: Bottom Wide Navy Plinth */}
            <path
              d="M 106 343 C 106 335, 113 328, 123 328 L 277 328 C 287 328, 294 335, 294 343 C 294 345.5, 291 347, 286 347 L 114 347 C 109 347, 106 345.5, 106 343 Z"
              fill="url(#gs-t-base-grad)"
              stroke="var(--tarazu-rim-stroke)"
              strokeWidth="0.8"
            />
            <line
              x1="122"
              y1="329.5"
              x2="278"
              y2="329.5"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Tier 2: GraahakSaarthi Green Accent Band */}
            <path
              d="M 127 328 C 127 321, 132 316, 141 316 L 259 316 C 268 316, 273 321, 273 328 Z"
              fill="url(#gs-t-green-grad)"
            />
            <line
              x1="139"
              y1="317.4"
              x2="261"
              y2="317.4"
              stroke="rgba(255,255,255,0.34)"
              strokeWidth="0.9"
              strokeLinecap="round"
            />

            {/* Tier 3: Stepped Navy Collar */}
            <path
              d="M 146 316 C 146 310, 151 305, 159 305 L 241 305 C 249 305, 254 310, 254 316 Z"
              fill="url(#gs-t-base-grad)"
              stroke="var(--tarazu-rim-stroke)"
              strokeWidth="0.7"
            />

            {/* Tier 4: Upper Pedestal Shoulder */}
            <path
              d="M 164 305 C 164 298, 169 294, 177 294 L 223 294 C 231 294, 236 298, 236 305 Z"
              fill="url(#gs-t-base-grad)"
              stroke="var(--tarazu-rim-stroke)"
              strokeWidth="0.7"
            />

            {/* Column Socket Flange */}
            <rect
              x="178"
              y="286.5"
              width="44"
              height="8"
              rx="4"
              fill="url(#gs-t-navy-cyl)"
              stroke="var(--tarazu-rim-stroke)"
              strokeWidth="0.7"
            />
          </g>

          {/* 2. STATIONARY CENTRAL VERTICAL SUPPORTING COLUMN */}
          <g className="gs-tarazu-stand">
            <path
              d="M 183 288 L 189 112 L 211 112 L 217 288 Z"
              fill="url(#gs-t-navy-cyl)"
              stroke="var(--tarazu-rim-stroke)"
              strokeWidth="0.7"
            />
            {/* Subtle 3D Specular Highlight along left-center of column */}
            <path
              d="M 192.5 285 L 195.5 130 L 199.5 130 L 197.5 285 Z"
              fill="rgba(255, 255, 255, 0.16)"
            />
          </g>

          {/* 3. ROTATING HORIZONTAL BEAM + SUSPENDED CHAINS & WEIGHING PLATES */}
          <g className="gs-tarazu-beam-assembly">
            {/* Horizontal Balancing Beam */}
            <g className="gs-tarazu-beam">
              <path
                d="M 200 96 C 160 96, 134 114, 74 109 L 74 118 C 136 123, 162 117, 200 117 C 238 117, 264 123, 326 118 L 326 109 C 266 114, 240 96, 200 96 Z"
                fill="url(#gs-t-beam-grad)"
                stroke="var(--tarazu-rim-stroke)"
                strokeWidth="0.8"
              />
              {/* Subtle top-edge highlight on beam */}
              <path
                d="M 83 111 C 138 114, 164 98, 200 98 C 236 98, 262 114, 317 111"
                fill="none"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1.1"
                strokeLinecap="round"
              />

              {/* Left Spherical End-Knob & Suspension Eyelet */}
              <circle cx="72" cy="113" r="10.5" fill="url(#gs-t-knob-grad)" />
              <ellipse cx="69" cy="109" rx="3.2" ry="2" fill="rgba(255, 255, 255, 0.28)" />
              <rect x="68.5" y="121" width="7" height="3.5" rx="1.5" fill="url(#gs-t-navy-cyl)" />
              <circle
                cx="72"
                cy="126.5"
                r="3.8"
                fill="none"
                stroke="var(--tarazu-navy-specular)"
                strokeWidth="2.2"
              />

              {/* Right Spherical End-Knob & Suspension Eyelet */}
              <circle cx="328" cy="113" r="10.5" fill="url(#gs-t-knob-grad)" />
              <ellipse cx="325" cy="109" rx="3.2" ry="2" fill="rgba(255, 255, 255, 0.28)" />
              <rect x="324.5" y="121" width="7" height="3.5" rx="1.5" fill="url(#gs-t-navy-cyl)" />
              <circle
                cx="328"
                cy="126.5"
                r="3.8"
                fill="none"
                stroke="var(--tarazu-navy-specular)"
                strokeWidth="2.2"
              />
            </g>

            {/* Left Hanging Assembly (Counter-rotates around left eyelet 72, 126.5) */}
            <g className="gs-tarazu-hang-left">
              {/* Left Chain Assembly */}
              <g className="gs-tarazu-left-chains">
                <line
                  x1="72"
                  y1="127"
                  x2="20"
                  y2="241"
                  stroke="url(#gs-t-chain-grad)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <line
                  x1="72"
                  y1="127"
                  x2="20"
                  y2="241"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                />
                <line
                  x1="72"
                  y1="127"
                  x2="124"
                  y2="241"
                  stroke="url(#gs-t-chain-grad)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <line
                  x1="72"
                  y1="127"
                  x2="124"
                  y2="241"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                />
                {/* Top & Rim Connector Pins */}
                <circle cx="72" cy="126.5" r="2.6" fill="var(--tarazu-navy-highlight)" />
                <circle cx="20" cy="241" r="2.8" fill="var(--tarazu-navy-mid)" />
                <circle cx="124" cy="241" r="2.8" fill="var(--tarazu-navy-mid)" />
              </g>

              {/* Left Weighing Plate (CONSUMER) */}
              <g className="gs-tarazu-left-plate" filter="url(#gs-t-pan-shadow)">
                {/* Clean White / Light-Neutral Plate Surface */}
                <path
                  d="M 19 242 C 18 202, 38 184, 72 184 C 106 184, 126 202, 125 242 Z"
                  fill="url(#gs-t-plate-grad)"
                  stroke="var(--tarazu-plate-stroke)"
                  strokeWidth="1.2"
                />
                {/* Subtle Inner Top Highlight Arc */}
                <path
                  d="M 32 204 C 42 191, 56 187, 72 187 C 88 187, 102 191, 112 204"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.85)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* CONSUMER Label */}
                <text
                  x="72"
                  y="226"
                  textAnchor="middle"
                  className="gs-tarazu-plate-text gs-tarazu-plate-text--consumer"
                >
                  CONSUMER
                </text>

                {/* Green Pan Rim */}
                <rect
                  x="13"
                  y="241"
                  width="118"
                  height="6.5"
                  rx="3.25"
                  fill="url(#gs-t-green-grad)"
                />
                <line
                  x1="17"
                  y1="242.5"
                  x2="127"
                  y2="242.5"
                  stroke="rgba(255, 255, 255, 0.42)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                />

                {/* 3D Navy Bowl */}
                <path
                  d="M 15 247.5 C 22 282, 122 282, 129 247.5 Z"
                  fill="url(#gs-t-bowl-grad)"
                  stroke="var(--tarazu-rim-stroke)"
                  strokeWidth="0.7"
                />
                <path
                  d="M 28 256 C 40 271, 68 275, 92 271"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.16)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            </g>

            {/* Right Hanging Assembly (Counter-rotates around right eyelet 328, 126.5) */}
            <g className="gs-tarazu-hang-right">
              {/* Right Chain Assembly */}
              <g className="gs-tarazu-right-chains">
                <line
                  x1="328"
                  y1="127"
                  x2="276"
                  y2="241"
                  stroke="url(#gs-t-chain-grad)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <line
                  x1="328"
                  y1="127"
                  x2="276"
                  y2="241"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                />
                <line
                  x1="328"
                  y1="127"
                  x2="380"
                  y2="241"
                  stroke="url(#gs-t-chain-grad)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <line
                  x1="328"
                  y1="127"
                  x2="380"
                  y2="241"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                />
                {/* Top & Rim Connector Pins */}
                <circle cx="328" cy="126.5" r="2.6" fill="var(--tarazu-navy-highlight)" />
                <circle cx="276" cy="241" r="2.8" fill="var(--tarazu-navy-mid)" />
                <circle cx="380" cy="241" r="2.8" fill="var(--tarazu-navy-mid)" />
              </g>

              {/* Right Weighing Plate (JUSTICE) */}
              <g className="gs-tarazu-right-plate" filter="url(#gs-t-pan-shadow)">
                {/* Clean White / Light-Neutral Plate Surface */}
                <path
                  d="M 275 242 C 274 202, 294 184, 328 184 C 362 184, 382 202, 381 242 Z"
                  fill="url(#gs-t-plate-grad)"
                  stroke="var(--tarazu-plate-stroke)"
                  strokeWidth="1.2"
                />
                {/* Subtle Inner Top Highlight Arc */}
                <path
                  d="M 288 204 C 298 191, 312 187, 328 187 C 344 187, 358 191, 368 204"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.85)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* JUSTICE Label */}
                <text
                  x="328"
                  y="226"
                  textAnchor="middle"
                  className="gs-tarazu-plate-text gs-tarazu-plate-text--justice"
                >
                  JUSTICE
                </text>

                {/* Green Pan Rim */}
                <rect
                  x="269"
                  y="241"
                  width="118"
                  height="6.5"
                  rx="3.25"
                  fill="url(#gs-t-green-grad)"
                />
                <line
                  x1="273"
                  y1="242.5"
                  x2="383"
                  y2="242.5"
                  stroke="rgba(255, 255, 255, 0.42)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                />

                {/* 3D Navy Bowl */}
                <path
                  d="M 271 247.5 C 278 282, 378 282, 385 247.5 Z"
                  fill="url(#gs-t-bowl-grad)"
                  stroke="var(--tarazu-rim-stroke)"
                  strokeWidth="0.7"
                />
                <path
                  d="M 284 256 C 296 271, 324 275, 348 271"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.16)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            </g>
          </g>

          {/* 4. STATIONARY CENTRAL PIVOT HOUSING & TOP FINIAL */}
          <g className="gs-tarazu-pivot" filter="url(#gs-t-medallion-shadow)">
            {/* Top GraahakSaarthi Green Leaf Finial */}
            <path
              d="M 200 36 C 211 47, 212 64, 200 72 C 188 64, 189 47, 200 36 Z"
              fill="url(#gs-t-leaf-grad)"
              stroke="var(--tarazu-green-dark)"
              strokeWidth="0.7"
            />
            <path
              d="M 200 41 L 200 68"
              stroke="rgba(255, 255, 255, 0.35)"
              strokeWidth="1.1"
              strokeLinecap="round"
            />

            {/* Outer Green Pivot Bezel */}
            <circle cx="200" cy="112" r="42.5" fill="url(#gs-t-green-grad)" />
            <circle
              cx="200"
              cy="112"
              r="41"
              fill="none"
              stroke="rgba(255, 255, 255, 0.28)"
              strokeWidth="0.9"
            />
            {/* Clean Circular Navy Border */}
            <circle cx="200" cy="112" r="38.5" fill="#142c49" />
            {/* Crisp White Backdrop Disc */}
            <circle cx="200" cy="112" r="36.5" fill="#ffffff" />
          </g>

          {/* 5. OFFICIAL GRAAHAKSAARTHI LOGO AT CENTRAL PIVOT */}
          <g className="gs-tarazu-logo">
            <image
              href={logoImg}
              x="165"
              y="77"
              width="70"
              height="70"
              preserveAspectRatio="xMidYMid meet"
              clipPath="url(#gs-t-logo-clip)"
            />
          </g>
        </svg>
      </div>

      <p className="gs-tarazu-caption">RIGHTS · EVIDENCE · RESOLUTION</p>
    </div>
  );
}
