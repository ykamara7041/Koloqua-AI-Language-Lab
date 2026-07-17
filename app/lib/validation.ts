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
  amount: z.coerce.number().positive().max(10000, "Payout request exceeds daily limit."),
  phone: z.string().regex(/^\+?\d{8,15}$/, "Enter a valid mobile-money number."),
});

export type ContributionForm = z.infer<typeof contributionSchema>;
export type ReviewNoteForm = z.infer<typeof reviewNoteSchema>;
export type PayoutForm = z.infer<typeof payoutSchema>;
