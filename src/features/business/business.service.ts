import { authRepo } from "#features/auth/auth.repository";
import { Business } from "#generated/prisma/client";
import { Errors } from "#shared/error";
import { omit } from "zod/mini";
import { businessRepo } from "./business.repository";
import { BusinessInputs, MemberInputs } from "./business.schema";
import { AuthUser } from "#types/express.d";

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
    input: BusinessInputs.GetAllBusinessesInput,
  ): Promise<{businesses: Pick<Business, "name" | "description">[], totalBusinesses: number}> => {
    const businesses = await businessRepo.getAllBusinesses(input);
    return businesses;
  };
  getMyBusinesses = async (
    input: BusinessInputs.GetAllBusinessesInput & AuthUser,
  ): Promise<{
    businesses: Pick<Business,
      "name" | "description" | "location" | "links" | "createdAt"
    >[],
  totalBusinesses: number
}
  > => {
    const businesses = await businessRepo.getBusinesses(input);
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
  addNewMember = async (input: MemberInputs.NewMember) => {
    const user = await authRepo.findUserById(input.params.userId)
    const business = await businessService.getBusinessBySlug(input.params.slug);
    if(!user) {
      throw Errors.NotFound("User no longer exist")
    }
    if(!business){
      throw Errors.NotFound("Business no longer exist")
    }
    
    const businessMember = await businessRepo.addBusinessMember(business.id, input);
    return businessMember;
  };
  editMember = async (input: MemberInputs.EditMember) => {
    const user = await authRepo.findUserById(input.params.userId)
    const business = await businessService.getBusinessBySlug(input.params.slug)
    if(!user) {
      throw Errors.NotFound("User no longer exist")
    }
    if(!business) {
      throw Errors.NotFound("Business no longer exist")
    }
    const editedMember = await businessRepo.editBusinessMember(business.id, input);
    return editedMember
  }
  getMembers = async (input: MemberInputs.GetMembers) => {
    const members = await businessRepo.getBusinessMembers(input);
    return members
  }
  getMembersCount = async (input: MemberInputs.GetMembers) => {
    const membersCount = await businessRepo.getBusinessMembersCount(input)
    return membersCount
  }
  deleteMember = async (input: MemberInputs.DeleteMember) => {
    const business = await businessRepo.findBusinessBySlug(input.slug)
    if(!business){
      throw Errors.NotFound("Business no longer exist")
    }
    const member = await businessRepo.getBusinessMember(input.userId, business.id)
    if(!member) {
      Errors.NotFound("Member no longer exist")
    }
  }
}

export const businessService = new BusinessService();
