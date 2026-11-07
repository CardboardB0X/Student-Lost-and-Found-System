import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-card text-center max-w-sm w-full space-y-4">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <Compass className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Page not found</h2>
          <p className="text-xs text-slate-500 mt-1">
            The page or item you requested does not exist.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to LostRadar</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
