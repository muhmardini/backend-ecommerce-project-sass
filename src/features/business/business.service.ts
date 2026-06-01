import { authRepo } from "#features/auth/auth.repository";
import { Business } from "#generated/prisma/client";
import { Errors } from "#shared/error";
import { omit } from "zod/mini";
import { businessRepo } from "./business.repository";
import { BusinessInputs, MemberInputs } from "./business.schema";

class BusinessService {
  newBusiness = async (
    input: BusinessInputs.CreateBusiness,
  ): Promise<Omit<Business, "updatedAt" | "id">> => {
    const businessExist = await businessRepo.findBusinessByName(input.name);

    if (businessExist) {
      throw Errors.Conflict("A business with a same name already exist");
    }
    const newBusiness = await businessRepo.createBusiness(input);
    return newBusiness;
  };
  getBusinesses = async (
    queries: BusinessInputs.GetAllBusinessesInput,
  ): Promise<Pick<Business, "name" | "description">[]> => {
    const businesses = await businessRepo.getAllBusinesses(queries);
    return businesses;
  };
  getMyBusinesses = async (
    id: string,
    input: BusinessInputs.GetBusinesses,
    queries: BusinessInputs.GetPaginateBusiness,
  ): Promise<
    Pick<
      Business,
      "name" | "description" | "location" | "links" | "createdAt"
    >[]
  > => {
    const businesses = await businessRepo.getBusinesses(id, input, queries);
    return businesses;
  };
  getUserTotalBusinessesCount = async (
    input: BusinessInputs.GetBusinesses,
    id: string,
  ): Promise<number> => {
    const count = await businessRepo.getUserBusinessesCount(input, id);
    return count;
  };
  getTotalBusinessCount = async (
    input: BusinessInputs.GetAllBusinessesInput,
  ) => {
    const count = await businessRepo.getBusinessesCount(input);
    return count;
  };
  getBusiness = async (
    slug: string,
  ): Promise<
    Pick<
      Business,
      | "name"
      | "description"
      | "location"
      | "links"
      | "slug"
      | "createdAt"
      | "id"
    >
  > => {
    const business = await businessRepo.getBusinessBySlug(slug);
    if (!business) {
      throw Errors.NotFound("Business not found");
    }
    return business;
  };
  getBusinessBySlug = async (slug: string) => {
    const business = await businessRepo.getBusinessBySlug(slug);
    return business;
  };
  editingBusiness = async (
    input: BusinessInputs.EditBusiness,
  ): Promise<Business> => {
    const business = await businessRepo.findBusinessByName(input.name);
    if (!business) {
      throw Errors.NotFound("Business does not exist");
    }
    const editedBusiness = await businessRepo.editBusiness(input);
    return editedBusiness;
  };
  deleteBusiness = async (
    input: BusinessInputs.DeleteBusiness,
  ): Promise<void> => {
    const business = await businessRepo.findBusinessByName(input.name);
    if (!business) {
      throw Errors.NotFound("Business is no longer exist");
    }
    await businessRepo.deleteBusiness(input);
  };
  addNewMember = async (input: MemberInputs.NewMemberParams, role: MemberInputs.NewMemberBody) => {
    const user = await authRepo.findUserById(input.userId)
    const business = await businessService.getBusiness(input.businessSlug);
    if(!user) {
      throw Errors.NotFound("User no longer exist")
    }
    if(!business){
      throw Errors.NotFound("Business no longer exist")
    }
    
    const businessMember = await businessRepo.addBusinessMember(input.userId, business.id, role);
    return businessMember;
  };
}

export const businessService = new BusinessService();
