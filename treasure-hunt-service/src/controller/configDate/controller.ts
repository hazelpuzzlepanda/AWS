import { Request, Response, NextFunction } from "express";
import ConfigDatesRepository from "../../repositories/Config-dates/ConfigDateRepositories";
import IConfig from "../../config/IConfig";
import config from '../../config/configuration';
import IConfigDatesCreate from "../../repositories/Config-dates/IConfigDateCreate";

class ConfigDateController {
  private configDatesRepository: ConfigDatesRepository = new ConfigDatesRepository();
  private config: IConfig;
  static instance: ConfigDateController;
  constructor(config: IConfig) {
    this.config = config;
  }
  static getInstance = () : ConfigDateController => {
    if (!ConfigDateController.instance) {
      return (ConfigDateController.instance = new ConfigDateController(config));
    }
    return ConfigDateController.instance;
  };
  insertDates = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { lockedDate = '', mobileNumber = '' } = req.body;
      if (!mobileNumber || !lockedDate) {
        const error = new Error(
          "Invalid request: mobileNumber and disableDates are required"
        ) as any;
        error.statusCode = 400;
        throw error;
      }
      const updatedDate = new Date(lockedDate);
      const convertedDisableDateToString = new Date(
        Date.UTC(
          updatedDate.getUTCFullYear(),
          updatedDate.getUTCMonth(),
          updatedDate.getUTCDate()
        )
      ).toISOString().split("T")[0];
      const updateResult = await this.configDatesRepository.update(
        { userId: mobileNumber },
        { $addToSet: { lockedDates: convertedDisableDateToString } },
        { upsert: true, new: true }
      );
      return res.status(200).json({ success: true, data: updateResult });
    } catch (error) {
      next(error);
    }
  };
  
  listOfDates = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { mobileNumber, skip = 0, limit = 10 } = req.query;
  
      if (!mobileNumber) {
        const error = new Error("mobileNumber is required") as any;
        error.statusCode = 400;
        throw error;
      }
  
      const parsedSkip = parseInt(skip as string, 10) || 0;
      const parsedLimit = parseInt(limit as string, 10) || 10;
  
      const userConfig = await this.configDatesRepository.get(
        { userId: mobileNumber },
        { _id: 0, userId: 0 }
      );
  
      const allDates = userConfig?.lockedDates || [];
      const paginatedDates = allDates.slice(parsedSkip, parsedSkip + parsedLimit);
  
      const totalCount = allDates.length;
      const totalPages = Math.ceil(totalCount / parsedLimit);
  
      return res.status(200).json({
        lockedDates: paginatedDates,
        count: totalCount,
        totalPages,
        currentPage: Math.floor(parsedSkip / parsedLimit) + 1,
      });
    } catch (error) {
      next(error);
    }
  };

  getPublicLockedDates = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const allConfigs = await this.configDatesRepository.list(
        {},            
        { lockedDates: 1, _id: 0 }
      );
      const allLockedDates = allConfigs?.flatMap((config: IConfigDatesCreate) => config.lockedDates || []);
      const uniqueDates = Array.from(
        new Set(
          allLockedDates?.map((date: string) => {
            const d = new Date(date);
            return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
              .toISOString()
              .split("T")[0];
          })
        )
      );
      return res.status(200).json({ lockedDates: uniqueDates });
    } catch (error) {
      next(error);
    }
  };

  deleteLockedDate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { mobileNumber, date } = req.body;
  
      if (!mobileNumber || !date) {
        const error = new Error("Both mobileNumber and date are required") as any;
        error.statusCode = 400;
        throw error;
      }
      const d = new Date(date);
      const normalizedDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
        .toISOString()
        .split("T")[0];
  
      const result = await this.configDatesRepository.update(
        { userId: mobileNumber },
        { $pull: { lockedDates: normalizedDate } },
        { new: true }
      );
  
      return res.status(200).json({
        success: true,
        message: `Date ${normalizedDate} removed from locked dates`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
  
}

export default ConfigDateController.getInstance();