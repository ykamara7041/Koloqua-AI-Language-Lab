export type Role = "guest" | "contributor" | "reviewer" | "admin";

export type View =
  | "overview"
  | "contribute"
  | "review"
  | "validate"
  | "sentences"
  | "achievements"
  | "institutions"
  | "earnings"
  | "campaigns"
  | "leaderboard"
  | "consent"
  | "audit"
  | "export"
  | "admin"
  | "profile";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  institution?: string;
  isAdult: boolean;
  hasConsented: boolean;
  joinedAt: string;
  avatar?: string;
  sessionToken?: string;
}

export interface Task {
  id: number;
  english: string;
  category: string;
  reward: number;
  done: number;
  total: number;
  campaignId: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface ReviewItem {
  id: string;
  text: string;
  translation: string;
  speaker: string;
  quality: number;
  duration: number;
  flags: QualityFlag;
  submittedAt: string;
  reviews: number;
}

export type QualityFlag = "silence" | "duration" | "duplicate" | "synthetic" | null;

export interface Institution {
  id: string;
  name: string;
  city: string;
  contributors: number;
  approvedItems: number;
  pendingItems: number;
  verified: boolean;
  tier: "platinum" | "gold" | "silver";
}

export interface LedgerRow {
  id: string;
  type: string;
  reference: string;
  status: "Approved" | "Pending" | "Rejected";
  amount: string;
  date: string;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  version: string;
  agreedAt: string;
  revocable: boolean;
  guardian?: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  risk?: "low" | "medium" | "high";
}

export interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "closed";
  target: number;
  collected: number;
  deadline: string;
  sponsor: string;
  rewardPerItem: number;
}

export interface DatasetRelease {
  id: string;
  version: string;
  records: number;
  hours: number;
  releasedAt: string;
  license: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  institution: string;
  contributions: number;
  approved: number;
  earnings: number;
  streak: number;
  avatar?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: "mic" | "check" | "flame" | "target" | "shield" | "star" | "book" | "heart" | "award";
  unlockedAt?: string;
  progress: number;
  total: number;
  rarity?: "common" | "rare" | "epic";
}

export interface SentencePrompt {
  id: string;
  english: string;
  koloqua: string;
  category: string;
  contributor: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  votes: number;
  sourceNote?: string;
}

export interface ValidationClip {
  id: string;
  text: string;
  translation: string;
  speaker: string;
  duration: number;
  quality: number;
  submittedAt: string;
  yesVotes: number;
  noVotes: number;
}

export interface ContributionGoal {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  deadline: string;
}

export interface PayoutRequest {
  id: string;
  userId: string;
  amount: number;
  phone: string;
  status: "pending" | "approved" | "rejected" | "paid";
  requestedAt: string;
  processedAt?: string;
}
