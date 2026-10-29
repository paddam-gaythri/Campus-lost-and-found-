export type ReportType = 'lost' | 'found';

export type ItemCategory =
  | 'Electronics'
  | 'ID & Cards'
  | 'Books & Notes'
  | 'Keys & Access'
  | 'Bags & Wallets'
  | 'Clothing & Gear'
  | 'Sports Equipment'
  | 'Other';

export type ItemStatus = 'open' | 'claim_pending' | 'resolved';

export type ClaimStatus = 'pending' | 'accepted' | 'rejected';

export interface Claim {
  id: string;
  itemId: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  claimantStudentId: string;
  identifyingDetails: string;
  submittedAt: string;
  status: ClaimStatus;
  reviewNotes?: string;
  reviewedAt?: string;
}

export interface ReportItem {
  id: string;
  type: ReportType;
  title: string;
  category: ItemCategory;
  color: string;
  location: string;
  date: string; // YYYY-MM-DD
  description: string;
  identifyingMarks: string;
  storageLocation?: string; // Drop-off location for found items (e.g., Campus Security Desk)
  contactMethod: 'email' | 'phone' | 'desk';
  contactValue: string;
  reporterName: string;
  reporterId: string;
  reporterEmail: string;
  imageUrl?: string;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
  claims: Claim[];
}

export interface UserProfile {
  id: string;
  name: string;
  studentId: string;
  role: 'student' | 'faculty' | 'staff' | 'security';
  department: string;
  course: string;
  email: string;
  phone: string;
}

export type ViewMode = 'dashboard' | 'browse' | 'report_lost' | 'report_found' | 'my_activity' | 'testing_guide';
