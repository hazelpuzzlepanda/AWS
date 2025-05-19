import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserRepository from "../../repositories/user/UserRepositories";
import IConfig from "../../config/IConfig";
import config from "../../config/configuration";
import IUserModel from "../../repositories/user/IUserModel";
import { Permission, UserType } from "../../utils/constant";
import { generateAccessToken, generateRefreshToken } from "../../utils/AuthService";
import sendWhatsAppMessage from "../../libs/twilio-client";
import QuestionRepository from "../../repositories/questions/QuestionRepositories";
import dayjs from "dayjs";

class UserController {
  private userRepository: UserRepository = new UserRepository();
  private questionRepository: QuestionRepository = new QuestionRepository();
  private config: IConfig;
  static instance: UserController;
  constructor(config: IConfig) {
    this.config = config;
  }
  static getInstance = (): UserController => {
    if (!UserController.instance) {
      return (UserController.instance = new UserController(config));
    }
    return UserController.instance;
  };
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { mobileNumber, registrationDate = new Date().toISOString(), teamMemberCount = 5 } = req.body;
      const userPresented = await this.userRepository.get({ mobileNumber }, {}, { sort: { createdAt: -1 }});
      if(userPresented && !userPresented.hasVoucher){
        const { createdAt: lastRegistrationDate } = userPresented;
        const lastDate = new Date(lastRegistrationDate);
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        if(lastDate > oneDayAgo){
           const error = new Error('User can not re-registor in 24 hours') as any;
           error.statusCode = 409;
           throw error;
        }
      }
      const response: IUserModel = await this.userRepository.create({
        mobileNumber,
        registrationDate,
        teamMemberCount,
        userType: UserType.USER,
        permissions: [Permission.CREATE, Permission.READ]
      });
      if (!response._id) {
        const error = new Error('User has not added successfully') as any;
        error.statusCode = 500;
        throw error;
      }
      const question: any = await this.questionRepository.get({ isStart: true });
      if (!question) {
        const error = new Error('No Question found') as any;
        error.statusCode = 404;
        throw error;
      }
      await sendWhatsAppMessage(response?.mobileNumber, question?.clue);
      await this.userRepository.update({ mobileNumber }, { currentSequence: question.sequence });
      return res.status(200).json(response);
    } catch (error) {
      console.error(`Error in user create ${error}`);
      return next(error);
    }
  };

  adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { mobileNumber, password } = req.body;
      const user = await this.userRepository.get({ mobileNumber,  userType: 'admin' });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isMatch = await bcrypt.compare(password, user?.hashedPassword);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Invalid mobile number or password" });
      }
      if (user.userType !== "admin") {
        return res
          .status(403)
          .json({ message: "Access Denied: Only admins can login here" });
      }
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      await this.userRepository.updateById(user._id, {
        refreshToken
      })
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: this.config.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return res.status(200).json({ accessToken });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  adminLogout = async (req: Request, res: Response, next: NextFunction) => {
     try {
      const refreshToken = req.cookies.refreshToken;
      const token = req?.headers?.authorization?.split(" ")[1];
      if (!refreshToken) {
        const error = new Error("No refresh token found") as any;
        error.statusCode = 401;
        throw error;
      }
      const decodeAccessToken = jwt.verify(token!, this.config.JWT_SECRET!) as any;
      const userId = decodeAccessToken?.id;
      const user = await this.userRepository.get({ _id: userId });
      if (!user) {
        const error = new Error("User not found") as any;
        error.statusCode = 404;
        throw error;
      }
      if(user?.refreshToken !== refreshToken){
         const error = new Error("No refresh token found") as any;
         error.statusCode = 400;
         throw error;
      }
      await this.userRepository.updateById(userId, {
        $unset: { refreshToken: "" }
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return res.status(200).json({ success: true, message: "Logged out successfully" });
     } catch (error){
        next(error);
     }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const registrationDate = req.query.registrationDate as string || "";
      const skip = (page - 1) * limit;
      const filter: any = { isPaymentSuccessful: { $eq: true } };
      if(registrationDate) { 
        const requestedDate = new Date(registrationDate);
        const requestedDateUTC = new Date(
          Date.UTC(
            requestedDate.getUTCFullYear(),
            requestedDate.getUTCMonth(),
            requestedDate.getUTCDate()
          )
        ).toISOString();
        filter.registrationDate = { $eq: requestedDateUTC }; 
      }
      const [users, totalCount] = await Promise.all([
        this.userRepository.list(filter, {}, { skip, limit }),
        this.userRepository.countDocuments(filter)
      ]);
      return res.status(200).json({
        total: totalCount,
        page,
        limit,
        users,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  };
  

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        const error = new Error("No refresh token found") as any;
        error.statusCode = 401;
        throw error;
      }
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;
      const user = await this.userRepository.get({ _id: decoded.id });
      if (!user) {
        const error = new Error("User not found") as any;
        error.statusCode = 404;
        throw error;
      }
      if(user?.refreshToken !== refreshToken){
         const error = new Error("No refresh token found") as any;
         error.statusCode = 400;
         throw error;
      }
      const newAccessToken = generateAccessToken(user);
      return res.status(200).json({ accessToken: newAccessToken });
    } catch (error: any) {
      console.error("Refresh token error:", error.message);
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Refresh token expired, please login again" });
      }
      next(error);
    }
  };

  updateUserRegistrationDate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { id } = req.params;
      const { registrationDate } = req.body;
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const updateData: Partial<IUserModel> = {};
      const regDate = new Date(registrationDate);
      const updatedRegistrationDate = new Date(
        Date.UTC(
          regDate.getUTCFullYear(),
          regDate.getUTCMonth(),
          regDate.getUTCDate()
        )
      );
      if (registrationDate)
        updateData.registrationDate = updatedRegistrationDate.toISOString();
      const response = await this.userRepository.updateById(id, updateData);
      if (!response) {
        return res
          .status(404)
          .json({ message: "User not found or not updated" });
      }
      const updatedDate = dayjs(registrationDate).format('DD MMM YYYY');
      const message = `🛠️ Update Notice: Your registration date has been updated by the admin to ${updatedDate}.`;
      if(registrationDate) sendWhatsAppMessage(response.phoneCountryCode, response.mobileNumber, message);
      return res.status(200).json({ message: "User updated successfully", data: response });
    } catch (error) {
      next(error);
    }
  };
  
}

export default UserController.getInstance();
