import React from "react";

export default function AnalysisSkeletons() {
  return (
    <div className="font-manrope max-w-7xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="skeleton h-10 w-72" />
            <div className="skeleton h-4 w-96" />
          </div>
          <div className="flex gap-2">
            <div className="skeleton h-10 w-24" />
            <div className="skeleton h-10 w-28" />
            <div className="skeleton h-10 w-28" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="skeleton h-10 flex-1" />
          <div className="skeleton h-10 w-32" />
          <div className="skeleton h-10 w-32" />
        </div>
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="premium-card p-5 space-y-3">
            <div className="flex justify-between">
              <div className="skeleton h-9 w-9 rounded-lg" />
              <div className="skeleton h-4 w-10" />
            </div>
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-7 w-16" />
          </div>
        ))}
      </div>

      {/* Status panel skeleton */}
      <div className="premium-card p-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton h-10 w-10 rounded-xl" />
              <div className="space-y-1.5">
                <div className="skeleton h-3 w-20" />
                <div className="skeleton h-5 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts skeleton */}
      <div className="premium-card p-6 space-y-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="skeleton h-9 w-9 rounded-xl" />
            <div className="space-y-1.5">
              <div className="skeleton h-5 w-32" />
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="skeleton h-8 w-24 rounded-lg" />
            <div className="skeleton h-8 w-24 rounded-lg" />
          </div>
        </div>
        <div className="skeleton h-[280px] w-full rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="premium-card overflow-hidden">
        <div className="skeleton h-10 w-full" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-t border-border/40 p-4">
            <div className="flex items-center gap-4">
              <div className="skeleton h-4 w-20" />
              <div className="skeleton h-4 flex-1" />
              <div className="skeleton h-6 w-16 rounded-lg" />
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-8 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}