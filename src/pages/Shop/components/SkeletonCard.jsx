export default function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-[#E8E2D8] animate-pulse">
      {/* Image Skeleton - 4/5 aspect ratio */}
      <div className="w-full aspect-[4/5] bg-gray-100" />

      {/* Info Skeleton */}
      <div className="p-4 flex flex-col flex-1">
        <div className="w-16 h-3 bg-gray-200 rounded mb-2" />
        <div className="w-3/4 h-4 bg-gray-200 rounded mb-3" />
        <div className="w-24 h-3 bg-gray-200 rounded mb-4" />
        <div className="w-20 h-4 bg-gray-200 rounded mt-auto mb-4" />
        <div className="w-full h-8 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
