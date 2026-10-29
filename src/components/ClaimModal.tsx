import React, { useState, useEffect } from 'react';
import { ReportItem, Claim, UserProfile } from '../types';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  Lock,
  User,
  Mail,
  Phone,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

interface ClaimModalProps {
  item: ReportItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmitClaim: (claimData: Omit<Claim, 'id' | 'itemId' | 'submittedAt' | 'status'>) => void;
  activeProfile: UserProfile;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  item,
  isOpen,
  onClose,
  onSubmitClaim,
  activeProfile,
}) => {
  const [claimantName, setClaimantName] = useState(activeProfile.name);
  const [claimantStudentId, setClaimantStudentId] = useState(activeProfile.studentId);
  const [claimantEmail, setClaimantEmail] = useState(activeProfile.email);
  const [claimantPhone, setClaimantPhone] = useState(activeProfile.phone);
  const [identifyingDetails, setIdentifyingDetails] = useState('');
  const [acknowledgedPolicy, setAcknowledgedPolicy] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!claimantName.trim()) {
      newErrors.claimantName = 'Claimant full name is required.';
    }
    if (!claimantStudentId.trim()) {
      newErrors.claimantStudentId = 'University Student/Staff ID is required.';
    }
    if (!claimantEmail.trim() || !claimantEmail.includes('@')) {
      newErrors.claimantEmail = 'Valid campus email address is required.';
    }
    if (!claimantPhone.trim()) {
      newErrors.claimantPhone = 'Contact phone number is required.';
    }
    if (!identifyingDetails.trim()) {
      newErrors.identifyingDetails = 'Detailed ownership evidence is required to verify your claim.';
    } else if (identifyingDetails.trim().length < 25) {
      newErrors.identifyingDetails = 'Please provide sufficient identifying proof (at least 25 characters) such as serial numbers, lock screens, scratch locations, or internal contents.';
    }
    if (!acknowledgedPolicy) {
      newErrors.acknowledgedPolicy = 'You must acknowledge that claims require manual human verification.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmitClaim({
      claimantName: claimantName.trim(),
      claimantEmail: claimantEmail.trim(),
      claimantPhone: claimantPhone.trim(),
      claimantStudentId: claimantStudentId.trim(),
      identifyingDetails: identifyingDetails.trim(),
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h2
              id="claim-modal-title"
              className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              File Ownership Claim
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-sm sm:max-w-md">
              Target item: <strong>{item.title}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Policy Alert */}
        <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3 shrink-0">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold block mb-0.5">Strict Human Verification Protocol</strong>
            Claims are <strong>never automatically verified</strong>. Your submitted identifiers will be examined by {item.reporterName} or campus security dispatch before item handover is authorized.
          </div>
        </div>

        {/* Form Body */}
        <form id="claim-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs sm:text-sm flex-1">
          
          {/* Claimant Name & ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={claimantName}
                onChange={(e) => setClaimantName(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                  errors.claimantName
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-slate-300 dark:border-slate-700 focus:ring-teal-500/20 focus:border-teal-500'
                }`}
              />
              {errors.claimantName && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.claimantName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Student / Staff ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={claimantStudentId}
                onChange={(e) => setClaimantStudentId(e.target.value)}
                placeholder="e.g. STU-2024-8841"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono ${
                  errors.claimantStudentId
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-slate-300 dark:border-slate-700 focus:ring-teal-500/20 focus:border-teal-500'
                }`}
              />
              {errors.claimantStudentId && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.claimantStudentId}</p>
              )}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Campus Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={claimantEmail}
                onChange={(e) => setClaimantEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                  errors.claimantEmail
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-slate-300 dark:border-slate-700 focus:ring-teal-500/20 focus:border-teal-500'
                }`}
              />
              {errors.claimantEmail && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.claimantEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={claimantPhone}
                onChange={(e) => setClaimantPhone(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                  errors.claimantPhone
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-slate-300 dark:border-slate-700 focus:ring-teal-500/20 focus:border-teal-500'
                }`}
              />
              {errors.claimantPhone && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.claimantPhone}</p>
              )}
            </div>
          </div>

          {/* Detailed Ownership Evidence */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
              Ownership Identifying Evidence <span className="text-rose-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
              Describe specific details that only the true owner would know: serial number fragment, wallpaper description, passcodes/pattern hints, stickers or scratch locations, exact pocket contents, or approximate purchase date.
            </p>
            <textarea
              rows={4}
              value={identifyingDetails}
              onChange={(e) => setIdentifyingDetails(e.target.value)}
              placeholder="e.g. 'The laptop wallpaper is a sunset photo at Yosemite; there is a sticker of Python on the top right corner. The serial number ends in -4902. Inside the front zipper of the sleeve is an orange USB drive.'"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.identifyingDetails
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-teal-500/20 focus:border-teal-500'
              }`}
            />
            {errors.identifyingDetails && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.identifyingDetails}</p>
            )}
          </div>

          {/* Acknowledgement Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledgedPolicy}
                onChange={(e) => setAcknowledgedPolicy(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700 cursor-pointer"
              />
              <span className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                I certify that I am the rightful owner and agree to present my matching student/faculty ID during the physical handover inspection.
              </span>
            </label>
            {errors.acknowledgedPolicy && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.acknowledgedPolicy}</p>
            )}
          </div>

        </form>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="claim-form"
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            Submit Ownership Claim
          </button>
        </div>

      </div>
    </div>
  );
};
