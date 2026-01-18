import React, { SVGProps } from "react";

export interface LogoIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
  fill?: string;
  size?: number | string;
}

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
      <g fill={fill} transform="translate(4.5,0)">
        <path d="m9 23c0-5.5228 4.4772-10 10-10 5.5229 0 10 4.4772 10 10h9c0-10.4934-8.5066-19-19-19-10.49341 0-18.99999908 8.5066-19 19s8.50659 19 19 19v-9c-5.5228 0-10-4.4771-10-10z" />
        <path d="m29 23c0 5.5228 4.4772 10 10 10v9c-10.4934 0-19-8.5066-19-19z" opacity=".5" />
      </g>
    </svg>
  );
};

export interface LogoProps {
  className?: string;
  iconSize?: number | string;
  textSize?: string;
}

import { Badge } from "@/components/ui/badge";

export const Logo = ({
  className = "",
  iconSize = 34,
  textSize = "1.5rem",
}: LogoProps): React.ReactElement => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoIcon size={iconSize} className="text-foreground" />
      <span
        style={{
          fontSize: textSize,
          fontWeight: 600,
          letterSpacing: "-0.01em",
        }}
        className="text-foreground"
      >
        Quick
      </span>
      <Badge variant="secondary" className="font-bold text-[10px] px-1.5 py-0 h-4 uppercase">
        Beta
      </Badge>
    </div>
  );
};
