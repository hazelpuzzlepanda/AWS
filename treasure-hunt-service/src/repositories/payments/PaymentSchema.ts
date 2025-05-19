import VersionSchema from "../versionRepositories/VersionSchema";
export default class PaymentSchema extends VersionSchema {
  constructor(options: any) {
    const paymentSchema = {
      mobileNumber: {
        type: String,
        required: true,
        index: true,
      },
      stripeSessionId: {
        type: String,
        required: true,
        unique: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "inr",
      },
      status: {
        type: String,
        default: "pending",
      }
    };
    super(paymentSchema, options);
  }
}
