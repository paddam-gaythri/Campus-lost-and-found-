import React, { useState } from 'react';
import { ReportItem, ViewMode } from '../types';
import { ItemCard } from './ItemCard';
import {
  PackageSearch,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  PhoneCall,
  Sparkles,
  HelpCircle,
  Database,
  ChevronRight,
  Check,
  FileText
} from 'lucide-react';

interface DashboardViewProps {
  reports: ReportItem[];
  onNavigate: (view: ViewMode) => void;
  onViewDetails: (item: ReportItem) => void;
  onResetData: () => void;
  onSearchCatalog?: (query: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reports,
  onNavigate,
  onViewDetails,
  onResetData,
  onSearchCatalog,
}) => {
  const [recentTab, setRecentTab] = useState<'all' | 'lost' | 'found'>('all');
  const [heroSearchInput, setHeroSearchInput] = useState('');

  // Compute metrics
  const totalLost = reports.filter((r) => r.type === 'lost' && r.status !== 'resolved').length;
  const totalFound = reports.filter((r) => r.type === 'found' && r.status !== 'resolved').length;
  const totalPendingClaims = reports.reduce((acc, r) => {
    return acc + r.claims.filter((c) => c.status === 'pending').length;
  }, 0);
  const totalResolved = reports.filter((r) => r.status === 'resolved').length;
  const totalReports = reports.length;
  const resolutionRate = totalReports > 0 ? Math.round((totalResolved / totalReports) * 100) : 0;

  const filteredRecent = reports
    .filter((r) => {
      if (recentTab === 'lost') return r.type === 'lost';
      if (recentTab === 'found') return r.type === 'found';
      return true;
    })
    .slice(0, 6);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchCatalog) {
      onSearchCatalog(heroSearchInput.trim());
    } else {
      onNavigate('browse');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Premier Collegiate Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-10 shadow-xl border border-slate-800/80">
        
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-4 backdrop-blur-xs">
            <Building className="w-3.5 h-3.5" />
            <span>Official University Property Recovery Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Lost Something on Campus? <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-200 to-white">
              We&apos;re Here to Help You Find It.
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Report misplaced valuables, register found items to campus custody desks, and submit verified ownership claims through our secure university directory.
          </p>

          {/* Integrated Quick Search Bar in Hero */}
          <form onSubmit={handleHeroSearchSubmit} className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={heroSearchInput}
                onChange={(e) => setHeroSearchInput(e.target.value)}
                placeholder="Search by item, color, building, or keyword..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white dark:focus:bg-slate-900 text-white focus:text-slate-900 dark:focus:text-white placeholder-slate-300 text-xs sm:text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            >
              Search Catalog
            </button>
          </form>

          {/* Fast Action Buttons */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Quick Report:</span>
            <button
              onClick={() => onNavigate('report_lost')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              I Lost an Item
            </button>
            <button
              onClick={() => onNavigate('report_found')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600/90 hover:bg-teal-600 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              I Found an Item
            </button>
          </div>

        </div>
      </section>

      {/* Metrics Row (Tabular Figures & Collegiate Density) */}
      <section aria-label="Portal Statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold tracking-wider uppercase">Active Lost</span>
            <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {totalLost}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">items missing</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold tracking-wider uppercase">Items in Custody</span>
            <span className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {totalFound}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">at safe desks</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold tracking-wider uppercase">In Verification</span>
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {totalPendingClaims}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">pending claims</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold tracking-wider uppercase">Reunited</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {totalResolved}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              ({resolutionRate}% resolved)
            </span>
          </div>
        </div>

      </section>

      {/* Local Storage Informational Strip */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2.5">
          <Database className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>
            <strong>Demo Storage Active:</strong> Reports, images, and claims are securely stored in your browser&apos;s localStorage. Data is not transmitted to external commercial databases.
          </span>
        </div>
        <button
          onClick={onResetData}
          className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 underline decoration-slate-300 dark:decoration-slate-600 whitespace-nowrap shrink-0 transition-colors"
        >
          Reset Demo Data
        </button>
      </div>

      {/* Recent Campus Activity Section */}
      <section className="space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              Recent Campus Activity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Freshly reported misplaced items and newly turned-in property across academic halls.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Segmented control */}
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
              <button
                onClick={() => setRecentTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  recentTab === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                All ({reports.length})
              </button>
              <button
                onClick={() => setRecentTab('lost')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  recentTab === 'lost'
                    ? 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-300 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Lost Only ({reports.filter((r) => r.type === 'lost').length})
              </button>
              <button
                onClick={() => setRecentTab('found')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  recentTab === 'found'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Found Only ({reports.filter((r) => r.type === 'found').length})
              </button>
            </div>

            <button
              onClick={() => onNavigate('browse')}
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline px-2 py-1.5"
            >
              All Listings
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecent.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </section>

      {/* University Protocol & Custody Desks Info */}
      <section className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-2xs">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Campus Handover & Ownership Verification Standards
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Strict rules to guarantee items are handed over solely to their legitimate student or faculty owner.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
            <span>Campus Dispatch: Ext 402</span>
          </div>
        </div>
        
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-xs">
              01
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
              Human Review Requirement
            </span>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Claims on electronics, laptops, or wallets require human inspection. Claimants must provide verifiable concealed identifiers (serial fragments, lock wallpapers, scratches).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-xs">
              02
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
              Official Custody Desks
            </span>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Do not keep valuable items in dorms. Turn them into the 24/7 Campus Security Desk (Main Administration 101) or Student Union Information Desk.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-xs">
              03
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
              Photo ID Verification
            </span>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              During physical collection, the claimant must produce their matching physical or digital Student/Faculty ID card before the property is released.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
