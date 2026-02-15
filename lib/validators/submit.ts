import { z } from "zod";

const urlOrEmpty = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v && v.length ? v : undefined))
  .refine((v) => !v || /^https?:\/\//i.test(v), "URL must start with http:// or https://");

export const SubmitSchema = z.object({
  mint: z.string().trim().min(32).max(64),
  website_url: urlOrEmpty,
  twitter_url: urlOrEmpty,
  telegram_url: urlOrEmpty,
  discord_url: urlOrEmpty,
});

export type SubmitPayload = z.infer<typeof SubmitSchema>;
