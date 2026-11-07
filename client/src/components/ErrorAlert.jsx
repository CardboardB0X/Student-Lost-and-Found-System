import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorAlert = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 my-3 shadow-card">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-100 rounded-xl text-red-600 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-red-900">Connection Error</h4>
          <p className="text-xs text-red-700 mt-0.5 leading-relaxed break-words">
            {message || 'Unable to load items. Please verify the server is running and try again.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all min-h-[44px]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
