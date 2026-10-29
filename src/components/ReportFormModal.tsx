import React, { useState, useEffect } from 'react';
import { ReportItem, ReportType, ItemCategory, UserProfile } from '../types';
import { CAMPUS_CATEGORIES, CAMPUS_LOCATIONS, SAFE_STORAGE_POINTS } from '../utils/constants';
import { optimizeImageFile } from '../utils/storage';
import {
  X,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Sparkles,
  MapPin,
  Calendar,
  ShieldCheck,
  Tag,
  Building,
  Info,
  Clock
} from 'lucide-react';

interface ReportFormModalProps {
  type: ReportType;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<ReportItem, 'id' | 'createdAt' | 'updatedAt' | 'claims'>) => void;
  activeProfile: UserProfile;
  initialData?: ReportItem | null; // For editing
}

export const ReportFormModal: React.FC<ReportFormModalProps> = ({
  type,
  isOpen,
  onClose,
  onSubmit,
  activeProfile,
  initialData,
}) => {
  const isLost = type === 'lost';
  const isEditing = Boolean(initialData);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [color, setColor] = useState('');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [identifyingMarks, setIdentifyingMarks] = useState('');
  const [storageLocation, setStorageLocation] = useState(SAFE_STORAGE_POINTS[0]);
  const [customStorage, setCustomStorage] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone' | 'desk'>('email');
  const [contactValue, setContactValue] = useState(activeProfile.email);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Validation errors map
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category);
      setColor(initialData.color);
      if (CAMPUS_LOCATIONS.includes(initialData.location)) {
        setLocation(initialData.location);
        setCustomLocation('');
      } else {
        setLocation('Other / Off-Campus Adjacent');
        setCustomLocation(initialData.location);
      }
      setDate(initialData.date);
      setDescription(initialData.description);
      setIdentifyingMarks(initialData.identifyingMarks);
      if (initialData.storageLocation) {
        if (SAFE_STORAGE_POINTS.includes(initialData.storageLocation)) {
          setStorageLocation(initialData.storageLocation);
          setCustomStorage('');
        } else {
          setStorageLocation('Held Personally by Finder (Pending Handover)');
          setCustomStorage(initialData.storageLocation);
        }
      }
      setContactMethod(initialData.contactMethod);
      setContactValue(initialData.contactValue);
      setImageUrl(initialData.imageUrl);
    } else {
      setTitle('');
      setCategory('Electronics');
      setColor('');
      setLocation(CAMPUS_LOCATIONS[0]);
      setCustomLocation('');
      setDate(todayStr);
      setDescription('');
      setIdentifyingMarks('');
      setStorageLocation(SAFE_STORAGE_POINTS[0]);
      setCustomStorage('');
      setContactMethod('email');
      setContactValue(activeProfile.email);
      setImageUrl(undefined);
      setImageError(null);
      setErrors({});
      setTouched({});
    }
  }, [initialData, isOpen, activeProfile, todayStr]);

  // Handle ESC key listener
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

  // Image upload with optimization
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);
    setIsProcessingImage(true);

    try {
      const optimizedBase64 = await optimizeImageFile(file);
      setImageUrl(optimizedBase64);
    } catch (err: any) {
      setImageError(err.message || 'Failed to process image file.');
    } finally {
      setIsProcessingImage(false);
      e.target.value = '';
    }
  };

  const handleSelectPresetSampleImage = (url: string) => {
    setImageUrl(url);
    setImageError(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Item title is required.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Item title must be at least 3 characters.';
    }

    if (!color.trim()) {
      newErrors.color = 'Please specify primary color.';
    }

    const resolvedLocation = location === 'Other / Off-Campus Adjacent' && customLocation ? customLocation : location;
    if (!resolvedLocation.trim()) {
      newErrors.location = 'Campus location is required.';
    }

    if (!date) {
      newErrors.date = 'Date is required.';
    } else if (date > todayStr) {
      newErrors.date = 'Date cannot be in the future.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please provide a descriptive explanation.';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters.';
    }

    if (!identifyingMarks.trim()) {
      newErrors.identifyingMarks = 'Distinctive marks or verification clues are required.';
    }

    if (!isLost && !storageLocation.trim()) {
      newErrors.storageLocation = 'Please state safe custody or holding location.';
    }

    if (!contactValue.trim()) {
      newErrors.contactValue = 'Contact information is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setTouched({
        title: true,
        color: true,
        location: true,
        date: true,
        description: true,
        identifyingMarks: true,
        contactValue: true,
      });
      return;
    }

    const finalLocation = location === 'Other / Off-Campus Adjacent' && customLocation.trim()
      ? customLocation.trim()
      : location;

    const finalStorageLocation = !isLost
      ? (customStorage.trim() ? customStorage.trim() : storageLocation)
      : undefined;

    onSubmit({
      type,
      title: title.trim(),
      category,
      color: color.trim(),
      location: finalLocation,
      date,
      description: description.trim(),
      identifyingMarks: identifyingMarks.trim(),
      storageLocation: finalStorageLocation,
      contactMethod,
      contactValue: contactValue.trim(),
      reporterName: activeProfile.name,
      reporterId: activeProfile.id,
      reporterEmail: activeProfile.email,
      imageUrl,
      status: initialData ? initialData.status : 'open',
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Sticky Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
            isLost
              ? 'bg-gradient-to-r from-rose-50 via-rose-50/50 to-white dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-900 border-rose-100 dark:border-rose-900/40'
              : 'bg-gradient-to-r from-teal-50 via-teal-50/50 to-white dark:from-teal-950/40 dark:via-slate-900 dark:to-slate-900 border-teal-100 dark:border-teal-900/40'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isLost ? 'bg-rose-500' : 'bg-teal-500'
                }`}
              />
              <h2
                id="report-modal-title"
                className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight"
              >
                {isEditing
                  ? `Edit Report: ${initialData?.title}`
                  : isLost
                  ? 'Report a Lost Item'
                  : 'Report a Found Item'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isLost
                ? 'Provide detailed descriptions so finders and campus security can identify your property.'
                : 'Log item custody location and distinctive clues to verify the rightful owner.'}
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

        {/* Form Body (Scrollable) */}
        <form id="report-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs sm:text-sm flex-1">
          
          {/* Item Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Item Name / Model <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Casio Graphing Calculator fx-CG50, Navy Laptop Backpack, White Earbuds Case"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-teal-500/20 focus:border-teal-500'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Category & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
              >
                {CAMPUS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Color / Finish <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Navy Blue, Matte Silver, Crimson"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                  errors.color
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-slate-300 dark:border-slate-700 focus:ring-teal-500/20 focus:border-teal-500'
                }`}
              />
              {errors.color && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.color}</p>
              )}
            </div>
          </div>

          {/* Campus Location & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {isLost ? 'Location Misplaced' : 'Location Found'} <span className="text-rose-500">*</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {location === 'Other / Off-Campus Adjacent' && (
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="Specify exact building, room number, or landmark"
                  className="mt-2 w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Date {isLost ? 'Lost' : 'Found'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                max={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 font-mono ${
                  errors.date
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-slate-300 dark:border-slate-700 focus:ring-teal-500/20 focus:border-teal-500'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Safe Custody Location (Found Items Only) */}
          {!isLost && (
            <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/50 space-y-2">
              <label className="block text-xs font-bold text-teal-950 dark:text-teal-200">
                Current Custody / Safe Storage Spot <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-teal-800 dark:text-teal-300 leading-relaxed">
                Where is this item currently held so the owner can securely collect it after verification?
              </p>
              <select
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-teal-300 dark:border-teal-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {SAFE_STORAGE_POINTS.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
              {storageLocation === 'Held Personally by Finder (Pending Handover)' && (
                <input
                  type="text"
                  value={customStorage}
                  onChange={(e) => setCustomStorage(e.target.value)}
                  placeholder="e.g. In room 210, will drop at Security desk by 5 PM"
                  className="mt-2 w-full px-3 py-2 rounded-xl border border-teal-300 dark:border-teal-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              )}
            </div>
          )}

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Context Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe circumstances, appearance, brand, size, where it was placed..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.description
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-teal-500/20 focus:border-teal-500'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Identifying Marks & Concealed Clues */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
              Identifying Marks & Verification Clues <span className="text-rose-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
              {isLost
                ? 'Specify unique details (scratches, stickers, engraved initials, serial numbers, wallpapers) that demonstrate your ownership.'
                : 'Note concealed clues (e.g., sticker under case, internal contents, serial fragment) that a claimant must describe to prove ownership.'}
            </p>
            <textarea
              rows={2}
              value={identifyingMarks}
              onChange={(e) => setIdentifyingMarks(e.target.value)}
              placeholder="e.g. Scratched initials 'AC' on back battery cover; blue NASA sticker on bottom; specific keychain charm..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.identifyingMarks
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-teal-500/20 focus:border-teal-500'
              }`}
            />
            {errors.identifyingMarks && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.identifyingMarks}</p>
            )}
          </div>

          {/* Photo Attachment (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Item Photograph (Optional)
            </label>
            
            {imageUrl ? (
              <div className="relative inline-block rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs">
                <img
                  src={imageUrl}
                  alt="Item preview"
                  className="h-36 w-auto object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(undefined)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-md"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors shadow-2xs">
                    <Upload className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>{isProcessingImage ? 'Optimizing photo...' : 'Upload Image (Max 2MB)'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isProcessingImage}
                    />
                  </label>

                  <span className="text-[11px] text-slate-400 font-medium">or pick sample:</span>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetSampleImage('/images/lost_calculator_1793252413976.jpg')}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-600 dark:text-slate-400 font-medium transition-colors"
                  >
                    Calculator
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetSampleImage('/images/lost_backpack_1793252414639.jpg')}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-600 dark:text-slate-400 font-medium transition-colors"
                  >
                    Backpack
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetSampleImage('/images/found_earbuds_1793252414552.jpg')}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-600 dark:text-slate-400 font-medium transition-colors"
                  >
                    Earbuds
                  </button>
                </div>

                {imageError && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {imageError}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Uploaded files are downscaled onto HTML5 Canvas to preserve lightweight localStorage.
                </p>
              </div>
            )}
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Preferred Contact Channel
              </label>
              <select
                value={contactMethod}
                onChange={(e) => {
                  const val = e.target.value as 'email' | 'phone' | 'desk';
                  setContactMethod(val);
                  if (val === 'email') setContactValue(activeProfile.email);
                  if (val === 'phone') setContactValue(activeProfile.phone);
                  if (val === 'desk') setContactValue('Campus Security Desk (Admin 101)');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="email">Campus Email</option>
                <option value="phone">Phone / SMS</option>
                <option value="desk">Campus Service Desk</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Contact Address / Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder="e.g. student@campus.edu or +1 555-..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                  errors.contactValue
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-slate-300 dark:border-slate-700 focus:ring-teal-500/20 focus:border-teal-500'
                }`}
              />
              {errors.contactValue && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.contactValue}</p>
              )}
            </div>
          </div>

        </form>

        {/* Sticky Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="report-form"
            disabled={isProcessingImage}
            className={`px-6 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 ${
              isLost
                ? 'bg-rose-600 hover:bg-rose-500 focus-visible:ring-rose-400'
                : 'bg-teal-600 hover:bg-teal-500 focus-visible:ring-teal-400'
            } disabled:opacity-50`}
          >
            {isEditing ? 'Save Changes' : isLost ? 'Submit Lost Item Report' : 'Submit Found Item Report'}
          </button>
        </div>

      </div>
    </div>
  );
};
