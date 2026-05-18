
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-base-300/60 rounded ${className}`} />
);

const ServiceSkeleton = () => {
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="bg-base-200 p-6 rounded-xl border border-base-300 flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="w-40 h-5" />
          <Skeleton className="w-24 h-3" />
        </div>

        <Skeleton className="w-32 h-10 rounded-lg" />
      </div>

      {/* Mobile cards */}
      <div className="block md:hidden space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-base-200 border border-base-300 rounded-xl p-4 space-y-3"
          >
            <Skeleton className="w-28 h-4" />
            <Skeleton className="w-20 h-3" />

            <div className="flex justify-end gap-2">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-8 h-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-base-200 border border-base-300 rounded-xl p-6">
        <table className="table w-full">
          <thead>
            <tr>
              <th><Skeleton className="w-24 h-3" /></th>
              <th><Skeleton className="w-16 h-3" /></th>
              <th><Skeleton className="w-16 h-3" /></th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                <td><Skeleton className="w-24 h-3" /></td>
                <td><Skeleton className="w-20 h-3" /></td>
                <td>
                  <div className="flex justify-end gap-2">
                    <Skeleton className="w-8 h-8" />
                    <Skeleton className="w-8 h-8" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ServiceSkeleton;