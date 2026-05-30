import { z } from "zod";

export const NewBusinessSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  description: z.string().max(255, "Description is too long").optional(),
  location: z.string().max(255, "Location is too long").trim().optional(),
  links: z.array(z.string()).optional(),
  slug: z.string().slugify().trim(),
});

export const GetBusinessSchema = z.object({
  slug: z.string().trim(),
});

export const DeleteBusinessSchema = z.object({
  slug: z.string().trim(),
});

export const EditBusinessSchema = z.object({
  name: z.string().trim(),
  description: z.string().max(255, "Description is too long").optional(),
  location: z.string().max(255, "Location is too long").trim().optional(),
  links: z.array(z.string()).optional(),
  slug: z.string().slugify().optional(),
});

export const GetBusinessesSchema = z.object({
  role: z.enum(["Owner", "CoWorker"]),
});

export const GetPaginateBusinessSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export namespace BusinessInputs {
  export type GetBusinesses = z.infer<typeof GetBusinessesSchema>;
  export type GetPaginateBusiness = z.infer<
    typeof GetPaginateBusinessSchema
  >;
  export type CreateBusiness = z.infer<typeof NewBusinessSchema>;
  export type EditBusiness = z.infer<typeof EditBusinessSchema>;
  export type GetBusiness = z.infer<typeof GetBusinessSchema>;
  export type DeleteBusiness = z.infer<typeof DeleteBusinessSchema>;
}
