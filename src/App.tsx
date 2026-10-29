import React, { useState, useEffect } from 'react';
import { ReportItem, ViewMode, UserProfile, Claim, ItemStatus } from './types';
import {
  getStoredReports,
  saveStoredReports,
  resetToSeedData,
  getStoredProfile,
  saveStoredProfile,
  STORAGE_KEYS
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { BrowseView } from './components/BrowseView';
import { MyActivityView } from './components/MyActivityView';
import { TestingGuideView } from './components/TestingGuideModal';
import { ReportFormModal } from './components/ReportFormModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { ClaimModal } from './components/ClaimModal';
import { ProfileModal } from './components/ProfileModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  ShieldCheck,
  Building,
  HeartHandshake
} from 'lucide-react';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved !== null) {
        return saved === 'dark';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Sync dark class on root html tag
  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(STORAGE_KEYS.THEME, 'light');
      }
    } catch {
      // ignore
    }
  }, [isDark]);

  // Data states
  const [reports, setReports] = useState<ReportItem[]>(() => getStoredReports());
  const [activeProfile, setActiveProfile] = useState<UserProfile>(() => getStoredProfile());
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportModalType, setReportModalType] = useState<'lost' | 'found'>('lost');
  const [itemToEdit, setItemToEdit] = useState<ReportItem | null>(null);

  const [detailItem, setDetailItem] = useState<ReportItem | null>(null);
  const [claimItem, setClaimItem] = useState<ReportItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ReportItem | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Persist reports whenever changed
  const updateReportsAndPersist = (newReports: ReportItem[]) => {
    setReports(newReports);
    const result = saveStoredReports(newReports);
    if (!result.success) {
      showToast(result.error || 'Failed to persist to browser storage', 'error');
    }
  };

  // Handlers for Views & Modals
  const handleOpenReportLost = () => {
    setItemToEdit(null);
    setReportModalType('lost');
    setReportModalOpen(true);
  };

  const handleOpenReportFound = () => {
    setItemToEdit(null);
    setReportModalType('found');
    setReportModalOpen(true);
  };

  const handleEditReport = (item: ReportItem) => {
    setItemToEdit(item);
    setReportModalType(item.type);
    setReportModalOpen(true);
    setDetailItem(null);
  };

  const handleSaveReport = (data: Omit<ReportItem, 'id' | 'createdAt' | 'updatedAt' | 'claims'>) => {
    const nowIso = new Date().toISOString();

    if (itemToEdit) {
      // Update existing item
      const updatedList = reports.map((it) => {
        if (it.id === itemToEdit.id) {
          return {
            ...it,
            ...data,
            updatedAt: nowIso,
          };
        }
        return it;
      });
      updateReportsAndPersist(updatedList);
      showToast(`Successfully updated report: "${data.title}"`, 'success');
    } else {
      // Create new report
      const newItem: ReportItem = {
        ...data,
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        createdAt: nowIso,
        updatedAt: nowIso,
        claims: [],
      };
      const updatedList = [newItem, ...reports];
      updateReportsAndPersist(updatedList);
      showToast(
        `Successfully logged ${data.type === 'lost' ? 'lost' : 'found'} report for "${data.title}"`,
        'success'
      );
    }
  };

  const handleDeleteReport = () => {
    if (!itemToDelete) return;
    const updated = reports.filter((r) => r.id !== itemToDelete.id);
    updateReportsAndPersist(updated);
    if (detailItem?.id === itemToDelete.id) {
      setDetailItem(null);
    }
    showToast(`Listing "${itemToDelete.title}" was deleted.`, 'info');
    setItemToDelete(null);
  };

  const handleUpdateStatus = (itemId: string, status: ItemStatus) => {
    const updated = reports.map((r) => {
      if (r.id === itemId) {
        return {
          ...r,
          status,
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    updateReportsAndPersist(updated);
    if (detailItem?.id === itemId) {
      setDetailItem({
        ...detailItem,
        status,
        updatedAt: new Date().toISOString(),
      });
    }
    showToast(`Status updated to "${status.replace('_', ' ')}"`, 'success');
  };

  const handleSubmitClaim = (
    claimData: Omit<Claim, 'id' | 'itemId' | 'submittedAt' | 'status'>
  ) => {
    if (!claimItem) return;

    const newClaim: Claim = {
      ...claimData,
      id: `claim-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      itemId: claimItem.id,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    const updated = reports.map((r) => {
      if (r.id === claimItem.id) {
        return {
          ...r,
          status: 'claim_pending' as ItemStatus,
          claims: [...r.claims, newClaim],
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });

    updateReportsAndPersist(updated);
    if (detailItem?.id === claimItem.id) {
      setDetailItem({
        ...detailItem,
        status: 'claim_pending',
        claims: [...detailItem.claims, newClaim],
      });
    }

    showToast(
      'Ownership claim filed! It is placed in "Claim in Verification" status for review.',
      'success'
    );
  };

  const handleReviewClaim = (
    itemId: string,
    claimId: string,
    status: 'accepted' | 'rejected',
    notes?: string
  ) => {
    const nowIso = new Date().toISOString();
    const updated = reports.map((r) => {
      if (r.id === itemId) {
        const updatedClaims = r.claims.map((c) => {
          if (c.id === claimId) {
            return {
              ...c,
              status,
              reviewNotes: notes,
              reviewedAt: nowIso,
            };
          }
          return c;
        });

        // If claim is accepted, mark the item as resolved
        const newStatus: ItemStatus = status === 'accepted' ? 'resolved' : r.status;

        return {
          ...r,
          status: newStatus,
          claims: updatedClaims,
          updatedAt: nowIso,
        };
      }
      return r;
    });

    updateReportsAndPersist(updated);

    // Sync open detail modal if looking at this item
    if (detailItem?.id === itemId) {
      const match = updated.find((u) => u.id === itemId);
      if (match) setDetailItem(match);
    }

    showToast(
      status === 'accepted'
        ? 'Claim accepted! Item marked as Resolved & Handed Over.'
        : 'Claim rejected with notes.',
      status === 'accepted' ? 'success' : 'info'
    );
  };

  const handleExecuteReset = () => {
    const seed = resetToSeedData();
    setReports(seed);
    setDetailItem(null);
    showToast('Demo data reset to initial sample state.', 'info');
  };

  const handleTriggerCorruptStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, '{ corrupt_json: [unclosed_token');
      // Now re-fetch
      const recovered = getStoredReports();
      setReports(recovered);
      showToast('Corrupted storage caught safely! Restored default state.', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProfile = (profile: UserProfile) => {
    setActiveProfile(profile);
    saveStoredProfile(profile);
    showToast(`Profile updated for ${profile.name}`, 'success');
  };

  // Pending claims that need review for items reported by active profile
  const pendingClaimsCount = reports
    .filter((r) => r.reporterId === activeProfile.id || activeProfile.role === 'security')
    .reduce((acc, r) => acc + r.claims.filter((c) => c.status === 'pending').length, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white shadow-xl border border-slate-700 text-xs sm:text-sm animate-in slide-in-from-bottom-3 fade-in duration-200"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-teal-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Primary Top Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'report_lost') {
            handleOpenReportLost();
          } else if (view === 'report_found') {
            handleOpenReportFound();
          } else {
            setCurrentView(view);
          }
        }}
        activeProfile={activeProfile}
        onSelectProfile={handleSaveProfile}
        onOpenProfileModal={() => setProfileModalOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        pendingClaimsCount={pendingClaimsCount}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'dashboard' && (
          <DashboardView
            reports={reports}
            onNavigate={(view) => {
              if (view === 'report_lost') handleOpenReportLost();
              else if (view === 'report_found') handleOpenReportFound();
              else {
                setActiveSearchQuery('');
                setCurrentView(view);
              }
            }}
            onViewDetails={(item) => setDetailItem(item)}
            onResetData={() => setResetModalOpen(true)}
            onSearchCatalog={(query) => {
              setActiveSearchQuery(query);
              setCurrentView('browse');
            }}
          />
        )}

        {currentView === 'browse' && (
          <BrowseView
            reports={reports}
            onViewDetails={(item) => setDetailItem(item)}
            onOpenReportLost={handleOpenReportLost}
            onOpenReportFound={handleOpenReportFound}
            initialSearchQuery={activeSearchQuery}
          />
        )}

        {currentView === 'my_activity' && (
          <MyActivityView
            reports={reports}
            activeProfile={activeProfile}
            onViewDetails={(item) => setDetailItem(item)}
            onEditItem={handleEditReport}
            onDeleteItem={(item) => setItemToDelete(item)}
            onUpdateStatus={handleUpdateStatus}
            onOpenReportLost={handleOpenReportLost}
            onOpenReportFound={handleOpenReportFound}
          />
        )}

        {currentView === 'testing_guide' && (
          <TestingGuideView
            reports={reports}
            onResetData={() => setResetModalOpen(true)}
            onImportData={(imported) => {
              updateReportsAndPersist(imported);
            }}
            onTriggerCorruptedStorageTest={handleTriggerCorruptStorage}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      <ReportFormModal
        type={reportModalType}
        isOpen={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setItemToEdit(null);
        }}
        onSubmit={handleSaveReport}
        activeProfile={activeProfile}
        initialData={itemToEdit}
      />

      <ItemDetailModal
        item={detailItem}
        isOpen={Boolean(detailItem)}
        onClose={() => setDetailItem(null)}
        onOpenClaim={(item) => {
          setClaimItem(item);
        }}
        onEdit={(item) => handleEditReport(item)}
        onDelete={(item) => {
          setDetailItem(null);
          setItemToDelete(item);
        }}
        onReviewClaim={handleReviewClaim}
        activeProfile={activeProfile}
      />

      {claimItem && (
        <ClaimModal
          item={claimItem}
          isOpen={Boolean(claimItem)}
          onClose={() => setClaimItem(null)}
          onSubmitClaim={handleSubmitClaim}
          activeProfile={activeProfile}
        />
      )}

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        activeProfile={activeProfile}
        onSaveProfile={handleSaveProfile}
        onSelectPreset={handleSaveProfile}
      />

      <DeleteConfirmModal
        item={itemToDelete}
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteReport}
      />

      <ResetConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleExecuteReset}
      />

      {/* Clean Domain Footer (No fake telemetry engines, clean copyright and links) */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Campus Lost & Found Portal
            </span>
            <span aria-hidden="true">·</span>
            <span>University Community Operations</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setCurrentView('testing_guide')}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Verification Guide
            </button>
            <button
              onClick={() => setResetModalOpen(true)}
              className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              Reset Demo
            </button>
            <span>LocalStorage Prototype</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
