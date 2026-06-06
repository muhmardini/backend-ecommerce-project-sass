import { AuthUser } from "#types/express.d";
import { verifyRepo } from "./verify.repository";
import { GetUserRequestsInput, VerificationRequestInput } from "./verify.schema";

class VerifyService {
    verifyRequest = async (input: VerificationRequestInput & AuthUser) => {
        const verificationRequest = await verifyRepo.verifyRequests(input);
        return verificationRequest
    }
    myVerificationRequests = async (input: GetUserRequestsInput & AuthUser) => {
        const requests = await verifyRepo.getMyRequests(input)
        return requests
    }
}

export const verifyService = new VerifyService();