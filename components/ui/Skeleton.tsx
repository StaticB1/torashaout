'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-neutral-800/50',
        className
      )}
    />
  );
}

export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-4 w-full', className)} />;
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-12 w-12 rounded-full', className)} />;
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('bg-neutral-900 rounded-xl p-6 space-y-4', className)}>
      <div className="flex items-center gap-4">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <SkeletonText className="w-1/3" />
          <SkeletonText className="w-1/2" />
        </div>
      </div>
      <SkeletonText />
      <SkeletonText className="w-3/4" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-neutral-900 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="w-12 h-4" />
            </div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-neutral-900 rounded-xl p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} className="bg-black/50" />
          ))}
        </div>
        <div className="space-y-6">
          <div className="bg-neutral-900 rounded-xl p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonTalentCard() {
  return (
    <div className="bg-neutral-900 rounded-xl overflow-hidden">
      <Skeleton className="w-full h-48 rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b border-neutral-800">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-neutral-800/50">
          {[...Array(5)].map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
