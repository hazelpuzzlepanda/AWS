import { Router } from 'express';
import UserController from './UserController';
import { authorizeAdminWithPermissions } from '../../middlewares/authorization';
import { Permission } from '../../utils/constant';
import { authenticateUser } from '../../middlewares/authentication';

const userHandler= Router();
// only for debug purpose
userHandler.post('/create', UserController.create);
userHandler.get('/list', authenticateUser, authorizeAdminWithPermissions([Permission.READ]), UserController.list);
userHandler.patch('/update/:id', authenticateUser, authorizeAdminWithPermissions([Permission.UPDATE]), UserController.updateUserRegistrationDate);
userHandler.post('/admin/login', UserController.adminLogin);
userHandler.post('/refresh-token', UserController.refreshToken);
userHandler.post('/admin/logout', authenticateUser, authorizeAdminWithPermissions([Permission.UPDATE]), UserController.adminLogout)


export default userHandler;