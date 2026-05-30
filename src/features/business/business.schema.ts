import { z } from "zod";

export const NewBusinessSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  description: z.string().max(255, "Description is too long").optional(),
  location: z.string().max(255, "Location is too long").trim().optional(),
  links: z.array(z.string()).optional(),
  slug: z.string().slugify().trim(),
});

export const EditBusinessSchema = NewBusinessSchema

export const GetBusinessSchema = NewBusinessSchema.pick({
  slug: true,
})

export const DeleteBusinessSchema = GetBusinessSchema

export const GetAllBusinessesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().optional().default(20)
})

export const GetPaginateBusinessSchema = GetAllBusinessesSchema;

export const GetUserBusinessesSchema = z.object({
  role: z.enum(["Owner", "CoWorker"]),
});


export namespace BusinessInputs {
  export type GetAllBusinessesInput = z.infer<typeof GetAllBusinessesSchema>
  export type GetBusinesses = z.infer<typeof GetUserBusinessesSchema>;
  export type GetPaginateBusiness = z.infer<
    typeof GetPaginateBusinessSchema
  >;
  export type CreateBusiness = z.infer<typeof NewBusinessSchema>;
  export type EditBusiness = z.infer<typeof EditBusinessSchema>;
  export type GetBusiness = z.infer<typeof GetBusinessSchema>;
  export type DeleteBusiness = z.infer<typeof DeleteBusinessSchema>;
}
