import { z } from "zod";

export const emailSchema = z.string().email("Enter a valid email address.");

export const contributionSchema = z.object({
  koloqua: z.string().min(2, "Koloqua text is too short.").max(500, "Koloqua text is too long."),
  context: z.string().max(300, "Context note is too long."),
  consent: z.literal(true, { message: "You must agree to contribute your voice." }),
});

export const reviewNoteSchema = z.object({
  note: z.string().max(600, "Review note is too long."),
  decision: z.enum(["approve", "reject", "request-correction"]),
});

export const payoutSchema = z.object({
  amount: z.coerce.number().positive().min(500, "Minimum payout is L$500.").max(5000, "Payout request exceeds daily limit of L$5,000."),
  phone: z.string().regex(/^\+?\d{8,15}$/, "Enter a valid mobile-money number."),
  pin: z.string().regex(/^\d{4,6}$/, "Payment PIN must be 4 to 6 digits."),
});

export const sentencePromptSchema = z.object({
  english: z.string().min(3, "English sentence is too short.").max(200, "English sentence is too long."),
  koloqua: z.string().min(3, "Koloqua sentence is too short.").max(200, "Koloqua sentence is too long."),
  category: z.string().min(1, "Select a category."),
  sourceNote: z.string().max(200, "Source note is too long.").optional(),
  original: z.literal(true, { message: "Only original or public-domain sentences may be submitted." }),
});

export const validationVoteSchema = z.object({
  vote: z.enum(["yes", "no", "skip"]),
  reason: z.string().max(300, "Reason is too long.").optional(),
});

export const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit verification code."),
});

export type ContributionForm = z.infer<typeof contributionSchema>;
export type ReviewNoteForm = z.infer<typeof reviewNoteSchema>;
export type PayoutForm = z.infer<typeof payoutSchema>;
export type SentencePromptForm = z.infer<typeof sentencePromptSchema>;
export type ValidationVoteForm = z.infer<typeof validationVoteSchema>;
export type OtpForm = z.infer<typeof otpSchema>;
