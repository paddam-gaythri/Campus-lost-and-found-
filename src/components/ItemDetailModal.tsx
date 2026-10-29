import React, { useState, useEffect } from 'react';
import { ReportItem, Claim, UserProfile } from '../types';
import { getCategoryIcon } from './ItemCard';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Building,
  CheckCircle,
  AlertCircle,
  FileText,
  Edit3,
  Trash2,
  ArrowRight,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Check,
  Info
} from 'lucide-react';

interface ItemDetailModalProps {
  item: ReportItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenClaim: (item: ReportItem) => void;
  onEdit: (item: ReportItem) => void;
  onDelete: (item: ReportItem) => void;
  onReviewClaim: (itemId: string, claimId: string, status: 'accepted' | 'rejected', notes?: string) => void;
  activeProfile: UserProfile;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onOpenClaim,
  onEdit,
  onDelete,
  onReviewClaim,
  activeProfile,
}) => {
  const [reviewNoteInput, setReviewNoteInput] = useState<{ [claimId: string]: string }>({});
  const [imageError, setImageError] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const isReporter = item.reporterId === activeProfile.id || activeProfile.role === 'security';
  const isLost = item.type === 'lost';

  const getStatusBadge = (status: ReportItem['status']) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Open for Verification
          </span>
        );
      case 'claim_pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Claim in Review ({item.claims.length})
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Resolved & Handed Over
          </span>
        );
    }
  };

  // Determine verification timeline step
  const getTimelineStep = () => {
    if (item.status === 'resolved') return 4;
    if (item.claims.length > 0) return 3;
    return 1;
  };

  const currentStep = getTimelineStep();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-6 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-md shadow-2xs ${
                isLost
                  ? 'bg-rose-600 text-white'
                  : 'bg-teal-600 text-white'
              }`}
            >
              {isLost ? 'LOST PROPERTY' : 'FOUND PROPERTY'}
            </span>
            {getStatusBadge(item.status)}
          </div>

          <div className="flex items-center gap-2">
            {isReporter && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="p-2 text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                  title="Edit report"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                  title="Delete report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs sm:text-sm flex-1">
          
          {/* Recovery Timeline Progress Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
              Recovery Progression
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1 ${
                  currentStep >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  1
                </div>
                <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200">Reported</span>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1 ${
                  currentStep >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  2
                </div>
                <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200">Cataloged</span>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1 ${
                  currentStep >= 3 ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  3
                </div>
                <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200">Claim Verified</span>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1 ${
                  currentStep >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  4
                </div>
                <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200">Reunited</span>
              </div>

            </div>
          </div>

          {/* Title & Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Visual Display */}
            <div className="md:col-span-5 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 aspect-[4/3] flex items-center justify-center relative shadow-xs">
              {item.imageUrl && !imageError ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-slate-400 dark:text-slate-500 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 mb-2">
                    {getCategoryIcon(item.category)}
                  </div>
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-300">{item.category}</span>
                  <span className="text-[11px] text-slate-400 mt-1">No photograph attached</span>
                </div>
              )}
            </div>

            {/* Core Details */}
            <div className="md:col-span-7 space-y-3.5">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
                  <span>{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Color: {item.color}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">Logged {item.date}</span>
                </div>

                <h1 id="item-detail-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {item.title}
                </h1>
              </div>

              {/* Location Cards */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                  <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">
                      {isLost ? 'Location Last Seen' : 'Location Found'}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">{item.location}</span>
                  </div>
                </div>

                {item.storageLocation && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/40">
                    <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-teal-950 dark:text-teal-200 block">
                        Current Safe Holding Custody
                      </span>
                      <span className="text-teal-800 dark:text-teal-300">{item.storageLocation}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Claim Action */}
              {item.status !== 'resolved' && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenClaim(item)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    This Is My Item — File Ownership Claim
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Description & Identifying Marks Sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-slate-500" />
                Description & Circumstances
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider text-amber-700 dark:text-amber-400">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Identifying Marks / Verification Clues
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-mono text-[11px] bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800">
                {item.identifyingMarks}
              </p>
            </div>

          </div>

          {/* Reporter Contact Information */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider mb-3">
              <User className="w-4 h-4 text-teal-600" />
              Reported By & Verified Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Reporter</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{item.reporterName}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Method</span>
                <span className="capitalize font-bold text-slate-800 dark:text-slate-200 text-xs">{item.contactMethod}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Address / Desk</span>
                <span className="font-mono text-xs text-teal-700 dark:text-teal-400 font-semibold truncate block">{item.contactValue}</span>
              </div>
            </div>
          </div>

          {/* Submitted Claims & Verification Management */}
          {item.claims.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Submitted Ownership Claims ({item.claims.length})
                </h3>
                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                  Manual human inspection required before release
                </span>
              </div>

              <div className="space-y-3">
                {item.claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2.5 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100 dark:border-slate-700">
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100 font-bold text-sm">
                          {claim.claimantName}
                        </strong>{' '}
                        <span className="text-slate-500 font-mono text-xs">({claim.claimantStudentId})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                          {new Date(claim.submittedAt).toLocaleDateString()}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs ${
                            claim.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : claim.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {claim.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                        Claimant Contact:
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">
                        {claim.claimantEmail} · {claim.claimantPhone}
                      </p>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                        Submitted Ownership Proof / Identifiers:
                      </span>
                      <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 leading-relaxed font-mono text-[11px] border border-slate-200/60 dark:border-slate-800">
                        {claim.identifyingDetails}
                      </p>
                    </div>

                    {claim.reviewNotes && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200/60 dark:border-emerald-800/40">
                        <strong>Review Note:</strong> {claim.reviewNotes}
                      </div>
                    )}

                    {/* Verification Actions */}
                    {isReporter && claim.status === 'pending' && (
                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="text"
                          placeholder="Verification note (e.g. ID card inspected, passcode confirmed)"
                          value={reviewNoteInput[claim.id] || ''}
                          onChange={(e) =>
                            setReviewNoteInput({ ...reviewNoteInput, [claim.id]: e.target.value })
                          }
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onReviewClaim(
                                item.id,
                                claim.id,
                                'accepted',
                                reviewNoteInput[claim.id] || 'Verified matching ownership details.'
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            Accept & Reunited
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onReviewClaim(
                                item.id,
                                claim.id,
                                'rejected',
                                reviewNoteInput[claim.id] || 'Insufficient identifying evidence provided.'
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            REF: {item.id}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
