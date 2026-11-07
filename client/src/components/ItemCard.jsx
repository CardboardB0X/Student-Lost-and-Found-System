import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Building2, ChevronRight, HelpCircle, Compass } from 'lucide-react';
import StatusBadge from './StatusBadge';

export const ItemCard = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  const formattedDate = item.dateFound
    ? new Date(item.dateFound).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  const hasImage = Boolean(item.imageUrl) && !imageError;
  const isLostReport = item.itemType === 'LOST';

  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-card hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Optional Image Header */}
        {hasImage ? (
          <div className="relative w-full h-40 bg-slate-100 overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs">
                {item.category}
              </span>
              <StatusBadge status={item.status} />
            </div>
            {isLostReport && (
              <div className="absolute bottom-2 left-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-xs">
                  Lost Report
                </span>
              </div>
            )}
          </div>
        ) : null}

        <div className="p-4">
          {/* Header row if no image */}
          {!hasImage && (
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700">
                  {item.category}
                </span>
                {isLostReport && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    Lost Report
                  </span>
                )}
              </div>
              <StatusBadge status={item.status} />
            </div>
          )}

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 line-clamp-1">
            <Link to={`/items/${item._id}`} className="hover:text-blue-600 transition-colors">
              {item.title}
            </Link>
          </h3>

          {/* Description */}
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Details */}
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{item.locationFound}</span>
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{item.custodyLocation || (isLostReport ? 'Lost by Owner' : 'With Finder')}</span>
            </div>

            {formattedDate && (
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-3.5 pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
          By: {item.contactInfo?.founderName || 'Campus User'}
        </span>

        <Link
          to={`/items/${item._id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 min-h-[38px] px-2 py-1 rounded-lg hover:bg-blue-50 active:bg-blue-100 transition-colors"
        >
          <span>View</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
};

export default ItemCard;
