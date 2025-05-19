import jwt from 'jsonwebtoken';

export const generateAccessToken = (user: any): string => {
  return jwt.sign(
    {
      id: user._id,
      mobileNumber: user.mobileNumber,
      userType: user.userType,
      permissions: user.permissions,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '2m' }
  );
};

export const generateRefreshToken = (user: any): string => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' } // Refresh token expiry
  );
};
