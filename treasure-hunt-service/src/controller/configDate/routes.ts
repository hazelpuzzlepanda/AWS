import { Router } from 'express';
import ConfigDateController from './controller';
import { authorizeAdminWithPermissions } from '../../middlewares/authorization';
import { Permission } from '../../utils/constant';
import { authenticateUser } from '../../middlewares/authentication';

const lockDatesHandler= Router();
lockDatesHandler.post('/lock-dates', authenticateUser, authorizeAdminWithPermissions([Permission.UPDATE]), ConfigDateController.insertDates);
lockDatesHandler.get('/list', authenticateUser, authorizeAdminWithPermissions([Permission.READ]), ConfigDateController.listOfDates);
lockDatesHandler.patch('/delete', authenticateUser, authorizeAdminWithPermissions([Permission.DELETE]), ConfigDateController.deleteLockedDate);
lockDatesHandler.get('/public-list', ConfigDateController.getPublicLockedDates);

export default lockDatesHandler;