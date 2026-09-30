import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge('animate-pulse rounded-md bg-slate-200', className)}
      {...props}
    />
  );
}
