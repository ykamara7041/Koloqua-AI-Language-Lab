import type {
  Task,
  ReviewItem,
  Institution,
  LedgerRow,
  ConsentRecord,
  AuditEvent,
  Campaign,
  DatasetRelease,
  LeaderboardEntry,
  Achievement,
} from "./types";

export const tasks: Task[] = [
  { id: 1, english: "Where are you going?", category: "Daily life", reward: 12, done: 18, total: 25, campaignId: "C-001", difficulty: "easy" },
  { id: 2, english: "Please show me the nearest clinic.", category: "Health", reward: 18, done: 9, total: 20, campaignId: "C-001", difficulty: "medium" },
  { id: 3, english: "How much does this cost?", category: "Market", reward: 12, done: 21, total: 30, campaignId: "C-002", difficulty: "easy" },
  { id: 4, english: "I greet the family.", category: "Daily life", reward: 10, done: 7, total: 15, campaignId: "C-002", difficulty: "easy" },
  { id: 5, english: "The rain is falling hard.", category: "Environment", reward: 14, done: 4, total: 12, campaignId: "C-003", difficulty: "medium" },
  { id: 6, english: "My child is not feeling well.", category: "Health", reward: 20, done: 2, total: 10, campaignId: "C-001", difficulty: "hard" },
];

export const reviewItems: ReviewItem[] = [
  { id: "KL-1048", text: "Whe you going?", translation: "Where are you going?", speaker: "Speaker 038", quality: 92, duration: 4, flags: null, submittedAt: "2026-07-16T10:00:00Z", reviews: 1 },
  { id: "KL-1049", text: "Da how much?", translation: "How much does it cost?", speaker: "Speaker 114", quality: 88, duration: 3, flags: "duration", submittedAt: "2026-07-16T09:30:00Z", reviews: 1 },
  { id: "KL-1050", text: "My body fini me.", translation: "I am very tired.", speaker: "Speaker 072", quality: 95, duration: 4, flags: null, submittedAt: "2026-07-16T08:45:00Z", reviews: 2 },
  { id: "KL-1051", text: "I dey go market.", translation: "I am going to the market.", speaker: "Speaker 021", quality: 71, duration: 6, flags: "silence", submittedAt: "2026-07-15T16:20:00Z", reviews: 1 },
  { id: "KL-1052", text: "Bring watah for me.", translation: "Bring water for me.", speaker: "Speaker 067", quality: 85, duration: 4, flags: "duplicate", submittedAt: "2026-07-15T14:10:00Z", reviews: 1 },
  { id: "KL-1053", text: "I want eat rice.", translation: "I want to eat rice.", speaker: "Speaker 091", quality: 96, duration: 5, flags: null, submittedAt: "2026-07-15T11:30:00Z", reviews: 2 },
];

export const institutions: Institution[] = [
  { id: "INS-001", name: "Starz University", city: "Monrovia", contributors: 28, approvedItems: 612, pendingItems: 42, verified: true, tier: "platinum" },
  { id: "INS-002", name: "University of Liberia", city: "Monrovia", contributors: 22, approvedItems: 398, pendingItems: 31, verified: true, tier: "gold" },
  { id: "INS-003", name: "BWI", city: "Kakata", contributors: 18, approvedItems: 238, pendingItems: 19, verified: true, tier: "silver" },
  { id: "INS-004", name: "Cuttington University", city: "Gbarnga", contributors: 12, approvedItems: 94, pendingItems: 67, verified: false, tier: "silver" },
];

export const ledgerRows: LedgerRow[] = [
  { id: "L-001", type: "Prepared sentence · Health", reference: "KL-1028", status: "Approved", amount: "+ L$18", date: "2026-07-14" },
  { id: "L-002", type: "Natural conversation · Market", reference: "KL-0972", status: "Approved", amount: "+ L$120", date: "2026-07-12" },
  { id: "L-003", type: "Independent review", reference: "KL-0961", status: "Approved", amount: "+ L$15", date: "2026-07-11" },
  { id: "L-004", type: "Prepared sentence · Daily life", reference: "KL-0954", status: "Pending", amount: "L$12", date: "2026-07-10" },
  { id: "L-005", type: "Prepared sentence · Environment", reference: "KL-1048", status: "Approved", amount: "+ L$14", date: "2026-07-09" },
];

export const consentRecords: ConsentRecord[] = [
  { id: "CON-001", userId: "u-001", version: "v1.2", agreedAt: "2025-09-12T09:30:00Z", revocable: true },
  { id: "CON-002", userId: "u-002", version: "v1.2", agreedAt: "2025-10-04T14:12:00Z", revocable: true, guardian: "Parent/Guardian consent recorded" },
];

export const auditEvents: AuditEvent[] = [
  { id: "AUD-001", actor: "Speaker 038", action: "contribution_submitted", target: "KL-1048", timestamp: "2025-11-02T10:00:00Z", risk: "low" },
  { id: "AUD-002", actor: "Reviewer A", action: "review_approved", target: "KL-1048", timestamp: "2025-11-02T11:20:00Z", risk: "low" },
  { id: "AUD-003", actor: "System", action: "synthetic_voice_flag", target: "KL-1053", timestamp: "2025-11-03T08:15:00Z", risk: "high" },
  { id: "AUD-004", actor: "Admin", action: "consent_revoked", target: "u-004", timestamp: "2025-11-03T13:42:00Z", risk: "medium" },
  { id: "AUD-005", actor: "System", action: "duplicate_audio_detected", target: "KL-1052", timestamp: "2025-11-04T09:10:00Z", risk: "medium" },
  { id: "AUD-006", actor: "Reviewer B", action: "review_rejected", target: "KL-1051", timestamp: "2025-11-04T11:00:00Z", risk: "low" },
];

export const campaigns: Campaign[] = [
  { id: "C-001", name: "Daily life expressions", status: "active", target: 500, collected: 127, deadline: "2026-02-28", sponsor: "Koloqua Foundation", rewardPerItem: 12 },
  { id: "C-002", name: "Health & clinic phrases", status: "active", target: 300, collected: 198, deadline: "2026-01-15", sponsor: "Ministry of Health", rewardPerItem: 18 },
  { id: "C-003", name: "Market & trade vocabulary", status: "paused", target: 400, collected: 89, deadline: "2026-03-10", sponsor: "TradeBridge Liberia", rewardPerItem: 14 },
  { id: "C-004", name: "Education & classroom", status: "closed", target: 250, collected: 250, deadline: "2025-12-15", sponsor: "TeachForLiberia", rewardPerItem: 15 },
];

export const datasetReleases: DatasetRelease[] = [
  { id: "DS-001", version: "0.1.0-pilot", records: 1240, hours: 18.5, releasedAt: "2025-10-01", license: "CC-BY-SA 4.0" },
  { id: "DS-002", version: "0.2.0-pilot", records: 2870, hours: 42.0, releasedAt: "2025-12-10", license: "CC-BY-SA 4.0" },
  { id: "DS-003", version: "0.3.0-pilot", records: 4105, hours: 61.5, releasedAt: "2026-06-20", license: "CC-BY-SA 4.0" },
];

export const leaderboard: LeaderboardEntry[] = [
  { id: "u-101", rank: 1, name: "Amina Doe", institution: "Starz University", contributions: 342, approved: 318, earnings: 4860, streak: 12 },
  { id: "u-102", rank: 2, name: "James Kollie", institution: "University of Liberia", contributions: 298, approved: 271, earnings: 3980, streak: 8 },
  { id: "u-103", rank: 3, name: "Sarah Weah", institution: "BWI", contributions: 245, approved: 229, earnings: 3240, streak: 15 },
  { id: "u-104", rank: 4, name: "Joseph Tokpah", institution: "Starz University", contributions: 198, approved: 176, earnings: 2460, streak: 5 },
  { id: "u-105", rank: 5, name: "Mercy Fallah", institution: "Cuttington University", contributions: 167, approved: 148, earnings: 1980, streak: 7 },
  { id: "u-106", rank: 6, name: "Emmanuel Cooper", institution: "University of Liberia", contributions: 134, approved: 121, earnings: 1620, streak: 3 },
];

export const achievements: Achievement[] = [
  { id: "ach-1", title: "First Voice", description: "Submit your first contribution", icon: "mic", progress: 1, total: 1, unlockedAt: "2026-07-01" },
  { id: "ach-2", title: "Quality Keeper", description: "Approve 50 review items", icon: "check", progress: 34, total: 50 },
  { id: "ach-3", title: "Streak Star", description: "Contribute for 7 days in a row", icon: "flame", progress: 5, total: 7 },
  { id: "ach-4", title: "Campaign Champion", description: "Complete a full campaign task", icon: "target", progress: 1, total: 1, unlockedAt: "2026-07-05" },
  { id: "ach-5", title: "Trusted Reviewer", description: "Reach 95% review agreement", icon: "shield", progress: 92, total: 95 },
];

export function canAccess(view: string, role: string): boolean {
  const permissions: Record<string, string[]> = {
    overview: ["guest", "contributor", "reviewer", "admin"],
    contribute: ["contributor", "admin"],
    review: ["reviewer", "admin"],
    institutions: ["contributor", "reviewer", "admin"],
    earnings: ["contributor", "reviewer", "admin"],
    campaigns: ["reviewer", "admin", "contributor"],
    leaderboard: ["contributor", "reviewer", "admin"],
    consent: ["contributor", "reviewer", "admin"],
    audit: ["admin"],
    export: ["admin"],
    admin: ["admin"],
    profile: ["contributor", "reviewer", "admin"],
  };
  return permissions[view]?.includes(role) ?? false;
}
