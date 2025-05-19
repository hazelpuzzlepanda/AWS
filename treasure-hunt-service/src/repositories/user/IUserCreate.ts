import { Types } from "mongoose";
import { Permission, UserType } from "../../utils/constant";


export default interface IUserCreate {
    mobileNumber: string;
    registrationDate: string;
    paymentId: Types.ObjectId | null;
    isPaymentSuccessful: boolean;
    isPaymentPending: boolean;
    isPaymentError: boolean;
    teamMemberCount: number;
    hasVoucher: boolean;
    voucherUnlockedAt: Date;
    currentSequence: number;
    currentAttempts: number;
    isBroadcasted: boolean;
    userType: UserType;
    permissions: Permission[];
    hashedPassword: string;
    fullName: string;
    refreshToken: string;
    phoneCountryCode: string;
};