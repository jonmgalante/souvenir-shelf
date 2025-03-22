
import React from 'react';
import { Skeleton } from '../ui/skeleton';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square" />
          <Skeleton className="h-4" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
