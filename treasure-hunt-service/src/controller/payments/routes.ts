import { Router } from 'express';
import PaymentController from './controller';
import { validate } from '../../middlewares/validation';
import { createBookingSchema } from './validation';


const paymentHandler= Router();

paymentHandler.post('/checkout', validate(createBookingSchema, 'body'), PaymentController.initiatePayment);
paymentHandler.get('/verify-session', PaymentController.verifyPayment);
export const verifyPaymentWebhook =  PaymentController.webhook;
export default paymentHandler;