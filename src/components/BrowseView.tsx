import React, { useState, useMemo } from 'react';
import { ReportItem, ItemCategory, ItemStatus, ReportType } from '../types';
import { ItemCard, getCategoryIcon } from './ItemCard';
import { CAMPUS_CATEGORIES, CAMPUS_LOCATIONS } from '../utils/constants';
import {
  Search,
  Filter,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

interface BrowseViewProps {
  reports: ReportItem[];
  onViewDetails: (item: ReportItem) => void;
  onOpenReportLost: () => void;
  onOpenReportFound: () => void;
  initialSearchQuery?: string;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  reports,
  onViewDetails,
  onOpenReportLost,
  onOpenReportFound,
  initialSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [typeFilter, setTypeFilter] = useState<'all' | ReportType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'title_asc'>('date_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Keep search query in sync when navigating from hero search with a query
  React.useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  // Multi-facet filtering and sorting
  const filteredReports = useMemo(() => {
    return reports
      .filter((item) => {
        // Type filter
        if (typeFilter !== 'all' && item.type !== typeFilter) return false;

        // Category filter
        if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

        // Status filter
        if (statusFilter !== 'all' && item.status !== statusFilter) return false;

        // Location filter
        if (locationFilter !== 'all' && item.location !== locationFilter) return false;

        // Search text matching
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchColor = item.color.toLowerCase().includes(q);
          const matchLocation = item.location.toLowerCase().includes(q);
          const matchMarks = item.identifyingMarks.toLowerCase().includes(q);
          const matchReporter = item.reporterName.toLowerCase().includes(q);
          const matchCategory = item.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchColor && !matchLocation && !matchMarks && !matchReporter && !matchCategory) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
          if (dateDiff !== 0) return dateDiff;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'date_asc') {
          const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
          if (dateDiff !== 0) return dateDiff;
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'title_asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [reports, searchQuery, typeFilter, categoryFilter, statusFilter, locationFilter, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setStatusFilter('all');
    setLocationFilter('all');
    setSortBy('date_desc');
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    statusFilter !== 'all' ||
    locationFilter !== 'all';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Campus Catalog Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Search, filter, and inspect reported property across lecture halls, labs, and recreation grounds.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1 border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid layout"
              title="Card Grid"
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              aria-label="Table list layout"
              title="Data Table"
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Controls Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4">
        
        {/* Row 1: Search & Type Segments */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, color, brand, or location keywords..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Clear search text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Segmented Buttons */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold shrink-0">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              All Types ({reports.length})
            </button>
            <button
              onClick={() => setTypeFilter('lost')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                typeFilter === 'lost'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-rose-600'
              }`}
            >
              Lost ({reports.filter((r) => r.type === 'lost').length})
            </button>
            <button
              onClick={() => setTypeFilter('found')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                typeFilter === 'found'
                  ? 'bg-teal-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-teal-600'
              }`}
            >
              Found ({reports.filter((r) => r.type === 'found').length})
            </button>
          </div>

        </div>

        {/* Row 2: Secondary Dropdown Filters & Sorting */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs font-medium cursor-pointer"
            >
              <option value="all">All Categories</option>
              {CAMPUS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs font-medium cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open Listings</option>
              <option value="claim_pending">In Verification</option>
              <option value="resolved">Resolved / Handed Over</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Campus Location
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs font-medium truncate cursor-pointer"
            >
              <option value="all">All Locations</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Sort Sequence
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs font-medium cursor-pointer"
            >
              <option value="date_desc">Newest Date First</option>
              <option value="date_asc">Oldest Date First</option>
              <option value="title_asc">Item Title (A to Z)</option>
            </select>
          </div>

        </div>

        {/* Active Filters Summary Strip */}
        {hasActiveFilters && (
          <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span>
                Matching <strong className="text-slate-900 dark:text-slate-100 font-mono tabular-nums">{filteredReports.length}</strong> of{' '}
                <span className="font-mono tabular-nums">{reports.length}</span> listings
              </span>
            </div>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 hover:underline font-semibold text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Main Results Display: Grid or Table */}
      {filteredReports.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReports.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          /* Table High Density Responsive View */
          <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-2xs">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Item Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Claims</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {filteredReports.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onViewDetails(item)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-2xs ${
                          item.type === 'lost'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100 max-w-[220px] truncate group-hover:text-teal-600 dark:group-hover:text-teal-400">
                      {item.title}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                      {item.location}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] tabular-nums whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.claims.length > 0 ? (
                        <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
                          {item.claims.length} claim(s)
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="text-teal-600 dark:text-teal-400 font-bold hover:underline inline-flex items-center gap-1">
                        View
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        /* Empty State with Collegiate Iconography */
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            No matching items found
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            We couldn&apos;t find any property reports matching your search and filter criteria. Try broader keywords or clearing filters.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenReportLost}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Report a Lost Item
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
