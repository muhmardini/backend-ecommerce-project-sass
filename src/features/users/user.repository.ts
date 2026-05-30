import { Business, Profile, User } from "#generated/prisma/client";
import { prisma } from "#lib/prisma";
import { EditProfileInput } from "./user.schema";

class UserRepo {
  findProfile = async (id: string): Promise<Profile | null> => {
    return await prisma.profile.findUnique({
      where: {
        userId: id
      },
    });
  };
  editProfile = async (
    input: EditProfileInput,
    id: string,
  ): Promise<Profile> => {
    return await prisma.profile.update({
      where: { 
        userId: id
      },
      data: input,
    });
  };
  deleteProfile = async (id: string): Promise<void> => {
    await prisma.$transaction(async (tx) => {
      await tx.profile.delete({
        where: { userId: id },
      });
      await tx.user.delete({
        where: { id: id },
      });
    });
  };

 
}

export const userRepo = new UserRepo();
