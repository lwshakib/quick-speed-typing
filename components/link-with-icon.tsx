'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import React from 'react';

interface LinkWithIconProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isExternal?: boolean;
  className?: string;
}

export function LinkWithIcon({
  href,
  icon,
  text,
  isExternal = false,
  className,
}: LinkWithIconProps) {
  const content = (
    <>
      <span className="group-hover:text-primary opacity-60 transition-colors">{icon}</span>
      {text}
    </>
  );

  const classes = cn(
    'hover:text-foreground transition-colors flex items-center gap-1.5 group',
    className,
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
