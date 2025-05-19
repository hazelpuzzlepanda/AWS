import { Document } from 'mongoose';

export interface IPayment extends Document {
    mobileNumber: string;
    stripeSessionId: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: Date;
};