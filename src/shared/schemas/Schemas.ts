import { z } from "zod";

export const ParamsUserIdSchema = z.object({
  userId: z.string(),
});

export const ParamsSlugSchema = z.object({
  slug: z.string(),
});

export const QueriesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().optional().default(20),
});

export const BusinessMemberRoleSchema = z.object({
  role: z.enum(["Owner", "CoWorker"]),
});
