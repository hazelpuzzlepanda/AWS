import { Response, NextFunction } from 'express';
export const authorizeAdminWithPermissions = (requiredPermissions: string[] = []) => {
    return (req: any, res: Response, next: NextFunction) => {
      const user = req.user;
      if (!user || user.userType !== 'admin') {
        return res.status(403).json({ message: 'Access Denied: Admins only' });
      }
      if (requiredPermissions.length === 0) {
        return next();
      }
      const hasPermissions = requiredPermissions.every(permission =>
        user.permissions?.includes(permission)
      );
      if (!hasPermissions) {
        return res.status(403).json({ message: 'Access Denied: Missing permissions' });
      }
      next();
    };
  };
  
