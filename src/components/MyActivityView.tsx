import React, { useState } from 'react';
import { ReportItem, Claim, UserProfile, ItemStatus } from '../types';
import { ItemCard } from './ItemCard';
import {
  FileText,
  ShieldCheck,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  Plus,
  ArrowRight,
  User
} from 'lucide-react';

interface MyActivityViewProps {
  reports: ReportItem[];
  activeProfile: UserProfile;
  onViewDetails: (item: ReportItem) => void;
  onEditItem: (item: ReportItem) => void;
  onDeleteItem: (item: ReportItem) => void;
  onUpdateStatus: (itemId: string, status: ItemStatus) => void;
  onOpenReportLost: () => void;
  onOpenReportFound: () => void;
}

export const MyActivityView: React.FC<MyActivityViewProps> = ({
  reports,
  activeProfile,
  onViewDetails,
  onEditItem,
  onDeleteItem,
  onUpdateStatus,
  onOpenReportLost,
  onOpenReportFound,
}) => {
  const [tab, setTab] = useState<'reported' | 'claims'>('reported');

  const isSecurity = activeProfile.role === 'security';
  const myReportedItems = reports.filter(
    (item) => item.reporterId === activeProfile.id || isSecurity
  );

  const mySubmittedClaims: { claim: Claim; item: ReportItem }[] = [];
  reports.forEach((item) => {
    item.claims.forEach((claim) => {
      if (
        claim.claimantEmail === activeProfile.email ||
        claim.claimantStudentId === activeProfile.studentId ||
        claim.claimantName.toLowerCase() === activeProfile.name.toLowerCase()
      ) {
        mySubmittedClaims.push({ claim, item });
      }
    });
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Profile Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-700 to-cyan-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
            {activeProfile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {activeProfile.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800 capitalize">
                {activeProfile.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activeProfile.department} · <span className="font-mono">{activeProfile.studentId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onOpenReportLost}
            className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/70 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            Report Lost
          </button>
          <button
            onClick={onOpenReportFound}
            className="px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Report Found
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-semibold border border-slate-200/60 dark:border-slate-700/60">
        <button
          onClick={() => setTab('reported')}
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-2 ${
            tab === 'reported'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>My Reported Items</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono tabular-nums">
            {myReportedItems.length}
          </span>
        </button>

        <button
          onClick={() => setTab('claims')}
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-2 ${
            tab === 'claims'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>My Filed Claims</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono tabular-nums">
            {mySubmittedClaims.length}
          </span>
        </button>
      </div>

      {/* Content Tab 1: Reported Items */}
      {tab === 'reported' && (
        <div className="space-y-4">
          {myReportedItems.length > 0 ? (
            <div className="space-y-3">
              {myReportedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs ${
                        item.type === 'lost'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                      }`}
                    >
                      {item.type === 'lost' ? 'LOST' : 'FND'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </h3>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-mono tabular-nums text-slate-500">{item.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 max-w-xl">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{item.location}</span>
                        {item.claims.length > 0 && (
                          <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                            {item.claims.length} claim(s) awaiting review
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center flex-wrap gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-500">Status:</span>
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value as ItemStatus)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
                      >
                        <option value="open">Open</option>
                        <option value="claim_pending">In Verification</option>
                        <option value="resolved">Resolved / Handed Over</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => onViewDetails(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                    >
                      Details & Claims
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditItem(item)}
                      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      title="Edit Item"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteItem(item)}
                      className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-850">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                You haven&apos;t logged any property reports
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                Misplaced an item or found something in a lecture hall or cafeteria? Log a report to start the recovery process.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={onOpenReportLost}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-500 transition-colors"
                >
                  Report Lost
                </button>
                <button
                  onClick={onOpenReportFound}
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs hover:bg-teal-500 transition-colors"
                >
                  Report Found
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Tab 2: Filed Claims */}
      {tab === 'claims' && (
        <div className="space-y-4">
          {mySubmittedClaims.length > 0 ? (
            <div className="space-y-3">
              {mySubmittedClaims.map(({ claim, item }) => (
                <div
                  key={claim.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                        Claim on: {item.title}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                        Filed {new Date(claim.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-md shadow-2xs ${
                          claim.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : claim.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {claim.status === 'accepted'
                          ? 'VERIFIED & APPROVED'
                          : claim.status === 'rejected'
                          ? 'NOT VERIFIED'
                          : 'IN VERIFICATION BY FINDER'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Your Submitted Evidence:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 leading-relaxed">
                      {claim.identifyingDetails}
                    </p>
                  </div>

                  {claim.reviewNotes && (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                      <strong>Finder / Desk Feedback:</strong> {claim.reviewNotes}
                    </div>
                  )}

                  <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>Custody maintained by: {item.reporterName}</span>
                    <button
                      onClick={() => onViewDetails(item)}
                      className="text-teal-600 dark:text-teal-400 hover:underline font-bold inline-flex items-center gap-1"
                    >
                      View Full Listing
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-850">
              <ShieldCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                No active ownership claims filed by you
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                Found your missing laptop, keys, or calculator in the catalog? Open the item listing and click &ldquo;This Is My Item&rdquo; to file a verified claim.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
