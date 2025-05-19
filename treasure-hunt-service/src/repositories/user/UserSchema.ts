import { Permission, UserType } from '../../utils/constant';
import VersionSchema from '../versionRepositories/VersionSchema';
import { Types} from 'mongoose';
export default class UserSchema extends VersionSchema {
  constructor(options: any) {
    const userSchema = {
      mobileNumber: { type: String, required: true },
      registrationDate: { type: String, default: new Date() }, // or Date
      paymentId: { type: Types.ObjectId, default: null },
      isPaymentSuccessful: { type: Boolean, default: false },
      isPaymentPending: { type: Boolean, default: false },
      isPaymentError: { type: Boolean, default: false },
      teamMemberCount: { type: Number, default: 0 },
      hasVoucher: { type: Boolean, default: false },
      voucherUnlockedAt: { type: Date, default: null },
      currentSequence: { type: Number, default: -1 },
      currentAttempts: { type: Number, default: 0 },
      isBroadcasted: { type: Boolean, default: false },
      userType: {
        type: String,
        enum: Object.values(UserType),
        default: UserType.USER,
      },
      permissions: {
        type: [String],
        enum: Object.values(Permission),
        default: [Permission.READ],
      },
      hashedPassword: {
        type: String,
        default: null
      },
      fullName: {
        type: String,
        default: null
      },
      refreshToken: {
        type: String,
        default: null
      },
      phoneCountryCode: {
        type: String,
        required: true
      }
    };
    super(userSchema, options);
  }
}