import { Types } from 'mongoose';
import IVersionSchema from '../versionRepositories/IVersionSchema';
import { Permission, UserType } from '../../utils/constant';

export default interface IUserModel extends IVersionSchema {
  mobileNumber: string;
  registrationDate: string;
  paymentId: Types.ObjectId | null;
  isPaymentSuccessful: boolean;
  isPaymentPending: boolean;
  isPaymentError: boolean;
  teamMemberCount: number;
  hasVoucher: boolean;
  voucherUnlockedAt: string;
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
