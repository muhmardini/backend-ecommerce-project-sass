import { Business } from "#generated/prisma/client";
import { Errors } from "#shared/error";
import { businessRepo } from "./business.repository";
import { BusinessInputs } from "./business.schema";
import slugify from "slugify";

class BusinessService {
  newBusiness = async (
    input: BusinessInputs.CreateBusiness,
  ): Promise<Business> => {
    const businessExist = await businessRepo.findBusinessByName(input.name);

    if (businessExist) {
      throw Errors.Conflict("A business with a same name already exist");
    }
    input.slug = slugify(input.name, {
      lower: true,
      strict: true,
    });
    const newBusiness = await businessRepo.createBusiness(input);
    return newBusiness;
  };
  getBusinesses = async (
    queries: BusinessInputs.GetAllBusinessesInput,
  ): Promise<
    Pick<Business, "name" | "description" | "location" | "links">[]
  > => {
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
    return await businessRepo.getUserBusinessesCount(input, id);
  };
  getTotalBusinessCount = async(
    input: BusinessInputs.GetAllBusinessesInput
  ) => {
    const count = await businessRepo.getBusinessesCount(input)
    return count
  }
  getBusiness = async (
    input: BusinessInputs.GetBusiness,
  ): Promise<Business> => {
    const business = await businessRepo.getBusiness(input);
    if (!business) {
      throw Errors.NotFound("Business not found");
    }
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
    const business = await businessRepo.findBusinessBySlug(input.slug);
    if (!business) {
      throw Errors.NotFound("Business is no longer exist");
    }
    const deletedBusiness = await businessRepo.deleteBusiness(input);
  };
}

export const businessService = new BusinessService();
