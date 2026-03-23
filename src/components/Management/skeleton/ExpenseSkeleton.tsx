import React from "react";

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-base-300/60 rounded ${className}`} />
);

const ExpenseSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-base-200 p-6 rounded-xl border border-base-300 flex items-center gap-4"
          >
            <SkeletonBlock className="w-12 h-12 rounded-xl" />

            <div className="space-y-2 w-full">
              <SkeletonBlock className="w-24 h-3" />
              <SkeletonBlock className="w-32 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* TABLE CARD */}
      <div className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden">

        {/* HEADER */}
        <div className="p-6 border-b border-base-300 flex justify-between items-center">
          <div className="space-y-2">
            <SkeletonBlock className="w-40 h-5" />
            <SkeletonBlock className="w-24 h-3" />
          </div>

          <SkeletonBlock className="w-32 h-10 rounded-lg" />
        </div>

        {/* MOBILE LIST */}
        <div className="block md:hidden space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-base-100 border border-base-300 rounded-xl p-4 space-y-3"
            >
              <SkeletonBlock className="w-20 h-3" />
              <SkeletonBlock className="w-32 h-4" />
              <SkeletonBlock className="w-24 h-3" />

              <div className="flex justify-end gap-2">
                <SkeletonBlock className="w-8 h-8 rounded" />
                <SkeletonBlock className="w-8 h-8 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto p-6">
          <table className="table w-full">
            <thead>
              <tr>
                <th><SkeletonBlock className="w-16 h-3" /></th>
                <th><SkeletonBlock className="w-16 h-3" /></th>
                <th><SkeletonBlock className="w-16 h-3" /></th>
                <th><SkeletonBlock className="w-16 h-3" /></th>
                <th><SkeletonBlock className="w-16 h-3" /></th>
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td><SkeletonBlock className="w-24 h-3" /></td>
                  <td><SkeletonBlock className="w-20 h-3" /></td>
                  <td><SkeletonBlock className="w-28 h-3" /></td>
                  <td><SkeletonBlock className="w-16 h-3 ml-auto" /></td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <SkeletonBlock className="w-8 h-8 rounded" />
                      <SkeletonBlock className="w-8 h-8 rounded" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default ExpenseSkeleton;