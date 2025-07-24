'use client';

import {
  HydrationBoundary as TanstackHydrationBoundary,
  DehydratedState,
} from '@tanstack/react-query';

interface HydrationBoundaryProps {
  children: React.ReactNode;
  dehydratedState: DehydratedState;
}

export function HydrationBoundary({ children, dehydratedState }: HydrationBoundaryProps) {
  return (
    <TanstackHydrationBoundary state={dehydratedState}>
      {children}
    </TanstackHydrationBoundary>
  );
}