import React from "react";

/**
 * Line icons from lonsolab.com (24x24, stroke 1.8). Inlined so they can be recoloured.
 */
const P: Record<string, React.ReactNode> = {
  pin: (
    <>
      <path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  buscar: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  tel: <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  estrella: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  camara: (
    <>
      <rect x="3" y="6.5" width="13" height="11" rx="2" />
      <path d="M16 10.5l5-3v9l-5-3" />
    </>
  ),
  web: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9h18" />
    </>
  ),
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  ruta: (
    <>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7" />
    </>
  ),
  grafico: <path d="M4 19V5M4 19h16M8 15l3-4 3 2 5-6" />,
  reloj: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  capas: <path d="M12 4l9 5-9 5-9-5zM3 14l9 5 9-5" />,
  equipo: (
    <>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 7a3 3 0 0 1 0 6M17.5 19a5 5 0 0 0-2-4" />
    </>
  ),
};

export type IconName = keyof typeof P;

export const Icon: React.FC<{
  name: IconName;
  size: number;
  color: string;
  strokeWidth?: number;
  fill?: string;
  style?: React.CSSProperties;
}> = ({ name, size, color, strokeWidth = 1.8, fill = "none", style }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={fill}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", ...style }}
  >
    {P[name]}
  </svg>
);
