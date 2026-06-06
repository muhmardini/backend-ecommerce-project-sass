import { z } from "zod";

export const NewBusinessSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  slug: z.string().trim().optional(),
  description: z.string().max(255, "Description is too long").optional(),
  location: z.string().max(255, "Location is too long").trim().optional(),
  links: z.array(z.string()).optional(),
});

export const EditBusinessSchema = NewBusinessSchema;

export const GetBusinessSchema = NewBusinessSchema.pick({
  slug: true
}).required();

export const DeleteBusinessSchema = NewBusinessSchema;

export const GetAllBusinessesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().optional().default(20),
});

export const GetPaginateBusinessSchema = GetAllBusinessesSchema;

export const GetUserBusinessesSchema = z.object({
  role: z.enum(["Owner", "CoWorker"]).optional(),
});

export namespace BusinessInputs {
  export type GetAllBusinessesInput = z.infer<typeof GetAllBusinessesSchema>;
  export type GetBusinesses = z.infer<typeof GetUserBusinessesSchema>;
  export type GetPaginateBusiness = z.infer<typeof GetPaginateBusinessSchema>;
  export type CreateBusiness = z.infer<typeof NewBusinessSchema>;
  export type EditBusiness = z.infer<typeof EditBusinessSchema>;
  export type GetBusiness = z.infer<typeof GetBusinessSchema>;
  export type DeleteBusiness = z.infer<typeof DeleteBusinessSchema>;
}

// Manage Members
export const NewMemberParamsSchema = z.object({
  userId: z.string(),
  businessSlug: z.string(),
});
export const NewMemberBodySchema = z.object({
  role: z.enum(["Owner", "CoWorker"]),
});

export const EditMemberParamsSchema = NewMemberParamsSchema

export const EditMemberBodySchema = NewMemberBodySchema

export const GetMembersSchema = z.object({
  slug: z.string()
})
export const GetMembersQuerySchema = GetAllBusinessesSchema

export const DeleteMemberSchema = z.object({
  slug: z.string(),
  userId : z.string(),
})
export namespace MemberInputs {
  export type NewMemberParams = z.infer<typeof NewMemberParamsSchema>;
  export type NewMemberBody = z.infer<typeof NewMemberBodySchema>;
  export type NewMember = z.infer<typeof NewMemberBodySchema & typeof NewMemberParamsSchema>
  export type EditMemberParams = z.infer<typeof EditMemberParamsSchema>;
  export type EditMemberBody = z.infer<typeof EditMemberBodySchema>;
  export type EditMember = z.infer<typeof EditMemberBodySchema & typeof EditMemberParamsSchema>
  export type GetMembers = z.infer<typeof GetMembersSchema>
  export type GetMembersQuery = z.infer<typeof GetMembersQuerySchema>
  export type DeleteMember = z.infer<typeof DeleteMemberSchema>
}
