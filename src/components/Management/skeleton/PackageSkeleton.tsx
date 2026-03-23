import React from "react";

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-base-300/60 rounded ${className}`} />
);

const PackageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">

      {/* Header Skeleton */}
      <div className="bg-base-200 p-6 rounded-xl border border-base-300 flex justify-between items-center">

        <div className="space-y-2">
          <SkeletonBlock className="w-40 h-5" />
          <SkeletonBlock className="w-24 h-3" />
        </div>

        <SkeletonBlock className="w-32 h-10 rounded-lg" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-base-200 border border-base-300 rounded-xl overflow-hidden"
          >

            {/* header */}
            <div className="p-5 border-b border-base-300 flex justify-between">
              <SkeletonBlock className="w-24 h-4" />
              <SkeletonBlock className="w-16 h-4" />
            </div>

            {/* services */}
            <div className="p-5 space-y-3">
              <SkeletonBlock className="w-20 h-3" />

              <div className="flex flex-wrap gap-2">
                <SkeletonBlock className="w-16 h-5" />
                <SkeletonBlock className="w-20 h-5" />
                <SkeletonBlock className="w-12 h-5" />
              </div>
            </div>

            {/* actions */}
            <div className="p-3 flex justify-end gap-2">
              <SkeletonBlock className="w-8 h-8 rounded" />
              <SkeletonBlock className="w-8 h-8 rounded" />
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default PackageSkeleton;