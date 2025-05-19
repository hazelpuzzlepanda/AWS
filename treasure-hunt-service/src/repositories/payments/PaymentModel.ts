import * as mongoose from 'mongoose';
import IPaymentModel from './IPaymentModel';
import PaymentSchema from './PaymentSchema';

export const paymentSchema = new PaymentSchema({
    collection: 'payments'
});
paymentSchema.index({ mobileNumber: 1}, { unique: true });
export const paymentModel: mongoose.Model<IPaymentModel> = mongoose.model<IPaymentModel>(
    'payments', paymentSchema, 'Payments');