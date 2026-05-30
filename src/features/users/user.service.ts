import { authRepo } from "#features/auth/auth.repository";
import { Business, Profile, User } from "#generated/prisma/client";
import { Errors } from "#shared/error";
import { id } from "zod/locales";
import { userRepo } from "./user.repository";
import { EditProfileInput } from "./user.schema";

class UserServices {
    getProfile = async (id:string):Promise<Profile> => {
        const profile = await userRepo.findProfile(id)
        if (!profile){
            throw Errors.NotFound("User no longer exist")
        }
        return profile
    } 
    
    changeProfile = async (input: EditProfileInput, id: string):Promise<Profile> => {
        const user = await authRepo.findUserById(id);
        if (!user){
            throw Errors.NotFound("User no longer exist")
        }
        const editedProfile = await userRepo.editProfile(input, id)
        return editedProfile
    }
    deleteProfile = async (id:string):Promise<void> => {
        const user = await authRepo.findUserById(id);
        if(!user){
            throw Errors.NotFound("User no longer exist")
        }
        const deletedProfile = await userRepo.deleteProfile(id);
    }
}

export const userServices = new UserServices();