import { Router } from 'express';
import customDashboardHandler from './controller/CustomDashBoard/routes';
import userHandler from './controller/User/routes';
import paymentHandler from './controller/payments/routes';
import lockDatesHandler from './controller/configDate/routes';
const routeHandler = Router();
routeHandler.use('/customdashboard', customDashboardHandler);
routeHandler.use('/user', userHandler);
routeHandler.use('/payment', paymentHandler);
routeHandler.use('/date', lockDatesHandler);

export default routeHandler;