import React, { useState } from 'react';
import { ViewMode, UserProfile } from '../types';
import { PRESET_PROFILES } from '../utils/storage';
import {
  Moon,
  Sun,
  User,
  Shield,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Search,
  Plus
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  activeProfile: UserProfile;
  onSelectProfile: (profile: UserProfile) => void;
  onOpenProfileModal: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  pendingClaimsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeProfile,
  onSelectProfile,
  onOpenProfileModal,
  isDark,
  onToggleTheme,
  pendingClaimsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const handleNavClick = (view: ViewMode) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: University Brand Lockup */}
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg p-1 group shrink-0"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 dark:from-teal-500 dark:via-teal-600 dark:to-cyan-600 text-white dark:text-slate-950 flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105 border border-slate-800/10 dark:border-teal-400/20">
              <GraduationCap className="w-5 h-5" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-teal-500 dark:bg-slate-900 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[7px] text-white font-extrabold">
                LF
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400 leading-none">
                  CAMPUS SERVICES
                </span>
                <span className="w-1 h-1 rounded-full bg-teal-500"></span>
                <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-medium">LIVE</span>
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 block leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Lost & Found Portal
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-semibold">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                currentView === 'dashboard'
                  ? 'bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavClick('browse')}
              className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                currentView === 'browse'
                  ? 'bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Browse Catalog
            </button>
            <button
              onClick={() => handleNavClick('report_lost')}
              className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentView === 'report_lost'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold border border-rose-200/70 dark:border-rose-900/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Report Lost
            </button>
            <button
              onClick={() => handleNavClick('report_found')}
              className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentView === 'report_found'
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold border border-teal-200/70 dark:border-teal-900/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50/50 dark:hover:bg-teal-950/20'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              Report Found
            </button>
            <button
              onClick={() => handleNavClick('my_activity')}
              className={`relative px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                currentView === 'my_activity'
                  ? 'bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              My Activity
              {pendingClaimsCount > 0 && (
                <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white font-mono shadow-2xs">
                  {pendingClaimsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavClick('testing_guide')}
              className={`px-2.5 py-2 rounded-lg transition-all whitespace-nowrap text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white ${
                currentView === 'testing_guide'
                  ? 'bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-bold'
                  : ''
              }`}
            >
              QA & Guide
            </button>
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Quick Report Dropdown (Desktop) */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setQuickAddOpen(!quickAddOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Report</span>
                <ChevronDown className="w-3 h-3 text-teal-200" />
              </button>

              {quickAddOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setQuickAddOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => {
                        setQuickAddOpen(false);
                        onNavigate('report_lost');
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 flex items-center gap-2 font-medium transition-colors"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      <span>Report Lost Item</span>
                    </button>
                    <button
                      onClick={() => {
                        setQuickAddOpen(false);
                        onNavigate('report_found');
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-teal-700 dark:text-teal-300 flex items-center gap-2 font-medium transition-colors border-t border-slate-100 dark:border-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-500" />
                      <span>Report Found Item</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle with Polish */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-90 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 transition-transform -rotate-12 hover:rotate-0 duration-300" />
              )}
            </button>

            {/* Demo User Switcher Chip */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                aria-haspopup="true"
                aria-expanded={profileDropdownOpen}
              >
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {activeProfile.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left max-w-[110px] truncate">
                  <span className="block truncate font-semibold leading-tight text-slate-900 dark:text-slate-100">
                    {activeProfile.name}
                  </span>
                  <span className="block text-[10px] text-teal-600 dark:text-teal-400 capitalize truncate font-medium">
                    {activeProfile.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-850 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                          ACTIVE CAMPUS ID
                        </span>
                        <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                          {activeProfile.studentId}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1">
                        {activeProfile.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {activeProfile.department}
                      </p>
                    </div>

                    <div className="px-2 py-1.5">
                      <span className="px-2 py-1 block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Switch Demo Persona
                      </span>
                      {PRESET_PROFILES.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => {
                            onSelectProfile(preset);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                            activeProfile.id === preset.id
                              ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-semibold'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {preset.name.charAt(0)}
                            </div>
                            <div className="truncate">
                              <span className="block truncate">{preset.name}</span>
                              <span className="text-[10px] text-slate-400 block truncate capitalize">
                                {preset.role} · {preset.department.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                          {activeProfile.id === preset.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700 pt-1.5 px-2">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenProfileModal();
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30 text-xs flex items-center gap-2 transition-colors"
                      >
                        <User className="w-3.5 h-3.5" />
                        Edit Profile Details...
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 text-xs font-semibold animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleNavClick('report_lost')}
              className="py-2.5 px-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 flex items-center justify-center gap-1.5 border border-rose-200/60 dark:border-rose-900/40"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Report Lost
            </button>
            <button
              onClick={() => handleNavClick('report_found')}
              className="py-2.5 px-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 flex items-center justify-center gap-1.5 border border-teal-200/60 dark:border-teal-900/40"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Report Found
            </button>
          </div>

          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between ${
              currentView === 'dashboard'
                ? 'bg-slate-100 dark:bg-slate-800 font-bold text-teal-700 dark:text-teal-300'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavClick('browse')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between ${
              currentView === 'browse'
                ? 'bg-slate-100 dark:bg-slate-800 font-bold text-teal-700 dark:text-teal-300'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            Browse Catalog
          </button>
          <button
            onClick={() => handleNavClick('my_activity')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between ${
              currentView === 'my_activity'
                ? 'bg-slate-100 dark:bg-slate-800 font-bold text-teal-700 dark:text-teal-300'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span>My Activity</span>
            {pendingClaimsCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white font-mono">
                {pendingClaimsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleNavClick('testing_guide')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between ${
              currentView === 'testing_guide'
                ? 'bg-slate-100 dark:bg-slate-800 font-bold text-teal-700 dark:text-teal-300'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            QA & Testing Guide
          </button>
        </div>
      )}
    </header>
  );
};
