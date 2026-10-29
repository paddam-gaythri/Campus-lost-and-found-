import { ReportItem, UserProfile } from '../types';

export const STORAGE_KEYS = {
  REPORTS: 'campus_lf_reports_v2',
  ACTIVE_PROFILE: 'campus_lf_profile_v2',
  SAVED_PROFILES: 'campus_lf_saved_profiles_v2',
  THEME: 'campus_lf_theme_v2',
};

// Preset demo users
export const PRESET_PROFILES: UserProfile[] = [
  {
    id: 'user_alex',
    name: 'Alex Chen',
    studentId: 'STU-2024-8841',
    role: 'student',
    department: 'School of Computing',
    course: 'B.S. Computer Science (Year 3)',
    email: 'alex.chen@campus.edu',
    phone: '+1 (555) 349-8201',
  },
  {
    id: 'user_priya',
    name: 'Officer Priya Patel',
    studentId: 'EMP-SEC-402',
    role: 'security',
    department: 'Campus Safety & Physical Security',
    course: 'Campus Administration',
    email: 'security.desk@campus.edu',
    phone: '+1 (555) 700-SAFE',
  },
  {
    id: 'user_marcus',
    name: 'Marcus Vance',
    studentId: 'STU-2023-5120',
    role: 'student',
    department: 'College of Engineering',
    course: 'B.S. Mechanical Engineering (Year 2)',
    email: 'marcus.vance@campus.edu',
    phone: '+1 (555) 412-9938',
  },
];

// Initial realistic campus lost & found seed items
export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'item-seed-1',
    type: 'lost',
    title: 'Casio fx-CG50 Graphing Calculator',
    category: 'Electronics',
    color: 'White & Black',
    location: 'Main University Library - Level 2 Quiet Study Room',
    date: '2026-10-27',
    description: 'Graphing calculator left behind in quiet cubicle #14 after Math 241 prep session. In white protective sliding slipcover.',
    identifyingMarks: 'Small silver initials "AC" scratched on back battery cover; custom sine-wave program saved in memory.',
    contactMethod: 'email',
    contactValue: 'alex.chen@campus.edu',
    reporterName: 'Alex Chen',
    reporterId: 'user_alex',
    reporterEmail: 'alex.chen@campus.edu',
    imageUrl: '/images/lost_calculator_1793252413976.jpg',
    status: 'open',
    createdAt: '2026-10-27T14:30:00Z',
    updatedAt: '2026-10-27T14:30:00Z',
    claims: [],
  },
  {
    id: 'item-seed-2',
    type: 'found',
    title: 'White Wireless Bluetooth Earbuds & Charging Case',
    category: 'Electronics',
    color: 'White',
    location: 'Student Union Cafe - Near high-top tables by the window',
    date: '2026-10-28',
    description: 'Found an intact charging case with both wireless earbuds inside sitting beside coffee mug area at 11:30 AM.',
    identifyingMarks: 'Distinctive silicone case with small sticker on underside (claimant must name sticker or bluetooth device name to verify).',
    storageLocation: 'Student Union Information Desk (Bin #3)',
    contactMethod: 'desk',
    contactValue: 'Student Union Desk / marcus.vance@campus.edu',
    reporterName: 'Marcus Vance',
    reporterId: 'user_marcus',
    reporterEmail: 'marcus.vance@campus.edu',
    imageUrl: '/images/found_earbuds_1793252414552.jpg',
    status: 'claim_pending',
    createdAt: '2026-10-28T09:15:00Z',
    updatedAt: '2026-10-28T16:00:00Z',
    claims: [
      {
        id: 'claim-seed-1',
        itemId: 'item-seed-2',
        claimantName: 'Jordan Taylor',
        claimantEmail: 'j.taylor@campus.edu',
        claimantPhone: '+1 (555) 819-2041',
        claimantStudentId: 'STU-2025-1102',
        identifyingDetails: 'The charging case has a small blue NASA retro astronaut sticker on the bottom. The Bluetooth device broadcast name is "J-Buds-Pro". Left earbud has medium silicone tip, right has small tip.',
        submittedAt: '2026-10-28T15:45:00Z',
        status: 'pending',
      },
    ],
  },
  {
    id: 'item-seed-3',
    type: 'lost',
    title: 'Navy Blue Campus Student Backpack',
    category: 'Bags & Wallets',
    color: 'Navy Blue',
    location: 'Science Complex Atrium / Chemistry Lecture Hall B',
    date: '2026-10-26',
    description: 'Left navy blue backpack under seat row 4 after Organic Chemistry lecture. Contains laboratory spiral notebook and water bottle.',
    identifyingMarks: 'Small embroidered college shield on front pouch; brown leather zipper pulls; silver stainless thermos in side mesh.',
    contactMethod: 'phone',
    contactValue: '+1 (555) 349-8201',
    reporterName: 'Alex Chen',
    reporterId: 'user_alex',
    reporterEmail: 'alex.chen@campus.edu',
    imageUrl: '/images/lost_backpack_1793252414639.jpg',
    status: 'open',
    createdAt: '2026-10-26T16:10:00Z',
    updatedAt: '2026-10-26T16:10:00Z',
    claims: [],
  },
  {
    id: 'item-seed-4',
    type: 'found',
    title: 'Campus Dorm Keycard with Lanyard & Brass Key',
    category: 'Keys & Access',
    color: 'Crimson / Gold',
    location: 'North Quad Athletic Fields Pathway',
    date: '2026-10-28',
    description: 'Found a campus crimson lanyard with an RFID dormitory tap card and a single brass cylinder door key.',
    identifyingMarks: 'Dorm access card has room number suffix covered by tape for safety. Verification requires stating building name or student badge number.',
    storageLocation: 'Campus Security Main Office (Desk Reception)',
    contactMethod: 'desk',
    contactValue: 'Officer Priya Patel (Security Dispatch x402)',
    reporterName: 'Officer Priya Patel',
    reporterId: 'user_priya',
    reporterEmail: 'security.desk@campus.edu',
    status: 'open',
    createdAt: '2026-10-28T08:00:00Z',
    updatedAt: '2026-10-28T08:00:00Z',
    claims: [],
  },
  {
    id: 'item-seed-5',
    type: 'lost',
    title: 'Biology 201 Bound Laboratory Notebook',
    category: 'Books & Notes',
    color: 'Black & Green',
    location: 'Health Sciences Building - Room 302',
    date: '2026-10-25',
    description: 'Hardcover grid-ruled lab notebook with hand-drawn microscopy diagrams from weeks 1 through 6.',
    identifyingMarks: 'Name "Sarah L." written on inside flyleaf with yellow highlighter marks on page 42.',
    contactMethod: 'email',
    contactValue: 'sarah.lin@campus.edu',
    reporterName: 'Sarah Lin',
    reporterId: 'user_sarah_ext',
    reporterEmail: 'sarah.lin@campus.edu',
    status: 'resolved',
    createdAt: '2026-10-25T11:20:00Z',
    updatedAt: '2026-10-27T17:40:00Z',
    claims: [
      {
        id: 'claim-seed-resolved',
        itemId: 'item-seed-5',
        claimantName: 'Sarah Lin',
        claimantEmail: 'sarah.lin@campus.edu',
        claimantPhone: '+1 (555) 902-1482',
        claimantStudentId: 'STU-2024-3329',
        identifyingDetails: 'Owner verified student ID and correctly identified the experiment titles on pages 15-22.',
        submittedAt: '2026-10-27T16:00:00Z',
        status: 'accepted',
        reviewNotes: 'Verified and handed over in person at Biology Department reception.',
        reviewedAt: '2026-10-27T17:40:00Z',
      },
    ],
  },
];

// Load reports safely with corruption recovery
export function getStoredReports(): ReportItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) {
      // First run: save seed data
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 0) {
      return parsed;
    }
    console.warn('Invalid reports array in localStorage. Resetting to seed data.');
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
    return INITIAL_REPORTS;
  } catch (error) {
    console.error('Failed to parse reports from localStorage. Restoring initial state.', error);
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
    } catch {
      // ignore
    }
    return INITIAL_REPORTS;
  }
}

// Save reports safely with QuotaExceeded handling
export function saveStoredReports(reports: ReportItem[]): { success: boolean; error?: string } {
  try {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    return { success: true };
  } catch (err: unknown) {
    console.error('Storage quota exceeded or storage error:', err);
    return {
      success: false,
      error: 'Browser storage limit reached. Please remove large photo attachments or reset demo data.',
    };
  }
}

// Reset data back to default demo state
export function resetToSeedData(): ReportItem[] {
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
  return INITIAL_REPORTS;
}

// User Profile Management
export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id && parsed.name) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Error reading stored profile, using default profile', error);
  }
  // Default to Alex Chen (student)
  const defaultUser = PRESET_PROFILES[0];
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, JSON.stringify(defaultUser));
  } catch {
    // ignore
  }
  return defaultUser;
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving profile', err);
  }
}

// Client-side image optimization to prevent localStorage quota exhaustion
export async function optimizeImageFile(file: File): Promise<string> {
  // Validate type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Unsupported image format. Please select JPEG, PNG, or WebP.');
  }

  // 2MB size limit validation
  const MAX_FILE_BYTES = 2 * 1024 * 1024;
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed is 2.0MB.`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read selected image.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image data.'));
      img.onload = () => {
        // Downscale to max 800px on the longest edge
        const MAX_DIM = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Fill white background so transparent PNGs/WebPs don't render black in JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG at 0.75 quality for compact storage (<80kb)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
        resolve(compressedBase64);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
