import { ParamsSlugSchema, ParamsUserIdSchema, QueriesSchema, BusinessMemberRoleSchema } from "#shared/Schemas";
import { z } from "zod";

export const NewBusinessSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  slug: z.string().trim().optional(),
  description: z.string().max(255, "Description is too long").optional(),
  location: z.string().max(255, "Location is too long").trim().optional(),
  links: z.array(z.string()).optional(),
});

export const EditBusinessSchema = NewBusinessSchema;

export const DeleteBusinessSchema = NewBusinessSchema;


export const GetAllBusinessesSchema = z.object({
  query: QueriesSchema.and(BusinessMemberRoleSchema.optional()),
})

export const GetBusinessSchema = GetAllBusinessesSchema.required();

export const GetUserBusinessesSchema = z.object({
  role: z.enum(["Owner", "CoWorker"]).optional(),
});

export namespace BusinessInputs {
  export type CreateBusiness = z.infer<typeof NewBusinessSchema>;
  export type EditBusiness = z.infer<typeof EditBusinessSchema>;
  export type DeleteBusiness = z.infer<typeof DeleteBusinessSchema>;
  export type GetBusiness = z.infer<typeof GetBusinessSchema>;
  export type GetAllBusinessesInput = z.infer<typeof GetAllBusinessesSchema>;
  export type GetBusinesses = z.infer<typeof GetUserBusinessesSchema>;
}

// Manage Members

export const NewMemberSchema = z.object({
  params: ParamsSlugSchema.and(ParamsUserIdSchema),
  body: BusinessMemberRoleSchema
})

export const EditMemberSchema = NewMemberSchema

export const GetMembersSchema = z.object({
  query: QueriesSchema,
  params: ParamsSlugSchema 
})

export const DeleteMemberSchema = ParamsSlugSchema.and(ParamsUserIdSchema)
export namespace MemberInputs {
  export type NewMember = z.infer<typeof NewMemberSchema>
  export type EditMember = z.infer<typeof EditMemberSchema>;
  export type GetMembers = z.infer<typeof GetMembersSchema>
  export type DeleteMember = z.infer<typeof DeleteMemberSchema>
}
