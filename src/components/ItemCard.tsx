import React, { useState } from 'react';
import { ReportItem } from '../types';
import {
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Package,
  Laptop,
  CreditCard,
  BookOpen,
  Key,
  Briefcase,
  Shirt,
  Dumbbell,
  ArrowRight,
  ShieldAlert,
  Building
} from 'lucide-react';

interface ItemCardProps {
  item: ReportItem;
  onViewDetails: (item: ReportItem) => void;
  onClaimItem?: (item: ReportItem) => void;
  isReporter?: boolean;
}

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Electronics':
      return <Laptop className="w-4 h-4" />;
    case 'ID & Cards':
      return <CreditCard className="w-4 h-4" />;
    case 'Books & Notes':
      return <BookOpen className="w-4 h-4" />;
    case 'Keys & Access':
      return <Key className="w-4 h-4" />;
    case 'Bags & Wallets':
      return <Briefcase className="w-4 h-4" />;
    case 'Clothing & Gear':
      return <Shirt className="w-4 h-4" />;
    case 'Sports Equipment':
      return <Dumbbell className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onViewDetails,
}) => {
  const [imageError, setImageError] = useState(false);

  const getStatusDisplay = (status: ReportItem['status']) => {
    switch (status) {
      case 'open':
        return {
          label: 'Open',
          badgeClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60',
          dotClass: 'bg-emerald-500',
        };
      case 'claim_pending':
        return {
          label: 'In Verification',
          badgeClass: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60',
          dotClass: 'bg-amber-500 animate-pulse',
        };
      case 'resolved':
        return {
          label: 'Handed Over',
          badgeClass: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
          dotClass: 'bg-slate-400',
        };
    }
  };

  const statusInfo = getStatusDisplay(item.status);
  const isLost = item.type === 'lost';

  return (
    <article
      onClick={() => onViewDetails(item)}
      className="group relative flex flex-col bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/40 dark:hover:border-teal-500/40 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden focus-within:ring-2 focus-within:ring-teal-500"
    >
      {/* Top Image or Fallback Container */}
      <div className="relative w-full aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden border-b border-slate-100 dark:border-slate-800/70">
        {item.imageUrl && !imageError ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-400 dark:text-slate-500 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-850 dark:via-slate-800 dark:to-slate-750">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700/80 shadow-xs flex items-center justify-center text-slate-700 dark:text-slate-200 mb-2 group-hover:scale-110 transition-transform">
              {getCategoryIcon(item.category)}
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{item.category}</span>
          </div>
        )}

        {/* Gradient Scrim for Top Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Type Ribbon */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span
            className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs ${
              isLost
                ? 'bg-rose-600 text-white'
                : 'bg-teal-600 text-white'
            }`}
          >
            {isLost ? 'LOST PROPERTY' : 'FOUND IN CUSTODY'}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs ${statusInfo.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata String: Zero-pill discipline */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
              {item.category}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
            <span>{item.color}</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
            <span className="font-mono text-[11px] tabular-nums text-slate-600 dark:text-slate-400">
              {item.date}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
            {item.title}
          </h3>

          {/* Context Description */}
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Location & Holding Info */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
          <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 mt-0.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          {item.storageLocation && (
            <div className="flex items-start gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 mt-0.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="truncate text-teal-800 dark:text-teal-300 font-medium">
                Held at: {item.storageLocation}
              </span>
            </div>
          )}

          {/* Footer Card Row */}
          <div className="pt-2 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
              By {item.reporterName}
            </span>

            <div className="flex items-center gap-2">
              {item.claims.length > 0 && (
                <span className="text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-400 tabular-nums bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                  {item.claims.length} {item.claims.length === 1 ? 'claim' : 'claims'}
                </span>
              )}

              <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300 group-hover:translate-x-0.5 transition-transform">
                View
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
