import { Business } from "#generated/prisma/client";
import { Errors } from "#shared/error";
import { businessRepo } from "./business.repository";
import { BusinessInput, BusinessSchema } from "./business.schema";
import slugify from 'slugify'



class BusinessService {
    newBusiness = async (input: BusinessInput): Promise<Business> => {
        const businessExist = await businessRepo.findBusiness(input.name)

        if(businessExist){
            throw Errors.Conflict("A business with a same name already exist")
        }
        input.slug = slugify(input.name,{
            lower: true,
            strict: true
        })
        const newBusiness = await businessRepo.createBusiness(input)
        return newBusiness
    }
    getBusinesses = async (id: string) => {
        const businesses = await businessRepo.getAllBusinesses(id);
        return businesses
    }
}

export const businessService = new BusinessService();