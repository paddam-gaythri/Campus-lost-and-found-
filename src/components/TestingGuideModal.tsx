import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
  Bug,
  ShieldCheck,
  CheckCircle2,
  Database,
  Layers
} from 'lucide-react';
import { ReportItem } from '../types';
import { STORAGE_KEYS } from '../utils/storage';

interface TestingGuideViewProps {
  reports: ReportItem[];
  onResetData: () => void;
  onImportData: (imported: ReportItem[]) => void;
  onTriggerCorruptedStorageTest: () => void;
  onShowToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const TestingGuideView: React.FC<TestingGuideViewProps> = ({
  reports,
  onResetData,
  onImportData,
  onTriggerCorruptedStorageTest,
  onShowToast,
}) => {
  const [completedTests, setCompletedTests] = useState<{ [id: string]: boolean }>({
    t1: true,
    t2: true,
  });

  const toggleTest = (id: string) => {
    setCompletedTests((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `campus_lost_found_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast?.('Export downloaded successfully.', 'info');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportData(parsed);
          onShowToast?.(`Successfully imported ${parsed.length} reports.`, 'success');
        } else {
          onShowToast?.('Imported JSON file is not an array of reports.', 'error');
        }
      } catch (err) {
        onShowToast?.('Failed to parse JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const testSuites = [
    {
      id: 'suite-1',
      title: '1. Dashboard Metrics & Responsive Feed',
      description: 'Metric counters for Active Lost, Custody/Found, Claims in Review, and Handed Over dynamically reflect current reports.',
      steps: [
        'Open Dashboard and review counts (Lost, Found, Claims, Resolved).',
        'Toggle between "All", "Lost Only", and "Found Only" recent feeds.',
        'Resize browser viewport to verify cards scale from 1440px desktop down to mobile width.',
      ],
    },
    {
      id: 'suite-2',
      title: '2. Form Validation: Report Lost Item',
      description: 'Enforces required fields, character minimums, prevents future dates, and handles contact details.',
      steps: [
        'Click "Report Lost" in the header.',
        'Attempt to submit an empty form and verify error banners appear under each field.',
        'Choose a future date to verify date-ceiling validation.',
        'Attach a photo or select the sample calculator image.',
        'Submit a valid report and confirm it appears immediately in the Browse catalog.',
      ],
    },
    {
      id: 'suite-3',
      title: '3. Form Validation: Report Found Item',
      description: 'Verifies safe holding/custody desk selection and distinctive verification clues.',
      steps: [
        'Click "Report Found" in the header.',
        'Confirm the "Current Safe Custody Drop-off Spot" field is present (Security Desk, Info Desk, etc.).',
        'Fill in the distinctive identifying marks that an owner must match.',
        'Submit the report and inspect the listing details.',
      ],
    },
    {
      id: 'suite-4',
      title: '4. Search, Filtering & Multi-Facet Sorting',
      description: 'Live keyword search, multi-category filters, status dropdown, campus location, and table/grid view toggle.',
      steps: [
        'Navigate to Browse Catalog.',
        'Search for "Calculator" or "Navy" in the keyword search bar.',
        'Filter by Category (e.g. "Electronics"), Status ("Open"), or Campus Location ("Main University Library").',
        'Switch from Grid View to Table View to inspect dense columnar rows.',
        'Click "Reset all filters" to restore full catalog view.',
      ],
    },
    {
      id: 'suite-5',
      title: '5. Manual Ownership Claim Workflow',
      description: 'Claims are held in "Claim in Verification" status. Verification is never automatic to protect students.',
      steps: [
        'Open a found item listing (e.g., Wireless Bluetooth Earbuds).',
        'Click "This Is My Item — File Ownership Claim".',
        'Enter claimant details, student ID, and detailed proof (wallpaper, serial number, concealed marks).',
        'Submit the claim and verify item status moves to "Claim in Verification".',
      ],
    },
    {
      id: 'suite-6',
      title: '6. Reviewing Claims as Finder / Officer',
      description: 'The item reporter can inspect submitted evidence and manually Accept (Handover) or Reject.',
      steps: [
        'Switch demo user to "Marcus Vance" (finder of earbuds) using the top persona switcher.',
        'Navigate to "My Activity" and inspect the Earbuds listing.',
        'Review the claimant\'s submitted proof, enter an inspection note, and click "Accept & Reunited".',
        'Observe item status update to "Resolved & Handed Over".',
      ],
    },
    {
      id: 'suite-7',
      title: '7. Manage Own Reports (Edit, Status, Delete Confirm)',
      description: 'Report owners can edit details, change status dropdown directly, or delete with an accessible confirmation modal.',
      steps: [
        'In "My Activity", click the Edit icon on a report to modify the description.',
        'Click the Status selector to switch between Open, Claim Pending, or Resolved.',
        'Click Delete icon to trigger the DeleteConfirmModal dialog; test both Cancel and Confirm.',
      ],
    },
    {
      id: 'suite-8',
      title: '8. Image Upload Safety & Optimization',
      description: 'Tests file format checks, 2MB size ceiling validation, and canvas compression to protect localStorage.',
      steps: [
        'Open "Report Lost Item" and attempt to upload a photo.',
        'Verify oversized or non-image files are rejected with friendly error messages.',
        'Verify uploaded images are downscaled onto HTML5 Canvas to keep local browser storage lightweight.',
      ],
    },
    {
      id: 'suite-9',
      title: '9. LocalStorage Resilience & Data Recovery',
      description: 'Demonstrates graceful recovery if localStorage contains malformed or corrupt JSON data.',
      steps: [
        'Click "Simulate Corrupt Storage" below to corrupt localStorage data.',
        'Observe how the portal catches the error, falls back safely to initial seed data, and never crashes.',
        'Use "Reset Demo Data" at any time to restore the original clean state.',
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 text-xs font-bold mb-2 border border-teal-200/60 dark:border-teal-800/60">
            <Bug className="w-3.5 h-3.5" />
            <span>Operational Quality Assurance & Testing Suite</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Testing Checklist & Operational Verification
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            This interactive guide enables university evaluators and engineers to systematically test all 9 core functional features, error handling protocols, and localStorage persistence.
          </p>
        </div>

        {/* Data Tools */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Export Data
          </button>

          <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-2xs">
            <Upload className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Import JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            onClick={onResetData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Resilience Sandbox Card */}
      <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-300">
        <div className="flex items-start gap-3">
          <Database className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block text-sm">Storage Integrity & Fault-Tolerance Engine</strong>
            The portal protects against browser storage crashes, corrupt JSON tokens, and quota overflows. Test how the app recovers automatically from corrupt data without crashing.
          </div>
        </div>
        <button
          onClick={onTriggerCorruptedStorageTest}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs whitespace-nowrap shadow-xs shrink-0 transition-colors"
        >
          Simulate Corrupt Storage Test
        </button>
      </div>

      {/* Test Suites List */}
      <div className="space-y-4">
        {testSuites.map((suite) => {
          const isDone = completedTests[suite.id];
          return (
            <div
              key={suite.id}
              className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleTest(suite.id)}
                    className="mt-0.5 text-teal-600 dark:text-teal-400 focus:outline-none"
                    aria-label={`Toggle completion for ${suite.title}`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-slate-500" />
                    )}
                  </button>

                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      {suite.title}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {suite.description}
                    </p>

                    <div className="mt-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                      <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block">
                        Verification Steps:
                      </span>
                      <ol className="list-decimal list-inside space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                        {suite.steps.map((step, sIdx) => (
                          <li key={sIdx}>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    isDone
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {isDone ? 'Verified' : 'Pending Test'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
