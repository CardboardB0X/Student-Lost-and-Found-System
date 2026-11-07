import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-card animate-pulse space-y-3">
    <div className="flex justify-between items-center">
      <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
      <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
    </div>
    <div className="h-6 w-3/4 bg-slate-200 rounded-lg"></div>
    <div className="h-4 w-full bg-slate-100 rounded"></div>
    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
      <div className="h-4 bg-slate-100 rounded"></div>
      <div className="h-4 bg-slate-100 rounded"></div>
    </div>
  </div>
);

export const LoadingSkeleton = ({ count = 4, mode = 'cards' }) => {
  if (mode === 'detail') {
    return (
      <div className="max-w-xl mx-auto p-4 space-y-4 animate-pulse">
        <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-card space-y-4">
          <div className="flex justify-between items-start">
            <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
            <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
          </div>
          <div className="h-7 w-2/3 bg-slate-200 rounded-lg"></div>
          <div className="h-16 bg-slate-100 rounded-xl"></div>
          <div className="h-12 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
