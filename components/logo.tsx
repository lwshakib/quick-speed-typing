import React, { SVGProps } from "react";

// Interface for the SVG icon part of the logo
export interface LogoIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
  fill?: string;
  size?: number | string;
}

/**
 * LogoIcon: A custom SVG component representing the "Quick Type" brand.
 * Designed with a geometric, minimalist aesthetic to match the app's premium feel.
 */
export const LogoIcon = ({
  className,
  fill = "currentColor",
  size = 24,
  ...rest
}: LogoIconProps): React.ReactElement => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      className={className}
      {...rest}
    >
      {/* Decorative grouping with a subtle offset for the icon's paths */}
      <g fill={fill} transform="translate(4.5,0)">
          {/* Main circular path representing the core of the logo */}
        <path d="m9 23c0-5.5228 4.4772-10 10-10 5.5229 0 10 4.4772 10 10h9c0-10.4934-8.5066-19-19-19-10.49341 0-18.99999908 8.5066-19 19s8.50659 19 19 19v-9c-5.5228 0-10-4.4771-10-10z" />
        {/* Semi-transparent accent path for visual depth */}
        <path d="m29 23c0 5.5228 4.4772 10 10 10v9c-10.4934 0-19-8.5066-19-19z" opacity=".5" />
      </g>
    </svg>
  );
};

// Interface for the full Logo component (Icon + Text)
export interface LogoProps {
  className?: string;
  iconSize?: number | string;
  textSize?: string;
  hideText?: boolean;
}

import { Badge } from "@/components/ui/badge";

/**
 * Logo: The primary branding component used in the Header, Footer, and other areas.
 * It combines the LogoIcon with stylized text using the application's global theme variables.
 */
export const Logo = ({
  className = "",
  iconSize = 32,
  textSize = "1.5rem",
  hideText = false,
}: LogoProps): React.ReactElement => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* The brand icon, colored via the CSS variable --main-color */}
      <LogoIcon size={iconSize} style={{ color: 'var(--main-color)' }} />
      
      {/* Container for the text portion, allowing for programmatic hiding during focus mode */}
      <div className={`flex flex-col leading-none transition-all duration-500 ${hideText ? "opacity-30" : "opacity-100"}`}>
        <span
          style={{
            fontSize: textSize,
            fontWeight: 800,
            letterSpacing: "-0.05em",
            color: 'var(--text-color)'
          }}
          className="lowercase"
        >
          quicktype
        </span>
      </div>
    </div>
  );
};

